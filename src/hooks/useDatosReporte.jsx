import { useCallback, useEffect, useState } from 'react'
import { fetchDatosReporte } from '@/services/report/fetchDatosReporte'

export function useDatosReporte({ autoFetch = true } = {}) {
  const [report, setReport] = useState(null)
  const [status, setStatus] = useState(autoFetch ? 'loading' : 'idle')
  const [error, setError] = useState('')
  const [fromDemo, setFromDemo] = useState(false)

  const load = useCallback(async () => {
    setStatus('loading')
    setError('')
    setFromDemo(false)
    try {
      const { report: data, fromDemo: demo } = await fetchDatosReporte()
      setReport(data)
      setFromDemo(demo)
      setStatus('ready')
    } catch (err) {
      setReport(null)
      setStatus('error')
      setError(err?.message ?? 'Error al cargar el reporte')
    }
  }, [])

  useEffect(() => {
    if (autoFetch) load()
  }, [autoFetch, load])

  return { report, status, error, fromDemo, reload: load }
}
