'use client';

import { useAuth } from '@/hooks/use-auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Chrome, Facebook, Mail, Loader2, User, KeyRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const MicrosoftIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 23 23">
    <path fill="#f3f3f3" d="M0 0h23v23H0z" />
    <path fill="#F35325" d="M1 1h10v10H1z" />
    <path fill="#81BC06" d="M12 1h10v10H12z" />
    <path fill="#05A6F0" d="M1 12h10v10H1z" />
    <path fill="#FFB900" d="M12 12h10v10H12z" />
  </svg>
);


export default function AuthDialog() {
  const {
    user,
    isAuthDialogOpen,
    closeAuthDialog,
    authDialogMode,
    signInWithGoogle,
    signInWithFacebook,
    signInWithMicrosoft,
    signInWithEmail,
    signUpWithEmail,
    openAuthDialog,
    sendPasswordReset,
    authError,
    authMessage,
    loading: authLoading,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const isLogin = authDialogMode === 'login';
  const isForgotPassword = authDialogMode === 'forgot-password';

  const getTitle = () => {
    if (isLogin) return 'Log In';
    if (isForgotPassword) return 'Reset Password';
    return 'Sign Up';
  };

  const getDescription = () => {
    if (isLogin) return 'Choose your preferred method to log in to your account.';
    if (isForgotPassword) return 'Enter your email to receive a password reset link.';
    return 'Create an account to get started with your high-performance PC rental.';
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isForgotPassword) {
      await sendPasswordReset(email);
      return;
    }
    if (isLogin) {
      await signInWithEmail(email, password);
    } else {
      await signUpWithEmail(email, password, name);
    }
  };
  
  const handleDialogChange = (open: boolean) => {
    if(!open) {
      setEmail('');
      setPassword('');
      setName('');
      closeAuthDialog();
    }
  }

  const socialButtons = (
    <div className="flex flex-col gap-3">
      <Button variant="outline" onClick={signInWithGoogle} disabled={authLoading}>
        <Chrome className="mr-2 h-4 w-4" /> Continue with Google
      </Button>
      <Button variant="outline" onClick={signInWithFacebook} disabled={authLoading}>
        <Facebook className="mr-2 h-4 w-4" /> Continue with Facebook
      </Button>
       <Button variant="outline" onClick={signInWithMicrosoft} disabled={authLoading}>
        <MicrosoftIcon /> Continue with Microsoft
      </Button>
    </div>
  );


  return (
    <Dialog open={isAuthDialogOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        {authMessage && (
          <Alert>
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>{authMessage}</AlertDescription>
          </Alert>
        )}
        
        {authDialogMode !== 'change-email' && !isForgotPassword && socialButtons}

        {authDialogMode !== 'change-email' && !isForgotPassword && (
            <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
            </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {!isLogin && !isForgotPassword && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john.doe@example.com" required />
          </div>
          
          {!isForgotPassword && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
          )}
          
          {authError && <p className="text-sm text-destructive text-center">{authError}</p>}
          
          <Button type="submit" className="w-full" disabled={authLoading}>
            {authLoading ? <Loader2 className="animate-spin" /> : (isForgotPassword ? <Mail /> : (isLogin ? <User /> : <Mail />))}
            {isLogin ? 'Login' : (isForgotPassword ? 'Send Reset Link' : 'Continue with Email')}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          {isLogin ? (
            <>
              <Button variant="link" className="p-0 h-auto" onClick={() => openAuthDialog('forgot-password')}>
                Forgot password?
              </Button>
              <span className="mx-2 text-muted-foreground">|</span>
              Don't have an account?{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => openAuthDialog('signup')}>
                Sign up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => openAuthDialog('login')}>
                Log in
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
