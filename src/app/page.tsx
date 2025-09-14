
'use client';

import React, { useActionState } from 'react';
import { submitContactForm } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Star } from 'lucide-react';

// --- Contact Form Component ---
function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, null);

  return (
    <div className="card card-pad h-full">
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



const testimonials = [
  {
    name: 'Fatima Ahmed',
    role: 'Arch Student',
    quote: '“As an architecture student in Lahore, project deadlines are everything. I was able to render a complex 4K architectural walkthrough in just a few hours for my final year project, a task that would have taken days on my university’s machines. The hourly pricing is a lifesaver for my budget, and the performance is just incredible.”',
    avatar: PlaceHolderImages.find(p => p.id === 'testimonial-1')
  },
  {
    name: 'Bilal Khan',
    role: 'Gamer',
    quote: '“I was skeptical about cloud gaming for competitive shooters from Karachi, but the low latency blew me away. It felt just like playing on a local rig. I was hitting my shots in Apex Legends with no noticeable input lag. It’s my go-to for gaming when I’m traveling across Pakistan for work.”',
     avatar: PlaceHolderImages.find(p => p.id === 'testimonial-3')
  },
  {
    name: 'Ayesha Malik',
    role: 'Studio Lead',
    quote: '“Our studio in Islamabad was up against a tight deadline for an international client, and our local render farm was maxed out. ArchPlay’s shared render queue was a game-changer. Our team seamlessly offloaded several scenes, and the performance was rock-solid. We delivered the project ahead of schedule and impressed our client.”',
     avatar: PlaceHolderImages.find(p => p.id === 'testimonial-2')
  },
];

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
                <a className="btn btn-ghost" href="#how-it-works">How It Works</a>
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
                      <span id="latency-stats" className="muted">Remote session connected — 8 ms</span>
                    </div>
                    <div className="window" role="img" aria-label="Animated render progress">
                      <div style={{padding:'12px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span>Connection Status</span>
                        <span id="gpu-stats" className="chip">GPU 72% • 62°C</span>
                      </div>
                      <div style={{padding:'12px',display:'grid',gap:'12px', fontSize: '11px', color: 'var(--muted)'}}>
                        
                        <div>
                           <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '4px'}}>
                            <span>Latency</span>
                            <span id="latency-text">0 ms</span>
                          </div>
                          <div className="bar"><span id="latencyFill" style={{background:'linear-gradient(90deg,#60a5fa,#3b82f6)'}}></span></div>
                        </div>
                        <div>
                          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '4px'}}>
                            <span>GPU Utilization</span>
                            <span id="gpu-util-text">0%</span>
                          </div>
                          <div className="bar"><span id="gpuUtilFill"></span></div>
                        </div>
                        <div>
                           <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '4px'}}>
                            <span>GPU Clock</span>
                            <span id="gpu-clock-text">500 MHz</span>
                          </div>
                          <div className="bar"><span id="gpuClockFill" style={{background:'linear-gradient(90deg,#60a5fa,#3b82f6)'}}></span></div>
                        </div>
                         <div>
                           <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '4px'}}>
                            <span>GPU Memory</span>
                            <span id="gpu-mem-text">0.0 / 16.0 GB</span>
                          </div>
                          <div className="bar"><span id="gpuMemFill" style={{background:'linear-gradient(90deg,#a78bfa,#8b5cf6)'}}></span></div>
                        </div>
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
            <div className="price">1000 PKR/hr</div>
            <p className="muted">Priority: Standard • Queue ETA</p>
            <a href="#machines" className="btn btn-primary">Choose</a>
          </div>
          <div className="card card-pad">
            <h3>Student</h3>
            <div className="price">500 PKR/hr</div>
            <p className="muted">Verify university email for discount</p>
            <a href="#machines" className="btn btn-primary">Choose</a>
          </div>
          <div className="card card-pad">
            <h3>Pro</h3>
            <div className="price">1500 PKR/hr</div>
            <p className="muted">Priority: High • Shorter queues</p>
            <a href="#machines" className="btn btn-primary">Choose</a>
          </div>
        </div>
      </section>

      <section id="machines" className="route">
        <h2 className="section-title">Machine Spotlight</h2>
        <div className="grid-2">
          <div className="card card-pad">
            <h3>Pro Studio RX 6800</h3>
            <p className="muted">Ideal for GPU accelerated renders, 3D modelling, and high-refresh gaming.</p>
            <div className="machine-specs">
              <div className="spec-k">CPU</div><div>AMD Ryzen 5 5600</div>
              <div className="spec-k">GPU</div><div>Asus Rog Strix RX 6800 OC</div>
              <div className="spec-k">RAM</div><div>16GB DDR4 3800 MHz</div>
              <div className="spec-k">Storage</div><div>5 TB Storage</div>
            </div>
            <div style={{marginTop:'12px'}} className="note">“Rent the ‘Pro Studio RX 6800’ — ideal for high-res renders, GPU-accelerated ray tracing, and 3D viewport performance. Perfect for architecture renders & high-refresh gaming.”</div>
            <div className="cta-row" style={{marginTop:'12px'}}>
               <a href="#pricing" className="btn btn-primary">Reserve</a>
            </div>
          </div>
          <div className="card card-pad">
            <h3>Gamer's Edge RTX 3070</h3>
            <p className="muted">A balanced powerhouse for 1440p gaming and creative workloads.</p>
            <div className="machine-specs">
              <div className="spec-k">CPU</div><div>AMD Ryzen 5 5600</div>
              <div className="spec-k">GPU</div><div>Nvidia RTX 3070</div>
              <div className="spec-k">RAM</div><div>32GB DDR4 3200 MHz</div>
              <div className="spec-k">Storage</div><div>2 TB NVMe SSD</div>
            </div>
            <div style={{marginTop:'12px'}} className="note">"The 'Gamer's Edge' is perfect for high-framerate 1440p gaming and demanding creative tasks like video editing and 3D modeling. A true all-rounder."</div>
            <div className="cta-row" style={{marginTop:'12px'}}>
               <a href="#pricing" className="btn btn-primary">Reserve</a>
            </div>
          </div>
        </div>
      </section>
      
      <section id="reviews" className="route">
        <h2 className="section-title">What Our Customers Are Saying</h2>
         <div className="grid-3">
          {testimonials.map((testimonial, reviewIndex) => (
            <div key={reviewIndex} className="card card-pad">
              <div className="flex items-start gap-4">
                {testimonial.avatar && (
                   <Image 
                      src={testimonial.avatar.imageUrl} 
                      alt={testimonial.avatar.description}
                      width={40}
                      height={40}
                      className="rounded-full"
                      data-ai-hint={testimonial.avatar.imageHint}
                    />
                )}
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm muted">{testimonial.role}</p>
                </div>
              </div>
               <div className="flex mt-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
               </div>
              <p className="mt-2 italic">{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="route">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="grid-2">
          <div className="card card-pad">
            <strong>What software can I use on the machines?</strong>
            <p className="muted">Our machines come with optional pre-installed software like Blender, V-Ray, and major game launchers. You can also install your own licensed software (like AutoCAD, Revit, or Adobe CC) just as you would on a local PC for the duration of your session.</p>
          </div>
          <div className="card card-pad">
            <strong>How good is the streaming for competitive gaming?</strong>
            <p className="muted">We are optimized for low-latency gaming. Using Parsec, our users in major Pakistani cities typically experience latency between 8-25ms, which is excellent for competitive shooters and fast-paced games. Your personal experience will depend on your own internet connection's quality.</p>
          </div>
           <div className="card card-pad">
            <strong>How do I manage my project files?</strong>
            <p className="muted">You can sync your files seamlessly using Google Drive, OneDrive, or connect directly via SFTP for large transfers. We also offer a persistent storage add-on, giving you a personal drive on our network that keeps your files between sessions.</p>
          </div>
          <div className="card card-pad">
            <strong>Is my data secure and private?</strong>
            <p className="muted">Absolutely. Each user session is isolated in a secure environment. For maximum privacy, you can choose an 'ephemeral session,' which securely wipes all your data from the machine the moment you log out, leaving no trace behind.</p>
          </div>
          <div className="card card-pad">
            <strong>How does student pricing work?</strong>
            <p className="muted">If you have a valid email from a recognized Pakistani educational institution (e.g., .edu.pk), you can verify it in your account settings. Once verified, the student discount is automatically applied to all your future sessions.</p>
          </div>
          <div className="card card-pad">
            <strong>Can I request specific hardware configurations?</strong>
            <p className="muted">While we don't offer fully custom builds, our 'Pro' tier gives you priority access to our most powerful machines. We are constantly updating our hardware lineup based on user feedback and new tech releases to meet the demands of modern applications.</p>
          </div>
        </div>
      </section>

      <section id="support" className="route">
        <h2 className="section-title">Support</h2>
        <div className="grid-2">
          <div className="card card-pad">
            <h3>Knowledge base</h3>
            <ul className="space-y-2">
              <li>Getting started (Architects, Gamers)</li>
              <li>Streaming setup: Parsec, Moonlight, WebRTC</li>
              <li>File sync via Drive/OneDrive/WebDAV/SFTP</li>
              <li>Licensing & BYOL (Bring Your Own License)</li>
              <li>Billing and Payments</li>
              <li>Troubleshooting Common Issues</li>
              <li>Understanding Hardware Specs</li>
              <li>Account & Profile Management</li>
            </ul>
          </div>
          <ContactForm />
        </div>
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
        <a className="btn btn-accent" href="#pricing">See Pricing Plans</a>
      </div>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
        {
          "@context":"https://schema.org",
          "@type":"Product",
          "name":"Pro Studio RX 6800",
          "description":"Ideal for GPU accelerated renders, 3D modelling, and high-refresh gaming.",
          "brand":{"@type":"Brand","name":"ArchPlay PCs"},
          "offers":{
            "@type":"AggregateOffer",
            "lowPrice":"500.00",
            "highPrice":"1500.00",
            "priceCurrency":"PKR",
            "offerCount":"3"
          },
          "category":"Computers"
        }
      `}} />
    </main>
  );
}
