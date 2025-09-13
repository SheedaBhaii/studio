'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContactForm } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mail, MapPin, Phone, Send, Twitter, Instagram, Facebook, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const contactInitialState = {
  message: '',
  errors: undefined,
};

function ContactSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      Send Message
    </Button>
  );
}

export default function Contact() {
  const [state, formAction] = useActionState(submitContactForm, contactInitialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && !state.errors) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section id="contact" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Get in Touch</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Have questions? Want to schedule a demo? We'd love to hear from you.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="rounded-lg bg-card p-8 shadow-md">
            <h3 className="text-2xl font-bold">Send us a message</h3>
            <form ref={formRef} action={formAction} className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
                {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
                {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Your message..." className="min-h-[120px]" required />
                {state.errors?.message && <p className="text-sm text-destructive">{state.errors.message[0]}</p>}
              </div>
              <ContactSubmitButton />
              {state.message && (
                <div className={`mt-4 flex items-center text-sm ${state.errors ? 'text-destructive' : 'text-primary'}`}>
                  {state.errors ? ' ' : <CheckCircle className="mr-2 h-4 w-4" />}
                  {state.message}
                </div>
              )}
            </form>
          </div>
          <div className="space-y-8">
            <h3 className="text-2xl font-bold">Contact Information</h3>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-center gap-4">
                <MapPin className="h-5 w-5 text-primary" />
                <span>123 Tech Street, Silicon Valley, CA 94000</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-primary" />
                <span>(123) 456-7890</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-primary" />
                <span>contact@archplay.rentals</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground">Business Hours</h4>
              <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground">Follow Us</h4>
              <div className="mt-2 flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-6 w-6" /></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
