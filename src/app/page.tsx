
'use client';

import React, { useActionState } from 'react';
import { submitContactForm } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';


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
      <section id="home" className="route" role="region" aria-labelledby="home-title">
        <div className="hero">
          <div className="hero-inner">
            <div>
              <div className="badge">Friendly, professional, performance-first</div>
              <h1 id="home-title" className="headline">High-Power PCs for Architects & Gamers — Rent by the Hour</h1>
              <p className="subhead">Render, simulate, or game on a powerful machine from anywhere — no hardware upgrade required.</p>
              <div className="cta-row">
                <a className="btn btn-primary" href="#machines">Book a Machine</a>
                <a className="btn btn-accent" href="#pricing">See Pricing</a>
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
                        <span id="gpu-stats" className="chip">GPU 72% • 62°C</span>
                      </div>
                      <div style={{padding:'12px',display:'grid',gap:'12px'}}>
                        <div className="render-bar" aria-hidden="true"><div id="renderFill" className="render-fill"></div></div>
                        <div className="bar"><span id="gpuFill"></span></div>
                        <div className="bar"><span id="netFill" style={{background:'linear-gradient(90deg,#60a5fa,#3b82f6)'}}></span></div>
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
        </section>

        <section id="how-it-works" className="how route">
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

        <section className="route">
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

        <section id="pricing" className="pricing route">
          <h2 className="section-title">Pricing tiers</h2>
          <div className="grid-3">
            <div className="card card-pad">
              <h3>Standard</h3>
              <div className="price">$4/hr</div>
              <p className="muted">Priority: Standard • Queue ETA</p>
              <a href="#machines" className="btn btn-primary">Choose</a>
            </div>
            <div className="card card-pad">
              <h3>Student</h3>
              <div className="price">$3/hr</div>
              <p className="muted">Verify university email for discount</p>
              <a href="#machines" className="btn btn-primary">Choose</a>
            </div>
            <div className="card card-pad">
              <h3>Pro</h3>
              <div className="price">$6/hr</div>
              <p className="muted">Priority: High • Shorter queues</p>
              <a href="#machines" className="btn btn-primary">Choose</a>
            </div>
          </div>
        </section>

        <section id="machines" className="route">
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
                 <button className="btn btn-primary" onClick={() => (window as any).openAuth('signup')}>Reserve</button>
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

        <section id="faq" className="route">
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

        <section id="support" className="route">
          <h2 className="section-title">Support</h2>
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

        <section id="legal" className="route">
          <h2 className="section-title">Legal</h2>
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

        <section id="about" className="route">
          <h2 className="section-title">About</h2>
          <div className="card card-pad">
            <p>ArchPlay PCs builds accessible performance for architects, artists, and gamers. Performance-first, privacy-conscious, and support-focused.</p>
          </div>
        </section>

        <div style={{margin:'40px 0 20px', textAlign:'center'}}>
          <button className="btn btn-accent" onClick={() => (window as any).openAuth('signup')}>Start Your Free Trial Now</button>
        </div>
      
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
