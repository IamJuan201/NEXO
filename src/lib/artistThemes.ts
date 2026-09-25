/**
 * =============================================================================
 * TEMAS POR ARTISTA — artistThemes.ts
 * =============================================================================
 * Cada artista tiene su propia paleta de colores, imágenes, y datos de ejemplo.
 * Cuando seleccionas un artista diferente, toda la UI cambia para reflejar su identidad visual.
 *
 * Si quieres agregar un nuevo artista, simplemente copia la estructura de uno existente
 * y cambia los valores. El sistema se encarga del resto.
 * =============================================================================
 */

// Estructura de un álbum de ejemplo (para artistas que aún no están en Supabase)
export interface MockAlbum {
  id: string;
  title: string;
  year: number;
  cover_url: string;
  songs: { id: string; title: string; duration: number; track_number: number; audio_url: string }[];
}

// Estructura del tema visual de cada artista
export interface ArtistTheme {
  id: string;
  name: string;                         // Nombre en mayúsculas para el hero
  subtitle: string;                     // Frase debajo del nombre
  primaryColor: string;                 // Color principal (textos destacados, bordes activos)
  secondaryColor: string;               // Color de botones (Play, CTA)
  primaryColorLight: string;            // Versión clara para estados hover
  avatarUrl: string;                    // Foto circular para el menú del Navbar
  carouselImages: string[];             // Imágenes del carrusel del hero
  albumGlowColors: Record<string, string>; // Sombras específicas por nombre de álbum
  mockAlbums: MockAlbum[];              // Álbumes hardcodeados (si no usa Supabase)
  useSupabase: boolean;                 // true = carga de la DB, false = usa mockAlbums
}

// ============================================================================
// ARTISTAS DISPONIBLES
// ============================================================================

