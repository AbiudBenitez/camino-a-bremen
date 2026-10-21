import { useState } from 'react'
import { ETAPAS, EL_GIRO } from './etapas/catalogo-etapas.js'
import { artefactos, evaluar } from './motor/motor.js'
import Hallazgos from './componentes/Hallazgos.jsx'
import './App.css'

const LISTOS = new Set(artefactos().map((a) => a.id))

// Dos actas de ejemplo para probar el motor mientras no existe el formulario
// de la historia H-03. Se van cuando llegue el formulario real.
const EJEMPLOS = {
  incompleta: {
    vision: 'Llegar a Bremen. Y además ser músicos famosos.',
    objetivos: 'Reunir al grupo.',
    medidas: ['Que el público aplauda'],
    fechaInicio: '2026-10-01',
  },
  completa: {
    vision: 'Llevar a los cuatro músicos a Bremen antes del invierno.',
    objetivos: 'Reunir al grupo, llegar a Bremen y conseguir un puesto de músicos.',
    alcance: 'El viaje y la presentación. No incluye construir la casa.',
    entregables: 'Grupo reunido, ruta recorrida, presentación hecha.',
    interesados: 'Los cuatro animales y el ayuntamiento de Bremen.',
    roles: 'El burro propone, los demás ejecutan.',
    enfoque: 'Por etapas, sumando un integrante en cada tramo.',
    hitos: 'Salida de la granja, encuentro de los cuatro, llegada.',
    riesgos: 'Hambre, frío y una casa de ladrones no prevista.',
    medidas: ['Cuatro integrantes reunidos', 'Llegar en 30 días o menos'],
    fechaInicio: '2026-10-01',
    fechaFin: '2026-10-31',
  },
}

export default function App() {
  const [resultado, setResultado] = useState(null)

  return (
    <main>
      <header>
        <p className="curso">Administración de Proyectos de Software · Equipo 2 · India</p>
        <h1>Camino a Bremen</h1>
        <p className="bajada">
          Taller para certificarse en administración de proyectos. El mismo caso recorre primero
          el enfoque predictivo del PMI y, cuando el objetivo cambia a media historia, el enfoque
          adaptativo de Scrum.
        </p>
      </header>

      <section>
        <h2>Las seis etapas</h2>
        <ol className="etapas">
          {ETAPAS.map((e) => (
            <li key={e.n} className={e.n === EL_GIRO ? 'etapa giro' : 'etapa'}>
              <span className="numero">Etapa {e.n}</span>
              <span className="enfoque">{e.enfoque}</span>
              <strong>{e.artefacto}</strong>
              <span className="cuento">{e.cuento}</span>
              <span className="estado">
                {LISTOS.has(e.id) ? `Reglas listas · ${e.historia}` : `Pendiente · ${e.historia}`}
              </span>
            </li>
          ))}
        </ol>
        <p className="nota">
          En la etapa 4 aparece la casa de los ladrones: nadie la planeó y el plan deja de servir.
          Ahí el taller cambia de enfoque.
        </p>
      </section>

      <section>
        <h2>Motor de reglas</h2>
        <p>
          Corre entero en el navegador, sin red y sin costo. Toda observación cita el apartado que
          la respalda. Esta pantalla es el andamio: el formulario del acta es la historia H-03.
        </p>
        <div className="botones">
          <button type="button" onClick={() => setResultado(evaluar('acta', EJEMPLOS.incompleta))}>
            Evaluar un acta incompleta
          </button>
          <button type="button" onClick={() => setResultado(evaluar('acta', EJEMPLOS.completa))}>
            Evaluar un acta completa
          </button>
        </div>
        <Hallazgos resultado={resultado} />
      </section>

      <footer>
        <p>
          Este taller no otorga una certificación oficial del PMI ni de Scrum.org. Es material de
          práctica.
        </p>
      </footer>
    </main>
  )
}
