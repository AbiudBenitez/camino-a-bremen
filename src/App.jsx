import { useEffect, useState } from 'react'
import { ETAPAS, EL_GIRO } from './etapas/catalogo-etapas.js'
import { artefactos } from './motor/motor.js'
import { estadoEtapa, puedeEntrar } from './estado/taller.js'
import { useTaller } from './useTaller.js'
import FormularioActa from './etapas/acta/FormularioActa.jsx'
import Red from './componentes/Red.jsx'
import './App.css'

const CON_REGLAS = new Set(artefactos().map((a) => a.id))

// Navegación por hash: en GitHub Pages una ruta real da 404 al recargar, y el
// botón de atrás del teléfono tiene que volver a la lista en vez de salirse.
function useHash() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const alCambiar = () => setHash(window.location.hash)
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])
  return hash
}

const ESTADOS = {
  sellada: 'Sellada',
  entregada: 'Entregada, con pendientes',
  abierta: 'Te toca',
  bloqueada: 'Aún no',
}

export default function App() {
  const taller = useTaller()
  const { estado, despachar, aviso, descartarAviso, guardadoA } = taller
  const hash = useHash()
  const enEtapa1 = hash === '#etapa-1'

  return (
    <main>
      {aviso && (
        <div className="banner" role="alert">
          <p>{aviso}</p>
          <button type="button" onClick={descartarAviso}>Entendido</button>
        </div>
      )}

      {/* Dentro de una etapa no hay portada. El campo tiene que caber en la
          primera pantalla: once bloques de preámbulo repetidos en cada paso
          eran la causa de que ocho pasos se sintieran interminables. */}
      {!enEtapa1 && (
        <header>
          <p className="curso">Administración de Proyectos de Software · Equipo 2 · India</p>
          <h1><a href="#inicio">Camino a Bremen</a></h1>
          <p className="bajada">
            Gestiona el proyecto de los músicos de Bremen. Empiezas planificando como manda el PMI
            y, cuando a media historia el objetivo cambie, terminas con Scrum.
          </p>
        </header>
      )}

      <Red>
        {enEtapa1
          ? <FormularioActa estado={estado} despachar={despachar} />
          : <Recorrido estado={estado} />}
      </Red>

      {!enEtapa1 && <Expediente taller={taller} guardadoA={guardadoA} />}

      <footer>
        <p>
          Este taller no otorga una certificación oficial del PMI ni de Scrum.org. Es material de
          práctica. Lo que escribes no sale de este navegador.
        </p>
      </footer>
    </main>
  )
}

function Recorrido({ estado }) {
  return (
    <section id="inicio">
      <h2>Las seis etapas</h2>
      <ol className="etapas">
        {ETAPAS.map((e) => {
          const abierta = CON_REGLAS.has(e.id) && puedeEntrar(e.n, estado)
          const marca = CON_REGLAS.has(e.id) ? estadoEtapa(e.n, estado, e.id) : 'bloqueada'
          return (
            <li key={e.n}>
              {e.n === EL_GIRO && <Ruptura />}
              <article className={`etapa ${e.n < EL_GIRO ? 'plan' : 'camino'} ${marca}`}>
                <span className="medallon">{e.n}</span>
                <span className="enfoque">{e.enfoque}</span>
                <strong>{e.artefacto}</strong>
                <span className="cuento">{e.cuento}</span>
                <span className="estado">
                  {CON_REGLAS.has(e.id) ? ESTADOS[marca] : 'Todavía no construida'}
                </span>
                {abierta && (
                  <a className="entrar" href={`#etapa-${e.n}`}>
                    {marca === 'abierta' ? 'Empezar' : 'Volver a abrir'} →
                  </a>
                )}
              </article>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/** La ruptura. No es una etapa más: es donde el plan deja de servir. */
function Ruptura() {
  return (
    <aside className="ruptura">
      <p className="golpe">Aparece la casa de los ladrones.</p>
      <p className="explica">
        Nadie la planeó y no está en el alcance. A partir de aquí el plan deja de servir, y el
        taller cambia de método.
      </p>
      <p className="viraje">Predictivo · PMI <span aria-hidden="true">→</span> Adaptativo · Scrum</p>
    </aside>
  )
}

function Expediente({ taller, guardadoA }) {
  const [confirmando, setConfirmando] = useState(false)
  return (
    <section className="expediente">
      <h2>Tu expediente</h2>
      <p>
        Todo lo que escribes se guarda solo, aquí en tu navegador.
        {guardadoA && <span className="guardado"> Guardado · {guardadoA.toLocaleTimeString('es-MX',
          { hour: '2-digit', minute: '2-digit' })}</span>}
      </p>
      <p className="ayuda">
        Si limpias el navegador o cambias de equipo, se pierde. Descárgalo para conservarlo: ese
        archivo es también lo que entregas.
      </p>
      <div className="acciones">
        <button type="button" onClick={taller.descargar}>Descargar expediente</button>
        <label className="como-boton">
          Cargar expediente
          <input type="file" accept="application/json" hidden
            onChange={(e) => e.target.files[0] && taller.cargarArchivo(e.target.files[0])} />
        </label>
        {confirmando ? (
          <span className="confirmar">
            ¿Borrar todo lo escrito?
            <button type="button" className="peligro"
              onClick={() => { taller.reiniciar(); setConfirmando(false) }}>Sí, empezar de cero</button>
            <button type="button" onClick={() => setConfirmando(false)}>Cancelar</button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirmando(true)}>Empezar de cero</button>
        )}
      </div>
    </section>
  )
}
