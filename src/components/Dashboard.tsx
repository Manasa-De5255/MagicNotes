import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotebook } from '../context/NotebookContext';
import { DAILY_QUOTES } from '../data/stickers';
import { filterNotes } from '../utils/notebookUtils';
import {
  Sparkles,
  Plus,
  Search,
  Pin,
  Star,
  BookOpen,
  FolderOpen,
  Link2,
  CheckCircle2,
  ArrowRight,
  Flame,
  FileText,
  Compass
} from 'lucide-react';

interface DashboardProps {
  onOpenNote: (noteId: string) => void;
  onOpenProjects: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenNote, onOpenProjects }) => {
  const { user } = useAuth();
  const { notes, projects, sources, tasks, createNote, loadStarterGuide } = useNotebook();

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const currentQuote = DAILY_QUOTES[quoteIndex % DAILY_QUOTES.length];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % DAILY_QUOTES.length);
  };

  const handleCreateNew = () => {
    const newId = createNote(null, 'Untitled Galaxy Note');
    onOpenNote(newId);
  };

  const filteredNotes = filterNotes(notes, searchQuery);
  const pinnedNotes = notes.filter((n) => n.is_pinned);
  const favoriteNotes = notes.filter((n) => n.is_favorite);
  const recentNotes = [...filteredNotes].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  ).slice(0, 6);

  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome & Cosmic Greeting Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#20144f] via-[#1c1244] to-[#120b2e] border border-purple-500/30 shadow-2xl">
        {/* Galaxy orb graphics */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-pink-500/20 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/30 text-purple-200 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
              <span>Mikrokosmos Sanctuary</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-pink-200 to-indigo-100">
              Welcome, {user?.full_name || 'Cosmic Traveler'} ✨
            </h1>
            <p className="text-sm sm:text-base text-purple-300/80 max-w-xl">
              “My thoughts, my universe.” Capture ideas, structure deep BTS theories, and map out your research.
            </p>
          </div>

          {/* Prominent Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCreateNew}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-950/80 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Note</span>
            </button>

            <button
              type="button"
              onClick={onOpenProjects}
              className="px-4 py-3 rounded-2xl bg-[#22174b] hover:bg-[#2c1f60] border border-purple-500/30 text-purple-200 font-semibold text-sm shadow flex items-center gap-2 transition-all"
            >
              <FolderOpen className="w-4 h-4 text-pink-400" />
              <span>Research Projects</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary & Daily Inspiration Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Progress & Stats Cards */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#150f33]/80 border border-purple-500/25 backdrop-blur-md shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between text-purple-400">
              <span className="text-xs font-semibold">Total Notes</span>
              <BookOpen className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold text-purple-100 mt-2">{notes.length}</div>
            <div className="text-[11px] text-purple-400/80 mt-1">Across all galaxies</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#150f33]/80 border border-purple-500/25 backdrop-blur-md shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between text-pink-400">
              <span className="text-xs font-semibold">Projects</span>
              <FolderOpen className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-extrabold text-pink-200 mt-2">{projects.length}</div>
            <div className="text-[11px] text-pink-400/80 mt-1">Collections</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#150f33]/80 border border-purple-500/25 backdrop-blur-md shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-400">
              <span className="text-xs font-semibold">Sources</span>
              <Link2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-indigo-200 mt-2">{sources.length}</div>
            <div className="text-[11px] text-indigo-400/80 mt-1">References saved</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#150f33]/80 border border-purple-500/25 backdrop-blur-md shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-semibold">Milestones</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-200 mt-2">
              {completedTasks}/{tasks.length}
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-1">Tasks finished</div>
          </div>
        </div>

        {/* Daily Inspiration Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#23154f] to-[#160d36] border border-purple-400/30 backdrop-blur-md shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" /> Daily Inspiration
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300">
              {currentQuote.theme}
            </span>
          </div>

          <blockquote className="text-sm font-medium italic text-purple-100 my-2 leading-relaxed">
            “{currentQuote.quote}”
          </blockquote>

          <div className="flex items-center justify-between pt-2 border-t border-purple-800/40 text-xs">
            <span className="text-purple-300/80 font-semibold">— {currentQuote.song}</span>
            <button
              type="button"
              onClick={handleNextQuote}
              className="text-pink-300 hover:text-pink-100 transition-colors font-medium text-[11px] flex items-center gap-1"
            >
              <span>Next</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-purple-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search research notes by keyword, title, tag, or lyric..."
          className="w-full bg-[#150f33]/90 border border-purple-500/30 rounded-2xl pl-12 pr-4 py-3 text-sm text-purple-100 placeholder-purple-400/50 shadow-lg focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-3.5 text-xs text-purple-400 hover:text-purple-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Pinned & Favorite Notes Shelf */}
      {(pinnedNotes.length > 0 || favoriteNotes.length > 0) && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Pin className="w-4 h-4 text-pink-400" />
            <h3 className="font-bold text-sm text-purple-200 uppercase tracking-wider">
              Pinned & Starred Galaxy Pages
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => onOpenNote(note.id)}
                className="p-4 rounded-2xl bg-[#1a123f] hover:bg-[#231853] border border-purple-500/40 hover:border-pink-500/60 cursor-pointer transition-all shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-pink-300 uppercase flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-pink-300" /> Pinned
                    </span>
                    <span className="text-[11px] text-purple-400">
                      {note.word_count} words
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-purple-100 line-clamp-1">{note.title}</h4>
                  <p className="text-xs text-purple-300/70 line-clamp-2 mt-1">
                    {note.content.replace(/<[^>]*>/g, ' ')}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-purple-400 mt-3 pt-2 border-t border-purple-800/40">
                  <span className="capitalize">{note.paper_style} paper</span>
                  <span>{note.stickers.length} stickers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Edited Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-sm text-purple-200 uppercase tracking-wider">
              Recently Edited Research Notes
            </h3>
          </div>
          <span className="text-xs text-purple-400">{filteredNotes.length} notes found</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onOpenNote(note.id)}
              className="group p-5 rounded-3xl bg-[#161036]/80 hover:bg-[#20174c] border border-purple-500/25 hover:border-purple-400/60 cursor-pointer transition-all duration-200 shadow-xl flex flex-col justify-between hover:translate-y-[-2px]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {note.is_favorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                    {note.is_pinned && <Pin className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />}
                    <span className="text-[11px] text-purple-400 capitalize">{note.paper_style}</span>
                  </div>
                  <span className="text-[10px] text-purple-400/70">
                    {new Date(note.updated_at).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h4 className="font-bold text-base text-purple-100 group-hover:text-pink-200 transition-colors line-clamp-1 mb-1.5">
                  {note.title}
                </h4>

                <p className="text-xs text-purple-300/70 line-clamp-3 leading-relaxed">
                  {note.content.replace(/<[^>]*>/g, ' ')}
                </p>
              </div>

              {/* Tags & Stickers Counter */}
              <div className="mt-4 pt-3 border-t border-purple-800/40 flex items-center justify-between text-xs text-purple-400">
                <div className="flex flex-wrap gap-1">
                  {(note.tags || []).slice(0, 2).map((tg) => (
                    <span
                      key={tg}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/40"
                    >
                      {tg}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-pink-400" /> {note.stickers.length}
                </span>
              </div>
            </div>
          ))}

          {recentNotes.length === 0 && (
            <div className="col-span-full py-12 px-6 rounded-3xl bg-[#140e2e]/60 border border-dashed border-purple-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-900/40 text-purple-300 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-pink-400" />
              </div>
              <h4 className="font-bold text-base text-purple-100">Your Universe is Ready</h4>
              <p className="text-xs text-purple-300/80 max-w-md mx-auto">
                A newly registered explorer begins with an empty sanctuary. You can create your first blank research page or optionally load the BTS Universe starter pack.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow"
                >
                  + Create Blank Note
                </button>
                <button
                  type="button"
                  onClick={loadStarterGuide}
                  className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/40 text-purple-200 font-semibold text-xs transition-colors"
                >
                  Load BTS Lore Starter Guide 💜
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
