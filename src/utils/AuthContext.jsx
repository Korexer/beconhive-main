import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (sessionUser) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', sessionUser.id).single();
      
      if (data) {
        if (data.role === 'agent') {
          const { data: agentData } = await supabase.from('agent_profiles').select('*').eq('id', sessionUser.id).single();
          setProfile({ ...data, ...agentData });
        } else {
          setProfile(data);
        }
      } else {
        // Self-Healing Logic for Test Users that missed the Profile creation trigger
        const fallback = {
           id: sessionUser.id,
           role: sessionUser.user_metadata?.role || 'customer',
           full_name: sessionUser.user_metadata?.full_name || sessionUser.email.split('@')[0],
           email: sessionUser.email
        };
        setProfile(fallback);
        
        // Attempt to heal database quietly
        supabase.from('profiles').insert(fallback).then();
        if (fallback.role === 'agent') supabase.from('agent_profiles').insert({ id: fallback.id, is_approved: false }).then();
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
