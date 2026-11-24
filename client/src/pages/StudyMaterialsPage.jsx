import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/ThemeNotificationContext';
import Modal from '../components/common/Modal';
import { 
  BookOpen, FileText, Download, CheckCircle2, Bookmark, 
  Clock, Search, Sparkles, Star, ChevronRight, ArrowLeft 
} from 'lucide-react';

export default function StudyMaterialsPage({ onNavigate }) {
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectDetail, setSubjectDetail] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lesson reader modal
  const [activeLesson, setActiveLesson] = useState(null);
  const [readingLesson, setReadingLesson] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  // Material Type filter
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadInitial() {
      setLoading(true);
      try {
        const [subsRes, matsRes] = await Promise.all([
          api.getSubjects(),
          api.getMaterials()
        ]);
        if (subsRes.success) {
          setSubjects(subsRes.subjects);
          if (subsRes.subjects.length > 0 && !selectedSubject) {
            handleSelectSubject(subsRes.subjects[0].slug);
          }
        }
        if (matsRes.success) setMaterials(matsRes.materials);
      } catch (err) {
        console.error('Failed to load study materials:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  const handleSelectSubject = async (slug) => {
    setSelectedSubject(slug);
    try {
      const res = await api.getSubjectDetail(slug);
      if (res.success) {
        setSubjectDetail(res);
      }
    } catch (e) {
      addToast('Failed to load subject topics', 'error');
    }
  };

  const handleOpenLesson = async (lessonId) => {
    setLessonLoading(true);
    try {
      const res = await api.getLessonById(lessonId);
      if (res.success && res.lesson) {
        setReadingLesson(res.lesson);
      }
    } catch (e) {
      addToast('Could not load lesson', 'error');
    } finally {
      setLessonLoading(false);
    }
  };

  const handleMarkProgress = async (lessonId, topicId, currentStatus) => {
    if (!isAuthenticated) {
      addToast('Please sign in to track completed lessons.', 'info');
      onNavigate('auth');
      return;
    }

    try {
      const nextStatus = currentStatus === 'completed' ? 'in_progress' : 'completed';
      const res = await api.markLessonProgress({ lesson_id: lessonId, topic_id: topicId, status: nextStatus });
      if (res.success) {
        addToast(res.message, 'success');
        if (readingLesson) {
          setReadingLesson(prev => ({ ...prev, user_status: nextStatus }));
        }
        if (selectedSubject) {
          handleSelectSubject(selectedSubject);
        }
      }
    } catch (e) {
      addToast('Failed to update progress', 'error');
    }
  };

  const handleDownload = async (materialId, title) => {
    try {
      await api.downloadMaterial(materialId);
      addToast(`Downloaded handbook: "${title}" 📥`, 'success');
      setMaterials(prev => prev.map(m => m.id === materialId ? { ...m, download_count: m.download_count + 1 } : m));
    } catch (e) {
      addToast('Download initiated', 'info');
    }
  };

  const handleBookmarkLesson = async (lessonId) => {
    if (!isAuthenticated) {
      addToast('Sign in to bookmark this lesson.', 'info');
      return;
    }
    try {
      const res = await api.toggleBookmark({ item_type: 'lesson', item_id: lessonId });
      if (res.success) {
        addToast(res.message, 'success');
        setReadingLesson(prev => ({ ...prev, is_bookmarked: res.isBookmarked }));
      }
    } catch (e) {
      addToast('Bookmark update failed', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm space-y-4">
        <div>
          <span className="text-xs font-bold text-bloom-lavender-700 uppercase tracking-widest bg-bloom-lavender-100 px-3 py-1 rounded-full">
            Knowledge Repository
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
            Subject-Wise Learning &amp; Study Materials
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Carefully curated chapter-wise notes, conceptual mindmaps, and high-yield downloadable revision handbooks.
          </p>
        </div>

        {/* Subject Pills Horizontal List */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => handleSelectSubject(sub.slug)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedSubject === sub.slug
                  ? 'bg-gradient-to-r from-bloom-lavender-200 via-bloom-pink-200 to-bloom-green-200 text-slate-900 shadow-soft font-extrabold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{sub.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Subject Topics & Chapters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Topics and Lessons */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900">
              {subjectDetail?.subject?.name || 'Subject Chapters'}
            </h3>
            <span className="text-xs text-slate-400">
              {subjectDetail?.topics?.length || 0} Topics Available
            </span>
          </div>

          {!subjectDetail ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading curriculum...</div>
          ) : subjectDetail.topics.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl text-center text-xs text-slate-400 border border-slate-100">
              No lessons published under this subject yet.
            </div>
          ) : (
            subjectDetail.topics.map((topic) => (
              <div 
                key={topic.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{topic.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        topic.difficulty === 'hard' ? 'bg-rose-100 text-rose-700' :
                        topic.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {topic.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{topic.description}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                    ~{topic.estimated_hours} hrs
                  </span>
                </div>

                {/* Lessons in this Topic */}
                <div className="space-y-2 pt-2 border-t border-slate-50">
                  {topic.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => handleOpenLesson(lesson.id)}
                      className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-bloom-lavender-50/50 border border-slate-100/80 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                          lesson.user_status === 'completed'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white text-slate-400 border border-slate-200'
                        }`}>
                          {lesson.user_status === 'completed' ? '✓' : '📖'}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-800 group-hover:text-bloom-lavender-700 transition-colors">
                            {lesson.title}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            Reading Time: {lesson.reading_time_mins} Mins {lesson.is_important && '• ⭐ High Yield'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-bloom-lavender-600 group-hover:translate-x-1 transition-transform">
                          Read →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Col: PDF Resources & Revision Handbooks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900">PDFs &amp; Handbooks</h3>
            <span className="text-xs text-slate-400">Instant Download</span>
          </div>

          <div className="space-y-3">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft-sm hover:shadow-soft transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bloom-pink-100 text-bloom-pink-700 uppercase">
                    {mat.material_type}
                  </span>
                  <span className="text-[11px] text-slate-400">{mat.page_count} Pages</span>
                </div>

                <h4 className="font-bold text-xs text-slate-800 line-clamp-2 leading-relaxed">
                  {mat.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {mat.content_summary}
                </p>

                <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {mat.download_count} Downloads
                  </span>
                  <button
                    onClick={() => handleDownload(mat.id, mat.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-bloom-green-300" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Interactive Lesson Reader Modal */}
      <Modal
        isOpen={!!readingLesson}
        onClose={() => setReadingLesson(null)}
        title={readingLesson?.title || 'Lesson Notes'}
        subtitle={`${readingLesson?.subject_name || ''} • Topic: ${readingLesson?.topic_name || ''}`}
        maxWidth="max-w-3xl"
      >
        {readingLesson && (
          <div className="space-y-6 text-slate-700">
            {/* Meta Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-600">⏱️ {readingLesson.reading_time_mins} Min Read</span>
                {readingLesson.is_important && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    High Yield Exam Topic
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBookmarkLesson(readingLesson.id)}
                  className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
                >
                  {readingLesson.is_bookmarked ? '⭐ Saved' : '☆ Bookmark'}
                </button>
                <button
                  onClick={() => handleMarkProgress(readingLesson.id, readingLesson.topic_id, readingLesson.user_status)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    readingLesson.user_status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-bloom-green-500 text-white hover:bg-bloom-green-600'
                  }`}
                >
                  {readingLesson.user_status === 'completed' ? '✓ Completed' : 'Mark as Complete'}
                </button>
              </div>
            </div>

            {/* Summary Box */}
            {readingLesson.summary && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-bloom-green-50 to-bloom-pink-50 border border-bloom-green-200/60">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Executive Summary:</p>
                <p className="text-xs text-slate-700 leading-relaxed">{readingLesson.summary}</p>
              </div>
            )}

            {/* Main Content Body */}
            <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-white p-2">
              {readingLesson.content}
            </div>

            {/* Key Points Bullet Cards */}
            {readingLesson.key_points && Array.isArray(readingLesson.key_points) && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Exam Takeaways:</h5>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {readingLesson.key_points.map((pt, pi) => (
                    <li key={pi} className="flex items-start gap-2">
                      <span className="text-bloom-green-600 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Complete CTA */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Keep up the daily reading habit! 🌷</span>
              <button
                onClick={() => handleMarkProgress(readingLesson.id, readingLesson.topic_id, readingLesson.user_status)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                {readingLesson.user_status === 'completed' ? '✓ Mark as Incomplete' : 'Complete Lesson 🌸'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
