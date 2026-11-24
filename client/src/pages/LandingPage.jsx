import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, ArrowRight, CheckCircle2, ShieldCheck, 
  BookOpen, Clock, Award, Star, Compass, Flame, Users, FileText
} from 'lucide-react';

export default function LandingPage({ onNavigate, onSelectExam }) {
  const { isAuthenticated, quickDemoLogin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [featuredExams, setFeaturedExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLandingData() {
      try {
        const [catsRes, examsRes] = await Promise.all([
          api.getCategories(),
          api.getExams({ featured: 'true' })
        ]);
        if (catsRes.success) setCategories(catsRes.categories);
        if (examsRes.success) setFeaturedExams(examsRes.exams.slice(0, 6));
      } catch (err) {
        console.error('Landing page data error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLandingData();
  }, []);

  const features = [
    {
      title: 'Verified Exam Syllabus',
      desc: 'Accurately compiled directly from official gazette notifications of UPSC, SSC, APPSC, RRB, and IBPS.',
      icon: ShieldCheck,
      color: 'bg-bloom-green-100 text-bloom-green-700'
    },
    {
      title: 'Real CBT Mock Test Simulator',
      desc: 'Exact exam hall interface with countdown timer, negative marking, question palette, and detailed solutions.',
      icon: Clock,
      color: 'bg-bloom-pink-100 text-bloom-pink-700'
    },
    {
      title: 'Smart Multi-Exam Planner',
      desc: 'Preparing for both UPSC & APPSC or SSC & Railway? Compare overlapping subjects and generate unified timetables.',
      icon: Compass,
      color: 'bg-bloom-lavender-100 text-bloom-lavender-700'
    },
    {
      title: 'Daily Practice & Streak',
      desc: 'High-yield topic MCQs with instant verification, detailed conceptual explanations, and daily study streaks.',
      icon: Flame,
      color: 'bg-amber-100 text-amber-700'
    },
    {
      title: 'Curated Notes & PDF Handbooks',
      desc: 'Subject-wise mindmaps, high-yield revision cards, and downloadable PDF summaries for swift last-minute revision.',
      icon: BookOpen,
      color: 'bg-emerald-100 text-emerald-700'
    },
    {
      title: 'Daily & State Current Affairs',
      desc: 'Categorized news covering National events, Andhra Pradesh state affairs, Budget, Schemes, and Appointments.',
      icon: FileText,
      color: 'bg-indigo-100 text-indigo-700'
    }
  ];

  const testimonials = [
    {
      name: 'Ananya Reddy',
      exam: 'APPSC Group 2 Ranker',
      text: 'PrepBloom made all the difference in my preparation. The AP-specific current affairs and Indian Constitution tests were spot-on with the actual exam pattern!',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Ananya'
    },
    {
      name: 'Vikram Sharma',
      exam: 'SSC CGL - Inspector (CGST)',
      text: 'The daily practice questions and timed mock tests built my speed. The clean, calming pastel UI kept me motivated without digital fatigue during 8-hour study days.',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Vikram'
    },
    {
      name: 'Pooja Iyer',
      exam: 'UPSC CSE Aspirant (Cleared Prelims)',
      text: 'The multi-exam comparison tool is a game changer. I could see the exact subject overlap between UPSC and State PSC, saving hundreds of hours of duplicate study.',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Pooja'
    }
  ];

  return (
    <div className="bg-[#fcfcff] min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-bloom-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-bloom-pink-200/80 shadow-soft-sm backdrop-blur-md">
              <span className="text-lg">🌷</span>
              <span className="text-xs font-bold text-slate-800 tracking-wide">
                India's Cutest &amp; Most Rigorous Exam Platform
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-bloom-green-500 animate-ping" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.15]">
              Your Government Job <br />
              <span className="bg-gradient-to-r from-emerald-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Journey Starts Here
              </span>
            </h1>

            {/* Tagline & Subtext */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              <strong>Learn. Grow. Succeed.</strong> One unified, aesthetic portal for all major Indian government competitive exams — UPSC, SSC, Railways, State PSCs, Banking &amp; Defence.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'auth')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-soft-lg hover:scale-[1.02] transition-all"
              >
                <span>Start Preparing Free</span>
                <ArrowRight className="w-5 h-5 text-bloom-green-300" />
              </button>

              <button
                onClick={() => onNavigate('exams')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-soft hover:scale-[1.02] transition-all"
              >
                <Compass className="w-5 h-5 text-bloom-lavender-600" />
                <span>Explore 20+ Exams</span>
              </button>
            </div>

            {/* Micro Stats */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-slate-200/60 max-w-2xl mx-auto">
              <div>
                <p className="text-2xl font-bold font-display text-slate-900">100%</p>
                <p className="text-xs text-slate-500">Official Syllabus</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-emerald-600">50,000+</p>
                <p className="text-xs text-slate-500">Live Vacancies</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-purple-600">1,500+</p>
                <p className="text-xs text-slate-500">High-Yield MCQs</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-pink-600">14-Day</p>
                <p className="text-xs text-slate-500">Study Habit Builder</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. EXAM CATEGORIES OVERVIEW */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-bloom-green-700 uppercase tracking-widest bg-bloom-green-100 px-3 py-1 rounded-full">
            All-India Coverage
          </span>
          <h2 className="text-3xl font-bold font-display text-slate-900">
            Preparation for Every Government Ambition
          </h2>
          <p className="text-sm text-slate-500">
            Choose your target cadre. We provide structured stage-by-stage roadmaps for Central and State recruitment examinations.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('exams')}
              className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-bloom-green-100 via-bloom-pink-100 to-bloom-lavender-100 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                  {cat.slug === 'upsc' ? '🏛️' :
                   cat.slug === 'ssc' ? '📜' :
                   cat.slug === 'railway' ? '🚆' :
                   cat.slug === 'state-psc' ? '🏛️' :
                   cat.slug === 'banking' ? '🏦' :
                   cat.slug === 'defence' ? '🛡️' :
                   cat.slug === 'police' ? '👮' : '🎓'}
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-bloom-lavender-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-900">
                <span>{cat.exam_count} Examinations</span>
                <ArrowRight className="w-4 h-4 text-bloom-pink-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED ACTIVE EXAMS */}
      <section className="py-16 bg-slate-50/60 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-bloom-pink-600 uppercase tracking-widest bg-bloom-pink-100 px-3 py-1 rounded-full">
                Active Notifications
              </span>
              <h2 className="text-3xl font-bold font-display text-slate-900 mt-2">
                Popular Examinations with Open Applications
              </h2>
            </div>
            <button
              onClick={() => onNavigate('exams')}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-bloom-lavender-600"
            >
              <span>View All 20+ Exams</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm hover:shadow-soft-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {exam.category_name}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      exam.notification_status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {exam.notification_status}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{exam.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {exam.overview}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 py-3 px-4 rounded-2xl bg-slate-50 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Vacancies</span>
                      <span className="font-bold text-slate-800">
                        {exam.vacancies > 0 ? `${exam.vacancies.toLocaleString()} Posts` : 'Notified'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Eligibility</span>
                      <span className="font-bold text-slate-800 truncate block">
                        {exam.age_criteria.split('(')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (onSelectExam) onSelectExam(exam.slug);
                      onNavigate('exams');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs text-center transition-all"
                  >
                    View Syllabus &amp; Details
                  </button>
                  <button
                    onClick={() => onNavigate(isAuthenticated ? 'my-exams' : 'auth')}
                    className="p-2.5 rounded-xl bg-bloom-pink-50 hover:bg-bloom-pink-100 text-bloom-pink-700 text-xs transition-all"
                    title="Add to My Exams"
                  >
                    ⭐
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PLATFORM FEATURES & BENEFITS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-100 px-3 py-1 rounded-full">
            Designed for Success
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900">
            Everything You Need to Crack Your Exam on First Attempt
          </h2>
          <p className="text-sm text-slate-500">
            We removed digital clutter and unnecessary noise. PrepBloom gives you clean, scientifically structured learning tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white border border-slate-100 shadow-soft-sm hover:shadow-soft-lg transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-20 bg-gradient-to-b from-white to-pink-50/30 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              Student Stories
            </span>
            <h2 className="text-3xl font-bold font-display text-slate-900">
              Trusted by 10,000+ Aspirants Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-100 shadow-soft flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    "{t.text}"
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-2xl bg-bloom-pink-100 border border-bloom-pink-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{t.name}</h4>
                    <p className="text-xs font-semibold text-bloom-green-700">{t.exam}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-4xl bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-900 text-white p-10 sm:p-16 relative overflow-hidden shadow-soft-lg">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-bloom-pink-300">
              🌷 Begin Today
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight">
              Start Your Daily Study Habit on PrepBloom.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join thousands of dedicated candidates preparing for UPSC, SSC, Railways and State PSCs with clean, verified materials.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'auth')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-bloom-green-400 via-bloom-pink-300 to-bloom-lavender-300 text-slate-900 font-bold text-sm shadow-soft hover:scale-[1.02] transition-all"
              >
                Create Free Student Account
              </button>
              <button
                onClick={() => quickDemoLogin('student')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
              >
                ⚡ Instant Student Demo Login
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
