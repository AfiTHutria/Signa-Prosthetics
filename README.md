# Signa Prosthetics (ProtecAI)

Frontend de la aplicación Signa Prosthetics, construido con React y Vite.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

Copia `.env.example` a `.env` y completa las variables:

- `VITE_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_LIVEKIT_URL`

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # vista previa del build
npm run lint     # ESLint
```

## Acompañante IA (LiveKit)

El dashboard de usuario incluye **Sofia**, acompañante contextual para el diseño de prótesis.

| Modo | Requisitos | Comportamiento |
|------|------------|----------------|
| **Demo** | Solo frontend | Chat contextual sin audio/video |
| **LiveKit** | `VITE_LIVEKIT_URL` + API de tokens | Sala realtime, mic/cámara, data channel |
| **Agente voz** | LiveKit Agent worker | Detecta `isAgent` y usa audio del agente |

1. Arranca el servidor de tokens: ver [`server/README.md`](server/README.md).
2. Configura `.env` con `VITE_API_URL` y `VITE_LIVEKIT_URL`.
3. En el dashboard de usuario → **Asistente IA** → *Iniciar sesión con Sofia*.

Archivos clave:

- `src/infrastructure/livekit/livekitClient.jsx` — cliente Room (connect, tracks, cleanup)
- `src/hooks/useAiCompanion.jsx` — estado React del acompañante
- `src/components/ai-companion/AiCompanionPanel.jsx` — UI de sesión

## Modelo 3D PLY (escaneo)

Para colocar tu archivo `.ply` y mostrarlo en el landing:

| Qué | Dónde |
|-----|--------|
| **Archivo** | `public/models/TU_ARCHIVO.ply` |
| **URL en código** | `/models/TU_ARCHIVO.ply` |
| **Guía completa** | [`public/models/README.md`](public/models/README.md) |

Incluye: copiar desde Descargas, loader con `PLYLoader`, visor React y conexión en `LandingProstheticArm.jsx`.

## Estructura

Arquitectura por capas: `domain`, `application`, `infrastructure`, `presentation`, con integración de Supabase, LiveKit y escenas 3D (Three.js).
