"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlay } from "react-icons/fa6";
import { supabase } from "@/lib/supabaseClient";

// Mapeador de colores para los destellos traseros (por si quieres mantener la identidad de cada era)
const albumGlowColors: Record<string, string> = {
  "Thriller": "hover:shadow-2xl hover:shadow-red-600/30",
  "Bad": "hover:shadow-2xl hover:shadow-slate-400/30",
  "Dangerous": "hover:shadow-2xl hover:shadow-amber-600/30",
  "Off the Wall": "hover:shadow-2xl hover:shadow-emerald-500/30",
};

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllAlbums() {
      try {
        // Pedimos todos los álbumes y contamos sus canciones vinculadas
        const { data, error } = await supabase
          .from("albums")
          .select(`
            *,
            songs (id)
          `)
          .order("year", { ascending: true }); // Los ordenamos cronológicamente

        if (error) throw error;
        if (data) setAlbums(data);
      } catch (err) {
        console.error("Error cargando la discografía:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllAlbums();
  }, []);

  return (
    <div className="w-full min-h-screen bg-neutral-950 text-white">
      
      {/* Luces decorativas ambientales de fondo */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-6 py-16 flex flex-col gap-10 relative z-10">
        
        {/* ENCABEZADO DE LA SECCIÓN */}
        <div className="border-b border-neutral-800/80 pb-6">
          <p className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-2">
            Discografía Completa
          </p>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-50">
            Colección de Álbumes
          </h1>
          <p className="text-sm text-neutral-400 mt-2 font-light">
            Explora las eras musicales del Rey del Pop. Selecciona un disco para ver sus pistas y reproducir sus audios.
          </p>
        </div>

        {/* ESTADO DE CARGA */}
        {loading ? (
          <div className="text-center py-32 text-sm text-neutral-500 font-light tracking-wide animate-pulse">
            Sincronizando discografía con Supabase...
          </div>
        ) : (
          /* CUADRÍCULA DE TODAS LAS CARÁTULAS */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album) => {
              const dynamicGlow = albumGlowColors[album.title] || "hover:shadow-2xl hover:shadow-yellow-600/20";

              return (
                <div 
                  key={album.id}
                  className={`group relative bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-4 flex flex-col gap-4 hover:border-neutral-700/60 hover:-translate-y-1 transition-all duration-300 shadow-xl ${dynamicGlow}`}
                >
                  {/* Contenedor de la Carátula física */}
                  <div className="aspect-square w-full bg-neutral-950 rounded-xl border border-neutral-800/40 flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={album.cover_url || "https://unsplash.com"} 
                      alt={album.title} 
                      className="w-full h-full object-cover brightness-105 contrast-105 group-hover:brightness-115 transition-all duration-300"
                    />
                    {/* Efecto de destello diagonal que cruza el disco en hover */}
                    <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>

                  {/* Detalles informativos */}
                  <div className="flex flex-col pr-10"> {/* Añadimos padding-right para que el texto no choque con el botón */}
                    <span className="text-[10px] font-bold text-[#D4AF37]/80 tracking-wider mb-0.5">
                      {album.year || "Sin año"}
                    </span>
                    <h3 className="text-base font-bold text-neutral-100 group-hover:text-white transition-colors truncate">
                      {album.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-light mt-0.5">
                      {album.songs && album.songs.length > 0 
                        ? `${album.songs.length} canciones` 
                        : "0 canciones"}
                    </p>
                  </div>

                  {/* BOTÓN AMARILLO DE PLAY INTERACTIVO -> CONECTADO A LA RUTA DINÁMICA */}
                  <Link 
                    href={`/albums/${album.id}`}
                    className="absolute bottom-4 right-4 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-20"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#EAB308] text-black flex items-center justify-center font-bold shadow-md hover:scale-110 hover:bg-[#F3F5A8] transition-all cursor-pointer">
                      <FaPlay className="text-[10px] ml-0.5" />
                    </div>
                  </Link>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
