
'use client';

import React, { useState, useActionState, useRef } from 'react';
import { getPCRecommendation, submitContactForm, type RecommendPCConfigurationOutput } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// --- PC Recommendation Component ---
function PCRecommendation() {
  const [state, formAction, pending] = useActionState(getPCRecommendation, null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName('');
    }
  };
  
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = fileInputRef.current?.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64 = loadEvent.target?.result as string;
        formData.append('photoDataUri', base64);
        formAction(formData);
      };
      reader.readAsDataURL(file);
    } else {
      formAction(formData);
    }
  };


  return (
    <Card className="card card-pad">
      <CardHeader>
        <CardTitle>Get a PC Recommendation with Gemini</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="muted mb-4">Describe the software you use and the games you play. For a more tailored recommendation, you can also upload a photo of your current setup or a piece of software.</p>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Label htmlFor="softwareRequirements">What software do you primarily use? (e.g., Revit, Blender, AutoCAD)</Label>
            <Textarea
              id="softwareRequirements"
              name="softwareRequirements"
              placeholder="e.g., I mostly use Revit for architectural designs and occasionally Blender for 3D modeling..."
              required
            />
            {state?.errors?.softwareRequirements && <p className="text-red-500 text-sm mt-1">{state.errors.softwareRequirements}</p>}
          </div>
          <div>
            <Label htmlFor="gameRequirements">What games do you want to play? (e.g., Cyberpunk 2077, Valorant)</Label>
            <Textarea
              id="gameRequirements"
              name="gameRequirements"
              placeholder="e.g., I'd like to play new AAA titles like Cyberpunk 2077 at high settings, and also competitive games like Valorant."
              required
            />
            {state?.errors?.gameRequirements && <p className="text-red-500 text-sm mt-1">{state.errors.gameRequirements}</p>}
          </div>
           <div>
            <Label htmlFor="photo">Upload a Photo (optional)</Label>
            <Input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              Choose File
            </Button>
            {fileName && <span className="ml-2 text-sm text-muted-foreground">{fileName}</span>}
          </div>
          <Button type="submit" disabled={pending} className="btn btn-primary">
            {pending ? 'Getting Recommendation...' : 'Get Recommendation'}
          </Button>
        </form>

        {state?.message === 'success' && state.recommendation && (
          <div className="mt-6 p-4 border rounded-lg bg-background">
            <h3 className="font-bold text-lg mb-2">Here is your recommended PC Configuration:</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <p><strong>GPU:</strong> {state.recommendation.recommendedGPU}</p>
              <p><strong>CPU:</strong> {state.recommendation.recommendedCPU}</p>
              <p><strong>RAM:</strong> {state.recommendation.recommendedRAM}</p>
              <p><strong>Storage:</strong> {state.recommendation.recommendedStorage}</p>
              <p><strong>Monitor:</strong> {state.recommendation.recommendedMonitor}</p>
            </div>
            <p className="mt-4"><strong>Justification:</strong> {state.recommendation.justification}</p>
          </div>
        )}
        {state?.message && state.message !== 'success' && (
          <div className="mt-4 text-red-500">{state.message}</div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Contact Form Component ---
function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, null);

  return (
    <div className="card card-pad" style={{ marginTop: '16px' }}>
      <h3>Contact us</h3>
      {state?.message && !state.errors && (
         <div className={`mt-2 text-sm ${state.errors ? 'text-red-500' : 'text-green-500'}`}>{state.message}</div>
      )}

      <form action={formAction} className="space-y-4 mt-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
          {state?.errors?.name && <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
          {state?.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={4} required />
          {state?.errors?.message && <p className="text-red-500 text-sm mt-1">{state.errors.message}</p>}
        </div>
        <Button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  );
}


export default function Home() {
  return (
    <main className="container">
      <section id="route-/" className="route active" role="region" aria-labelledby="home-title">
        <div className="hero">
          <div className="hero-inner">
            <div>
              <div className="badge">Friendly, professional, performance-first</div>
              <h1 id="home-title" className="headline">High-Power PCs for Architects & Gamers — Rent by the Hour</h1>
              <p className="subhead">Render, simulate, or game on a powerful machine from anywhere — no hardware upgrade required.</p>
              <div className="cta-row">
                <a className="btn btn-primary" href="#/machines">Book a Machine</a>
                <a className="btn btn-accent" href="#/pricing">See Pricing</a>
                <button className="btn btn-ghost" onClick={() => (window as any).openAuth('signup')}>Start Free Trial</button>
              </div>
              <div className="valprops">
                <div className="card card-pad">
                  <div className="kpi">Low-latency streaming</div>
                  <p className="muted">Parsec / Moonlight / WebRTC in-browser. Smooth input & 180Hz-ready.</p>
                </div>
                <div className="card card-pad">
                  <div className="kpi">CAD & render ready</div>
                  <p className="muted">Revit, AutoCAD, 3ds Max, Rhino, Blender, V-Ray, Lumion — preinstalled options.</p>
                </div>
                <div className="card card-pad">
                  <div className="kpi">Secure sign-in</div>
                  <p className="muted">Google, Microsoft, Facebook, or Email (magic link). Account linking supported.</p>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="monitor" aria-label="Remote desktop preview">
                <div className="monitor-screen">
                  <div className="screen-ui">
                    <div className="status-bar">
                      <span className="status-dot" aria-hidden="true"></span>
                      <span className="muted">Remote session connected — 8 ms</span>
                    </div>
                    <div className="window" role="img" aria-label="Animated render progress">
                      <div style={{padding:'12px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span>V-Ray Render — Scene: atrium_v3.max</span>
                        <span className="chip">GPU 72% • 62°C</span>
                      </div>
                      <div style={{padding:'12px',display:'grid',gap:'12px'}}>
                        <div className="render-bar" aria-hidden="true"><div id="renderFill" className="render-fill"></div></div>
                        <div className="bar"><span id="gpuFill" style={{width:'60%'}}></span></div>
                        <div className="bar"><span id="netFill" style={{width:'40%',background:'linear-gradient(90deg,#60a5fa,#3b82f6)'}}></span></div>
                        <div className="note">Subtle motion preview. Actual sessions stream at native framerate.</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{textAlign:'center',color:'var(--muted)',marginTop:'8px',fontSize:'12px'}}>Remote & local high-performance PC access — for architects & gamers.</div>
              </div>
            </div>
          </div>
        </div>

        <section className="how">
          <h2 className="section-title">How it works — 3 steps</h2>
          <div className="grid-3">
            <div className="card card-pad">
              <div className="kpi">1. Choose a machine or plan</div>
              <p className="muted">Pick hourly, daily, or subscription access with priority tiers.</p>
            </div>
            <div className="card card-pad">
              <div className="kpi">2. Upload files or launch streaming</div>
              <p className="muted">Architects: sync via Google Drive/OneDrive/WebDAV/SFTP. Gamers: Parsec/Moonlight/WebRTC.</p>
            </div>
            <div className="card card-pad">
              <div className="kpi">3. Pay per hour and download results</div>
              <p className="muted">Stripe or PayPal. Auto-invoices, usage meter, and file downloads.</p>
            </div>
          </div>
        </section>
        
        <section className="my-8">
           <PCRecommendation />
        </section>

        <section>
          <h2 className="section-title">Feature highlights</h2>
          <div className="grid-2">
            <div className="card card-pad">
              <h3>Software support</h3>
              <p className="muted">Revit, AutoCAD, 3ds Max, Rhino, Blender, V-Ray, Lumion, Steam — optional installs per machine.</p>
            </div>
            <div className="card card-pad">
              <h3>Low latency streaming</h3>
              <p className="muted">Sub-20 ms targets via Parsec/Moonlight. WebRTC in-browser streaming (experimental).</p>
            </div>
            <div className="card card-pad">
              <h3>Secure auth</h3>
              <p className="muted">Google, Microsoft, Facebook, and Email magic link. Strict session cookies & state/nonce.</p>
            </div>
            <div className="card card-pad">
              <h3>File sync</h3>
              <p className="muted">Drag-and-drop uploads, S3-backed storage, persistent personal space (paid add-on).</p>
            </div>
          </div>
        </section>

        <section className="pricing">
          <h2 className="section-title">Pricing tiers</h2>
          <div className="grid-3">
            <div className="card card-pad">
              <h3>Standard</h3>
              <div className="price">$4/hr</div>
              <p className="muted">Priority: Standard • Queue ETA</p>
              <button className="btn btn-primary" onClick={() => (window as any).go('#/pricing')}>Choose</button>
            </div>
            <div className="card card-pad">
              <h3>Student</h3>
              <div className="price">$3/hr</div>
              <p className="muted">Verify university email for discount</p>
              <button className="btn btn-primary" onClick={() => (window as any).go('#/pricing')}>Choose</button>
            </div>
            <div className="card card-pad">
              <h3>Pro</h3>
              <div className="price">$6/hr</div>
              <p className="muted">Priority: High • Shorter queues</p>
              <button className="btn btn-primary" onClick={() => (window as any).go('#/pricing')}>Choose</button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="section-title">Machine spotlight</h2>
          <div className="grid-2">
            <div className="card card-pad">
              <h3>Pro Studio RX6800</h3>
              <p className="muted">Ideal for GPU accelerated renders, 3D modelling, and high-refresh gaming.</p>
              <div className="machine-specs">
                <div className="spec-k">CPU</div><div>AMD Ryzen 5 5600</div>
                <div className="spec-k">GPU</div><div>Biostar Extreme Gaming RX 6800 16GB</div>
                <div className="spec-k">RAM</div><div>16GB DDR4 3200 MHz</div>
                <div className="spec-k">Storage</div><div>256GB NVMe + 256GB SSD + 4TB external</div>
                <div className="spec-k">Display</div><div>Ease G24i18 1080p 180Hz</div>
              </div>
              <div style={{display:'flex',gap:'8px',marginTop:'12px',flexWrap:'wrap'}}>
                <span className="chip">Hourly $5</span>
                <span className="chip">Half-day $25</span>
                <span className="chip">Day $35</span>
                <span className="chip">Week $149</span>
                <span className="chip">Student -20%</span>
              </div>
              <div style={{marginTop:'12px'}} className="note">“Rent the ‘Pro Studio RX6800’ — ideal for high-res renders, GPU-accelerated ray tracing, and 3D viewport performance. Perfect for architecture renders & high-refresh gaming.”</div>
              <div className="cta-row" style={{marginTop:'12px'}}>
                <a className="btn btn-primary" href="#/machines">See machine</a>
                <button className="btn btn-ghost" onClick={() => (window as any).openAuth('signup')}>Reserve</button>
              </div>
            </div>
            <div className="card card-pad">
              <h3>Testimonials</h3>
              <p>“Rendered a 4K walkthrough in hours, not days.” — A. Patel, Arch Student</p>
              <p>“Low latency was good enough for competitive shooters.” — L. Chen, Gamer</p>
              <p>“Our team shared a render queue during a deadline.” — C. Romero, Studio Lead</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="section-title">FAQ</h2>
          <div className="grid-2">
            <div className="card card-pad">
              <strong>Software licensing</strong>
              <p className="muted">We provide optional installers; bring your own license where required. We don’t resell vendor licenses.</p>
            </div>
            <div className="card card-pad">
              <strong>Refunds</strong>
              <p className="muted">Unused time is refundable; interrupted sessions are credited. See Refund Policy.</p>
            </div>
            <div className="card card-pad">
              <strong>Student verification</strong>
              <p className="muted">Verify with a university email to unlock student pricing.</p>
            </div>
            <div className="card card-pad">
              <strong>Latency & streaming</strong>
              <p className="muted">Choose Parsec/Moonlight for best performance; WebRTC is available for browser-only access.</p>
            </div>
            <div className="card card-pad">
              <strong>File security</strong>
              <p className="muted">S3 encrypted at rest, TLS in transit. Optional ephemeral sessions wipe storage after end.</p>
            </div>
          </div>
        </section>
        <div style={{margin:'20px 0'}}>
          <button className="btn btn-accent" onClick={() => (window as any).openAuth('signup')}>Start Free Trial</button>
        </div>
      </section>

      <section id="route-/machines" className="route" aria-labelledby="machines-title">
        <h1 id="machines-title" className="section-title">Machines</h1>
        <div className="grid-3">
          <div className="card card-pad">
            <div className="badge">Sample • Pro Studio Machine</div>
            <h3>Pro Studio RX6800</h3>
            <p className="muted">Ryzen 5 5600 • RX 6800 16GB • 16GB RAM</p>
            <div className="machine-specs" style={{marginTop:'8px'}}>
              <div className="spec-k">Motherboard</div><div>Gigabyte B450M DS3H</div>
              <div className="spec-k">Storage</div><div>256GB NVMe + 256GB SATA + 4TB external</div>
              <div className="spec-k">OS</div><div>Windows 11 Pro</div>
              <div className="spec-k">Software</div><div>Revit, AutoCAD, 3ds Max, Rhino, Blender, V-Ray, Lumion, Steam</div>
            </div>
            <div style={{marginTop:'10px',display:'flex',gap:'8px',flexWrap:'wrap'}}>
              <span className="chip">$5/hr</span>
              <span className="chip">$25/half-day</span>
              <span className="chip">$35/day</span>
              <span className="chip">$149/week</span>
            </div>
            <div className="cta-row" style={{marginTop:'12px'}}>
              <a className="btn btn-primary" href="#/machines/pro-studio-rx6800">Details</a>
              <button className="btn btn-ghost" onClick={() => (window as any).openAuth('signup')}>Book</button>
            </div>
          </div>

          <div className="card card-pad">
            <h3>Render Pro A5000</h3>
            <p className="muted">Xeon W • RTX A5000 24GB • 64GB RAM</p>
            <div className="machine-specs">
              <div className="spec-k">OS</div><div>Windows 11 / Ubuntu</div>
              <div className="spec-k">Software</div><div>V-Ray, Arnold, Blender, Unreal</div>
            </div>
            <div style={{marginTop:'10px',display:'flex',gap:'8px',flexWrap:'wrap'}}>
              <span className="chip">$12/hr</span><span className="chip">$79/day</span>
            </div>
            <div className="cta-row" style={{marginTop:'12px'}}>
              <button className="btn btn-primary" onClick={() => (window as any).openAuth('signup')}>Reserve</button>
              <button className="btn btn-ghost" onClick={() => alert('Demo only')}>Details</button>
            </div>
          </div>

          <div className="card card-pad">
            <h3>eSports 3080 Ti</h3>
            <p className="muted">Ryzen 7 • RTX 3080 Ti • 32GB RAM • 240Hz</p>
            <div className="machine-specs">
              <div className="spec-k">OS</div><div>Windows 11</div>
              <div className="spec-k">Streaming</div><div>Parsec, Moonlight, WebRTC</div>
            </div>
            <div style={{marginTop:'10px',display:'flex',gap:'8px',flexWrap:'wrap'}}>
              <span className="chip">$8/hr</span><span className="chip">$55/day</span>
            </div>
            <div className="cta-row" style={{marginTop:'12px'}}>
              <button className="btn btn-primary" onClick={() => (window as any).openAuth('signup')}>Reserve</button>
              <button className="btn btn-ghost" onClick={() => alert('Demo only')}>Details</button>
            </div>
          </div>
        </div>

        <div className="card card-pad" style={{marginTop:'16px'}}>
          <h2>Live availability</h2>
          <p className="muted">Book by the hour or day. Priority queue shows ETA.</p>
          <table aria-label="Machine availability">
            <thead><tr><th>Machine</th><th>Status</th><th>Next available</th><th>Book</th></tr></thead>
            <tbody>
              <tr>
                <td>Pro Studio RX6800</td>
                <td>Available</td>
                <td>Now</td>
                <td><button className="btn btn-primary" onClick={() => (window as any).openAuth('signup')}>Book</button></td>
              </tr>
              <tr>
                <td>Render Pro A5000</td>
                <td>In session</td>
                <td>0:42</td>
                <td><button className="btn btn-ghost" onClick={() => (window as any).openAuth('signup')}>Queue</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="route-/machines/pro-studio-rx6800" className="route" aria-labelledby="machine-detail-title">
        <div className="badge">Sample • Pro Studio Machine</div>
        <h1 id="machine-detail-title" className="section-title">Pro Studio RX6800</h1>
        <div className="grid-2">
          <div className="card card-pad">
            <h3>Specs</h3>
            <ul>
              <li>Motherboard: Gigabyte B450M DS3H</li>
              <li>CPU: AMD Ryzen 5 5600</li>
              <li>GPU: Biostar Extreme Gaming RX 6800 16GB</li>
              <li>RAM: 1 × 16GB DDR4 3200MHz</li>
              <li>Storage: 256GB Lexar NM610 NVMe (OS), 256GB KingSpec SATA SSD (scratch), 4TB Transcend StoreJet external (archive)</li>
              <li>PSU: 1stPlayer ACK 750W 80+ Silver</li>
              <li>Case: 1stPlayer UView6</li>
              <li>Peripherals: Razer Mamba Elite, Anivia SG62 Mechanical Keyboard, Razer Kraken TE</li>
              <li>Display: Ease G24i18 1080p 180Hz</li>
            </ul>
            <div style={{marginTop:'8px'}}>
              <div className="chip">Windows 11 Pro</div>
              <div className="chip">Parsec | Moonlight | WebRTC</div>
            </div>
          </div>
          <div className="card card-pad">
            <h3>Live benchmarks</h3>
            <p className="muted">Synthetic and app-based. Demo values:</p>
            <table>
              <tbody>
                <tr><td>Blender GPU (OptiX/Metal-like)</td><td>2500 spp/min</td></tr>
                <tr><td>Unigine Superposition 1080p Extreme</td><td>10,200</td></tr>
                <tr><td>V-Ray GPU RTX</td><td>1,150 ksamples</td></tr>
              </tbody>
            </table>
            <div className="note">Session telemetry available in dashboard.</div>
          </div>
        </div>
        <div className="grid-3" style={{marginTop:'16px'}}>
          <div className="card card-pad">
            <h3>Pricing</h3>
            <p><strong>$5</strong>/hr • $25/half-day • $35/day • $149/week</p>
            <p className="muted">Students: 20% off (verify with .edu or institution email)</p>
            <button className="btn btn-primary" onClick={() => (window as any).openAuth('signup')}>Reserve now</button>
          </div>
          <div className="card card-pad">
            <h3>Software</h3>
            <ul>
              <li>Revit, AutoCAD, 3ds Max, Rhino, Blender</li>
              <li>V-Ray, Lumion</li>
              <li>Steam + game launchers</li>
            </ul>
          </div>
          <div className="card card-pad">
            <h3>Connection options</h3>
            <ul>
              <li>Parsec (recommended)</li>
              <li>Moonlight (NVIDIA hosts) or Sunshine-compatible</li>
              <li>WebRTC in-browser (experimental)</li>
              <li>Steam Remote Play</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="route-/pricing" className="route" aria-labelledby="pricing-title">
        <h1 id="pricing-title" className="section-title">Pricing</h1>
        <div className="grid-3">
          <div className="card card-pad">
            <h3>Hourly</h3>
            <p className="muted">Pay-as-you-go, billed to the minute.</p>
            <ul>
              <li>Standard: from $4/hr</li>
              <li>Pro Studio RX6800: $5/hr</li>
              <li>Pro tier priority +$1/hr</li>
            </ul>
          </div>
          <div className="card card-pad">
            <h3>Daily / Weekly</h3>
            <ul>
              <li>Pro Studio RX6800: $35/day or $149/week</li>
              <li>Bulk day packs (save 10%)</li>
            </ul>
          </div>
          <div className="card card-pad">
            <h3>Subscriptions</h3>
            <ul>
              <li>Student: $49/mo includes 20 hours</li>
              <li>Pro: $129/mo includes 40 hours</li>
              <li>Team: custom</li>
            </ul>
          </div>
        </div>
        <div className="card card-pad" style={{marginTop:'16px'}}>
          <h3>Discounts</h3>
          <p>Students: -20% with university email. Teams: volume pricing and shared render queue.</p>
          <button className="btn btn-primary" onClick={() => (window as any).openAuth('signup')}>Get student pricing</button>
        </div>
      </section>

      <section id="route-/how-it-works" className="route" aria-labelledby="hiw-title">
        <h1 id="hiw-title" className="section-title">How it works</h1>
        <div className="grid-2">
          <div className="card card-pad">
            <h2>Architects & 3D</h2>
            <ol>
              <li>Upload/sync files via Google Drive, OneDrive, WebDAV, or SFTP</li>
              <li>Select software: Revit, AutoCAD, 3ds Max, Rhino, Blender, V-Ray, Lumion</li>
              <li>Launch interactive session or queue a background render</li>
              <li>Download results; optionally persist workspace</li>
            </ol>
            <p className="note">License handling: BYOL. We only request basic profile & email for login.</p>
          </div>
          <div className="card card-pad">
            <h2>Gamers</h2>
            <ol>
              <li>Pick low-latency streaming: Parsec / Moonlight / WebRTC</li>
              <li>Auto input mapping, controller & keyboard support</li>
              <li>Choose 1080p/1440p; 60–180 Hz targets</li>
              <li>Start/stop sessions anytime; billed per minute</li>
            </ol>
            <p className="note">Best results on wired ethernet or Wi‑Fi 6.</p>
          </div>
        </div>
      </section>

      <section id="route-/account" className="route" aria-labelledby="account-title">
        <h1 id="account-title" className="section-title">Account</h1>
        <p className="muted">Sign in to manage your bookings and files.</p>
        <button className="btn btn-primary" onClick={() => (window as any).openAuth('signin')}>Open sign-in modal</button>
      </section>

      <section id="route-/dashboard" className="route" aria-labelledby="dash-title">
        <h1 id="dash-title" className="section-title">Dashboard</h1>
        <div className="grid-2">
          <div className="card card-pad">
            <h3>Sessions</h3>
            <table>
              <thead><tr><th>Machine</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                <tr>
                  <td>Pro Studio RX6800</td>
                  <td>Stopped</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => alert('Starting…')}>Start</button>
                    <button className="btn btn-ghost" onClick={() => alert('Reserved slot queued')}>Reserve</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="note">Priority tiers affect queue time. ETA shown before start.</div>
          </div>
          <div className="card card-pad">
            <h3>Live telemetry</h3>
            <div style={{display:'grid',gap:'8px'}}>
              <div>GPU utilization</div><div className="bar"><span id="dashGpu" style={{width:'35%'}}></span></div>
              <div>Latency</div><div className="bar"><span id="dashRtt" style={{width:'15%',background:'linear-gradient(90deg,#60a5fa,#3b82f6)'}}></span></div>
              <div>VRAM</div><div className="bar"><span id="dashVram" style={{width:'20%',background:'linear-gradient(90deg,#fbbf24,#f59e0b)'}}></span></div>
            </div>
          </div>
        </div>
        <div className="grid-2" style={{marginTop:'16px'}}>
          <div className="card card-pad">
            <h3>File manager</h3>
            <p className="muted">Drag & drop to upload. S3-backed storage.</p>
            <button className="btn btn-ghost" onClick={() => alert('Open uploader (stub)')}>Upload files</button>
          </div>
          <div className="card card-pad">
            <h3>Billing</h3>
            <ul>
              <li>Payment methods: Stripe, PayPal</li>
              <li>Past invoices: #10023, #10022</li>
            </ul>
            <button className="btn btn-ghost" onClick={() => alert('Open Stripe portal (stub)')}>Manage billing</button>
          </div>
        </div>
        <div className="card card-pad" style={{marginTop:'16px'}}>
          <h3>Support</h3>
          <button className="btn btn-primary" onClick={() => alert('Open live chat (stub)')}>Live chat</button>
          <button className="btn btn-ghost" onClick={() => (window as any).go('#/support')}>Knowledge base</button>
        </div>
      </section>

      <section id="route-/support" className="route" aria-labelledby="support-title">
        <h1 id="support-title" className="section-title">Support</h1>
        <div className="grid-2">
          <div className="card card-pad">
            <h3>Knowledge base</h3>
            <ul>
              <li>Getting started (Architects, Gamers)</li>
              <li>Streaming setup: Parsec, Moonlight, WebRTC</li>
              <li>File sync via Drive/OneDrive/WebDAV/SFTP</li>
              <li>Licensing & BYOL</li>
            </ul>
          </div>
          <div className="card card-pad">
            <h3>System status</h3>
            <p className="muted">All systems operational</p>
            <div className="chip">Uptime 99.95%</div>
          </div>
        </div>
        <ContactForm />
      </section>

      <section id="route-/legal" className="route" aria-labelledby="legal-title">
        <h1 id="legal-title" className="section-title">Legal</h1>
        <div className="grid-2">
          <div className="card card-pad">
            <h3>Terms of Service</h3>
            <p className="muted">Acceptable use, session limits, and prohibited activities.</p>
          </div>
          <div className="card card-pad">
            <h3>Privacy Policy</h3>
            <p className="muted">We collect minimal data for account and billing; see full policy.</p>
          </div>
        </div>
        <div className="card card-pad" style={{marginTop:'16px'}}>
          <h3>Refund Policy</h3>
          <p className="muted">Pro-rated refunds for unused time; credits for interruptions.</p>
        </div>
      </section>

      <section id="route-/about" className="route" aria-labelledby="about-title">
        <h1 id="about-title" className="section-title">About</h1>
        <div className="card card-pad">
          <p>ArchPlay PCs builds accessible performance for architects, artists, and gamers. Performance-first, privacy-conscious, and support-focused.</p>
        </div>
      </section>

      <section id="route-/docs" className="route" aria-labelledby="docs-title">
        <h1 id="docs-title" className="section-title">Developer documentation</h1>
        <div className="grid-2">
          <div className="card card-pad">
            <h2>Tech stack & architecture</h2>
            <ul>
              <li>Frontend: Next.js + React, TypeScript, Tailwind CSS, Framer Motion</li>
              <li>Auth: Firebase Authentication</li>
              <li>Backend: Next.js API routes or Cloud Functions</li>
              <li>DB: Firestore; Cloud Storage for files</li>
            </ul>
          </div>
          <div className="card card-pad">
            <h2>OAuth setup (Firebase)</h2>
            <p className="note">Enable providers (Google, Microsoft, Facebook) in the Firebase Console. Add `localhost` to authorized domains for development.</p>
          </div>
        </div>
      </section>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context":"https://schema.org",
          "@type":"Product",
          "name":"Pro Studio RX6800",
          "description":"Ideal for GPU accelerated renders, 3D modelling, and high-refresh gaming.",
          "brand":{"@type":"Brand","name":"ArchPlay PCs"},
          "offers":{
            "@type":"AggregateOffer",
            "lowPrice":"5.00",
            "highPrice":"149.00",
            "priceCurrency":"USD",
            "offerCount":"4"
          },
          "category":"Computers"
        }
      `}} />
    </main>
  );
}
