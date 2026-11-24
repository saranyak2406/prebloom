import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/ThemeNotificationContext';
import Modal from '../components/common/Modal';
import { 
  ShieldCheck, Users, BookOpen, Clock, FileText, 
  Plus, Trash2, Send, CheckCircle2, AlertCircle, Sparkles 
} from 'lucide-react';

export default function AdminDashboardPage({ onNavigate }) {
  const { user, isAdmin } = useAuth();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'students', 'exams', 'questions', 'news', 'broadcast'
  const [overview, setOverview] = useState(null);
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  // Add Exam Form
  const [examForm, setExamForm] = useState({
    title: '',
    slug: '',
    code: '',
    category_id: 1,
    overview: '',
    eligibility: '',
    age_criteria: '',
    vacancies: 0,
    salary_range: '',
    notification_status: 'active',
    official_notification_link: ''
  });

  // Add Question Form
  const [questionForm, setQuestionForm] = useState({
    subject_id: 1,
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A',
    explanation: '',
    difficulty: 'medium',
    marks: 1.0,
    negative_marks: 0.33,
    previous_year_ref: ''
  });

  // Add Current Affair Form
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'national',
    summary: '',
    full_content: '',
    source: 'Official PIB Release',
    is_trending: false,
    tags: 'National, UPSC GS-2'
  });

  // Broadcast Form
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    type: 'exam_alert',
    link: '/exams'
  });

  useEffect(() => {
    async function loadAdminData() {
      if (!isAdmin) return;
      setLoading(true);
      try {
        const [ovRes, stRes, catRes, subRes] = await Promise.all([
          api.getAdminOverview(),
          api.getAllStudents(),
          api.getCategories(),
          api.getSubjects()
        ]);
        if (ovRes.success) setOverview(ovRes);
        if (stRes.success) setStudents(stRes.students);
        if (catRes.success) setCategories(catRes.categories);
        if (subRes.success) setSubjects(subRes.subjects);
      } catch (err) {
        console.error('Admin data error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [isAdmin]);

  const handleAddExam = async (e) => {
    e.preventDefault();
    try {
      const res = await api.adminAddExam(examForm);
      if (res.success) {
        addToast('New examination created successfully! 🌷', 'success');
        setExamForm({
          title: '', slug: '', code: '', category_id: 1, overview: '',
          eligibility: '', age_criteria: '', vacancies: 0, salary_range: '',
          notification_status: 'active', official_notification_link: ''
        });
      }
    } catch (err) {
      addToast(err.message || 'Failed to add exam', 'error');
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await api.adminAddQuestion(questionForm);
      if (res.success) {
        addToast('Question added to database! 📝', 'success');
        setQuestionForm({
          subject_id: 1, question_text: '', option_a: '', option_b: '',
          option_c: '', option_d: '', correct_option: 'A', explanation: '',
          difficulty: 'medium', marks: 1.0, negative_marks: 0.33, previous_year_ref: ''
        });
      }
    } catch (err) {
      addToast(err.message || 'Failed to add question', 'error');
    }
  };

  const handlePublishNews = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = newsForm.tags.split(',').map(t => t.trim());
      const res = await api.adminCreateCurrentAffair({
        ...newsForm,
        tags: tagsArray
      });
      if (res.success) {
        addToast('Current affairs article published! 📰', 'success');
        setNewsForm({
          title: '', category: 'national', summary: '', full_content: '',
          source: 'Official PIB Release', is_trending: false, tags: ''
        });
      }
    } catch (err) {
      addToast(err.message || 'Failed to publish news', 'error');
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      const res = await api.adminBroadcastNotification(broadcastForm);
      if (res.success) {
        addToast(res.message, 'success');
        setBroadcastForm({ title: '', message: '', type: 'exam_alert', link: '/exams' });
      }
    } catch (err) {
      addToast('Broadcast failed', 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-100 shadow-soft-sm space-y-4">
        <span className="text-4xl">🛡️</span>
        <h3 className="text-xl font-bold font-display text-slate-900">Administrator Access Required</h3>
        <p className="text-xs text-slate-500">
          This portal is reserved for Academic Administrators to manage examinations, question banks, and notifications.
        </p>
        <button
          onClick={() => onNavigate('auth')}
          className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  const stats = overview?.stats || { totalStudents: 1, totalExams: 8, totalQuestions: 10, totalMockTests: 3 };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-rose-700 uppercase tracking-widest bg-rose-100 px-3 py-1 rounded-full">
            PrepBloom Academic Administration
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
            Administrator Control Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Logged in as <strong>{user?.name}</strong>. Manage students, publish examinations, update question banks, and broadcast alerts.
          </p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
        >
          Switch to Student View →
        </button>
      </div>

      {/* 2. Admin Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft-sm">
          <span className="text-xs font-semibold text-slate-400">Total Enrolled Students</span>
          <p className="text-2xl font-bold font-display text-slate-900 mt-2">{stats.totalStudents}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft-sm">
          <span className="text-xs font-semibold text-slate-400">Active Examinations</span>
          <p className="text-2xl font-bold font-display text-emerald-600 mt-2">{stats.totalExams}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft-sm">
          <span className="text-xs font-semibold text-slate-400">Question Bank Items</span>
          <p className="text-2xl font-bold font-display text-purple-600 mt-2">{stats.totalQuestions}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft-sm">
          <span className="text-xs font-semibold text-slate-400">Mock Tests Simulated</span>
          <p className="text-2xl font-bold font-display text-pink-600 mt-2">{stats.totalMockTests}</p>
        </div>
      </div>

      {/* 3. Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {[
          { id: 'overview', label: '📊 System Activity' },
          { id: 'students', label: '🎓 Students' },
          { id: 'exams', label: '🏛️ Add Examination' },
          { id: 'questions', label: '📝 Add Questions' },
          { id: 'news', label: '📰 Publish News' },
          { id: 'broadcast', label: '📢 Broadcast Alert' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-soft'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Activity */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Recent Student Registrations</h3>
            <div className="divide-y divide-slate-100">
              {overview?.recentStudents?.map((st) => (
                <div key={st.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{st.name}</span>
                    <span className="text-slate-400 block">{st.email} • Target: {st.target_exam}</span>
                  </div>
                  <span className="font-bold text-amber-600">🔥 {st.streak_count} Days</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Live Mock Test Submissions</h3>
            <div className="divide-y divide-slate-100">
              {overview?.recentAttempts?.map((att) => (
                <div key={att.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{att.student_name}</span>
                    <span className="text-slate-400 block">{att.test_title}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600">{att.total_score} pts</span>
                    <span className="text-[10px] text-slate-400 block">{att.accuracy}% acc</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Students Management */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">Registered Students Directory</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold">
                <tr>
                  <th className="py-3 px-4 text-left">Student Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Target Cadre</th>
                  <th className="py-3 px-4 text-center">Study Streak</th>
                  <th className="py-3 px-4 text-center">Tests Attempted</th>
                  <th className="py-3 px-4 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {students.map((st) => (
                  <tr key={st.id}>
                    <td className="py-3 px-4 font-bold text-slate-900">{st.name}</td>
                    <td className="py-3 px-4 text-slate-500">{st.email}</td>
                    <td className="py-3 px-4 text-slate-700 font-semibold">{st.target_exam || 'UPSC'}</td>
                    <td className="py-3 px-4 text-center font-bold text-amber-600">🔥 {st.streak_count} Days</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{st.test_count || 1}</td>
                    <td className="py-3 px-4 text-right text-slate-400">{new Date(st.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Add Examination Form */}
      {activeTab === 'exams' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm max-w-3xl space-y-6">
          <h3 className="font-bold text-lg text-slate-900">Add New Examination Notification</h3>
          <form onSubmit={handleAddExam} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Exam Title</label>
                <input
                  type="text"
                  required
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  placeholder="e.g. APPSC Group 4 Junior Assistant"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slug (URL friendly)</label>
                <input
                  type="text"
                  required
                  value={examForm.slug}
                  onChange={(e) => setExamForm({ ...examForm, slug: e.target.value })}
                  placeholder="e.g. appsc-group-4-ja"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={examForm.category_id}
                  onChange={(e) => setExamForm({ ...examForm, category_id: parseInt(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={examForm.notification_status}
                  onChange={(e) => setExamForm({ ...examForm, notification_status: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vacancies Count</label>
                <input
                  type="number"
                  value={examForm.vacancies}
                  onChange={(e) => setExamForm({ ...examForm, vacancies: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Overview Description</label>
              <textarea
                rows={3}
                required
                value={examForm.overview}
                onChange={(e) => setExamForm({ ...examForm, overview: e.target.value })}
                placeholder="Comprehensive description of cadre, roles, and recruiting authority..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Age Criteria</label>
                <input
                  type="text"
                  value={examForm.age_criteria}
                  onChange={(e) => setExamForm({ ...examForm, age_criteria: e.target.value })}
                  placeholder="e.g. 18 to 42 years"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Portal Link</label>
                <input
                  type="url"
                  value={examForm.official_notification_link}
                  onChange={(e) => setExamForm({ ...examForm, official_notification_link: e.target.value })}
                  placeholder="https://psc.ap.gov.in"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs"
            >
              Publish Examination 🌷
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Add Question to Question Bank */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm max-w-3xl space-y-6">
          <h3 className="font-bold text-lg text-slate-900">Add MCQ to Question Bank</h3>
          <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={questionForm.subject_id}
                  onChange={(e) => setQuestionForm({ ...questionForm, subject_id: parseInt(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={questionForm.difficulty}
                  onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Question Statement</label>
              <textarea
                rows={3}
                required
                value={questionForm.question_text}
                onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                placeholder="Enter complete question text..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Option A</label>
                <input
                  type="text"
                  required
                  value={questionForm.option_a}
                  onChange={(e) => setQuestionForm({ ...questionForm, option_a: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Option B</label>
                <input
                  type="text"
                  required
                  value={questionForm.option_b}
                  onChange={(e) => setQuestionForm({ ...questionForm, option_b: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Option C</label>
                <input
                  type="text"
                  required
                  value={questionForm.option_c}
                  onChange={(e) => setQuestionForm({ ...questionForm, option_c: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Option D</label>
                <input
                  type="text"
                  required
                  value={questionForm.option_d}
                  onChange={(e) => setQuestionForm({ ...questionForm, option_d: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Correct Answer</label>
                <select
                  value={questionForm.correct_option}
                  onChange={(e) => setQuestionForm({ ...questionForm, correct_option: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-emerald-700"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Marks</label>
                <input
                  type="number"
                  step="0.5"
                  value={questionForm.marks}
                  onChange={(e) => setQuestionForm({ ...questionForm, marks: parseFloat(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Negative Deduction</label>
                <input
                  type="number"
                  step="0.05"
                  value={questionForm.negative_marks}
                  onChange={(e) => setQuestionForm({ ...questionForm, negative_marks: parseFloat(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Detailed Explanation &amp; Solution</label>
              <textarea
                rows={3}
                required
                value={questionForm.explanation}
                onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                placeholder="Include landmark judgements, articles, formulas or standard sources..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs"
            >
              Add Question to Bank 📝
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: Publish Daily Current Affairs */}
      {activeTab === 'news' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm max-w-3xl space-y-6">
          <h3 className="font-bold text-lg text-slate-900">Publish Daily Current Affairs Article</h3>
          <form onSubmit={handlePublishNews} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Article Headline</label>
              <input
                type="text"
                required
                value={newsForm.title}
                onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                placeholder="e.g. Cabinet Approves National Green Hydrogen Mission Outlay"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newsForm.category}
                  onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="national">National News</option>
                  <option value="state">State News</option>
                  <option value="andhra_pradesh">Andhra Pradesh Special</option>
                  <option value="economy">Economy &amp; Schemes</option>
                  <option value="sports">Sports</option>
                  <option value="awards">Awards &amp; Honors</option>
                  <option value="appointments">Appointments</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Source / Attribution</label>
                <input
                  type="text"
                  value={newsForm.source}
                  onChange={(e) => setNewsForm({ ...newsForm, source: e.target.value })}
                  placeholder="e.g. PIB Delhi / The Hindu"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Executive Summary</label>
              <textarea
                rows={2}
                required
                value={newsForm.summary}
                onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                placeholder="2-line high-yield summary for quick revision..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Detailed Content</label>
              <textarea
                rows={5}
                required
                value={newsForm.full_content}
                onChange={(e) => setNewsForm({ ...newsForm, full_content: e.target.value })}
                placeholder="Complete article coverage..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs"
            >
              Publish News Article 📰
            </button>
          </form>
        </div>
      )}

      {/* Tab 6: Broadcast Alert to Students */}
      {activeTab === 'broadcast' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm max-w-2xl space-y-6">
          <h3 className="font-bold text-lg text-slate-900">Broadcast Alert to All Students</h3>
          <p className="text-xs text-slate-500">
            Send an instant notification bell alert to all registered student accounts.
          </p>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Notification Title</label>
              <input
                type="text"
                required
                value={broadcastForm.title}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                placeholder="e.g. APPSC Group 2 Prelims Hall Tickets Available"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Message Body</label>
              <textarea
                rows={3}
                required
                value={broadcastForm.message}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                placeholder="Download your hall ticket from the official commission website..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-soft transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Notification 📢</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
