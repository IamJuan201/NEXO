"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface AudioContextType {
  currentSong: any;
  isPlaying: boolean;
  album: any;
  currentTime: number;
  duration: number;
  playSong: (song: any, albumData: any) => void;
  pauseSong: () => void;
  seekSong: (time: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [album, setAlbum] = useState<any>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  // Estados para controlar el tiempo real de la barra
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audio) return;

    // Escucha el cambio de tiempo de reproducción
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    
    // Escucha cuando el audio carga la duración real
    const handleLoadedMetadata = () => setDuration(audio.duration);
    
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audio]);

  const playSong = (song: any, albumData: any) => {
    if (audio) {
      if (currentSong?.id === song.id) {
        audio.play();
        setIsPlaying(true);
        return;
      }
      audio.pause();
    }

    const newAudio = new Audio(song.audio_url);
    newAudio.play();

    setAudio(newAudio);
    setCurrentSong(song);
    setAlbum(albumData);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // Función para poder hacer clic en la barra y adelantar/atrasar
  const seekSong = (time: number) => {
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <AudioContext.Provider value={{ currentSong, isPlaying, album, currentTime, duration, playSong, pauseSong, seekSong }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio debe usarse dentro de un AudioProvider");
  return context;
}
