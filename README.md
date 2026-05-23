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

## Estructura

Arquitectura por capas: `domain`, `application`, `infrastructure`, `presentation`, con integración de Supabase, LiveKit y escenas 3D (Three.js / React Three Fiber).
