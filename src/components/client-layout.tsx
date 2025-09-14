
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


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('signin');
  const [authError, setAuthError] = useState('');
  const { toast } = useToast();

  const openAuth = (tab: 'signin' | 'signup') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
    setAuthError('');
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

    const magicLink = async (mode: 'signin' | 'signup') => {
      const emailEl = document.getElementById(mode === 'signup' ? 'emailSignUp' : 'emailSignIn') as HTMLInputElement;
      const email = emailEl?.value;

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setAuthError("Enter a valid email to receive your magic link.");
        return;
      }
      
      const actionCodeSettings = {
        url: window.location.href.split('#')[0],
        handleCodeInApp: true,
      };

      setAuthError("");
      try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        toast({
            title: 'Magic Link Sent!',
            description: `A magic link has been sent to ${email}. Please check your inbox.`,
        });
        closeAuth();
      } catch (error) {
        handleAuthError(error);
      }
    };

    const password = async (mode: 'signin' | 'signup') => {
      const emailEl = document.getElementById(mode === 'signup' ? 'emailSignUp' : 'emailSignIn') as HTMLInputElement;
      const passwordEl = document.getElementById(mode === 'signup' ? 'passwordSignUp' : 'passwordSignIn') as HTMLInputElement;
      const email = emailEl?.value;
      const pass = passwordEl?.value;

      if (!pass || pass.length < 6) {
        setAuthError("Password must be at least 6 characters.");
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setAuthError("Please enter a valid email address.");
        return;
      }

      setAuthError("");
      try {
        let userCredential;
        if (mode === 'signup') {
          userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        } else {
          userCredential = await signInWithEmailAndPassword(auth, email, pass);
        }
        handleAuthSuccess(userCredential.user);
      } catch(error) {
        handleAuthError(error);
      }
    };

    (window as any).oauth = oauth;
    (window as any).magicLink = magicLink;
    (window as any).password = password;

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            window.localStorage.removeItem('emailForSignIn');
            handleAuthSuccess(result.user);
          })
          .catch((error) => {
            handleAuthError(error);
          });
      }
    }
  }, [toast]);


  useEffect(() => {
    // --- GENERAL UI LOGIC ---
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

    const gpuStatsEl = document.getElementById('gpu-stats');
    const latencyStatsEl = document.getElementById('latency-stats');
    let tempCounter = 0;
    let currentTemp = 62;
    const updateStats = () => {
      const gpu = Math.floor(Math.random() * (95 - 60 + 1) + 60);
      const latency = Math.floor(Math.random() * (19 - 5 + 1)) + 5;
      
      if (latencyStatsEl) {
        latencyStatsEl.textContent = `Remote session connected — ${latency} ms`;
      }

      if (gpuStatsEl) {
        tempCounter++;
        if (tempCounter > 4) { // Update temp every 4 intervals (8.4 seconds)
            currentTemp = Math.floor(Math.random() * (70 - 58 + 1) + 58);
            tempCounter = 0;
        }
        gpuStatsEl.textContent = `GPU ${gpu}% • ${currentTemp}°C`;
      }
    };

    const statsInterval = setInterval(updateStats, 2100);

    return () => {
      // Cleanup on component unmount
      if (themeToggle) themeToggle.removeEventListener("change", toggleTheme);
       clearInterval(statsInterval);
    };

  }, []);

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

       {authModalOpen && (
        <div id="authModal" className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-title" style={{display: 'flex'}} onKeyDown={(e) => e.key === 'Escape' && closeAuth()}>
            <div className="modal">
              <header>
                <strong id="auth-title">Sign in / Sign up</strong>
                <button className="btn btn-ghost" onClick={closeAuth} aria-label="Close">✕</button>
              </header>
              <div className="modal-body">
                <div className="tabs" role="tablist" aria-label="Auth tabs">
                  <button className="tab" id="tab-signin" role="tab" aria-selected={authTab === 'signin'} aria-controls="panel-signin" onClick={() => setAuthTab('signin')}>Sign in</button>
                  <button className="tab" id="tab-signup" role="tab" aria-selected={authTab === 'signup'} aria-controls="panel-signup" onClick={() => setAuthTab('signup')}>Sign up</button>
                </div>

                {authError && <div id="authAlert" className="alert alert-danger">{authError}</div>}

                <section id="panel-signin" role="tabpanel" aria-labelledby="tab-signin" style={{display: authTab === 'signin' ? 'block' : 'none' }}>
                  <div className="provider" onClick={() => (window as any).oauth('google')}>🔵 Continue with Google</div>
                  <div className="provider" onClick={() => (window as any).oauth('microsoft')}>🟦 Continue with Microsoft</div>
                  <div className="provider" onClick={() => (window as any).oauth('facebook')}>🔷 Continue with Facebook</div>
                  <div style={{display:'grid',gap:'8px',marginTop:'6px'}}>
                    <label>Email for magic link<input id="emailSignIn" type="email" placeholder="you@domain.com" /></label>
                    <button className="btn btn-primary" onClick={() => (window as any).magicLink('signin')}>Send magic link</button>
                    <details>
                      <summary className="muted">Or password</summary>
                      <label>Password<input id="passwordSignIn" type="password" /></label>
                      <button className="btn btn-ghost" onClick={() => (window as any).password('signin')}>Sign in</button>
                    </details>
                    <p className="note">We only request basic profile & email for login.</p>
                  </div>
                </section>

                <section id="panel-signup" role="tabpanel" aria-labelledby="tab-signup" style={{display: authTab === 'signup' ? 'block' : 'none' }}>
                  <div className="provider" onClick={() => (window as any).oauth('google')}>🔵 Continue with Google</div>
                  <div className="provider" onClick={() => (window as any).oauth('microsoft')}>🟦 Continue with Microsoft</div>
                  <div className="provider" onClick={() => (window as any).oauth('facebook')}>🔷 Continue with Facebook</div>
                  <div style={{display:'grid',gap:'8px',marginTop:'6px'}}>
                    <label>Email for magic link<input id="emailSignUp" type="email" placeholder="you@school.edu" /></label>
                    <button className="btn btn-primary" onClick={() => (window as any).magicLink('signup')}>Send magic link</button>
                    <details>
                      <summary className="muted">Create password</summary>
                      <label>Password<input id="passwordSignUp" type="password" /></label>
                      <button className="btn btn-ghost" onClick={() => (window as any).password('signup')}>Create account</button>
                    </details>
                    <p className="note">Duplicate email? We’ll help you link Google/Microsoft/Facebook and Email to one account.</p>
                  </div>
                </section>

                <div className="alert alert-info">
                  To sign in, ensure you've enabled these providers in your Firebase Authentication console and added your domain to the authorized domains.
                </div>
              </div>
            </div>
        </div>
      )}
    </>
  );
}
