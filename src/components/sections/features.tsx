import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CircuitBoard, Cpu, HardDrive, MemoryStick, Monitor, Users, Layers, Gamepad2, Paintbrush } from 'lucide-react';
import Image from 'next/image';

const featuredSpec = {
  gpu: 'Biostar Extreme Gaming RX 6800',
  cpu: 'Ryzen 5 5600',
  ram: '16GB DDR4',
  storage: 'NVMe and SSD options',
  monitor: 'High refresh rates and resolution',
};

const peripherals = [
  { id: 'monitor', name: 'Ease G24i18 Monitor' },
  { id: 'peripheral-1', name: 'Razer Mamba Elite' },
  { id: 'peripheral-2', name: 'Razer Kraken TE' },
];

const featureItems = [
    {
        icon: <Layers className="h-8 w-8 text-primary" />,
        title: "Flexibility",
        description: "Bring your own hardware and experience seamless performance. Our service complements your existing setup."
    },
    {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: "Versatile Use",
        description: "Perfect for Architecture students, professionals, and PC gamers alike. One rig for all your needs."
    },
    {
        icon: <Paintbrush className="h-8 w-8 text-primary" />,
        title: "For Creators",
        description: "Run demanding CAD and rendering software without a hitch. Boost your productivity and meet deadlines."
    },
    {
        icon: <Gamepad2 className="h-8 w-8 text-primary" />,
        title: "For Gamers",
        description: "Enjoy ultra-smooth gameplay at high settings. Experience your favorite titles like never before."
    }
]

export default function Features() {
  const gpuImage = PlaceHolderImages.find(p => p.id === 'gpu');

  return (
    <section id="features" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Built for Performance, Designed for You</h2>
            <p className="mt-4 text-lg text-muted-foreground">Everything you need for demanding work and immersive play.</p>
        </div>
        
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featureItems.map((item, index) => (
                <Card key={index} className="text-center bg-card">
                    <CardHeader className="items-center">
                        {item.icon}
                        <CardTitle className="mt-4">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="mt-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl font-headline">Our Featured High-Performance System</h3>
            <p className="mt-4 text-muted-foreground">This powerhouse is engineered to handle intensive architectural renders and high-fidelity gaming with ease.</p>
            <ul className="mt-8 space-y-6 text-lg">
              <li className="flex items-start">
                <div className="flex-shrink-0"><Cpu className="mt-1 h-6 w-6 text-primary" /></div>
                <div className="ml-4">
                  <span className="font-semibold">CPU:</span> {featuredSpec.cpu}
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0"><CircuitBoard className="mt-1 h-6 w-6 text-primary" /></div>
                <div className="ml-4">
                  <span className="font-semibold">GPU:</span> {featuredSpec.gpu}
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0"><MemoryStick className="mt-1 h-6 w-6 text-primary" /></div>
                <div className="ml-4">
                  <span className="font-semibold">RAM:</span> {featuredSpec.ram}
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0"><HardDrive className="mt-1 h-6 w-6 text-primary" /></div>
                <div className="ml-4">
                  <span className="font-semibold">Storage:</span> {featuredSpec.storage}
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0"><Monitor className="mt-1 h-6 w-6 text-primary" /></div>
                <div className="ml-4">
                  <span className="font-semibold">Monitor:</span> {featuredSpec.monitor}
                </div>
              </li>
            </ul>
          </div>
          <div className="order-1 lg:order-2">
             {gpuImage && (
                <Image
                    src={gpuImage.imageUrl}
                    alt={gpuImage.description}
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                    data-ai-hint={gpuImage.imageHint}
                />
            )}
          </div>
        </div>

        <div className="mt-20">
            <div className="text-center">
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl font-headline">Premium Peripherals Included</h3>
                <p className="mt-4 text-lg text-muted-foreground">Complete your setup with top-tier gear for precision and comfort.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {peripherals.map(p => {
                    const img = PlaceHolderImages.find(img => img.id === p.id);
                    return img ? (
                        <Card key={p.id} className="overflow-hidden">
                            <Image src={img.imageUrl} alt={img.description} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={img.imageHint} />
                            <CardContent className="p-4">
                                <p className="font-semibold text-center">{p.name}</p>
                            </CardContent>
                        </Card>
                    ) : null;
                })}
            </div>
        </div>
      </div>
    </section>
  );
}
