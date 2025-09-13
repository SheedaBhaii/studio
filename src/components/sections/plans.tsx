import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    title: 'Light',
    price: '$49',
    frequency: '/ month',
    description: 'Perfect for students and light CAD work.',
    features: [
      '1080p Gaming Ready',
      'Smooth CAD Performance',
      'Ideal for Learning',
      'Basic Software Suite',
    ],
    cta: 'Choose Light Plan',
  },
  {
    title: 'Medium',
    price: '$79',
    frequency: '/ month',
    description: 'The sweet spot for professionals and serious gamers.',
    features: [
      '1440p High-Fidelity Gaming',
      'Complex 3D Modeling',
      'Multitasking Power',
      'Full Creative Suite',
    ],
    cta: 'Choose Medium Plan',
    popular: true,
  },
  {
    title: 'Heavy',
    price: '$129',
    frequency: '/ month',
    description: 'For ultimate performance in rendering and 4K gaming.',
    features: [
      '4K Gaming & Streaming',
      'Intensive Rendering',
      'No Compromise Performance',
      'All Pro Software Included',
    ],
    cta: 'Choose Heavy Plan',
  },
];

export default function Plans() {
  return (
    <section id="plans" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Find the Right Plan for You</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Flexible plans designed to adapt to your specific workflow and gaming needs.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {plans.map((plan) => (
            <Card key={plan.title} className={`flex flex-col ${plan.popular ? 'border-primary ring-2 ring-primary shadow-lg' : ''}`}>
              {plan.popular && <div className="bg-primary text-primary-foreground text-center py-1.5 px-3 text-sm font-semibold rounded-t-lg">Most Popular</div>}
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div>
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.frequency}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className={`w-full ${plan.popular ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}>
                    <Link href="#contact">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
