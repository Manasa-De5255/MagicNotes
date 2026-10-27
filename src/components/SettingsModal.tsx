import React from 'react';
import { useNotebook } from '../context/NotebookContext';
import { PaperStyle } from '../types/notebook';
import {
  Palette,
  Sun,
  Moon,
  Type,
  Sparkles,
  Layers,
  X,
  Check
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FONTS = [
  { id: 'Plus Jakarta Sans', label: 'Jakarta Sans (Clean Modern)' },
  { id: 'Fredoka', label: 'Fredoka (Cute & Rounded)' },
  { id: 'Caveat', label: 'Caveat (Dreamy Handwriting)' },
  { id: 'JetBrains Mono', label: 'JetBrains Mono (Technical Research)' },
];

const ACCENT_COLORS = [
  { id: 'purple', label: 'Borahae Purple', color: '#9333ea' },
  { id: 'pink', label: 'Sakura Pink', color: '#ec4899' },
  { id: 'indigo', label: 'Midnight Blue', color: '#6366f1' },
  { id: 'mint', label: 'Cosmic Mint', color: '#10b981' },
  { id: 'gold', label: 'Starlight Gold', color: '#eab308' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useNotebook();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#140e2f] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] text-purple-100 overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-900/60 text-pink-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Notebook Personalization</h3>
              <p className="text-xs text-purple-300">
                Customize your galaxy theme, paper styles, and typography
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-purple-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme mode */}
        <div>
          <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider mb-2">
            Theme Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'dark' })}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                settings.theme === 'dark'
                  ? 'bg-purple-600 border-purple-300 text-white shadow-lg'
                  : 'bg-[#1b143c] border-purple-800/40 text-purple-300 hover:bg-[#231b4e]'
              }`}
            >
              <Moon className="w-4 h-4 text-purple-300" />
              <span>Dark Galaxy Mode</span>
            </button>

            <button
              type="button"
              onClick={() => updateSettings({ theme: 'light' })}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                settings.theme === 'light'
                  ? 'bg-purple-600 border-purple-300 text-white shadow-lg'
                  : 'bg-[#1b143c] border-purple-800/40 text-purple-300 hover:bg-[#231b4e]'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-300" />
              <span>Cosmic Light Mode</span>
            </button>
          </div>
        </div>

        {/* Accent Colors */}
        <div>
          <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider mb-2">
            Accent Palette
          </label>
          <div className="flex flex-wrap gap-2.5">
            {ACCENT_COLORS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => updateSettings({ accent_color: acc.id })}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-medium transition-all ${
                  settings.accent_color === acc.id
                    ? 'border-purple-300 bg-purple-900/60 text-white ring-2 ring-purple-400'
                    : 'border-purple-800/40 bg-[#1b143c] text-purple-300 hover:bg-[#231b4e]'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: acc.color }}
                />
                <span>{acc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div>
          <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider mb-2">
            Notebook Reading Font
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {FONTS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  updateSettings({ font_family: f.id });
                  document.documentElement.style.setProperty('--font-sans', `'${f.id}', sans-serif`);
                }}
                className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                  settings.font_family === f.id
                    ? 'border-pink-400 bg-purple-900/60 text-white font-bold'
                    : 'border-purple-800/40 bg-[#1b143c] text-purple-300 hover:bg-[#231b4e]'
                }`}
                style={{ fontFamily: f.id }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Default Paper Style */}
        <div>
          <label className="block text-xs font-bold text-purple-200 uppercase tracking-wider mb-2">
            Default Paper Style for New Notes
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['plain', 'lined', 'dotted', 'grid'] as PaperStyle[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => updateSettings({ default_paper: p })}
                className={`p-2.5 rounded-xl border text-center text-xs font-semibold capitalize transition-all ${
                  settings.default_paper === p
                    ? 'bg-purple-600 border-purple-300 text-white shadow'
                    : 'bg-[#1b143c] border-purple-800/40 text-purple-300 hover:bg-[#231b4e]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Motion & Animations Toggle */}
        <div className="p-4 rounded-2xl bg-[#1b143c] border border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <div>
              <div className="text-xs font-bold text-purple-100">Twinkling Cosmic Animations</div>
              <div className="text-[11px] text-purple-400">
                Smooth ambient stars, orbiting particles, and galaxy pulse effects
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateSettings({ animations_enabled: !settings.animations_enabled })}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              settings.animations_enabled ? 'bg-purple-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                settings.animations_enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
