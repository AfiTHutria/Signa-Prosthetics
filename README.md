# Signa Prosthetics (ProtecAI)

Frontend de la aplicación Signa Prosthetics, construido con React y Vite.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

Copia `.env.example` a `.env` en la **raíz** y completa las variables:

- `VITE_API_URL` — URL de tu backend (ej. `http://localhost:3000/api`)
- `VITE_INTAKE_API_URL` — URL de signa-api para entrevista de voz (ej. `/signa-intake-api` en dev)
- `VITE_LIVEKIT_URL` — WebSocket LiveKit (opcional, legacy)
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — opcional

**Guía detallada:** [`docs/CONFIGURACION-API.md`](docs/CONFIGURACION-API.md)

Para **Asistente IA** (entrevista de voz), arranca signa-api con `npm run dev:all` en el proyecto `signa-api/` (ver sección en la guía de API).

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # vista previa del build
npm run lint     # ESLint
```

## Asistente IA — Entrevista de voz (signa-api)

El dashboard de usuario incluye una **entrevista de evaluación protésica** por voz, conectada a [signa-api](../signa-api/) y el agente LiveKit `intake-agent`.

| Requisito | Descripción |
|-----------|-------------|
| **signa-api** | Backend de tokens + despacho de agente |
| **Agent worker** | `npm run dev:all` en signa-api (web + agente Gemini) |
| **`VITE_INTAKE_API_URL`** | Base URL de signa-api (proxy dev: `/signa-intake-api`) |

1. Arranca signa-api: `cd signa-api && npm run dev:all`
2. Configura `.env` con `VITE_INTAKE_API_URL=/signa-intake-api`
3. Arranca el frontend: `npm run dev`
4. Dashboard usuario → **Asistente IA** → *Iniciar entrevista*

Archivos clave:

- `src/infrastructure/livekit/livekitClient.jsx` — cliente Room (connect, audio, cleanup)
- `src/infrastructure/livekit/intakeTokenApi.jsx` — tokens desde signa-api
- `src/hooks/useVoiceIntake.jsx` — estado React de la entrevista
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
