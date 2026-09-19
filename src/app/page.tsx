"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlay } from "react-icons/fa6";

// Importamos el cliente real de Supabase desde la raíz de tu carpeta src
import { supabase } from "@/lib/supabaseClient"; 

// Imágenes de fondo de alta calidad para el carrusel de MJ
const carouselImages = [
  "https://www.semana.com/resizer/v2/P3I3OOPQN5EAVI5EQ775TIDOJU.jpg?auth=08fad92502590d5b49513d2491cad3721cd0d3c80e29a04bbc48165e6ac7fd0b&smart=true&quality=75&width=1280",
  "https://www.image2url.com/r2/default/gifs/1789494367033-efda0b00-0ef5-4265-a8ad-36b0403bc10b.gif",
  "https://images.mubicdn.net/images/film/389772/cache-907371-1745501821/image-w1280.jpg?size=800x",
];

// Mapeador de colores basado en el título del álbum que viene de tu DB
const albumGlowColors: Record<string, string> = {
  "Thriller": "hover:shadow-2xl hover:shadow-red-600/50",
  "Bad": "hover:shadow-2xl hover:shadow-slate-400/50",
  "Dangerous": "hover:shadow-2xl hover:shadow-amber-600/50",
  "Off the Wall": "hover:shadow-2xl hover:shadow-emerald-500/50",
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Estados para almacenar los álbumes reales de tu base de datos y controlar la carga
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Efecto para cambiar la imagen automáticamente cada 9 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  // Efecto para realizar la consulta en tiempo real a Supabase al montar el componente
  useEffect(() => {
    async function fetchAlbums() {
      try {
        const { data, error } = await supabase
          .from("albums") // Asegúrate de que tu tabla en Supabase se llame exactamente "albums"
          .select(`
            *,
            songs (id)
            `);

        if (error) throw error;
        if (data) setAlbums(data);
      } catch (err) {
        console.error("Error obteniendo álbumes desde Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbums();
  }, []);

  return (
    <div className="w-full flex flex-col bg-neutral-950">
      
      {/* CARRUSEL PANTALLA COMPLETA */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden">
        
        {/* Imágenes del carrusel con transiciones fluidas de opacidad */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-30 scale-100" : "opacity-0 scale-105"
            } transition-transform duration-5000ms`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

        {/* Degradado inferior para suavizar el corte al bajar la página */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-neutral-950/40 to-neutral-950" />

        {/* Contenido del Texto encima de las imágenes */}
        <div className="relative z-10 px-6 max-w-4xl flex flex-col items-center">
          <p className="font-sans text-xs tracking-[0.2em] text-yellow-500 uppercase">
            El Legado Del Rey del Pop
          </p>
          
          <h1 className="font-title text-5xl md:text-7xl font-bold tracking-widest text-white uppercase">
            MICHAEL JACKSON
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 items-center mt-12">
            <Link 
              href="/albums" 
              className="px-6 py-3 bg-[#EAB308] text-black font-medium text-sm tracking-wide rounded-full hover:bg-[#F3F5A8] transition-all duration-200 shadow-lg"
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

        {/* Indicadores de bolitas abajo del carrusel */}
        <div className="absolute bottom-10 z-10 flex gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? "bg-[#D4AF37] w-6" : "bg-neutral-600"
              }`}
            />
          ))}
        </div>
      </section>

      {/* SECCIÓN AL BAJAR */}
      <div id="contenido" className="w-full max-w-6xl mx-auto px-6 py-20 flex flex-col gap-8">
        
        <div className="flex items-end justify-between border-b border-neutral-800/80 pb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-100">
              Más escuchado por ti
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Conectado a tu biblioteca en tiempo real</p>
          </div>
          <Link href="/albums" className="text-xs font-semibold text-[#D4AF37] hover:text-[#F3E5AB] hover:underline transition-all">
            Ver historial completo &rarr;
          </Link>
        </div>

        {/* Validación de estado de carga mientras Supabase responde */}
        {loading ? (
          <div className="text-center py-16 text-sm text-neutral-500 font-light tracking-wide animate-pulse">
            Cargando tu biblioteca desde Supabase...
          </div>
        ) : (
          /* Cuadrícula de Tarjetas dinámicas alimentadas por Supabase */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {albums.map((album) => {
              // Obtenemos el color difuminado del mapeador. Si el álbum no coincide, asigna un dorado por defecto.
              const dynamicGlow = albumGlowColors[album.title] || "hover:shadow-2xl hover:shadow-yellow-600/40";

              return (
                <Link 
                  href={`/albums/${album.id}`}
                  key={album.id}
                  className={`group relative bg-neutral-900/30 border border-neutral-800/60 rounded-2xl p-4 flex flex-col gap-4 hover:border-neutral-700/60 hover:-translate-y-1 transition-all duration-300 shadow-xl ${dynamicGlow}`}
                >
                  {/* Contenedor de la carátula */}
                  <div className="aspect-square w-full bg-neutral-950 rounded-xl border border-neutral-800/40 flex items-center justify-center relative overflow-hidden">
                    {/* Renderiza la imagen real de tu base de datos o una alternativa si viene vacía */}
                    <img 
                      src={album.cover_url || "https://gstatic.com"} 
                      alt={album.title} 
                      className="w-full h-full object-cover brightness-110 contrast-105 group-hover:brightness-125 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>

                  {/* Información extraída de las columnas de Supabase */}
                  <div className="flex flex-col pr-12">
                    <span className="text-xs font-bold text-[#D4AF37]/80 tracking-wider mb-1">
                      {album.year || "Sin año"}
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-neutral-100 group-hover:text-white transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-500 font-light mt-0.5">
                      {album.songs ? `${album.songs.length} canciones` : "0 canciones"}
                    </p>
                  </div>

                  {/* Botón flotante interactivo (siempre visible en celular, oculto en PC hasta hacer hover) */}
                  <div 
                    className="absolute bottom-4 right-4 md:bottom-5 md:right-5 opacity-100 scale-100 md:opacity-0 md:scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-20"
                  >
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#EAB308] text-black flex items-center justify-center font-bold text-sm shadow-md hover:scale-110 transition-transform cursor-pointer">
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
