import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/ThemeNotificationContext';
import Modal from '../components/common/Modal';
import { 
  Search, Filter, ExternalLink, Calendar, Users, 
  ArrowRight, ShieldCheck, CheckCircle2, Star, BookOpen, Clock, ChevronRight
} from 'lucide-react';

export default function ExamExplorerPage({ selectedSlug, onNavigate }) {
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();

  const [categories, setCategories] = useState([]);
  const [exams, setExams] = useState([]);
  const [myExamIds, setMyExamIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Exam for Detail Modal
  const [activeExam, setActiveExam] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [catsRes, examsRes] = await Promise.all([
          api.getCategories(),
          api.getExams({
            category: selectedCategory,
            status: selectedStatus,
            search: searchQuery
          })
        ]);

        if (catsRes.success) setCategories(catsRes.categories);
        if (examsRes.success) setExams(examsRes.exams);

        if (isAuthenticated) {
          const myRes = await api.getMyExams();
          if (myRes.success) {
            setMyExamIds(new Set(myRes.myExams.map(e => e.id)));
          }
        }
      } catch (err) {
        console.error('Failed to load exam explorer data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategory, selectedStatus, searchQuery, isAuthenticated]);

  // If a slug was passed directly, load its details
  useEffect(() => {
    if (selectedSlug) {
      handleOpenExamDetail(selectedSlug);
    }
  }, [selectedSlug]);

  const handleOpenExamDetail = async (slug) => {
    setModalLoading(true);
    try {
      const res = await api.getExamBySlug(slug);
      if (res.success && res.exam) {
        setActiveExam(res.exam);
      }
    } catch (err) {
      addToast('Could not load exam details', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleMyExam = async (examId) => {
    if (!isAuthenticated) {
      addToast('Please sign in to save examinations to your study plan.', 'info');
      onNavigate('auth');
      return;
    }

    try {
      const res = await api.toggleMyExam(examId);
      if (res.success) {
        addToast(res.message, 'success');
        setMyExamIds(prev => {
          const updated = new Set(prev);
          if (res.action === 'added') updated.add(examId);
          else updated.delete(examId);
          return updated;
        });
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Explorer Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm space-y-4">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-bloom-green-700 uppercase tracking-widest bg-bloom-green-100 px-3 py-1 rounded-full">
            All-India Competitive Database
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
            Explore Government Examinations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access verified eligibility criteria, stages, age limits, marks distribution, official notification links and comprehensive syllabi.
          </p>
        </div>

        {/* Search & Status Filters */}
        <div className="pt-2 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by exam title, code (e.g. UPSC CSE, APPSC Group 2, SSC CGL)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-lavender-400 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-bloom-lavender-400 bg-white"
            >
              <option value="all">All Notification Status</option>
              <option value="active">Active Applications</option>
              <option value="upcoming">Upcoming Notifications</option>
              <option value="expired">Past / Archive</option>
            </select>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-soft'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-gradient-to-r from-bloom-green-300 via-bloom-pink-200 to-bloom-lavender-300 text-slate-900 shadow-soft'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Exams Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          Loading examinations database...
        </div>
      ) : exams.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-soft-sm space-y-3">
          <span className="text-3xl">🔍</span>
          <p className="font-bold text-slate-700">No examinations match your filter criteria.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedStatus('all'); setSearchQuery(''); }}
            className="text-xs font-semibold text-bloom-lavender-600 underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => {
            const isEnrolled = myExamIds.has(exam.id);
            return (
              <div
                key={exam.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm hover:shadow-soft-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {exam.category_name}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      exam.notification_status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      exam.notification_status === 'upcoming' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {exam.notification_status}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-bloom-lavender-700 transition-colors line-clamp-1">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {exam.overview}
                  </p>

                  {/* Criteria Badge Matrix */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Age Limit:</span>
                      <span className="font-semibold text-slate-700 truncate max-w-[170px]">{exam.age_criteria}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Vacancies:</span>
                      <span className="font-bold text-slate-800">
                        {exam.vacancies > 0 ? `${exam.vacancies.toLocaleString()} Posts` : 'Under Notification'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Pay Scale:</span>
                      <span className="font-semibold text-bloom-green-700 truncate max-w-[170px]">{exam.salary_range}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenExamDetail(exam.slug)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs text-center transition-all shadow-sm"
                  >
                    View Syllabus &amp; Stages
                  </button>

                  <button
                    onClick={() => handleToggleMyExam(exam.id)}
                    className={`p-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isEnrolled
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    title={isEnrolled ? 'Enrolled in My Exams' : 'Add to My Exams'}
                  >
                    {isEnrolled ? '⭐ Enrolled' : '+ Add'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Comprehensive Exam Detail Modal */}
      <Modal
        isOpen={!!activeExam}
        onClose={() => setActiveExam(null)}
        title={activeExam?.title || 'Examination Details'}
        subtitle={`${activeExam?.code || ''} • Category: ${activeExam?.category_name || ''}`}
        maxWidth="max-w-4xl"
      >
        {activeExam && (
          <div className="space-y-6 text-slate-700">
            {/* Status & Official Link Pill */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-bloom-green-50 via-bloom-pink-50 to-bloom-lavender-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  activeExam.notification_status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  Status: {activeExam.notification_status}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {activeExam.vacancies > 0 ? `${activeExam.vacancies.toLocaleString()} Vacancies` : ''}
                </span>
              </div>

              {activeExam.official_notification_link && (
                <a
                  href={activeExam.official_notification_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-bold border border-slate-200 shadow-sm hover:text-bloom-lavender-700 transition-colors"
                >
                  <span>Official Notification Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Overview */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Overview</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{activeExam.overview}</p>
            </div>

            {/* Eligibility & Qualifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <h5 className="font-bold text-xs text-slate-900">Age Limit &amp; Relaxations</h5>
                <p className="text-xs text-slate-600">{activeExam.age_criteria}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <h5 className="font-bold text-xs text-slate-900">Educational Qualification</h5>
                <p className="text-xs text-slate-600">{activeExam.educational_qualification}</p>
              </div>
            </div>

            {/* Selection Process */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Selection Process</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{activeExam.selection_process}</p>
            </div>

            {/* Exam Pattern Table */}
            {activeExam.exam_pattern && activeExam.exam_pattern.stages && (
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-2">Examination Pattern &amp; Stages</h4>
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-100 text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold">
                      <tr>
                        <th className="py-2.5 px-3 text-left">Stage</th>
                        <th className="py-2.5 px-3 text-center">Questions</th>
                        <th className="py-2.5 px-3 text-center">Marks</th>
                        <th className="py-2.5 px-3 text-center">Duration</th>
                        <th className="py-2.5 px-3 text-left">Marking Scheme</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {activeExam.exam_pattern.stages.map((stg, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-semibold text-slate-800">{stg.name}</td>
                          <td className="py-2 px-3 text-center text-slate-600">{stg.questions || '-'}</td>
                          <td className="py-2 px-3 text-center font-bold text-slate-800">{stg.marks || '-'}</td>
                          <td className="py-2 px-3 text-center text-slate-600">{stg.duration || '-'}</td>
                          <td className="py-2 px-3 text-slate-500">{stg.negative ? `Negative: ${stg.negative}` : 'Standard'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Detailed Syllabus */}
            {activeExam.detailed_syllabus && (
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-2">Detailed Syllabus Topics</h4>
                <div className="space-y-3">
                  {Object.entries(activeExam.detailed_syllabus).map(([secKey, secTopics], i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-xs text-slate-800 uppercase tracking-wider block mb-2">
                        {secKey.replace('_', ' ')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(secTopics) ? secTopics.map((topic, ti) => (
                          <span key={ti} className="text-[11px] px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium">
                            {topic}
                          </span>
                        )) : (
                          <span className="text-xs text-slate-600">{String(secTopics)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Salary Scale: {activeExam.salary_range}</span>
              <button
                onClick={() => handleToggleMyExam(activeExam.id)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  myExamIds.has(activeExam.id)
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {myExamIds.has(activeExam.id) ? '⭐ Enrolled in My Exams' : '+ Enroll in My Exams'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
