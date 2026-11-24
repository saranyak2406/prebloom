import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/ThemeNotificationContext';
import Modal from '../components/common/Modal';
import { 
  Clock, AlertCircle, CheckCircle2, Award, ArrowRight, 
  RotateCcw, Sparkles, Flag, ChevronLeft, ChevronRight, Check
} from 'lucide-react';

export default function MockTestsPage({ onNavigate }) {
  const { isAuthenticated } = useAuth();
  const { addToast, triggerConfetti } = useNotification();

  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Test Simulator State
  const [activeTest, setActiveTest] = useState(null);
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: 'A'|'B'|'C'|'D' }
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [testSubmitting, setTestSubmitting] = useState(false);

  // Results State
  const [testResult, setTestResult] = useState(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  useEffect(() => {
    async function loadMockTests() {
      setLoading(true);
      try {
        const res = await api.getMockTests();
        if (res.success) setMockTests(res.mockTests);
      } catch (err) {
        console.error('Failed to load mock tests:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMockTests();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!activeTest || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest, timeLeftSeconds]);

  const handleStartTest = async (testId) => {
    if (!isAuthenticated) {
      addToast('Please sign in to take official mock tests and save your score history.', 'info');
      onNavigate('auth');
      return;
    }

    try {
      const res = await api.getMockTestById(testId);
      if (res.success && res.mockTest) {
        setActiveTest(res.mockTest);
        setTestQuestions(res.mockTest.questions || []);
        setCurrentQIndex(0);
        setUserAnswers({});
        setMarkedForReview(new Set());
        // For testing convenience: 10 mins simulator or actual test duration
        setTimeLeftSeconds((res.mockTest.duration_minutes || 60) * 60);
        addToast(`Mock Test Started! Timer is running. Best of luck! 🌷`, 'success');
      }
    } catch (e) {
      addToast('Failed to start mock test', 'error');
    }
  };

  const handleOptionSelect = (qId, option) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  const toggleMarkForReview = (qId) => {
    setMarkedForReview(prev => {
      const updated = new Set(prev);
      if (updated.has(qId)) updated.delete(qId);
      else updated.add(qId);
      return updated;
    });
  };

  const handleClearResponse = (qId) => {
    setUserAnswers(prev => {
      const updated = { ...prev };
      delete updated[qId];
      return updated;
    });
  };

  const handleSubmitTest = async () => {
    if (!window.confirm('Are you sure you want to submit your mock test? Answers will be evaluated immediately.')) {
      return;
    }
    await processSubmission();
  };

  const handleAutoSubmit = async () => {
    addToast('Time expired! Automatically submitting your answers...', 'info');
    await processSubmission();
  };

  const processSubmission = async () => {
    setTestSubmitting(true);
    try {
      const timeSpent = (activeTest.duration_minutes * 60) - timeLeftSeconds;
      const res = await api.submitMockTest({
        mock_test_id: activeTest.id,
        answers: userAnswers,
        time_taken_seconds: Math.max(1, timeSpent)
      });

      if (res.success) {
        setTestResult(res);
        setResultModalOpen(true);
        setActiveTest(null);
        triggerConfetti();
        addToast(`Test Submitted! Score: ${res.summary.totalScore} Marks 🎉`, 'success');
      }
    } catch (err) {
      addToast('Error submitting test', 'error');
    } finally {
      setTestSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
  };

  const currentQ = testQuestions[currentQIndex];

  // If Test is Currently Active (Full Exam CBT Simulator Interface)
  if (activeTest && currentQ) {
    const isAnswered = !!userAnswers[currentQ.id];
    const isReviewed = markedForReview.has(currentQ.id);

    return (
      <div className="bg-slate-50 min-h-[85vh] rounded-3xl border border-slate-200 overflow-hidden shadow-soft-lg flex flex-col justify-between animate-fadeIn">
        {/* CBT Topbar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-base text-slate-900">{activeTest.title}</h2>
            <p className="text-xs text-slate-500">{activeTest.exam_title || 'Competitive Exam'} Simulator</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer Clock */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-bold text-sm ${
              timeLeftSeconds < 300 
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>

            <button
              onClick={handleSubmitTest}
              disabled={testSubmitting}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-soft transition-all"
            >
              {testSubmitting ? 'Evaluating...' : 'Submit Test 🏁'}
            </button>
          </div>
        </div>

        {/* Center: Question Display (Left) + Question Palette (Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          
          {/* Main Question Area (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  Question {currentQIndex + 1} of {testQuestions.length}
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-600 font-bold">+{currentQ.marks} Marks</span>
                  <span className="text-rose-500 font-semibold">-{currentQ.negative_marks} Neg</span>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-4 leading-relaxed">
                {currentQ.question_text}
              </h3>

              {/* 4 Options */}
              <div className="space-y-3 mt-6">
                {['A', 'B', 'C', 'D'].map((optKey) => {
                  const optionText = currentQ[`option_${optKey.toLowerCase()}`];
                  const isSelected = userAnswers[currentQ.id] === optKey;

                  return (
                    <div
                      key={optKey}
                      onClick={() => handleOptionSelect(currentQ.id, optKey)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected 
                          ? 'bg-bloom-lavender-50 border-bloom-lavender-500 text-bloom-lavender-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center ${
                        isSelected ? 'bg-bloom-lavender-600 text-white' : 'bg-white text-slate-600 border'
                      }`}>
                        {optKey}
                      </span>
                      <span className="text-xs sm:text-sm">{optionText}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Nav Controls */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleMarkForReview(currentQ.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isReviewed ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5 inline mr-1" />
                  {isReviewed ? 'Marked for Review' : 'Mark for Review'}
                </button>

                {isAnswered && (
                  <button
                    onClick={() => handleClearResponse(currentQ.id)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  >
                    Clear Response
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 inline" /> Prev
                </button>
                <button
                  disabled={currentQIndex === testQuestions.length - 1}
                  onClick={() => setCurrentQIndex(prev => prev + 1)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold disabled:opacity-30"
                >
                  Next <ChevronRight className="w-4 h-4 inline" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Question Palette (1 Col) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft-sm flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3">
                Question Palette
              </h4>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 text-[10px] pb-3 border-b border-slate-100 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-emerald-500" /> Answered
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-amber-500" /> Review
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-slate-200" /> Not Visited
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-rose-400" /> Skipped
                </div>
              </div>

              {/* Number Matrix */}
              <div className="grid grid-cols-5 gap-2 pt-3 max-h-72 overflow-y-auto">
                {testQuestions.map((q, idx) => {
                  const answered = !!userAnswers[q.id];
                  const reviewed = markedForReview.has(q.id);
                  const isCurrent = idx === currentQIndex;

                  let badgeColor = 'bg-slate-100 text-slate-600';
                  if (reviewed) badgeColor = 'bg-amber-500 text-white';
                  else if (answered) badgeColor = 'bg-emerald-500 text-white font-bold';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQIndex(idx)}
                      className={`h-9 rounded-xl text-xs font-bold transition-all ${badgeColor} ${
                        isCurrent ? 'ring-2 ring-slate-900 ring-offset-1 scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleSubmitTest}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-soft"
              >
                Submit Mock Test
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Normal List View of Mock Tests
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-bloom-pink-600 uppercase tracking-widest bg-bloom-pink-100 px-3 py-1 rounded-full">
            All-India Mock Simulator
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
            Exam-Specific Grand Mock Tests
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Simulate real exam pressure with negative marking, timers, automated evaluation, and detailed answers.
          </p>
        </div>

        <button
          onClick={() => onNavigate('performance')}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-bloom-green-100 hover:bg-bloom-green-200 text-bloom-green-800 font-bold text-xs shadow-soft transition-all"
        >
          <Award className="w-4 h-4" />
          <span>My Score Analysis</span>
        </button>
      </div>

      {/* 2. Mock Tests Cards List */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading available mock tests...</div>
      ) : mockTests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-soft-sm">
          No mock tests published yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm hover:shadow-soft-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {test.category_name}
                  </span>
                  <span className="text-xs font-bold text-bloom-green-700">
                    {test.attempts_count} Aspirants Attempted
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-relaxed">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {test.description}
                </p>

                {/* Test Parameters */}
                <div className="mt-4 grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 text-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Duration</span>
                    <span className="font-bold text-slate-800">{test.duration_minutes} Mins</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Questions</span>
                    <span className="font-bold text-slate-800">{test.total_questions} MCQs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Max Marks</span>
                    <span className="font-bold text-slate-800">{test.total_marks} Pts</span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-400">
                  <span>Passing Score: {test.passing_marks} pts • Negative Marking: 1/3</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Official CBT Pattern</span>
                <button
                  onClick={() => handleStartTest(test.id)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-soft transition-all"
                >
                  Start Mock Test 🚀
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Detailed Results & Solutions Modal */}
      <Modal
        isOpen={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        title="Mock Test Evaluation & Performance Analysis"
        subtitle="Detailed score breakdown and question review with full solutions."
        maxWidth="max-w-4xl"
      >
        {testResult && (
          <div className="space-y-6 text-slate-700">
            {/* Score Hero Card */}
            <div className={`p-6 rounded-3xl border text-center space-y-2 ${
              testResult.summary.isPassed ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
            }`}>
              <span className="text-3xl">{testResult.summary.isPassed ? '🎉' : '📈'}</span>
              <h3 className="text-2xl font-bold font-display text-slate-900">
                Score: {testResult.summary.totalScore} / {testResult.summary.maxMarks}
              </h3>
              <p className="text-xs font-semibold text-slate-600">
                {testResult.summary.isPassed ? 'Congratulations! You cleared the cut-off!' : 'Good effort! Review weak questions to boost your cut-off clearance.'}
              </p>

              <div className="grid grid-cols-4 gap-2 pt-4 max-w-lg mx-auto text-xs">
                <div className="p-2 rounded-xl bg-white shadow-sm">
                  <span className="text-slate-400 block text-[10px]">Attempted</span>
                  <span className="font-bold text-slate-800">{testResult.summary.attempted}</span>
                </div>
                <div className="p-2 rounded-xl bg-white shadow-sm">
                  <span className="text-emerald-600 block text-[10px]">Correct</span>
                  <span className="font-bold text-emerald-700">{testResult.summary.correct}</span>
                </div>
                <div className="p-2 rounded-xl bg-white shadow-sm">
                  <span className="text-rose-500 block text-[10px]">Wrong</span>
                  <span className="font-bold text-rose-700">{testResult.summary.wrong}</span>
                </div>
                <div className="p-2 rounded-xl bg-white shadow-sm">
                  <span className="text-purple-600 block text-[10px]">Accuracy</span>
                  <span className="font-bold text-purple-700">{testResult.summary.accuracy}%</span>
                </div>
              </div>
            </div>

            {/* Question Review List */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-3">Question-by-Question Solutions</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {testResult.questionResults.map((q, idx) => (
                  <div
                    key={q.question_id}
                    className={`p-4 rounded-2xl border ${
                      q.status === 'correct' ? 'bg-emerald-50/50 border-emerald-200' :
                      q.status === 'wrong' ? 'bg-rose-50/50 border-rose-200' :
                      'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-800">Q{idx + 1}. {q.subject_name}</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        q.status === 'correct' ? 'bg-emerald-100 text-emerald-800' :
                        q.status === 'wrong' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {q.status.toUpperCase()} ({q.marks_awarded > 0 ? `+${q.marks_awarded}` : q.marks_awarded} pts)
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-900 mb-2">{q.question_text}</p>
                    <p className="text-xs text-slate-600 mb-2">
                      Your Answer: <strong>{q.selected_option || 'Skipped'}</strong> • Correct Answer: <strong className="text-emerald-700">{q.correct_option}</strong>
                    </p>

                    <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/60 text-[11px] text-slate-600">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Results saved to your Performance Tracker</span>
              <button
                onClick={() => setResultModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Review
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
