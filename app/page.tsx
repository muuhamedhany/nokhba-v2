import { Hero } from '@/components/home/Hero';
import { SubjectExplorer } from '@/components/home/SubjectExplorer';
import { TeacherShowcase } from '@/components/home/TeacherShowcase';
import { PlatformEcosystem } from '@/components/home/PlatformEcosystem';
import { CourseList } from '@/components/home/CourseList';
import { StudentJourney } from '@/components/home/StudentJourney';
import { FAQSection } from '@/components/home/FAQSection';

export default function Home() {
  return (
    <main className="overflow-x-hidden w-full max-w-full">
      <Hero />
      <StudentJourney />
      <SubjectExplorer />
      <TeacherShowcase />
      <PlatformEcosystem />
      <CourseList />
      <FAQSection />
    </main>
  );
}
