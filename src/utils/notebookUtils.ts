import { Note, Project, ResearchSource, ResearchTask, NotebookExportData } from '../types/notebook';

/**
 * Calculates accurate word count stripping HTML tags and excess whitespace
 */
export function calculateWordCount(textOrHtml: string): number {
  if (!textOrHtml) return 0;
  const cleanText = textOrHtml.replace(/<[^>]*>/g, ' ');
  const words = cleanText.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

/**
 * Parses headings from HTML / plain markdown content for dynamic Table of Contents
 */
export function parseTableOfContents(content: string): { level: number; text: string; id: string }[] {
  if (!content) return [];
  const toc: { level: number; text: string; id: string }[] = [];
  
  const htmlRegex = /<h([1-3])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  let index = 0;
  while ((match = htmlRegex.exec(content)) !== null) {
    const level = parseInt(match[1], 10);
    const rawText = match[2].replace(/<[^>]*>/g, '').trim();
    if (rawText) {
      const slug = `heading-${index++}-${rawText.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      toc.push({ level, text: rawText, id: slug });
    }
  }

  if (toc.length === 0) {
    const mdLines = content.split('\n');
    for (const line of mdLines) {
      const trimmed = line.trim();
      const mdMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
      if (mdMatch) {
        const level = mdMatch[1].length;
        const text = mdMatch[2].trim();
        const slug = `md-heading-${index++}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        toc.push({ level, text, id: slug });
      }
    }
  }

  return toc;
}

/**
 * Filters notes by search keyword, tag, or project
 */
export function filterNotes(
  notes: Note[],
  query: string,
  tagFilter?: string,
  projectIdFilter?: string | null
): Note[] {
  const cleanQuery = query.toLowerCase().trim();

  return notes.filter((note) => {
    if (projectIdFilter !== undefined) {
      if (note.project_id !== projectIdFilter) return false;
    }

    if (tagFilter && !note.tags.some((t) => t.toLowerCase() === tagFilter.toLowerCase())) {
      return false;
    }

    if (!cleanQuery) return true;

    const inTitle = note.title.toLowerCase().includes(cleanQuery);
    const inContent = note.content.toLowerCase().includes(cleanQuery);
    const inTags = note.tags.some((t) => t.toLowerCase().includes(cleanQuery));

    return inTitle || inContent || inTags;
  });
}

/**
 * Filters sources by query, tag, or bookmarked state
 */
export function filterSources(
  sources: ResearchSource[],
  query: string,
  bookmarkedOnly?: boolean,
  tagFilter?: string
): ResearchSource[] {
  const cleanQuery = query.toLowerCase().trim();

  return sources.filter((src) => {
    if (bookmarkedOnly && !src.is_bookmarked) return false;
    if (tagFilter && !src.tags.some((t) => t.toLowerCase() === tagFilter.toLowerCase())) {
      return false;
    }

    if (!cleanQuery) return true;

    return (
      src.title.toLowerCase().includes(cleanQuery) ||
      src.url.toLowerCase().includes(cleanQuery) ||
      src.author.toLowerCase().includes(cleanQuery) ||
      src.comments.toLowerCase().includes(cleanQuery) ||
      src.tags.some((t) => t.toLowerCase().includes(cleanQuery))
    );
  });
}

/**
 * Clamps sticker bounds on a notebook page canvas
 */
export function clampStickerPosition(
  x: number,
  y: number,
  minX = 2,
  maxX = 92,
  minY = 2,
  maxY = 92
): { x: number; y: number } {
  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
}

/**
 * Validates notebook JSON backup data structure
 */
export function validateExportData(data: unknown): data is NotebookExportData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Partial<NotebookExportData>;
  return (
    Array.isArray(d.notes) &&
    Array.isArray(d.projects) &&
    Array.isArray(d.sources) &&
    Array.isArray(d.tasks)
  );
}

/**
 * Creates rich starter seed data for a newly registered user if they want starter templates
 */
