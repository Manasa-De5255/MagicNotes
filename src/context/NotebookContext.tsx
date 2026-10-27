import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import {
  Note,
  Project,
  ResearchSource,
  ResearchTask,
  UserSettings,
  NoteSticker,
  NotebookExportData,
} from '../types/notebook';
import { useAuth } from './AuthContext';
import { getSupabase } from '../services/supabase';
import { createStarterGalaxyData, clampStickerPosition, validateExportData } from '../utils/notebookUtils';

export type SyncState = 'synced' | 'saving' | 'error' | 'offline_cached';

interface NotebookContextType {
  notes: Note[];
  projects: Project[];
  sources: ResearchSource[];
  tasks: ResearchTask[];
  settings: UserSettings;
  syncState: SyncState;
  syncErrorMessage: string | null;
  activeNoteId: string | null;
  activeProjectId: string | null;
  setActiveNoteId: (id: string | null) => void;
  setActiveProjectId: (id: string | null) => void;
  createNote: (projectId?: string | null, title?: string) => string;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  deleteNote: (noteId: string) => void;
  duplicateNote: (noteId: string) => string;
  togglePinNote: (noteId: string) => void;
  toggleFavoriteNote: (noteId: string) => void;
  createProject: (project: Partial<Project>) => string;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  createSource: (source: Partial<ResearchSource>) => string;
  updateSource: (sourceId: string, updates: Partial<ResearchSource>) => void;
  deleteSource: (sourceId: string) => void;
  toggleBookmarkSource: (sourceId: string) => void;
  createTask: (task: Partial<ResearchTask>) => string;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  addStickerToNote: (noteId: string, stickerId: string) => void;
  updateStickerOnNote: (noteId: string, stickerInstanceId: string, updates: Partial<NoteSticker>) => void;
  removeStickerFromNote: (noteId: string, stickerInstanceId: string) => void;
  exportNotebookJSON: () => string;
  importNotebookJSON: (jsonString: string) => { success: boolean; error?: string };
  loadStarterGuide: () => void;
  clearUserData: () => void;
}

const defaultSettings: UserSettings = {
  theme: 'dark',
  galaxy_wallpaper: 'galaxy-purple',
  accent_color: 'purple',
  font_family: 'Plus Jakarta Sans',
  font_size: 'normal',
  animations_enabled: true,
  default_paper: 'lined',
  favorite_stickers: ['bts_borahae_heart', 'space_crescent_moon', 'char_sleepy_koala', 'char_golden_puppy', 'study_glowing_bulb'],
};

const NotebookContext = createContext<NotebookContextType | undefined>(undefined);

