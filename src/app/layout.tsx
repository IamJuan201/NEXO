import type { Metadata } from "next";
import { Cinzel, Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AudioProvider } from "@/context/AudioContext";
import { ArtistProvider } from "@/context/ArtistContext";
import BackgroundBlobs from "@/components/layout/BackgroundBlobs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cinzel',
})

export const metadata: Metadata = {
  title: "Music Platform",
  description: "Plataforma multi-artista de música",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="min-h-screen font-sans flex flex-col bg-neutral-950 text-neutral-50 antialiased m-0 p-0 relative overflow-x-hidden transition-colors duration-700">
        <ArtistProvider>
          <AudioProvider>
            
            {/* Luces de fondo dinámicas */}
            <BackgroundBlobs />
            
            <Navbar />

            <main className="grow z-10 relative transition-all duration-700 ease-in-out">
              {children}
            </main>
            
            <Footer />
            
          </AudioProvider>
        </ArtistProvider>
      </body>
    </html>
  );
}