export function createStarterGalaxyData(userId: string) {
  const now = new Date().toISOString();

  const starterProject: Project = {
    id: `proj_${Date.now()}_1`,
    user_id: userId,
    title: 'BTS Universe & Bangtan Lore Deep Dive',
    description: 'Deconstructing the time travel loops, symbolisms, Whalien 52 metaphors, and youth philosophy across the BTS discography.',
    cover_gradient: 'from-purple-950 via-indigo-900 to-slate-900',
    status: 'in_progress',
    tags: ['BTS Universe', 'Philosophy', 'Mikrokosmos', 'Analysis'],
    category: 'BTS Universe Lore',
    research_questions: [
      'How does the concept of time loops in the BU symbolize overcoming trauma and collective growth?',
      'What literary influences (Demian, Omelas, Into the Magic Shop) shape the core narrative arcs?',
      'How do the 7 individual story motifs reflect real youth anxieties and solidarity?'
    ],
    key_findings: 'The journey shifts from escapism into radical self-acceptance. In Map of the Soul, confronting one’s shadow is essential for true healing.',
    summary: 'A comprehensive study proving how music, literature, and visual universe worldbuilding intertwine into a modern youth mythology.',
    created_at: now,
    updated_at: now,
  };

  const starterNotes: Note[] = [
    {
      id: `note_${Date.now()}_1`,
      user_id: userId,
      project_id: starterProject.id,
      title: 'Welcome to Magic Notes 💜 My Thoughts, My Universe',
      content: `<h2>Welcome to your Cosmic Research Sanctuary ✨</h2>
<p>Here you can explore theories, draft research, organize references, and decorate your pages with cosmic stickers.</p>
<h3>Quick Guide for Researchers:</h3>
<ul>
  <li><strong>Drag & Drop Stickers:</strong> Click on the sticker bar to place moons, Borahae hearts, microphones, and cute companions onto your paper. Move, rotate, or resize them freely!</li>
  <li><strong>Paper Styles:</strong> Switch between Lined, Dotted, Grid, and Plain paper in the toolbar.</li>
  <li><strong>Sources Manager:</strong> Save articles, video essays, and academic papers with clickable links.</li>
  <li><strong>Strict Isolation:</strong> Your research is strictly tied to your account with Row Level Security.</li>
</ul>
<blockquote><em>"You gave me the best of me, so you'll give you the best of you." — Magic Shop</em></blockquote>`,
      paper_style: 'lined',
      page_color: '#f8f4ff',
      stickers: [
        {
          id: 'st_1',
          sticker_id: 'bts_borahae_heart',
          x: 76,
          y: 6,
          scale: 1.1,
          rotation: 8,
          z_index: 2,
        },
        {
          id: 'st_2',
          sticker_id: 'char_sleepy_koala',
          x: 78,
          y: 72,
          scale: 1.0,
          rotation: -5,
          z_index: 3,
        },
        {
          id: 'st_3',
          sticker_id: 'space_seven_stars',
          x: 5,
          y: 8,
          scale: 0.9,
          rotation: 0,
          z_index: 1,
        }
      ],
      is_pinned: true,
      is_favorite: true,
      tags: ['Guide', 'Universe', 'Borahae'],
      word_count: 125,
      created_at: now,
      updated_at: now,
    },
    {
      id: `note_${Date.now()}_2`,
      user_id: userId,
      project_id: starterProject.id,
      title: 'Whalien 52 & The Solitary Frequency of Youth',
      content: `<h2>The 52-Hertz Whale: A Metaphor for Unheard Voices</h2>
<p>The 52-hertz whale sings at a frequency incomprehensible to other whales. In BTS's track, this is used as an allegory for youth alienation in a noisy world.</p>
<h3>Key Lyric Breakdown:</h3>
<p><em>"Lonely lonely lonely whale, singing alone like this... An endless message will one day reach someone, to the other side of the earth."</em></p>
<h3>Research Observations:</h3>
<ol>
  <li>The song acknowledges loneliness without succumbing to despair.</li>
  <li>It serves as an acoustic beacon: by voicing loneliness, it invites listeners experiencing the same frequency to feel connected.</li>
</ol>`,
      paper_style: 'dotted',
      page_color: '#faf5ff',
      stickers: [
        {
          id: 'st_4',
          sticker_id: 'space_whalien_cosmic',
          x: 76,
          y: 12,
          scale: 1.15,
          rotation: -10,
          z_index: 2,
        },
        {
          id: 'st_5',
          sticker_id: 'space_saturn_ring',
          x: 82,
          y: 68,
          scale: 0.95,
          rotation: 15,
          z_index: 1,
        }
      ],
      is_pinned: false,
      is_favorite: true,
      tags: ['Whalien 52', 'Lyrics', 'Metaphor'],
      word_count: 98,
      created_at: now,
      updated_at: now,
    }
  ];

  const starterSources: ResearchSource[] = [
    {
      id: `src_${Date.now()}_1`,
      user_id: userId,
      project_id: starterProject.id,
      title: 'Jung\'s Map of the Soul: An Introduction (Murray Stein)',
      url: 'https://en.wikipedia.org/wiki/Carl_Jung',
      author: 'Dr. Murray Stein',
      publication_date: '1998',
      comments: 'Essential background reading for understanding Persona, Shadow, and Ego concepts in BTS Map of the Soul 7.',
      tags: ['Psychology', 'Jungian', 'Reference'],
      is_bookmarked: true,
      created_at: now,
    },
    {
      id: `src_${Date.now()}_2`,
      user_id: userId,
      project_id: starterProject.id,
      title: 'The Ones Who Walk Away from Omelas (Ursula K. Le Guin)',
      url: 'https://en.wikipedia.org/wiki/The_Ones_Who_Walk_Away_from_Omelas',
      author: 'Ursula K. Le Guin',
      publication_date: '1973',
      comments: 'Referenced extensively in the "Spring Day" music video motel imagery and moral sacrifice discourse.',
      tags: ['Literature', 'Spring Day', 'Allegory'],
      is_bookmarked: true,
      created_at: now,
    }
  ];

  const starterTasks: ResearchTask[] = [
    {
      id: `task_${Date.now()}_1`,
      user_id: userId,
      project_id: starterProject.id,
      title: 'Outline timeline of HYYH notes across albums',
      completed: true,
      due_date: '2026-11-05',
      priority: 'high',
      created_at: now,
    },
    {
      id: `task_${Date.now()}_2`,
      user_id: userId,
      project_id: starterProject.id,
      title: 'Analyze Demian quotes recited by RM in WINGS short films',
      completed: false,
      due_date: '2026-11-12',
      priority: 'medium',
      created_at: now,
    },
    {
      id: `task_${Date.now()}_3`,
      user_id: userId,
      project_id: starterProject.id,
      title: 'Summarize key findings into research abstract',
      completed: false,
      due_date: '2026-11-20',
      priority: 'low',
      created_at: now,
    }
  ];

  return {
    projects: [starterProject],
    notes: starterNotes,
    sources: starterSources,
    tasks: starterTasks,
  };
}
