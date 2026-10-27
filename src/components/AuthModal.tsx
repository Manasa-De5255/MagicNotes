import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AVATAR_OPTIONS } from '../data/stickers';
import { Sparkles, KeyRound, Mail, User, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canDismiss?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, canDismiss = false }) => {
  const { signIn, signUp, resetPassword, isCloudConnected } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('koya');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (tab === 'signin') {
        const res = await signIn(email, password);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to sign in. Please check your credentials.');
        } else if (onClose && canDismiss) {
          onClose();
        }
      } else if (tab === 'signup') {
        const res = await signUp(email, password, fullName, selectedAvatar);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to create account.');
        } else {
          setSuccessMessage('Account created successfully! Welcome to your galaxy.');
          if (onClose && canDismiss) {
            setTimeout(onClose, 800);
          }
        }
      } else if (tab === 'forgot') {
        const res = await resetPassword(email);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to request password reset.');
        } else {
          setSuccessMessage(res.message || 'Password reset instructions sent!');
        }
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    setErrorMessage(null);
    const demoEmail = 'traveler@bts-universe.space';
    const demoPassword = 'MagicNotes2026!';
    const demoName = 'Cosmic Traveler';

    // Try signing in first
    const res = await signIn(demoEmail, demoPassword);
    if (!res.success) {
      // If doesn't exist, sign up
      await signUp(demoEmail, demoPassword, demoName, 'koya');
    }
    setLoading(false);
    if (onClose && canDismiss) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#130f2b] border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80 text-purple-100 overflow-hidden">
        {/* Decorative galaxy glow in modal header */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-600/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-pink-600/20 rounded-full blur-2xl" />

        {/* Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white mb-3 shadow-lg shadow-purple-600/40">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent">
            Magic Notes
          </h2>
          <p className="text-xs text-purple-300/80 mt-1">
            BTS Universe Research Notebook • “My thoughts, my universe.”
          </p>

          {/* Connection Mode Indicator */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border font-medium">
            {isCloudConnected ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 border-emerald-500/30 bg-emerald-950/40">
                <ShieldCheck className="w-3.5 h-3.5" /> Supabase Cloud Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-purple-300 border-purple-500/30 bg-purple-950/40">
                <Heart className="w-3.5 h-3.5 text-pink-400" /> Private Isolated Account Mode
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-purple-900/60 mb-6">
          <button
            type="button"
            onClick={() => {
              setTab('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-all ${
              tab === 'signin'
                ? 'border-purple-400 text-purple-200'
                : 'border-transparent text-purple-400 hover:text-purple-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-all ${
              tab === 'signup'
                ? 'border-purple-400 text-purple-200'
                : 'border-transparent text-purple-400 hover:text-purple-300'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('forgot');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-all ${
              tab === 'forgot'
                ? 'border-purple-400 text-purple-200'
                : 'border-transparent text-purple-400 hover:text-purple-300'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs">
            {successMessage}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-purple-300 mb-1">
                Your Explorer Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Luna Kim"
                  className="w-full bg-[#1b153b] border border-purple-700/50 rounded-lg pl-9 pr-3 py-2 text-sm text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                />
              </div>

              {/* Avatar Selector */}
              <div className="mt-3">
                <label className="block text-xs font-semibold text-purple-300 mb-1.5">
                  Choose Your Cosmic Companion Avatar
                </label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      title={av.name}
                      className={`p-2 rounded-xl text-lg flex items-center justify-center transition-transform ${
                        selectedAvatar === av.id
                          ? 'bg-purple-600 scale-110 ring-2 ring-purple-300 shadow-md'
                          : 'bg-[#221c4b] hover:bg-[#2c2463]'
                      }`}
                    >
                      <span>{av.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-purple-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#1b153b] border border-purple-700/50 rounded-lg pl-9 pr-3 py-2 text-sm text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              />
            </div>
          </div>

          {tab !== 'forgot' && (
            <div>
              <label className="block text-xs font-semibold text-purple-300 mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-[#1b153b] border border-purple-700/50 rounded-lg pl-9 pr-3 py-2 text-sm text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-purple-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block animate-spin">🌀</span>
            ) : (
              <>
                <span>
                  {tab === 'signin' && 'Open My Universe'}
                  {tab === 'signup' && 'Create Galaxy Account'}
                  {tab === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Explorer Button */}
        <div className="mt-5 pt-4 border-t border-purple-900/50 text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="text-xs text-pink-300 hover:text-pink-200 underline font-medium inline-flex items-center gap-1.5"
          >
            <span>✨ Test drive instantly as Demo Explorer (No typing needed)</span>
          </button>
        </div>

        {canDismiss && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-purple-400 hover:text-purple-200 text-sm"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
