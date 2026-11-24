import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Compass, Star, BookOpen, CheckSquare, 
  Clock, Newspaper, FileText, Calendar, BarChart3, 
  ShieldCheck, LogOut, Sparkles, ChevronRight, Bookmark
} from 'lucide-react';

export default function Sidebar({ currentTab, onNavigate, isMobileOpen, setIsMobileOpen }) {
  const { user, isAdmin, logout } = useAuth();

  const studentNavItems = [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard, badge: null, color: 'text-violet-600' },
    { id: 'exams', label: 'Exam Explorer', icon: Compass, badge: 'Popular', color: 'text-emerald-600' },
    { id: 'my-exams', label: 'My Exams', icon: Star, badge: null, color: 'text-amber-500' },
    { id: 'study-materials', label: 'Study Materials', icon: BookOpen, badge: null, color: 'text-pink-600' },
    { id: 'practice', label: 'Daily Practice', icon: CheckSquare, badge: 'Streak', color: 'text-emerald-600' },
    { id: 'mock-tests', label: 'Mock Tests', icon: Clock, badge: 'Live', color: 'text-rose-600' },
    { id: 'current-affairs', label: 'Current Affairs', icon: Newspaper, badge: 'Daily', color: 'text-blue-600' },
    { id: 'pyq', label: 'Previous Papers', icon: FileText, badge: null, color: 'text-indigo-600' },
    { id: 'planner', label: 'Study Planner', icon: Calendar, badge: null, color: 'text-teal-600' },
    { id: 'performance', label: 'Performance Tracker', icon: BarChart3, badge: null, color: 'text-purple-600' },
    { id: 'bookmarks', label: 'Saved Bookmarks', icon: Bookmark, badge: null, color: 'text-amber-600' }
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Admin Overview', icon: ShieldCheck, badge: null, color: 'text-rose-600' },
    { id: 'exams', label: 'Browse Exams', icon: Compass, badge: null, color: 'text-emerald-600' },
    { id: 'mock-tests', label: 'Mock Test Simulator', icon: Clock, badge: null, color: 'text-amber-600' },
    { id: 'study-materials', label: 'Study Content', icon: BookOpen, badge: null, color: 'text-pink-600' },
    { id: 'current-affairs', label: 'News Feeds', icon: Newspaper, badge: null, color: 'text-blue-600' }
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  const handleItemClick = (id) => {
    onNavigate(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)} 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col justify-between
        transition-transform duration-300 ease-in-out shadow-soft-sm
        lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Header Logo */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">
            <div 
              onClick={() => handleItemClick('landing')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-bloom-green-300 via-bloom-pink-200 to-bloom-lavender-300 flex items-center justify-center shadow-soft-sm group-hover:scale-105 transition-transform">
                <span className="text-xl">🌷</span>
              </div>
              <div>
                <span className="text-xl font-bold font-display text-slate-900">PrepBloom</span>
                <p className="text-[10px] font-semibold text-bloom-pink-600 tracking-wider uppercase">
                  {isAdmin ? 'Academic Admin' : 'SaaS Learning'}
                </p>
              </div>
            </div>
          </div>

          {/* User Profile Mini Banner */}
          {user && (
            <div className="mx-4 my-3 p-3 rounded-2xl bg-gradient-to-br from-bloom-green-50/70 via-bloom-pink-50/50 to-bloom-lavender-50/70 border border-slate-100 flex items-center gap-3">
              <img 
                src={user.avatar || 'https://api.dicebear.com/7.x/notionists/svg?seed=Saranya'} 
                alt={user.name} 
                className="w-10 h-10 rounded-xl bg-white p-0.5 border border-slate-200 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.target_exam || 'UPSC Civil Services'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] font-bold text-amber-600">🔥 {user.streak_count || 1} Days</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 font-semibold">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-bloom-lavender-100 via-bloom-pink-50 to-bloom-green-50 text-slate-900 font-bold shadow-soft-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110
                      ${isActive ? 'bg-white shadow-soft-sm text-bloom-lavender-700' : 'bg-slate-50 ' + item.color}
                    `}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`
                      text-[10px] font-bold px-2 py-0.5 rounded-full
                      ${item.badge === 'Live' ? 'bg-rose-100 text-rose-600 animate-pulse' :
                        item.badge === 'Streak' ? 'bg-amber-100 text-amber-700' :
                        'bg-bloom-green-100 text-bloom-green-700'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => handleItemClick('landing')}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
          >
            <span>🌷 Visit Public Website</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}

