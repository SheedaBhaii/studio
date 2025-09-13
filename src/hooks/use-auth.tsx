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
  sendEmailVerification,
  sendPasswordResetEmail,
  updateEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from './use-toast';

type AuthDialogMode = 'login' | 'signup' | 'forgot-password' | 'change-email';

type AuthState = {
  user: User | null;
  loading: boolean;
  isAuthDialogOpen: boolean;
  authDialogMode: AuthDialogMode;
  authError: string | null;
  authMessage: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  changeEmail: (newEmail: string) => Promise<void>;
  openAuthDialog: (mode: AuthDialogMode) => void;
  closeAuthDialog: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<AuthDialogMode>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const clearAlerts = () => {
    setAuthError(null);
    setAuthMessage(null);
  };

  const handleAuthSuccess = (user: User, message: string) => {
    setUser(user);
    closeAuthDialog();
    toast({
      title: 'Success',
      description: message,
    });
  };

  const handleAuthError = (error: any, context: string) => {
    console.error(`Error with ${context}:`, error);
    let message = `An error occurred during ${context}. Please try again.`;
    if (error.code) {
      switch (error.code) {
        case 'auth/account-exists-with-different-credential':
          message = 'An account already exists with this email but with a different sign-in method.';
          break;
        case 'auth/invalid-credential':
          message = 'Invalid credentials. Please check your details and try again.';
          break;
        case 'auth/email-already-in-use':
          message = 'This email is already registered. Please log in.';
          break;
        case 'auth/user-not-found':
          message = 'No account found with this email address.';
          break;
         case 'auth/requires-recent-login':
          message = 'This action is sensitive and requires recent authentication. Please log in again before retrying.';
          break;
        default:
          message = error.message;
          break;
      }
    }
    setAuthError(message);
  };
  
  const signInWithProvider = async (provider: GoogleAuthProvider | FacebookAuthProvider | OAuthProvider, providerName: string) => {
    setLoading(true);
    clearAlerts();
    try {
      const result = await signInWithPopup(auth, provider);
      handleAuthSuccess(result.user, `Welcome, you're now logged in with ${providerName}.`);
    } catch (error) {
      handleAuthError(error, `${providerName} sign-in`);
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
    clearAlerts();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await sendEmailVerification(userCredential.user);
      const updatedUser = { ...userCredential.user, displayName: name };
      handleAuthSuccess(updatedUser, 'Your account has been created. Please check your email to verify your address.');
    } catch (error: any) {
      handleAuthError(error, 'email sign-up');
    } finally {
      setLoading(false);
    }
  };
  
  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    clearAlerts();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      handleAuthSuccess(userCredential.user, 'Welcome back!');
    } catch (error) {
      handleAuthError(error, 'email sign-in');
    } finally {
      setLoading(false);
    }
  };
  
  const sendVerificationEmail = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast({
        title: 'Email Sent',
        description: 'A new verification email has been sent to your address.',
      });
    } catch (error) {
      handleAuthError(error, 'sending verification email');
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setLoading(true);
    clearAlerts();
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthMessage('A password reset link has been sent to your email address.');
    } catch (error) {
      handleAuthError(error, 'password reset');
    } finally {
      setLoading(false);
    }
  };
  
  const changeEmail = async (newEmail: string) => {
    if (!auth.currentUser) return;
    setLoading(true);
    clearAlerts();
    try {
      await updateEmail(auth.currentUser, newEmail);
      await sendEmailVerification(auth.currentUser);
      handleAuthSuccess(auth.currentUser, 'Your email has been updated. Please check your new email to verify it.');
    } catch (error) {
      handleAuthError(error, 'email change');
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

  const openAuthDialog = (mode: AuthDialogMode) => {
    setAuthDialogMode(mode);
    setIsAuthDialogOpen(true);
    clearAlerts();
  };

  const closeAuthDialog = () => {
    setIsAuthDialogOpen(false);
    clearAlerts();
  };

  const value = {
    user,
    loading,
    isAuthDialogOpen,
    authDialogMode,
    authError,
    authMessage,
    signInWithGoogle,
    signInWithFacebook,
    signInWithMicrosoft,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    sendVerificationEmail,
    sendPasswordReset,
    changeEmail,
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
