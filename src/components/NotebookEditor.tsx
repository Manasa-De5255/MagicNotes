import React, { useState, useRef, useEffect } from 'react';
import { useNotebook } from '../context/NotebookContext';
import { PaperStyle } from '../types/notebook';
import { NotebookStickerCanvas } from './NotebookStickerCanvas';
import { calculateWordCount } from '../utils/notebookUtils';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Highlighter,
  CheckSquare,
  Table as TableIcon,
  Maximize2,
  Minimize2,
  Copy,
  Trash2,
  Pin,
  Star,
  Printer,
  FileDown,
  Sparkles,
  Undo2,
  Redo2,
  CloudCheck,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

interface NotebookEditorProps {
  onOpenStickerPanel: () => void;
  onOpenProjects: () => void;
}

const PAGE_COLORS = [
  { id: '#ffffff', label: 'Crisp White', isDark: false },
  { id: '#fdfbf7', label: 'Vintage Cream', isDark: false },
  { id: '#f5efff', label: 'Borahae Lavender', isDark: false },
  { id: '#fdf2f8', label: 'Sakura Pink', isDark: false },
  { id: '#f0fdf4', label: 'Cosmic Mint', isDark: false },
  { id: '#181236', label: 'Midnight Nebula', isDark: true },
  { id: '#0f0c22', label: 'Deep Space', isDark: true },
];

