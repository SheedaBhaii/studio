'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  TwitterAuthProvider, 
  OAuthProvider
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from './use-toast';

type AuthState = {
  user: User | null;
  loading: boolean;
  isAuthDialogOpen: boolean;
  authDialogMode: 'login' | 'signup';
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithDiscord: () => Promise<void>;
  signInWithX: () => Promise<void>;
  signOut: () => Promise<void>;
  openAuthDialog: (mode: 'login' | 'signup') => void;
  closeAuthDialog: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<'login' | 'signup'>('login');
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignInSuccess = (user: User, provider: string) => {
    setUser(user);
    closeAuthDialog();
    toast({
      title: 'Authentication Successful',
      description: `Welcome, you're now logged in with ${provider}.`,
    });
  };

  const handleSignInError = (error: any, provider: string) => {
    console.error(`Error with ${provider} sign-in:`, error);
    toast({
      variant: 'destructive',
      title: 'Authentication Failed',
      description: `Could not sign in with ${provider}. Please try again.`,
    });
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      handleSignInSuccess(result.user, 'Google');
    } catch (error) {
      handleSignInError(error, 'Google');
    }
  };
  
  const signInWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      handleSignInSuccess(result.user, 'Facebook');
    } catch (error) {
      handleSignInError(error, 'Facebook');
    }
  };
  
  const signInWithDiscord = async () => {
    try {
      // Note: Firebase doesn't have a built-in Discord provider.
      // This requires a custom OAuth setup in the Firebase console.
      // The provider ID 'discord.com' must match what's configured there.
      const provider = new OAuthProvider('discord.com');
      provider.addScope('identify');
      provider.addScope('email');
      const result = await signInWithPopup(auth, provider);
      handleSignInSuccess(result.user, 'Discord');
    } catch (error) {
      handleSignInError(error, 'Discord');
    }
  };

  const signInWithX = async () => {
    try {
      const provider = new TwitterAuthProvider();
      const result = await signInWithPopup(auth, provider);
      handleSignInSuccess(result.user, 'X (Twitter)');
    } catch (error) {
      handleSignInError(error, 'X (Twitter)');
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast({
        title: 'Signed Out',
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
      });
    }
  };

  const openAuthDialog = (mode: 'login' | 'signup') => {
    setAuthDialogMode(mode);
    setIsAuthDialogOpen(true);
  };

  const closeAuthDialog = () => {
    setIsAuthDialogOpen(false);
  };

  const value = {
    user,
    loading,
    isAuthDialogOpen,
    authDialogMode,
    signInWithGoogle,
    signInWithFacebook,
    signInWithDiscord,
    signInWithX,
    signOut,
    openAuthDialog,
    closeAuthDialog,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
