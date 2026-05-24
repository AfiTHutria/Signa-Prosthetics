# Dónde colocar la API — Signa Prosthetics

Guía rápida: **no pegues la API en el código React**. Va en archivos `.env` en la raíz del proyecto.

---

## 1. Frontend (React + Vite)

### Archivo que debes crear

```
Signa-Prostetics/.env
```

Copia desde la raíz del proyecto:

```bash
copy .env.example .env
```

### Variables en `.env` (raíz)

| Variable | Ejemplo | Para qué sirve |
|----------|---------|----------------|
| `VITE_API_URL` | `http://localhost:3000/api` | URL base de tu backend (login, etc.) |
| `VITE_INTAKE_API_URL` | `/signa-intake-api` | signa-api — entrevista de voz (Asistente IA) |
| `VITE_LIVEKIT_URL` | `wss://tu-proyecto.livekit.cloud` | Opcional — legacy |
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Opcional — base de datos Supabase |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbG...` | Opcional — clave pública de Supabase |
| `VITE_REPORT_API_URL` | `https://....ngrok-free.dev/datos_reporte` | Reporte clínico — panel profesional |

### Ejemplo completo (desarrollo local)

```env
VITE_API_URL=http://localhost:3000/api
VITE_INTAKE_API_URL=/signa-intake-api
VITE_LIVEKIT_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

> **Importante:** En Vite solo las variables que empiezan con `VITE_` llegan al navegador. Después de cambiar `.env`, reinicia `npm run dev`.

### Dónde se usa en el código

| Archivo | Uso |
|---------|-----|
| `src/shared/constants/env.jsx` | Lee `import.meta.env.VITE_*` |
| `src/infrastructure/api/axiosClient.jsx` | `baseURL` = `VITE_API_URL` |
| `src/services/authService.jsx` | `POST /auth/user/login`, `POST /auth/professional/login` |
| `src/infrastructure/livekit/intakeTokenApi.jsx` | `GET /api/livekit/token` en signa-api |

---

## 2. Asistente IA — signa-api (entrevista de voz)

El **Asistente IA** usa el proyecto [signa-api](../signa-api/) como backend. signa-api genera tokens LiveKit, despacha el agente `intake-agent` y ejecuta la conversación de voz con Gemini.

### Arrancar signa-api

```bash
cd signa-api
npm install
# Configura .env con LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, GEMINI_API_KEY
npm run dev:all   # web server + agent worker
```

Debe responder en: `http://localhost:3000/api/health`

### Proxy Vite (desarrollo, evita CORS)

signa-api no expone CORS. En desarrollo, Vite proxifica las peticiones:

```
Frontend (:5173) → /signa-intake-api/api/livekit/token → signa-api (:3000)
```

Configura en `.env`:

```env
VITE_INTAKE_API_URL=/signa-intake-api
```

El proxy está definido en `vite.config.js`.

### Producción

En producción, apunta directamente a signa-api:

```env
VITE_INTAKE_API_URL=https://tu-signa-api.com
```

O sirve frontend y signa-api desde el mismo origen. Si son dominios distintos, signa-api necesitará headers CORS en rutas `/api/*`.

### Flujo de prueba

1. Terminal 1: `cd signa-api && npm run dev:all`
2. Terminal 2: `cd Signa-Prosthetics && npm run dev`
3. Login demo → Dashboard usuario → **Asistente IA**
4. **Iniciar entrevista** → permitir micrófono → conversación de voz

---

## 3. Servidor de tokens local (carpeta `server/`)

Incluido en el repo como alternativa legacy para tokens LiveKit. **No se usa para Asistente IA** (usa signa-api). Puede servir para otras integraciones LiveKit.

Ver [`server/README.md`](../server/README.md) si lo necesitas.

---

## 4. Si tienes TU propia API (backend externo)

Si tu API está en otro host (Railway, Render, Supabase Edge, etc.):

1. Pon la URL base en **`.env`** del frontend:

```env
VITE_API_URL=https://tu-api.com/api
```

2. Tu backend debe exponer (como mínimo lo que usa el proyecto):

| Método | Ruta | Usado por |
|--------|------|-----------|
| `POST` | `/auth/user/login` | Login usuario |
| `POST` | `/auth/professional/login` | Login profesional |

Respuesta esperada del login:

```json
{
  "token": "jwt-o-token",
  "user": {
    "id": "uuid",
    "email": "correo@ejemplo.com",
    "name": "Nombre",
    "role": "user"
  }
}
```

3. **No** pongas `LIVEKIT_API_SECRET` en el frontend. Solo en el servidor.

---

## 5. Modo demo (sin API)

Si dejas `VITE_API_URL` vacío o el backend no responde:

- El **login** usa cuentas demo locales (`authService.jsx`).
- El **Asistente IA** requiere `VITE_INTAKE_API_URL` — sin ella muestra un aviso de configuración.

---

## Resumen

```
Tu PC
├── Signa-Prosthetics/
│   ├── .env                         ← VITE_INTAKE_API_URL=/signa-intake-api
│   └── vite.config.js               ← proxy → signa-api :3000
└── signa-api/
    ├── .env                         ← LIVEKIT_*, GEMINI_API_KEY
    └── npm run dev:all              ← web + intake-agent worker
```

**¿Dudas?** Revisa `.env.example` en la raíz y el README de signa-api.
