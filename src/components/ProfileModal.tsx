import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotebook } from '../context/NotebookContext';
import { AVATAR_OPTIONS } from '../data/stickers';
import {
  User,
  Shield,
  KeyRound,
  Download,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Mail,
  Sparkles
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, deleteAccount, signOut } = useAuth();
  const { exportNotebookJSON, notes, projects } = useNotebook();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar_id || 'koya');
  const [bio, setBio] = useState(user?.bio || '');
  const [newPassword, setNewPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !user) return null;

  const currentAvatarMeta = AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaveSuccess(false);
    setIsSaving(true);

    const res = await updateProfile(
      {
        full_name: fullName.trim(),
        avatar_id: selectedAvatar,
        bio: bio.trim(),
      },
      newPassword.trim() ? newPassword.trim() : undefined
    );

    setIsSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      setNewPassword('');
      setTimeout(() => setSaveSuccess(false), 2500);
    } else {
      setErrorMessage(res.error || 'Failed to update profile.');
    }
  };

  const handleExportData = () => {
    const jsonStr = exportNotebookJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `galaxy_notebook_archive_${user.email.replace(/[^a-z0-9]/gi, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#140e2f] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] text-purple-100 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-800/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-2xl shadow-lg shadow-purple-900/60">
              {currentAvatarMeta.emoji}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user.full_name}</h3>
              <p className="text-xs text-purple-300 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {user.email}
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

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4 mt-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs">
              {errorMessage}
            </div>
          )}
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Profile details saved successfully!
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-purple-300 mb-1">
              Explorer Display Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#1b143c] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-300 mb-1.5">
              Choose Cosmic Companion Avatar
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.id)}
                  title={av.name}
                  className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-xl transition-all ${
                    selectedAvatar === av.id
                      ? 'bg-purple-600 ring-2 ring-purple-300 shadow-lg scale-110'
                      : 'bg-[#1e1644] hover:bg-[#281e5b]'
                  }`}
                >
                  <span>{av.emoji}</span>
                  <span className="text-[9px] text-purple-200 truncate mt-1">
                    {av.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-300 mb-1">
              Universe Bio / Research Motto
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Studying the Whalien 52 metaphor & youth resilience."
              className="w-full bg-[#1b143c] border border-purple-700/50 rounded-xl p-2.5 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-300 mb-1">
              New Password (leave empty to keep current)
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter 6+ characters to change password"
                minLength={6}
                className="w-full bg-[#1b143c] border border-purple-700/50 rounded-xl pl-9 pr-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>

        {/* Data Ownership & Security section */}
        <div className="mt-8 pt-6 border-t border-purple-900/60 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-purple-300">
            Data Privacy & Account Controls
          </h4>

          <div className="p-3 rounded-2xl bg-[#1b143c] border border-purple-800/40 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-purple-100">Export Your Personal Data</div>
              <div className="text-[11px] text-purple-400">
                {notes.length} notes and {projects.length} research projects in JSON archive
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              className="px-3 py-1.5 rounded-xl bg-[#251a54] hover:bg-[#30226c] border border-purple-500/30 text-purple-200 font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Data
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-800/40 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-rose-300">Delete Account & Data</div>
              <div className="text-[11px] text-rose-400/80">
                Permanently wipes all your notes, projects, and personal data
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 shadow"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Account
            </button>
          </div>
        </div>

        {/* Delete Account Modal Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#1b1236] border border-rose-500/50 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-rose-900/40 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Are you completely sure?</h4>
              <p className="text-xs text-purple-300/80 mb-5 leading-relaxed">
                This action is irreversible. All {notes.length} research notes, stickers, and collections belonging to <strong>{user.email}</strong> will be permanently deleted from the universe.
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
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950"
                >
                  Yes, Delete My Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
