import { useEffect, useRef, useState } from 'react'
import { etapas, porMetodo } from './cronograma.js'
import Gantt from './Gantt.jsx'

const MARCA = { hecha: '✓', actual: '', cerrada: '' }

/**
 * La línea de etapas: el progreso de un vistazo, sobre el mapa. Al tocarla se
 * despliega el Gantt con las horas reales. Lo que sigue bajo la bruma termina
 * en «?», sin nombre: el giro no se adelanta.
 */
export default function LineaEtapas({ estado }) {
  const [abierto, setAbierto] = useState(false)
  const caja = useRef(null)
  const { lista, bruma } = etapas(estado)
  const aqui = lista.find((e) => e.estado === 'actual')
  const hechas = lista.filter((e) => e.estado === 'hecha').length

  useEffect(() => {
    if (!abierto) return
    const fuera = (e) => { if (!caja.current?.contains(e.target)) setAbierto(false) }
    const tecla = (e) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('pointerdown', fuera)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('pointerdown', fuera)
      document.removeEventListener('keydown', tecla)
    }
  }, [abierto])

  const resumen = `${hechas === 1 ? '1 parada recorrida' : `${hechas} paradas recorridas`}`
    + (aqui ? `; sigue ${aqui.nombre}` : '')

  return (
    <div className="linea-etapas" ref={caja}>
      <button type="button" className="linea-boton" aria-expanded={abierto} aria-controls="panel-gantt"
        onClick={() => setAbierto((a) => !a)}
        aria-label={`Cronograma: ${resumen}. ${abierto ? 'Ocultar' : 'Ver'} el diagrama de Gantt`}>
        <span className="linea-rotulo" aria-hidden="true">Cronograma</span>
        <span className="linea-grupos" aria-hidden="true">
          {porMetodo(lista).map((g) => (
            <span key={g.metodo} className={`linea-grupo ${g.metodo === 'Scrum' ? 'scrum' : 'pmi'}`}>
              <span className="linea-metodo">{g.metodo}</span>
              <span className="linea-paradas">
                {g.etapas.map((e) => (
                  <span key={e.id} className={`linea-parada ${e.estado}`}>
                    <span className="linea-punto">{MARCA[e.estado]}</span>
                    <span className="linea-nombre">{e.corto}</span>
                  </span>
                ))}
              </span>
            </span>
          ))}
          {bruma && (
            <span className="linea-grupo bruma">
              <span className="linea-metodo">&nbsp;</span>
              <span className="linea-paradas">
                <span className="linea-parada cerrada"><span className="linea-punto">?</span><span className="linea-nombre">&nbsp;</span></span>
              </span>
            </span>
          )}
        </span>
        <span className="linea-flecha" aria-hidden="true" />
      </button>
      {abierto && (
        <div className="panel-flotante panel-gantt" id="panel-gantt">
          <Gantt estado={estado} />
        </div>
      )}
    </div>
  )
}
