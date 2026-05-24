# Dónde colocar la API — Signa Prosthetics

Guía rápida: **no pegues la API en el código React**. Va en archivos `.env` en la raíz del proyecto y (si usas LiveKit) en `server/.env`.

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
| `VITE_API_URL` | `http://localhost:3000/api` | URL base de tu backend (login, tokens LiveKit, etc.) |
| `VITE_LIVEKIT_URL` | `wss://tu-proyecto.livekit.cloud` | Servidor WebSocket de LiveKit (asistente IA en vivo) |
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Opcional — base de datos Supabase |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbG...` | Opcional — clave pública de Supabase |
| `VITE_REPORT_API_URL` | `https://....ngrok-free.dev/datos_reporte` | Reporte clínico — panel profesional |

### Ejemplo completo (desarrollo local)

```env
VITE_API_URL=http://localhost:3000/api
VITE_LIVEKIT_URL=wss://signa-demo-xxxxx.livekit.cloud
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

> **Importante:** En Vite solo las variables que empiezan con `VITE_` llegan al navegador. Después de cambiar `.env`, reinicia `npm run dev`.

### Dónde se usa en el código (no edites salvo que sepas qué haces)

| Archivo | Uso |
|---------|-----|
| `src/shared/constants/env.jsx` | Lee `import.meta.env.VITE_*` |
| `src/infrastructure/api/axiosClient.jsx` | `baseURL` = `VITE_API_URL` |
| `src/services/authService.jsx` | `POST /auth/user/login`, `POST /auth/professional/login` |
| `src/infrastructure/livekit/livekitTokenApi.jsx` | `GET /livekit/token?room=...&identity=...` |

---

## 2. Servidor de tokens (carpeta `server/`)

Incluido en el repo para **LiveKit** (JWT de sala). No es tu API de negocio completa, pero es lo que el frontend llama hoy para el asistente IA.

### Archivo que debes crear

```
Signa-Prostetics/server/.env
```

```bash
cd server
copy .env.example .env
```

### Variables en `server/.env`

| Variable | Dónde obtenerla |
|----------|-----------------|
| `LIVEKIT_API_KEY` | [LiveKit Cloud](https://cloud.livekit.io/) → proyecto → API Keys |
| `LIVEKIT_API_SECRET` | Misma pantalla |
| `LIVEKIT_URL` | `wss://...` de tu proyecto LiveKit |
| `PORT` | `3000` (por defecto) |

### Arrancar el servidor

```bash
cd server
npm install
npm run dev
```

Debe responder en: `http://localhost:3000/api/health`

El frontend con `VITE_API_URL=http://localhost:3000/api` llamará a:

```
GET http://localhost:3000/api/livekit/token?room=...&identity=...
```

---

## 3. Si tienes TU propia API (backend externo)

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
| `GET` | `/livekit/token?room=&identity=` | Asistente IA LiveKit |

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

Respuesta de LiveKit token:

```json
{
  "token": "jwt-livekit",
  "url": "wss://tu-proyecto.livekit.cloud"
}
```

3. **No** pongas `LIVEKIT_API_SECRET` en el frontend. Solo en el servidor.

---

## 4. Modo demo (sin API)

Si dejas `VITE_API_URL` vacío o el backend no responde:

- El **login** usa cuentas demo locales (`authService.jsx`).
- El **asistente IA** funciona en modo texto demo (sin LiveKit).

---

## 5. Comprobar que todo está bien

1. **API local**

```bash
# Terminal 1 — servidor tokens
cd server && npm run dev

# Terminal 2 — frontend
npm run dev
```

2. Abre en el navegador: `http://localhost:3000/api/health` → debe devolver `{"ok":true,...}`

3. En el dashboard usuario → **Asistente IA** → si LiveKit está bien, conectará sin el aviso de configuración.

---

## Resumen en una imagen mental

```
Tu PC
├── .env                    ← VITE_API_URL, VITE_LIVEKIT_URL (frontend)
├── src/.../axiosClient.jsx ← usa VITE_API_URL automáticamente
└── server/
    └── .env                ← LIVEKIT_API_KEY, SECRET, URL (backend)
```

**¿Dudas?** Revisa también `server/README.md` y `.env.example` en la raíz.
