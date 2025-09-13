'use client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Mail, Menu, PcCase } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AuthDialog from '@/components/auth/auth-dialog';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';


const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#builder', label: 'PC Builder' },
  { href: '#plans', label: 'Plans' },
  { href: '#testimonials', label: 'Testimonials' },
];

function UserNav() {
  const { user, signOut, openAuthDialog, sendVerificationEmail, loading } = useAuth();

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
              <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!user.emailVerified && (
            <>
              <DropdownMenuItem
                onClick={sendVerificationEmail}
                disabled={loading}
              >
                Verify Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => openAuthDialog('change-email')}>
            Change Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button variant="ghost" onClick={() => openAuthDialog('login')}>
        Log In
      </Button>
      <Button onClick={() => openAuthDialog('signup')}>
        Sign Up
      </Button>
    </>
  );
}


export default function Header() {
  const { user, openAuthDialog, authMessage } = useAuth();

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <PcCase className="h-6 w-6 text-primary" />
            <span className="font-bold">ArchPlay Rentals</span>
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/60 transition-colors hover:text-foreground/80"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden items-center space-x-2 md:flex">
            <UserNav />
          </div>
          <AuthDialog />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <PcCase className="h-6 w-6 text-primary" />
                <span className="font-bold">ArchPlay Rentals</span>
              </Link>
              <div className="mt-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
               <div className="mt-6 flex flex-col gap-2">
                <Button variant="ghost" onClick={() => openAuthDialog('login')}>Log In</Button>
                <Button onClick={() => openAuthDialog('signup')}>Sign Up</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    {user && !user.emailVerified && (
        <div className="bg-secondary border-b">
          <div className="container py-2">
             <Alert>
                <Mail className="h-4 w-4" />
                <AlertTitle>Please verify your email</AlertTitle>
                <AlertDescription>
                  A verification link has been sent to your email address. Click the link to complete your registration.
                </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
    </>
  );
}
