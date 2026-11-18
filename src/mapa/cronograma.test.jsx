import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { DESTINOS } from '../destinos/catalogo.js'
import { vacio } from '../estado/esquema.js'
import { barras, etapas } from './cronograma.js'
import LineaEtapas from './LineaEtapas.jsx'
import Gantt from './Gantt.jsx'

const hora = (h) => new Date(Date.UTC(2026, 10, 14, h)).toISOString()

/** Un taller que empezó a las 10 y terminó una parada por hora. */
const hasta = (n) => ({
  ...vacio(),
  creado: hora(10),
  recorrido: Object.fromEntries(DESTINOS.slice(0, n).map((d, i) => [d.id, hora(11 + i)])),
})
const AHORA = Date.parse(hora(20))

describe('Cronograma', () => {
  it('se pinta sin lanzar en cada punto del camino', () => {
    for (let n = 0; n <= DESTINOS.length; n++) {
      expect(() => renderToStaticMarkup(<LineaEtapas estado={hasta(n)} />)).not.toThrow()
      expect(() => renderToStaticMarkup(<Gantt estado={hasta(n)} ahora={AHORA} />)).not.toThrow()
    }
    expect(() => renderToStaticMarkup(<Gantt estado={{}} ahora={AHORA} />)).not.toThrow()
  })

  // El giro no se anuncia: igual que en el mapa, la casa y el final no existen antes del bosque.
  it('no nombra la casa ni el final antes de recorrer el bosque', () => {
    for (let n = 0; n <= 4; n++) {
      const linea = renderToStaticMarkup(<LineaEtapas estado={hasta(n)} />)
      const gantt = renderToStaticMarkup(<Gantt estado={hasta(n)} ahora={AHORA} />)
      for (const html of [linea, gantt]) {
        expect(html, `n=${n}`).not.toMatch(/Casa|Final|Scrum|ladr/)
      }
      expect(etapas(hasta(n)).bruma).toBe(true)
    }
    const despejado = renderToStaticMarkup(<LineaEtapas estado={hasta(5)} />)
    expect(despejado).toContain('Casa')
    expect(despejado).toContain('Scrum')
  })

  it('cada parada recorrida tiene su barra, la actual va abierta y las cerradas no tienen', () => {
    const { filas } = barras(hasta(2), AHORA)
    const [molino, perro, gato, gallo] = filas
    expect(molino).toMatchObject({ estado: 'hecha', inicio: Date.parse(hora(10)), fin: Date.parse(hora(11)) })
    expect(perro).toMatchObject({ estado: 'hecha', inicio: Date.parse(hora(11)), fin: Date.parse(hora(12)) })
    expect(gato).toMatchObject({ estado: 'actual', inicio: Date.parse(hora(12)), fin: AHORA, enCurso: true })
    expect(gallo).toMatchObject({ estado: 'cerrada', inicio: null })
  })

  it('no califica: solo fechas, sin palabras de velocidad', () => {
    const html = renderToStaticMarkup(<Gantt estado={hasta(3)} ahora={AHORA} />)
    expect(html.toLowerCase()).not.toMatch(/rápid|lent|tarde|retras|minutos|puntos/)
    expect(html).toContain('6.6 Controlar el Cronograma')
  })
})
