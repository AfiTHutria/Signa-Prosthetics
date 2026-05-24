# Reporte clínico — panel profesional

Flujo para mostrar los datos de `GET /datos_reporte` (paciente **Carlos Mendoza López** y similares).

## 1. Configura `.env` (raíz del proyecto)

```env
VITE_REPORT_API_URL=/api/datos_reporte
VITE_REPORT_FALLBACK_DEMO=true
```

- **`/api/datos_reporte`**: en desarrollo, Vite redirige a tu ngrok (ver `vite.config.js`).
- **URL directa** (sin proxy):

```env
VITE_REPORT_API_URL=https://neuter-acrobat-flatten.ngrok-free.dev/datos_reporte
```

Reinicia: `npm run dev`

## 2. Formato JSON esperado

La API debe devolver JSON como este (campos principales):

```json
{
  "patient_profile": {
    "full_name": "Carlos Mendoza López",
    "age": 34,
    "height_cm": 172,
    "weight_kg": 78,
    "occupation_or_daily_role": "trabajo de pie en comercio",
    "dominant_side": "derecho"
  },
  "amputation_profile": { "...": "..." },
  "residual_limb_status": { "...": "..." },
  "functional_goals": { "...": "..." },
  "design_preferences": { "...": "..." },
  "patient_concerns": { "...": "..." },
  "professional_flags": { "...": "..." },
  "modelo miembro": "https://....stl?...",
  "modelo protesis": "https://....stl?..."
}
```

## 3. Dónde se ve en la app

1. Login **Acceso Profesional**
2. Panel → pestaña **Casos**: tabla con el nombre del paciente + detalle a la derecha
3. Panel → pestaña **Informes**: reporte completo
4. Panel → **Archivos**: enlaces STL

## 4. Archivos del código

| Archivo | Función |
|---------|---------|
| `src/services/report/fetchDatosReporte.js` | Llama la API y normaliza JSON |
| `src/services/report/reportDisplay.js` | Nombre, títulos, fila de tabla |
| `src/hooks/useDatosReporte.jsx` | Estado loading / error / reload |
| `src/components/professional/PatientReportPanel.jsx` | Todas las secciones del reporte |
| `src/shared/constants/demoReportData.js` | Respaldo si la API no responde |

## 5. Probar la API en el navegador

Con el servidor de desarrollo:

```
http://localhost:5173/api/datos_reporte
```

Debe devolver el JSON. Si no, revisa que ngrok esté activo.

## 6. Enlaces STL

Las URLs firmadas de R2 **caducan** (~1 hora). Si no abren, genera nuevas en el backend y recarga con **Actualizar desde API**.

## 7. Desactivar datos demo

Si quieres ver solo errores reales cuando la API falla:

```env
VITE_REPORT_FALLBACK_DEMO=false
```
