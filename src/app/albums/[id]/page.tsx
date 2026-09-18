"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { FaPlay, FaPause, FaHeart, FaBackwardStep, FaForwardStep, FaVolumeHigh } from "react-icons/fa6";
import { useAudio } from "@/context/AudioContext"; 

// Mapeador corregido con base en las etiquetas de Supabase y tus archivos locales en public
const vinylImages: Record<string, string> = {
  "Thriller": "/images/vinilos/ThrillerVinyl.png",
  "Bad": "/images/vinilos/BadVinyl.png",
  "Dangerous": "/images/vinilos/DangerousVinyl.png",
  "Invincible": "/images/vinilos/InvincibleVinyl.png",
  "Of the Wall": "/images/vinilos/OfftheWallVinyl.png",
};

export default function AlbumDetail() {
  const { id } = useParams();
  const [album, setAlbum] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedSongs, setLikedSongs] = useState<Record<string, boolean>>({});
  
  // Consumimos los estados globales de reproducción y tiempos del Contexto Global
  const { currentSong, isPlaying, currentTime, duration, playSong, pauseSong, seekSong } = useAudio();

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

  const handlePlaySong = (song: any) => {
    if (currentSong?.id === song.id && isPlaying) {
      pauseSong();
    } else {
      playSong(song, album);
    }
  };

  const toggleLike = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se pause la canción al interactuar con el corazón
    setLikedSongs(prev => ({ ...prev, [songId]: !prev[songId] }));
  };

  // Formatea los segundos para convertirlos en formato musical estándar (0:00)
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="text-center py-20 text-neutral-500 animate-pulse">Cargando canciones...</div>;

  const activeVinyl = album ? vinylImages[album.title] || "/images/vinilos/ThrillerVinyl.png" : "/images/vinilos/ThrillerVinyl.png";
  const isThisAlbumPlaying = currentSong && songs.some(s => s.id === currentSong.id);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 text-white">
      
      {/* COLUMNA IZQUIERDA: TOCADISCOS CIRCULAR EXCLUSIVO */}
      <div className="lg:col-span-1 flex flex-col items-center bg-neutral-900/20 border border-neutral-800/50 rounded-3xl p-6 h-fit sticky top-24">
        <p className="text-xs text-[#D4AF37] tracking-widest uppercase font-bold mb-6">Reproduciendo ahora</p>
        
        {/* CONTENEDOR CENTRAL DEL TOCADISCOS */}
        <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
          
          {/* EL DISCO DE VINILO GRANDE (Gira sobre su propio eje y congela su ángulo al pausar) */}
          <div 
            className="relative w-full h-full flex items-center justify-center animate-[spin_8s_linear_infinite]"
            style={{ animationPlayState: isThisAlbumPlaying && isPlaying ? "running" : "paused" }}
          >
            {/* Imagen del vinilo local de fondo */}
            <img 
              src={isThisAlbumPlaying ? activeVinyl : "/images/vinilos/ThrillerVinyl.png"} 
              alt="Disco de Vinilo" 
              className={`w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] transition-opacity duration-500 
                ${isThisAlbumPlaying ? "opacity-100" : "opacity-20"}`}
            />

            {/* MINI CARÁTULA EN EL CENTRO DEL VINILO (Gira junto con el disco) */}
            <div className="absolute w-[26%] h-[26%] rounded-full overflow-hidden border border-black/40 z-10 bg-neutral-950">
              <img 
                src={album?.cover_url || "https://unsplash.com"} 
                alt="" 
                className="w-full h-full object-cover rounded-full"
              />
              {/* Agujero central del vinilo físico */}
              <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-neutral-950 border border-neutral-800 shadow-inner z-20" />
            </div>
          </div>

          {/* EL BRAZO DEL TOCADISCOS (Estático, la aguja rota hacia adentro al dar Play) */}
          <div 
            className="absolute -top-6 -right-4 w-32 h-32 z-20 pointer-events-none transition-transform duration-500 origin-top-right"
            style={{ transform: isThisAlbumPlaying && isPlaying ? "rotate(-2deg)" : "rotate(-24deg) translateX(8px)" }}
          >
            <img 
              src="/tonearm.png" 
              alt="Brazo del Tocadiscos" 
              className="w-full h-full object-contain drop-shadow-[4px_10px_8px_rgba(0,0,0,0.5)]"
            />
          </div>

        </div>

        <div className="text-center mt-2">
          <h3 className="text-xl font-bold text-neutral-100">
            {isThisAlbumPlaying ? currentSong.title : "Selecciona una canción"}
          </h3>
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
                className={`group flex flex-col border-b border-neutral-800/40 hover:bg-neutral-900/40 transition-all duration-300 ${isSelected ? 'bg-neutral-900/40' : ''}`}
              >
                {/* FILA DE LA CANCIÓN */}
                <div onClick={() => handlePlaySong(song)} className="flex items-center justify-between p-4 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 flex items-center shrink-0">
                      {/* Mini vinilo local saliendo a la izquierda */}
                      <div 
                        className={`absolute top-1 -left-2 w-10 h-10 transition-all duration-500 pointer-events-none z-0 animate-[spin_3s_linear_infinite]
                          ${isSelected ? "-translate-x-4 opacity-100" : "translate-x-0 opacity-0 group-hover:opacity-60 group-hover:-translate-x-2"}`}
                        style={{ animationPlayState: isSelected && isPlaying ? "running" : "paused" }}
                      >
                        <img src={activeVinyl} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="relative z-10 w-11 h-11 bg-neutral-950 rounded border border-neutral-800/80 overflow-hidden shadow shrink-0">
                        <img src={album?.cover_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="flex flex-col ml-2">
                      <span className="text-sm font-semibold text-neutral-200 group-hover:text-white">{song.title}</span>
                      <span className="text-xs text-neutral-500">Pista {song.track_number}</span>
                    </div>
                  </div>

                  {/* Duración (Oculta al seleccionarse para no amontonar la vista) */}
                  {!isSelected && (
                    <span className="text-xs font-mono text-neutral-500">
                      {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                </div>

                {/* CONSOLA DESPLEGABLE MINI CON CONTROLES (Estilo Spotify) */}
                                {isSelected && (
                  <div className="px-14 pb-5 pt-1 flex flex-col gap-4 w-full max-w-xl mx-auto">
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-[10px] font-mono text-neutral-400 min-w-7 text-right">
                        {formatTime(currentTime)}
                      </span>

                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => seekSong(Number(e.target.value))}
                        className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#EAB308] hover:h-1.5 transition-all outline-none"
                      />

                      <span className="text-[10px] font-mono text-neutral-400 min-w-7">
                        {formatTime(duration || song.duration)}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-6 text-neutral-400">
                      <button
                        onClick={(e) => toggleLike(song.id, e)}
                        className={`text-base cursor-pointer transition-colors duration-200 hover:text-white ${likedSongs[song.id] ? "text-red-500 hover:text-red-400" : ""}`}
                      >
                        <FaHeart className={likedSongs[song.id] ? "" : "opacity-40"} />
                      </button>

                      <button className="text-lg cursor-pointer transition-colors duration-200 hover:text-white">
                        <FaBackwardStep />
                      </button>

                      <button
                        onClick={() => handlePlaySong(song)}
                        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        {isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
                      </button>

                      <button className="text-lg cursor-pointer transition-colors duration-200 hover:text-white">
                        <FaForwardStep />
                      </button>

                      <button className="text-base cursor-pointer transition-colors duration-200 hover:text-white">
                        <FaVolumeHigh />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}