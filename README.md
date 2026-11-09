# NEXO

Plataforma de descubrimiento y escucha musical para explorar artistas y crear una selección personal.

## Acerca del proyecto

NEXO es un proyecto personal que se está transformando desde una experiencia centrada en Michael Jackson hacia una plataforma para explorar y escuchar música de varios artistas. La meta es convertirlo en un proyecto profesional de portafolio, aprendiendo y tomando decisiones sobre el código durante el proceso.

El proyecto está en desarrollo. La aplicación actual todavía conserva contenido y diseño dedicados a Michael Jackson; la experiencia multiartista es parte de la evolución planeada, no una función terminada.

## Estado actual

- La página de inicio presenta contenido de Michael Jackson y consulta álbumes en Supabase.
- La sección de álbumes muestra álbumes obtenidos de Supabase.
- La página de un álbum consulta sus canciones y contiene controles de reproducción.
- Hay rutas API para álbumes, canciones, historia y registro e inicio de sesión.
- La sección de historia y la pantalla de inicio de sesión siguen siendo prototipos; la interfaz no representa un flujo completo de autenticación.
- La reproducción, los datos y la autenticación dependen de que Supabase esté configurado y de que existan datos compatibles.

## Tecnologías

- Next.js 16 con App Router
- React 19
- TypeScript
- Supabase para datos y autenticación
- Tailwind CSS

## Estructura del proyecto

- `src/app/`: páginas y rutas API de Next.js.
- `src/app/api/`: endpoints para álbumes, canciones, historia y autenticación.
- `src/components/layout/`: navegación y pie de página.
- `src/context/AudioContext.tsx`: estado compartido del reproductor de audio.
- `src/lib/supabaseClient.ts`: cliente de Supabase.
- `src/types/`: tipos TypeScript para álbumes, canciones e historia.
- `public/`: iconos e imágenes locales.

En `main`, algunas páginas consultan Supabase directamente y también existen rutas API para datos similares. El esquema de Supabase revisado el 9 de noviembre de 2026 contiene `albums` (`id`, `title`, `year`, `cover_url`, `created_at`), `songs` (`id`, `album_id`, `title`, `duration`, `audio_url`, `track_number`, `created_at`) y `history_events` (`id`, `year`, `title`, `description`, `image_url`, `is_easter_egg`, `created_at`). Se confirmó la clave foránea `songs.album_id` → `albums.id`. El conteo observado es de 5 álbumes, 8 canciones y 0 eventos de historia. RLS está habilitado en las tres tablas y cada una tiene una política `SELECT` para el rol `public`; no aparecieron políticas de escritura en la consulta. No hay una tabla de artistas ni una columna que asocie los álbumes con distintos artistas, así que esa parte hará falta para la integración multiartista. El campo `is_easter_egg` está en la base, pero no se usa en la interfaz actual y está previsto evaluar su eliminación durante la migración.

### Avance en la rama `develop`

La rama remota `origin/develop` contiene un primer intento de selección multiartista. Añade `ArtistContext` y `artistThemes` para cambiar el artista activo y su tema visual. Incluye a Michael Jackson y datos de muestra para The Weeknd; en esa configuración, The Weeknd usa datos locales (`useSupabase: false`) y sus URLs de audio están vacías. Es una base de interfaz y estado, no todavía una integración multiartista respaldada por un modelo de artistas en Supabase. La copia de trabajo descrita arriba está en `main`; sus cambios no incluyen automáticamente el contenido de `develop`.

## Ejecutar localmente

### Requisitos

- Node.js compatible con la versión de Next.js del proyecto
- npm
- Un proyecto de Supabase con las tablas y datos que espera la aplicación

### Instalación

1. Clona el repositorio y entra en su carpeta.
2. Instala las dependencias con `npm install`.
3. Crea un archivo `.env.local` en la raíz con las variables que utiliza `src/lib/supabaseClient.ts`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_clave_publica_de_supabase
   ```

4. Inicia el servidor con `npm run dev`.
5. Abre [http://localhost:3000](http://localhost:3000).

No incluyas `.env.local` ni claves privadas en GitHub. La clave publishable está diseñada para el cliente; las políticas de seguridad de Supabase (RLS) deben proteger los datos. Nunca uses una clave `secret` o `service_role` en el navegador ni en variables `NEXT_PUBLIC_*`.

## Rutas API disponibles en el código

- `GET /api/albums`: lista álbumes.
- `GET /api/albums/:id`: obtiene un álbum y sus canciones.
- `GET /api/songs`: lista canciones.
- `GET /api/history`: obtiene eventos de historia.
- `POST /api/auth/register`: registra una cuenta mediante Supabase Auth.
- `POST /api/auth/login`: inicia sesión mediante Supabase Auth.

La presencia de una ruta en el código no significa que el flujo completo esté terminado o probado.

## Derechos de música e imágenes

NEXO es un proyecto de portafolio y no pretende distribuir música sin autorización. Antes de publicar o desplegar contenido, verifica que cada audio, portada, fotografía, video y texto sea propio, esté autorizado o tenga una licencia compatible; conserva la atribución y los términos correspondientes. El despliegue en Vercel no concede derechos sobre esos recursos.

## Créditos

Desarrollado por [@IamJuan201](https://github.com/IamJuan201). Los créditos y licencias de los recursos externos se documentarán cuando se confirme su procedencia y permiso de uso.

## Estado

En desarrollo. El siguiente ciclo de trabajo empieza por entender y documentar lo que ya existe antes de decidir qué conservar, refactorizar o reemplazar para soportar varios artistas.
