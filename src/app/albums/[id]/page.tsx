"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { FaPlay, FaPause, FaHeart, FaBackwardStep, FaForwardStep, FaVolumeHigh } from "react-icons/fa6";
import { useAudio } from "@/context/AudioContext"; 
import { useArtist } from "@/context/ArtistContext";

// Fallback image in case the specific vinyl image is missing
const DEFAULT_VINYL = "/images/vinilos/Vinyl.png";

export default function AlbumDetail() {
  const { id } = useParams();
  const { currentArtist } = useArtist();
  
  const [album, setAlbum] = useState<any>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedSongs, setLikedSongs] = useState<Record<string, boolean>>({});
  
  // Consumimos los estados globales de reproducción y tiempos del Contexto Global
  const { currentSong, isPlaying, currentTime, duration, playSong, pauseSong, seekSong } = useAudio();

  useEffect(() => {
    async function fetchAlbumAndSongs() {
      setLoading(true);
      
      if (!currentArtist.useSupabase) {
        // Buscar en los mockAlbums del artista activo
        const mockAlbum = currentArtist.mockAlbums.find(a => a.id === id);
        if (mockAlbum) {
          setAlbum(mockAlbum);
          setSongs(mockAlbum.songs);
        }
        setLoading(false);
        return;
      }

      // Si usa Supabase
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
  }, [id, currentArtist]);

  const handlePlaySong = (song: any) => {
    if (currentSong?.id === song.id && isPlaying) {
      pauseSong();
    } else {
      playSong(song, album);
    }
  };

  const handleVinylClick = () => {
    if (songs.length === 0) return;

    const songToPlay = isThisAlbumPlaying ? currentSong : songs[0];
    handlePlaySong(songToPlay);
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

  if (loading) return <div className="text-center py-20 text-neutral-500 animate-pulse">Cargando pistas...</div>;

  // Usa la imagen específica si existe, sino un fallback
  // Nota: Deberías agregar un mapeo para The Weeknd también si tienes imágenes de vinilo específicas.
  const vinylImages: Record<string, string> = {
    "Thriller": "/images/vinilos/ThrillerVinyl.png",
    "Bad": "/images/vinilos/BadVinyl.png",
    "Dangerous": "/images/vinilos/DangerousVinyl.png",
    "Invincible": "/images/vinilos/InvincibleVinyl.png",
    "Of the Wall": "/images/vinilos/OfftheWallVinyl.png",
    "Off the Wall": "/images/vinilos/OfftheWallVinyl.png", // Corrección del typo
  };

  const activeVinyl = album ? vinylImages[album.title] || DEFAULT_VINYL : DEFAULT_VINYL;
  const isThisAlbumPlaying = currentSong && songs.some(s => s.id === currentSong.id);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-12 text-white transition-colors duration-700">
      
      {/* COLUMNA IZQUIERDA: TOCADISCOS CIRCULAR EXCLUSIVO */}
      <div className="lg:col-span-1 flex flex-col items-center bg-neutral-950/80 backdrop-blur-sm border border-neutral-800/50 rounded-3xl p-4 lg:p-6 h-fit sticky top-20 lg:top-24 z-30 transition-all duration-700 hover:border-neutral-700/50">
        <p 
          className="text-xs tracking-widest uppercase font-bold mb-2 lg:mb-6 transition-colors duration-500"
          style={{ color: currentArtist.primaryColor }}
        >
          Reproduciendo ahora
        </p>

        <div className="relative w-36 h-36 mb-3 lg:w-64 lg:h-64 lg:mb-8 flex items-center justify-center">
          
          {/* EL DISCO DE VINILO GRANDE */}
          <div
            onClick={handleVinylClick}
            className="relative w-full h-full flex items-center justify-center cursor-pointer animate-[spin_8s_linear_infinite]"
            style={{ animationPlayState: isThisAlbumPlaying && isPlaying ? "running" : "paused" }}
          >
            {/* Imagen del vinilo local de fondo */}
            <img 
              src={activeVinyl}
              alt="Disco de Vinilo"
              className={`w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] transition-opacity duration-500 
              ${isThisAlbumPlaying ? "opacity-100" : "opacity-20"}`}
            />

            {/* MINI CARÁTULA EN EL CENTRO DEL VINILO */}
            <div className="absolute w-[26%] h-[26%] rounded-full overflow-hidden border border-black/40 z-10 bg-neutral-950">
              <img 
                src={album?.cover_url || ""} 
                alt="" 
                className="w-full h-full object-cover rounded-full"
              />
              {/* Agujero central del vinilo físico */}
              <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-neutral-950 border border-neutral-800 shadow-inner z-20" />
            </div>
          </div>

          {/* EL BRAZO DEL TOCADISCOS */}
          <div 
            className="absolute z-20 pointer-events-none transition-transform duration-500 origin-top-right
              -top-4 -right-3 w-19 h-19
              lg:-top-8 lg:-right-6 lg:w-37.5 lg:h-37.5"
            style={{ 
              transform: isThisAlbumPlaying && isPlaying ? "rotate(1deg)" : "rotate(-20deg) translateX(4px)" 
            }}
          >
            <img 
              src="/tonearm.png" 
              alt="Brazo del Tocadiscos" 
              className="w-full h-full object-contain drop-shadow-[4px_12px_10px_rgba(0,0,0,0.45)]"
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
        <h2 
          className="text-2xl font-black tracking-tight mb-2 transition-colors duration-500"
          style={{ color: currentArtist.primaryColor }}
        >
          {album?.title}
        </h2>
        
        <div className="flex flex-col border border-neutral-800/60 bg-neutral-900/10 rounded-2xl overflow-hidden transition-all duration-700">
          {songs.map((song) => {
            const isSelected = currentSong?.id === song.id;
            
            return (
              <div 
                key={song.id}
                className={`group flex flex-col border-b border-neutral-800/40 hover:bg-neutral-900/40 transition-all duration-300 ${isSelected ? 'bg-neutral-900/40' : ''}`}
              >

                {/* FILA DE LA CANCIÓN */}
                <div onClick={() => handlePlaySong(song)} className="flex items-center justify-between py-4 pr-4 pl-10 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 flex items-center shrink-0">
                      
                      {/* Mini vinilo local saliendo a la izquierda */}
                      <div 
                        className={`absolute top-1 left-0 w-10 h-10 transition-all duration-500 pointer-events-none z-0 animate-[spin_3s_linear_infinite]
                          ${isSelected ? "-translate-x-6 opacity-100" : "translate-x-0 opacity-0 group-hover:opacity-60 group-hover:-translate-x-2"}`}
                        style={{ animationPlayState: isSelected && isPlaying ? "running" : "paused" }}
                      >
                        <img src={activeVinyl} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="relative z-10 w-11 h-11 bg-neutral-950 rounded border border-neutral-800/80 overflow-hidden shadow shrink-0">
                        <img src={album?.cover_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="flex flex-col ml-2">
                      <span className="text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors">{song.title}</span>
                      <span className="text-xs text-neutral-500 transition-colors">Pista {song.track_number}</span>
                    </div>
                  </div>

                  {/* Duración */}
                  {!isSelected && (
                    <span className="text-xs font-mono text-neutral-500">
                      {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                </div>

                {/* CONSOLA DESPLEGABLE MINI CON CONTROLES */}
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
                        className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer hover:h-1.5 transition-all outline-none"
                        style={{ accentColor: currentArtist.secondaryColor }}
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
                        className="w-10 h-10 rounded-full text-black flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        style={{ backgroundColor: currentArtist.primaryColorLight }}
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