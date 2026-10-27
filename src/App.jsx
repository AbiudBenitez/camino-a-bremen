import { useEffect, useState } from 'react'
import { useTaller } from './useTaller.js'
import { abierto, deNoche, destino } from './destinos/catalogo.js'
import { useMusica } from './sonido/useMusica.js'
import Molino from './destinos/molino/Molino.jsx'
import Escena from './destinos/Escena.jsx'
import PantallaMapa from './mapa/PantallaMapa.jsx'
import Cabecera from './mapa/Cabecera.jsx'
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

      <Cabecera estado={estado} taller={taller} musica={musica} />

      <Red>
        {aqui === 'molino' && <Molino estado={estado} despachar={despachar} />}
        {aqui && aqui !== 'molino' && <Escena id={aqui} despachar={despachar} />}
        {!aqui && <PantallaMapa estado={estado} />}
      </Red>
    </main>
  )
}