export const NotebookEditor: React.FC<NotebookEditorProps> = ({
  onOpenStickerPanel,
  onOpenProjects,
}) => {
  const {
    notes,
    projects,
    activeNoteId,
    updateNote,
    deleteNote,
    duplicateNote,
    togglePinNote,
    toggleFavoriteNote,
    syncState,
    updateStickerOnNote,
    removeStickerFromNote,
    createNote,
  } = useNotebook();

  const activeNote = notes.find((n) => n.id === activeNoteId);
  const editorRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Sync content with editorRef when active note changes
  useEffect(() => {
    if (editorRef.current && activeNote) {
      if (editorRef.current.innerHTML !== activeNote.content) {
        editorRef.current.innerHTML = activeNote.content;
      }
    }
  }, [activeNoteId]);

  if (!activeNote) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-purple-300">
        <div className="w-16 h-16 rounded-3xl bg-purple-900/30 border border-purple-500/20 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-purple-100">No Note Selected</h3>
        <p className="text-sm text-purple-400 max-w-sm mt-1 mb-6">
          Choose a note from the universe shelves or create a fresh galaxy page to begin writing.
        </p>
        <button
          type="button"
          onClick={() => createNote(null, 'My Cosmic Thoughts')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg shadow-purple-900/40 text-sm flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Create New Note
        </button>
      </div>
    );
  }

  const currentProject = projects.find((p) => p.id === activeNote.project_id);

  const handleContentInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const count = calculateWordCount(html);
    updateNote(activeNote.id, {
      content: html,
      word_count: count,
    });
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleContentInput();
    }
  };

  const insertChecklist = () => {
    const checklistHtml = `<ul style="list-style-type: none; padding-left: 0;">
      <li style="display: flex; align-items: center; gap: 8px;">
        <input type="checkbox" style="cursor: pointer; width: 16px; height: 16px; accent-color: #9333ea;" />
        <span>Research milestone task</span>
      </li>
    </ul><p></p>`;
    executeCommand('insertHTML', checklistHtml);
  };

  const insertSimpleTable = () => {
    const tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 12px 0; border: 1px solid rgba(168, 85, 247, 0.3);">
      <thead>
        <tr style="background-color: rgba(168, 85, 247, 0.15);">
          <th style="border: 1px solid rgba(168, 85, 247, 0.3); padding: 8px; text-align: left;">Key Concept / Lyric</th>
          <th style="border: 1px solid rgba(168, 85, 247, 0.3); padding: 8px; text-align: left;">BU Symbolism & Analysis</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid rgba(168, 85, 247, 0.3); padding: 8px;">Spring Day Motel</td>
          <td style="border: 1px solid rgba(168, 85, 247, 0.3); padding: 8px;">Omelas moral dilemma and memory preservation</td>
        </tr>
      </tbody>
    </table><p></p>`;
    executeCommand('insertHTML', tableHtml);
  };

  const handleExportMarkdown = () => {
    const cleanContent = activeNote.content
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br\s*[\/]?>/gi, '\n')
      .replace(/<[^>]*>/g, '');

    const mdText = `# ${activeNote.title}\n\n${cleanContent}\n\n---\n*Written in Magic Notes – BTS Universe Research Notebook*`;
    const blob = new Blob([mdText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeNote.title.replace(/[^a-z0-9]/gi, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const isDarkPaper =
    activeNote.page_color === '#181236' || activeNote.page_color === '#0f0c22';

  return (
    <div
      className={`flex-1 min-h-0 flex flex-col h-full transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#0d091e] p-4 sm:p-8'
          : 'relative p-2 sm:p-4 max-w-5xl mx-auto w-full'
      }`}
    >
      {/* Top Note Actions & Metadata Bar */}
      <div className="no-print flex-shrink-0 bg-[#161033]/95 backdrop-blur-md border border-purple-500/25 rounded-2xl p-2.5 sm:p-3 mb-2 shadow-lg flex flex-wrap items-center justify-between gap-2 z-30">
        {/* Left: Project tag & Note Title input */}
        <div className="flex-1 min-w-[260px] flex items-center gap-2">
          {currentProject ? (
            <button
              type="button"
              onClick={onOpenProjects}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-medium hover:bg-purple-800/60 transition-colors"
            >
              <FolderOpen className="w-3.5 h-3.5 text-pink-400" />
              <span className="max-w-[140px] truncate">{currentProject.title}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenProjects}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#221a47] hover:bg-[#2b215a] text-purple-400 hover:text-purple-200 text-xs transition-colors"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Link Project</span>
            </button>
          )}

          <input
            type="text"
            value={activeNote.title}
            onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
            placeholder="Note title..."
            className="flex-1 bg-transparent text-lg font-bold text-purple-100 placeholder-purple-400/40 focus:outline-none focus:ring-1 focus:ring-purple-400/50 rounded px-1.5 py-0.5"
          />
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Sync indicator */}
          <div className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300">
            {syncState === 'saving' ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-pink-400" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CloudCheck className="w-3 h-3 text-emerald-400" />
                <span>Saved</span>
              </>
            )}
          </div>

          {/* Stickers button */}
          <button
            type="button"
            onClick={onOpenStickerPanel}
            title="Open Galaxy Stickers"
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Stickers</span>
            {activeNote.stickers.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-purple-900 text-[10px] font-bold flex items-center justify-center">
                {activeNote.stickers.length}
              </span>
            )}
          </button>

          {/* Pin toggle */}
          <button
            type="button"
            onClick={() => togglePinNote(activeNote.id)}
            title={activeNote.is_pinned ? 'Unpin Note' : 'Pin Note'}
            className={`p-2 rounded-xl border transition-colors ${
              activeNote.is_pinned
                ? 'bg-purple-600 border-purple-400 text-white'
                : 'bg-[#1e1742] border-purple-700/40 text-purple-300 hover:bg-[#281f59]'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>

          {/* Favorite toggle */}
          <button
            type="button"
            onClick={() => toggleFavoriteNote(activeNote.id)}
            title={activeNote.is_favorite ? 'Remove Favorite' : 'Mark Favorite'}
            className={`p-2 rounded-xl border transition-colors ${
              activeNote.is_favorite
                ? 'bg-pink-600 border-pink-400 text-white'
                : 'bg-[#1e1742] border-purple-700/40 text-purple-300 hover:bg-[#281f59]'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${activeNote.is_favorite ? 'fill-white' : ''}`}
            />
          </button>

          {/* Duplicate note */}
          <button
            type="button"
            onClick={() => duplicateNote(activeNote.id)}
            title="Duplicate Note"
            className="p-2 rounded-xl bg-[#1e1742] border border-purple-700/40 text-purple-300 hover:bg-[#281f59] transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Export markdown */}
          <button
            type="button"
            onClick={handleExportMarkdown}
            title="Export as Markdown"
            className="p-2 rounded-xl bg-[#1e1742] border border-purple-700/40 text-purple-300 hover:bg-[#281f59] transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
          </button>

          {/* Print/PDF */}
          <button
            type="button"
            onClick={handlePrint}
            title="Print or Save as PDF"
            className="p-2 rounded-xl bg-[#1e1742] border border-purple-700/40 text-purple-300 hover:bg-[#281f59] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Distraction-Free Mode'}
            className="p-2 rounded-xl bg-[#1e1742] border border-purple-700/40 text-purple-300 hover:bg-[#281f59] transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Delete note */}
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            title="Delete Note"
            className="p-2 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 hover:bg-rose-900/60 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Formatting & Paper Toolbar */}
      <div className="no-print flex-shrink-0 bg-[#181138]/95 backdrop-blur-md border border-purple-500/20 rounded-2xl p-2 mb-2 shadow-md flex flex-wrap items-center justify-between gap-1 text-purple-200 z-30">
        {/* Formatting actions */}
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none py-0.5">
          <button
            type="button"
            onClick={() => executeCommand('undo')}
            title="Undo"
            className="p-1.5 rounded-lg hover:bg-purple-800/50 text-purple-300"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('redo')}
            title="Redo"
            className="p-1.5 rounded-lg hover:bg-purple-800/50 text-purple-300"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-purple-700/50 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h1>')}
            title="Heading 1"
            className="p-1.5 rounded-lg hover:bg-purple-800/50 text-purple-300"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h2>')}
            title="Heading 2"
            className="p-1.5 rounded-lg hover:bg-purple-800/50 text-purple-300"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-purple-700/50 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('bold')}
            title="Bold (Ctrl+B)"
            className="p-1.5 rounded-lg hover:bg-purple-800/50 text-purple-300"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            title="Italic (Ctrl+I)"
            className="p-1.5 rounded-lg hover:bg-purple-800/50 text-purple-300"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            title="Underline (Ctrl+U)"
            className="p-1.5 rounded-lg hover:bg-purple-800/50 text-purple-300"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-purple-700/50 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            title="Bullet list"
            className="p-1.5 rounded-lg hover:bg-purple-800/50 text-purple-300"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            title="Numbered list"
            className="p-1.5 rounded-lg hover:bg-purple-800/50 text-purple-300"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={insertChecklist}
            title="Insert Checklist Item"
            className="p-1.5 rounded-lg hover:bg-purple-800/50 text-purple-300 flex items-center gap-1"
          >
            <CheckSquare className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={insertSimpleTable}
            title="Insert Research Table"
            className="p-1.5 rounded-lg hover:bg-purple-800/50 text-purple-300 flex items-center gap-1"
          >
            <TableIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-purple-700/50 mx-1" />

          {/* Highlight Color */}
          <button
            type="button"
            onClick={() => executeCommand('hiliteColor', '#fbcfe8')}
            title="Highlight Pink"
            className="p-1.5 rounded-lg hover:bg-purple-800/50 text-pink-300"
          >
            <Highlighter className="w-4 h-4" />
          </button>
        </div>

        {/* Paper style & color settings */}
        <div className="flex items-center gap-2 text-xs">
          {/* Paper style selector */}
          <div className="flex items-center rounded-xl bg-[#201847] p-1 border border-purple-700/40">
            {(['plain', 'lined', 'dotted', 'grid'] as PaperStyle[]).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => updateNote(activeNote.id, { paper_style: style })}
                className={`px-2 py-0.5 rounded-lg font-medium capitalize transition-all ${
                  activeNote.paper_style === style
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Page Color Picker Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1.5 rounded-xl border border-purple-700/40 bg-[#201847] flex items-center gap-1.5 text-xs text-purple-200"
              title="Change Paper Color"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-purple-400"
                style={{ backgroundColor: activeNote.page_color }}
              />
              <span className="hidden sm:inline">Color</span>
            </button>

            {showColorPicker && (
              <div className="absolute right-0 top-10 bg-[#161033] border border-purple-500/40 rounded-xl p-2 shadow-2xl flex gap-1.5 z-50 animate-in fade-in">
                {PAGE_COLORS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => {
                      updateNote(activeNote.id, { page_color: col.id });
                      setShowColorPicker(false);
                    }}
                    title={col.label}
                    className="w-6 h-6 rounded-full border border-purple-400/50 hover:scale-110 transition-transform"
                    style={{ backgroundColor: col.id }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Paper Workspace */}
      <div className="flex-1 overflow-y-auto relative rounded-3xl shadow-2xl flex justify-center pb-20">
        <div
          className={`print-page relative w-full max-w-4xl min-h-[750px] p-6 sm:p-12 rounded-3xl transition-colors duration-300 shadow-xl border ${
            isDarkPaper
              ? 'border-purple-800/40 text-purple-100'
              : 'border-purple-200/40 text-slate-900'
          } ${
            activeNote.paper_style === 'lined'
              ? isDarkPaper
                ? 'paper-lined-dark'
                : 'paper-lined'
              : activeNote.paper_style === 'dotted'
              ? isDarkPaper
                ? 'paper-dotted-dark'
                : 'paper-dotted'
              : activeNote.paper_style === 'grid'
              ? isDarkPaper
                ? 'paper-grid-dark'
                : 'paper-grid'
              : ''
          }`}
          style={{ backgroundColor: activeNote.page_color }}
        >
          {/* Interactive Stickers Overlay */}
          <NotebookStickerCanvas
            stickers={activeNote.stickers}
            onUpdateSticker={(stId, upd) => updateStickerOnNote(activeNote.id, stId, upd)}
            onRemoveSticker={(stId) => removeStickerFromNote(activeNote.id, stId)}
          />

          {/* Editable Rich Text Content Area */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleContentInput}
            className="relative z-10 focus:outline-none min-h-[600px] text-base leading-relaxed selection:bg-purple-300 selection:text-purple-950"
            style={{
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="no-print bg-[#130f2e]/80 backdrop-blur border border-purple-500/20 rounded-xl px-4 py-2 mt-2 flex items-center justify-between text-xs text-purple-300/80">
        <div className="flex items-center gap-4">
          <span>{activeNote.word_count || 0} words</span>
          <span>~{Math.max(1, Math.ceil((activeNote.word_count || 0) / 200))} min read</span>
          <span>{activeNote.stickers.length} stickers placed</span>
        </div>
        <div>
          Last updated:{' '}
          {new Date(activeNote.updated_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1b143a] border border-rose-500/40 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-900/40 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Delete Note Permanently?</h4>
            <p className="text-xs text-purple-300 mb-5">
              "{activeNote.title}" and its placed stickers will be removed from your universe.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteNote(activeNote.id);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950"
              >
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
