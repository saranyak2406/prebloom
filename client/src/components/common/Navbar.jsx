import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Menu, X, ArrowRight, User, BookOpen, Compass, ShieldCheck } from 'lucide-react';

export default function Navbar({ onNavigate, currentTab }) {
  const { user, isAuthenticated, isAdmin, logout, quickDemoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => onNavigate('landing')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-bloom-green-300 via-bloom-pink-200 to-bloom-lavender-300 flex items-center justify-center shadow-soft-sm group-hover:scale-105 transition-transform">
              <span className="text-2xl transform group-hover:rotate-12 transition-transform">🌷</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold font-display bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                  PrepBloom
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-bloom-pink-100 text-bloom-pink-600 border border-bloom-pink-200">
                  India
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-wide">Learn. Grow. Succeed.</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'landing'
                  ? 'text-slate-900 bg-slate-100/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('exams')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'exams'
                  ? 'text-bloom-green-700 bg-bloom-green-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Exam Explorer
            </button>
            <button
              onClick={() => onNavigate('study-materials')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'study-materials'
                  ? 'text-bloom-lavender-700 bg-bloom-lavender-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Study Materials
            </button>
            <button
              onClick={() => onNavigate('practice')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'practice'
                  ? 'text-bloom-pink-700 bg-bloom-pink-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Daily Practice
            </button>
            <button
              onClick={() => onNavigate('mock-tests')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'mock-tests'
                  ? 'text-bloom-green-700 bg-bloom-green-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Mock Tests
            </button>
            <button
              onClick={() => onNavigate('current-affairs')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'current-affairs'
                  ? 'text-indigo-700 bg-indigo-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Current Affairs
            </button>
            <button
              onClick={() => onNavigate('pyq')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'pyq'
                  ? 'text-amber-700 bg-amber-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              PYQs
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate(isAdmin ? 'admin' : 'dashboard')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-bloom-green-400 via-bloom-pink-300 to-bloom-lavender-300 text-slate-800 font-semibold text-sm shadow-soft hover:shadow-soft-lg hover:scale-[1.02] transition-all"
                >
                  <Sparkles className="w-4 h-4 text-slate-700" />
                  <span>{isAdmin ? 'Admin Console' : 'My Dashboard'}</span>
                </button>

                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => quickDemoLogin('student')}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-bloom-lavender-700 bg-bloom-lavender-50 hover:bg-bloom-lavender-100 rounded-xl border border-bloom-lavender-200 transition-all"
                  title="Instant Student Demo Login"
                >
                  ⚡ Student Demo
                </button>
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('auth')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-soft hover:scale-[1.02] transition-all"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 pb-3">
            <button
              onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
              className="p-3 text-left rounded-xl text-sm font-medium hover:bg-slate-50 text-slate-700"
            >
              🏠 Home
            </button>
            <button
              onClick={() => { onNavigate('exams'); setMobileMenuOpen(false); }}
              className="p-3 text-left rounded-xl text-sm font-medium hover:bg-bloom-green-50 text-slate-700"
            >
              🎯 Exam Explorer
            </button>
            <button
              onClick={() => { onNavigate('study-materials'); setMobileMenuOpen(false); }}
              className="p-3 text-left rounded-xl text-sm font-medium hover:bg-bloom-lavender-50 text-slate-700"
            >
              📚 Study Materials
            </button>
            <button
              onClick={() => { onNavigate('practice'); setMobileMenuOpen(false); }}
              className="p-3 text-left rounded-xl text-sm font-medium hover:bg-bloom-pink-50 text-slate-700"
            >
              📝 Daily Practice
            </button>
            <button
              onClick={() => { onNavigate('mock-tests'); setMobileMenuOpen(false); }}
              className="p-3 text-left rounded-xl text-sm font-medium hover:bg-slate-50 text-slate-700"
            >
              ⏱️ Mock Tests
            </button>
            <button
              onClick={() => { onNavigate('current-affairs'); setMobileMenuOpen(false); }}
              className="p-3 text-left rounded-xl text-sm font-medium hover:bg-slate-50 text-slate-700"
            >
              📰 Current Affairs
            </button>
            <button
              onClick={() => { onNavigate('pyq'); setMobileMenuOpen(false); }}
              className="p-3 text-left rounded-xl text-sm font-medium hover:bg-slate-50 text-slate-700"
            >
              📑 Previous Papers
            </button>
            <button
              onClick={() => { onNavigate('planner'); setMobileMenuOpen(false); }}
              className="p-3 text-left rounded-xl text-sm font-medium hover:bg-slate-50 text-slate-700"
            >
              📅 Study Planner
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { onNavigate(isAdmin ? 'admin' : 'dashboard'); setMobileMenuOpen(false); }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-bloom-green-400 to-bloom-pink-300 text-slate-900 font-bold text-center text-sm shadow-soft"
                >
                  Go to {isAdmin ? 'Admin Console' : 'My Student Dashboard'}
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 rounded-xl text-center text-xs text-rose-600 font-medium hover:bg-rose-50"
                >
                  Log Out ({user?.name})
                </button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { quickDemoLogin('student'); setMobileMenuOpen(false); }}
                    className="py-2.5 px-3 rounded-xl bg-bloom-lavender-100 text-bloom-lavender-700 text-xs font-semibold text-center"
                  >
                    ⚡ Student Demo
                  </button>
                  <button
                    onClick={() => { quickDemoLogin('admin'); setMobileMenuOpen(false); }}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold text-center"
                  >
                    🛡️ Admin Demo
                  </button>
                </div>
                <button
                  onClick={() => { onNavigate('auth'); setMobileMenuOpen(false); }}
                  className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-center text-sm"
                >
                  Sign In / Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
