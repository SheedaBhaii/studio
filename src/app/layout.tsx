import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta name="theme-color" content="#0b1220" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet" />
        <Script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js" strategy="beforeInteractive" />
        <Script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js" strategy="beforeInteractive" />
      </head>
      <body>
        {children}
        <Script id="firebase-config" strategy="beforeInteractive">
          {`
            const firebaseConfig = {
              "projectId": "studio-9915448084-db4ad",
              "appId": "1:533046792478:web:48396561584c76c4d5390f",
              "storageBucket": "studio-9915448084-db4ad.firebasestorage.app",
              "apiKey": "AIzaSyAAaYKgt3KZWoobCVLjPLQi8w6SvFqzsX0",
              "authDomain": "studio-9915448084-db4ad.firebaseapp.com",
              "measurementId": "",
              "messagingSenderId": "533046792478"
            };
            if (typeof window !== 'undefined' && !window.firebase?.apps?.length) {
              window.firebase.initializeApp(firebaseConfig);
              window.auth = window.firebase.auth();
            }
          `}
        </Script>
      </body>
    </html>
  );
}
