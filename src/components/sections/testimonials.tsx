'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonials = [
  {
    id: 'testimonial-1',
    name: 'Sarah L.',
    role: 'Architecture Student',
    quote: "ArchPlay's service was a lifesaver during my finals. My laptop couldn't handle the complex renders, but their PC breezed through them. I finished my project days ahead of schedule!",
  },
  {
    id: 'testimonial-2',
    name: 'Mark C.',
    role: 'Professional Architect',
    quote: "I rent a high-end machine from ArchPlay whenever we have a big project. It's more cost-effective than buying and maintaining our own hardware. The performance is consistently top-notch.",
  },
  {
    id: 'testimonial-3',
    name: 'Alex G.',
    role: 'PC Gamer',
    quote: "I can finally play the latest AAA titles on ultra settings without any lag. The flexibility to upgrade for new game releases is a huge plus. Highly recommend!",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-secondary/50">
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Loved by Creatives and Gamers</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our customers are saying.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => {
            const image = PlaceHolderImages.find(p => p.id === testimonial.id);
            return (
              <Card key={testimonial.id} className="flex flex-col justify-between">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
                <div className="flex items-center gap-4 p-6 pt-0">
                  {image && (
                     <Avatar>
                        <AvatarImage src={image.imageUrl} alt={testimonial.name} data-ai-hint={image.imageHint} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
