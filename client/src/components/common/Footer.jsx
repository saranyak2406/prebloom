import React from 'react';
import { Heart, Sparkles, ExternalLink, ShieldCheck, Mail, MapPin } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-bloom-green-300 via-bloom-pink-300 to-bloom-lavender-300 flex items-center justify-center">
                <span className="text-xl">🌷</span>
              </div>
              <div>
                <span className="text-2xl font-bold font-display text-white">PrepBloom</span>
                <p className="text-xs text-bloom-pink-300 font-medium">Learn. Grow. Succeed.</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier all-in-one government examination preparation platform. Providing verified syllabus, high-yield notes, interactive daily practice, simulated mock tests, and timely notifications.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-bloom-green-400" />
              <span>Verified syllabus from UPSC, SSC, APPSC, RRB & IBPS notifications</span>
            </div>
          </div>

          {/* Major Exam Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Exam Categories</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('exams')} className="hover:text-bloom-green-300 transition-colors">
                  UPSC Civil Services & NDA
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('exams')} className="hover:text-bloom-green-300 transition-colors">
                  SSC CGL, CHSL, MTS & GD
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('exams')} className="hover:text-bloom-green-300 transition-colors">
                  Railways RRB NTPC & ALP
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('exams')} className="hover:text-bloom-green-300 transition-colors">
                  APPSC Group 1, 2, 3 & 4
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('exams')} className="hover:text-bloom-green-300 transition-colors">
                  Banking: IBPS PO & SBI PO
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('exams')} className="hover:text-bloom-green-300 transition-colors">
                  Defence: CDS, AFCAT & Agniveer
                </button>
              </li>
            </ul>
          </div>

          {/* Learning Modules */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Study Modules</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('study-materials')} className="hover:text-bloom-lavender-300 transition-colors">
                  Subject-Wise Notes & PDFs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('practice')} className="hover:text-bloom-pink-300 transition-colors">
                  Daily MCQ Practice & Streak
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mock-tests')} className="hover:text-bloom-green-300 transition-colors">
                  All-India CBT Mock Tests
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('current-affairs')} className="hover:text-indigo-300 transition-colors">
                  Daily News & AP State Special
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pyq')} className="hover:text-amber-300 transition-colors">
                  Previous Year Question Papers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('planner')} className="hover:text-sky-300 transition-colors">
                  180-Day Study Timetable
                </button>
              </li>
            </ul>
          </div>

          {/* Official Verification & Help */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Official Portals</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="https://upsc.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>UPSC Official</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://ssc.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>SSC Official</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://psc.ap.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>APPSC Official Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://ibps.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>IBPS Official</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://rrbcdg.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>Indian Railways RRB</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 PrepBloom EdTech. Built with love for aspiring government civil servants across India.</p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-bloom-pink-400 fill-bloom-pink-400 inline" /> &amp; Dedication
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-bloom-green-300">Continuous Study Streak System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

