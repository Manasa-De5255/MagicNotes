import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWordCount,
  parseTableOfContents,
  filterNotes,
  filterSources,
  clampStickerPosition,
  validateExportData,
} from './notebookUtils';
import { Note, ResearchSource } from '../types/notebook';

test('calculateWordCount handles empty, plain text, and HTML strings', () => {
  assert.equal(calculateWordCount(''), 0);
  assert.equal(calculateWordCount('Hello Borahae universe!'), 3);
  assert.equal(
    calculateWordCount('<h2>Title</h2><p>Here are   multiple    spaces.</p>'),
    5
  );
});

test('parseTableOfContents extracts levels and creates clean slug identifiers', () => {
  const htmlContent = `
    <h1>Introduction to Magic Shop</h1>
    <p>Some thoughts</p>
    <h2>Origins & Symbolism</h2>
    <h3>The Tea Ceremony</h3>
  `;
  const toc = parseTableOfContents(htmlContent);
  assert.equal(toc.length, 3);
  assert.equal(toc[0].level, 1);
  assert.equal(toc[0].text, 'Introduction to Magic Shop');
  assert.equal(toc[1].level, 2);
  assert.equal(toc[1].text, 'Origins & Symbolism');
  assert.equal(toc[2].level, 3);
  assert.equal(toc[2].text, 'The Tea Ceremony');
});

test('filterNotes filters properly by search keyword and tags', () => {
  const dummyNotes: Note[] = [
    {
      id: '1',
      user_id: 'u1',
      project_id: 'p1',
      title: 'Spring Day Analysis',
      content: 'Snowflakes falling down',
      paper_style: 'lined',
      page_color: '#fff',
      stickers: [],
      is_pinned: false,
      is_favorite: true,
      tags: ['Lyrics', 'Spring'],
      word_count: 3,
      created_at: '',
      updated_at: '',
    },
    {
      id: '2',
      user_id: 'u1',
      project_id: 'p2',
      title: 'Mikrokosmos Stars',
      content: 'Shining in the dark night',
      paper_style: 'dotted',
      page_color: '#fff',
      stickers: [],
      is_pinned: true,
      is_favorite: false,
      tags: ['Cosmic', 'Song'],
      word_count: 5,
      created_at: '',
      updated_at: '',
    },
  ];

  const searchSpring = filterNotes(dummyNotes, 'spring');
  assert.equal(searchSpring.length, 1);
  assert.equal(searchSpring[0].id, '1');

  const filterTag = filterNotes(dummyNotes, '', 'Cosmic');
  assert.equal(filterTag.length, 1);
  assert.equal(filterTag[0].id, '2');

  const searchContent = filterNotes(dummyNotes, 'dark night');
  assert.equal(searchContent.length, 1);
  assert.equal(searchContent[0].id, '2');
});

test('filterSources correctly filters by keyword and bookmark status', () => {
  const dummySources: ResearchSource[] = [
    {
      id: 's1',
      user_id: 'u1',
      project_id: 'p1',
      title: 'Carl Jung Psychology Paper',
      url: 'https://example.com/jung',
      author: 'Murray Stein',
      publication_date: '1998',
      comments: 'Essential guide',
      tags: ['Psychology'],
      is_bookmarked: true,
      created_at: '',
    },
    {
      id: 's2',
      user_id: 'u1',
      project_id: 'p1',
      title: 'Hermann Hesse Demian Notes',
      url: 'https://example.com/demian',
      author: 'Hermann Hesse',
      publication_date: '1919',
      comments: 'Bird flying to God',
      tags: ['Literature'],
      is_bookmarked: false,
      created_at: '',
    },
  ];

  const bookmarked = filterSources(dummySources, '', true);
  assert.equal(bookmarked.length, 1);
  assert.equal(bookmarked[0].id, 's1');

  const searchAuthor = filterSources(dummySources, 'hesse');
  assert.equal(searchAuthor.length, 1);
  assert.equal(searchAuthor[0].id, 's2');
});

test('clampStickerPosition stays within limits', () => {
  const inside = clampStickerPosition(50, 50, 0, 100, 0, 100);
  assert.equal(inside.x, 50);
  assert.equal(inside.y, 50);

  const overflow = clampStickerPosition(150, -20, 5, 95, 5, 95);
  assert.equal(overflow.x, 95);
  assert.equal(overflow.y, 5);
});

test('validateExportData verifies JSON structure', () => {
  assert.equal(validateExportData(null), false);
  assert.equal(validateExportData({}), false);
  assert.equal(
    validateExportData({
      notes: [],
      projects: [],
      sources: [],
      tasks: [],
    }),
    true
  );
});
