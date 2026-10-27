export type PaperStyle = 'plain' | 'lined' | 'dotted' | 'grid';
export type ProjectStatus = 'planning' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type AppTheme = 'dark' | 'light';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_id: string;
  bio?: string;
  created_at: string;
}

export interface NoteSticker {
  id: string;
  sticker_id: string;
  x: number; // percentage or pixels
  y: number;
  scale: number;
  rotation: number; // in degrees
  z_index: number;
}

export interface Note {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  content: string; // rich html or markdown
  paper_style: PaperStyle;
  page_color: string;
  stickers: NoteSticker[];
  is_pinned: boolean;
  is_favorite: boolean;
  tags: string[];
  word_count: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  cover_gradient: string;
  status: ProjectStatus;
  tags: string[];
  category: string;
  research_questions: string[];
  key_findings: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

export interface ResearchSource {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  url: string;
  author: string;
  publication_date: string;
  comments: string;
  tags: string[];
  is_bookmarked: boolean;
  created_at: string;
}

export interface ResearchTask {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  completed: boolean;
  due_date: string;
  priority: TaskPriority;
  created_at: string;
}

export interface UserSettings {
  theme: AppTheme;
  galaxy_wallpaper: string;
  accent_color: string;
  font_family: string;
  font_size: 'normal' | 'compact' | 'spacious';
  animations_enabled: boolean;
  default_paper: PaperStyle;
  favorite_stickers: string[];
}

export type StickerCategory = 'space' | 'bts' | 'characters' | 'study' | 'motivational';

export interface StickerItem {
  id: string;
  name: string;
  category: StickerCategory;
  emojiFallback: string;
  svgIcon: string;
  tags: string[];
  accentColor?: string;
}

export interface NotebookExportData {
  version: string;
  exported_at: string;
  user_id: string;
  notes: Note[];
  projects: Project[];
  sources: ResearchSource[];
  tasks: ResearchTask[];
  settings: UserSettings;
}
