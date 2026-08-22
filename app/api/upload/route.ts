import { NextRequest, NextResponse } from 'next/server';
import { uploadPhotoToBucket } from '@/lib/storage';
import { getSessionUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'يجب تسجيل الدخول لرفع الصور' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'لم يتم اختيار أي ملف' },
        { status: 400 }
      );
    }

    // Validate MIME type (Images only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'نوع الملف غير مدعوم، يرجى اختيار صورة صالحة (PNG, JPG, WebP)' },
        { status: 400 }
      );
    }

    // Size limit: 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: 'حجم الصورة كبير جداً (الحد الأقصى 10 ميجابايت)' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { url, key } = await uploadPhotoToBucket(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      url,
      key,
      message: 'تم رفع الصورة بنجاح',
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء رفع الصورة' },
      { status: 500 }
    );
  }
}
