import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    is_guest: boolean;
    loyalty_points: number;
    phone: string | null;
  } | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<import('@supabase/supabase-js').User | null>;
  signIn: (email: string, password: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  isGuest: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthContextType["profile"]>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, is_guest, loyalty_points, phone")
      .eq("id", userId)
      .single();
    setProfile(data);
  }, []);

  // Ensures a profile row exists; upserts from auth user metadata as fallback
  const ensureProfile = useCallback(async (newUser: User) => {
    const displayName =
      (newUser.user_metadata?.display_name as string | undefined) ??
      newUser.email?.split("@")[0] ??
      "Guest";
    await supabase.from("profiles").upsert(
      { id: newUser.id, display_name: displayName, is_guest: false },
      { onConflict: "id", ignoreDuplicates: true }
    );
    await fetchProfile(newUser.id);
  }, [fetchProfile]);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          // Use setTimeout to avoid Supabase client deadlock
          setTimeout(() => ensureProfile(newSession.user), 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      setUser(existing?.user ?? null);
      if (existing?.user) {
        ensureProfile(existing.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [ensureProfile]);

  const signUp = async (email: string, password: string, displayName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (error) {
      const isRateLimit =
        error.message.toLowerCase().includes("rate limit") ||
        (error as any).status === 429;
      if (isRateLimit) {
        throw new Error(
          "Supabase email rate limit reached. To fix this, go to your Supabase project → Authentication → Email → disable \"Confirm email\". This allows sign-ups without sending a confirmation email."
        );
      }
      throw error;
    }

    // Create the profiles row immediately if we have the user (no email confirmation)
    if (data.user) {
      await supabase.from("profiles").upsert(
        { id: data.user.id, display_name: displayName, is_guest: false },
        { onConflict: "id", ignoreDuplicates: false }
      );
    }
    return data.user;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signInAsGuest = async () => {
    const { error } = await supabase.auth.signInAnonymously({
      options: { data: { is_guest: true, display_name: "Guest" } },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore network/session errors — still clear local state
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signInAsGuest,
        signOut,
        isGuest: profile?.is_guest ?? true,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
