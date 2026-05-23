# Modelo STL

`tu_munon.stl` pesa ~22 MB. La app **no lo descarga** hasta que el usuario pulsa «Cargar vista 3D» o entra al dashboard.

Para reducir aún más el peso del repositorio:

1. Exporta desde Blender una versión **Decimate** (~50k caras).
2. Sustituye el archivo o añade `tu_munon-lite.stl` y actualiza `STL_MODEL_URL` en `StlArmModel.jsx`.

La geometría simplificada se guarda en caché en memoria tras la primera carga.
