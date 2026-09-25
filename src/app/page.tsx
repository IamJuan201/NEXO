"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlay } from "react-icons/fa6";
import { supabase } from "@/lib/supabaseClient"; 
import { useArtist } from "@/context/ArtistContext";

export default function Home() {
  const { currentArtist } = useArtist();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Efecto para cambiar la imagen automáticamente cada 9 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % currentArtist.carouselImages.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [currentArtist.carouselImages]);

  // Efecto para buscar los datos del artista
  useEffect(() => {
    async function fetchAlbums() {
      setLoading(true);
      
      // Si el artista usa datos estáticos (como The Weeknd)
      if (!currentArtist.useSupabase) {
        setAlbums(currentArtist.mockAlbums);
        setLoading(false);
        return;
      }

      // Si usa Supabase (como Michael Jackson)
      try {
        const { data, error } = await supabase
          .from("albums") 
          .select(`*, songs (id)`);

        if (error) throw error;
        if (data) setAlbums(data);
      } catch (err) {
        console.error("Error obteniendo álbumes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbums();
    setCurrentSlide(0); // Reinicia el slider cuando cambias de artista
  }, [currentArtist]);

  return (
    <div className="w-full flex flex-col bg-neutral-950 transition-colors duration-700">
      
      {/* CARRUSEL PANTALLA COMPLETA */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden">
        
        {/* Imágenes del carrusel */}
        {currentArtist.carouselImages.map((image, index) => (
          <div
            key={image} // usar la imagen como key asegura la transición al cambiar de artista
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-30 scale-100" : "opacity-0 scale-105"
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

        {/* Degradado inferior */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-neutral-950/40 to-neutral-950" />

        {/* Contenido del Texto encima de las imágenes */}
        <div className="relative z-10 px-6 max-w-4xl flex flex-col items-center">
          <p 
            className="font-sans text-xs tracking-[0.2em] uppercase transition-colors duration-700"
            style={{ color: currentArtist.secondaryColor }}
          >
            {currentArtist.subtitle}
          </p>
          
          <h1 className="font-title text-5xl md:text-7xl font-bold tracking-widest text-white uppercase mt-2 drop-shadow-lg">
            {currentArtist.name}
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 items-center mt-12">
            <Link 
              href="/albums" 
              className="px-6 py-3 text-black font-medium text-sm tracking-wide rounded-full hover:brightness-110 transition-all duration-300 shadow-lg"
              style={{ backgroundColor: currentArtist.primaryColor }}
            >
              Escuchar Álbumes
            </Link>
            <a 
              href="#contenido" 
              className="px-6 py-3 bg-transparent border border-neutral-600 text-white font-medium text-sm tracking-wide rounded-full hover:bg-white/10 hover:border-white transition-all duration-200"
            >
              Explorar tu biblioteca
            </a>
          </div>
        </div>

        {/* Indicadores de bolitas */}
        <div className="absolute bottom-10 z-10 flex gap-2">
          {currentArtist.carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                index === currentSlide ? "w-6" : "bg-neutral-600"
              }`}
              style={{ backgroundColor: index === currentSlide ? currentArtist.primaryColor : undefined }}
            />
          ))}
        </div>
      </section>

      {/* SECCIÓN AL BAJAR */}
      <div id="contenido" className="w-full max-w-6xl mx-auto px-6 py-20 flex flex-col gap-8">
        
        <div className="flex items-end justify-between border-b border-neutral-800/80 pb-4 transition-colors duration-700">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-100">
              Más escuchado por ti
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Conectado a tu biblioteca en tiempo real</p>
          </div>
          <Link 
            href="/albums" 
            className="text-xs font-semibold hover:underline transition-colors duration-300"
            style={{ color: currentArtist.primaryColor }}
          >
            Ver historial completo &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-sm text-neutral-500 font-light tracking-wide animate-pulse">
            Cargando la discografía de {currentArtist.name}...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {albums.map((album) => {
              const dynamicGlow = currentArtist.albumGlowColors[album.title] || "hover:shadow-2xl hover:shadow-neutral-600/40";

              return (
                <Link 
                  href={`/albums/${album.id}`}
                  key={album.id}
                  className={`group relative bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-4 md:p-5 flex flex-col gap-3 md:gap-4 hover:border-neutral-700/60 hover:-translate-y-1 transition-all duration-300 shadow-xl ${dynamicGlow}`}
                >
                  <div className="aspect-square w-full bg-neutral-950 rounded-xl border border-neutral-800/40 flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={album.cover_url || "https://gstatic.com"} 
                      alt={album.title} 
                      className="w-full h-full object-cover brightness-110 contrast-105 group-hover:brightness-125 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>

                  <div className="flex flex-col pr-12">
                    <span 
                      className="text-xs font-bold tracking-wider mb-1 transition-colors duration-500"
                      style={{ color: currentArtist.primaryColor }}
                    >
                      {album.year || "Sin año"}
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-neutral-100 group-hover:text-white transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-500 font-light mt-0.5">
                      {album.songs ? `${album.songs.length} canciones` : "0 canciones"}
                    </p>
                  </div>

                  {/* Botón flotante interactivo */}
                  <div 
                    className="absolute bottom-4 right-4 md:bottom-5 md:right-5 opacity-100 scale-100 md:opacity-0 md:scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-20"
                  >
                    <div 
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full text-black flex items-center justify-center font-bold text-sm shadow-md hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: currentArtist.secondaryColor }}
                    >
                      <FaPlay className="text-[10px] md:text-xs ml-0.5" />
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
