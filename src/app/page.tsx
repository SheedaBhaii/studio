
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
      <h3>Get in Touch</h3>
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
          <Textarea id="message" name="message" rows={4} required placeholder="Have a question? Ask away!"/>
          {state?.errors?.message && <p className="text-red-500 text-sm mt-1">{state.errors.message}</p>}
        </div>
        <Button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? 'Sending...' : 'Send Message'}
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
              <div className="badge">Your On-Demand High-Performance Workstation</div>
              <h1 id="home-title" className="headline">On-Demand GPU Power for Creatives & Gamers</h1>
              <p className="subhead">Access powerful, remote workstations by the hour. Render, design, and game without expensive hardware investments. Instantly stream a high-end PC to any device.</p>
              <div className="cta-row">
                <a className="btn btn-primary" href="#machines">View Machines</a>
                <a className="btn btn-accent" href="#pricing">See Pricing</a>
                <a className="btn btn-ghost" href="#how-it-works">How It Works</a>
              </div>
              <div className="valprops">
                <div className="card card-pad">
                  <div className="kpi">Ultra-Low Latency</div>
                  <p className="muted">Experience near-native performance with Parsec and Moonlight streaming technology, perfect for fast-paced gaming and responsive design work.</p>
                </div>
                <div className="card card-pad">
                  <div className="kpi">Pro Software Ready</div>
                  <p className="muted">Machines can be pre-configured with Revit, AutoCAD, 3ds Max, Blender, V-Ray, and more. Install your own licensed software anytime.</p>
                </div>
                <div className="card card-pad">
                  <div className="kpi">Secure & Private</div>
                  <p className="muted">Your session data is isolated and secure. Choose ephemeral sessions to have all data wiped automatically upon logout.</p>
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
                        <span>Session Performance</span>
                        <span id="gpu-stats" className="chip">GPU 72% • 62°C</span>
                      </div>
                      <div style={{padding:'12px',display:'grid',gap:'12px', fontSize: '11px', color: 'var(--muted)'}}>
                        
                        <div>
                           <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '4px'}}>
                            <span>Network Latency</span>
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
                            <span>GPU Clock Speed</span>
                            <span id="gpu-clock-text">500 MHz</span>
                          </div>
                          <div className="bar"><span id="gpuClockFill" style={{background:'linear-gradient(90deg,#60a5fa,#3b82f6)'}}></span></div>
                        </div>
                         <div>
                           <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '4px'}}>
                            <span>VRAM Usage</span>
                            <span id="gpu-mem-text">0.0 / 16.0 GB</span>
                          </div>
                          <div className="bar"><span id="gpuMemFill" style={{background:'linear-gradient(90deg,#a78bfa,#8b5cf6)'}}></span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{textAlign:'center',color:'var(--muted)',marginTop:'8px',fontSize:'12px'}}>Your high-performance PC, accessible from anywhere.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how route">
        <h2 className="section-title">Get Started in 3 Simple Steps</h2>
        <div className="grid-3">
          <div className="card card-pad">
            <div className="kpi">1. Choose Your Rig</div>
            <p className="muted">Select from our range of high-performance machines. Pay by the hour or choose a plan that fits your needs.</p>
          </div>
          <div className="card card-pad">
            <div className="kpi">2. Connect & Go</div>
            <p className="muted">Launch an ultra-low latency stream via Parsec, Moonlight, or our in-browser client. Sync your files from the cloud or upload directly.</p>
          </div>
          <div className="card card-pad">
            <div className="kpi">3. Pay As You Go</div>
            <p className="muted">Simple, transparent hourly billing with no hidden fees. Securely pay with Stripe or PayPal and access your results instantly.</p>
          </div>
        </div>
      </section>

      <section className="route">
        <h2 className="section-title">Why Choose ArchPlay?</h2>
        <div className="grid-2">
          <div className="card card-pad">
            <h3>Pre-Configured Software</h3>
            <p className="muted">Our machines are ready to go with optional pre-installed software like Blender, V-Ray, and major game launchers. You can also install your own licensed software.</p>
          </div>
          <div className="card card-pad">
            <h3>Optimized for Performance</h3>
            <p className="muted">We target sub-20ms latency for a smooth, responsive experience, whether you're in a competitive match or manipulating a complex 3D model.</p>
          </div>
          <div className="card card-pad">
            <h3>Secure Authentication</h3>
            <p className="muted">Log in effortlessly with Google, Microsoft, or a passwordless email link. Your account and data are protected with industry-standard security protocols.</p>
          </div>
          <div className="card card-pad">
            <h3>Flexible File Management</h3>
            <p className="muted">Sync files via Google Drive, OneDrive, or SFTP. Opt for persistent storage to keep your project files available across all your sessions.</p>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing route">
        <h2 className="section-title">Simple, Transparent Pricing</h2>
        <div className="grid-3">
          <div className="card card-pad">
            <h3>Standard</h3>
            <div className="price">1000 PKR/hr</div>
            <p className="muted">Perfect for everyday tasks and gaming. Standard queue priority.</p>
            <a href="#machines" className="btn btn-primary">Book Now</a>
          </div>
          <div className="card card-pad">
            <h3>Student</h3>
            <div className="price">500 PKR/hr</div>
            <p className="muted">A 50% discount for verified students. All the power, half the price.</p>
            <a href="#machines" className="btn btn-primary">Get Verified</a>
          </div>
          <div className="card card-pad">
            <h3>Pro</h3>
            <div className="price">1500 PKR/hr</div>
            <p className="muted">High-priority queue access for when deadlines are tight. Get rendering faster.</p>
            <a href="#machines" className="btn btn-primary">Go Pro</a>
          </div>
        </div>
      </section>

      <section id="machines" className="route">
        <h2 className="section-title">Our Featured Machines</h2>
        <div className="grid-2">
          <div className="card card-pad">
            <h3>Pro Studio RX 6800</h3>
            <p className="muted">Ideal for GPU-accelerated rendering, complex 3D modeling, and high-refresh-rate gaming.</p>
            <div className="machine-specs">
              <div className="spec-k">CPU</div><div>AMD Ryzen 5 5600</div>
              <div className="spec-k">GPU</div><div>Asus Rog Strix RX 6800 OC</div>
              <div className="spec-k">RAM</div><div>16GB DDR4 3800 MHz</div>
              <div className="spec-k">Storage</div><div>5 TB Storage</div>
            </div>
            <div style={{marginTop:'12px'}} className="note">The Pro Studio rig is a workhorse for professionals who need maximum GPU performance for ray tracing and high-resolution renders.</div>
            <div className="cta-row" style={{marginTop:'12px'}}>
               <a href="#pricing" className="btn btn-primary">Reserve Now</a>
            </div>
          </div>
          <div className="card card-pad">
            <h3>Gamer's Edge RTX 3070</h3>
            <p className="muted">A balanced powerhouse built for buttery-smooth 1440p gaming and creative workloads.</p>
            <div className="machine-specs">
              <div className="spec-k">CPU</div><div>AMD Ryzen 5 5600</div>
              <div className="spec-k">GPU</div><div>Nvidia RTX 3070</div>
              <div className="spec-k">RAM</div><div>32GB DDR4 3200 MHz</div>
              <div className="spec-k">Storage</div><div>2 TB NVMe SSD</div>
            </div>
            <div style={{marginTop:'12px'}} className="note">The Gamer's Edge delivers the perfect blend of performance and value for high-framerate gaming and demanding creative tasks like video editing.</div>
            <div className="cta-row" style={{marginTop:'12px'}}>
               <a href="#pricing" className="btn btn-primary">Reserve Now</a>
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
        <div className="grid-2 gap-4">
          <div className="card card-pad">
            <h3>Help Center</h3>
            <ul className="space-y-2 mt-4">
              <li>Getting Started (Architects, Gamers)</li>
              <li>Streaming Setup: Parsec, Moonlight, WebRTC</li>
              <li>File Sync via Drive/OneDrive/WebDAV/SFTP</li>
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
            <p className="muted">Review our acceptable use policies, session limits, and data handling practices.</p>
          </div>
          <div className="card card-pad">
            <h3>Privacy Policy</h3>
            <p className="muted">Learn how we collect and protect your data. We are committed to your privacy.</p>
          </div>
        </div>
        <div className="card card-pad" style={{marginTop:'16px'}}>
          <h3>Refund Policy</h3>
          <p className="muted">We offer pro-rated refunds for unused time and service credits for any interruptions.</p>
        </div>
      </section>

      <section id="about" className="route">
        <h2 className="section-title">About ArchPlay</h2>
        <div className="card card-pad">
          <p>ArchPlay was founded on a simple idea: make high-performance computing accessible and affordable for everyone. Whether you're an architect facing a tight deadline, a digital artist creating your next masterpiece, or a gamer seeking the ultimate experience, we provide the power you need, when you need it.</p>
        </div>
      </section>

      <div style={{margin:'40px 0 20px', textAlign:'center'}}>
        <a className="btn btn-accent" href="#pricing">See Our Plans</a>
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
