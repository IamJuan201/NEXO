"use client";

import { useArtist } from "@/context/ArtistContext";

export default function BackgroundBlobs() {
  const { currentArtist } = useArtist();
  
  return (
    <>
      <div 
        className="absolute top-[-20%] left-[-10%] w-125 h-125 rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ease-in-out" 
        style={{ backgroundColor: currentArtist.primaryColor, opacity: 0.08 }}
      />
      <div 
        className="absolute top-[20%] right-[-10%] w-100 h-100 rounded-full blur-[100px] pointer-events-none transition-colors duration-700 ease-in-out"
        style={{ backgroundColor: currentArtist.secondaryColor, opacity: 0.05 }}
      />
    </>
  );
}

