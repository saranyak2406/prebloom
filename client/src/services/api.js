const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('prepbloom_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Server communication error' }));

  if (!response.ok && !data.success) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
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
