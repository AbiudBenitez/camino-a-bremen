import { useEffect, useState } from 'react'
import { useTaller } from './useTaller.js'
import { abierto, actual, deNoche, destino } from './destinos/catalogo.js'
import { useMusica } from './sonido/useMusica.js'
import Molino from './destinos/molino/Molino.jsx'
import Escena from './destinos/Escena.jsx'
import Mapa from './mapa/Mapa.jsx'
import Banda from './mapa/Banda.jsx'
import Red from './componentes/Red.jsx'
import './App.css'
import './mapa/mapa.css'

// Navegación por hash: en GitHub Pages una ruta real da 404 al recargar, y el
// botón de atrás del teléfono tiene que volver al mapa en vez de salirse.
function useHash() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const alCambiar = () => setHash(window.location.hash)
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])
  return hash
}

/** `#etapa-1` es el enlace viejo del acta: sigue llevando al molino. */
function destinoDelHash(hash) {
  if (hash === '#etapa-1') return 'molino'
  const m = /^#destino-([a-z]+)$/.exec(hash)
  return m && destino(m[1]) ? m[1] : null
}

export default function App() {
  const taller = useTaller()
  const { estado, despachar, aviso, descartarAviso } = taller
  const musica = useMusica(estado, despachar)
  const pedido = destinoDelHash(useHash())
  // Un destino cerrado no se abre escribiendo su dirección: el giro no se adelanta.
  const aqui = pedido && abierto(estado, pedido) ? pedido : null
  const noche = deNoche(estado)

  useEffect(() => { document.documentElement.dataset.hora = noche ? 'noche' : 'dia' }, [noche])

  return (
    <main className={aqui ? 'en-destino' : 'en-mapa'}>
      {aviso && (
        <div className="banner" role="alert">
          <p>{aviso}</p>
          <button type="button" onClick={descartarAviso}>Entendido</button>
        </div>
      )}

      <Red>
        {aqui === 'molino' && <Molino estado={estado} despachar={despachar} />}
        {aqui && aqui !== 'molino' && <Escena id={aqui} despachar={despachar} />}
        {!aqui && <PantallaMapa estado={estado} taller={taller} musica={musica} />}
      </Red>
    </main>
  )
}

function PantallaMapa({ estado, taller, musica }) {
  const siguiente = actual(estado)
  return (
    <div className="pantalla-mapa">
      <header className="cabecera-mapa">
        <h1>Camino a Bremen</h1>
        {musica.sonido !== null && (
          <button type="button" className="interruptor" aria-pressed={musica.sonido}
            onClick={() => musica.elegir(!musica.sonido)}>
            Música: {musica.sonido ? 'sí' : 'no'}
          </button>
        )}
      </header>

      {musica.sonido === null && (
        <section className="pregunta-musica" aria-label="Música">
          <p>La banda suena mientras juegas, y cada animal que se suma agrega su instrumento. ¿Con música?</p>
          <div className="acciones">
            <button type="button" className="primario" onClick={() => musica.elegir(true)}>Sí, con música</button>
            <button type="button" onClick={() => musica.elegir(false)}>Sin música</button>
          </div>
        </section>
      )}

      <div className="mesa-mapa">
        <Mapa estado={estado} />
        <aside className="costado-mapa">
          <section className="siguiente">
            <p className="eyebrow">Siguiente parada</p>
            <h2>{siguiente.nombre}</h2>
            <a className="como-boton primario" href={`#destino-${siguiente.id}`}>Ir →</a>
          </section>
          <Banda estado={estado} />
          <Expediente taller={taller} />
        </aside>
      </div>
    </div>
  )
}

function Expediente({ taller }) {
  const [confirmando, setConfirmando] = useState(false)
  return (
    <section className="expediente">
      <h2>Tu expediente</h2>
      <p className="ayuda">
        Se guarda solo en este navegador. Si lo limpias o cambias de equipo, se pierde:
        descárgalo para conservarlo. Ese archivo es también lo que entregas.
      </p>
      <div className="acciones">
        <button type="button" onClick={taller.descargar}>Descargar</button>
        <label className="como-boton">
          Cargar
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
      <p className="no-oficial">
        Este taller no otorga una certificación oficial del PMI ni de Scrum.org. Lo que escribes
        no sale de este navegador.
      </p>
    </section>
  )
}
