import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStoredSupabaseConfig } from '../services/supabase';
import { SUPABASE_SETUP_SQL } from '../services/supabaseSchema';
import {
  ShieldCheck,
  Key,
  Copy,
  Check,
  Database,
  ExternalLink,
  Lock,
  Cloud,
  X
} from 'lucide-react';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const { isCloudConnected, connectCustomSupabase, disconnectCustomSupabase } = useAuth();
  const currentConfig = getStoredSupabaseConfig();

  const [urlInput, setUrlInput] = useState(currentConfig.url);
  const [anonKeyInput, setAnonKeyInput] = useState(currentConfig.anonKey);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnectionMessage(null);
    setIsConnecting(true);

    const res = await connectCustomSupabase(urlInput, anonKeyInput);
    setIsConnecting(false);

    if (res.success) {
      setConnectionMessage({
        type: 'success',
        text: 'Successfully connected to Supabase! Your research is now live & synced.',
      });
    } else {
      setConnectionMessage({
        type: 'error',
        text: res.error || 'Failed to connect. Please verify your Project URL and Anon Key.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#140e2f] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] text-purple-100 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-900/60 text-pink-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Supabase Cloud Database & Auth</h3>
              <p className="text-xs text-purple-300">
                Setup real-time cross-device sync & strict Row Level Security (RLS)
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

        {/* Current Status Banner */}
        <div className="mt-4 p-4 rounded-2xl border flex items-center justify-between gap-3 bg-[#1a123f]">
          <div className="flex items-center gap-3">
            {isCloudConnected ? (
              <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                <ShieldCheck className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-500/40">
                <Cloud className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="text-sm font-bold text-white">
                {isCloudConnected ? 'Cloud Sync Active' : 'Private Local Sandbox Mode'}
              </div>
              <div className="text-xs text-purple-300/80">
                {isCloudConnected
                  ? 'Connected to your Supabase instance with Row Level Security.'
                  : 'Testing without cloud keys: Multiple accounts, password checks, and isolated partitions are fully simulated in local storage.'}
              </div>
            </div>
          </div>

          {isCloudConnected && (
            <button
              type="button"
              onClick={disconnectCustomSupabase}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Step-by-Step Instructions */}
        <div className="mt-6 space-y-6 text-xs">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-[#1b143c] border border-purple-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-purple-200">
                Step 1: Create Supabase Project
              </span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 underline inline-flex items-center gap-1 font-semibold"
              >
                Open Supabase Dashboard <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-purple-300/80 leading-relaxed">
              Create a new project on Supabase. Enable Email Authentication in <em>Authentication → Providers</em>.
            </p>
          </div>

          {/* Step 2: SQL Script */}
          <div className="p-4 rounded-2xl bg-[#1b143c] border border-purple-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-purple-200">
                Step 2: Run SQL Migration & RLS Security Rules
              </span>
              <button
                type="button"
                onClick={handleCopySql}
                className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1.5 shadow"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy SQL Script
                  </>
                )}
              </button>
            </div>
            <p className="text-purple-300/80 leading-relaxed">
              Go to your Supabase SQL Editor and run the script. It creates 6 tables (<code>profiles</code>, <code>projects</code>, <code>notes</code>, <code>sources</code>, <code>tasks</code>, <code>user_settings</code>) and configures Row Level Security (RLS) so that <strong>no user can ever see another user's notes</strong>.
            </p>
            <div className="max-h-36 overflow-y-auto p-3 rounded-xl bg-[#0f0b24] font-mono text-[11px] text-purple-300 border border-purple-900/60">
              <pre>{SUPABASE_SETUP_SQL.slice(0, 480)}...</pre>
            </div>
          </div>

          {/* Step 3: Enter Credentials */}
          <div className="p-4 rounded-2xl bg-[#1b143c] border border-purple-800/40 space-y-3">
            <span className="font-bold text-sm text-purple-200 block">
              Step 3: Connect Credentials
            </span>
            <p className="text-purple-300/80">
              Find your API credentials in your Supabase project under <em>Settings → API</em>:
            </p>

            <form onSubmit={handleConnect} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                  Project URL (e.g. https://xyz.supabase.co)
                </label>
                <input
                  type="url"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full bg-[#120d2a] border border-purple-700/50 rounded-xl px-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                  Project Anon Key (Public Key)
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
                  <input
                    type="password"
                    required
                    value={anonKeyInput}
                    onChange={(e) => setAnonKeyInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-[#120d2a] border border-purple-700/50 rounded-xl pl-9 pr-3 py-2 text-xs text-purple-100 focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>
              </div>

              {connectionMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold ${
                    connectionMessage.type === 'success'
                      ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/70 border border-rose-500/40 text-rose-200'
                  }`}
                >
                  {connectionMessage.text}
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-purple-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" /> Keys stored strictly in browser context
                </span>
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isConnecting ? 'Verifying...' : 'Test & Connect Supabase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
