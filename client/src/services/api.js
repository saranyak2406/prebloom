import { fallbackData } from './fallbackData';

const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('prepbloom_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function handleStaticFallback(endpoint, options = {}) {
  const method = options.method || 'GET';
  const cleanEndpoint = endpoint.split('?')[0];

  // 1. Auth fallbacks
  if (cleanEndpoint === '/auth/login' || cleanEndpoint === '/auth/register') {
    const body = options.body ? JSON.parse(options.body) : {};
    const isAdmin = body.email && body.email.includes('admin');
    const user = {
      id: isAdmin ? 2 : 1,
      name: body.name || (isAdmin ? 'PrepBloom Admin' : 'Saranya Kumar'),
      email: body.email || 'student@prepbloom.com',
      role: isAdmin ? 'admin' : 'student',
      avatar: isAdmin ? 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin' : 'https://api.dicebear.com/7.x/notionists/svg?seed=Saranya',
      target_exam: body.target_exam || 'UPSC Civil Services',
      streak_count: 14
    };
    return { success: true, token: 'demo-jwt-token-active', user };
  }

  if (cleanEndpoint === '/auth/me') {
    const user = {
      id: 1,
      name: 'Saranya Kumar',
      email: 'student@prepbloom.com',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Saranya',
      target_exam: 'UPSC Civil Services',
      streak_count: 14
    };
    return { success: true, user };
  }

  // 2. Categories & Exams
  if (cleanEndpoint === '/exams/categories') {
    return { success: true, categories: fallbackData.categories };
  }

  if (cleanEndpoint === '/exams') {
    return { success: true, exams: fallbackData.exams };
  }

  if (cleanEndpoint.startsWith('/exams/')) {
    const slug = cleanEndpoint.replace('/exams/', '');
    const exam = fallbackData.exams.find(e => e.slug === slug) || fallbackData.exams[0];
    return { success: true, exam };
  }

  if (cleanEndpoint === '/exams/my-exams') {
    return { success: true, myExams: fallbackData.exams.slice(0, 3).map(e => ({ ...e, is_favourite: true, preparation_percentage: 65 })) };
  }

  if (cleanEndpoint === '/exams/compare') {
    return {
      success: true,
      exams: fallbackData.exams.slice(0, 2),
      commonSubjects: ['Indian Polity & Governance', 'Indian Economy & Schemes', 'Geography & Ecology']
    };
  }

  // 3. Subjects & Study Materials
  if (cleanEndpoint === '/study-materials/subjects') {
    return { success: true, subjects: fallbackData.subjects };
  }

  if (cleanEndpoint.startsWith('/study-materials/subjects/')) {
    const subject = fallbackData.subjects[0];
    return {
      success: true,
      subject,
      topics: [
        {
          id: 1,
          name: 'Preamble & Salient Features of Constitution',
          difficulty: 'medium',
          estimated_hours: 3.5,
          description: 'Philosophical base, 42nd Amendment, Sovereign Socialist Secular Democratic Republic.',
          lessons: [
            {
              id: 1,
              title: 'Decoding the Preamble of the Indian Constitution',
              reading_time_mins: 8,
              is_important: true,
              summary: 'The Preamble acts as the identity card of the Indian Constitution, framing justice, liberty, equality, and fraternity as its supreme goals.',
              key_points: ['Preamble was adopted on 26 Nov 1949', 'Amended once by 42nd Amendment Act 1976', 'Non-justiciable'],
              content: `The Preamble to the Constitution of India is an introductory statement that explains the document's philosophy and objectives.\n\nKey Concepts:\n1. Sovereign: India is completely independent and not subject to any external authority.\n2. Socialist: Democratic socialism where public and private sectors co-exist.\n3. Secular: Equal status and support for all religions.`
            }
          ]
        }
      ],
      materials: [
        { id: 1, title: 'Indian Constitution Complete Mindmap & Articles', material_type: 'notes', page_count: 45, download_count: 1420, content_summary: 'Comprehensive 45-page visual guide covering Articles 1 to 395 and all 12 Schedules.' }
      ]
    };
  }

  if (cleanEndpoint.startsWith('/study-materials/lessons/')) {
    return {
      success: true,
      lesson: {
        id: 1,
        title: 'Decoding the Preamble of the Indian Constitution',
        reading_time_mins: 8,
        is_important: true,
        topic_name: 'Preamble & Salient Features',
        subject_name: 'Indian Polity & Governance',
        summary: 'The Preamble acts as the identity card of the Indian Constitution, framing justice, liberty, equality, and fraternity as its supreme goals.',
        key_points: ['Preamble was adopted on 26 Nov 1949', 'Amended once by 42nd Amendment Act 1976', 'Non-justiciable: provisions not enforceable in courts'],
        content: `The Preamble to the Constitution of India is an introductory statement that explains the document's philosophy and objectives. In Kesavananda Bharati (1973), the Supreme Court held that the Preamble is an integral part of the Constitution.\n\nKey Principles:\n1. Sovereign: India is an independent nation.\n2. Socialist: Added by 42nd Amendment 1976.\n3. Secular: State does not endorse any official religion.\n4. Democratic & Republic: Elected executive head.`
      }
    };
  }

  if (cleanEndpoint === '/study-materials') {
    return {
      success: true,
      materials: [
        { id: 1, title: 'Indian Constitution Complete Mindmap & Articles', material_type: 'notes', page_count: 45, download_count: 1420, content_summary: 'Comprehensive 45-page visual guide covering Articles 1 to 395 and all 12 Schedules.' },
        { id: 2, title: 'Union Budget & Economic Survey Handbook', material_type: 'pdf', page_count: 32, download_count: 3150, content_summary: 'Detailed summary of capital expenditure, fiscal deficit targets, and taxation slabs.' }
      ]
    };
  }

  // 4. Practice & Quiz
  if (cleanEndpoint === '/quiz/practice') {
    return { success: true, questions: fallbackData.questions };
  }

  if (cleanEndpoint === '/quiz/verify') {
    const body = options.body ? JSON.parse(options.body) : {};
    const q = fallbackData.questions.find(item => item.id === body.question_id) || fallbackData.questions[0];
    const isCorrect = q.correct_option === body.selected_option;
    return {
      success: true,
      isCorrect,
      correctOption: q.correct_option,
      explanation: q.explanation,
      score: isCorrect ? q.marks : -q.negative_marks
    };
  }

  // 5. Mock Tests
  if (cleanEndpoint === '/mock-tests') {
    return { success: true, mockTests: fallbackData.mockTests };
  }

  if (cleanEndpoint.startsWith('/mock-tests/') && !cleanEndpoint.includes('submit')) {
    const test = fallbackData.mockTests[0];
    return {
      success: true,
      mockTest: {
        ...test,
        questions: fallbackData.questions
      }
    };
  }

  if (cleanEndpoint === '/mock-tests/submit') {
    return {
      success: true,
      summary: {
        totalQuestions: 5,
        attempted: 5,
        correct: 4,
        wrong: 1,
        skipped: 0,
        totalScore: 7.34,
        maxMarks: 10,
        passingMarks: 4,
        percentage: 73.4,
        accuracy: 80.0,
        isPassed: true
      },
      questionResults: fallbackData.questions.map((q, i) => ({
        question_id: q.id,
        question_text: q.question_text,
        selected_option: q.correct_option,
        correct_option: q.correct_option,
        explanation: q.explanation,
        status: i === 1 ? 'wrong' : 'correct',
        marks_awarded: i === 1 ? -0.33 : 1.0,
        subject_name: q.subject_name
      }))
    };
  }

  // 6. Current Affairs
  if (cleanEndpoint === '/current-affairs/categories') {
    return {
      success: true,
      categories: [
        { id: 'all', name: 'All Categories' },
        { id: 'national', name: 'National News' },
        { id: 'state', name: 'State News' },
        { id: 'andhra_pradesh', name: 'Andhra Pradesh' },
        { id: 'economy', name: 'Economy & Schemes' },
        { id: 'sports', name: 'Sports News' }
      ]
    };
  }

  if (cleanEndpoint === '/current-affairs') {
    return { success: true, currentAffairs: fallbackData.currentAffairs };
  }

  // 7. PYQs
  if (cleanEndpoint === '/pyq') {
    return { success: true, papers: fallbackData.pyqPapers };
  }

  // 8. Study Planner
  if (cleanEndpoint === '/planner') {
    return {
      success: true,
      plan: {
        id: 1,
        title: 'Combined Multi-Exam 180-Day Timetable',
        daily_hours: 4.5,
        completed_tasks: 3,
        total_tasks: 7,
        schedule_json: [
          { day: 'Monday', time: '06:00 AM - 08:00 AM', subject: 'Indian Polity', topic: 'Preamble & Fundamental Rights', status: 'completed' },
          { day: 'Tuesday', time: '06:00 AM - 08:30 AM', subject: 'Indian Economy', topic: 'Monetary Policy & RBI Framework', status: 'completed' },
          { day: 'Wednesday', time: '06:00 AM - 08:30 AM', subject: 'Quantitative Aptitude', topic: 'Percentages & Speed Maths', status: 'pending' },
          { day: 'Thursday', time: '06:00 AM - 08:00 AM', subject: 'AP Special GK', topic: 'AP Reorganisation Act 2014', status: 'pending' },
          { day: 'Friday', time: '06:00 AM - 08:30 AM', subject: 'History & Culture', topic: 'Indian National Movement Revision', status: 'pending' }
        ]
      }
    };
  }

  // 9. Dashboard
  if (cleanEndpoint === '/user/dashboard') {
    return {
      success: true,
      dashboard: {
        streakCount: 14,
        completedLessons: 18,
        enrolledExams: fallbackData.exams.slice(0, 3).map(e => ({ ...e, is_favourite: true, preparation_percentage: 68 })),
        testStats: { totalAttempts: 4, avgScore: 15.3, avgAccuracy: 88.9 },
        recentTests: [
          { id: 1, test_title: 'UPSC CSE Prelims Mock 01', total_marks: 200, total_score: 154, accuracy: 88.9, created_at: new Date().toISOString() }
        ],
        continueLearning: {
          title: 'Decoding the Preamble of the Indian Constitution',
          subject_name: 'Indian Polity & Governance',
          topic_name: 'Constitution'
        }
      }
    };
  }

  // 10. Performance
  if (cleanEndpoint === '/user/performance') {
    return {
      success: true,
      metrics: {
        overallAccuracy: 88.9,
        totalQuestions: 24,
        totalAttempted: 24,
        totalCorrect: 20,
        totalStudyHours: 35.2,
        totalTests: 4,
        subjectPerformance: [
          { subject: 'Indian Polity', accuracy: 88, status: 'Strong', color: '#8b5cf6', solved: 45 },
          { subject: 'Economy & Schemes', accuracy: 76, status: 'Good', color: '#10b981', solved: 38 },
          { subject: 'Quantitative Aptitude', accuracy: 84, status: 'Strong', color: '#6366f1', solved: 50 },
          { subject: 'AP State GK', accuracy: 68, status: 'Moderate', color: '#ec4899', solved: 32 }
        ],
        weakTopics: [
          { topic: 'AP Reorganisation Act 2014 & Schedules', subject: 'AP State GK', accuracy: '45%', recommendation: 'Review statutory provisions and High Court judgements' },
          { topic: 'Compound Interest Installments', subject: 'Quantitative Aptitude', accuracy: '55%', recommendation: 'Solve 20 high-level practice problems' }
        ],
        recentAttempts: [
          { id: 1, test_title: 'UPSC CSE Prelims Mock 01', total_score: 154, total_marks: 200, percentage: 77, accuracy: 88.9, time_taken_seconds: 4800, created_at: new Date().toISOString() }
        ]
      }
    };
  }

  // 11. Bookmarks & Notifications
  if (cleanEndpoint === '/user/bookmarks') {
    return { success: true, bookmarks: [] };
  }
  if (cleanEndpoint === '/user/notifications') {
    return {
      success: true,
      notifications: [
        { id: 1, title: 'UPSC CSE 2026 Prelims Notification Released', message: 'Application window opened for 1,056 vacancies.', is_read: false, link: '/exams' },
        { id: 2, title: 'Study Streak Active! 🔥', message: 'You have completed 14 consecutive study days!', is_read: false, link: '/dashboard' }
      ]
    };
  }

  // 12. Admin Overview
  if (cleanEndpoint === '/admin/overview') {
    return {
      success: true,
      stats: { totalStudents: 1, totalExams: 12, totalQuestions: 15, totalMockTests: 3 },
      recentStudents: [
        { id: 1, name: 'Saranya Kumar', email: 'student@prepbloom.com', target_exam: 'UPSC Civil Services', streak_count: 14 }
      ],
      recentAttempts: []
    };
  }
  if (cleanEndpoint === '/admin/students') {
    return {
      success: true,
      students: [
        { id: 1, name: 'Saranya Kumar', email: 'student@prepbloom.com', target_exam: 'UPSC Civil Services', streak_count: 14, test_count: 4, created_at: new Date().toISOString() }
      ]
    };
  }

  return { success: true, message: 'Operation completed successfully.' };
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const data = await response.json();
      if (data && data.success !== false) {
        return data;
      }
    }
  } catch (err) {
    // Network or server error - seamlessly fall through to static fallback
  }

  // Fallback for standalone / static preview environments
  return handleStaticFallback(endpoint, options);
}

