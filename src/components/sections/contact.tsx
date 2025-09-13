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
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
  const contactImage = PlaceHolderImages.find(p => p.id === 'contact');

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
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 bg-card shadow-md rounded-lg overflow-hidden">
          <div className="p-8">
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
          <div className="relative min-h-[400px] lg:min-h-0">
            {contactImage && (
              <Image 
                src={contactImage.imageUrl}
                alt={contactImage.description}
                fill
                className="object-cover"
                data-ai-hint={contactImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-primary-foreground">
                <h3 className="text-2xl font-bold">Contact Information</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <MapPin className="h-5 w-5 text-accent" />
                    <span>123 Tech Street, Silicon Valley, CA 94000</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="h-5 w-5 text-accent" />
                    <span>(123) 456-7890</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-accent" />
                    <span>contact@archplay.rentals</span>
                  </div>
                </div>
                <div className='mt-6'>
                  <h4 className="font-semibold">Business Hours</h4>
                  <p className="opacity-80">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="opacity-80">Saturday: 10:00 AM - 4:00 PM</p>
                </div>
                <div className='mt-6'>
                  <h4 className="font-semibold">Follow Us</h4>
                  <div className="mt-2 flex space-x-4">
                    <Link href="#" className="opacity-80 hover:opacity-100"><Twitter className="h-6 w-6" /></Link>
                    <Link href="#" className="opacity-80 hover:opacity-100"><Instagram className="h-6 w-6" /></Link>
                    <Link href="#" className="opacity-80 hover:opacity-100"><Facebook className="h-6 w-6" /></Link>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
