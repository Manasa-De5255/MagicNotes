import React, { useState } from 'react';
import { useNotebook } from '../context/NotebookContext';
import { Project, ProjectStatus, TaskPriority } from '../types/notebook';
import {
  FolderPlus,
  Tag,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  Link2,
  HelpCircle,
  Bookmark,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ResearchOrganizerProps {
  onOpenNote: (noteId: string) => void;
}

const GRADIENT_THEMES = [
  { id: 'from-purple-950 via-indigo-900 to-slate-900', label: 'Borahae Night' },
  { id: 'from-fuchsia-950 via-purple-900 to-indigo-950', label: 'Mikrokosmos Rose' },
  { id: 'from-blue-950 via-indigo-950 to-slate-900', label: 'Whalien Deep Sea' },
  { id: 'from-amber-950 via-purple-950 to-slate-950', label: 'Spring Day Dawn' },
];

export const ResearchOrganizer: React.FC<ResearchOrganizerProps> = ({ onOpenNote }) => {
  const {
    projects,
    notes,
    sources,
    tasks,
    activeProjectId,
    setActiveProjectId,
    createProject,
    updateProject,
    deleteProject,
    createNote,
    createSource,
    deleteSource,
    toggleBookmarkSource,
    createTask,
    toggleTask,
    deleteTask,
  } = useNotebook();

  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'notes' | 'sources' | 'findings' | 'tasks'>('notes');

  // Modals & form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('BTS Universe Lore');
  const [newCover, setNewCover] = useState(GRADIENT_THEMES[0].id);
  const [newTags, setNewTags] = useState('Lore, Analysis');

  // Source form state
  const [showAddSource, setShowAddSource] = useState(false);
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceAuthor, setSourceAuthor] = useState('');
  const [sourceDate, setSourceDate] = useState('');
  const [sourceComments, setSourceComments] = useState('');

  // Task form state
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');

  // New research question state
  const [newQuestionText, setNewQuestionText] = useState('');

  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const filteredProjects = projects.filter((p) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tagsArr = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const id = createProject({
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory.trim(),
      cover_gradient: newCover,
      tags: tagsArr,
      status: 'planning',
      research_questions: ['What core philosophical concepts are explored in this collection?'],
    });

    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
    setActiveProjectId(id);
  };

  const handleAddSourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceTitle.trim() || !sourceUrl.trim() || !currentProject) return;

    // Ensure valid URL protocol
    let formattedUrl = sourceUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    createSource({
      project_id: currentProject.id,
      title: sourceTitle.trim(),
      url: formattedUrl,
      author: sourceAuthor.trim(),
      publication_date: sourceDate.trim(),
      comments: sourceComments.trim(),
      tags: [currentProject.category],
    });

    setSourceTitle('');
    setSourceUrl('');
    setSourceAuthor('');
    setSourceDate('');
    setSourceComments('');
    setShowAddSource(false);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !currentProject) return;

    createTask({
      project_id: currentProject.id,
      title: taskTitle.trim(),
      due_date: taskDueDate,
      priority: taskPriority,
    });

    setTaskTitle('');
    setTaskDueDate('');
    setShowAddTask(false);
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim() || !currentProject) return;
    const existing = currentProject.research_questions || [];
    updateProject(currentProject.id, {
      research_questions: [...existing, newQuestionText.trim()],
    });
    setNewQuestionText('');
  };

  const handleRemoveQuestion = (idx: number) => {
    if (!currentProject) return;
    const existing = currentProject.research_questions || [];
    updateProject(currentProject.id, {
      research_questions: existing.filter((_, i) => i !== idx),
    });
  };

  // Sub-items for the current project
  const projectNotes = notes.filter((n) => currentProject && n.project_id === currentProject.id);
  const projectSources = sources.filter((s) => currentProject && s.project_id === currentProject.id);
  const projectTasks = tasks.filter((t) => currentProject && t.project_id === currentProject.id);

  const completedTasksCount = projectTasks.filter((t) => t.completed).length;
  const progressPercent =
    projectTasks.length > 0 ? Math.round((completedTasksCount / projectTasks.length) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden p-3 sm:p-6 gap-5">
      {/* Sidebar: Projects List */}
      <div className="w-full md:w-80 flex flex-col bg-[#140e2e]/90 backdrop-blur-md border border-purple-500/25 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-base text-purple-100">Research Projects</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all flex items-center justify-center"
            title="Create Research Project"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex gap-1 mb-3 p-1 rounded-xl bg-[#1c153d] border border-purple-800/40 text-xs">
          {(['all', 'planning', 'in_progress', 'completed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`flex-1 py-1 rounded-lg capitalize font-medium transition-colors ${
                filterStatus === st
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-purple-400 hover:text-purple-200'
              }`}
            >
              {st === 'in_progress' ? 'Active' : st}
            </button>
          ))}
        </div>

        {/* Projects Cards List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filteredProjects.map((p) => {
            const isSelected = currentProject?.id === p.id;
            const noteCount = notes.filter((n) => n.project_id === p.id).length;

            return (
              <div
                key={p.id}
                onClick={() => setActiveProjectId(p.id)}
                className={`p-3.5 rounded-2xl cursor-pointer border transition-all text-left relative overflow-hidden ${
                  isSelected
                    ? 'border-purple-400 bg-[#251b54] shadow-lg shadow-purple-950/60 scale-[1.02]'
                    : 'border-purple-800/40 bg-[#1a133b]/60 hover:bg-[#201748]'
                }`}
              >
                {/* Subtle gradient banner */}
                <div
                  className={`h-2 -mt-3.5 -mx-3.5 mb-2.5 bg-gradient-to-r ${p.cover_gradient}`}
                />

                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-purple-100 line-clamp-1">{p.title}</h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                      p.status === 'completed'
                        ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                        : p.status === 'in_progress'
                        ? 'bg-purple-900/60 border border-purple-500/40 text-pink-300'
                        : 'bg-indigo-950 border border-indigo-500/40 text-indigo-300'
                    }`}
                  >
                    {p.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-purple-300/70 line-clamp-2 mt-1">
                  {p.description || 'No description yet.'}
                </p>

                <div className="flex items-center justify-between text-[11px] text-purple-400 mt-2.5 pt-2 border-t border-purple-900/40">
                  <span>{p.category}</span>
                  <span>{noteCount} notes</span>
                </div>
              </div>
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="py-12 text-center text-xs text-purple-400">
              No research projects found. Create one to organize notes!
            </div>
          )}
        </div>
      </div>

      {/* Main Panel: Active Project Details & Subtopics */}
      {currentProject ? (
        <div className="flex-1 flex flex-col bg-[#140e2e]/90 backdrop-blur-md border border-purple-500/25 rounded-3xl overflow-hidden shadow-xl">
          {/* Cover Header Banner */}
          <div
            className={`p-6 sm:p-8 bg-gradient-to-r ${currentProject.cover_gradient} border-b border-purple-500/30 text-white relative`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur border border-white/20 mb-2">
                  {currentProject.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {currentProject.title}
                </h2>
                <p className="text-sm text-purple-200/90 max-w-2xl mt-1.5">
                  {currentProject.description}
                </p>

                {/* Tags */}
                {currentProject.tags && currentProject.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {currentProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-purple-900/40 border border-purple-400/30 text-purple-200"
                      >
                        <Tag className="w-3 h-3 text-pink-300" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Selector & Delete */}
              <div className="flex items-center gap-2">
                <select
                  value={currentProject.status}
                  onChange={(e) =>
                    updateProject(currentProject.id, {
                      status: e.target.value as ProjectStatus,
                    })
                  }
                  className="bg-purple-950/70 border border-purple-400/40 text-purple-100 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
                >
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete project "${currentProject.title}"?`)) {
                      deleteProject(currentProject.id);
                    }
                  }}
                  className="p-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900 border border-rose-500/30 text-rose-300 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Task Progress Bar */}
            <div className="mt-5 flex items-center gap-3">
              <div className="flex-1 bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-pink-200">{progressPercent}% done</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-purple-900/60 bg-[#161033] px-4">
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'notes'
                  ? 'border-pink-500 text-pink-300'
                  : 'border-transparent text-purple-400 hover:text-purple-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Notes ({projectNotes.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sources')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'sources'
                  ? 'border-pink-500 text-pink-300'
                  : 'border-transparent text-purple-400 hover:text-purple-200'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Sources & Citations ({projectSources.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('findings')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'findings'
                  ? 'border-pink-500 text-pink-300'
                  : 'border-transparent text-purple-400 hover:text-purple-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Questions & Findings</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tasks')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'tasks'
                  ? 'border-pink-500 text-pink-300'
                  : 'border-transparent text-purple-400 hover:text-purple-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tasks ({projectTasks.length})</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-purple-100">
            {/* --- TAB 1: NOTES --- */}
            {activeTab === 'notes' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-purple-200">
                    Notebook Pages Filed Under This Project
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = createNote(currentProject.id, `Research Page #${projectNotes.length + 1}`);
                      onOpenNote(newId);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" /> Add Page to Project
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {projectNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => onOpenNote(note.id)}
                      className="p-4 rounded-2xl bg-[#1b143b] hover:bg-[#231a4d] border border-purple-800/40 hover:border-purple-500/60 cursor-pointer transition-all shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h5 className="font-bold text-sm text-purple-100 line-clamp-1">
                            {note.title}
                          </h5>
                          {note.is_pinned && <span className="text-xs">📌</span>}
                        </div>
                        <p className="text-xs text-purple-400/80 line-clamp-3">
                          {note.content.replace(/<[^>]*>/g, ' ')}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-purple-400 mt-4 pt-2 border-t border-purple-900/40">
                        <span>{note.word_count} words</span>
                        <span>{note.stickers.length} stickers</span>
                      </div>
                    </div>
                  ))}

                  {projectNotes.length === 0 && (
                    <div className="col-span-full py-12 text-center text-purple-400 text-xs">
                      No notes created in this project yet. Click "+ Add Page to Project" to draft your findings!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- TAB 2: SOURCES & CITATIONS --- */}
            {activeTab === 'sources' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-purple-200">
                    Saved Research Sources & Web References
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddSource(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" /> Add Source
                  </button>
                </div>

                <div className="space-y-3">
                  {projectSources.map((source) => (
                    <div
                      key={source.id}
                      className="p-4 rounded-2xl bg-[#1b143b] border border-purple-800/40 hover:border-purple-500/50 transition-colors shadow-md flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleBookmarkSource(source.id)}
                            className="text-purple-400 hover:text-amber-400 transition-colors"
                          >
                            <Bookmark
                              className={`w-4 h-4 ${
                                source.is_bookmarked ? 'text-amber-400 fill-amber-400' : ''
                              }`}
                            />
                          </button>
                          <h5 className="font-bold text-sm text-purple-100">{source.title}</h5>
                        </div>

                        {/* Clickable URL */}
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 underline font-mono break-all"
                        >
                          <span>{source.url}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>

                        <div className="flex flex-wrap gap-3 text-xs text-purple-300/80 mt-2">
                          {source.author && <span>Author: {source.author}</span>}
                          {source.publication_date && <span>Published: {source.publication_date}</span>}
                        </div>

                        {source.comments && (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-[#221a48]/70 text-xs text-purple-200 border-l-2 border-pink-500">
                            <strong>Notes: </strong>
                            {source.comments}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteSource(source.id)}
                        className="p-1.5 text-purple-400 hover:text-rose-400 transition-colors self-end sm:self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {projectSources.length === 0 && (
                    <div className="py-12 text-center text-purple-400 text-xs">
                      No research sources saved yet. Save reference articles, books, video essays, or discography links!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- TAB 3: QUESTIONS & FINDINGS --- */}
            {activeTab === 'findings' && (
              <div className="space-y-6">
                {/* Research Questions */}
                <div>
                  <h4 className="font-bold text-sm text-purple-200 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-pink-400" />
                    <span>Research Questions & Hypotheses</span>
                  </h4>
                  <div className="space-y-2 mb-3">
                    {(currentProject.research_questions || []).map((q, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#1b143b] border border-purple-800/40 text-xs text-purple-200"
                      >
                        <span className="flex-1 pr-2">
                          <strong>Q{idx + 1}: </strong> {q}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-purple-400 hover:text-rose-400 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="Add another research question or theory hypothesis..."
                      className="flex-1 bg-[#1a133b] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                    >
                      Add Question
                    </button>
                  </div>
                </div>

                {/* Key Findings Section */}
                <div>
                  <h4 className="font-bold text-sm text-purple-200 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Important Findings & Breakthroughs</span>
                  </h4>
                  <textarea
                    rows={4}
                    value={currentProject.key_findings || ''}
                    onChange={(e) =>
                      updateProject(currentProject.id, { key_findings: e.target.value })
                    }
                    placeholder="Record key discoveries, breakthrough interpretations, or recurring motifs..."
                    className="w-full bg-[#1b143b] border border-purple-800/40 rounded-2xl p-3 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400 leading-relaxed"
                  />
                </div>

                {/* Final Summary */}
                <div>
                  <h4 className="font-bold text-sm text-purple-200 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Final Research Summary & Conclusion</span>
                  </h4>
                  <textarea
                    rows={4}
                    value={currentProject.summary || ''}
                    onChange={(e) =>
                      updateProject(currentProject.id, { summary: e.target.value })
                    }
                    placeholder="Draft your overarching conclusion or final thesis summary here..."
                    className="w-full bg-[#1b143b] border border-purple-800/40 rounded-2xl p-3 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* --- TAB 4: TASKS --- */}
            {activeTab === 'tasks' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-purple-200">
                    Project Milestones & Study Tasks
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddTask(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                </div>

                <div className="space-y-2.5">
                  {projectTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        t.completed
                          ? 'bg-[#151030]/50 border-purple-900/30 opacity-70'
                          : 'bg-[#1b143b] border-purple-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => toggleTask(t.id)}
                          className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                        />
                        <div>
                          <p
                            className={`text-xs font-medium ${
                              t.completed
                                ? 'line-through text-purple-400'
                                : 'text-purple-100'
                            }`}
                          >
                            {t.title}
                          </p>
                          {t.due_date && (
                            <span className="text-[11px] text-purple-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-pink-400" /> Due: {t.due_date}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                            t.priority === 'high'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : t.priority === 'medium'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {t.priority}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteTask(t.id)}
                          className="text-purple-400 hover:text-rose-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {projectTasks.length === 0 && (
                    <div className="py-12 text-center text-purple-400 text-xs">
                      No tasks yet. Break your research down into actionable milestones!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-purple-300">
          <FolderPlus className="w-12 h-12 text-purple-400 mb-3" />
          <h3 className="text-lg font-bold text-purple-100">No Research Project Selected</h3>
          <p className="text-xs text-purple-400 max-w-sm mt-1 mb-4">
            Create your first collection to group notes, sources, questions, and tasks.
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Research Project
          </button>
        </div>
      )}

      {/* --- CREATE PROJECT MODAL --- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#181138] border border-purple-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-400" /> New Research Collection
            </h3>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Map of the Soul & Jungian Archetypes"
                  className="w-full bg-[#120d2a] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300 mb-1">
                  Description & Scope
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What is this research project investigating?"
                  className="w-full bg-[#120d2a] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="BTS Universe Lore, Lyrics Analysis, Philosophy..."
                  className="w-full bg-[#120d2a] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Demian, Persona, Symbolism"
                  className="w-full bg-[#120d2a] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300 mb-1.5">
                  Cover Galaxy Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GRADIENT_THEMES.map((th) => (
                    <div
                      key={th.id}
                      onClick={() => setNewCover(th.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        newCover === th.id
                          ? 'border-pink-400 ring-2 ring-pink-400/40'
                          : 'border-purple-800/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className={`h-6 rounded-lg bg-gradient-to-r ${th.id} mb-1.5`} />
                      <span className="text-[11px] font-medium text-purple-200">{th.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold shadow"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD SOURCE MODAL --- */}
      {showAddSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#181138] border border-purple-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-pink-400" /> Save Research Source
            </h3>

            <form onSubmit={handleAddSourceSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-purple-300 mb-1">
                  Source Title / Article Name
                </label>
                <input
                  type="text"
                  required
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  placeholder="e.g. Demian: The Story of Emil Sinclair's Youth"
                  className="w-full bg-[#120d2a] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  required
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#120d2a] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Author / Creator
                  </label>
                  <input
                    type="text"
                    value={sourceAuthor}
                    onChange={(e) => setSourceAuthor(e.target.value)}
                    placeholder="e.g. Hermann Hesse"
                    className="w-full bg-[#120d2a] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Publication Date / Year
                  </label>
                  <input
                    type="text"
                    value={sourceDate}
                    onChange={(e) => setSourceDate(e.target.value)}
                    placeholder="e.g. 1919"
                    className="w-full bg-[#120d2a] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300 mb-1">
                  My Comments & Key Quotes
                </label>
                <textarea
                  rows={2}
                  value={sourceComments}
                  onChange={(e) => setSourceComments(e.target.value)}
                  placeholder="Why is this reference critical to your theory?"
                  className="w-full bg-[#120d2a] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSource(false)}
                  className="px-4 py-2 rounded-xl bg-purple-900/40 text-purple-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow"
                >
                  Save Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD TASK MODAL --- */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#181138] border border-purple-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> New Research Task
            </h3>

            <form onSubmit={handleAddTaskSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-purple-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Compare Wings MV with Demian Chapter 5"
                  className="w-full bg-[#120d2a] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-[#120d2a] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full bg-[#120d2a] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 rounded-xl bg-purple-900/40 text-purple-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
