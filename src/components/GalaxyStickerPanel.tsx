import React, { useState } from 'react';
import { STICKER_COLLECTION } from '../data/stickers';
import { StickerCategory } from '../types/notebook';
import { useNotebook } from '../context/NotebookContext';
import { Sparkles, Star, Search, Plus, X } from 'lucide-react';

interface GalaxyStickerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSticker: (stickerId: string) => void;
}

export const GalaxyStickerPanel: React.FC<GalaxyStickerPanelProps> = ({
  isOpen,
  onClose,
  onSelectSticker,
}) => {
  const { settings, updateSettings, activeNoteId } = useNotebook();
  const [selectedCategory, setSelectedCategory] = useState<StickerCategory | 'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories: { id: StickerCategory | 'all' | 'favorites'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Stickers', icon: '✨' },
    { id: 'favorites', label: 'My Favorites', icon: '⭐' },
    { id: 'space', label: 'Space', icon: '🪐' },
    { id: 'bts', label: 'Borahae & BTS', icon: '💜' },
    { id: 'characters', label: 'Cosmic Buddies', icon: '🐰' },
    { id: 'study', label: 'Research', icon: '📖' },
    { id: 'motivational', label: 'Quotes', icon: '💬' },
  ];

  const favoriteIds = settings.favorite_stickers || [];

  const toggleFavorite = (stickerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFav = favoriteIds.includes(stickerId);
    const updated = isFav
      ? favoriteIds.filter((id) => id !== stickerId)
      : [...favoriteIds, stickerId];
    updateSettings({ favorite_stickers: updated });
  };

  const filteredStickers = STICKER_COLLECTION.filter((st) => {
    if (selectedCategory === 'favorites') {
      if (!favoriteIds.includes(st.id)) return false;
    } else if (selectedCategory !== 'all') {
      if (st.category !== selectedCategory) return false;
    }

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      st.name.toLowerCase().includes(query) ||
      st.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-[#120d29]/95 backdrop-blur-xl border-l border-purple-500/30 shadow-2xl flex flex-col text-purple-100 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-purple-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-600/30 text-purple-300">
            <Sparkles className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="font-bold text-base bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Galaxy Sticker Vault
            </h3>
            <p className="text-xs text-purple-400/80">
              {activeNoteId ? 'Click to add directly onto your open note' : 'Open a note to place stickers'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-900/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-purple-900/40">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stickers by name, character or tag..."
            className="w-full bg-[#1c153d] border border-purple-700/50 rounded-xl pl-9 pr-3 py-2 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-3 py-2 border-b border-purple-900/40 flex gap-1.5 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1 transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'bg-[#1e1742] text-purple-300 hover:bg-[#281f59]'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Stickers Grid */}
      <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 gap-3.5">
        {filteredStickers.map((sticker) => {
          const isFav = favoriteIds.includes(sticker.id);

          return (
            <div
              key={sticker.id}
              onClick={() => onSelectSticker(sticker.id)}
              className="group relative p-3 rounded-2xl bg-[#1a133d]/70 hover:bg-[#241b54] border border-purple-800/40 hover:border-purple-500/60 cursor-pointer flex flex-col items-center justify-center transition-all hover:scale-[1.03] shadow-lg"
            >
              {/* Favorite Star Button */}
              <button
                type="button"
                onClick={(e) => toggleFavorite(sticker.id, e)}
                className="absolute top-2 right-2 p-1 text-purple-400 hover:text-amber-400 transition-colors z-10"
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star
                  className={`w-4 h-4 ${
                    isFav ? 'text-amber-400 fill-amber-400' : 'text-purple-400/60'
                  }`}
                />
              </button>

              {/* Artwork Render */}
              <div
                className="w-16 h-16 drop-shadow group-hover:drop-shadow-lg transition-transform group-hover:scale-110"
                dangerouslySetInnerHTML={{ __html: sticker.svgIcon }}
              />

              <span className="text-xs font-semibold text-purple-200 mt-2 text-center line-clamp-1">
                {sticker.name}
              </span>
              <span className="text-[10px] text-purple-400/80 capitalize">
                {sticker.category}
              </span>

              {/* Hover Badge */}
              <div className="absolute inset-x-2 bottom-2 py-1 bg-purple-600/90 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 shadow">
                <Plus className="w-3 h-3" /> Add to Page
              </div>
            </div>
          );
        })}

        {filteredStickers.length === 0 && (
          <div className="col-span-2 py-12 text-center text-purple-400 text-xs">
            No stickers found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};
