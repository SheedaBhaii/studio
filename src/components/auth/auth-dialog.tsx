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
import { Chrome, Facebook, Disc, Twitter } from 'lucide-react'; // Using Disc for Discord, Twitter for X

export default function AuthDialog() {
  const {
    isAuthDialogOpen,
    closeAuthDialog,
    authDialogMode,
    signInWithGoogle,
    signInWithFacebook,
    signInWithDiscord,
    signInWithX,
    openAuthDialog,
  } = useAuth();

  const title = authDialogMode === 'login' ? 'Log In' : 'Sign Up';
  const description =
    authDialogMode === 'login'
      ? 'Choose your preferred method to log in to your account.'
      : 'Create an account to get started with your high-performance PC rental.';

  return (
    <Dialog open={isAuthDialogOpen} onOpenChange={closeAuthDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-3">
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
        <div className="mt-4 text-center text-sm">
          {authDialogMode === 'login' ? (
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
