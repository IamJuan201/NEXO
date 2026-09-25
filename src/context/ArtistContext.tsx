"use client";

/**
 * =============================================================================
 * CONTEXTO DE ARTISTA — ArtistContext.tsx
 * =============================================================================
 * Este contexto funciona EXACTAMENTE igual que tu AudioContext:
 * - Crea un estado global accesible desde cualquier componente
 * - Cualquier componente que use useArtist() puede leer el artista activo
 *   y cambiar de artista, y toda la UI reacciona automáticamente
 *
 * Es el mismo patrón: createContext → Provider con useState → hook custom
 * =============================================================================
 */

import { createContext, useContext, useState } from "react";
import { ArtistTheme, artistThemes, getDefaultArtist, getArtistById } from "@/lib/artistThemes";

// Interfaz: qué datos y funciones expone este contexto a los demás componentes
interface ArtistContextType {
  currentArtist: ArtistTheme;            // El artista seleccionado actualmente
  setArtist: (id: string) => void;       // Función para cambiar de artista por su ID
  allArtists: ArtistTheme[];             // Lista completa de artistas disponibles
}

// Crear el contexto (undefined como valor inicial, igual que en AudioContext)
const ArtistContext = createContext<ArtistContextType | undefined>(undefined);

// Provider: envuelve la app y comparte el estado del artista con todos los hijos
export function ArtistProvider({ children }: { children: React.ReactNode }) {
  // Estado del artista actual — Michael Jackson por defecto
  const [currentArtist, setCurrentArtist] = useState<ArtistTheme>(getDefaultArtist());

  // Función para cambiar de artista buscándolo por ID
  const setArtist = (id: string) => {
    const found = getArtistById(id);
    if (found) {
      setCurrentArtist(found);
    }
  };

  return (
    <ArtistContext.Provider
      value={{
        currentArtist,
        setArtist,
        allArtists: artistThemes,
      }}
    >
      {children}
    </ArtistContext.Provider>
  );
}

// Hook custom para consumir el contexto (mismo patrón que useAudio)
export function useArtist() {
  const context = useContext(ArtistContext);
  if (!context) throw new Error("useArtist debe usarse dentro de un ArtistProvider");
  return context;
}

