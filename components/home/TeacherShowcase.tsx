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
    <section id="teachers" className="w-full bg-[#F2F0EB]  relative border-y border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto ">
        

        {/* Teacher Recruitment Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="my-16 mx-5 bg-forest text-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl"
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