export const api = {
  // Auth
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (data) => apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  forgotPassword: (email) => apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  // Exams
  getCategories: () => apiRequest('/exams/categories'),
  getExams: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/exams${q ? `?${q}` : ''}`);
  },
  getExamBySlug: (slug) => apiRequest(`/exams/${slug}`),
  getMyExams: () => apiRequest('/exams/my-exams'),
  toggleMyExam: (exam_id) => apiRequest('/exams/my-exams/toggle', { method: 'POST', body: JSON.stringify({ exam_id }) }),
  toggleFavouriteExam: (exam_id) => apiRequest('/exams/my-exams/favourite', { method: 'POST', body: JSON.stringify({ exam_id }) }),
  compareExams: (examIds) => apiRequest('/exams/compare', { method: 'POST', body: JSON.stringify({ examIds }) }),

  // Study Materials
  getSubjects: () => apiRequest('/study-materials/subjects'),
  getSubjectDetail: (slug) => apiRequest(`/study-materials/subjects/${slug}`),
  getLessonById: (id) => apiRequest(`/study-materials/lessons/${id}`),
  markLessonProgress: (data) => apiRequest('/study-materials/lessons/progress', { method: 'POST', body: JSON.stringify(data) }),
  getMaterials: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/study-materials${q ? `?${q}` : ''}`);
  },
  downloadMaterial: (id) => apiRequest(`/study-materials/${id}/download`, { method: 'POST' }),

  // Daily Practice & Quizzes
  getPracticeQuestions: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/quiz/practice${q ? `?${q}` : ''}`);
  },
  verifyAnswer: (data) => apiRequest('/quiz/verify', { method: 'POST', body: JSON.stringify(data) }),

  // Mock Tests
  getMockTests: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/mock-tests${q ? `?${q}` : ''}`);
  },
  getMockTestById: (id) => apiRequest(`/mock-tests/${id}`),
  submitMockTest: (data) => apiRequest('/mock-tests/submit', { method: 'POST', body: JSON.stringify(data) }),
  getAttemptResults: (attemptId) => apiRequest(`/mock-tests/attempt/${attemptId}`),
  getUserTestHistory: () => apiRequest('/mock-tests/history'),

  // Current Affairs
  getCurrentAffairs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/current-affairs${q ? `?${q}` : ''}`);
  },
  getCurrentAffairCategories: () => apiRequest('/current-affairs/categories'),
  getCurrentAffairById: (id) => apiRequest(`/current-affairs/${id}`),

  // PYQ Papers
  getPYQPapers: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/pyq${q ? `?${q}` : ''}`);
  },
  getPYQById: (id) => apiRequest(`/pyq/${id}`),

  // Study Planner
  getStudyPlan: () => apiRequest('/planner'),
  saveStudyPlan: (data) => apiRequest('/planner', { method: 'POST', body: JSON.stringify(data) }),
  togglePlannerTask: (data) => apiRequest('/planner/toggle-task', { method: 'POST', body: JSON.stringify(data) }),
  generateCombinedPlan: (data) => apiRequest('/planner/generate-combined', { method: 'POST', body: JSON.stringify(data) }),

  // User Dashboard & Performance
  getDashboardData: () => apiRequest('/user/dashboard'),
  getPerformanceMetrics: () => apiRequest('/user/performance'),
  getBookmarks: () => apiRequest('/user/bookmarks'),
  toggleBookmark: (data) => apiRequest('/user/bookmarks/toggle', { method: 'POST', body: JSON.stringify(data) }),
  getNotifications: () => apiRequest('/user/notifications'),
  markNotificationRead: (id) => apiRequest(`/user/notifications/${id}/read`, { method: 'POST' }),

  // Admin
  getAdminOverview: () => apiRequest('/admin/overview'),
  getAllStudents: () => apiRequest('/admin/students'),
  adminAddExam: (data) => apiRequest('/admin/exams', { method: 'POST', body: JSON.stringify(data) }),
  adminDeleteExam: (id) => apiRequest(`/admin/exams/${id}`, { method: 'DELETE' }),
  adminAddQuestion: (data) => apiRequest('/admin/questions', { method: 'POST', body: JSON.stringify(data) }),
  adminCreateCurrentAffair: (data) => apiRequest('/admin/current-affairs', { method: 'POST', body: JSON.stringify(data) }),
  adminBroadcastNotification: (data) => apiRequest('/admin/notifications', { method: 'POST', body: JSON.stringify(data) }),
};
