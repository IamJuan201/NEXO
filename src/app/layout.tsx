import type { Metadata } from "next";
import { Cinzel, Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AudioProvider } from "@/context/AudioContext";

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
  title: "MJMusic",
  description: "Una pagina de practica para escuchar musica",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="min-h-screen font-sans flex flex-col bg-neutral-950 text-neutral-50 antialiased m-0 p-0 relative overflow-x-hidden">
          
        <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-100 h-100 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <AudioProvider>
          <Navbar />

          <main className="grow">{children}</main>
          
          <Footer />
        </AudioProvider>
      </body>
    </html>
  );
}
