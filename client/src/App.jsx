import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';
import TopHeader from './components/common/TopHeader';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import ExamExplorerPage from './pages/ExamExplorerPage';
import MyExamsPage from './pages/MyExamsPage';
import StudyMaterialsPage from './pages/StudyMaterialsPage';
import DailyPracticePage from './pages/DailyPracticePage';
import MockTestsPage from './pages/MockTestsPage';
import CurrentAffairsPage from './pages/CurrentAffairsPage';
import PreviousYearPapersPage from './pages/PreviousYearPapersPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import PerformanceTrackerPage from './pages/PerformanceTrackerPage';
import BookmarksPage from './pages/BookmarksPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  // Navigation tab state
  const [currentTab, setCurrentTab] = useState('landing');
  const [selectedExamSlug, setSelectedExamSlug] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  const handleNavigate = (tab) => {
    setCurrentTab(tab);
    setIsMobileSidebarOpen(false);
  };

  const handleSelectExam = (slug) => {
    setSelectedExamSlug(slug);
    setCurrentTab('exams');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bloom-mesh flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-bloom-green-300 via-bloom-pink-200 to-bloom-lavender-300 flex items-center justify-center shadow-soft animate-bounce mx-auto">
            <span className="text-3xl">🌷</span>
          </div>
          <p className="font-display font-bold text-slate-800 text-lg">PrepBloom</p>
          <p className="text-xs text-slate-500 font-medium">Learn. Grow. Succeed.</p>
        </div>
      </div>
    );
  }

  // Determine if viewing in Public Portal mode or Dashboard App Shell mode
  const isDashboardView = isAuthenticated && currentTab !== 'landing' && currentTab !== 'auth';

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc] text-slate-800 font-sans">
      {!isDashboardView ? (
        // PUBLIC PORTAL LAYOUT (Landing, Auth, or Non-logged in browsing)
        <>
          <Navbar onNavigate={handleNavigate} currentTab={currentTab} />
          
          <main className="flex-1">
            {currentTab === 'landing' && (
              <LandingPage onNavigate={handleNavigate} onSelectExam={handleSelectExam} />
            )}
            {currentTab === 'auth' && (
              <AuthPage onNavigate={handleNavigate} />
            )}
            {currentTab === 'exams' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ExamExplorerPage selectedSlug={selectedExamSlug} onNavigate={handleNavigate} />
              </div>
            )}
            {currentTab === 'study-materials' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <StudyMaterialsPage onNavigate={handleNavigate} />
              </div>
            )}
            {currentTab === 'practice' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <DailyPracticePage onNavigate={handleNavigate} />
              </div>
            )}
            {currentTab === 'mock-tests' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <MockTestsPage onNavigate={handleNavigate} />
              </div>
            )}
            {currentTab === 'current-affairs' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <CurrentAffairsPage onNavigate={handleNavigate} />
              </div>
            )}
            {currentTab === 'pyq' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PreviousYearPapersPage onNavigate={handleNavigate} />
              </div>
            )}
          </main>

          <Footer onNavigate={handleNavigate} />
        </>
      ) : (
        // DASHBOARD SAAS APP SHELL (Sidebar + TopHeader + Main Content)
        <div className="flex-1 flex min-h-screen">
          <Sidebar
            currentTab={currentTab}
            onNavigate={handleNavigate}
            isMobileOpen={isMobileSidebarOpen}
            setIsMobileOpen={setIsMobileSidebarOpen}
          />

          <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
            <TopHeader
              title={currentTab.replace('-', ' ')}
              onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
              onNavigate={handleNavigate}
            />

            <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
              {currentTab === 'dashboard' && (
                <StudentDashboard onNavigate={handleNavigate} onSelectExam={handleSelectExam} />
              )}
              {currentTab === 'exams' && (
                <ExamExplorerPage selectedSlug={selectedExamSlug} onNavigate={handleNavigate} />
              )}
              {currentTab === 'my-exams' && (
                <MyExamsPage onNavigate={handleNavigate} />
              )}
              {currentTab === 'study-materials' && (
                <StudyMaterialsPage onNavigate={handleNavigate} />
              )}
              {currentTab === 'practice' && (
                <DailyPracticePage onNavigate={handleNavigate} />
              )}
              {currentTab === 'mock-tests' && (
                <MockTestsPage onNavigate={handleNavigate} />
              )}
              {currentTab === 'current-affairs' && (
                <CurrentAffairsPage onNavigate={handleNavigate} />
              )}
              {currentTab === 'pyq' && (
                <PreviousYearPapersPage onNavigate={handleNavigate} />
              )}
              {currentTab === 'planner' && (
                <StudyPlannerPage onNavigate={handleNavigate} />
              )}
              {currentTab === 'performance' && (
                <PerformanceTrackerPage onNavigate={handleNavigate} />
              )}
              {currentTab === 'bookmarks' && (
                <BookmarksPage onNavigate={handleNavigate} />
              )}
              {currentTab === 'admin' && (
                <AdminDashboardPage onNavigate={handleNavigate} />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