export const artistThemes: ArtistTheme[] = [
  // ── MICHAEL JACKSON ──────────────────────────────────────────────────────
  {
    id: "michael-jackson",
    name: "MICHAEL JACKSON",
    subtitle: "El Legado Del Rey del Pop",
    primaryColor: "#D4AF37",
    secondaryColor: "#EAB308",
    primaryColorLight: "#F3F5A8",
    avatarUrl: "https://static.wikia.nocookie.net/michael-jackson-espanol/images/2/28/Michael_Jackson.webp/revision/latest?cb=20220626235224&path-prefix=es",
    carouselImages: [
      "https://www.semana.com/resizer/v2/P3I3OOPQN5EAVI5EQ775TIDOJU.jpg?auth=08fad92502590d5b49513d2491cad3721cd0d3c80e29a04bbc48165e6ac7fd0b&smart=true&quality=75&width=1280",
      "https://www.image2url.com/r2/default/gifs/1789494367033-efda0b00-0ef5-4265-a8ad-36b0403bc10b.gif",
      "https://images.mubicdn.net/images/film/389772/cache-907371-1745501821/image-w1280.jpg?size=800x",
    ],
    albumGlowColors: {
      "Thriller": "hover:shadow-2xl hover:shadow-red-600/50",
      "Bad": "hover:shadow-2xl hover:shadow-slate-400/50",
      "Dangerous": "hover:shadow-2xl hover:shadow-amber-600/50",
      "Off the Wall": "hover:shadow-2xl hover:shadow-emerald-500/50",
    },
    mockAlbums: [], // MJ usa Supabase directamente
    useSupabase: true,
  },

  // ── THE WEEKND ───────────────────────────────────────────────────────────
  {
    id: "the-weeknd",
    name: "THE WEEKND",
    subtitle: "La Voz del R&B Moderno",
    primaryColor: "#E50914",
    secondaryColor: "#FF3333",
    primaryColorLight: "#FF6666",
    avatarUrl: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb",
    carouselImages: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrED_E89w3GU_jku71g9Gmv_KOT0ZHTzTjizS_JZ9EmBApfNl7OcnduuY&s=10",
      "https://media.traveler.es/photos/6a8e9eac2838f61cd0942cbf/16:9/w_2560%2Cc_limit/GettyImages-2288364437.jpg",
      "https://image.europafm.com/clipping/cmsimages02/2024/09/08/6FCED4F6-633B-4E6F-99B8-C895895C37F7/vista-general-concierto-the-weeknd-paulo_103.jpg?crop=3556,2667,x242,y0&width=1200&height=900&optimize=low&format=webply",
    ],
    albumGlowColors: {
      "After Hours": "hover:shadow-2xl hover:shadow-red-600/50",
      "Starboy": "hover:shadow-2xl hover:shadow-purple-500/50",
      "Dawn FM": "hover:shadow-2xl hover:shadow-cyan-400/50",
      "Beauty Behind the Madness": "hover:shadow-2xl hover:shadow-orange-500/50",
    },
    mockAlbums: [
      {
        id: "tw-1",
        title: "After Hours",
        year: 2020,
        cover_url: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
        songs: [
          { id: "tw-s1", title: "Alone Again", duration: 250, track_number: 1, audio_url: "" },
          { id: "tw-s2", title: "Too Late", duration: 240, track_number: 2, audio_url: "" },
          { id: "tw-s3", title: "Hardest to Love", duration: 210, track_number: 3, audio_url: "" },
          { id: "tw-s4", title: "Scared to Live", duration: 195, track_number: 4, audio_url: "" },
          { id: "tw-s5", title: "Blinding Lights", duration: 200, track_number: 5, audio_url: "" },
        ],
      },
      {
        id: "tw-2",
        title: "Starboy",
        year: 2016,
        cover_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNHkt-WrM3spXlxtPUDbu67X0ZBWnlVy2WzPMD4TUbJiWdZxVmS487s1Ox&s=10",
        songs: [
          { id: "tw-s6", title: "Starboy", duration: 230, track_number: 1, audio_url: "" },
          { id: "tw-s7", title: "Party Monster", duration: 244, track_number: 2, audio_url: "" },
          { id: "tw-s8", title: "False Alarm", duration: 212, track_number: 3, audio_url: "" },
          { id: "tw-s9", title: "Reminder", duration: 220, track_number: 4, audio_url: "" },
          { id: "tw-s10", title: "I Feel It Coming", duration: 269, track_number: 5, audio_url: "" },
        ],
      },
      {
        id: "tw-3",
        title: "Dawn FM",
        year: 2022,
        cover_url: "https://i.scdn.co/image/ab67616d0000b2734ab2520c2c77a1d66b9ee21d",
        songs: [
          { id: "tw-s11", title: "Gasoline", duration: 212, track_number: 1, audio_url: "" },
          { id: "tw-s12", title: "How Do I Make You Love Me?", duration: 217, track_number: 2, audio_url: "" },
          { id: "tw-s13", title: "Take My Breath", duration: 339, track_number: 3, audio_url: "" },
          { id: "tw-s14", title: "Sacrifice", duration: 189, track_number: 4, audio_url: "" },
          { id: "tw-s15", title: "Out of Time", duration: 214, track_number: 5, audio_url: "" },
        ],
      },
      {
        id: "tw-4",
        title: "Beauty Behind the Madness",
        year: 2015,
        cover_url: "https://i.scdn.co/image/ab67616d0000b2737fcead687e99583072cc217b",
        songs: [
          { id: "tw-s16", title: "Can't Feel My Face", duration: 213, track_number: 1, audio_url: "" },
          { id: "tw-s17", title: "The Hills", duration: 242, track_number: 2, audio_url: "" },
          { id: "tw-s18", title: "Often", duration: 249, track_number: 3, audio_url: "" },
          { id: "tw-s19", title: "Earned It", duration: 253, track_number: 4, audio_url: "" },
          { id: "tw-s20", title: "In the Night", duration: 221, track_number: 5, audio_url: "" },
        ],
      },
    ],
    useSupabase: false, // The Weeknd aún no está en Supabase
  },
];

// Helpers
export function getArtistById(id: string): ArtistTheme | undefined {
  return artistThemes.find((a) => a.id === id);
}

export function getDefaultArtist(): ArtistTheme {
  return artistThemes[0];
}

