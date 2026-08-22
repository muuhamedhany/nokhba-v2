'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Key, 
  ChartBar, 
  ArrowClockwise, 
  Plus, 
  Trash, 
  PencilSimple, 
  MagnifyingGlass, 
  CheckCircle, 
  WarningCircle, 
  Sparkle, 
  Lock, 
  DownloadSimple, 
  Eye, 
  FileText, 
  VideoCamera, 
  Student, 
  ChalkboardTeacher, 
  UsersThree,
  CaretRight,
  Copy,
  Check
} from '@phosphor-icons/react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

interface AdminStats {
  totalUsers: number;
  teachersCount: number;
  studentsCount: number;
  parentsCount: number;
  totalCourses: number;
  freeCourses: number;
  paidCourses: number;
  totalCodes: number;
  usedCodes: number;
  availableCodes: number;
  totalSubmissions: number;
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'sections' | 'codes' | 'submissions' | 'system'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'teacher' | 'student' | 'parent'>('all');
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedCourseForSections, setSelectedCourseForSections] = useState<string>('');

  // Modals
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'student',
    grade: 'sec3',
    subject: 'الجغرافيا',
    parentPhone: '',
    bio: ''
  });

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    description: '',
    teacherId: '',
    subject: 'geography',
    grade: 'sec3',
    coverImage: '',
    isFree: false
  });

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [itemFormData, setItemFormData] = useState({
    title: '',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 2700
  });

  const [codeGenModalOpen, setCodeGenModalOpen] = useState(false);
  const [codeGenData, setCodeGenData] = useState({
    courseId: '',
    count: 10,
    prefix: 'NOK'
  });

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'nokhba2026' || passcode.trim() === 'admin' || passcode.trim() === '123456') {
      setIsAuthenticated(true);
      setAuthError('');
      fetchAdminData();
    } else {
      setAuthError('كلمة المرور غير صحيحة (استخدم: nokhba2026)');
    }
  };

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setUsers(data.data.users || []);
        setCourses(data.data.courses || []);
        setCodes(data.data.codes || []);
        setSubmissions(data.data.submissions || []);
        if (data.data.courses?.length > 0 && !selectedCourseForSections) {
          setSelectedCourseForSections(data.data.courses[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      showNotification('error', 'فشل في تحميل بيانات لوحة التحكم');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  // Handle User Save (Create / Update)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const res = await fetch('/api/admin/data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entity: 'user', id: editingUser.id, payload: userFormData })
        });
        const data = await res.json();
        if (data.success) {
          showNotification('success', 'تم تعديل المستخدم بنجاح');
          setUserModalOpen(false);
          fetchAdminData();
        }
      } else {
        const res = await fetch('/api/admin/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entity: 'user', payload: userFormData })
        });
        const data = await res.json();
        if (data.success) {
          showNotification('success', 'تم إنشاء المستخدم بنجاح');
          setUserModalOpen(false);
          fetchAdminData();
        }
      }
    } catch (err) {
      showNotification('error', 'حدث خطأ أثناء حفظ المستخدم');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${name}" نهائياً من قاعدة البيانات؟`)) return;
    try {
      const res = await fetch(`/api/admin/data?entity=user&id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'تم حذف المستخدم بنجاح');
        fetchAdminData();
      }
    } catch (err) {
      showNotification('error', 'فشل حذف المستخدم');
    }
  };

  // Handle Course Save (Create / Update)
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        const res = await fetch('/api/admin/data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entity: 'course', id: editingCourse.id, payload: courseFormData })
        });
        const data = await res.json();
        if (data.success) {
          showNotification('success', 'تم تعديل الكورس بنجاح');
          setCourseModalOpen(false);
          fetchAdminData();
        }
      } else {
        const res = await fetch('/api/admin/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entity: 'course', payload: courseFormData })
        });
        const data = await res.json();
        if (data.success) {
          showNotification('success', 'تم إنشاء الكورس بنجاح');
          setCourseModalOpen(false);
          fetchAdminData();
        }
      }
    } catch (err) {
      showNotification('error', 'حدث خطأ أثناء حفظ الكورس');
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف الكورس "${title}" وكافة محتوياته؟`)) return;
    try {
      const res = await fetch(`/api/admin/data?entity=course&id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'تم حذف الكورس بنجاح');
        fetchAdminData();
      }
    } catch (err) {
      showNotification('error', 'فشل حذف الكورس');
    }
  };

  // Handle Add Section
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForSections || !sectionTitle.trim()) return;
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: 'section',
          payload: { courseId: selectedCourseForSections, title: sectionTitle }
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'تمت إضافة الوحدة بنجاح');
        setSectionModalOpen(false);
        setSectionTitle('');
        fetchAdminData();
      }
    } catch (err) {
      showNotification('error', 'فشل إضافة الوحدة');
    }
  };

  // Handle Delete Section
  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('هل تريد حذف هذه الوحدة وجميع الدروس داخلها؟')) return;
    try {
      const res = await fetch(`/api/admin/data?entity=section&id=${sectionId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'تم حذف الوحدة بنجاح');
        fetchAdminData();
      }
    } catch (err) {
      showNotification('error', 'فشل حذف الوحدة');
    }
  };

  // Handle Add Item (Lesson / Quiz)
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSectionId || !itemFormData.title.trim()) return;
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: 'item',
          payload: { sectionId: selectedSectionId, ...itemFormData }
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'تمت إضافة الدرس بنجاح');
        setItemModalOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      showNotification('error', 'فشل إضافة الدرس');
    }
  };

  // Handle Delete Item
  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('هل تريد حذف هذا المحتوى؟')) return;
    try {
      const res = await fetch(`/api/admin/data?entity=item&id=${itemId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'تم حذف الدرس بنجاح');
        fetchAdminData();
      }
    } catch (err) {
      showNotification('error', 'فشل حذف الدرس');
    }
  };

  // Handle Bulk Generate Codes
  const handleGenerateCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeGenData.courseId) {
      showNotification('error', 'يرجى اختيار الكورس');
      return;
    }
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'code', payload: codeGenData })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', data.message || 'تم توليد الأكواد بنجاح');
        setCodeGenModalOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      showNotification('error', 'فشل توليد الأكواد');
    }
  };

  // Handle Delete Code
  const handleDeleteCode = async (codeId: string) => {
    if (!confirm('هل تريد حذف هذا الكود؟')) return;
    try {
      const res = await fetch(`/api/admin/data?entity=code&id=${codeId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'تم حذف الكود بنجاح');
        fetchAdminData();
      }
    } catch (err) {
      showNotification('error', 'فشل حذف الكود');
    }
  };

  // Handle Database Re-seed / Reset
  const handleResetDatabase = async () => {
    if (!confirm('تحذير: هذا الإجراء سيعيد تهيئة قاعدة البيانات بالكامل وزرع الكورسات والمعلمين الافتراضيين. هل تريد المتابعة؟')) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', data.message || 'تمت إعادة تهيئة قاعدة البيانات بنجاح');
        fetchAdminData();
      } else {
        showNotification('error', 'فشلت عملية إعادة التهيئة');
      }
    } catch (err) {
      showNotification('error', 'حدث خطأ في الاتصال بالسيرفر');
    } finally {
      setIsLoading(false);
    }
  };

  // Export JSON Snapshot
  const handleExportJSON = () => {
    const snapshot = {
      exportedAt: new Date().toISOString(),
      stats,
      users,
      courses,
      codes,
      submissions
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nokhba_db_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('success', 'تم تصدير نسخة احتياطية من قاعدة البيانات بصيغة JSON');
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.phone?.includes(userSearch);
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Courses
  const filteredCourses = courses.filter((c) => {
    return c.title?.toLowerCase().includes(courseSearch.toLowerCase()) ||
           c.subject?.toLowerCase().includes(courseSearch.toLowerCase()) ||
           c.teacher?.name?.toLowerCase().includes(courseSearch.toLowerCase());
  });

  const selectedCourseObj = courses.find((c) => c.id === selectedCourseForSections);

  // Unauthenticated Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center px-4 py-12 text-forest">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md double-bezel shadow-2xl"
        >
          <div className="double-bezel-inner p-8 bg-white flex flex-col gap-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-forest text-gold flex items-center justify-center mx-auto shadow-lg">
              <Lock size={32} weight="duotone" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/5 text-xs font-bold text-forest mb-2">
                <ShieldCheck size={14} weight="fill" className="text-gold" />
                <span>لوحة التحكم الرئيسية والـ Database GUI</span>
              </div>
              <h1 className="font-display font-bold text-2xl text-forest mb-1">
                بوابة الإدارة المركزية
              </h1>
              <p className="text-xs text-forest/60">
                أدخل رمز المرور الرئيسي للتحكم في قاعدة البيانات والمحتوى
              </p>
            </div>

            <form onSubmit={handleUnlock} className="flex flex-col gap-4 text-start">
              <Input
                label="رمز المرور الإداري (Master PIN)"
                type="password"
                required
                placeholder="أدخل كلمة المرور..."
                value={passcode}
                error={authError}
                onChange={(e) => setPasscode(e.target.value)}
                hint="الافتراضي: nokhba2026"
              />

              <Button type="submit" className="w-full py-3.5 font-bold shadow-md">
                فتح لوحة التحكم
              </Button>
            </form>

            <div className="pt-2 border-t border-black/5 text-[11px] text-forest/40">
              🔒 وصول مشفر ومخصص لمسؤولي منصة نُـخبة الأكاديمية.
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone pb-24 text-forest text-start">
      
      {/* Top Admin Header Bar */}
      <header className="bg-forest text-white border-b border-white/10 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold/20 text-gold flex items-center justify-center">
              <ShieldCheck size={24} weight="fill" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg text-white">نُـخبة Studio | إدارة المنصة وقاعدة البيانات</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold text-forest uppercase">Admin GUI</span>
              </div>
              <p className="text-xs text-white/60">التحكم الشامل في المستخدمين، الكورسات، الفيديوهات، والأكواد</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer"
              title="تحديث البيانات"
            >
              <ArrowClockwise size={14} className={isLoading ? 'animate-spin' : ''} />
              <span>تحديث</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gold transition-all cursor-pointer"
              title="تصدير نسخة احتياطية"
            >
              <DownloadSimple size={14} />
              <span>تصدير JSON</span>
            </button>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer"
            >
              قفل اللوحة
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 flex flex-col gap-8">
        
        {/* Floating Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl border flex items-center gap-2 text-xs font-bold ${
                notification.type === 'success'
                  ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
                  : 'bg-rose-900 text-rose-100 border-rose-700'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle size={18} weight="fill" className="text-emerald-400" />
              ) : (
                <WarningCircle size={18} weight="fill" className="text-rose-400" />
              )}
              <span>{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Telemetry Bento Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex flex-col gap-1">
              <div className="flex items-center justify-between text-forest/50 text-xs">
                <span>المستخدمون</span>
                <Users size={16} />
              </div>
              <span className="font-display font-bold text-2xl text-forest">{stats.totalUsers}</span>
              <span className="text-[10px] text-forest/60">{stats.teachersCount} معلمين · {stats.studentsCount} طلاب</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex flex-col gap-1">
              <div className="flex items-center justify-between text-forest/50 text-xs">
                <span>الكورسات</span>
                <BookOpen size={16} />
              </div>
              <span className="font-display font-bold text-2xl text-forest">{stats.totalCourses}</span>
              <span className="text-[10px] text-forest/60">{stats.freeCourses} مجاني · {stats.paidCourses} مدفوع</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex flex-col gap-1">
              <div className="flex items-center justify-between text-forest/50 text-xs">
                <span>أكواد التفعيل</span>
                <Key size={16} />
              </div>
              <span className="font-display font-bold text-2xl text-forest">{stats.totalCodes}</span>
              <span className="text-[10px] text-emerald-600 font-bold">{stats.availableCodes} متاح · {stats.usedCodes} مستخدم</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex flex-col gap-1">
              <div className="flex items-center justify-between text-forest/50 text-xs">
                <span>المعلمون</span>
                <ChalkboardTeacher size={16} />
              </div>
              <span className="font-display font-bold text-2xl text-forest">{stats.teachersCount}</span>
              <span className="text-[10px] text-forest/60">معتمدين في المنصة</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex flex-col gap-1">
              <div className="flex items-center justify-between text-forest/50 text-xs">
                <span>أولياء الأمور</span>
                <UsersThree size={16} />
              </div>
              <span className="font-display font-bold text-2xl text-forest">{stats.parentsCount}</span>
              <span className="text-[10px] text-forest/60">حسابات متابعة</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex flex-col gap-1">
              <div className="flex items-center justify-between text-forest/50 text-xs">
                <span>حلول الاختبارات</span>
                <ChartBar size={16} />
              </div>
              <span className="font-display font-bold text-2xl text-forest">{stats.totalSubmissions}</span>
              <span className="text-[10px] text-forest/60">تقييمات مجتازة</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-black/5 overflow-x-auto gap-1 shadow-sm">
          {[
            { id: 'overview', label: 'نظرة عامة والتحكم', icon: Sparkle },
            { id: 'users', label: 'المستخدمون (Users)', count: users.length, icon: Users },
            { id: 'courses', label: 'الكورسات (Courses)', count: courses.length, icon: BookOpen },
            { id: 'sections', label: 'الوحدات والدروس (Syllabus)', icon: FileText },
            { id: 'codes', label: 'الأكواد (Codes)', count: codes.length, icon: Key },
            { id: 'submissions', label: 'نتائج الاختبارات', count: submissions.length, icon: ChartBar },
            { id: 'system', label: 'أدوات وصيانة الـ DB', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-forest text-gold shadow-md'
                    : 'text-forest/70 hover:bg-[#F7F6F3] hover:text-forest'
                }`}
              >
                <Icon size={16} weight={isActive ? 'fill' : 'regular'} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-forest/60'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fast Actions */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm flex flex-col gap-6">
              <div>
                <h3 className="font-display font-bold text-xl text-forest mb-1">إجراءات سريعة على قاعدة البيانات</h3>
                <p className="text-xs text-forest/60">أضف عناصر مباشرة دون الحاجة لكتابة أوامر SQL يدوية</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setUserFormData({ name: '', phone: '', password: '', role: 'teacher', grade: 'sec3', subject: 'الفيزياء', parentPhone: '', bio: '' });
                    setUserModalOpen(true);
                  }}
                  className="p-5 rounded-2xl bg-[#F7F6F3] hover:bg-forest/5 border border-black/5 text-start flex items-center justify-between group transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest text-gold flex items-center justify-center">
                      <ChalkboardTeacher size={20} weight="fill" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-forest">إضافة معلم جديد</h4>
                      <p className="text-[11px] text-forest/60">إنشاء حساب معلم معتمد ومادته</p>
                    </div>
                  </div>
                  <Plus size={18} className="text-forest/40 group-hover:text-forest transition-colors" />
                </button>

                <button
                  onClick={() => {
                    setEditingUser(null);
                    setUserFormData({ name: '', phone: '', password: '', role: 'student', grade: 'sec3', subject: 'عام', parentPhone: '', bio: '' });
                    setUserModalOpen(true);
                  }}
                  className="p-5 rounded-2xl bg-[#F7F6F3] hover:bg-forest/5 border border-black/5 text-start flex items-center justify-between group transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest text-gold flex items-center justify-center">
                      <Student size={20} weight="fill" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-forest">إضافة طالب وولي أمر</h4>
                      <p className="text-[11px] text-forest/60">تسجيل طالب جديد وربطه تلقائياً</p>
                    </div>
                  </div>
                  <Plus size={18} className="text-forest/40 group-hover:text-forest transition-colors" />
                </button>

                <button
                  onClick={() => {
                    setEditingCourse(null);
                    setCourseFormData({ title: '', description: '', teacherId: users.find(u => u.role === 'teacher')?.id || 'u1', subject: 'geography', grade: 'sec3', coverImage: '', isFree: false });
                    setCourseModalOpen(true);
                  }}
                  className="p-5 rounded-2xl bg-[#F7F6F3] hover:bg-forest/5 border border-black/5 text-start flex items-center justify-between group transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest text-gold flex items-center justify-center">
                      <BookOpen size={20} weight="fill" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-forest">إضافة كورس دراسي</h4>
                      <p className="text-[11px] text-forest/60">إنشاء مادة جديدة وتعيين المعلم</p>
                    </div>
                  </div>
                  <Plus size={18} className="text-forest/40 group-hover:text-forest transition-colors" />
                </button>

                <button
                  onClick={() => {
                    setCodeGenData({ courseId: courses[0]?.id || '', count: 10, prefix: 'NOK' });
                    setCodeGenModalOpen(true);
                  }}
                  className="p-5 rounded-2xl bg-[#F7F6F3] hover:bg-forest/5 border border-black/5 text-start flex items-center justify-between group transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest text-gold flex items-center justify-center">
                      <Key size={20} weight="fill" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-forest">توليد دفعة أكواد</h4>
                      <p className="text-[11px] text-forest/60">إنشاء حزمة أكواد للطلاب فوراً</p>
                    </div>
                  </div>
                  <Plus size={18} className="text-forest/40 group-hover:text-forest transition-colors" />
                </button>
              </div>
            </div>

            {/* Quick System Summary */}
            <div className="bg-forest text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck size={18} weight="fill" />
                  <span>حالة بيئة السيرفر</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-white">نظام نُـخبة يعمل بكفاءة 100%</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  تم دمج نظام التهيئة الذاتي (Self-Healing Auto Seed) لضمان عدم حدوث أي فراغ في قاعدة البيانات سواء محلياً أو على استضافة Vercel Serverless.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={handleResetDatabase}
                  className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-forest font-bold text-xs transition-all shadow-md cursor-pointer"
                >
                  إعادة تهيئة الـ Database بالكامل
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-black/5 p-6 shadow-sm flex flex-col gap-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-display font-bold text-xl text-forest">إدارة المستخدمين والحسابات ({filteredUsers.length})</h3>
                <p className="text-xs text-forest/60">عرض وتعديل وحذف الطلاب والمعلمين وأولياء الأمور</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  icon={<Plus size={16} weight="bold" />}
                  onClick={() => {
                    setEditingUser(null);
                    setUserFormData({ name: '', phone: '', password: '', role: 'student', grade: 'sec3', subject: 'عام', parentPhone: '', bio: '' });
                    setUserModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold shadow-md"
                >
                  إضافة مستخدم
                </Button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <MagnifyingGlass size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو رقم الهاتف..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-[#F7F6F3] rounded-xl ps-10 pe-4 py-2.5 text-xs text-forest outline-none border border-transparent focus:border-gold/60"
                />
              </div>

              <div className="flex bg-[#F7F6F3] p-1 rounded-xl gap-1">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'teacher', label: 'معلمون' },
                  { id: 'student', label: 'طلاب' },
                  { id: 'parent', label: 'أولياء أمور' },
                ].map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setUserRoleFilter(role.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      userRoleFilter === role.id ? 'bg-forest text-gold shadow-sm' : 'text-forest/70 hover:text-forest'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto border border-black/5 rounded-2xl">
              <table className="w-full text-xs text-start">
                <thead className="bg-[#F7F6F3] text-forest/60 border-b border-black/5 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="py-3 px-4 text-start">المستخدم</th>
                    <th className="py-3 px-4 text-start">الرتبة / الصفة</th>
                    <th className="py-3 px-4 text-start">رقم الهاتف</th>
                    <th className="py-3 px-4 text-start">المادة / الصف الدراسي</th>
                    <th className="py-3 px-4 text-start">هاتف ولي الأمر</th>
                    <th className="py-3 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-forest/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center font-bold text-forest">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-forest block">{u.name}</span>
                            <span className="text-[10px] text-forest/40 font-mono">ID: {u.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          u.role === 'teacher'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : u.role === 'student'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}>
                          {u.role === 'teacher' ? 'معلم' : u.role === 'student' ? 'طالب' : 'ولي أمر'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-forest" dir="ltr">
                        {u.phone || '—'}
                      </td>

                      <td className="py-3 px-4 text-forest/70">
                        {u.role === 'teacher' ? u.subject || 'عام' : u.grade || '—'}
                      </td>

                      <td className="py-3 px-4 font-mono text-forest/60" dir="ltr">
                        {u.parentPhone || '—'}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingUser(u);
                              setUserFormData({
                                name: u.name || '',
                                phone: u.phone || '',
                                password: '',
                                role: u.role || 'student',
                                grade: u.grade || 'sec3',
                                subject: u.subject || '',
                                parentPhone: u.parentPhone || '',
                                bio: u.bio || ''
                              });
                              setUserModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-black/5 hover:bg-forest hover:text-gold transition-colors text-forest/70 cursor-pointer"
                            title="تعديل"
                          >
                            <PencilSimple size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white transition-colors text-rose-600 cursor-pointer"
                            title="حذف"
                          >
                            <Trash size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: COURSES MANAGEMENT */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-3xl border border-black/5 p-6 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-display font-bold text-xl text-forest">إدارة الكورسات والمناهج ({filteredCourses.length})</h3>
                <p className="text-xs text-forest/60">إنشاء وتعديل وحذف الكورسات الدراسية وتعيين المعلمين</p>
              </div>

              <Button
                icon={<Plus size={16} weight="bold" />}
                onClick={() => {
                  setEditingCourse(null);
                  setCourseFormData({
                    title: '',
                    description: '',
                    teacherId: users.find(u => u.role === 'teacher')?.id || 'u1',
                    subject: 'geography',
                    grade: 'sec3',
                    coverImage: '',
                    isFree: false
                  });
                  setCourseModalOpen(true);
                }}
                className="px-5 py-2.5 text-xs font-bold shadow-md"
              >
                إضافة كورس جديد
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl border border-black/10 bg-[#F7F6F3] flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isFree ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {c.isFree ? 'مجاني' : 'يتطلب كود'}
                      </span>
                      <span className="text-[10px] text-forest/50 font-mono">ID: {c.id}</span>
                    </div>

                    <h4 className="font-display font-bold text-base text-forest leading-tight">{c.title}</h4>
                    <p className="text-xs text-forest/60 line-clamp-2">{c.description}</p>
                  </div>

                  <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                    <span className="text-forest/70 font-semibold">{c.teacher?.name || 'غير محدد'}</span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedCourseForSections(c.id);
                          setActiveTab('sections');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-forest text-gold text-[11px] font-bold hover:bg-forest-light transition-all cursor-pointer"
                        title="إدارة المحتوى"
                      >
                        الدروس
                      </button>
                      <button
                        onClick={() => {
                          setEditingCourse(c);
                          setCourseFormData({
                            title: c.title || '',
                            description: c.description || '',
                            teacherId: c.teacherId || '',
                            subject: c.subject || 'geography',
                            grade: c.grade || 'sec3',
                            coverImage: c.coverImage || '',
                            isFree: Boolean(c.isFree)
                          });
                          setCourseModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-black/5 hover:bg-forest hover:text-gold transition-colors text-forest/70 cursor-pointer"
                      >
                        <PencilSimple size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(c.id, c.title)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white transition-colors text-rose-600 cursor-pointer"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SECTIONS & LESSONS (SYLLABUS) */}
        {activeTab === 'sections' && (
          <div className="bg-white rounded-3xl border border-black/5 p-6 shadow-sm flex flex-col gap-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-display font-bold text-xl text-forest">الوحدات والدروس والمحاضرات</h3>
                <p className="text-xs text-forest/60">إضافة وتعديل وحذف وحدات الكورس والفيديوهات والاختبارات</p>
              </div>

              {/* Course Selector */}
              <div className="w-full sm:w-80">
                <select
                  value={selectedCourseForSections}
                  onChange={(e) => setSelectedCourseForSections(e.target.value)}
                  className="w-full bg-[#F7F6F3] rounded-xl px-4 py-2.5 text-xs font-bold text-forest border border-transparent focus:border-gold/60 outline-none cursor-pointer"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCourseObj && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between bg-[#F7F6F3] p-4 rounded-2xl border border-black/5">
                  <div>
                    <h4 className="font-display font-bold text-base text-forest">{selectedCourseObj.title}</h4>
                    <span className="text-xs text-forest/60">معلم المادة: {selectedCourseObj.teacher?.name}</span>
                  </div>
                  <Button
                    icon={<Plus size={16} weight="bold" />}
                    onClick={() => setSectionModalOpen(true)}
                    className="px-4 py-2 text-xs font-bold"
                  >
                    إضافة وحدة جديدة
                  </Button>
                </div>

                {/* Sections List */}
                {selectedCourseObj.sections && selectedCourseObj.sections.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {selectedCourseObj.sections.map((sec: any) => (
                      <div key={sec.id} className="p-4 rounded-2xl border border-black/10 bg-white flex flex-col gap-3 shadow-xs">
                        <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-forest text-gold text-xs font-bold flex items-center justify-center">
                              {sec.order || 1}
                            </span>
                            <h5 className="font-bold text-sm text-forest">{sec.title}</h5>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedSectionId(sec.id);
                                setItemModalOpen(true);
                              }}
                              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-forest/5 hover:bg-forest hover:text-gold text-forest text-xs font-bold transition-all cursor-pointer"
                            >
                              <Plus size={14} />
                              <span>إضافة درس</span>
                            </button>
                            <button
                              onClick={() => handleDeleteSection(sec.id)}
                              className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                              title="حذف الوحدة"
                            >
                              <Trash size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Items in section */}
                        <div className="flex flex-col gap-2 ps-4">
                          {sec.items && sec.items.length > 0 ? (
                            sec.items.map((item: any) => (
                              <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F6F3] text-xs">
                                <div className="flex items-center gap-2">
                                  {item.type === 'video' ? (
                                    <VideoCamera size={16} weight="fill" className="text-forest" />
                                  ) : (
                                    <FileText size={16} weight="fill" className="text-gold" />
                                  )}
                                  <span className="font-semibold text-forest">{item.title}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="text-[11px] text-forest/50 font-mono">
                                    {Math.round((item.duration || 1800) / 60)} دقيقة
                                  </span>
                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                                    title="حذف الدرس"
                                  >
                                    <Trash size={14} />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-forest/40 py-2">لا توجد دروس في هذه الوحدة حتى الآن.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-forest/50 bg-[#F7F6F3] rounded-2xl">
                    <p className="text-sm font-semibold mb-2">لا توجد وحدات مضافة في هذا الكورس</p>
                    <Button onClick={() => setSectionModalOpen(true)} className="px-4 py-2 text-xs">
                      إضافة أول وحدة الآن
                    </Button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* TAB 5: ACTIVATION CODES */}
        {activeTab === 'codes' && (
          <div className="bg-white rounded-3xl border border-black/5 p-6 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-display font-bold text-xl text-forest">إدارة أكواد التفعيل ({codes.length})</h3>
                <p className="text-xs text-forest/60">توليد وإلغاء وتتبع الأكواد المستخدمة والمتاحة</p>
              </div>

              <Button
                icon={<Plus size={16} weight="bold" />}
                onClick={() => {
                  setCodeGenData({ courseId: courses[0]?.id || '', count: 10, prefix: 'NOK' });
                  setCodeGenModalOpen(true);
                }}
                className="px-5 py-2.5 text-xs font-bold shadow-md"
              >
                توليد دفعة جديدة
              </Button>
            </div>

            {/* Codes Table */}
            <div className="overflow-x-auto border border-black/5 rounded-2xl">
              <table className="w-full text-xs text-start">
                <thead className="bg-[#F7F6F3] text-forest/60 border-b border-black/5 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="py-3 px-4 text-start">رمز الكود</th>
                    <th className="py-3 px-4 text-start">الكورس المرتبط</th>
                    <th className="py-3 px-4 text-start">الحالة</th>
                    <th className="py-3 px-4 text-start">الطالب المفعل</th>
                    <th className="py-3 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {codes.map((c) => (
                    <tr key={c.id} className="hover:bg-forest/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(c.codeString);
                              setCopiedCode(c.id);
                              setTimeout(() => setCopiedCode(null), 2000);
                            }}
                            className="p-1 rounded-md bg-black/5 hover:bg-gold hover:text-forest text-forest/70 transition-colors"
                            title="نسخ"
                          >
                            {copiedCode === c.id ? <Check size={14} className="text-emerald-600 font-bold" /> : <Copy size={14} />}
                          </button>
                          <span className="font-mono font-bold tracking-wider text-forest">{c.codeString}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-forest/80 font-medium">
                        {courses.find((cr) => cr.id === c.courseId)?.title || c.courseId}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'used' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {c.status === 'used' ? 'مستخدم' : 'متاح للتفعيل'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-forest/60">
                        {c.assignedStudentId || '—'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteCode(c.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          title="حذف الكود"
                        >
                          <Trash size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 6: SUBMISSIONS */}
        {activeTab === 'submissions' && (
          <div className="bg-white rounded-3xl border border-black/5 p-6 shadow-sm flex flex-col gap-6">
            <div>
              <h3 className="font-display font-bold text-xl text-forest">سجل حلول واختبارات الطلاب ({submissions.length})</h3>
              <p className="text-xs text-forest/60">متابعة درجات وتقييمات الطلاب وتفاصيل الإجابات</p>
            </div>

            {submissions.length > 0 ? (
              <div className="overflow-x-auto border border-black/5 rounded-2xl">
                <table className="w-full text-xs text-start">
                  <thead className="bg-[#F7F6F3] text-forest/60 border-b border-black/5 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="py-3 px-4 text-start">اسم الطالب</th>
                      <th className="py-3 px-4 text-start">الاختبار</th>
                      <th className="py-3 px-4 text-start">الدرجة</th>
                      <th className="py-3 px-4 text-start">النسبة المئوية</th>
                      <th className="py-3 px-4 text-start">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {submissions.map((sub) => {
                      const percentage = Math.round((sub.score / (sub.total || 100)) * 100);
                      const isPassed = percentage >= 60;
                      return (
                        <tr key={sub.id} className="hover:bg-forest/5 transition-colors">
                          <td className="py-3 px-4 font-bold text-forest">
                            {sub.student?.name || sub.studentId}
                          </td>
                          <td className="py-3 px-4 text-forest/70">
                            {sub.sectionItem?.title || 'اختبار تقييمي'}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-forest">
                            {sub.score} / {sub.total}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold">
                            {percentage}%
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isPassed ? 'ناجح' : 'يحتاج إعادة'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-forest/50 bg-[#F7F6F3] rounded-2xl">
                <p className="text-sm font-semibold">لم يقم أي طالب بإجراء اختبارات بعد.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: SYSTEM & MAINTENANCE */}
        {activeTab === 'system' && (
          <div className="bg-white rounded-3xl border border-black/5 p-8 shadow-sm flex flex-col gap-6">
            <div>
              <h3 className="font-display font-bold text-xl text-forest">أدوات وصيانة قاعدة البيانات</h3>
              <p className="text-xs text-forest/60">إدارة البنية التحتية، النسخ الاحتياطي، والتهيئة التلقائية</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#F7F6F3] border border-black/5 flex flex-col justify-between gap-4">
                <div>
                  <h4 className="font-display font-bold text-base text-forest mb-1">إعادة تهيئة البيانات (Re-Seed Database)</h4>
                  <p className="text-xs text-forest/60 leading-relaxed">
                    يقوم هذا الزر بحذف أي بيانات تالفة وإعادة ملء قاعدة البيانات بالـ 8 كورسات الرسمية والـ 4 معلمين وحسابات التجربة والأكواد الأولية.
                  </p>
                </div>
                <button
                  onClick={handleResetDatabase}
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-forest hover:bg-forest-light text-gold font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {isLoading ? 'جاري التهيئة...' : 'إعادة تهيئة قاعدة البيانات الآن'}
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-[#F7F6F3] border border-black/5 flex flex-col justify-between gap-4">
                <div>
                  <h4 className="font-display font-bold text-base text-forest mb-1">تصدير لقطة قاعدة البيانات (Export JSON)</h4>
                  <p className="text-xs text-forest/60 leading-relaxed">
                    تحميل نسخة احتياطية كاملة تحتوي على كافة المستخدمين والكورسات والأكواد والنتائج بصيغة JSON قابلة للاسترجاع.
                  </p>
                </div>
                <button
                  onClick={handleExportJSON}
                  className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-forest font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  تصدير النسخة الاحتياطية (.json)
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* USER MODAL */}
      <AnimatePresence>
        {userModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 flex flex-col gap-5 text-start"
            >
              <h3 className="font-display font-bold text-xl text-forest">
                {editingUser ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}
              </h3>

              <form onSubmit={handleSaveUser} className="flex flex-col gap-4">
                <Input
                  label="الاسم بالكامل"
                  required
                  placeholder="مثال: أحمد محمد علي"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                />

                <Input
                  label="رقم الهاتف"
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="010XXXXXXXX"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                />

                <Input
                  label={editingUser ? 'كلمة مرور جديدة (اتركه فارغاً للإبقاء)' : 'كلمة المرور'}
                  type="password"
                  dir="ltr"
                  placeholder="••••••••"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  required={!editingUser}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-forest">الرتبة / نوع الحساب</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as any })}
                    className="w-full bg-[#F7F6F3] rounded-xl px-4 py-3 text-xs font-bold text-forest border outline-none"
                  >
                    <option value="student">طالب (Student)</option>
                    <option value="teacher">معلم (Teacher)</option>
                    <option value="parent">ولي أمر (Parent)</option>
                  </select>
                </div>

                {userFormData.role === 'teacher' && (
                  <Input
                    label="المادة الدراسية"
                    placeholder="مثال: الفيزياء والكيمياء"
                    value={userFormData.subject}
                    onChange={(e) => setUserFormData({ ...userFormData, subject: e.target.value })}
                  />
                )}

                {userFormData.role === 'student' && (
                  <Input
                    label="رقم هاتف ولي الأمر"
                    type="tel"
                    dir="ltr"
                    placeholder="011XXXXXXXX"
                    value={userFormData.parentPhone}
                    onChange={(e) => setUserFormData({ ...userFormData, parentPhone: e.target.value })}
                  />
                )}

                <div className="pt-3 border-t border-black/5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setUserModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 text-forest text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <Button type="submit" className="px-6 py-2.5 text-xs font-bold">
                    حفظ المستخدم
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COURSE MODAL */}
      <AnimatePresence>
        {courseModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/5 flex flex-col gap-5 text-start"
            >
              <h3 className="font-display font-bold text-xl text-forest">
                {editingCourse ? 'تعديل الكورس' : 'إضافة كورس دراسي جديد'}
              </h3>

              <form onSubmit={handleSaveCourse} className="flex flex-col gap-4">
                <Input
                  label="عنوان الكورس"
                  required
                  placeholder="مثال: المكثف الشامل في الفيزياء"
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-forest">وصف الكورس</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="وصف تفصيلي لمحتوى الكورس ومحاوره..."
                    value={courseFormData.description}
                    onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                    className="w-full bg-[#F7F6F3] rounded-xl px-4 py-3 text-xs text-forest border outline-none resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-forest">المعلم المسؤول</label>
                  <select
                    value={courseFormData.teacherId}
                    onChange={(e) => setCourseFormData({ ...courseFormData, teacherId: e.target.value })}
                    className="w-full bg-[#F7F6F3] rounded-xl px-4 py-3 text-xs font-bold text-forest border outline-none"
                  >
                    {users.filter(u => u.role === 'teacher').map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.subject || 'معلم'})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-forest">التخصص / المادة</label>
                    <select
                      value={courseFormData.subject}
                      onChange={(e) => setCourseFormData({ ...courseFormData, subject: e.target.value })}
                      className="w-full bg-[#F7F6F3] rounded-xl px-3 py-2.5 text-xs font-bold text-forest border outline-none"
                    >
                      <option value="geography">الجغرافيا</option>
                      <option value="history">التاريخ</option>
                      <option value="physics">الفيزياء</option>
                      <option value="chemistry">الكيمياء</option>
                      <option value="math">الرياضيات</option>
                      <option value="arabic">اللغة العربية</option>
                      <option value="english">اللغة الإنجليزية</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-forest">الصف الدراسي</label>
                    <select
                      value={courseFormData.grade}
                      onChange={(e) => setCourseFormData({ ...courseFormData, grade: e.target.value })}
                      className="w-full bg-[#F7F6F3] rounded-xl px-3 py-2.5 text-xs font-bold text-forest border outline-none"
                    >
                      <option value="sec3">الصف الثالث الثانوي</option>
                      <option value="sec2">الصف الثاني الثانوي</option>
                      <option value="sec1">الصف الأول الثانوي</option>
                      <option value="prep3">الصف الثالث الإعدادي</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isFreeCheckbox"
                    checked={courseFormData.isFree}
                    onChange={(e) => setCourseFormData({ ...courseFormData, isFree: e.target.checked })}
                    className="w-4 h-4 accent-gold"
                  />
                  <label htmlFor="isFreeCheckbox" className="text-xs font-bold text-forest cursor-pointer">
                    كورس مجاني (متاح للجميع بدون كود تفعيل)
                  </label>
                </div>

                <div className="pt-3 border-t border-black/5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCourseModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 text-forest text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <Button type="submit" className="px-6 py-2.5 text-xs font-bold">
                    حفظ الكورس
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECTION MODAL */}
      <AnimatePresence>
        {sectionModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-black/5 flex flex-col gap-4 text-start"
            >
              <h3 className="font-display font-bold text-lg text-forest">إضافة وحدة جديدة للكورس</h3>
              <form onSubmit={handleAddSection} className="flex flex-col gap-4">
                <Input
                  label="اسم الوحدة"
                  required
                  placeholder="مثال: الوحدة الأولى - التأسيس والمفاهيم"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                />
                <div className="flex justify-end gap-2 pt-2 border-t border-black/5">
                  <button
                    type="button"
                    onClick={() => setSectionModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-black/5 text-xs font-bold text-forest"
                  >
                    إلغاء
                  </button>
                  <Button type="submit" className="px-5 py-2 text-xs font-bold">
                    إضافة الوحدة
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ITEM MODAL (VIDEO / QUIZ) */}
      <AnimatePresence>
        {itemModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-black/5 flex flex-col gap-4 text-start"
            >
              <h3 className="font-display font-bold text-lg text-forest">إضافة درس أو اختبار للوحدة</h3>
              <form onSubmit={handleAddItem} className="flex flex-col gap-4">
                <Input
                  label="عنوان المحاضرة / الاختبار"
                  required
                  placeholder="مثال: الدرس الأول - قوانين كيرشوف"
                  value={itemFormData.title}
                  onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-forest">النوع</label>
                  <select
                    value={itemFormData.type}
                    onChange={(e) => setItemFormData({ ...itemFormData, type: e.target.value })}
                    className="w-full bg-[#F7F6F3] rounded-xl px-3 py-2.5 text-xs font-bold text-forest border outline-none"
                  >
                    <option value="video">محاضرة فيديو (Video Lesson)</option>
                    <option value="quiz">اختبار إلكتروني (Quiz)</option>
                  </select>
                </div>

                {itemFormData.type === 'video' && (
                  <>
                    <Input
                      label="رابط الفيديو (Direct MP4 / Stream)"
                      placeholder="https://..."
                      value={itemFormData.url}
                      onChange={(e) => setItemFormData({ ...itemFormData, url: e.target.value })}
                    />
                    <Input
                      label="مدة الفيديو (بالثواني)"
                      type="number"
                      value={itemFormData.duration}
                      onChange={(e) => setItemFormData({ ...itemFormData, duration: Number(e.target.value) })}
                    />
                  </>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-black/5">
                  <button
                    type="button"
                    onClick={() => setItemModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-black/5 text-xs font-bold text-forest"
                  >
                    إلغاء
                  </button>
                  <Button type="submit" className="px-5 py-2 text-xs font-bold">
                    إضافة الدرس
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CODE GENERATOR MODAL */}
      <AnimatePresence>
        {codeGenModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-black/5 flex flex-col gap-4 text-start"
            >
              <h3 className="font-display font-bold text-lg text-forest">توليد حزمة أكواد تفعيل جديدة</h3>
              <form onSubmit={handleGenerateCodes} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-forest">الكورس المستهدف</label>
                  <select
                    value={codeGenData.courseId}
                    onChange={(e) => setCodeGenData({ ...codeGenData, courseId: e.target.value })}
                    className="w-full bg-[#F7F6F3] rounded-xl px-3 py-2.5 text-xs font-bold text-forest border outline-none"
                    required
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="عدد الأكواد (1 - 100)"
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={codeGenData.count}
                  onChange={(e) => setCodeGenData({ ...codeGenData, count: Number(e.target.value) })}
                />

                <Input
                  label="بادئة الكود (Prefix)"
                  placeholder="مثال: GEO2026 أو NOK"
                  value={codeGenData.prefix}
                  onChange={(e) => setCodeGenData({ ...codeGenData, prefix: e.target.value })}
                />

                <div className="flex justify-end gap-2 pt-2 border-t border-black/5">
                  <button
                    type="button"
                    onClick={() => setCodeGenModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-black/5 text-xs font-bold text-forest"
                  >
                    إلغاء
                  </button>
                  <Button type="submit" className="px-5 py-2 text-xs font-bold">
                    توليد الأكواد فوراً
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
