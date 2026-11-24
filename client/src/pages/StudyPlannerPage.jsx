import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/ThemeNotificationContext';
import Modal from '../components/common/Modal';
import { 
  Calendar, CheckCircle2, Clock, Plus, Sparkles, 
  Layers, ArrowRight, ShieldCheck, Flame, RotateCcw 
} from 'lucide-react';

export default function StudyPlannerPage({ onNavigate }) {
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();

  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Combined Plan Generator Modal State
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [enrolledExams, setEnrolledExams] = useState([]);
  const [selectedExamIds, setSelectedExamIds] = useState([]);
  const [dailyHours, setDailyHours] = useState(4.5);
  const [targetMonths, setTargetMonths] = useState(6);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadPlan() {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const [planRes, myExamsRes] = await Promise.all([
          api.getStudyPlan(),
          api.getMyExams()
        ]);
        if (planRes.success && planRes.plan) {
          setActivePlan(planRes.plan);
        }
        if (myExamsRes.success) {
          setEnrolledExams(myExamsRes.myExams);
          setSelectedExamIds(myExamsRes.myExams.map(e => e.id));
        }
      } catch (err) {
        console.error('Failed to load study plan:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, [isAuthenticated]);

  const handleToggleTask = async (taskIndex) => {
    if (!activePlan) return;
    try {
      const res = await api.togglePlannerTask({
        planId: activePlan.id,
        taskIndex
      });
      if (res.success && res.plan) {
        setActivePlan(res.plan);
        addToast('Task status updated! 🌸 Keep the momentum!', 'success');
      }
    } catch (e) {
      addToast('Failed to update task', 'error');
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.generateCombinedPlan({
        examIds: selectedExamIds,
        dailyHours,
        targetMonths
      });

      if (res.success) {
        // Save this new generated plan as active
        const saveRes = await api.saveStudyPlan({
          title: res.title,
          target_date: res.targetDate,
          daily_hours: res.dailyHours,
          schedule: res.schedule
        });

        if (saveRes.success && saveRes.plan) {
          setActivePlan(saveRes.plan);
          setGeneratorOpen(false);
          addToast('Combined multi-exam schedule generated and activated! 🌷', 'success');
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to generate plan', 'error');
    } finally {
      setGenerating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-100 shadow-soft-sm space-y-4">
        <span className="text-4xl">📅</span>
        <h3 className="text-xl font-bold font-display text-slate-900">Sign in to plan your study roadmap</h3>
        <p className="text-xs text-slate-500">
          Create structured daily timetables, weekly targets, revision reminders and combine preparation for multiple exams.
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

  const schedule = activePlan?.schedule_json || [];
  const completedTasks = activePlan?.completed_tasks || 0;
  const totalTasks = activePlan?.total_tasks || schedule.length || 1;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100) || 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header & Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-teal-100 px-3 py-1 rounded-full">
            Time &amp; Routine Management
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
            Personalized Study Planner
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            {activePlan?.title || 'Daily Timetable & Revision Target Tracker'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setGeneratorOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-bloom-green-300 to-bloom-lavender-300 text-slate-900 font-bold text-xs shadow-soft hover:scale-[1.02] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Combined Plan</span>
          </button>
        </div>
      </div>

      {/* 2. Target Progress Metric Banner */}
      <div className="bg-gradient-to-r from-bloom-green-50 via-bloom-pink-50 to-bloom-lavender-50 rounded-3xl p-6 border border-slate-100 shadow-soft-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Date</span>
          <p className="text-base font-bold text-slate-900 mt-0.5">
            {activePlan?.target_date ? new Date(activePlan.target_date).toLocaleDateString() : 'Continuous Preparation'}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Daily Study Target</span>
          <p className="text-base font-bold text-slate-900 mt-0.5">
            {activePlan?.daily_hours || 4.5} Hours / Day
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed Sessions</span>
          <p className="text-base font-bold text-emerald-700 mt-0.5">
            {completedTasks} of {totalTasks} Tasks
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Adherence Rate</span>
          <p className="text-base font-bold text-purple-700 mt-0.5">
            {progressPercent}% Complete
          </p>
        </div>
      </div>

      {/* 3. Timetable Schedule List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900">Weekly Timetable Schedule</h3>
        <p className="text-xs text-slate-500">
          Click the checkmark when you complete a session to record your daily progress.
        </p>

        <div className="space-y-3 pt-2">
          {schedule.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No tasks currently in this timetable. Click "Generate Combined Plan" to auto-build your schedule!
            </div>
          ) : (
            schedule.map((task, idx) => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={idx}
                  onClick={() => handleToggleTask(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isDone 
                      ? 'bg-emerald-50/50 border-emerald-200/60 opacity-80' 
                      : 'bg-slate-50/70 border-slate-200 hover:border-bloom-lavender-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                      isDone ? 'bg-emerald-500 text-white font-bold' : 'border-2 border-slate-300 text-transparent'
                    }`}>
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{task.day}</span>
                        <span className="text-[11px] font-semibold text-slate-500">• {task.time}</span>
                      </div>
                      <h4 className={`text-xs sm:text-sm font-semibold mt-0.5 ${
                        isDone ? 'line-through text-slate-500' : 'text-slate-900 font-bold'
                      }`}>
                        {task.subject}: {task.topic}
                      </h4>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isDone ? 'Completed' : 'Pending'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Combined Multi-Exam Plan Generator Modal */}
      <Modal
        isOpen={generatorOpen}
        onClose={() => setGeneratorOpen(false)}
        title="Smart Multi-Exam Combined Timetable Generator"
        subtitle="PrepBloom analyzes subject overlap across your exams to balance theory, revision and mock tests."
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6 text-slate-700">
          {/* Target Exams Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Select Examinations to Combine:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {enrolledExams.map((ex) => {
                const isSelected = selectedExamIds.includes(ex.id);
                return (
                  <div
                    key={ex.id}
                    onClick={() => {
                      if (isSelected) setSelectedExamIds(prev => prev.filter(id => id !== ex.id));
                      else setSelectedExamIds(prev => [...prev, ex.id]);
                    }}
                    className={`p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-bloom-lavender-50 border-bloom-lavender-500 text-bloom-lavender-900 font-bold' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="truncate max-w-[200px]">{ex.title}</span>
                    <span>{isSelected ? '✓' : '+'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Study Hours Slider */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Daily Study Commitment:</span>
              <span className="text-bloom-green-700">{dailyHours} Hours / Day</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value))}
              className="w-full accent-bloom-green-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>2h (Working Aspirant)</span>
              <span>4.5h (Balanced)</span>
              <span>8h+ (Full-time)</span>
            </div>
          </div>

          {/* Target Timeline */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Preparation Timeline:</span>
              <span className="text-purple-700">{targetMonths} Months</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[3, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setTargetMonths(m)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    targetMonths === m ? 'bg-purple-600 text-white' : 'bg-white border text-slate-700'
                  }`}
                >
                  {m} Months Roadmap
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setGeneratorOpen(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-soft transition-all"
            >
              {generating ? 'Generating Schedule...' : 'Generate & Activate Timetable 🌸'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