export const NotebookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isCloudConnected } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sources, setSources] = useState<ResearchSource[]>([]);
  const [tasks, setTasks] = useState<ResearchTask[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const [syncState, setSyncState] = useState<SyncState>('synced');
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);

  // Debounced cloud save timer reference
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  // Load data whenever the authenticated user changes
  useEffect(() => {
    if (!user) {
      // Clear in-memory state completely when user logs out
      setNotes([]);
      setProjects([]);
      setSources([]);
      setTasks([]);
      setSettings(defaultSettings);
      setActiveNoteId(null);
      setActiveProjectId(null);
      setSyncState('synced');
      return;
    }

    const loadData = async () => {
      isInitialLoad.current = true;
      const userId = user.id;

      // Try loading from Supabase first if connected
      const supabase = getSupabase();
      if (supabase && isCloudConnected) {
        setSyncState('saving');
        try {
          const [notesRes, projRes, srcRes, taskRes, settingsRes] = await Promise.all([
            supabase.from('notes').select('*').eq('user_id', userId).order('updated_at', { ascending: false }),
            supabase.from('projects').select('*').eq('user_id', userId).order('updated_at', { ascending: false }),
            supabase.from('sources').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
            supabase.from('tasks').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
            supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
          ]);

          if (notesRes.error || projRes.error) {
            throw new Error(notesRes.error?.message || projRes.error?.message);
          }

          const loadedNotes: Note[] = notesRes.data || [];
          const loadedProjects: Project[] = projRes.data || [];
          const loadedSources: ResearchSource[] = srcRes.data || [];
          const loadedTasks: ResearchTask[] = taskRes.data || [];
          const loadedSettings: UserSettings = settingsRes.data ? { ...defaultSettings, ...settingsRes.data } : defaultSettings;

          setNotes(loadedNotes);
          setProjects(loadedProjects);
          setSources(loadedSources);
          setTasks(loadedTasks);
          setSettings(loadedSettings);

          if (loadedNotes.length > 0) {
            setActiveNoteId(loadedNotes[0].id);
          } else {
            setActiveNoteId(null);
          }

          setSyncState('synced');
          isInitialLoad.current = false;
          return;
        } catch (err: unknown) {
          console.warn('Could not load from Supabase, loading from user local cache:', err);
          setSyncState('error');
          setSyncErrorMessage(err instanceof Error ? err.message : 'Cloud sync error');
        }
      }

      // Load strictly from user's isolated local partition: magic_notes_data_<userId>
      const storageKey = `magic_notes_data_${userId}`;
      const settingsKey = `magic_notes_settings_${userId}`;
      const cached = localStorage.getItem(storageKey);
      const cachedSettings = localStorage.getItem(settingsKey);

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setNotes(parsed.notes || []);
          setProjects(parsed.projects || []);
          setSources(parsed.sources || []);
          setTasks(parsed.tasks || []);
          if (parsed.notes && parsed.notes.length > 0) {
            setActiveNoteId(parsed.notes[0].id);
          }
        } catch {
          setNotes([]);
          setProjects([]);
          setSources([]);
          setTasks([]);
        }
      } else {
        // Strict Privacy: Newly registered user starts with an empty notebook!
        setNotes([]);
        setProjects([]);
        setSources([]);
        setTasks([]);
      }

      if (cachedSettings) {
        try {
          setSettings({ ...defaultSettings, ...JSON.parse(cachedSettings) });
        } catch {
          setSettings(defaultSettings);
        }
      } else {
        setSettings(defaultSettings);
      }

      setSyncState('synced');
      isInitialLoad.current = false;
    };

    loadData();
  }, [user, isCloudConnected]);

  // Persist changes whenever notes/projects/sources/tasks/settings update
  const persistChanges = useCallback(
    (
      currentNotes: Note[],
      currentProjects: Project[],
      currentSources: ResearchSource[],
      currentTasks: ResearchTask[],
      currentSettings: UserSettings
    ) => {
      if (!user || isInitialLoad.current) return;

      const userId = user.id;
      // Save locally to user partition immediately for zero-data-loss cache
      const storageKey = `magic_notes_data_${userId}`;
      const settingsKey = `magic_notes_settings_${userId}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          notes: currentNotes,
          projects: currentProjects,
          sources: currentSources,
          tasks: currentTasks,
        })
      );
      localStorage.setItem(settingsKey, JSON.stringify(currentSettings));

      // Debounce sync to Supabase if connected
      const supabase = getSupabase();
      if (supabase && isCloudConnected) {
        setSyncState('saving');
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(async () => {
          try {
            // Upsert settings
            await supabase.from('user_settings').upsert({
              user_id: userId,
              ...currentSettings,
            });

            setSyncState('synced');
            setSyncErrorMessage(null);
          } catch (err: unknown) {
            console.error('Supabase auto-save error:', err);
            setSyncState('error');
            setSyncErrorMessage(err instanceof Error ? err.message : 'Failed to save to cloud');
          }
        }, 1200);
      } else {
        setSyncState('offline_cached');
      }
    },
    [user, isCloudConnected]
  );

  // Trigger sync on state updates
  useEffect(() => {
    if (!isInitialLoad.current && user) {
      persistChanges(notes, projects, sources, tasks, settings);
    }
  }, [notes, projects, sources, tasks, settings, persistChanges, user]);

  // Apply theme class to document element
  useEffect(() => {
    if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [settings.theme]);

  // Actions
  const createNote = (projectId: string | null = null, title = 'Untitled Note'): string => {
    if (!user) return '';
    const now = new Date().toISOString();
    const newNote: Note = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: user.id,
      project_id: projectId,
      title,
      content: '<p>Start jotting down your thoughts, research, or lyrics...</p>',
      paper_style: settings.default_paper || 'lined',
      page_color: '#f8f4ff',
      stickers: [],
      is_pinned: false,
      is_favorite: false,
      tags: [],
      word_count: 9,
      created_at: now,
      updated_at: now,
    };

    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);

    // Save to Supabase if connected
    const supabase = getSupabase();
    if (supabase && isCloudConnected) {
      supabase.from('notes').insert([newNote]).then();
    }

    return newNote.id;
  };

  const updateNote = (noteId: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          const updated = {
            ...n,
            ...updates,
            updated_at: new Date().toISOString(),
          };

          const supabase = getSupabase();
          if (supabase && isCloudConnected) {
            supabase.from('notes').update(updated).eq('id', noteId).eq('user_id', user?.id).then();
          }

          return updated;
        }
        return n;
      })
    );
  };

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (activeNoteId === noteId) {
      const remaining = notes.filter((n) => n.id !== noteId);
      setActiveNoteId(remaining.length > 0 ? remaining[0].id : null);
    }

    const supabase = getSupabase();
    if (supabase && isCloudConnected && user) {
      supabase.from('notes').delete().eq('id', noteId).eq('user_id', user.id).then();
    }
  };

  const duplicateNote = (noteId: string): string => {
    const original = notes.find((n) => n.id === noteId);
    if (!original || !user) return '';

    const now = new Date().toISOString();
    const duplicated: Note = {
      ...original,
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: `${original.title} (Copy)`,
      created_at: now,
      updated_at: now,
    };

    setNotes((prev) => [duplicated, ...prev]);
    setActiveNoteId(duplicated.id);

    const supabase = getSupabase();
    if (supabase && isCloudConnected) {
      supabase.from('notes').insert([duplicated]).then();
    }

    return duplicated.id;
  };

  const togglePinNote = (noteId: string) => {
    const target = notes.find((n) => n.id === noteId);
    if (target) {
      updateNote(noteId, { is_pinned: !target.is_pinned });
    }
  };

  const toggleFavoriteNote = (noteId: string) => {
    const target = notes.find((n) => n.id === noteId);
    if (target) {
      updateNote(noteId, { is_favorite: !target.is_favorite });
    }
  };

  const createProject = (proj: Partial<Project>): string => {
    if (!user) return '';
    const now = new Date().toISOString();
    const newProj: Project = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: user.id,
      title: proj.title || 'New Research Collection',
      description: proj.description || '',
      cover_gradient: proj.cover_gradient || 'from-purple-950 via-indigo-900 to-slate-900',
      status: proj.status || 'planning',
      tags: proj.tags || [],
      category: proj.category || 'General Research',
      research_questions: proj.research_questions || [],
      key_findings: proj.key_findings || '',
      summary: proj.summary || '',
      created_at: now,
      updated_at: now,
    };

    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectId(newProj.id);

    const supabase = getSupabase();
    if (supabase && isCloudConnected) {
      supabase.from('projects').insert([newProj]).then();
    }

    return newProj.id;
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updated = {
            ...p,
            ...updates,
            updated_at: new Date().toISOString(),
          };

          const supabase = getSupabase();
          if (supabase && isCloudConnected && user) {
            supabase.from('projects').update(updated).eq('id', projectId).eq('user_id', user.id).then();
          }

          return updated;
        }
        return p;
      })
    );
  };

  const deleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    // Unlink notes from this project
    setNotes((prev) =>
      prev.map((n) => (n.project_id === projectId ? { ...n, project_id: null } : n))
    );
    if (activeProjectId === projectId) {
      setActiveProjectId(null);
    }

    const supabase = getSupabase();
    if (supabase && isCloudConnected && user) {
      supabase.from('projects').delete().eq('id', projectId).eq('user_id', user.id).then();
    }
  };

  const createSource = (source: Partial<ResearchSource>): string => {
    if (!user) return '';
    const newSource: ResearchSource = {
      id: `src_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: user.id,
      project_id: source.project_id || null,
      title: source.title || 'Untitled Reference',
      url: source.url || '',
      author: source.author || '',
      publication_date: source.publication_date || '',
      comments: source.comments || '',
      tags: source.tags || [],
      is_bookmarked: source.is_bookmarked || false,
      created_at: new Date().toISOString(),
    };

    setSources((prev) => [newSource, ...prev]);

    const supabase = getSupabase();
    if (supabase && isCloudConnected) {
      supabase.from('sources').insert([newSource]).then();
    }

    return newSource.id;
  };

  const updateSource = (sourceId: string, updates: Partial<ResearchSource>) => {
    setSources((prev) =>
      prev.map((s) => {
        if (s.id === sourceId) {
          const updated = { ...s, ...updates };
          const supabase = getSupabase();
          if (supabase && isCloudConnected && user) {
            supabase.from('sources').update(updated).eq('id', sourceId).eq('user_id', user.id).then();
          }
          return updated;
        }
        return s;
      })
    );
  };

  const deleteSource = (sourceId: string) => {
    setSources((prev) => prev.filter((s) => s.id !== sourceId));
    const supabase = getSupabase();
    if (supabase && isCloudConnected && user) {
      supabase.from('sources').delete().eq('id', sourceId).eq('user_id', user.id).then();
    }
  };

  const toggleBookmarkSource = (sourceId: string) => {
    const s = sources.find((x) => x.id === sourceId);
    if (s) {
      updateSource(sourceId, { is_bookmarked: !s.is_bookmarked });
    }
  };

  const createTask = (task: Partial<ResearchTask>): string => {
    if (!user) return '';
    const newTask: ResearchTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: user.id,
      project_id: task.project_id || null,
      title: task.title || 'New Task',
      completed: false,
      due_date: task.due_date || '',
      priority: task.priority || 'medium',
      created_at: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    const supabase = getSupabase();
    if (supabase && isCloudConnected) {
      supabase.from('tasks').insert([newTask]).then();
    }

    return newTask.id;
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, completed: !t.completed };
          const supabase = getSupabase();
          if (supabase && isCloudConnected && user) {
            supabase.from('tasks').update({ completed: updated.completed }).eq('id', taskId).eq('user_id', user.id).then();
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    const supabase = getSupabase();
    if (supabase && isCloudConnected && user) {
      supabase.from('tasks').delete().eq('id', taskId).eq('user_id', user.id).then();
    }
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  // Sticker interactions
  const addStickerToNote = (noteId: string, stickerId: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          // Calculate random pleasant initial position around center-right
          const count = n.stickers.length;
          const initialX = clampStickerPosition(70 + (count % 3) * 6, 20 + count * 12).x;
          const initialY = clampStickerPosition(20 + count * 14, 20 + count * 14).y;

          const newSticker: NoteSticker = {
            id: `st_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            sticker_id: stickerId,
            x: initialX,
            y: initialY,
            scale: 1,
            rotation: (Math.random() * 20 - 10),
            z_index: count + 1,
          };

          return {
            ...n,
            stickers: [...n.stickers, newSticker],
            updated_at: new Date().toISOString(),
          };
        }
        return n;
      })
    );
  };

  const updateStickerOnNote = (
    noteId: string,
    stickerInstanceId: string,
    updates: Partial<NoteSticker>
  ) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          return {
            ...n,
            stickers: n.stickers.map((s) => {
              if (s.id === stickerInstanceId) {
                const nextX = updates.x !== undefined ? clampStickerPosition(updates.x, s.y).x : s.x;
                const nextY = updates.y !== undefined ? clampStickerPosition(s.x, updates.y).y : s.y;
                return {
                  ...s,
                  ...updates,
                  x: nextX,
                  y: nextY,
                };
              }
              return s;
            }),
            updated_at: new Date().toISOString(),
          };
        }
        return n;
      })
    );
  };

  const removeStickerFromNote = (noteId: string, stickerInstanceId: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === noteId) {
          return {
            ...n,
            stickers: n.stickers.filter((s) => s.id !== stickerInstanceId),
            updated_at: new Date().toISOString(),
          };
        }
        return n;
      })
    );
  };

  // Export JSON backup
  const exportNotebookJSON = (): string => {
    if (!user) return '';
    const payload: NotebookExportData = {
      version: '1.0.0',
      exported_at: new Date().toISOString(),
      user_id: user.id,
      notes,
      projects,
      sources,
      tasks,
      settings,
    };
    return JSON.stringify(payload, null, 2);
  };

  // Import JSON backup
  const importNotebookJSON = (jsonString: string): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: 'User must be authenticated to import' };
    try {
      const parsed = JSON.parse(jsonString);
      if (!validateExportData(parsed)) {
        return { success: false, error: 'Invalid notebook backup JSON structure.' };
      }

      // Re-assign imported elements to current user_id for strict isolation
      const sanitizedNotes = (parsed.notes || []).map((n) => ({
        ...n,
        user_id: user.id,
      }));
      const sanitizedProjects = (parsed.projects || []).map((p) => ({
        ...p,
        user_id: user.id,
      }));
      const sanitizedSources = (parsed.sources || []).map((s) => ({
        ...s,
        user_id: user.id,
      }));
      const sanitizedTasks = (parsed.tasks || []).map((t) => ({
        ...t,
        user_id: user.id,
      }));

      setNotes(sanitizedNotes);
      setProjects(sanitizedProjects);
      setSources(sanitizedSources);
      setTasks(sanitizedTasks);
      if (parsed.settings) {
        setSettings({ ...defaultSettings, ...parsed.settings });
      }

      if (sanitizedNotes.length > 0) {
        setActiveNoteId(sanitizedNotes[0].id);
      }

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to parse JSON file' };
    }
  };

  // Allows user to load the rich BTS Universe Starter pack if they want starter guidance!
  const loadStarterGuide = () => {
    if (!user) return;
    const starter = createStarterGalaxyData(user.id);
    setProjects((prev) => [...prev, ...starter.projects]);
    setNotes((prev) => [...prev, ...starter.notes]);
    setSources((prev) => [...prev, ...starter.sources]);
    setTasks((prev) => [...prev, ...starter.tasks]);
    if (starter.notes.length > 0) {
      setActiveNoteId(starter.notes[0].id);
    }
  };

  const clearUserData = () => {
    setNotes([]);
    setProjects([]);
    setSources([]);
    setTasks([]);
  };

  return (
    <NotebookContext.Provider
      value={{
        notes,
        projects,
        sources,
        tasks,
        settings,
        syncState,
        syncErrorMessage,
        activeNoteId,
        activeProjectId,
        setActiveNoteId,
        setActiveProjectId,
        createNote,
        updateNote,
        deleteNote,
        duplicateNote,
        togglePinNote,
        toggleFavoriteNote,
        createProject,
        updateProject,
        deleteProject,
        createSource,
        updateSource,
        deleteSource,
        toggleBookmarkSource,
        createTask,
        toggleTask,
        deleteTask,
        updateSettings,
        addStickerToNote,
        updateStickerOnNote,
        removeStickerFromNote,
        exportNotebookJSON,
        importNotebookJSON,
        loadStarterGuide,
        clearUserData,
      }}
    >
      {children}
    </NotebookContext.Provider>
  );
};

export const useNotebook = () => {
  const context = useContext(NotebookContext);
  if (!context) {
    throw new Error('useNotebook must be used within a NotebookProvider');
  }
  return context;
};
