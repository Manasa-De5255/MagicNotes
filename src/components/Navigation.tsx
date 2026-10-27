import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotebook } from '../context/NotebookContext';
import { AVATAR_OPTIONS } from '../data/stickers';
import {
  Sparkles,
  BookOpen,
  FolderOpen,
  LayoutDashboard,
  Timer,
  Settings,
  User as UserIcon,
  LogOut,
  Plus,
  ShieldCheck,
  Cloud,
  Menu,
  X,
  Database,
  Palette
} from 'lucide-react';

interface NavigationProps {
  currentView: 'dashboard' | 'editor' | 'projects';
  setCurrentView: (view: 'dashboard' | 'editor' | 'projects') => void;
  onOpenStickers: () => void;
  onOpenTools: (tab?: 'timer' | 'quickcapture' | 'search' | 'bookmarks' | 'toc' | 'backup') => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenSupabase: () => void;
  onOpenAuth: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  setCurrentView,
  onOpenStickers,
  onOpenTools,
  onOpenSettings,
  onOpenProfile,
  onOpenSupabase,
  onOpenAuth,
}) => {
  const { user, signOut, isCloudConnected } = useAuth();
  const { createNote } = useNotebook();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentAvatarMeta = AVATAR_OPTIONS.find((a) => a.id === user?.avatar_id) || AVATAR_OPTIONS[0];

  const handleCreateNewNote = () => {
    createNote(null, 'Untitled Galaxy Note');
    setCurrentView('editor');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#120c29]/90 backdrop-blur-xl border-b border-purple-500/20 text-purple-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/50 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-purple-100 via-pink-200 to-indigo-200 bg-clip-text text-transparent">
                Magic Notes
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/80 text-pink-300 font-bold">
                7
              </span>
            </div>
            <p className="text-[10px] text-purple-300/80 hidden sm:block">
              “My thoughts, my universe.”
            </p>
          </div>
        </div>

        {/* Desktop View Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-[#1b143c]/80 border border-purple-800/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setCurrentView('dashboard')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              currentView === 'dashboard'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('editor')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              currentView === 'editor'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Notebook</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('projects')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              currentView === 'projects'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Projects & Sources</span>
          </button>
        </nav>

        {/* Right Tools & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Note Button */}
          <button
            type="button"
            onClick={handleCreateNewNote}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs shadow-md shadow-purple-950 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>

          {/* Focus Timer quick toggle */}
          <button
            type="button"
            onClick={() => onOpenTools('timer')}
            title="Focus Timer (Pomodoro)"
            className="p-2 rounded-xl bg-[#1b143c] border border-purple-800/40 text-purple-300 hover:text-white hover:bg-[#251b54] transition-colors"
          >
            <Timer className="w-4 h-4 text-pink-300" />
          </button>

          {/* Stickers Vault quick trigger */}
          <button
            type="button"
            onClick={onOpenStickers}
            title="Galaxy Stickers"
            className="p-2 rounded-xl bg-[#1b143c] border border-purple-800/40 text-purple-300 hover:text-white hover:bg-[#251b54] transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
          </button>

          {/* Supabase status badge */}
          <button
            type="button"
            onClick={onOpenSupabase}
            title={isCloudConnected ? 'Supabase Cloud Connected' : 'Local Sandbox Mode (Click to setup Supabase)'}
            className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors ${
              isCloudConnected
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-purple-950/40 border-purple-700/40 text-purple-300 hover:border-purple-400'
            }`}
          >
            {isCloudConnected ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cloud Synced</span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5 text-pink-400" />
                <span>Cloud Setup</span>
              </>
            )}
          </button>

          {/* User Profile Avatar & Menu */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-2xl bg-[#1e1544] border border-purple-700/50 hover:bg-[#271c59] transition-all"
              >
                <span className="w-7 h-7 rounded-xl bg-purple-900/60 flex items-center justify-center text-sm shadow">
                  {currentAvatarMeta.emoji}
                </span>
                <span className="text-xs font-bold text-purple-100 hidden sm:inline max-w-[90px] truncate">
                  {user.full_name.split(' ')[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 top-12 w-56 bg-[#161036] border border-purple-500/40 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in space-y-1 text-xs">
                  <div className="px-3 py-2 border-b border-purple-900/60">
                    <p className="font-bold text-purple-100 truncate">{user.full_name}</p>
                    <p className="text-[11px] text-purple-400 truncate">{user.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenProfile();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-purple-200 hover:bg-purple-900/40 flex items-center gap-2 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-purple-400" /> Profile & Account
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenSettings();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-purple-200 hover:bg-purple-900/40 flex items-center gap-2 transition-colors"
                  >
                    <Palette className="w-4 h-4 text-pink-400" /> Notebook Themes
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenSupabase();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-purple-200 hover:bg-purple-900/40 flex items-center gap-2 transition-colors"
                  >
                    <Database className="w-4 h-4 text-indigo-400" /> Supabase Cloud Sync
                  </button>

                  <div className="border-t border-purple-900/50 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-300 hover:bg-rose-950/50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow transition-all"
            >
              Sign In
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#1b143c] border border-purple-800/40 text-purple-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4 bg-[#140e2e] border-b border-purple-800/60 space-y-2 text-xs font-semibold animate-in slide-in-from-top-2">
          <button
            type="button"
            onClick={() => {
              setCurrentView('dashboard');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 ${
              currentView === 'dashboard' ? 'bg-purple-600 text-white' : 'text-purple-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentView('editor');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 ${
              currentView === 'editor' ? 'bg-purple-600 text-white' : 'text-purple-300'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Notebook Editor
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentView('projects');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 ${
              currentView === 'projects' ? 'bg-purple-600 text-white' : 'text-purple-300'
            }`}
          >
            <FolderOpen className="w-4 h-4" /> Research Projects
          </button>

          <div className="border-t border-purple-900/60 my-2 pt-2 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={handleCreateNewNote}
              className="w-full text-left px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Blank Note
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenTools('timer');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2 rounded-xl text-purple-200 hover:bg-purple-900/40 flex items-center gap-2"
            >
              <Timer className="w-4 h-4 text-pink-400" /> Focus Timer
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenSupabase();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2 rounded-xl text-purple-200 hover:bg-purple-900/40 flex items-center gap-2"
            >
              <Database className="w-4 h-4 text-indigo-400" /> Supabase Database Setup
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
