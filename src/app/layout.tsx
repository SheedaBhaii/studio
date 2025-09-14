
'use client';
import Script from 'next/script';
import './globals.css';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // This effect runs once on component mount.

    // --- AUTH LOGIC ---
    const auth = (window as any).auth;
    const {
      GoogleAuthProvider,
      FacebookAuthProvider,
      OAuthProvider,
      signInWithPopup,
      sendSignInLinkToEmail,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      isSignInWithEmailLink,
      signInWithEmailLink,
    } = (window as any).firebase.auth;

    const modal = document.getElementById("authModal");
    const authAlert = document.getElementById("authAlert");

    function showAuthError(msg: string) {
      if(!authAlert) return;
      if (!msg) {
        authAlert.style.display = "none";
        authAlert.textContent = "";
        return;
      }
      authAlert.textContent = msg;
      authAlert.style.display = "block";
    }

    function handleAuthSuccess(user: any) {
      console.log("Signed in successfully:", user);
      showAuthError("");
      closeAuth();
      go('#/dashboard');
      alert(`Welcome, ${user.displayName || user.email}! You are now signed in.`);
      // Update UI
      const signInBtn = document.querySelector('.btn-ghost[onclick="openAuth(\'signin\')"]');
      const trialBtn = document.querySelector('.btn-primary[href="#/account"]');
      if (signInBtn) signInBtn.innerHTML = 'Account';
      if(trialBtn) trialBtn.innerHTML = 'Go to Dashboard';
      if(trialBtn) (trialBtn as HTMLAnchorElement).href = '#/dashboard';
    }

    function handleAuthError(error: any) {
        console.error("Firebase Auth Error:", error);
        switch (error.code) {
            case 'auth/account-exists-with-different-credential':
                showAuthError('An account already exists with this email using a different sign-in method. Please sign in with the original method to link them.');
                break;
            case 'auth/invalid-email':
                showAuthError('The email address is not valid.');
                break;
            case 'auth/user-not-found':
                showAuthError('No account found with this email. Please sign up first.');
                break;
            case 'auth/wrong-password':
                showAuthError('Incorrect password. Please try again.');
                break;
            case 'auth/email-already-in-use':
                showAuthError('This email is already in use by another account.');
                break;
            case 'auth/weak-password':
                showAuthError('The password is too weak. It must be at least 6 characters long.');
                break;
            case 'auth/popup-closed-by-user':
                showAuthError('Sign-in popup was closed. Please try again.');
                break;
            case 'auth/unauthorized-domain':
                 showAuthError('This domain is not authorized for authentication. Please contact support.');
                 break;
            default:
                showAuthError(`An unexpected error occurred: ${error.message}`);
                break;
        }
    }

    async function oauth(providerName: 'google' | 'microsoft' | 'facebook') {
      showAuthError("");
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
          showAuthError("Unknown provider.");
          return;
      }
      try {
        const result = await signInWithPopup(auth, provider);
        handleAuthSuccess(result.user);
      } catch (error) {
        handleAuthError(error);
      }
    }

    async function magicLink(mode: 'signin' | 'signup') {
      const emailEl = document.getElementById(mode === 'signup' ? 'emailSignUp' : 'emailSignIn') as HTMLInputElement;
      const email = emailEl?.value;

      if (!email || !/^[^@]+@[^@]+\\.[^@]+$/.test(email)) {
        return showAuthError("Enter a valid email to receive your magic link.");
      }

      const actionCodeSettings = {
        url: window.location.href.split('#')[0], // URL to redirect to after email verification
        handleCodeInApp: true,
      };

      showAuthError("");
      try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        alert(`A magic link has been sent to ${email}. Please check your inbox.`);
        closeAuth();
      } catch (error) {
        handleAuthError(error);
      }
    }

    async function password(mode: 'signin' | 'signup') {
      const emailEl = document.getElementById(mode === 'signup' ? 'emailSignUp' : 'emailSignIn') as HTMLInputElement;
      const passwordEl = document.getElementById(mode === 'signup' ? 'passwordSignUp' : 'passwordSignIn') as HTMLInputElement;
      const email = emailEl?.value;
      const pass = passwordEl?.value;

      if (!pass || pass.length < 6) {
        return showAuthError("Password must be at least 6 characters.");
      }
       if (!email || !/^[^@]+@[^@]+\\.[^@]+$/.test(email)) {
        return showAuthError("Please enter a valid email address.");
      }

      showAuthError("");
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
    }

    // Handle Magic Link sign-in on page load
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      if(email) {
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

    (window as any).oauth = oauth;
    (window as any).magicLink = magicLink;
    (window as any).password = password;

    // --- GENERAL UI LOGIC ---
    const routes = ["/", "/machines", "/machines/pro-studio-rx6800", "/pricing", "/how-it-works", "/account", "/dashboard", "/support", "/legal", "/about", "/docs"];
    function renderRoute() {
      const hash = window.location.hash.replace(/^#/, "") || "/";
      routes.forEach(r => {
        const el = document.getElementById("route-" + r);
        if (el) el.classList.toggle("active", r === hash);
      });
      // Basic title update
      if (hash === "/machines/pro-studio-rx6800") document.title = "Pro Studio RX6800 — ArchPlay PCs";
      else if (hash === "/pricing") document.title = "Pricing — ArchPlay PCs";
      else document.title = "ArchPlay PCs — High-Power PCs for Architects & Gamers";
    }
    window.addEventListener("hashchange", renderRoute);
    const go = (h: string) => { location.hash = h; }
    (window as any).go = go;

    const themeToggle = document.getElementById("themeToggle") as HTMLInputElement;
    function applyTheme(t: string){ document.documentElement.setAttribute("data-theme", t); if(themeToggle) themeToggle.checked = (t==="light"); }
    function toggleTheme(){ const curr = document.documentElement.getAttribute("data-theme"); const newTheme = curr==="dark"?"light":"dark"; applyTheme(newTheme); localStorage.setItem("theme", newTheme); }
    if (themeToggle) themeToggle.addEventListener("change", toggleTheme);
    const savedTheme = localStorage.getItem("theme"); if (savedTheme) applyTheme(savedTheme);
    (window as any).toggleTheme = toggleTheme;

    function toggleDrawer(force?: boolean) {
      const d = document.getElementById("drawer");
      if(!d) return;
      if (typeof force === "boolean"){ d.classList.toggle("open", force); return; }
      d.classList.toggle("open");
    }
    (window as any).toggleDrawer = toggleDrawer;

    let progress = 0;
    const animInterval = setInterval(() => {
      progress = (progress + 2) % 100;
      const els = {
        renderFill: document.getElementById("renderFill"),
        gpuFill: document.getElementById("gpuFill"),
        netFill: document.getElementById("netFill"),
        dashGpu: document.getElementById("dashGpu"),
        dashRtt: document.getElementById("dashRtt"),
        dashVram: document.getElementById("dashVram"),
      };
      if (els.renderFill) els.renderFill.style.width = progress + "%";
      if (els.gpuFill) els.gpuFill.style.width = (40 + (progress % 40)) + "%";
      if (els.netFill) els.netFill.style.width = (20 + (progress % 60)) + "%";
      if (els.dashGpu) els.dashGpu.style.width = (20 + (progress % 60)) + "%";
      if (els.dashRtt) els.dashRtt.style.width = (10 + (progress % 30)) + "%";
      if (els.dashVram) els.dashVram.style.width = (15 + (progress % 45)) + "%";
    }, 120);

    function openAuth(tab: string){ if(modal) { modal.style.display="flex"; setAuthTab(tab||'signin'); setTimeout(()=>document.getElementById(tab==='signup'?'emailSignUp':'emailSignIn')?.focus(), 50); }}
    function closeAuth(){ if(modal) { modal.style.display="none"; showAuthError(""); }}
    function setAuthTab(tab: string){
      const t1=document.getElementById('tab-signin'), t2=document.getElementById('tab-signup');
      const p1=document.getElementById('panel-signin'), p2=document.getElementById('panel-signup');
      if(!t1 || !t2 || !p1 || !p2) return;
      const isUp = tab==='signup';
      t1.setAttribute('aria-selected', (!isUp).toString());
      t2.setAttribute('aria-selected', (isUp).toString());
      p1.style.display = isUp ? "none" : "block";
      p2.style.display = isUp ? "block" : "none";
    }
    (window as any).openAuth = openAuth;
    (window as any).closeAuth = closeAuth;
    (window as any).setAuthTab = setAuthTab;

    window.addEventListener("keydown", (e)=>{ if(e.key==="Escape" && modal && modal.style.display==="flex") closeAuth(); });

    const yearEl = document.getElementById("year");
    if(yearEl) yearEl.textContent = new Date().getFullYear().toString();

    renderRoute(); // Initial render

    return () => {
      // Cleanup on component unmount
      window.removeEventListener("hashchange", renderRoute);
      if (themeToggle) themeToggle.removeEventListener("change", toggleTheme);
      clearInterval(animInterval);
      // Remove other listeners if any
    };

  }, []);

  return (
    <html lang="en" data-theme="dark">
      <head>
        <title>ArchPlay PCs — High-Power PCs for Architects & Gamers</title>
        <meta name="description" content="Render faster. Game smoother. Rent high-performance PCs by the hour — remote or on-site. Secure sign-in with Google, Microsoft, Facebook, or Email." />
        <meta name="theme-color" content="#0b1220" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet" />
        <meta property="og:title" content="ArchPlay PCs — High-Power PCs for Architects & Gamers" />
        <meta property="og:description" content="Remote & local high-performance PC access — for architects & gamers. Book by the hour, sync files, and launch low-latency sessions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://archplay.example.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <Script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js" strategy="beforeInteractive" />
        <Script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js" strategy="beforeInteractive" />
      </head>
      <body>
        <header className="site">
            <div className="container nav" role="navigation" aria-label="Primary">
              <a href="#/" className="brand">
                <div className="logo" aria-hidden="true"><span>AP</span></div>
                <span>ArchPlay PCs</span>
              </a>
              <nav className="navlinks" aria-label="Main links">
                <a href="#/machines">Machines</a>
                <a href="#/pricing">Pricing</a>
                <a href="#/how-it-works">How it works</a>
                <a href="#/support">Support</a>
                <a href="#/legal">Legal</a>
                <a href="#/about">About</a>
              </nav>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <label className="switch" title="Toggle light/dark">
                  <input id="themeToggle" type="checkbox" aria-label="Toggle theme" />
                  <span className="muted" aria-hidden="true">Theme</span>
                </label>
                <button className="btn btn-ghost" onClick={() => (window as any).openAuth('signin')}>Sign in</button>
                <a className="btn btn-primary" href="#/account" onClick={(e) => { e.preventDefault(); (window as any).openAuth('signup'); }}>Start Free Trial</a>
                <button className="btn btn-muted mobile-nav-btn" aria-label="Open menu" onClick={() => (window as any).toggleDrawer()}>☰</button>
              </div>
            </div>
            <div id="drawer" className="drawer" role="navigation" aria-label="Mobile menu">
              <a href="#/" onClick={() => (window as any).toggleDrawer(false)}>Home</a>
              <a href="#/machines" onClick={() => (window as any).toggleDrawer(false)}>Machines</a>
              <a href="#/pricing" onClick={() => (window as any).toggleDrawer(false)}>Pricing</a>
              <a href="#/how-it-works" onClick={() => (window as any).toggleDrawer(false)}>How it works</a>
              <a href="#/support" onClick={() => (window as any).toggleDrawer(false)}>Support</a>
              <a href="#/legal" onClick={() => (window as any).toggleDrawer(false)}>Legal</a>
              <a href="#/about" onClick={() => (window as any).toggleDrawer(false)}>About</a>
              <a href="#/account" onClick={(e) => { e.preventDefault(); (window as any).openAuth('signin'); (window as any).toggleDrawer(false);}}>Account</a>
            </div>
        </header>

        {children}

        <footer className="footer">
            <div className="container" style={{display:'flex',justifyContent:'space-between',gap:'12px',flexWrap:'wrap'}}>
              <div>© <span id="year"></span> ArchPlay PCs</div>
              <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                <a href="#/docs">Docs</a>
                <a href="#/support">Support</a>
                <a href="#/legal">Legal</a>
                <a href="#" onClick={(e) => { e.preventDefault(); (window as any).toggleTheme();}}>Toggle theme</a>
              </div>
            </div>
        </footer>

        <div id="authModal" className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <div className="modal">
              <header>
                <strong id="auth-title">Sign in / Sign up</strong>
                <button className="btn btn-ghost" onClick={() => (window as any).closeAuth()} aria-label="Close">✕</button>
              </header>
              <div className="modal-body">
                <div className="tabs" role="tablist" aria-label="Auth tabs">
                  <button className="tab" id="tab-signin" role="tab" aria-selected="true" aria-controls="panel-signin" onClick={() => (window as any).setAuthTab('signin')}>Sign in</button>
                  <button className="tab" id="tab-signup" role="tab" aria-selected="false" aria-controls="panel-signup" onClick={() => (window as any).setAuthTab('signup')}>Sign up</button>
                </div>

                <div id="authAlert" className="alert alert-danger" style={{display:'none'}}></div>

                <section id="panel-signin" role="tabpanel" aria-labelledby="tab-signin">
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

                <section id="panel-signup" role="tabpanel" aria-labelledby="tab-signup" style={{display:'none'}}>
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
                  To sign in, ensure you've enabled these providers in your Firebase Authentication console and added `localhost` to the authorized domains.
                </div>
              </div>
            </div>
        </div>

        <Script id="firebase-config" strategy="beforeInteractive">
          {`
            const firebaseConfig = {
              "projectId": "studio-9915448084-db4ad",
              "appId": "1:533046792478:web:48396561584c76c4d5390f",
              "storageBucket": "studio-9915448084-db4ad.firebasestorage.app",
              "apiKey": "AIzaSyAAaYKgt3KZWoobCVLjPLQi8w6SvFqzsX0",
              "authDomain": "studio-9915448084-db4ad.firebaseapp.com",
              "measurementId": "",
              "messagingSenderId": "533046792478"
            };
            if (typeof window !== 'undefined' && !window.firebase?.apps?.length) {
              window.firebase.initializeApp(firebaseConfig);
              window.auth = window.firebase.auth();
            }
          `}
        </Script>
      </body>
    </html>
  );
}
