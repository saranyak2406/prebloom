import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNotification } from '../context/ThemeNotificationContext';
import Modal from '../components/common/Modal';
import { 
  Newspaper, Search, Calendar, Tag, ExternalLink, 
  Sparkles, Flame, Bookmark, ArrowRight, Share2 
} from 'lucide-react';

export default function CurrentAffairsPage({ onNavigate }) {
  const { addToast } = useNotification();

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Article Reader Modal
  const [activeArticle, setActiveArticle] = useState(null);

  useEffect(() => {
    async function loadCurrentAffairs() {
      setLoading(true);
      try {
        const [catRes, caRes] = await Promise.all([
          api.getCurrentAffairCategories(),
          api.getCurrentAffairs({
            category: selectedCategory,
            search: searchQuery
          })
        ]);
        if (catRes.success) setCategories(catRes.categories);
        if (caRes.success) setArticles(caRes.currentAffairs);
      } catch (err) {
        console.error('Failed to load current affairs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCurrentAffairs();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm space-y-4">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">
            Daily High-Yield Digests
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
            Current Affairs &amp; Government Schemes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Structured exam-oriented news covering National, Andhra Pradesh State, Economy, Schemes, Science, Awards, and Appointments.
          </p>
        </div>

        {/* Search & Category Pills */}
        <div className="pt-2 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search current affairs, schemes, appointments, or AP state policy..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-soft'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Articles List */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading daily news...</div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-soft-sm">
          No articles match your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              onClick={() => setActiveArticle(art)}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm hover:shadow-soft-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 capitalize">
                    {art.category.replace('_', ' ')}
                  </span>
                  {art.is_trending && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                      🔥 Trending
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-relaxed">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>

                {/* Tags */}
                {art.tags && art.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {art.tags.slice(0, 3).map((tag, ti) => (
                      <span key={ti} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{new Date(art.published_date).toLocaleDateString()}</span>
                <span className="font-bold text-slate-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Full Article Reader Modal */}
      <Modal
        isOpen={!!activeArticle}
        onClose={() => setActiveArticle(null)}
        title={activeArticle?.title || 'Current Affairs Article'}
        subtitle={`Category: ${activeArticle?.category ? activeArticle.category.replace('_', ' ') : ''} • Source: ${activeArticle?.source || 'Official Release'}`}
        maxWidth="max-w-3xl"
      >
        {activeArticle && (
          <div className="space-y-6 text-slate-700">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-500">
                Published on: {new Date(activeArticle.published_date).toLocaleDateString()} • {activeArticle.month_year}
              </span>
              <span className="font-bold text-blue-700">{activeArticle.source}</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60">
              <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">Key Takeaway Summary:</p>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">{activeArticle.summary}</p>
            </div>

            <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-white p-2">
              {activeArticle.full_content}
            </div>

            {activeArticle.tags && activeArticle.tags.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-2">
                {activeArticle.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                    🏷️ {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Added to Daily Current Affairs revision stack</span>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Done Reading
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
