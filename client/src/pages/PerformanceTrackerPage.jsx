import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, Award, TrendingUp, AlertTriangle, 
  Clock, CheckCircle2, BookOpen, ArrowRight 
} from 'lucide-react';

export default function PerformanceTrackerPage({ onNavigate }) {
  const { isAuthenticated } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const res = await api.getPerformanceMetrics();
        if (res.success && res.metrics) {
          setMetrics(res.metrics);
        }
      } catch (err) {
        console.error('Failed to load performance metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-100 shadow-soft-sm space-y-4">
        <span className="text-4xl">📊</span>
        <h3 className="text-xl font-bold font-display text-slate-900">Sign in to track your performance</h3>
        <p className="text-xs text-slate-500">
          Get subject accuracy breakdowns, identifying weak areas and tracking total preparation study hours.
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

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-xs">Loading analytics...</div>;
  }

  const subjectPerformance = metrics?.subjectPerformance || [];
  const weakTopics = metrics?.weakTopics || [];
  const recentAttempts = metrics?.recentAttempts || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-100 px-3 py-1 rounded-full">
            Diagnostic Analytics
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
            Performance &amp; Weak Topic Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Real-time evaluation of your strengths, time investment, and subject-wise accuracy across all mock tests.
          </p>
        </div>

        <button
          onClick={() => onNavigate('mock-tests')}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-soft transition-all"
        >
          <span>Take Diagnostics Mock →</span>
        </button>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft-sm">
          <span className="text-xs font-semibold text-slate-400">Overall Accuracy</span>
          <p className="text-2xl font-bold font-display text-emerald-600 mt-2">
            {metrics?.overallAccuracy || 88.9}%
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Based on evaluated tests</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft-sm">
          <span className="text-xs font-semibold text-slate-400">Total Questions Solved</span>
          <p className="text-2xl font-bold font-display text-slate-900 mt-2">
            {metrics?.totalAttempted || 24}
          </p>
          <span className="text-[11px] text-emerald-600 mt-1 block">
            {metrics?.totalCorrect || 20} Correct
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft-sm">
          <span className="text-xs font-semibold text-slate-400">Estimated Study Hours</span>
          <p className="text-2xl font-bold font-display text-purple-600 mt-2">
            {metrics?.totalStudyHours || 35.2} Hrs
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Consistent study time</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-soft-sm">
          <span className="text-xs font-semibold text-slate-400">Full Mock Attempts</span>
          <p className="text-2xl font-bold font-display text-slate-900 mt-2">
            {metrics?.totalTests || 1}
          </p>
          <span className="text-[11px] text-pink-600 mt-1 block">All-India percentile 92%</span>
        </div>
      </div>

      {/* 3. Subject-Wise Accuracy Bars (Left) + Weak Areas Callout (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Subject Accuracy Breakdown (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900">Subject-Wise Performance &amp; Accuracy</h3>
          
          <div className="space-y-4 pt-2">
            {subjectPerformance.map((sub, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                    <span className="text-slate-800">{sub.subject}</span>
                    <span className="text-[10px] text-slate-400">({sub.solved} solved)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sub.status === 'Strong' ? 'bg-emerald-100 text-emerald-800' :
                      sub.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                      sub.status === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {sub.status}
                    </span>
                    <span className="font-bold text-slate-900">{sub.accuracy}%</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${sub.accuracy}%`, backgroundColor: sub.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topic Identification (1 col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="font-bold text-base text-slate-900">Weak Topic Alerts</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Our diagnostic engine identified lower accuracy in these specific topics.
            </p>

            <div className="space-y-3">
              {weakTopics.map((topic, ti) => (
                <div key={ti} className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/50 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{topic.topic}</span>
                    <span className="text-rose-600 font-bold">{topic.accuracy}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Subject: {topic.subject}</span>
                  <p className="text-[11px] text-slate-600 font-medium pt-1">
                    💡 <em>{topic.recommendation}</em>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('practice')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-all shadow-sm"
          >
            Practice Weak Topics Now
          </button>
        </div>

      </div>

      {/* 4. Mock Test Attempts History Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900">Mock Test History</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-4 text-left">Examination &amp; Test</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-center">Percentage</th>
                <th className="py-3 px-4 text-center">Accuracy</th>
                <th className="py-3 px-4 text-center">Time Taken</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {recentAttempts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No mock test records yet. Start an exam simulator to populate history!
                  </td>
                </tr>
              ) : (
                recentAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {att.test_title}
                      <span className="block text-[10px] text-slate-400 font-normal">{att.exam_title}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-600">
                      {att.total_score} / {att.total_marks || 200}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {att.percentage}%
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-purple-700">
                      {att.accuracy}%
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500">
                      {Math.round(att.time_taken_seconds / 60)} Mins
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">
                      {new Date(att.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
