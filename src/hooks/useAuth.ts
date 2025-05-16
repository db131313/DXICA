import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      console.log('Starting sign out process...');
      await signOut(auth);
      console.log('Firebase sign out successful');
      setUser(null);
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      return false;
    }
  };

  return {
    user,
    loading,
    signOut: handleSignOut
  };
} 