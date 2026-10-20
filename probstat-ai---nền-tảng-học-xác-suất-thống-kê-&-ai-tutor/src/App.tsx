import React, { useState } from 'react';
import { ActiveTab, ErrorRecord } from './types';
import { INITIAL_ERROR_RECORDS, INITIAL_USER_PROFILE } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { ArchitectureModal } from './components/ArchitectureModal';

import { FourStepLearning } from './features/FourStepLearning';
import { AutoGrader } from './features/AutoGrader';
import { VoiceSyncTutor } from './features/VoiceSyncTutor';
import { SimilarProblemGenerator } from './features/SimilarProblemGenerator';
import { InstantQuiz } from './features/InstantQuiz';
import { VivaExam } from './features/VivaExam';
import { ErrorAnalyticsReport } from './features/ErrorAnalyticsReport';
import { InteractiveMindmap } from './features/InteractiveMindmap';
import { CommunityForum } from './features/CommunityForum';
import { AILearningProfile } from './features/AILearningProfile';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('four_step');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Cross-feature states
  const [activeCanvasProblem, setActiveCanvasProblem] = useState<{
    title: string;
    prompt: string;
  }>({
    title: 'Bài toán Xét nghiệm Y tế & Định lý Bayes',
    prompt:
      'Một bệnh hiểm nghèo có tỷ lệ mắc 1% trong dân số. Xét nghiệm có độ nhạy 95% và tỷ lệ dương tính giả 5%. Một người có kết quả dương tính. Hãy tính xác suất người đó thực sự mắc bệnh.',
  });

  const [syncedDiagram, setSyncedDiagram] = useState<any>(null);

  const [errorRecords, setErrorRecords] = useState<ErrorRecord[]>(INITIAL_ERROR_RECORDS);

  const handleAddErrorRecord = (record: ErrorRecord) => {
    setErrorRecords((prev) => [record, ...prev]);
  };

  const handleSendToCanvas = (title: string, prompt: string) => {
    setActiveCanvasProblem({ title, prompt });
    setActiveTab('grader');
  };

  const handleSyncToCanvas = (diagram: any) => {
    setSyncedDiagram(diagram);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        className="hidden md:flex shrink-0"
      />

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fadeIn">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10">
            <Sidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              className="w-full h-full flex"
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
          onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Tab Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          {activeTab === 'four_step' && (
            <FourStepLearning
              onGoToCanvas={handleSendToCanvas}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'grader' && (
            <AutoGrader
              initialProblemTitle={activeCanvasProblem.title}
              initialProblemPrompt={activeCanvasProblem.prompt}
              syncDiagram={syncedDiagram}
            />
          )}

          {activeTab === 'voice_sync' && <VoiceSyncTutor />}

          {activeTab === 'similar_generator' && (
            <SimilarProblemGenerator onSendToCanvas={handleSendToCanvas} />
          )}

          {activeTab === 'instant_quiz' && (
            <InstantQuiz onAddErrorRecord={handleAddErrorRecord} />
          )}

          {activeTab === 'viva_exam' && (
            <VivaExam onAddErrorRecord={handleAddErrorRecord} />
          )}

          {activeTab === 'error_report' && (
            <ErrorAnalyticsReport
              errorRecords={errorRecords}
              onRemoveRecord={(id) =>
                setErrorRecords((prev) => prev.filter((r) => r.id !== id))
              }
            />
          )}

          {activeTab === 'mindmap' && (
            <InteractiveMindmap
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSendToCanvas={handleSendToCanvas}
            />
          )}

          {activeTab === 'forum' && <CommunityForum />}

          {activeTab === 'profile' && (
            <AILearningProfile
              profile={INITIAL_USER_PROFILE}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}
        </main>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSyncToCanvas={handleSyncToCanvas}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />

      {/* Technical Architecture & Database Schema Modal */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
}
