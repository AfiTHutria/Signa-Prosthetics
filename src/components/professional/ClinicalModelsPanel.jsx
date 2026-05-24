import { useRef, useState } from 'react'
import { Box, Eye, Sparkles, Upload } from 'lucide-react'
import { getMeshExtension } from '@/infrastructure/three/loadMeshFromSource'
import { generateProsthesisFromScan } from '@/services/prosthesis/generateProsthesis'
import styles from './ClinicalModelsPanel.module.css'

function fileLabelFromUrl(url, fallback) {
  try {
    const path = new URL(url, window.location.origin).pathname
    const name = path.split('/').pop()
    return name || fallback
  } catch {
    return fallback
  }
}

export function ClinicalModelsPanel({ report, patientName, onOpenViewer }) {
  const inputRef = useRef(null)
  const generateInputRef = useRef(null)
  const [uploads, setUploads] = useState([])
  const [dragging, setDragging] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [lastGeneration, setLastGeneration] = useState(null)
  const [genError, setGenError] = useState('')

  const apiModels = [
    report?.modeloMiembro && {
      id: 'api-miembro',
      title: 'Modelo del miembro',
      source: report.modeloMiembro,
      fileName: fileLabelFromUrl(report.modeloMiembro, 'miembro.stl'),
      origin: 'API',
    },
    report?.modeloProtesis && {
      id: 'api-protesis',
      title: 'Modelo de prótesis',
      source: report.modeloProtesis,
      fileName: fileLabelFromUrl(report.modeloProtesis, 'protesis.stl'),
      origin: 'API',
    },
  ].filter(Boolean)

  const addModel = (entry) => {
    setUploads((prev) => [entry, ...prev])
  }

  const handleMeshFile = (file) => {
    const ext = getMeshExtension(file.name)
    if (ext !== 'stl' && ext !== 'ply') {
      window.alert('Solo archivos .stl o .ply')
      return
    }

    const entry = {
      id: `upload-${Date.now()}`,
      title: file.name,
      source: file,
      fileName: file.name,
      origin: 'Subido',
    }

    addModel(entry)
    onOpenViewer({
      title: file.name,
      source: file,
      fileName: file.name,
    })
  }

  const handleGenerateProsthesis = async (file) => {
    const ext = getMeshExtension(file.name)
    if (ext !== 'ply') {
      window.alert('Para generar la prótesis automática usa un escaneo .ply del muñón.')
      return
    }

    setGenerating(true)
    setGenError('')
    try {
      const result = await generateProsthesisFromScan(file)
      setLastGeneration(result)

      const scanEntry = {
        id: `scan-${Date.now()}`,
        title: `Muñón · ${result.scan.filename}`,
        source: result.scan.url,
        fileName: result.scan.filename,
        origin: `Escaneo · ${result.generation?.engine ?? 'IA'}`,
      }
      const prosthesisEntry = {
        id: `prosthesis-${Date.now()}`,
        title: `Prótesis generada · ${result.prosthesis.filename}`,
        source: result.prosthesis.url,
        fileName: result.prosthesis.filename,
        origin: `Blender/IA · ${result.ai_design?.level ?? 'diseño'}`,
      }

      addModel(prosthesisEntry)
      addModel(scanEntry)

      onOpenViewer({
        title: prosthesisEntry.title,
        source: prosthesisEntry.source,
        fileName: prosthesisEntry.fileName,
      })
    } catch (err) {
      setGenError(err?.message || 'No se pudo generar la prótesis')
    } finally {
      setGenerating(false)
    }
  }

  const allModels = [...uploads, ...apiModels]
  const uploadedCount = uploads.length

  return (
    <section
      className={`${styles.panel} ${dragging ? styles.dragging : ''}`}
      aria-labelledby="clinical-models-heading"
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleMeshFile(file)
      }}
    >
      <div className={styles.head}>
        <div>
          <h3 id="clinical-models-heading" className={styles.title}>
            <Box size={16} aria-hidden />
            Modelos 3D
          </h3>
          <p className={styles.desc}>
            Sube el escaneo PLY de {patientName ?? 'el paciente'}. La IA (Gemini) calcula el ajuste y
            Blender genera la prótesis que encaja con el muñón.
          </p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.generateBtn}
            disabled={generating}
            onClick={() => generateInputRef.current?.click()}
          >
            <Sparkles size={16} aria-hidden />
            {generating ? 'Generando prótesis…' : 'Subir PLY y generar prótesis'}
          </button>
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={16} aria-hidden />
            Solo visualizar
          </button>
        </div>
        <input
          ref={generateInputRef}
          type="file"
          accept=".ply"
          className={styles.fileInput}
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (file) handleGenerateProsthesis(file)
          }}
        />
        <input
          ref={inputRef}
          type="file"
          accept=".stl,.ply,model/stl,model/ply"
          className={styles.fileInput}
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (file) handleMeshFile(file)
          }}
        />
      </div>

      {genError && <p className={styles.genError}>{genError}</p>}

      {lastGeneration && !generating && (
        <p className={styles.genOk}>
          Prótesis lista ({lastGeneration.generation?.engine ?? 'motor'}) ·{' '}
          {lastGeneration.ai_design?.design_notes ?? 'Revisa ambos modelos en la lista.'}
        </p>
      )}

      {allModels.length === 0 ? (
        <p className={styles.empty}>
          No hay modelos aún. Usa «Subir PLY y generar prótesis» para crear la copla a partir del
          escaneo.
        </p>
      ) : (
        <>
          <div className={styles.listHeader}>
            <span className={styles.listCount}>
              {allModels.length} {allModels.length === 1 ? 'modelo' : 'modelos'}
            </span>
            {uploadedCount > 0 && (
              <span className={styles.listSubCount}>
                {uploadedCount} subido{uploadedCount === 1 ? '' : 's'} por ti
              </span>
            )}
          </div>
          <div className={styles.listScroll}>
            <ul className={styles.list}>
              {allModels.map((item) => (
                <li key={item.id} className={styles.item}>
                  <div className={styles.itemText}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span className={styles.itemMeta}>
                      {item.origin} · {getMeshExtension(item.fileName).toUpperCase() || '3D'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.viewBtn}
                    onClick={() =>
                      onOpenViewer({
                        title: item.title,
                        source: item.source,
                        fileName: item.fileName,
                      })
                    }
                  >
                    <Eye size={15} aria-hidden />
                    Ver en 3D
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  )
}
