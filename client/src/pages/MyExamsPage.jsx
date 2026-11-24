import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/ThemeNotificationContext';
import Modal from '../components/common/Modal';
import { Star, Sparkles, Compass, Check, Calendar, ArrowRight, ShieldCheck, Layers } from 'lucide-react';

export default function MyExamsPage({ onNavigate }) {
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();

  const [myExams, setMyExams] = useState([]);
  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Compare Exams State
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [compareResult, setCompareResult] = useState(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  useEffect(() => {
    async function fetchMyExams() {
      if (!isAuthenticated) return;
      try {
        const [myRes, allRes] = await Promise.all([
          api.getMyExams(),
          api.getExams()
        ]);
        if (myRes.success) setMyExams(myRes.myExams);
        if (allRes.success) setAllExams(allRes.exams);
      } catch (err) {
        console.error('Failed to load my exams:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyExams();
  }, [isAuthenticated]);

  const handleToggleFav = async (examId) => {
    try {
      const res = await api.toggleFavouriteExam(examId);
      if (res.success) {
        setMyExams(prev => prev.map(e => e.id === examId ? { ...e, is_favourite: res.is_favourite } : e));
        addToast(res.is_favourite ? 'Added to Favourites! ⭐' : 'Removed from Favourites', 'success');
      }
    } catch (e) {
      addToast('Failed to update favourite status', 'error');
    }
  };

  const handleRemove = async (examId) => {
    try {
      const res = await api.toggleMyExam(examId);
      if (res.success) {
        setMyExams(prev => prev.filter(e => e.id !== examId));
        addToast('Removed from My Exams', 'info');
      }
    } catch (e) {
      addToast('Failed to remove exam', 'error');
    }
  };

  const toggleCompareSelection = (examId) => {
    if (selectedForCompare.includes(examId)) {
      setSelectedForCompare(prev => prev.filter(id => id !== examId));
    } else {
      if (selectedForCompare.length >= 3) {
        addToast('You can compare up to 3 exams at once', 'info');
        return;
      }
      setSelectedForCompare(prev => [...prev, examId]);
    }
  };

  const handleRunComparison = async () => {
    if (selectedForCompare.length < 2) {
      addToast('Please select at least 2 examinations to compare common syllabus', 'info');
      return;
    }

    try {
      const res = await api.compareExams(selectedForCompare);
      if (res.success) {
        setCompareResult(res);
        setCompareModalOpen(true);
      }
    } catch (e) {
      addToast(e.message || 'Comparison failed', 'error');
    }
  };

  const handleGenerateCombinedPlan = () => {
    onNavigate('planner');
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-100 shadow-soft-sm space-y-4">
        <span className="text-4xl">🌷</span>
        <h3 className="text-xl font-bold font-display text-slate-900">Sign in to track your examinations</h3>
        <p className="text-xs text-slate-500">
          Save multiple examinations, compare overlapping syllabus, and generate combined study schedules.
        </p>
        <button
          onClick={() => onNavigate('auth')}
          className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Top Action Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
            Target Management
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
            My Enrolled Examinations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Compare overlapping subjects between selected exams to avoid duplicate effort and generate unified study plans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunComparison}
            disabled={selectedForCompare.length < 2}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-bloom-lavender-100 hover:bg-bloom-lavender-200 text-bloom-lavender-800 font-bold text-xs shadow-soft transition-all disabled:opacity-40"
          >
            <Layers className="w-4 h-4" />
            <span>Compare Subjects ({selectedForCompare.length})</span>
          </button>

          <button
            onClick={handleGenerateCombinedPlan}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-soft transition-all"
          >
            <Calendar className="w-4 h-4 text-bloom-green-300" />
            <span>Combined Study Plan</span>
          </button>
        </div>
      </div>

      {/* 2. Enrolled Exams List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading your saved exams...</div>
      ) : myExams.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-soft-sm space-y-4">
          <span className="text-4xl">🎯</span>
          <h3 className="font-bold text-lg text-slate-800">You haven't enrolled in any examinations yet.</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Explore our database of UPSC, APPSC, SSC, RRB, and Banking exams to add them to your personalized preparation roadmap.
          </p>
          <button
            onClick={() => onNavigate('exams')}
            className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs"
          >
            Explore All Exams →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myExams.map((exam) => {
            const isCompared = selectedForCompare.includes(exam.id);
            return (
              <div
                key={exam.id}
                className={`bg-white rounded-3xl p-6 border transition-all shadow-soft-sm flex flex-col justify-between ${
                  isCompared ? 'border-bloom-lavender-500 ring-2 ring-bloom-lavender-200' : 'border-slate-100 hover:shadow-soft'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {exam.category_name}
                    </span>
                    <button
                      onClick={() => handleToggleFav(exam.id)}
                      className="text-lg transition-transform hover:scale-125"
                      title={exam.is_favourite ? 'Starred Exam' : 'Mark as Favourite'}
                    >
                      {exam.is_favourite ? '⭐' : '☆'}
                    </button>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 line-clamp-1">{exam.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">Code: {exam.code}</p>

                  {/* Preparation progress */}
                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-600">Preparation Readiness</span>
                      <span className="text-bloom-green-700 font-bold">{exam.preparation_percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-bloom-green-400 to-bloom-pink-400 rounded-full"
                        style={{ width: `${exam.preparation_percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Vacancies: {exam.vacancies ? exam.vacancies.toLocaleString() : 'N/A'}</span>
                    <span className="font-bold text-slate-700">{exam.notification_status}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleCompareSelection(exam.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isCompared 
                        ? 'bg-bloom-lavender-600 text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isCompared ? '✓ Selected for Compare' : '+ Select for Compare'}
                  </button>

                  <button
                    onClick={() => handleRemove(exam.id)}
                    className="p-2 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                    title="Remove from My Exams"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Common Subjects Comparison Modal */}
      <Modal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        title="Multi-Exam Syllabus & Subject Comparison"
        subtitle="Identifying overlapping syllabus so you study once and qualify multiple government examinations."
        maxWidth="max-w-3xl"
      >
        {compareResult && (
          <div className="space-y-6 text-slate-700">
            {/* Common Overlapping Subjects Callout */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-bloom-green-100/90 to-bloom-pink-100/90 border border-bloom-green-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">💡</span>
                <h4 className="font-bold text-sm text-slate-900">
                  {compareResult.commonSubjects.length} Common Overlapping Subject(s) Found!
                </h4>
              </div>
              <p className="text-xs text-slate-600">
                You can master these high-yield common subjects to prepare for both examinations simultaneously:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {compareResult.commonSubjects.map((sub, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-white text-slate-800 text-xs font-bold border border-slate-200 shadow-sm">
                    ✨ {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Exam Side by Side Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {compareResult.exams.map((ex) => (
                <div key={ex.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {ex.category_name}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{ex.code}</span>
                  </div>
                  <h5 className="font-bold text-sm text-slate-900">{ex.title}</h5>
                  <p className="text-[11px] text-slate-500">Eligibility: {ex.eligibility}</p>
                  <p className="text-[11px] text-slate-500">Age: {ex.age_criteria}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Save 40% time with unified preparation</span>
              <button
                onClick={() => { setCompareModalOpen(false); onNavigate('planner'); }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Generate Combined Timetable →
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
