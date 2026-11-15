import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext, isAdminUser } from './authContextCore';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error('Unable to restore Supabase session:', error);
        setUser(null);
      } else {
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) throw error;
    if (!isAdminUser(data.user)) {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Unable to sign out non-admin user:', signOutError);
      }
      throw new Error('This account is not authorized to access the admin area.');
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const verifyPassword = async (password) => {
    if (!isAdminUser(user)) return false;

    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (error?.status === 400) return false;
    if (error) throw error;
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, verifyPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
