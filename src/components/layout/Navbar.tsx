"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useArtist } from "@/context/ArtistContext";

export default function Navbar() {
  const { currentArtist, allArtists, setArtist } = useArtist();
  const [isVinylVisible, setIsVinylVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer click afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsVinylVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // CORRECCIÓN: Estabilizamos en h-24 para una altura premium y añadimos py-4 para asegurar 
    // que ningún elemento colisione con el borde superior de la pantalla.
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-neutral-800/60 px-6 h-24 py-4 transition-colors duration-700">
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between relative">
        
        {/* LADO IZQUIERDO: Texto Logo Dinámico */}
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xl font-bold tracking-wider transition-colors duration-700 cursor-pointer z-20 relative"
          style={{ color: currentArtist?.primaryColor || "#D4AF37" }}
        >
          {currentArtist?.name ? `${currentArtist.name.split(" ")[0]} Music` : "MJ Music"}
        </Link>

        {/* ÁREA CENTRAL: Logo 'M', Vinilo Gigante y Menú */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 top-0 h-full flex flex-col justify-center items-center z-30"
          onMouseEnter={() => setIsVinylVisible(true)}
          onMouseLeave={() => !isMenuOpen && setIsVinylVisible(false)}
          ref={menuRef}
        >
          {/* LOGO CENTRAL: Fijo en su lugar del Navbar, agrandado para tapar el centro del vinilo */}
          <div 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="absolute top-1/2 -translate-y-1/2 z-30 flex items-center justify-center cursor-pointer 
              w-20 h-20 bg-black rounded-full border border-neutral-800 shadow-xl 
              transition-transform duration-300 hover:scale-110" 
          >
            <img 
              src="/icon.svg" 
              alt="Logo Central" 
              className="w-10 h-10 object-contain" 
            />
          </div>

          {/* El Vinilo Gigante que emerge desde arriba por DETRÁS del logo */}
          <div 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`absolute cursor-pointer transition-all duration-800 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10 flex items-center justify-center pointer-events-auto
              ${isVinylVisible || isMenuOpen ? "-top-32" : "-top-64"}`}
          >
            <div className={`w-64 h-64 rounded-full flex items-center justify-center bg-[#0a0a0a] shadow-2xl transition-transform duration-700 ${isMenuOpen ? "scale-105" : "scale-100 animate-[spin_8s_linear_infinite]"}`}>
              <img src="/images/vinilos/Vinyl.png" alt="Vinyl" className="w-full h-full object-cover rounded-full drop-shadow-2xl" />
            </div>
          </div>

          {/* Menú Desplegable Centrado */}
          <div 
            className={`absolute top-28 left-1/2 -translate-x-1/2 w-64 bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-3 flex flex-col gap-2 transition-all duration-400 z-40 shadow-2xl origin-top
              ${isMenuOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"}`}
          >
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 pl-2 text-center">
              Selecciona un Artista
            </h3>
            
            {allArtists?.map(artist => (
              <div 
                key={artist.id}
                onClick={() => {
                  setArtist(artist.id);
                  setIsMenuOpen(false);
                  setIsVinylVisible(false);
                }}
                className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-neutral-800 ${currentArtist?.id === artist.id ? "bg-neutral-800/80" : ""}`}
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 transition-colors duration-300 shrink-0" style={{ borderColor: currentArtist?.id === artist.id ? artist.primaryColor : 'transparent' }}>
                  <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold text-neutral-200 truncate">{artist.name}</span>
                  <span className="text-[10px] text-neutral-500 truncate">{artist.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LADO DERECHO: Enlaces de Navegación */}
        <div className="flex items-center gap-8 text-sm font-medium text-neutral-400 z-20">
          <Link href="/" className="hover:text-neutral-50 transition-all duration-100 ease-in-out hover:scale-130">
            Inicio
          </Link>
          <Link href="/albums" className="hover:text-neutral-50 transition-all duration-100 ease-in-out hover:scale-130">
            Álbumes
          </Link>
          <Link href="/historia" className="hover:text-neutral-50 transition-all duration-100 ease-in-out hover:scale-130">
            Historia
          </Link>
        </div>

      </div>
    </nav>
  );
}
