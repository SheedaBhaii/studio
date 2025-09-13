import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <section className="relative h-[60vh] min-h-[500px] w-full lg:h-[70vh]">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Powerful PCs for Your Work and Play
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl font-body" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            Rent High-Performance PCs Designed for Architecture and Gaming
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="#plans">Browse Our PCs</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#builder">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
