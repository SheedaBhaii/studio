
'use client';

import { useEffect, useState } from 'react';
import { 
  auth, 
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ChromeIcon, FacebookIcon, MicIcon } from 'lucide-react';


function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="1em" height="1em" {...props}>
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.655-3.438-11.288-8.169l-6.571 4.819A20.01 20.01 0 0 0 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C43.021 36.213 44 31.258 44 24c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
    )
}

function MicrosoftIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="1em" height="1em" {...props}>
            <path fill="#f35325" d="M22.5 22.5H6v-17h16.5z" />
            <path fill="#81bc06" d="M42.5 22.5H26v-17h16.5z" />
            <path fill="#05a6f0" d="M22.5 42.5H6v-17h16.5z" />
            <path fill="#ffba08" d="M42.5 42.5H26v-17h16.5z" />
        </svg>
    )
}


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('signin');
  const [authError, setAuthError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const openAuth = (tab: 'signin' | 'signup') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
    setAuthError('');
    setEmail('');
    setPassword('');
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
    setAuthError('');
  };

  useEffect(() => {
    (window as any).openAuth = openAuth;
  }, []);

  useEffect(() => {
    const handleAuthSuccess = (user: any) => {
      console.log("Signed in successfully:", user);
      closeAuth();
      toast({
        title: 'Sign In Successful',
        description: `Welcome, ${user.displayName || user.email}!`,
      });
      // You can update the UI state here if needed, e.g., using a user context
    };

    const handleAuthError = (error: any) => {
        console.error("Firebase Auth Error:", error);
        let message = `An unexpected error occurred: ${error.message}`;
        switch (error.code) {
            case 'auth/account-exists-with-different-credential':
                message = 'An account already exists with this email using a different sign-in method. Please sign in with the original method to link them.';
                break;
            case 'auth/invalid-email':
                message = 'The email address is not valid.';
                break;
            case 'auth/user-not-found':
                message = 'No account found with this email. Please sign up first.';
                break;
            case 'auth/wrong-password':
                message = 'Incorrect password. Please try again.';
                break;
            case 'auth/email-already-in-use':
                message = 'This email is already in use by another account.';
                break;
            case 'auth/weak-password':
                message = 'The password is too weak. It must be at least 6 characters long.';
                break;
            case 'auth/popup-closed-by-user':
                message = 'Sign-in popup was closed. Please try again.';
                break;
            case 'auth/unauthorized-domain':
                 message = 'This domain is not authorized for authentication. Please go to your Firebase Console and add it to the list of authorized domains.';
                 break;
        }
        setAuthError(message);
    };

    const oauth = async (providerName: 'google' | 'microsoft' | 'facebook') => {
      setAuthError("");
      let provider;
      switch (providerName) {
        case 'google':
          provider = new GoogleAuthProvider();
          break;
        case 'microsoft':
          provider = new OAuthProvider('microsoft.com');
          break;
        case 'facebook':
          provider = new FacebookAuthProvider();
          break;
        default:
          setAuthError("Unknown provider.");
          return;
      }
      try {
        const result = await signInWithPopup(auth, provider);
        handleAuthSuccess(result.user);
      } catch (error) {
        handleAuthError(error);
      }
    };
    (window as any).oauth = oauth;

    const handleEmailAuth = async (mode: 'signin' | 'signup' | 'magiclink') => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setAuthError("Please enter a valid email address.");
            return;
        }

        setAuthError("");
        try {
            if (mode === 'magiclink') {
                const actionCodeSettings = {
                    url: window.location.href.split('#')[0],
                    handleCodeInApp: true,
                };
                await sendSignInLinkToEmail(auth, email, actionCodeSettings);
                window.localStorage.setItem('emailForSignIn', email);
                toast({
                    title: 'Magic Link Sent!',
                    description: `A magic link has been sent to ${email}. Please check your inbox.`,
                });
                closeAuth();
            } else {
                 if (!password || password.length < 6) {
                    setAuthError("Password must be at least 6 characters.");
                    return;
                }
                let userCredential;
                if (mode === 'signup') {
                    userCredential = await createUserWithEmailAndPassword(auth, email, password);
                } else { // signin
                    userCredential = await signInWithEmailAndPassword(auth, email, password);
                }
                handleAuthSuccess(userCredential.user);
            }
        } catch(error) {
            handleAuthError(error);
        }
    }


    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailFromStore = window.localStorage.getItem('emailForSignIn');
      if (!emailFromStore) {
        emailFromStore = window.prompt('Please provide your email for confirmation');
      }
      if (emailFromStore) {
        signInWithEmailLink(auth, emailFromStore, window.location.href)
          .then((result) => {
            window.localStorage.removeItem('emailForSignIn');
            handleAuthSuccess(result.user);
          })
          .catch((error) => {
            handleAuthError(error);
          });
      }
    }

    const AuthForm = ({ mode }: { mode: 'signin' | 'signup' }) => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
                 <Button variant="outline" onClick={() => oauth('google')}><GoogleIcon className="mr-2" /> Continue with Google</Button>
                 <Button variant="outline" onClick={() => oauth('microsoft')}><MicrosoftIcon className="mr-2" /> Continue with Microsoft</Button>
                 <Button variant="outline" onClick={() => oauth('facebook')}><FacebookIcon className="mr-2" /> Continue with Facebook</Button>
            </div>
            <div className="relative">
                <Separator />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                    <span className="bg-background px-2 text-sm text-muted-foreground">OR</span>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`email-${mode}`}>Email Address</Label>
                <Input id={`email-${mode}`} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`password-${mode}`}>Password</Label>
                <Input id={`password-${mode}`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {mode === 'signin' && (
                 <p className="text-right text-sm text-primary hover:underline cursor-pointer" onClick={() => handleEmailAuth('magiclink')}>
                    Send magic link
                </p>
            )}

            <Button onClick={() => handleEmailAuth(mode)} className="w-full">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
             {mode === 'signup' && (
                 <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                     <span className="text-primary hover:underline cursor-pointer" onClick={() => setAuthTab('signin')}>
                        Sign in
                    </span>
                </p>
            )}
        </div>
    );
    (window as any).AuthForm = AuthForm;

  }, [toast, email, password]);


  useEffect(() => {
    const themeToggle = document.getElementById("themeToggle") as HTMLInputElement;
    
    const applyTheme = (t: string) => { 
      document.documentElement.setAttribute("data-theme", t); 
      if(themeToggle) themeToggle.checked = (t === "light"); 
    };

    const toggleTheme = () => { 
      const curr = document.documentElement.getAttribute("data-theme") || 'dark';
      const newTheme = curr === "dark" ? "light" : "dark"; 
      applyTheme(newTheme); 
      localStorage.setItem("theme", newTheme); 
    };
    if (themeToggle) themeToggle.addEventListener("change", toggleTheme);
    const savedTheme = localStorage.getItem("theme"); 
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('dark');
    }
    (window as any).toggleTheme = toggleTheme;

    const toggleDrawer = (force?: boolean) => {
      const d = document.getElementById("drawer");
      if (!d) return;
      if (typeof force === "boolean") { 
        d.classList.toggle("open", force); 
      } else {
        d.classList.toggle("open");
      }
    };
    (window as any).toggleDrawer = toggleDrawer;

    const yearEl = document.getElementById("year");
    if(yearEl) yearEl.textContent = new Date().getFullYear().toString();

    // --- Hero Animation Logic ---
    const gpuStatsEl = document.getElementById('gpu-stats');
    const latencyStatsEl = document.getElementById('latency-stats');
    const gpuUtilFillEl = document.getElementById('gpuUtilFill') as HTMLElement;
    const gpuClockFillEl = document.getElementById('gpuClockFill') as HTMLElement;
    const gpuMemFillEl = document.getElementById('gpuMemFill') as HTMLElement;
    const gpuUtilTextEl = document.getElementById('gpu-util-text');
    const gpuClockTextEl = document.getElementById('gpu-clock-text');
    const gpuMemTextEl = document.getElementById('gpu-mem-text');
    const latencyFillEl = document.getElementById('latencyFill') as HTMLElement;
    const latencyTextEl = document.getElementById('latency-text');

    let tempCounter = 0;
    let currentTemp = 62;
    let currentMem = 8.4;

    const updateStats = () => {
      // GPU Util
      const gpu = Math.floor(Math.random() * (95 - 60 + 1) + 60);
      if (gpuStatsEl) {
        tempCounter++;
        if (tempCounter > 4) {
            currentTemp = Math.floor(Math.random() * (70 - 58 + 1) + 58);
            tempCounter = 0;
        }
        gpuStatsEl.textContent = `GPU ${gpu}% • ${currentTemp}°C`;
      }
       if (gpuUtilFillEl) gpuUtilFillEl.style.width = `${gpu}%`;
       if (gpuUtilTextEl) gpuUtilTextEl.textContent = `${gpu}%`;


      // Latency
      const latency = Math.floor(Math.random() * (19 - 5 + 1)) + 5;
      if (latencyStatsEl) {
        latencyStatsEl.textContent = `Remote session connected — ${latency} ms`;
      }
      if (latencyFillEl) latencyFillEl.style.width = `${(latency / 20) * 100}%`;
      if (latencyTextEl) latencyTextEl.textContent = `${latency} ms`;


      // GPU Clock
      const clock = Math.floor(Math.random() * (2125 - 1800 + 1) + 1800);
      if(gpuClockFillEl) gpuClockFillEl.style.width = `${((clock - 500) / (2125 - 500)) * 100}%`;
      if(gpuClockTextEl) gpuClockTextEl.textContent = `${clock} MHz`;


      // GPU Memory
      currentMem += (Math.random() - 0.5) * 0.5; // Fluctuate slowly
      if (currentMem < 6) currentMem = 6;
      if (currentMem > 12) currentMem = 12;
      if(gpuMemFillEl) gpuMemFillEl.style.width = `${(currentMem / 16) * 100}%`;
      if(gpuMemTextEl) gpuMemTextEl.textContent = `${currentMem.toFixed(1)} / 16.0 GB`;

    };

    const statsInterval = setInterval(updateStats, 2100);

    return () => {
      if (themeToggle) themeToggle.removeEventListener("change", toggleTheme);
      clearInterval(statsInterval);
    };

  }, []);

  const AuthForm = ({ mode }: { mode: 'signin' | 'signup' }) => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
             <Button variant="outline" onClick={() => (window as any).oauth('google')}><GoogleIcon className="mr-2" /> Continue with Google</Button>
             <Button variant="outline" onClick={() => (window as any).oauth('microsoft')}><MicrosoftIcon className="mr-2" /> Continue with Microsoft</Button>
             <Button variant="outline" onClick={() => (window as any).oauth('facebook')}><FacebookIcon className="mr-2" /> Continue with Facebook</Button>
        </div>
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                </span>
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor={`email-${mode}`}>Email Address</Label>
            <Input id={`email-${mode}`} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor={`password-${mode}`}>Password</Label>
            <Input id={`password-${mode}`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
         {mode === 'signin' && (
             <p className="text-right text-sm">
                <a href="#" className="text-primary hover:underline" onClick={(e) => { e.preventDefault(); (window as any).handleEmailAuth('magiclink'); }}>
                    Send magic link
                </a>
            </p>
        )}

        <Button onClick={() => (window as any).handleEmailAuth(mode)} className="w-full">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </Button>
         {mode === 'signup' && (
             <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                 <span className="text-primary hover:underline cursor-pointer" onClick={() => setAuthTab('signin')}>
                    Sign in
                </span>
            </p>
        )}
    </div>
);


  return (
    <>
      <header className="site">
        <div className="container nav" role="navigation" aria-label="Primary">
          <a href="#home" className="brand">
            <div className="logo" aria-hidden="true"><span>AP</span></div>
            <span>ArchPlay PCs</span>
          </a>
          <nav className="navlinks" aria-label="Main links">
            <a href="#machines">Machines</a>
            <a href="#pricing">Pricing</a>
            <a href="#how-it-works">How it works</a>
            <a href="#support">Support</a>
            <a href="#legal">Legal</a>
            <a href="#about">About</a>
          </nav>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <label className="switch" title="Toggle light/dark">
              <input id="themeToggle" type="checkbox" aria-label="Toggle theme" />
              <span className="muted" aria-hidden="true">Theme</span>
            </label>
            <button className="btn btn-ghost" onClick={() => openAuth('signin')}>Sign in</button>
            <button className="btn btn-primary" onClick={() => openAuth('signup')}>Start Free Trial</button>
            <button className="btn btn-muted mobile-nav-btn" aria-label="Open menu" onClick={() => (window as any).toggleDrawer()}>☰</button>
          </div>
        </div>
        <div id="drawer" className="drawer" role="navigation" aria-label="Mobile menu">
          <a href="#home" onClick={() => (window as any).toggleDrawer(false)}>Home</a>
          <a href="#machines" onClick={() => (window as any).toggleDrawer(false)}>Machines</a>
          <a href="#pricing" onClick={() => (window as any).toggleDrawer(false)}>Pricing</a>
          <a href="#how-it-works" onClick={() => (window as any).toggleDrawer(false)}>How it works</a>
          <a href="#support" onClick={() => (window as any).toggleDrawer(false)}>Support</a>
          <a href="#legal" onClick={() => (window as any).toggleDrawer(false)}>Legal</a>
          <a href="#about" onClick={() => (window as any).toggleDrawer(false)}>About</a>
          <a href="#account" onClick={(e) => { e.preventDefault(); openAuth('signin'); (window as any).toggleDrawer(false);}}>Account</a>
        </div>
      </header>

      {children}
      
      <footer className="footer">
        <div className="container" style={{display:'flex',justifyContent:'space-between',gap:'12px',flexWrap:'wrap'}}>
          <div>© <span id="year"></span> ArchPlay PCs</div>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
            <a href="#docs">Docs</a>
            <a href="#support">Support</a>
            <a href="#legal">Legal</a>
            <a href="#" onClick={(e) => { e.preventDefault(); (window as any).toggleTheme();}}>Toggle theme</a>
          </div>
        </div>
      </footer>
      
      <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Tabs value={authTab} onValueChange={setAuthTab}>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold tracking-tight">
                  {authTab === 'signin' ? 'Welcome Back' : 'Create an Account'}
              </DialogTitle>
              <DialogDescription className="text-center">
                  {authTab === 'signin' ? "Sign in to access your account." : "Get started with your free trial."}
              </DialogDescription>
            </DialogHeader>
            <TabsList className="grid w-full grid-cols-2 mt-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            {authError && <div className="mt-4 text-center text-sm text-red-500 bg-red-500/10 p-2 rounded-md">{authError}</div>}
            <TabsContent value="signin" className="pt-4">
                <AuthForm mode="signin" />
            </TabsContent>
            <TabsContent value="signup" className="pt-4">
                <AuthForm mode="signup" />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );

    