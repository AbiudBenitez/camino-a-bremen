import { useCallback, useEffect, useRef, useState } from 'react'
import { evaluar } from '../../motor/motor.js'
import { borrador, entregado } from '../../estado/taller.js'
import Campo from '../../componentes/Campo.jsx'
import Hallazgos from '../../componentes/Hallazgos.jsx'
import Progreso from '../../componentes/Progreso.jsx'
import Sello from '../../componentes/Sello.jsx'
import Revision from './Revision.jsx'
import { CAMPOS } from './campos.js'

// Espera deliberada antes del veredicto. La evaluación tarda menos de 5 ms y un
// resultado instantáneo se siente a que la máquina no leyó tu trabajo. Es peso,
// no latencia: el mismo truco que usan los juegos para que un golpe pese.
const PESO = 320
const REVISION = CAMPOS.length
const TOTAL = CAMPOS.length + 1

/** Avisos de un campo: lo que conviene mirar, nunca lo que bloquea. */
function sinJuicio(estado, campo) {
  return evaluar('acta', borrador(estado, 'acta'))
    .hallazgos.filter((h) => h.campo === campo && h.gravedad === 'aviso')
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
  const spec = CAMPOS[paso]

  // Al cambiar de paso el foco se va al campo: sin esto, quien navega con
  // teclado o lector de pantalla se queda atrás en el botón de siguiente.
  useEffect(() => {
    const campo = escena.current?.querySelector('input, textarea')
    campo?.focus({ preventScroll: true })
  }, [paso])

  const escribir = useCallback((campo, valor) => {
    despachar({ tipo: 'escribir', artefacto: 'acta', campo, valor })
    setAvisos(null)
  }, [despachar])

  // Los avisos del campo salen al dejarlo, no mientras se escribe. Los
  // incumplimientos se guardan para cuando el estudiante pida el veredicto.
  const revisarEste = useCallback(() => {
    if (!spec) return
    const suyos = sinJuicio(estado, spec.campo)
    if (suyos.length) setAvisos(suyos)
  }, [estado, spec])

  const ir = useCallback((n) => {
    setAvisos(null)
    setPaso(Math.max(0, Math.min(REVISION, n)))
  }, [])

  // Si el campo tiene algo que vale la pena mirar, se muestra y el paso se
  // queda. Volver a pulsar avanza: el aviso informa, nunca bloquea.
  const siguiente = useCallback(() => {
    if (avisos) { setAvisos(null); setPaso((p) => Math.min(REVISION, p + 1)); return }
    const pendientes = spec ? sinJuicio(estado, spec.campo) : []
    if (pendientes.length) { setAvisos(pendientes); return }
    setPaso((p) => Math.min(REVISION, p + 1))
  }, [avisos, estado, spec])

  const leerAlBurro = useCallback(() => {
    setLeyendo(true)
    setResultado(null)
    const r = evaluar('acta', datos)
    setTimeout(() => {
      setResultado(r)
      setLeyendo(false)
      despachar({ tipo: 'entregar', artefacto: 'acta', resumen: r.resumen })
      panel.current?.focus({ preventScroll: true })
    }, PESO)
  }, [datos, despachar])

  const arreglar = useCallback((campo) => {
    const i = CAMPOS.findIndex((c) => c.campo === campo)
    if (i >= 0) { setResultado(null); setAvisos(null); setPaso(i) }
  }, [])

  const sellada = resultado?.resumen.pasa || (yaEntregado && registro?.resumen?.pasa)
  const fechaSello = registro?.entregadoEn
    ? new Date(registro.entregadoEn).toLocaleDateString('es-MX')
    : null

  return (
    <section className="etapa-activa">
      <header className="cabecera-etapa">
        <a className="volver" href="#inicio">← El recorrido</a>
        <p className="eyebrow">Etapa 1 · PMI · Inicio</p>
        <h2>El acta de constitución</h2>
        <p className="cuento">
          El burro ya no sirve en la granja y se va a Bremen a ser músico. Antes de salir alguien
          tiene que escribir a qué van, porque en el camino se va a olvidar.
        </p>
        {sellada && <Sello fecha={fechaSello} />}
      </header>

      <Progreso paso={paso} total={TOTAL} onIr={ir} />

      <div className="escena" ref={escena} key={paso}>
        {enRevision ? (
          <>
            <h3 className="titulo-paso">Tu acta, completa</h3>
            <Revision datos={datos} onEditar={ir} />
          </>
        ) : (
          <>
            <p className="de-que-va">{spec.etiqueta}</p>
            <h3 className="titulo-paso">{spec.pregunta ?? spec.etiqueta}</h3>
            <p className="recomendacion">{spec.ayuda}</p>
            <Campo
              spec={{ ...spec, etiqueta: spec.etiqueta, ayuda: '' }}
              valor={datos[spec.campo]}
              onCambio={escribir}
              onSalir={revisarEste}
              onEnviar={spec.tipo === 'largo' ? null : siguiente}
              avisos={avisos ?? []}
              grande
            />
          </>
        )}
      </div>

      <nav className="pasos-acciones" aria-label="Avanzar en el acta">
        <button type="button" onClick={() => ir(paso - 1)} disabled={paso === 0}>
          ← Atrás
        </button>
        {enRevision ? (
          <button type="button" className="primario" onClick={leerAlBurro} disabled={leyendo}>
            {leyendo ? 'El burro está escuchando…' : 'Leérselo al burro'}
          </button>
        ) : (
          <button type="button" className="primario" onClick={siguiente}>
            {avisos ? 'Seguir de todos modos →' : 'Siguiente →'}
          </button>
        )}
      </nav>

      {registro?.intentos > 0 && (
        <p className="intentos">
          {registro.intentos} lectura{registro.intentos === 1 ? '' : 's'}. No hay límite: corrige
          y vuelve a leérselo las veces que quieras.
        </p>
      )}

      <div ref={panel} tabIndex={-1} className="panel-veredicto">
        <Hallazgos key={registro?.intentos ?? 0} resultado={resultado} onArreglar={arreglar} />
      </div>
    </section>
  )
}
