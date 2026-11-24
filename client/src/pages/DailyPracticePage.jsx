import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/ThemeNotificationContext';
import { 
  CheckCircle2, XCircle, Flame, Sparkles, HelpCircle, 
  ArrowRight, RotateCcw, Award, Check, Filter 
} from 'lucide-react';

export default function DailyPracticePage({ onNavigate }) {
  const { user } = useAuth();
  const { addToast, triggerConfetti } = useNotification();

  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Interactive Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Session Stats
  const [sessionScore, setSessionScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  useEffect(() => {
    async function loadQuizData() {
      setLoading(true);
      try {
        const [subsRes, qRes] = await Promise.all([
          api.getSubjects(),
          api.getPracticeQuestions({
            subject_id: selectedSubject,
            difficulty: selectedDifficulty,
            limit: 15
          })
        ]);
        if (subsRes.success) setSubjects(subsRes.subjects);
        if (qRes.success) {
          setQuestions(qRes.questions);
          setCurrentIndex(0);
          setSelectedOption(null);
          setVerificationResult(null);
        }
      } catch (err) {
        console.error('Failed to load quiz data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuizData();
  }, [selectedSubject, selectedDifficulty]);

  const handleSelectOption = (opt) => {
    if (verificationResult) return; // Already submitted
    setSelectedOption(opt);
  };

  const handleVerify = async () => {
    if (!selectedOption || !currentQuestion) return;
    setVerifying(true);

    try {
      const res = await api.verifyAnswer({
        question_id: currentQuestion.id,
        selected_option: selectedOption
      });

      if (res.success) {
        setVerificationResult(res);
        if (res.isCorrect) {
          setSessionScore(prev => prev + res.score);
          setCorrectCount(prev => prev + 1);
          triggerConfetti();
          addToast('Correct Answer! +1.0 Mark 🌸', 'success');
        } else {
          setSessionScore(prev => Math.max(0, prev + res.score));
          setWrongCount(prev => prev + 1);
          addToast('Incorrect. Review the explanation below.', 'error');
        }
      }
    } catch (err) {
      addToast('Verification failed', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setVerificationResult(null);
    } else {
      addToast('Daily practice round completed! Great dedication! 🌷', 'success');
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setVerificationResult(null);
    setSessionScore(0);
    setCorrectCount(0);
    setWrongCount(0);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* 1. Header Banner & Streak Counter */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-bloom-green-700 uppercase tracking-widest bg-bloom-green-100 px-3 py-1 rounded-full">
            Daily MCQ Workout
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
            Instant Verification &amp; Practice
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Solve four-option standard MCQs with instant feedback, negative marking calculation, and comprehensive explanations.
          </p>
        </div>

        {/* Live Score & Streak Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <div>
              <span className="text-sm font-bold text-amber-900">{user?.streak_count || 14} Days</span>
              <p className="text-[10px] text-amber-700 font-medium">Daily Streak</p>
            </div>
          </div>

          <div className="bg-bloom-lavender-50 border border-bloom-lavender-200 px-4 py-2 rounded-2xl">
            <span className="text-sm font-bold text-bloom-lavender-900">{sessionScore.toFixed(2)} pts</span>
            <p className="text-[10px] text-bloom-lavender-700 font-medium">Session Score</p>
          </div>
        </div>
      </div>

      {/* 2. Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-soft-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-700">Filter Topic:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Difficulty:</span>
          <div className="flex items-center gap-1">
            {['all', 'easy', 'medium', 'hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-xl capitalize font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Main Practice Card */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading practice questions...</div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-soft-sm space-y-3">
          <p className="font-bold text-slate-800">No questions found for this filter combination.</p>
          <button
            onClick={() => { setSelectedSubject('all'); setSelectedDifficulty('all'); }}
            className="text-xs text-bloom-lavender-600 underline font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-lg space-y-6">
          {/* Question Header & Meta */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {currentQuestion.subject_name}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-600 font-bold">+{currentQuestion.marks} Marks</span>
              <span className="text-slate-300">/</span>
              <span className="text-rose-500 font-semibold">-{currentQuestion.negative_marks} Neg</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQuestion.question_text}
            </h3>
            {currentQuestion.previous_year_ref && (
              <span className="inline-block text-[11px] font-bold text-bloom-pink-600 bg-bloom-pink-50 px-2.5 py-0.5 rounded-full border border-bloom-pink-100">
                📌 PYQ: {currentQuestion.previous_year_ref}
              </span>
            )}
          </div>

          {/* 4 Options Grid */}
          <div className="space-y-3 pt-2">
            {['A', 'B', 'C', 'D'].map((optKey) => {
              const optionText = currentQuestion[`option_${optKey.toLowerCase()}`];
              const isSelected = selectedOption === optKey;
              const isVerified = !!verificationResult;
              const isCorrectOpt = isVerified && verificationResult.correctOption.toUpperCase() === optKey;
              const isWrongSelected = isVerified && isSelected && !verificationResult.isCorrect;

              let optionStyle = 'bg-slate-50/70 border-slate-200 text-slate-800 hover:border-slate-300';
              if (isSelected && !isVerified) {
                optionStyle = 'bg-bloom-lavender-50 border-bloom-lavender-500 text-bloom-lavender-900 shadow-sm ring-1 ring-bloom-lavender-400';
              } else if (isCorrectOpt) {
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-300';
              } else if (isWrongSelected) {
                optionStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-bold ring-2 ring-rose-200';
              }

              return (
                <div
                  key={optKey}
                  onClick={() => handleSelectOption(optKey)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center ${
                      isCorrectOpt ? 'bg-emerald-500 text-white' :
                      isWrongSelected ? 'bg-rose-500 text-white' :
                      isSelected ? 'bg-bloom-lavender-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                    }`}>
                      {optKey}
                    </span>
                    <span className="text-xs sm:text-sm font-medium">{optionText}</span>
                  </div>

                  {isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {isWrongSelected && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                </div>
              );
            })}
          </div>

          {/* Action Buttons: Verify / Next */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Round</span>
            </button>

            {!verificationResult ? (
              <button
                onClick={handleVerify}
                disabled={!selectedOption || verifying}
                className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-soft disabled:opacity-40 transition-all"
              >
                {verifying ? 'Checking...' : 'Verify Answer ⚡'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-bloom-green-400 to-bloom-pink-400 text-slate-900 font-bold text-xs shadow-soft hover:scale-[1.02] transition-all"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Round 🌸'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Explanation Callout */}
          {verificationResult && (
            <div className={`p-5 rounded-2xl border transition-all animate-fadeIn ${
              verificationResult.isCorrect ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">
                  {verificationResult.isCorrect ? '🎉' : '💡'}
                </span>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  {verificationResult.isCorrect ? 'Correct! Detailed Explanation:' : 'Incorrect. Answer Breakdown:'}
                </h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {verificationResult.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
