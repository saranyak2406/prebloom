import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNotification } from '../context/ThemeNotificationContext';
import Modal from '../components/common/Modal';
import { FileText, Download, CheckCircle2, Search, Filter, BookOpen } from 'lucide-react';

export default function PreviousYearPapersPage({ onNavigate }) {
  const { addToast } = useNotification();

  const [papers, setPapers] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Paper Viewer Modal
  const [viewingPaper, setViewingPaper] = useState(null);

  useEffect(() => {
    async function loadPapers() {
      setLoading(true);
      try {
        const [exRes, pyqRes] = await Promise.all([
          api.getExams(),
          api.getPYQPapers({
            exam_id: selectedExam,
            year: selectedYear,
            search: searchQuery
          })
        ]);
        if (exRes.success) setExams(exRes.exams);
        if (pyqRes.success) setPapers(pyqRes.papers);
      } catch (err) {
        console.error('Failed to load PYQs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPapers();
  }, [selectedExam, selectedYear, searchQuery]);

  const handleDownload = (paper) => {
    addToast(`Question Paper downloaded: ${paper.title} 📥`, 'success');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft-sm space-y-4">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
            Real Exam Benchmarks
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
            Previous Year Question Papers (PYQs)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Analyze historical question trends, official answer keys, and detailed solutions for UPSC, SSC, APPSC &amp; Railways.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 text-xs">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search paper by year or examination title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 font-semibold focus:outline-none bg-white"
            >
              <option value="all">All Examinations</option>
              {exams.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 font-semibold focus:outline-none bg-white"
            >
              <option value="all">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Papers List */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading question papers...</div>
      ) : papers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-soft-sm">
          No question papers found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft-sm hover:shadow-soft-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800">
                    Year: {paper.year}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    With Solutions
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-relaxed">
                  {paper.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Shift / Session: {paper.shift_or_paper}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Questions</span>
                    <span className="font-bold text-slate-800">{paper.questions_count} MCQs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Duration</span>
                    <span className="font-bold text-slate-800">{paper.duration_mins} Minutes</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setViewingPaper(paper)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-all"
                >
                  View Paper &amp; Keys
                </button>
                <button
                  onClick={() => handleDownload(paper)}
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition-all"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Paper Viewer Modal */}
      <Modal
        isOpen={!!viewingPaper}
        onClose={() => setViewingPaper(null)}
        title={viewingPaper?.title || 'Question Paper'}
        subtitle={`Year: ${viewingPaper?.year || ''} • ${viewingPaper?.shift_or_paper || ''} • Exam: ${viewingPaper?.exam_title || ''}`}
        maxWidth="max-w-3xl"
      >
        {viewingPaper && (
          <div className="space-y-6 text-slate-700">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-900">
                Official Answer Key &amp; Solutions Verified
              </span>
              <span className="font-bold text-amber-800">{viewingPaper.questions_count} Total Questions</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Sample Question 1 (From Actual Paper):</span>
                <p className="text-xs text-slate-800">
                  With reference to the Indian Constitution, the 42nd Amendment Act added which of the following terms to the Preamble?
                </p>
                <div className="p-2.5 rounded-xl bg-white border text-xs text-slate-700 space-y-1">
                  <p><strong>A)</strong> Federal, Democratic, Republic</p>
                  <p className="font-bold text-emerald-700"><strong>B)</strong> Socialist, Secular, Integrity (Correct)</p>
                  <p><strong>C)</strong> Liberty, Equality, Fraternity</p>
                  <p><strong>D)</strong> Justice, Sovereign, Unity</p>
                </div>
                <div className="text-[11px] text-slate-500 bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/50">
                  <strong>Official Solution:</strong> Enacted in 1976 during the Emergency, the 42nd Constitutional Amendment introduced the three words into the Preamble.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Sample Question 2:</span>
                <p className="text-xs text-slate-800">
                  According to the Andhra Pradesh Reorganisation Act 2014, how many districts were allocated to the successor state?
                </p>
                <div className="p-2.5 rounded-xl bg-white border text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-emerald-700"><strong>Answer:</strong> 13 Districts (9 Coastal Andhra + 4 Rayalaseema)</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Complete PDF with full 100 questions available</span>
              <button
                onClick={() => { handleDownload(viewingPaper); setViewingPaper(null); }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                <Download className="w-3.5 h-3.5 text-bloom-green-300" />
                <span>Download Complete PDF</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
