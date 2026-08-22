'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { User, Books } from '@phosphor-icons/react';

export default function TeacherProfile() {
  const params = useParams();
  const id = params.id as string;

  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTeacher() {
      try {
        const res = await fetch(`/api/teachers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTeacher(data.teacher);
        }
      } catch (err) {
        console.error('Error fetching teacher profile:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchTeacher();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center bg-bone">
        <div className="w-12 h-12 rounded-full border-4 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center bg-bone">
        <h1 className="text-2xl font-display font-bold text-forest">المعلم غير موجود</h1>
      </div>
    );
  }

  const teacherCourses = teacher.courses || [];

  return (
    <div className="w-full min-h-screen py-12 bg-bone">
      
      {/* Teacher Header Section */}
      <div className="max-w-5xl mx-auto px-4 mb-16">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 text-center md:text-start">
          
          <div className="w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-[3rem] overflow-hidden bg-black/5 double-bezel rotate-3 shadow-xl">
            <div className="double-bezel-inner w-full h-full flex items-center justify-center overflow-hidden">
              {teacher.avatar ? (
                <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
              ) : (
                <User size={80} className="text-forest/30" weight="duotone" />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6 pt-4">
            <div className="flex flex-col gap-2">
              <h1 className="font-display font-bold text-4xl md:text-5xl text-forest">{teacher.name}</h1>
              <p className="text-gold font-bold text-lg">{teacher.subject || 'معلم عبر منصة إديوفيجن'}</p>
            </div>
            
            <p className="text-forest/80 text-lg leading-relaxed max-w-2xl">
              {teacher.bio || 'لا توجد نبذة تعريفية مضافة لهذا المعلم بعد.'}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-6 mt-2">
              <div className="flex items-center gap-2 text-forest">
                <Books size={24} weight="duotone" className="text-gold" />
                <span className="font-semibold">{teacherCourses.length} كورسات</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Teacher Courses Section */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-3xl text-forest">الكورسات المتاحة</h2>
          </div>
          
          {teacherCourses.length === 0 ? (
            <div className="p-12 text-center text-forest/60 bg-black/5 rounded-[2rem]">
              لا توجد كورسات متاحة حالياً لهذا المعلم.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teacherCourses.map((course: any) => (
                <div key={course.id} className="bg-white rounded-[2rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer">
                  <div className="w-full aspect-[4/3] relative overflow-hidden bg-black/5">
                    <img 
                      src={course.coverImage || 'https://picsum.photos/seed/course/800/600'} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 start-4 flex items-center gap-2">
                      <span className="bg-white/90 backdrop-blur text-forest px-3 py-1 rounded-full text-xs font-bold shadow-sm capitalize">
                        {course.subject}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-xl text-forest line-clamp-2 mb-2 group-hover:text-gold transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-forest/60 text-sm line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
