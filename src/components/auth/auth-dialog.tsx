'use client';

import { useAuth } from '@/hooks/use-auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Chrome, Facebook, Disc, Twitter, Mail, Loader2 } from 'lucide-react'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export default function AuthDialog() {
  const {
    isAuthDialogOpen,
    closeAuthDialog,
    authDialogMode,
    signInWithGoogle,
    signInWithFacebook,
    signInWithDiscord,
    signInWithX,
    signInWithEmail,
    signUpWithEmail,
    openAuthDialog,
    authError,
    loading: authLoading,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const isLogin = authDialogMode === 'login';
  const title = isLogin ? 'Log In' : 'Sign Up';
  const description = isLogin
    ? 'Choose your preferred method to log in to your account.'
    : 'Create an account to get started with your high-performance PC rental.';

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
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


  return (
    <Dialog open={isAuthDialogOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3">
          <Button variant="outline" onClick={signInWithGoogle}>
            <Chrome className="mr-2 h-4 w-4" /> Continue with Google
          </Button>
          <Button variant="outline" onClick={signInWithFacebook}>
            <Facebook className="mr-2 h-4 w-4" /> Continue with Facebook
          </Button>
           <Button variant="outline" onClick={signInWithDiscord}>
            <Disc className="mr-2 h-4 w-4" /> Continue with Discord
          </Button>
          <Button variant="outline" onClick={signInWithX}>
            <Twitter className="mr-2 h-4 w-4" /> Continue with X
          </Button>
        </div>

        <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john.doe@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {authError && <p className="text-sm text-destructive text-center">{authError}</p>}
          <Button type="submit" className="w-full" disabled={authLoading}>
            {authLoading ? <Loader2 className="animate-spin" /> : <Mail />}
            Continue with Email
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          {isLogin ? (
            <>
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
