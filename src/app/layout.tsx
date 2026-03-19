import type { Metadata, Viewport } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Familles d'Impact | Trouvez votre cellule de proximité",
    template: "%s | Familles d'Impact",
  },
  description:
    "Rejoignez une Famille d'Impact près de chez vous. Application de l'église pour connecter les membres en cellules de proximité chaque Mardi et Jeudi.",
  keywords: [
    "église",
    "famille d'impact",
    "cellule",
    "proximité",
    "communauté",
    "réunion",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Familles d'Impact",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Familles d'Impact",
    description:
      "Trouvez la Famille d'Impact la plus proche de chez vous et rejoignez une communauté vibrante.",
    siteName: "Familles d'Impact",
  },
};

export const viewport: Viewport = {
  themeColor: "#d4a843",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn(inter.variable, "font-sans", geist.variable)}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <PWAInstallPrompt />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registered:', reg.scope))
                    .catch(err => console.log('SW registration failed:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
