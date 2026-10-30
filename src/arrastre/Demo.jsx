import { useState } from 'react'
import { MESA, colocar, enMesa } from './colocacion.js'
import { Mesa, Pieza, Ranura } from './Mesa.jsx'

/** Banco de pruebas de la interacción, solo en desarrollo. Se va cuando llegue el molino. */
const PIEZAS = {
  lobos: 'Lobos en el bosque',
  goteras: 'Arreglar las goteras del molino',
  audicion: 'Pasar la audición de Bremen',
  ensayar: 'Ensayar todas las noches',
}
const RANURAS = { dentro: 'Dentro del alcance', fuera: 'Fuera del alcance', riesgos: 'Riesgos' }

export default function Demo() {
  const [col, setCol] = useState({})
  return (
    <main style={{ maxWidth: '48rem', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '1.4rem' }}>Prueba de la interacción</h1>
      <p>Toca una pieza y luego dónde va, arrástrala, o usa Tab, Enter y Esc.</p>
      <Mesa onColocar={(p, r, i) => setCol((c) => colocar(c, p, r, { indice: i }))}
        nombrePieza={(p) => PIEZAS[p]} nombreRanura={(r) => RANURAS[r] ?? 'la mesa'}>
        <Ranura id={MESA} etiqueta="La mesa">
          {enMesa(Object.keys(PIEZAS), col).map((p) => <Pieza key={p} id={p}>{PIEZAS[p]}</Pieza>)}
        </Ranura>
        <div style={{ display: 'grid', gap: '0.8rem', marginTop: '1rem' }}>
          {Object.entries(RANURAS).map(([r, nombre]) => (
            <Ranura key={r} id={r} etiqueta={nombre}>
              {(col[r] ?? []).map((p, i) => <Pieza key={p} id={p} en={r} indice={i}>{PIEZAS[p]}</Pieza>)}
            </Ranura>
          ))}
        </div>
      </Mesa>
      <pre style={{ fontSize: '0.8rem' }}>{JSON.stringify(col, null, 1)}</pre>
    </main>
  )
}
