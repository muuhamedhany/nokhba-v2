export interface LocaleDictionary {
  // Navigation
  nav: {
    home: string;
    subjects: string;
    teachers: string;
    lessons: string;
    about: string;
    contact: string;
    parentDashboard: string;
    login: string;
    dashboard: string;
    settings: string;
    logout: string;
    teacherLogin: string;
    studentLogin: string;
    joinAsTeacher: string;
    switchLanguage: string;
  };
  
  // Hero Section
  hero: {
    badge: string;
    headlinePrefix: string;
    headlineSlogan: string;
    subtext: string;
    ctaStudent: string;
    ctaParent: string;
    ctaTeachers: string;
    stats: {
      subjectsCount: string;
      subjectsLabel: string;
      teachersCount: string;
      teachersLabel: string;
      studentsCount: string;
      studentsLabel: string;
      ratingCount: string;
      ratingLabel: string;
    };
  };
  
  // Subject Explorer
  subjectExplorer: {
    title: string;
    subtitle: string;
    viewAllCourses: string;
    allSubjects: string;
  };

  // Teachers Showcase
  teachers: {
    title: string;
    subtitle: string;
    verified: string;
    studentsEnrolled: string;
    coursesCount: string;
    exploreTeacher: string;
    joinCtaTitle: string;
    joinCtaDesc: string;
    joinCtaButton: string;
    viewProfile: string;
    subjectTeacher: string;
    rating: string;
    backToTeachers: string;
    aboutTeacher: string;
    coursesByTeacher: string;
  };
  
  // Platform Ecosystem (Bento Grid)
  ecosystem: {
    title: string;
    subtitle: string;
    studentHub: {
      tag: string;
      title: string;
      desc: string;
    };
    parentPortal: {
      tag: string;
      title: string;
      desc: string;
    };
    teacherStudio: {
      tag: string;
      title: string;
      desc: string;
    };
    instantUnlock: {
      tag: string;
      title: string;
      desc: string;
    };
  };

  // Student Journey
  journey: {
    badge: string;
    title: string;
    steps: Array<{
      id: number;
      title: string;
      description: string;
    }>;
  };
  
  // Subjects & Grades
  subjects: {
    physics: string;
    chemistry: string;
    biology: string;
    math: string;
    arabic: string;
    english: string;
    french: string;
    history: string;
    geography: string;
    philosophy: string;
    general: string;
  };
  grades: {
    sec1: string;
    sec2: string;
    sec3: string;
    prep1: string;
    prep2: string;
    prep3: string;
  };
  
  // Courses Catalog & Details
  courses: {
    latestTitle: string;
    subtitle: string;
    free: string;
    price: string;
    messageToUnlock: string;
    enterCode: string;
    unlock: string;
    sections: string;
    lessons: string;
    quizzes: string;
    progress: string;
    viewAll: string;
    completed: string;
    remaining: string;
    startLesson: string;
    resumeLesson: string;
    viewCourse: string;
    searchPlaceholder: string;
    allFilter: string;
    filterByGrade: string;
    filterBySubject: string;
    noCoursesFound: string;
    courseCurriculum: string;
    enrollNow: string;
    enrolledBadge: string;
    instructor: string;
    gradeLabel: string;
    subjectLabel: string;
    codePrompt: string;
    redeemSuccess: string;
    hoursCount: string;
    totalLectures: string;
  };

  // FAQ
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      q: string;
      a: string;
    }>;
  };

  // About Page
  about: {
    badge: string;
    title: string;
    subtitle: string;
    missionTitle: string;
    missionDesc: string;
    visionTitle: string;
    visionDesc: string;
    valuesTitle: string;
    values: {
      qualityTitle: string;
      qualityDesc: string;
      accessibilityTitle: string;
      accessibilityDesc: string;
      innovationTitle: string;
      innovationDesc: string;
      trustTitle: string;
      trustDesc: string;
    };
    statsTitle: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
  };

  // Contact Page
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendButton: string;
    sending: string;
    sendSuccess: string;
    sendError: string;
    infoTitle: string;
    infoDesc: string;
    whatsappTitle: string;
    whatsappVal: string;
    emailTitle: string;
    emailVal: string;
    phoneTitle: string;
    phoneVal: string;
  };

  // Footer
  footer: {
    brandDesc: string;
    badgeTrust: string;
    pathwaysTitle: string;
    portalsTitle: string;
    supportTitle: string;
    whatsappSupport: string;
    whatsappPhone: string;
    supportEmail: string;
    studentServiceAvailability: string;
    copyright: string;
    terms: string;
    privacy: string;
    adminLink: string;
    pathways: {
      physicsChem: string;
      math: string;
      geoHistory: string;
      arabicLanguages: string;
      biologyGeo: string;
    };
    portals: {
      studentLogin: string;
      parentPortal: string;
      teacherStudio: string;
      coursesLib: string;
      aboutPlatform: string;
    };
  };

  // Auth (Login & Signup)
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    signupTitle: string;
    signupSubtitle: string;
    studentTab: string;
    teacherTab: string;
    parentTab: string;
    roleStudent: string;
    roleTeacher: string;
    roleParent: string;
    phone: string;
    phoneLabel: string;
    phonePlaceholder: string;
    password: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    fullName: string;
    nameLabel: string;
    namePlaceholder: string;
    parentPhone: string;
    parentPhoneLabel: string;
    parentPhonePlaceholder: string;
    grade: string;
    gradeLabel: string;
    selectGrade: string;
    subjectLabel: string;
    selectSubject: string;
    subjectsTeaching: string;
    bio: string;
    loginBtn: string;
    signupBtn: string;
    loggingIn: string;
    signingUp: string;
    noAccount: string;
    haveAccount: string;
    dontHaveAccount: string;
    alreadyHaveAccount: string;
    createAccount: string;
    loginHere: string;
    invalidCreds: string;
    loginSuccess: string;
    signupSuccess: string;
  };

  // Settings
  settings: {
    title: string;
    subtitle: string;
    basicInfo: string;
    personalInfo: string;
    language: string;
    nameLabel: string;
    gradeLabel: string;
    parentPhoneLabel: string;
    parentPhoneHint: string;
    phoneLabel: string;
    roleStudent: string;
    roleTeacher: string;
    saveBtn: string;
    saveChanges: string;
    saving: string;
    saveSuccess: string;
    savedSuccess: string;
    avatarChange: string;
    avatarUploading: string;
    avatarError: string;
    languagePreference: string;
    languagePreferenceDesc: string;
  };

  // Student Dashboard & Learning
  student: {
    myCourses: string;
    myGrades: string;
    redeemCode: string;
    locked: string;
    unlocked: string;
    noCourses: string;
    exploreCourses: string;
    courseProgress: string;
    score: string;
    completedLessons: string;
    totalQuizzes: string;
    activeCourses: string;
    avgScore: string;
    enterCodePlaceholder: string;
    continueLearning: string;
    quizHistory: string;
    enterCodeTitle: string;
    enterCodeDesc: string;
    codeInputPlaceholder: string;
    redeemBtn: string;
    redeeming: string;
    redeemSuccess: string;
    redeemError: string;
    resumeStudying: string;
    viewDetails: string;
    quizResults: string;
    welcomeBack: string;
  };

  // Course Player & Classroom
  coursePlayer: {
    backToDashboard: string;
    backToCourses: string;
    courseCurriculum: string;
    curriculum: string;
    completedBadge: string;
    lockedBadge: string;
    startQuiz: string;
    reviewQuiz: string;
    previousItem: string;
    nextItem: string;
    nextLesson: string;
    currentLesson: string;
    completed: string;
    markComplete: string;
    markCompleted: string;
    completing: string;
    videoNotFound: string;
    lessonNotFound: string;
    attachments: string;
    downloadNotes: string;
    lessonCompletedAlert: string;
  };

  // Quiz Engine
  quiz: {
    quizTitle: string;
    startQuiz: string;
    submitQuiz: string;
    questionTracker: string;
    timeRemaining: string;
    prevQuestion: string;
    nextQuestion: string;
    finishQuiz: string;
    submittingQuiz: string;
    quizResultsTitle: string;
    quizResultsSubtitle: string;
    yourScore: string;
    totalScore: string;
    passedMessage: string;
    failedMessage: string;
    reviewAnswers: string;
    yourAnswer: string;
    correctAnswer: string;
    returnToCourse: string;
    retryQuiz: string;
    questionNumber: string;
    selectAnswerPrompt: string;
  };

  // Teacher Studio & Dashboards
  teacher: {
    snapshot: string;
    manageCourses: string;
    manageCodes: string;
    grading: string;
    totalStudents: string;
    publishedCourses: string;
    activeCodes: string;
    quizSubmissions: string;
    recentSubmissions: string;
    generateCodes: string;
    newCourse: string;
    studentsCount: string;
    coursesCount: string;
    pendingGrading: string;
    activeStudents: string;
    createNewCourse: string;
    addSection: string;
    addLesson: string;
    addQuiz: string;
    editCourse: string;
    deleteCourse: string;
    courseTitleLabel: string;
    courseDescLabel: string;
    coursePriceLabel: string;
    courseSubjectLabel: string;
    courseGradeLabel: string;
    publishCourse: string;
    draftCourse: string;
    codesTitle: string;
    generateCodesBtn: string;
    countCodes: string;
    exportCodes: string;
    codeHeader: string;
    courseHeader: string;
    statusHeader: string;
    studentHeader: string;
    dateHeader: string;
    unusedStatus: string;
    usedStatus: string;
    copyCode: string;
    codeCopied: string;
    submissionsTitle: string;
    filterByCourse: string;
    studentName: string;
    submissionDate: string;
    scoreHeader: string;
    actionsHeader: string;
    gradeSubmission: string;
    welcomeStudio: string;
  };

  // Parent Portal
  parent: {
    portalTitle: string;
    portalSubtitle: string;
    studentOverview: string;
    linkedStudent: string;
    enrolledCourses: string;
    progressRate: string;
    quizReports: string;
    attendanceRate: string;
    quizzesCompleted: string;
    avgScore: string;
    quizAvg: string;
    recentActivity: string;
    progressReport: string;
    whatsappReportNotice: string;
    noLinkedStudent: string;
    phoneLabel: string;
  };

  // Admin Central
  admin: {
    adminTitle: string;
    adminSubtitle: string;
    systemOverview: string;
    totalUsers: string;
    totalCourses: string;
    totalCodes: string;
    totalSubmissions: string;
    usersTab: string;
    coursesTab: string;
    resetTab: string;
    resetWarning: string;
    resetDatabaseBtn: string;
    resetting: string;
    resetSuccess: string;
    searchUsers: string;
    userRole: string;
    actions: string;
    deleteUser: string;
  };

  // General UI, Modals & Alerts
  ui: {
    loading: string;
    error: string;
    retry: string;
    submit: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    close: string;
    search: string;
    filter: string;
    all: string;
    none: string;
    copy: string;
    copied: string;
    whatsapp: string;
    emptyState: string;
    selectOption: string;
    requiredField: string;
    optionalField: string;
    confirmDelete: string;
    areYouSure: string;
    brandName: string;
    brandSlogan: string;
  };
}
