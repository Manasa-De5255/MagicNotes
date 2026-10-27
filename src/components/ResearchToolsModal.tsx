import React, { useState, useEffect, useRef } from 'react';
import { useNotebook } from '../context/NotebookContext';
import { parseTableOfContents, filterNotes, filterSources } from '../utils/notebookUtils';
import confetti from 'canvas-confetti';
import {
  Timer,
  Zap,
  Search,
  Bookmark,
  ListTree,
  Database,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Download,
  Upload,
  Sparkles,
  X
} from 'lucide-react';

interface ResearchToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'timer' | 'quickcapture' | 'search' | 'bookmarks' | 'toc' | 'backup';
  onOpenNote: (noteId: string) => void;
}

export const ResearchToolsModal: React.FC<ResearchToolsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'timer',
  onOpenNote,
}) => {
  const {
    notes,
    sources,
    activeNoteId,
    createNote,
    exportNotebookJSON,
    importNotebookJSON,
  } = useNotebook();

  const [activeTab, setActiveTab] = useState<'timer' | 'quickcapture' | 'search' | 'bookmarks' | 'toc' | 'backup'>(defaultTab);

  // Focus Timer state
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Quick Capture state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickBody, setQuickBody] = useState('');
  const [quickSavedToast, setQuickSavedToast] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Backup state
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            // Play cosmic chime using Web Audio API
            playCosmicChime();
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#a855f7', '#ec4899', '#facc15'],
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const playCosmicChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, audioCtx.currentTime); // 528Hz Solfeggio "transformation & miracles"
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // AudioContext unavailable or blocked by policy
    }
  };

  const handleSetTimer = (minutes: number, mode: 'focus' | 'break') => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    setSecondsLeft(minutes * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleQuickCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickBody.trim()) return;

    const title = quickTitle.trim() || `Spark: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const noteId = createNote(null, title);

    // Give it initial content
    const now = new Date().toLocaleString();
    const content = `<p>${quickBody.trim()}</p><p><small style="color: #c084fc;">Captured at ${now} • #QuickSpark</small></p>`;
    // Update active note right away
    setTimeout(() => {
      onOpenNote(noteId);
      setQuickTitle('');
      setQuickBody('');
      setQuickSavedToast(true);
      setTimeout(() => setQuickSavedToast(false), 2500);
    }, 100);
  };

  const handleExportJSON = () => {
    const jsonStr = exportNotebookJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `magic_notes_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importNotebookJSON(content);
      if (res.success) {
        setImportStatus('Notebook data successfully restored! ✨');
      } else {
        setImportStatus(`Restore error: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  const activeNote = notes.find((n) => n.id === activeNoteId);
  const activeNoteTOC = activeNote ? parseTableOfContents(activeNote.content) : [];
  const searchResultsNotes = filterNotes(notes, searchQuery);
  const searchResultsSources = filterSources(sources, searchQuery);
  const bookmarkedSources = sources.filter((s) => s.is_bookmarked);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#140e2e] border border-purple-500/35 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] text-purple-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-800/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-lg text-white">Galaxy Research Tools</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-purple-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 py-3 border-b border-purple-900/50 overflow-x-auto scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('timer')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'timer'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-[#1e1644] text-purple-300 hover:bg-[#281e5c]'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Focus Timer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quickcapture')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'quickcapture'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-[#1e1644] text-purple-300 hover:bg-[#281e5c]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Quick Spark</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'search'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-[#1e1644] text-purple-300 hover:bg-[#281e5c]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Global Search</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookmarks')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'bookmarks'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-[#1e1644] text-purple-300 hover:bg-[#281e5c]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('toc')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'toc'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-[#1e1644] text-purple-300 hover:bg-[#281e5c]'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>Table of Contents</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'backup'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-[#1e1644] text-purple-300 hover:bg-[#281e5c]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Backup & Restore</span>
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="flex-1 overflow-y-auto py-5">
          {/* TAB 1: FOCUS TIMER */}
          {activeTab === 'timer' && (
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSetTimer(25, 'focus')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    timerMode === 'focus' && secondsLeft === 25 * 60
                      ? 'bg-pink-600 text-white'
                      : 'bg-[#1d1645] text-purple-300'
                  }`}
                >
                  25 min Deep Focus
                </button>
                <button
                  type="button"
                  onClick={() => handleSetTimer(5, 'break')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    timerMode === 'break' && secondsLeft === 5 * 60
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#1d1645] text-purple-300'
                  }`}
                >
                  5 min Cosmic Break
                </button>
                <button
                  type="button"
                  onClick={() => handleSetTimer(15, 'focus')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    secondsLeft === 15 * 60
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#1d1645] text-purple-300'
                  }`}
                >
                  15 min Quick Sprint
                </button>
              </div>

              {/* Big Circular Clock */}
              <div className="relative w-48 h-48 rounded-full border-4 border-purple-500/40 bg-gradient-to-br from-purple-950 to-indigo-950 flex flex-col items-center justify-center shadow-2xl shadow-purple-950">
                <div className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-wider">
                  {formatTime(secondsLeft)}
                </div>
                <div className="text-xs uppercase tracking-widest text-pink-300 font-semibold mt-1">
                  {timerMode === 'focus' ? 'Deep Universe Focus' : 'Cosmic Tea Break'}
                </div>
              </div>

              {/* Play / Pause / Reset Controls */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg flex items-center gap-2"
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Start Focus
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSetTimer(timerMode === 'focus' ? 25 : 5, timerMode)}
                  className="p-2.5 rounded-2xl bg-[#1e1546] hover:bg-[#281d5e] text-purple-300 border border-purple-700/40"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-purple-400 max-w-sm">
                Gentle 528Hz Solfeggio frequency harmonic chime plays upon completion to mark your milestone!
              </p>
            </div>
          )}

          {/* TAB 2: QUICK CAPTURE */}
          {activeTab === 'quickcapture' && (
            <form onSubmit={handleQuickCaptureSubmit} className="space-y-4">
              <p className="text-xs text-purple-300">
                Jot down sudden inspirations, lyrical theories, or fleeting ideas directly into your inbox.
              </p>

              <div>
                <label className="block text-xs font-semibold text-purple-300 mb-1">
                  Spark Title (Optional)
                </label>
                <input
                  type="text"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="e.g. Demian connection in Blood Sweat & Tears"
                  className="w-full bg-[#1b143c] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300 mb-1">
                  Your Thought / Note
                </label>
                <textarea
                  rows={5}
                  required
                  value={quickBody}
                  onChange={(e) => setQuickBody(e.target.value)}
                  placeholder="Type your cosmic spark here..."
                  className="w-full bg-[#1b143c] border border-purple-700/50 rounded-2xl p-3 text-xs text-purple-100 focus:outline-none focus:border-purple-400 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                {quickSavedToast && (
                  <span className="text-xs text-emerald-400 font-semibold">
                    ✨ Spark saved to your notebook!
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg"
                >
                  Save Idea Instantly
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: GLOBAL SEARCH */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search across all titles, note bodies, and sources..."
                  className="w-full bg-[#1b143c] border border-purple-700/50 rounded-xl pl-9 pr-3 py-2 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-purple-300">
                  Notes ({searchResultsNotes.length})
                </h5>
                <div className="space-y-2">
                  {searchResultsNotes.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onOpenNote(n.id);
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-[#1b143c] hover:bg-[#251b54] cursor-pointer border border-purple-800/40 text-xs transition-colors"
                    >
                      <div className="font-bold text-purple-100">{n.title}</div>
                      <p className="text-purple-300/70 line-clamp-1 mt-0.5">
                        {n.content.replace(/<[^>]*>/g, ' ')}
                      </p>
                    </div>
                  ))}
                  {searchResultsNotes.length === 0 && (
                    <div className="text-xs text-purple-400/70 py-2">No matching notes found.</div>
                  )}
                </div>

                <h5 className="font-bold text-xs uppercase tracking-wider text-purple-300 pt-2">
                  Sources ({searchResultsSources.length})
                </h5>
                <div className="space-y-2">
                  {searchResultsSources.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl bg-[#1b143c] border border-purple-800/40 text-xs flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-purple-100">{s.title}</div>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-400 underline font-mono text-[11px] break-all inline-flex items-center gap-1"
                        >
                          {s.url} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                  {searchResultsSources.length === 0 && (
                    <div className="text-xs text-purple-400/70 py-2">No matching sources found.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BOOKMARKS */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-purple-300">
                Starred Research Bookmarks ({bookmarkedSources.length})
              </h5>
              <div className="space-y-2">
                {bookmarkedSources.map((bm) => (
                  <div
                    key={bm.id}
                    className="p-3 rounded-xl bg-[#1b143c] border border-purple-800/40 text-xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-purple-100">{bm.title}</div>
                      <a
                        href={bm.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 underline font-mono text-[11px] inline-flex items-center gap-1 mt-0.5"
                      >
                        {bm.url} <ExternalLink className="w-3 h-3" />
                      </a>
                      {bm.comments && (
                        <p className="text-purple-300/80 mt-1">{bm.comments}</p>
                      )}
                    </div>
                  </div>
                ))}

                {bookmarkedSources.length === 0 && (
                  <div className="py-12 text-center text-xs text-purple-400">
                    No bookmarked sources yet. Star key sources in your Research Projects to access them quickly here!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: TABLE OF CONTENTS */}
          {activeTab === 'toc' && (
            <div className="space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-purple-300">
                Table of Contents: {activeNote?.title || 'Open Note'}
              </h5>
              {activeNoteTOC.length > 0 ? (
                <div className="space-y-1.5">
                  {activeNoteTOC.map((heading) => (
                    <div
                      key={heading.id}
                      className="p-2 rounded-lg bg-[#1b143c] text-xs hover:text-pink-300 cursor-pointer"
                      style={{ paddingLeft: `${heading.level * 16}px` }}
                    >
                      • {heading.text}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-purple-400">
                  No headings detected in this note. Add H1 or H2 headings in the editor to automatically build a Table of Contents!
                </div>
              )}
            </div>
          )}

          {/* TAB 6: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#1b143c] border border-purple-800/40">
                <h5 className="font-bold text-sm text-purple-100 flex items-center gap-2 mb-1">
                  <Download className="w-4 h-4 text-purple-400" />
                  <span>Export Complete Galaxy Data</span>
                </h5>
                <p className="text-xs text-purple-300 mb-4">
                  Download a JSON file containing all your notes, sticker placements, research collections, sources, and personal settings.
                </p>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export Backup File (.json)
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#1b143c] border border-purple-800/40">
                <h5 className="font-bold text-sm text-purple-100 flex items-center gap-2 mb-1">
                  <Upload className="w-4 h-4 text-pink-400" />
                  <span>Restore from Backup File</span>
                </h5>
                <p className="text-xs text-purple-300 mb-4">
                  Select a previously exported Magic Notes JSON file to restore your notebook.
                </p>

                <input
                  type="file"
                  accept=".json,application/json"
                  ref={fileInputRef}
                  onChange={handleImportFile}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#251a54] hover:bg-[#30226c] border border-purple-600/40 text-purple-200 text-xs font-semibold shadow flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Select Backup JSON File
                </button>

                {importStatus && (
                  <p className="text-xs text-emerald-300 font-semibold mt-3">
                    {importStatus}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
