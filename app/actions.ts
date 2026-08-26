'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function redeemCodeAction(codeString: string) {
  const user = await getSessionUser();
  if (!user || user.role !== 'student') {
    return { success: false, message: 'يرجى تسجيل الدخول كطالب لتفعيل الكود' };
  }

  const code = await prisma.code.findUnique({
    where: { codeString: codeString.trim() },
    include: { course: true }
  });

  if (!code) {
    return { success: false, message: 'هذا الكود غير صحيح' };
  }

  if (code.status === 'used') {
    return { success: false, message: 'تم استخدام هذا الكود من قبل' };
  }

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: user.id,
        courseId: code.courseId,
      }
    }
  });

  if (existingEnrollment) {
    return { success: false, message: 'أنت مشترك بالفعل في هذا الكورس' };
  }

  await prisma.$transaction([
    prisma.code.update({
      where: { id: code.id },
      data: {
        status: 'used',
        assignedStudentId: user.id,
      }
    }),
    prisma.enrollment.create({
      data: {
        studentId: user.id,
        courseId: code.courseId,
        completedItemsJson: '[]',
      }
    })
  ]);

  revalidatePath('/student/dashboard');
  return { success: true, message: `تم تفعيل كورس ${code.course.title} بنجاح` };
}

export async function markItemCompleteAction(courseId: string, itemId: string) {
  const user = await getSessionUser();
  if (!user) return { success: false };

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: user.id,
        courseId,
      }
    }
  });

  let completed: string[] = [];
  if (enrollment) {
    completed = JSON.parse(enrollment.completedItemsJson || '[]');
    if (!completed.includes(itemId)) {
      completed.push(itemId);
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          completedItemsJson: JSON.stringify(completed)
        }
      });
    }
  } else {
    // If not enrolled yet (e.g. Free Course), auto-create the enrollment with completed item
    completed = [itemId];
    await prisma.enrollment.create({
      data: {
        id: `enr_${Date.now()}`,
        studentId: user.id,
        courseId,
        completedItemsJson: JSON.stringify(completed)
      }
    });
  }

  revalidatePath(`/student/course/${courseId}`);
  revalidatePath('/student/dashboard');
  return { success: true, completedItems: completed };
}

export async function submitQuizAction(payload: { id: string; quizId: string; answers: number[]; score: number }) {
  const user = await getSessionUser();
  if (!user) return { success: false, message: 'غير مصرح' };

  await prisma.submission.create({
    data: {
      id: payload.id,
      studentId: user.id,
      quizId: payload.quizId,
      answersJson: JSON.stringify(payload.answers),
      score: payload.score,
    }
  });

  // Automatically mark the quiz item as completed in the student's enrollment
  try {
    const quizItem = await prisma.sectionItem.findUnique({
      where: { id: payload.quizId },
      include: { section: true }
    });

    if (quizItem && quizItem.section) {
      const courseId = quizItem.section.courseId;
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: user.id,
            courseId,
          }
        }
      });

      if (enrollment) {
        const completed: string[] = JSON.parse(enrollment.completedItemsJson || '[]');
        if (!completed.includes(payload.quizId)) {
          completed.push(payload.quizId);
          await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { completedItemsJson: JSON.stringify(completed) }
          });
        }
      } else {
        await prisma.enrollment.create({
          data: {
            id: `enr_${Date.now()}`,
            studentId: user.id,
            courseId,
            completedItemsJson: JSON.stringify([payload.quizId])
          }
        });
      }

      revalidatePath(`/student/course/${courseId}`);
    }
  } catch (err) {
    console.error('Failed to auto-mark quiz as complete in enrollment:', err);
  }

  revalidatePath('/teacher/submissions');
  revalidatePath('/parent/dashboard');
  revalidatePath('/student/dashboard');
  return { success: true };
}

export async function generateCodesAction(courseId: string, count: number) {
  const user = await getSessionUser();
  if (!user || user.role !== 'teacher') return { success: false, message: 'غير مصرح' };

  const newCodesData = Array.from({ length: count }).map((_, i) => ({
    id: `gen_${Date.now()}_${i}`,
    courseId,
    codeString: `GEO-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'unused',
  }));

  await prisma.code.createMany({ data: newCodesData });

  revalidatePath('/teacher/codes');
  return { success: true };
}
