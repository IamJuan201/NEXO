"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { FaPlay, FaPause } from "react-icons/fa6";

// Usamos strings directos apuntando a la raíz del servidor web (carpeta public nativa)
const vinylImages: Record<string, string> = {
  "Thriller": "/images/vinilos/ThrillerVinyl.png",
  "Bad": "/images/vinilos//BadVinyl.png",
  "Dangerous": "/images/vinilos//DangerousVinyl.png",
  "Invincible": "/images/vinilos//InvincibleVinyl.png",
  "Of the Wall": "/images/vinilos//OfftheWallVinyl.png",
};

export default function AlbumDetail() {
  const { id } = useParams();
  const [album, setAlbum] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ESTADOS DEL REPRODUCTOR GLOBAL
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchAlbumAndSongs() {
      try {
        const { data: albumData } = await supabase.from("albums").select("*").eq("id", id).single();
        const { data: songsData } = await supabase.from("songs").select("*").eq("album_id", id).order("track_number", { ascending: true });

        if (albumData) setAlbum(albumData);
        if (songsData) setSongs(songsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchAlbumAndSongs();
  }, [id]);

  // CONTROLADOR DE AUDIO
  const handlePlaySong = (song: any) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audio?.pause();
        setIsPlaying(false);
      } else {
        audio?.play();
        setIsPlaying(true);
      }
    } else {
      if (audio) audio.pause();
      const newAudio = new Audio(song.audio_url);
      newAudio.play();
      setAudio(newAudio);
      setCurrentSong(song);
      setIsPlaying(true);
      
      newAudio.onended = () => setIsPlaying(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-neutral-500 animate-pulse">Cargando canciones...</div>;

  // Si el título no coincide con el diccionario, usamos Thriller por defecto para evitar errores de compilación
  const activeVinyl = album ? vinylImages[album.title] || "/ThrillerVinyl.png" : "/ThrillerVinyl.png";

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 text-white">
      
      {/* COLUMNA IZQUIERDA: REPRODUCTOR */}
      <div className="lg:col-span-1 flex flex-col items-center bg-neutral-900/20 border border-neutral-800/50 rounded-3xl p-6 h-fit sticky top-24">
        <p className="text-xs text-[#D4AF37] tracking-widest uppercase font-bold mb-4">Reproduciendo ahora</p>
        
        {/* CARÁTULA CON VINILO INTERACTIVO */}
        <div className="relative w-64 h-64 mb-6 group mr-10">
          
          {/* Vinilo real que sale hacia la derecha y gira */}
          <div className={`absolute w-70 h-70 transition-all duration-700 pointer-events-none
            ${isPlaying ? "animate-[spin_4s_linear_infinite]" : ""}`}
          >
            {/* Si la imagen falla o se borra el texto, el alt no romperá el layout gracias a ser un bloque oculto */}
            <img 
              src={activeVinyl} 
              alt="" 
              className=""
            />  
          </div>

        </div>

        {/* Info de la canción activa */}
        <div className="text-center mt-2">
          <h3 className="text-xl font-bold text-neutral-100">{currentSong?.title || "Selecciona una canción"}</h3>
          <p className="text-sm text-neutral-500 mt-1">{album?.title}</p>
        </div>
      </div>

      {/* COLUMNA DERECHA: LISTADO DE CANCIONES */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <h2 className="text-2xl font-black tracking-tight text-[#D4AF37] mb-2">{album?.title}</h2>
        
        <div className="flex flex-col border border-neutral-800/60 bg-neutral-900/10 rounded-2xl overflow-hidden">
          {songs.map((song) => {
            const isSelected = currentSong?.id === song.id;
            
            return (
              <div 
                key={song.id}
                className={`group flex items-center justify-between p-4 border-b border-neutral-800/40 hover:bg-neutral-900/40 transition-colors duration-200 ${isSelected ? 'bg-neutral-900/30' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handlePlaySong(song)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 group-hover:text-[#EAB308] group-hover:bg-neutral-800 transition-all cursor-pointer z-20 shrink-0"
                  >
                    {isSelected && isPlaying ? <FaPause className="text-xs" /> : <FaPlay className="text-xs ml-0.5" />}
                  </button>

                  {/* CONTENEDOR DEL VINILO PEQUEÑO EN LA FILA */}
                  <div className="relative w-12 h-12 flex items-center shrink-0">
                    <div className={`absolute top-1 -left-2 w-10 h-10 transition-all duration-500 pointer-events-none z-0
                      ${isSelected ? "-translate-x-4 opacity-100" : "translate-x-0 opacity-0 group-hover:opacity-60 group-hover:-translate-x-2"}
                      ${isSelected && isPlaying ? "animate-[spin_3s_linear_infinite]" : ""}`}
                    >
                      <img 
                        src={activeVinyl} 
                        alt="" 
                        className="w-full h-full object-contain" 
                      />
                    </div>

                    {/* Mini Carátula cuadrada */}
                    <div className="relative z-10 w-11 h-11 bg-neutral-950 rounded border border-neutral-800/80 overflow-hidden shadow shrink-0">
                      <img 
                        src={album?.cover_url} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col ml-2">
                    <span className="text-sm font-semibold text-neutral-200 group-hover:text-white">{song.title}</span>
                    <span className="text-xs text-neutral-500">Pista {song.track_number}</span>
                  </div>
                </div>

                <span className="text-xs font-mono text-neutral-500">
                  {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
