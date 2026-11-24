import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/ThemeNotificationContext';
import { Bookmark, ArrowRight, Trash2 } from 'lucide-react';

export default function BookmarksPage({ onNavigate }) {
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookmarks() {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const res = await api.getBookmarks();
        if (res.success) setBookmarks(res.bookmarks);
      } catch (e) {
        console.error('Failed to load bookmarks:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchBookmarks();
  }, [isAuthenticated]);

  const handleRemove = async (itemType, itemId) => {
    try {
      const res = await api.toggleBookmark({ item_type: itemType, item_id: itemId });
      if (res.success) {
        setBookmarks(prev => prev.filter(b => !(b.item_type === itemType && b.item_id === itemId)));
        addToast('Bookmark removed', 'info');
      }
    } catch (e) {
      addToast('Failed to remove bookmark', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-100 shadow-soft-sm space-y-4">
        <span className="text-4xl">⭐</span>
        <h3 className="text-xl font-bold font-display text-slate-900">Sign in to view your bookmarks</h3>
        <p className="text-xs text-slate-500">
          Save high-yield lessons, tough questions, and revision notes to access them anytime.
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
          Saved Resources
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
          My Saved Bookmarks
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your bookmarked lessons, difficult questions, and study materials for rapid revision.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading bookmarks...</div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-soft-sm space-y-3">
          <span className="text-3xl">🔖</span>
          <p className="font-bold text-slate-700">You haven't bookmarked any items yet.</p>
          <p className="text-xs text-slate-400">
            Click the star or bookmark icon while reading lessons or practicing MCQs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm hover:shadow-soft transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                  {b.item_type}
                </span>
                <h4 className="font-bold text-base text-slate-900 mt-2 line-clamp-2">
                  {b.item_title || `Saved ${b.item_type} #${b.item_id}`}
                </h4>
                <p className="text-xs text-slate-400 mt-2">
                  Saved on {new Date(b.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate(b.item_type === 'lesson' ? 'study-materials' : b.item_type === 'current_affair' ? 'current-affairs' : 'exams')}
                  className="text-xs font-bold text-bloom-lavender-700 hover:underline flex items-center gap-1"
                >
                  <span>Open Item</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRemove(b.item_type, b.item_id)}
                  className="p-2 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                  title="Remove Bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
