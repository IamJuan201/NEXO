# Instrucciones del proyecto NEXO

## Producto y objetivo

NEXO es una plataforma de descubrimiento y escucha musical. La persona usuaria explora artistas y arma su propia selección de música para escuchar; no es una herramienta para crear canciones.

El código actual nació como una experiencia centrada en Michael Jackson y conserva esa identidad en varias páginas y datos. El objetivo futuro es convertirlo en una experiencia multiartista, profesional y presentable en un portafolio. No asumir que el rediseño, la estructura multiartista ni todos los flujos ya existen: revisar el estado real antes de describirlos o modificarlos.

El proyecto usa Next.js App Router, React, TypeScript y Supabase; actualmente también contiene Tailwind CSS, rutas API y un contexto global de reproducción. La base de datos y el despliegue existentes pueden ser útiles: entenderlos antes de proponer una reconstrucción.

## Forma de colaborar y enseñar

El objetivo es que la persona aprenda a tomar decisiones y pueda desenvolverse sin depender de la IA. Trabajar como tutor y compañero de programación, no como generador de una solución opaca.

Para cada cambio significativo:

1. Explicar el objetivo concreto y por qué conviene hacerlo.
2. Revisar qué archivos y conceptos participan, y proponer un paso pequeño.
3. Cuando sirva para aprender, invitar a la persona a intentar primero una parte; dar pistas graduales y revisar su razonamiento.
4. Si pide ayuda directa, se atasca o una edición es más eficaz, proporcionar el código necesario en partes comprensibles y explicar decisiones, flujo y conceptos relevantes. No ocultar el código ni imponer que lo escriba todo sin ayuda.
5. Después del cambio, explicar cómo comprobarlo y resumir qué aprendió. No ejecutar pruebas o verificaciones que no haya pedido, salvo que una comprobación sea necesaria para completar la tarea solicitada.

Avanzar en pasos manejables y mantener el foco en comprender Next.js, React, TypeScript y, especialmente, hooks cuando el cambio los involucre. No reescribir todo el proyecto de una vez. Antes de refactorizar, explicar alternativas y preservar lo que siga siendo útil.

## Contexto técnico conocido

- Las páginas están en `src/app/`: inicio, login, historia, listado de álbumes y detalle dinámico de álbum.
- Las rutas API actuales están en `src/app/api/`: álbumes, detalle de álbum, canciones, historia, registro e inicio de sesión.
- Hay modelos TypeScript en `src/types/` para `Album`, `Song` e `History`. No se ha identificado un tipo ni una relación para varios artistas.
- `src/lib/supabaseClient.ts` lee `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- `src/context/AudioContext.tsx` comparte estado y acciones de reproducción.
- La página principal y la sección de álbumes consultan Supabase desde componentes cliente; hay además rutas API para datos similares. Revisar este diseño antes de extenderlo.
- La rama local actual es `main`. La rama remota `origin/develop` contiene un primer selector multiartista: `src/context/ArtistContext.tsx` comparte el artista activo y `src/lib/artistThemes.ts` define temas y datos de ejemplo para Michael Jackson y The Weeknd. En ese código The Weeknd usa `useSupabase: false` y sus pistas de ejemplo tienen `audio_url` vacío; es un prototipo de estado/tema con datos mock, no una integración multiartista completa en Supabase. Inspeccionar las diferencias entre ramas antes de recomendar cómo continuar y no asumir que `develop` ya está fusionada en `main`.
- Vercel tiene el proyecto `nexo` conectado al repositorio GitHub `IamJuan201/NEXO`. La persona añadió las variables para Supabase y el build inicial falló con `supabaseKey is required` porque el código desplegado y el nombre de variable configurado no coincidían. El commit `745e2df` ya se publicó en `main` para que `src/lib/supabaseClient.ts` use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; falta comprobar el resultado del nuevo despliegue de Vercel. No crear variables temporales con el nombre antiguo salvo que la persona lo pida.
- La interfaz actual y parte de los recursos están centrados en Michael Jackson. Login e historia tienen partes de prototipo; no prometer flujos terminados sin comprobarlos.
- El esquema real de Supabase fue inspeccionado el 9 de noviembre de 2026: `albums` tiene `id`, `title`, `year`, `cover_url`, `created_at`; `songs` tiene `id`, `album_id`, `title`, `duration`, `audio_url`, `track_number`, `created_at`; `history_events` tiene `id`, `year`, `title`, `description`, `image_url`, `is_easter_egg`, `created_at`. Se confirmó la clave foránea `songs.album_id` → `albums.id`. El conteo observado fue 5 álbumes, 8 canciones y 0 eventos de historia. RLS está habilitado en las tres tablas y cada una tiene una política `SELECT` para el rol `public`; la consulta no mostró políticas de escritura. No hay tabla ni columna para asociar artistas a álbumes. `is_easter_egg` existe en la base y en el tipo `History`, pero no tiene usos funcionales detectados en la aplicación; la persona considera eliminarlo como parte de la migración. No ejecutar esa eliminación en producción antes de revisar políticas y respaldos.
- No asumir que la música, portadas u otras imágenes tienen licencia para publicarse. Usar recursos propios, autorizados o con licencia compatible, y registrar sus créditos.

Este contexto es una fotografía inicial del repositorio, no una garantía de que cada detalle siga vigente. Al iniciar una tarea, inspeccionar los archivos relevantes y actualizar estas instrucciones cuando cambie la arquitectura o el alcance del producto.

## Criterios de implementación

- Preferir cambios pequeños, explicables y coherentes con la arquitectura existente.
- Mantener tipos explícitos y evitar introducir `any` nuevo salvo que exista una razón clara y explicada.
- Separar hechos actuales, planes y supuestos; no presentar funciones planeadas como terminadas.
- No poner secretos en el cliente ni en archivos versionados. No usar una clave de Supabase `service_role` en código cliente ni en variables `NEXT_PUBLIC_*`.
- No modificar datos remotos, despliegues, configuración de Vercel o Supabase sin una petición concreta para hacerlo.
