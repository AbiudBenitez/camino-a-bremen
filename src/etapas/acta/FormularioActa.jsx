import { useCallback, useRef, useState } from 'react'
import { evaluar } from '../../motor/motor.js'
import { borrador, entregado } from '../../estado/taller.js'
import Campo from '../../componentes/Campo.jsx'
import Hallazgos from '../../componentes/Hallazgos.jsx'
import Sello from '../../componentes/Sello.jsx'
import { CAMPOS } from './campos.js'

// Espera deliberada antes del veredicto. La evaluación tarda menos de 5 ms y un
// resultado instantáneo se siente a que la máquina no leyó tu trabajo. Es peso,
// no latencia: el mismo truco que usan los juegos para que un golpe pese.
const PESO = 320

export default function FormularioActa({ estado, despachar }) {
  const datos = borrador(estado, 'acta')
  const yaEntregado = entregado(estado, 'acta')
  const [resultado, setResultado] = useState(null)
  const [leyendo, setLeyendo] = useState(false)
  const [avisosCampo, setAvisosCampo] = useState({})
  const panel = useRef(null)

  const escribir = useCallback((campo, valor) => {
    despachar({ tipo: 'escribir', artefacto: 'acta', campo, valor })
    setAvisosCampo((a) => (a[campo] ? { ...a, [campo]: null } : a))
  }, [despachar])

  // Al salir de un campo solo se muestran sus AVISOS. Los incumplimientos se
  // reservan para cuando el estudiante pida el veredicto.
  const alSalir = useCallback((campo) => {
    const r = evaluar('acta', { ...borrador(estado, 'acta') })
    const suyos = r.hallazgos.filter((h) => h.campo === campo && h.gravedad === 'aviso')
    setAvisosCampo((a) => ({ ...a, [campo]: suyos.length ? suyos : null }))
  }, [estado])

  const leerAlBurro = useCallback(() => {
    setLeyendo(true)
    setResultado(null)
    const r = evaluar('acta', datos)
    setTimeout(() => {
      setResultado(r)
      setLeyendo(false)
      despachar({ tipo: 'entregar', artefacto: 'acta', resumen: r.resumen })
      // Se mueve el foco, no el scroll: arrebatar la posición de lectura marea.
      panel.current?.focus({ preventScroll: true })
    }, PESO)
  }, [datos, despachar])

  const registro = estado.artefactos.acta
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

      <form onSubmit={(e) => { e.preventDefault(); leerAlBurro() }}>
        {CAMPOS.map((spec) => (
          <Campo key={spec.campo} spec={spec} valor={datos[spec.campo]}
            onCambio={escribir} onSalir={alSalir}
            avisos={avisosCampo[spec.campo] ?? []} />
        ))}

        <div className="acciones">
          <button type="submit" className="primario" disabled={leyendo}>
            {leyendo ? 'El burro está escuchando…' : 'Leérselo al burro'}
          </button>
          {registro?.intentos > 0 && (
            <span className="intentos">
              {registro.intentos} lectura{registro.intentos === 1 ? '' : 's'}. No hay límite.
            </span>
          )}
        </div>
      </form>

      <div ref={panel} tabIndex={-1} className="panel-veredicto">
        <Hallazgos key={registro?.intentos ?? 0} resultado={resultado} />
      </div>
    </section>
  )
}
