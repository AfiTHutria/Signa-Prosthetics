# ── Build ──────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* at build time — pass via --build-arg
ARG VITE_API_URL=
ARG VITE_INTAKE_API_URL=
ARG VITE_LIVEKIT_URL=
ARG VITE_REPORT_API_URL=
ARG VITE_REPORT_FALLBACK_DEMO=true
ARG VITE_SUPABASE_URL=
ARG VITE_SUPABASE_ANON_KEY=

ENV VITE_API_URL=$VITE_API_URL \
    VITE_INTAKE_API_URL=$VITE_INTAKE_API_URL \
    VITE_LIVEKIT_URL=$VITE_LIVEKIT_URL \
    VITE_REPORT_API_URL=$VITE_REPORT_API_URL \
    VITE_REPORT_FALLBACK_DEMO=$VITE_REPORT_FALLBACK_DEMO \
    VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

# ── Serve ──────────────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
