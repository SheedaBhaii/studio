'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getPCRecommendation } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CircuitBoard, Cpu, HardDrive, Lightbulb, Loader2, MemoryStick, Monitor, ServerCrash } from 'lucide-react';
import type { RecommendPCConfigurationOutput } from '@/ai/flows/pc-decision-gen-ai';

const initialState = {
  message: '',
  errors: undefined,
  recommendation: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
      Get Recommendation
    </Button>
  );
}

function RecommendationResult({ recommendation }: { recommendation: RecommendPCConfigurationOutput }) {
    const specs = [
        { icon: <CircuitBoard className="h-6 w-6 text-primary" />, label: 'GPU', value: recommendation.recommendedGPU },
        { icon: <Cpu className="h-6 w-6 text-primary" />, label: 'CPU', value: recommendation.recommendedCPU },
        { icon: <MemoryStick className="h-6 w-6 text-primary" />, label: 'RAM', value: recommendation.recommendedRAM },
        { icon: <HardDrive className="h-6 w-6 text-primary" />, label: 'Storage', value: recommendation.recommendedStorage },
        { icon: <Monitor className="h-6 w-6 text-primary" />, label: 'Monitor', value: recommendation.recommendedMonitor },
    ];
    
    return (
        <Card className="mt-8 animate-in fade-in-50 duration-500">
            <CardHeader>
                <CardTitle>Your Custom PC Recommendation</CardTitle>
                <CardDescription>Based on your requirements, here's a configuration we think you'll love.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {specs.map(spec => (
                        <div key={spec.label} className="flex items-center gap-4">
                            {spec.icon}
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{spec.label}</p>
                                <p className="font-semibold">{spec.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 rounded-lg border bg-secondary/50 p-4">
                    <p className="font-semibold">Justification</p>
                    <p className="mt-2 text-muted-foreground">{recommendation.justification}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function CustomBuilder() {
  const [state, formAction] = useActionState(getPCRecommendation, initialState);

  return (
    <section id="builder" className="py-16 sm:py-24 bg-secondary/50">
      <div className="container mx-auto max-w-screen-lg px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Don't Know Where to Start?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Let our AI assistant craft the perfect PC build for your specific needs. Just tell us what you'll be using it for.
          </p>
        </div>

        <Card className="mt-12">
          <form action={formAction}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="softwareRequirements">Software Requirements</Label>
                  <Textarea
                    id="softwareRequirements"
                    name="softwareRequirements"
                    placeholder="e.g., AutoCAD, Revit, Adobe Creative Suite, Blender..."
                    className="min-h-[120px]"
                    required
                  />
                  {state.errors?.softwareRequirements && <p className="text-sm text-destructive">{state.errors.softwareRequirements[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gameRequirements">Game Requirements</Label>
                  <Textarea
                    id="gameRequirements"
                    name="gameRequirements"
                    placeholder="e.g., Cyberpunk 2077 at 1440p High, competitive FPS like Valorant, Apex Legends..."
                    className="min-h-[120px]"
                    required
                  />
                  {state.errors?.gameRequirements && <p className="text-sm text-destructive">{state.errors.gameRequirements[0]}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SubmitButton />
              {state.message && state.message !== 'success' && !state.errors && (
                <div className="flex items-center text-sm text-destructive">
                    <ServerCrash className="mr-2 h-4 w-4" />
                    {state.message}
                </div>
              )}
            </CardFooter>
          </form>
        </Card>
        
        {state.recommendation && <RecommendationResult recommendation={state.recommendation} />}

      </div>
    </section>
  );
}
