import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotebookProvider, useNotebook } from './context/NotebookContext';
import { CosmicBackground } from './components/CosmicBackground';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { NotebookEditor } from './components/NotebookEditor';
import { ResearchOrganizer } from './components/ResearchOrganizer';
import { GalaxyStickerPanel } from './components/GalaxyStickerPanel';
import { ResearchToolsModal } from './components/ResearchToolsModal';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { SettingsModal } from './components/SettingsModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { activeNoteId, setActiveNoteId, addStickerToNote } = useNotebook();

  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'projects'>('dashboard');

  // Modal visibility states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showStickerPanel, setShowStickerPanel] = useState(false);
  const [showToolsModal, setShowToolsModal] = useState(false);
  const [toolsDefaultTab, setToolsDefaultTab] = useState<'timer' | 'quickcapture' | 'search' | 'bookmarks' | 'toc' | 'backup'>('timer');
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleOpenNote = (noteId: string) => {
    setActiveNoteId(noteId);
    setCurrentView('editor');
  };

  const handleOpenProjects = () => {
    setCurrentView('projects');
  };

  const handleOpenToolsTab = (tab?: 'timer' | 'quickcapture' | 'search' | 'bookmarks' | 'toc' | 'backup') => {
    if (tab) setToolsDefaultTab(tab);
    setShowToolsModal(true);
  };

  const handleStickerSelected = (stickerId: string) => {
    if (activeNoteId) {
      addStickerToNote(activeNoteId, stickerId);
    } else {
      // If no note active, switch to editor
      setCurrentView('editor');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c081f] text-purple-200 flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-full border-4 border-purple-500/30 border-t-purple-400 animate-spin" />
        <p className="text-sm font-semibold tracking-wide">Aligning your constellation...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-purple-500/40 selection:text-white">
      {/* Dreamy Galaxy Background */}
      <CosmicBackground />

      {/* Primary Navigation */}
      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenStickers={() => setShowStickerPanel(true)}
        onOpenTools={handleOpenToolsTab}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenSupabase={() => setShowSupabaseModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {currentView === 'dashboard' && (
          <Dashboard
            onOpenNote={handleOpenNote}
            onOpenProjects={handleOpenProjects}
          />
        )}

        {currentView === 'editor' && (
          <NotebookEditor
            onOpenStickerPanel={() => setShowStickerPanel(true)}
            onOpenProjects={handleOpenProjects}
          />
        )}

        {currentView === 'projects' && (
          <ResearchOrganizer onOpenNote={handleOpenNote} />
        )}
      </main>

      {/* Auth Modal (if user is not signed in or triggers it) */}
      <AuthModal
        isOpen={!user || showAuthModal}
        onClose={() => setShowAuthModal(false)}
        canDismiss={Boolean(user)}
      />

      {/* Galaxy Stickers Drawer */}
      <GalaxyStickerPanel
        isOpen={showStickerPanel}
        onClose={() => setShowStickerPanel(false)}
        onSelectSticker={handleStickerSelected}
      />

      {/* Research Tools (Timer, Quick Capture, Search, Bookmarks, TOC, Backup) */}
      <ResearchToolsModal
        isOpen={showToolsModal}
        onClose={() => setShowToolsModal(false)}
        defaultTab={toolsDefaultTab}
        onOpenNote={handleOpenNote}
      />

      {/* Supabase Cloud Setup & SQL Schema Modal */}
      <SupabaseSetupModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
      />

      {/* Personalization & Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Profile & Account Management Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotebookProvider>
        <AppContent />
      </NotebookProvider>
    </AuthProvider>
  );
}
