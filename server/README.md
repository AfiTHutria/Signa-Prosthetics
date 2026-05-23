# Servidor de tokens LiveKit (Signa Prosthetics)

API mínima para que el frontend obtenga JWT y se conecte a LiveKit.

## Configuración

1. Copia `.env.example` a `.env` en esta carpeta.
2. Obtén credenciales en [LiveKit Cloud](https://cloud.livekit.io/) o tu instancia self-hosted.
3. Instala y arranca:

```bash
cd server
npm install
npm run dev
```

El frontend debe tener:

```env
VITE_API_URL=http://localhost:3000/api
VITE_LIVEKIT_URL=wss://your-project.livekit.cloud
```

## Endpoint

`GET /api/livekit/token?room=signa-consulta-user-id&identity=mariana-ortiz`

Respuesta:

```json
{
  "token": "<jwt>",
  "url": "wss://your-project.livekit.cloud"
}
```

## Agente de voz IA (LiveKit Agents)

Para voz en tiempo real, despliega un [LiveKit Agent](https://docs.livekit.io/agents/) que se una a la misma sala. El frontend detecta participantes con `isAgent === true` y deja de usar el asistente local de texto.

Identidad recomendada del agente: `signa-ai-assistant`.
