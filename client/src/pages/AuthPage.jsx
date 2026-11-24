import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/ThemeNotificationContext';
import { ArrowLeft, Sparkles, Lock, Mail, User, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AuthPage({ onNavigate }) {
  const { login, register, quickDemoLogin } = useAuth();
  const { addToast } = useNotification();

  const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [targetExam, setTargetExam] = useState('UPSC Civil Services');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login({ email, password });
        addToast(`Welcome back, ${res.user.name}! 🌷`, 'success');
        onNavigate(res.user.role === 'admin' ? 'admin' : 'dashboard');
      } else if (mode === 'register') {
        const res = await register({ name, email, password, phone, target_exam: targetExam });
        addToast(`Registration successful! Welcome to PrepBloom, ${res.user.name}! 🌸`, 'success');
        onNavigate('dashboard');
      } else if (mode === 'forgot') {
        addToast('Password reset link sent to your email address.', 'info');
        setMode('login');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setLoading(true);
    try {
      const res = await quickDemoLogin(role);
      addToast(`Logged in as demo ${role}! 🌷`, 'success');
      onNavigate(role === 'admin' ? 'admin' : 'dashboard');
    } catch (err) {
      setError('Demo login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bloom-mesh flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Return home button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-bloom-green-300 via-bloom-pink-200 to-bloom-lavender-300 shadow-soft-sm mb-3">
            <span className="text-2xl">🌷</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
            {mode === 'login' ? 'Sign in to PrepBloom' : mode === 'register' ? 'Join PrepBloom Today' : 'Reset Your Password'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login' 
              ? 'Access your daily streak, personalized syllabus & mock tests.'
              : mode === 'register'
              ? 'Create a free student account for all Indian government exams.'
              : 'Enter your registered email and we will send recovery instructions.'}
          </p>
        </div>

        {/* Demo Fast Login Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-slate-200/80 shadow-soft-sm mb-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-bloom-lavender-600" />
            <span className="text-xs font-semibold text-slate-700">Quick Test:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDemo('student')}
              className="px-3 py-1.5 rounded-xl bg-bloom-green-100 hover:bg-bloom-green-200 text-bloom-green-800 font-bold text-xs transition-all"
            >
              Student Demo
            </button>
            <button
              onClick={() => handleDemo('admin')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white py-8 px-6 shadow-soft-lg rounded-3xl sm:px-10 border border-slate-100">
          {/* Mode Switcher */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 mb-6">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Saranya Kumar"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-lavender-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Target Examination</label>
                  <select
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-lavender-400 bg-white"
                  >
                    <option value="UPSC Civil Services">UPSC Civil Services (IAS / IPS)</option>
                    <option value="APPSC Group 2">APPSC Group 2 Services</option>
                    <option value="APPSC Group 1">APPSC Group 1 Services</option>
                    <option value="SSC CGL">SSC CGL (Tier 1 &amp; 2)</option>
                    <option value="RRB NTPC">Railways RRB NTPC</option>
                    <option value="IBPS PO">IBPS Probationary Officer</option>
                    <option value="AFCAT Defence">AFCAT Air Force</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@prepbloom.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-lavender-400"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-semibold text-bloom-lavender-600 hover:text-bloom-lavender-800"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-bloom-lavender-400"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-soft hover:scale-[1.01] transition-all disabled:opacity-50 mt-2"
            >
              {loading 
                ? 'Processing...' 
                : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Student Account' : 'Send Reset Instructions'}
            </button>
          </form>

          {mode === 'forgot' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
