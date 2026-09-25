"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlay } from "react-icons/fa6";
import { supabase } from "@/lib/supabaseClient";
import { useArtist } from "@/context/ArtistContext";

export default function AlbumsPage() {
  const { currentArtist } = useArtist();
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllAlbums() {
      setLoading(true);
      
      if (!currentArtist.useSupabase) {
        setAlbums(currentArtist.mockAlbums);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("albums")
          .select(`*, songs (id)`)
          .order("year", { ascending: true });

        if (error) throw error;
        if (data) setAlbums(data);
      } catch (err) {
        console.error("Error cargando la discografía:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllAlbums();
  }, [currentArtist]);

  return (
    <div className="w-full min-h-screen bg-neutral-950 text-white transition-colors duration-700">
      
      <div className="w-full max-w-6xl mx-auto px-6 py-16 flex flex-col gap-10 relative z-10">
        
        {/* ENCABEZADO DE LA SECCIÓN */}
        <div className="border-b border-neutral-800/80 pb-6 transition-colors duration-700">
          <p 
            className="text-xs uppercase tracking-[0.4em] font-bold mb-2 transition-colors duration-500"
            style={{ color: currentArtist.primaryColor }}
          >
            Discografía Completa
          </p>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-50 drop-shadow-sm transition-colors duration-500">
            {currentArtist.name}
          </h1>
          <p className="text-sm text-neutral-400 mt-2 font-light">
            Explora las eras musicales. Selecciona un disco para ver sus pistas y reproducir sus audios.
          </p>
        </div>

        {/* ESTADO DE CARGA */}
        {loading ? (
          <div className="text-center py-32 text-sm text-neutral-500 font-light tracking-wide animate-pulse">
            Sincronizando discografía de {currentArtist.name}...
          </div>
        ) : (
          /* CUADRÍCULA DE TODAS LAS CARÁTULAS */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {albums.map((album) => {
              const dynamicGlow = currentArtist.albumGlowColors[album.title] || "hover:shadow-2xl hover:shadow-neutral-600/20";

              return (
                <Link 
                  href={`/albums/${album.id}`}
                  key={album.id}
                  className={`group relative bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-3 md:p-4 flex flex-col gap-3 md:gap-4 hover:border-neutral-700/60 hover:-translate-y-1 transition-all duration-300 shadow-xl ${dynamicGlow}`}
                >
                  <div className="aspect-square w-full bg-neutral-950 rounded-xl border border-neutral-800/40 flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={album.cover_url || "https://unsplash.com"} 
                      alt={album.title} 
                      className="w-full h-full object-cover brightness-105 contrast-105 group-hover:brightness-115 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>

                  <div className="flex flex-col pr-8 md:pr-10">
                    <span 
                      className="text-[10px] md:text-[11px] font-bold tracking-wider mb-0.5 transition-colors duration-500"
                      style={{ color: currentArtist.primaryColor }}
                    >
                      {album.year || "Sin año"}
                    </span>
                    <h3 className="text-sm md:text-base font-bold text-neutral-100 group-hover:text-white transition-colors truncate">
                      {album.title}
                    </h3>
                    <p className="text-[10px] md:text-xs text-neutral-500 font-light mt-0.5">
                      {album.songs && album.songs.length > 0 
                        ? `${album.songs.length} canciones` 
                        : "0 canciones"}
                    </p>
                  </div>

                  {/* BOTÓN AMARILLO DE PLAY INTERACTIVO */}
                  <div 
                    className="absolute bottom-3 right-3 md:bottom-4 md:right-4 opacity-100 scale-100 md:opacity-0 md:scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-20"
                  >
                    <div 
                      className="w-8 h-8 md:w-9 md:h-9 rounded-full text-black flex items-center justify-center font-bold shadow-md hover:scale-110 transition-all cursor-pointer"
                      style={{ backgroundColor: currentArtist.secondaryColor }}
                    >
                      <FaPlay className="text-[10px] ml-0.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
