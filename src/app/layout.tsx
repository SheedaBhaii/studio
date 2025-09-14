
import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/client-layout';
import { Toaster } from '@/components/ui/toaster';


export const metadata: Metadata = {
  title: 'ArchPlay PCs — High-Power PCs for Architects & Gamers',
  description: 'Render faster. Game smoother. Rent high-performance PCs by the hour — remote or on-site. Secure sign-in with Google, Microsoft, Facebook, or Email.',
  openGraph: {
    title: 'ArchPlay PCs — High-Power PCs for Architects & Gamers',
    description: 'Remote & local high-performance PC access — for architects & gamers. Book by the hour, sync files, and launch low-latency sessions.',
    type: 'website',
    url: 'https://archplay.example.com/',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'theme-color': '#0b1220'
  }
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}
