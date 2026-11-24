import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Menu, Bell, Search, Flame, Sparkles, Check, ChevronDown } from 'lucide-react';

export default function TopHeader({ onToggleMobileSidebar, onNavigate, title }) {
  const { user, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchNotifications() {
      if (user) {
        try {
          const res = await api.getNotifications();
          if (res.success && res.notifications) {
            setNotifications(res.notifications);
            setUnreadCount(res.notifications.filter(n => !n.is_read).length);
          }
        } catch (e) {
          // Ignore
        }
      }
    }
    fetchNotifications();
  }, [user]);

  const handleMarkRead = async (id, link) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (link) {
        setShowNotifications(false);
        // Link router
        if (link.includes('exam')) onNavigate('exams');
        else if (link.includes('performance')) onNavigate('performance');
        else onNavigate('dashboard');
      }
    } catch (e) {}
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-100 h-20 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 capitalize">
            {title || 'Dashboard'}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            Empowering your Indian government service ambitions.
          </p>
        </div>
      </div>

      {/* Right: Streak, Notification Bell & User Pill */}
      <div className="flex items-center gap-3">
        {/* Streak Counter Pill */}
        <div 
          onClick={() => onNavigate('practice')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold cursor-pointer hover:bg-amber-100 transition-all shadow-sm"
          title="Daily Study Streak! Keep completing MCQs to grow your streak."
        >
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
          <span>{user?.streak_count || 1} Day Streak</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-soft-lg border border-slate-100 p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-bloom-pink-100 text-bloom-pink-700 font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Close
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No notifications yet. You're all caught up! 🌷</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleMarkRead(n.id, n.link)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all ${
                        n.is_read ? 'opacity-70 hover:bg-slate-50' : 'bg-bloom-lavender-50/50 hover:bg-bloom-lavender-100/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        {!n.is_read && <span className="w-2 h-2 rounded-full bg-bloom-lavender-600 mt-1" />}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-2 block">Click to view details</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <img
            src={user?.avatar || 'https://api.dicebear.com/7.x/notionists/svg?seed=Saranya'}
            alt={user?.name || 'User'}
            className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 shadow-sm"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{user?.name || 'Aspirant'}</p>
            <span className="text-[10px] font-semibold text-bloom-green-700 capitalize">
              {isAdmin ? 'Admin' : 'Student'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
