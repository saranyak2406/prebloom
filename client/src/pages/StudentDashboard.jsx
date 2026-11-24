import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/ThemeNotificationContext';
import { 
  Flame, BookOpen, Clock, CheckCircle2, Award, 
  ArrowRight, Sparkles, Calendar, TrendingUp, AlertCircle, Bookmark, Star
} from 'lucide-react';

export default function StudentDashboard({ onNavigate, onSelectExam }) {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Daily goals local state
  const [goals, setGoals] = useState([
    { id: 1, text: 'Solve 15 Polity MCQs (Preamble & Rights)', done: true },
    { id: 2, text: 'Read Daily Current Affairs (Nov 24)', done: true },
    { id: 3, text: 'Revise AP Reorganisation Act 2014 notes', done: false },
    { id: 4, text: 'Attempt 1 Sectional Mock Test', done: false }
  ]);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.getDashboardData();
        if (res.success && res.dashboard) {
          setData(res.dashboard);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const toggleGoal = (id) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const nextState = !g.done;
        if (nextState) addToast('Goal accomplished! Keep blooming! 🌸', 'success');
        return { ...g, done: nextState };
      }
      return g;
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-bloom-pink-100 flex items-center justify-center animate-spin mx-auto">
            <span className="text-xl">🌷</span>
          </div>
          <p className="text-xs font-semibold text-slate-500">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  const streak = data?.streakCount || user?.streak_count || 14;
  const completedLessons = data?.completedLessons || 0;
  const testStats = data?.testStats || { totalAttempts: 1, avgScore: 15.3, avgAccuracy: 88.9 };
  const enrolledExams = data?.enrolledExams || [];
  const continueLearning = data?.continueLearning;
  const recentTests = data?.recentTests || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. PERSONALIZED WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-bloom-green-100/90 via-bloom-pink-100/70 to-bloom-lavender-100/90 p-6 sm:p-8 border border-white shadow-soft">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-xs font-bold text-slate-700 shadow-soft-sm">
              <span>🌷 Target: {user?.target_exam || 'UPSC Civil Services'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
              Welcome back, {user?.name || 'Aspirant'}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Consistency is your super-power. Complete today's targets to maintain your study streak and climb the all-India mock rankings.
            </p>
          </div>

          {/* Streak Celebration Pill */}
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-soft-sm border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl animate-pulse">
              🔥
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold font-display text-slate-900">{streak} Days</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  On Fire
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Daily Study Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. QUICK STATS METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft-sm hover:shadow-soft transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Completed Lessons</span>
            <div className="w-9 h-9 rounded-xl bg-bloom-green-100 flex items-center justify-center text-bloom-green-700">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">{completedLessons + 18}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            +3 completed this week
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft-sm hover:shadow-soft transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Mock Tests Attempted</span>
            <div className="w-9 h-9 rounded-xl bg-bloom-lavender-100 flex items-center justify-center text-bloom-lavender-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">{testStats.totalAttempts || 4}</p>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 block">
            Avg Score: {testStats.avgScore || 15.3} pts
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft-sm hover:shadow-soft transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Overall Accuracy</span>
            <div className="w-9 h-9 rounded-xl bg-bloom-pink-100 flex items-center justify-center text-bloom-pink-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">{testStats.avgAccuracy || 88.9}%</p>
          <span className="text-[11px] text-pink-600 font-semibold mt-1 block">
            Top 10% percentile
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft-sm hover:shadow-soft transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Weekly Study Hours</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">31.7 Hrs</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
            Target: 35 Hrs / Week
          </span>
        </div>
      </div>

      {/* 3. CONTINUE LEARNING & DAILY GOALS (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Continue Learning Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-bloom-green-100 text-bloom-green-700 uppercase tracking-wider">
                Continue Learning
              </span>
              <button 
                onClick={() => onNavigate('study-materials')}
                className="text-xs font-bold text-bloom-lavender-600 hover:text-bloom-lavender-800"
              >
                Browse All Notes →
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              {continueLearning?.title || 'Decoding the Preamble of the Indian Constitution'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Subject: {continueLearning?.subject_name || 'Indian Polity & Governance'} • Topic: {continueLearning?.topic_name || 'Constitution'}
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">Key Focus Areas:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Sovereign, Socialist, Secular, Democratic Republic definitions</li>
                <li>Landmark Kesavananda Bharati case (1973) 13-judge bench ruling</li>
                <li>42nd Amendment Act additions &amp; non-justiciable nature</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Estimated Reading Time: 8 Mins</span>
            <button
              onClick={() => onNavigate('study-materials')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-soft transition-all"
            >
              <span>Resume Reading</span>
              <ArrowRight className="w-3.5 h-3.5 text-bloom-green-300" />
            </button>
          </div>
        </div>

        {/* Daily Study Goals Checklist */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900">Daily Study Goals</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-bloom-pink-100 text-bloom-pink-700">
                {goals.filter(g => g.done).length}/{goals.length} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    goal.done 
                      ? 'bg-emerald-50/50 border-emerald-200/60 text-slate-500 line-through' 
                      : 'bg-white border-slate-200 text-slate-800 hover:border-bloom-pink-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                    goal.done ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300'
                  }`}>
                    {goal.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-medium">{goal.text}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('practice')}
            className="w-full mt-4 py-2.5 rounded-xl bg-bloom-pink-100 hover:bg-bloom-pink-200 text-bloom-pink-800 font-bold text-xs text-center transition-all"
          >
            Start Daily Practice MCQs 📝
          </button>
        </div>
      </div>

      {/* 4. SELECTED EXAMINATIONS & PREPARATION PROGRESS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">My Selected Examinations</h3>
            <p className="text-xs text-slate-500">Track syllabus coverage and upcoming application deadlines.</p>
          </div>
          <button
            onClick={() => onNavigate('my-exams')}
            className="text-xs font-bold text-slate-800 hover:text-bloom-lavender-600"
          >
            Manage Enrolled Exams →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {enrolledExams.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-xs text-slate-400">
              No exams selected yet. Click "Manage Enrolled Exams" to enroll in UPSC, APPSC or SSC.
            </div>
          ) : (
            enrolledExams.map((ex) => (
              <div 
                key={ex.id}
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-bloom-lavender-200 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {ex.category_name}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1 line-clamp-1">{ex.title}</h4>
                  </div>
                  {ex.is_favourite && <span className="text-amber-500 text-sm">⭐</span>}
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-500">Syllabus Covered</span>
                    <span className="text-bloom-green-700">{ex.preparation_percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-bloom-green-400 to-bloom-pink-400 rounded-full transition-all duration-500"
                      style={{ width: `${ex.preparation_percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Vacancies: {ex.vacancies ? ex.vacancies.toLocaleString() : 'N/A'}</span>
                  <span className="font-bold text-slate-700">{ex.notification_status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 5. WEEKLY ANALYTICS & RECENT QUIZ SCORES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Study Hours Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Weekly Study Analytics</h3>
            <span className="text-xs text-slate-400">Total: 31.7 Hours</span>
          </div>

          <div className="pt-4 flex items-end justify-between h-44 gap-2 px-2">
            {[
              { day: 'Mon', h: 4.2, p: 70 },
              { day: 'Tue', h: 5.0, p: 85 },
              { day: 'Wed', h: 3.8, p: 63 },
              { day: 'Thu', h: 4.5, p: 75 },
              { day: 'Fri', h: 5.2, p: 88 },
              { day: 'Sat', h: 6.0, p: 100 },
              { day: 'Sun', h: 3.0, p: 50 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-slate-600">{d.h}h</span>
                <div className="w-full max-w-[28px] h-32 bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end">
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-bloom-lavender-400 via-bloom-pink-300 to-bloom-green-300 transition-all duration-700"
                    style={{ height: `${d.p}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quiz Scores */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Recent Quiz &amp; Mock Scores</h3>
            <button
              onClick={() => onNavigate('mock-tests')}
              className="text-xs font-bold text-slate-800 hover:text-bloom-lavender-600"
            >
              Take New Mock →
            </button>
          </div>

          <div className="space-y-3">
            {recentTests.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No recent mock tests. Attempt a simulated mock to see your score analysis here!
              </div>
            ) : (
              recentTests.map((test) => (
                <div
                  key={test.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{test.test_title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Accuracy: {test.accuracy}% • Total Marks: {test.total_marks}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-600 font-display">
                      {test.total_score} pts
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      {new Date(test.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
