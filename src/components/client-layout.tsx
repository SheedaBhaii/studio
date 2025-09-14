
'use client';

import { useEffect, useState } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {

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
            <a href="#about">About</a>
          </nav>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <label className="switch" title="Toggle light/dark">
              <input id="themeToggle" type="checkbox" aria-label="Toggle theme" />
              <span className="muted" aria-hidden="true">Theme</span>
            </label>
            <a className="btn btn-primary" href="#pricing">Get Started</a>
            <button className="btn btn-muted mobile-nav-btn" aria-label="Open menu" onClick={() => (window as any).toggleDrawer()}>☰</button>
          </div>
        </div>
        <div id="drawer" className="drawer" role="navigation" aria-label="Mobile menu">
          <a href="#home" onClick={() => (window as any).toggleDrawer(false)}>Home</a>
          <a href="#machines" onClick={() => (window as any).toggleDrawer(false)}>Machines</a>
          <a href="#pricing" onClick={() => (window as any).toggleDrawer(false)}>Pricing</a>
          <a href="#how-it-works" onClick={() => (window as any).toggleDrawer(false)}>How it works</a>
          <a href="#support" onClick={() => (window as any).toggleDrawer(false)}>Support</a>
          <a href="#about" onClick={() => (window as any).toggleDrawer(false)}>About</a>
        </div>
      </header>

      {children}
      
      <footer className="footer">
        <div className="container" style={{display:'flex',justifyContent:'space-between',gap:'12px',flexWrap:'wrap'}}>
          <div>© <span id="year"></span> ArchPlay PCs</div>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
            <a href="#docs">Docs</a>
            <a href="#support">Support</a>
            <a href="#" onClick={(e) => { e.preventDefault(); (window as any).toggleTheme();}}>Toggle theme</a>
          </div>
        </div>
      </footer>
    </>
  );
}
