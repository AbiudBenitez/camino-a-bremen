import { useCallback, useEffect, useRef, useState } from 'react'
import { evaluar } from '../../motor/motor.js'
import { borrador, entregado } from '../../estado/taller.js'
import ActaHastaAhora from '../../componentes/ActaHastaAhora.jsx'
import Campo from '../../componentes/Campo.jsx'
import Hallazgos from '../../componentes/Hallazgos.jsx'
import Progreso from '../../componentes/Progreso.jsx'
import Sello from '../../componentes/Sello.jsx'
import Revision from './Revision.jsx'
import { PASOS, REVISION, SEMILLAS, TOTAL, pasoDe } from './campos.js'

// Espera deliberada antes del veredicto. La evaluación tarda menos de 5 ms y un
// resultado instantáneo se siente a que la máquina no leyó tu trabajo.
const PESO = 320

/** Avisos de un campo: lo que conviene mirar, nunca lo que bloquea. */
function sinJuicio(estado, campos) {
  const suyos = new Set(campos)
  return evaluar('acta', borrador(estado, 'acta'))
    .hallazgos.filter((h) => suyos.has(h.campo) && h.gravedad === 'aviso')
}

export default function FormularioActa({ estado, despachar }) {
  const datos = borrador(estado, 'acta')
  const yaEntregado = entregado(estado, 'acta')
  const registro = estado.artefactos.acta

  const [paso, setPaso] = useState(0)
  const [resultado, setResultado] = useState(null)
  const [leyendo, setLeyendo] = useState(false)
  const [avisos, setAvisos] = useState(null)
  const escena = useRef(null)
  const panel = useRef(null)

  const enRevision = paso === REVISION
  const actual = PASOS[paso]
  const campos = actual ? (actual.campos ?? [actual]) : []

  // El enfoque viene escrito de fábrica: si el estudiante pudiera elegir aquí
  // un método adaptativo, el giro de la etapa 4 no tendría contra qué romper.
  useEffect(() => {
    for (const [campo, texto] of Object.entries(SEMILLAS)) {
      if (!datos[campo]) despachar({ tipo: 'escribir', artefacto: 'acta', campo, valor: texto })
    }
    // Solo al abrir la etapa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    escena.current?.querySelector('input, textarea')?.focus({ preventScroll: true })
  }, [paso])

  const escribir = useCallback((campo, valor) => {
    despachar({ tipo: 'escribir', artefacto: 'acta', campo, valor })
    setAvisos(null)
  }, [despachar])

  const ir = useCallback((n) => {
    setAvisos(null)
    setPaso(Math.max(0, Math.min(REVISION, n)))
  }, [])

  // Si hay algo que vale la pena mirar, se muestra y el paso se queda. Volver
  // a pulsar avanza: el aviso informa, nunca detiene.
  const siguiente = useCallback(() => {
    if (avisos) { setAvisos(null); setPaso((p) => Math.min(REVISION, p + 1)); return }
    const aqui = PASOS[paso]
    const suyos = (aqui?.campos ?? (aqui ? [aqui] : [])).map((c) => c.campo)
    const pendientes = sinJuicio(estado, suyos)
    if (pendientes.length) { setAvisos(pendientes); return }
    setPaso((p) => Math.min(REVISION, p + 1))
  }, [avisos, estado, paso])

  const leerAlBurro = useCallback(() => {
    setLeyendo(true)
    setResultado(null)
    const r = evaluar('acta', datos)
    setTimeout(() => {
      setResultado(r)
      setLeyendo(false)
      despachar({ tipo: 'entregar', artefacto: 'acta', resumen: r.resumen })
      // Mientras llega el minijuego del molino, el acta aprobada abre el camino.
      if (r.resumen.pasa) despachar({ tipo: 'llegar', destino: 'molino' })
      panel.current?.focus({ preventScroll: true })
    }, PESO)
  }, [datos, despachar])

  const arreglar = useCallback((campo) => {
    const i = pasoDe(campo)
    if (i >= 0) { setResultado(null); setAvisos(null); setPaso(i) }
  }, [])

  const sellada = resultado?.resumen.pasa || (yaEntregado && registro?.resumen?.pasa)
  const siguienteNombre = paso + 1 < REVISION
    ? (PASOS[paso + 1].titulo ?? PASOS[paso + 1].etiqueta)
    : 'Revisar el acta'

  return (
    <section className="etapa-activa">
      <div className="barra-etapa">
        <a className="volver" href="#mapa">← Al mapa</a>
        <p className="eyebrow">Etapa 1 · El acta de constitución</p>
        {sellada && <Sello fecha={registro?.entregadoEn
          ? new Date(registro.entregadoEn).toLocaleDateString('es-MX') : null} />}
      </div>

      <Progreso paso={paso} total={TOTAL} onIr={ir}
        titulo={enRevision ? 'Revisión del acta' : (actual.titulo ?? null)} />

      <div className="tablero">
        <div className="trabajo" ref={escena} key={paso}>
          {enRevision ? (
            <>
              <h2 className="titulo-paso">Tu acta, completa</h2>
              <Revision datos={datos} onEditar={ir} />
            </>
          ) : actual.clase === 'ficha' ? (
            <>
              <h2 className="titulo-paso">{actual.titulo}</h2>
              <p className="recomendacion">{actual.entrada}</p>
              <div className="ficha">
                {campos.map((c) => (
                  <Campo key={c.campo} spec={c} valor={datos[c.campo]} onCambio={escribir}
                    avisos={(avisos ?? []).filter((a) => a.campo === c.campo)} />
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="titulo-paso">{actual.pregunta}</h2>
              <Campo spec={{ ...actual, ayuda: '' }} valor={datos[actual.campo]}
                onCambio={escribir}
                onEnviar={actual.tipo === 'largo' ? null : siguiente}
                avisos={avisos ?? []} grande />
              <p className="apunte">
                <span className="chip">{actual.etiqueta}</span>
                {actual.ayuda}
              </p>
            </>
          )}
        </div>

        <div className="riel-derecho">
          {!enRevision && actual.hechos?.length > 0 && (
            <aside className="hechos" aria-label="Lo que sabes del caso">
              <h3>Lo que sabes</h3>
              <ul>{actual.hechos.map((h, i) => <li key={i}>{h}</li>)}</ul>
              <p className="ojo">No todo esto sirve para esta pregunta.</p>
            </aside>
          )}
          <ActaHastaAhora datos={datos} onIr={ir} pasoDe={pasoDe} />
        </div>
      </div>

      <nav className="pasos-acciones" aria-label="Avanzar en el acta">
        <button type="button" onClick={() => ir(paso - 1)} disabled={paso === 0}>← Atrás</button>
        {enRevision ? (
          <button type="button" className="primario" onClick={leerAlBurro} disabled={leyendo}>
            {leyendo ? 'El burro está escuchando…' : 'Leérselo al burro'}
          </button>
        ) : (
          <button type="button" className="primario" onClick={siguiente}>
            {avisos ? 'Seguir de todos modos →' : `Siguiente: ${siguienteNombre} →`}
          </button>
        )}
      </nav>

      {registro?.intentos > 0 && (
        <p className="intentos">
          {registro.intentos} lectura{registro.intentos === 1 ? '' : 's'}. No hay límite.
        </p>
      )}

      <div ref={panel} tabIndex={-1} className="panel-veredicto">
        <Hallazgos key={registro?.intentos ?? 0} resultado={resultado} onArreglar={arreglar} />
      </div>
    </section>
  )
}
