'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { strings } from '@/locales/ar';
import { Button } from '../common/Button';
import { 
  SealCheck, 
  Star, 
  Users, 
  ArrowLeft, 
  ChalkboardTeacher 
} from '@phosphor-icons/react';

interface TeacherItem {
  id: string;
  name: string;
  subject: string;
  subjectCategory: string;
  avatar: string;
  rating: string;
  studentsCount: string;
  coursesCount: number;
  bio: string;
}

const FEATURED_TEACHERS: TeacherItem[] = [
  {
    id: 'u1',
    name: 'أ. أيمن ماضي',
    subject: 'الجغرافيا السياسية والتاريخ',
    subjectCategory: 'أدبي',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    rating: '4.95',
    studentsCount: '14,200+',
    coursesCount: 6,
    bio: 'خبير مادة الجغرافيا السياسية والتاريخ بخبرة تمتد لأكثر من 15 عاماً وتخريج أوائل الجمهورية سنوياً.',
  },
  {
    id: 'u3',
    name: 'د. أحمد خالد',
    subject: 'الفيزياء للثانوية العامة',
    subjectCategory: 'علمي',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    rating: '4.92',
    studentsCount: '18,500+',
    coursesCount: 8,
    bio: 'دكتوراه في الفيزياء التطبيقية، متميز في تبسيط أفكار الكهربية والحديثة واستراتيجيات الحل السريع.',
  },
  {
    id: 'u4',
    name: 'أ. سارة حسن',
    subject: 'الكيمياء والأحياء',
    subjectCategory: 'علمي',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    rating: '4.98',
    studentsCount: '12,800+',
    coursesCount: 5,
    bio: 'كبيرة معلمي الكيمياء، شروحات سينمائية وتجارب معملية تفاعلية تغطي الكيمياء العضوية بدقة متناهية.',
  },
  {
    id: 'u5',
    name: 'أ. هشام كمال',
    subject: 'اللغة العربية والبلاغة',
    subjectCategory: 'مشترك',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    rating: '4.90',
    studentsCount: '16,000+',
    coursesCount: 7,
    bio: 'ماجستير اللغويات العربية، متخصص في تفكيك قطع النصوص المتحررة وضبط مهارات الإعراب والنحو التراكمي.',
  },
];

export function TeacherShowcase() {
  return (
    <section id="teachers" className="w-full bg-[#F2F0EB] py-16 md:py-24 relative border-y border-black/5 overflow-hidden text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold bg-forest/5 text-forest border border-forest/10 mb-3">
              <ChalkboardTeacher size={16} weight="duotone" className="text-gold" />
              <span>نخبة الكوادر التعليمية</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-forest tracking-tight">
              تعلم مع صفوة معلمي الثانوية العامة
            </h2>
            <p className="text-forest/75 text-sm sm:text-base leading-relaxed mt-2">
              نخبة من كبار الأساتذة المعتمدين أصحاب أعلى معدلات تفوق وتخريج أوائل الجمهورية سنوياً.
            </p>
          </div>

          <Link href="/lessons" className="shrink-0">
            <Button variant="ghost" className="px-5 py-2.5 text-xs font-bold text-forest bg-white border border-black/5 hover:border-black/15 shadow-xs" icon={<ArrowLeft size={14} weight="bold" />}>
              استعراض كافة المناهج
            </Button>
          </Link>
        </div>

        {/* Featured Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {FEATURED_TEACHERS.map((teacher, idx) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="double-bezel group hover:shadow-xl transition-shadow duration-300 h-full"
            >
              <div className="double-bezel-inner p-6 flex flex-col justify-between h-full bg-white shadow-xs">
                
                <div className="flex flex-col items-center text-center">
                  {/* Teacher Avatar */}
                  <Link href={`/teachers/${teacher.id}`} className="relative mb-4 block group-hover:scale-105 transition-transform duration-500 cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-forest/5 p-1 ring-2 ring-forest/10 shadow-md overflow-hidden">
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-gold text-forest p-1 rounded-full shadow-md ring-2 ring-white">
                      <SealCheck size={16} weight="fill" />
                    </div>
                  </Link>

                  {/* Badges */}
                  <span className="bg-forest/5 text-forest text-[11px] font-bold px-3 py-0.5 rounded-full mb-2">
                    {teacher.subjectCategory}
                  </span>

                  {/* Name & Subject */}
                  <Link href={`/teachers/${teacher.id}`} className="block group-hover:text-gold transition-colors">
                    <h3 className="font-display font-bold text-lg text-forest mb-1">
                      {teacher.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-gold font-bold mb-3">
                    {teacher.subject}
                  </p>

                  {/* Bio */}
                  <p className="text-xs text-forest/70 line-clamp-3 leading-relaxed mb-4">
                    {teacher.bio}
                  </p>
                </div>

                <div>
                  {/* Stats Strip */}
                  <div className="grid grid-cols-2 gap-2 py-2 px-3 rounded-xl bg-[#F7F6F3] border border-black/5 text-center text-xs mb-4">
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-forest">{teacher.studentsCount}</span>
                      <span className="text-[10px] text-forest/60">طالب مسجل</span>
                    </div>
                    <div className="flex flex-col border-s border-black/5">
                      <span className="font-display font-bold text-forest">{teacher.coursesCount} كورسات</span>
                      <span className="text-[10px] text-forest/60">مناهج دراسية</span>
                    </div>
                  </div>

                  {/* Profile CTA Button */}
                  <Link href={`/teachers/${teacher.id}`} className="block">
                    <Button variant="ghost" className="w-full py-2.5 text-xs font-bold text-forest border border-black/10 hover:border-forest/30 bg-black/5 hover:bg-black/10" icon={<ArrowLeft size={14} weight="bold" />}>
                      عرض ملف الأستاذ
                    </Button>
                  </Link>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Teacher Recruitment Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 bg-forest text-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl"
        >
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-white/10 text-gold mb-3">
              <ChalkboardTeacher size={16} weight="bold" />
              <span>انضمام المعلمين</span>
            </div>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">
              {strings.teachers.joinCtaTitle}
            </h3>
            <p className="text-white/75 text-sm md:text-base leading-relaxed">
              {strings.teachers.joinCtaDesc}
            </p>
          </div>

          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <Link href="/signup?role=teacher" className="block w-full md:w-auto">
              <Button 
                variant="glass"
                className="w-full md:w-auto px-8 py-3.5 font-bold text-sm"
                icon={<ArrowLeft size={16} weight="bold" />}
              >
                {strings.teachers.joinCtaButton}
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
