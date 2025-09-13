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
  OAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from './use-toast';

type AuthState = {
  user: User | null;
  loading: boolean;
  isAuthDialogOpen: boolean;
  authDialogMode: 'login' | 'signup';
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
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
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const clearError = () => setAuthError(null);

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
    let message = `Could not sign in with ${provider}. Please try again.`;
    if (error.code === 'auth/account-exists-with-different-credential') {
      message = 'An account already exists with the same email address but different sign-in credentials.';
    } else if (error.code === 'auth/invalid-credential') {
      message = 'Invalid credentials. Please check your email and password.';
    }
    setAuthError(message);
  };
  
  const signInWithProvider = async (provider: GoogleAuthProvider | FacebookAuthProvider | OAuthProvider, providerName: string) => {
    setLoading(true);
    clearError();
    try {
      const result = await signInWithPopup(auth, provider);
      handleSignInSuccess(result.user, providerName);
    } catch (error) {
      handleSignInError(error, providerName);
    } finally {
      setLoading(false);
    }
  }

  const signInWithGoogle = async () => {
    await signInWithProvider(new GoogleAuthProvider(), 'Google');
  };
  
  const signInWithFacebook = async () => {
    await signInWithProvider(new FacebookAuthProvider(), 'Facebook');
  };
  
  const signInWithMicrosoft = async () => {
    const provider = new OAuthProvider('microsoft.com');
    await signInWithProvider(provider, 'Microsoft');
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    setLoading(true);
    clearError();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      const updatedUser = { ...userCredential.user, displayName: name };
      handleSignInSuccess(updatedUser, 'Email');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('This email is already in use. Please log in or use a different email.');
      } else {
        handleSignInError(error, 'Email');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    clearError();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      handleSignInSuccess(userCredential.user, 'Email');
    } catch (error) {
      handleSignInError(error, 'Email');
    } finally {
      setLoading(false);
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
    clearError();
  };

  const closeAuthDialog = () => {
    setIsAuthDialogOpen(false);
    clearError();
  };

  const value = {
    user,
    loading,
    isAuthDialogOpen,
    authDialogMode,
    authError,
    signInWithGoogle,
    signInWithFacebook,
    signInWithMicrosoft,
    signUpWithEmail,
    signInWithEmail,
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
