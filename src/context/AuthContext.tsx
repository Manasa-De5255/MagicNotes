import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types/notebook';
import { getSupabase, isSupabaseConnected, saveCustomSupabaseConfig, clearCustomSupabaseConfig } from '../services/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isCloudConnected: boolean;
  cloudError: string | null;
  signUp: (email: string, password: string, fullName: string, avatarId: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  updateProfile: (updates: { full_name?: string; avatar_id?: string; bio?: string }, newPassword?: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  connectCustomSupabase: (url: string, anonKey: string) => Promise<{ success: boolean; error?: string }>;
  disconnectCustomSupabase: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_ACCOUNTS_KEY = 'magic_notes_local_accounts';
const LOCAL_CURRENT_USER_ID_KEY = 'magic_notes_current_user_id';

interface LocalAccountRecord {
  id: string;
  email: string;
  passwordHash: string; // simple obfuscated hash for local sandbox
  full_name: string;
  avatar_id: string;
  bio?: string;
  created_at: string;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);

  // Helper to read local accounts partition
  const getLocalAccounts = (): LocalAccountRecord[] => {
    try {
      const data = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveLocalAccounts = (accounts: LocalAccountRecord[]) => {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  };

  // Initialize auth session
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const supabase = getSupabase();

      if (supabase && isSupabaseConnected()) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.warn('Supabase auth session error, falling back to local sandbox:', error.message);
            setCloudError(error.message);
            setIsCloudConnected(false);
          } else if (session?.user) {
            setIsCloudConnected(true);
            setCloudError(null);

            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profile) {
              setUser({
                id: profile.id,
                email: profile.email || session.user.email || '',
                full_name: profile.full_name || session.user.user_metadata?.full_name || 'Cosmic Traveler',
                avatar_id: profile.avatar_id || 'koya',
                bio: profile.bio || '',
                created_at: profile.created_at || new Date().toISOString(),
              });
            } else {
              // Create default profile for Supabase user
              const newProfile: UserProfile = {
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || 'Cosmic Traveler',
                avatar_id: session.user.user_metadata?.avatar_id || 'koya',
                created_at: new Date().toISOString(),
              };
              await supabase.from('profiles').upsert(newProfile);
              setUser(newProfile);
            }

            setIsLoading(false);
            return;
          } else {
            setIsCloudConnected(true);
            setUser(null);
            setIsLoading(false);
            return;
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to connect to Supabase';
          console.warn('Supabase connection check error:', message);
          setCloudError(message);
          setIsCloudConnected(false);
        }
      } else {
        setIsCloudConnected(false);
      }

      // Local / Offline Multi-User Sandbox initialization
      const localAccounts = getLocalAccounts();
      const currentUserId = localStorage.getItem(LOCAL_CURRENT_USER_ID_KEY);

      if (currentUserId) {
        const found = localAccounts.find((a) => a.id === currentUserId);
        if (found) {
          setUser({
            id: found.id,
            email: found.email,
            full_name: found.full_name,
            avatar_id: found.avatar_id,
            bio: found.bio,
            created_at: found.created_at,
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    };

    initAuth();

    // Listen for auth state changes if Supabase is active
    const supabase = getSupabase();
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email || session.user.email || '',
              full_name: profile.full_name || 'Cosmic Traveler',
              avatar_id: profile.avatar_id || 'koya',
              bio: profile.bio || '',
              created_at: profile.created_at || new Date().toISOString(),
            });
          }
        } else {
          // If logged out from Supabase, clear current user
          if (isCloudConnected) {
            setUser(null);
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isCloudConnected]);

  // Sign Up
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    avatarId: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    if (!fullName.trim()) {
      return { success: false, error: 'Please enter your name.' };
    }

    const supabase = getSupabase();
    if (supabase && isCloudConnected) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              avatar_id: avatarId || 'koya',
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const newProfile: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            full_name: fullName.trim(),
            avatar_id: avatarId || 'koya',
            created_at: new Date().toISOString(),
          };

          // Save profile in Supabase table
          await supabase.from('profiles').upsert(newProfile);
          setUser(newProfile);
          return { success: true };
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Sign up failed';
        return { success: false, error: message };
      }
    }

    // Local sandbox multi-user implementation with strict isolation
    const localAccounts = getLocalAccounts();
    const existing = localAccounts.find((a) => a.email === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newAccount: LocalAccountRecord = {
      id: newId,
      email: cleanEmail,
      passwordHash: btoa(password), // simple client-side representation for sandbox
      full_name: fullName.trim(),
      avatar_id: avatarId || 'koya',
      created_at: new Date().toISOString(),
    };

    localAccounts.push(newAccount);
    saveLocalAccounts(localAccounts);

    const newProfile: UserProfile = {
      id: newAccount.id,
      email: newAccount.email,
      full_name: newAccount.full_name,
      avatar_id: newAccount.avatar_id,
      created_at: newAccount.created_at,
    };

    localStorage.setItem(LOCAL_CURRENT_USER_ID_KEY, newId);
    setUser(newProfile);
    return { success: true };
  };

  // Sign In
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    const supabase = getSupabase();
    if (supabase && isCloudConnected) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

          const userProfile: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            full_name: profile?.full_name || data.user.user_metadata?.full_name || 'Cosmic Traveler',
            avatar_id: profile?.avatar_id || 'koya',
            bio: profile?.bio || '',
            created_at: profile?.created_at || new Date().toISOString(),
          };

          setUser(userProfile);
          return { success: true };
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Sign in failed';
        return { success: false, error: message };
      }
    }

    // Local sandbox check
    const localAccounts = getLocalAccounts();
    const found = localAccounts.find((a) => a.email === cleanEmail);
    if (!found) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (found.passwordHash !== btoa(password)) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    localStorage.setItem(LOCAL_CURRENT_USER_ID_KEY, found.id);
    setUser({
      id: found.id,
      email: found.email,
      full_name: found.full_name,
      avatar_id: found.avatar_id,
      bio: found.bio,
      created_at: found.created_at,
    });

    return { success: true };
  };

  // Sign Out
  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase && isCloudConnected) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Sign out error:', err);
      }
    }

    localStorage.removeItem(LOCAL_CURRENT_USER_ID_KEY);
    setUser(null);
  };

  // Password Reset
  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your registered email address.' };
    }

    const supabase = getSupabase();
    if (supabase && isCloudConnected) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: window.location.origin,
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return {
          success: true,
          message: 'Password reset link has been dispatched to your email address.',
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Reset password failed';
        return { success: false, error: message };
      }
    }

    // Local sandbox password reset
    const localAccounts = getLocalAccounts();
    const found = localAccounts.find((a) => a.email === cleanEmail);
    if (!found) {
      return { success: false, error: 'No account found with this email address.' };
    }

    return {
      success: true,
      message: `Password reset simulation: In sandbox mode, your account is verified. You can update your password in Profile Settings anytime.`,
    };
  };

  // Update Profile
  const updateProfile = async (
    updates: { full_name?: string; avatar_id?: string; bio?: string },
    newPassword?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const supabase = getSupabase();
    if (supabase && isCloudConnected) {
      try {
        const profilePayload: Record<string, string> = {
          updated_at: new Date().toISOString(),
        };
        if (updates.full_name !== undefined) profilePayload.full_name = updates.full_name;
        if (updates.avatar_id !== undefined) profilePayload.avatar_id = updates.avatar_id;
        if (updates.bio !== undefined) profilePayload.bio = updates.bio;

        const { error: profileError } = await supabase
          .from('profiles')
          .update(profilePayload)
          .eq('id', user.id);

        if (profileError) {
          return { success: false, error: profileError.message };
        }

        if (newPassword) {
          const { error: pwdError } = await supabase.auth.updateUser({
            password: newPassword,
          });
          if (pwdError) {
            return { success: false, error: pwdError.message };
          }
        }

        setUser((prev) => (prev ? { ...prev, ...updates } : null));
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to update profile';
        return { success: false, error: message };
      }
    }

    // Local sandbox
    const localAccounts = getLocalAccounts();
    const index = localAccounts.findIndex((a) => a.id === user.id);
    if (index === -1) {
      return { success: false, error: 'Account not found in local sandbox.' };
    }

    if (updates.full_name) localAccounts[index].full_name = updates.full_name;
    if (updates.avatar_id) localAccounts[index].avatar_id = updates.avatar_id;
    if (updates.bio !== undefined) localAccounts[index].bio = updates.bio;
    if (newPassword) {
      if (newPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }
      localAccounts[index].passwordHash = btoa(newPassword);
    }

    saveLocalAccounts(localAccounts);
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
    return { success: true };
  };

  // Delete Account
  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const targetUserId = user.id;
    const supabase = getSupabase();

    if (supabase && isCloudConnected) {
      try {
        // Delete user row from profiles (cascading deletes projects, notes, etc.)
        await supabase.from('profiles').delete().eq('id', targetUserId);
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Account deletion cloud error:', err);
      }
    }

    // Also remove local records & account
    const localAccounts = getLocalAccounts();
    const updated = localAccounts.filter((a) => a.id !== targetUserId);
    saveLocalAccounts(updated);

    // Clean up per-user storage
    localStorage.removeItem(`magic_notes_data_${targetUserId}`);
    localStorage.removeItem(`magic_notes_settings_${targetUserId}`);
    localStorage.removeItem(LOCAL_CURRENT_USER_ID_KEY);

    setUser(null);
    return { success: true };
  };

  // Connect custom Supabase credentials from in-app settings
  const connectCustomSupabase = async (
    url: string,
    anonKey: string
  ): Promise<{ success: boolean; error?: string }> => {
    saveCustomSupabaseConfig(url, anonKey);
    const client = getSupabase();
    if (!client) {
      clearCustomSupabaseConfig();
      return { success: false, error: 'Invalid Supabase URL or Anon Key.' };
    }

    try {
      const { error } = await client.auth.getSession();
      if (error) {
        clearCustomSupabaseConfig();
        return { success: false, error: `Connection failed: ${error.message}` };
      }

      setIsCloudConnected(true);
      setCloudError(null);
      return { success: true };
    } catch (err: unknown) {
      clearCustomSupabaseConfig();
      const message = err instanceof Error ? err.message : 'Failed to reach Supabase project';
      return { success: false, error: message };
    }
  };

  const disconnectCustomSupabase = () => {
    clearCustomSupabaseConfig();
    setIsCloudConnected(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isCloudConnected,
        cloudError,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
        deleteAccount,
        connectCustomSupabase,
        disconnectCustomSupabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
