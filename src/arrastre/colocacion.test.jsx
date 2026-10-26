import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MESA, colocar, donde, enMesa, normalizar, quitar } from './colocacion.js'
import { Mesa, Pieza, Ranura } from './Mesa.jsx'

describe('colocaciones', () => {
  it('coloca una pieza al final de su ranura', () => {
    const c = colocar(colocar({}, 'a', 'riesgos'), 'b', 'riesgos')
    expect(c.riesgos).toEqual(['a', 'b'])
    expect(donde(c, 'b')).toBe('riesgos')
  })

  it('mover una pieza la saca de donde estaba', () => {
    const c = colocar({ dentro: ['goteras'] }, 'goteras', 'fuera')
    expect(c).toEqual({ dentro: [], fuera: ['goteras'] })
  })

  it('con índice entra antes de la pieza que ocupaba ese lugar', () => {
    expect(colocar({ pila: ['a', 'b'] }, 'c', 'pila', { indice: 0 }).pila).toEqual(['c', 'a', 'b'])
  })

  // El caso que rompe una implementación ingenua: al quitarla, las de abajo se recorren.
  it('reordena dentro de la misma ranura hacia abajo y hacia arriba', () => {
    expect(colocar({ pila: ['a', 'b', 'c'] }, 'a', 'pila', { indice: 2 }).pila).toEqual(['b', 'a', 'c'])
    expect(colocar({ pila: ['a', 'b', 'c'] }, 'c', 'pila', { indice: 0 }).pila).toEqual(['c', 'a', 'b'])
    expect(colocar({ pila: ['a', 'b', 'c'] }, 'a', 'pila').pila).toEqual(['b', 'c', 'a'])
  })

  it('con cupo lleno, la pieza que estaba regresa a la mesa', () => {
    const c = colocar({ objetivo: ['viejo'] }, 'nuevo', 'objetivo', { cupo: 1 })
    expect(c.objetivo).toEqual(['nuevo'])
    expect(donde(c, 'viejo')).toBe(MESA)
  })

  it('soltar en la mesa es devolver', () => {
    expect(colocar({ dentro: ['a'] }, 'a', MESA)).toEqual({ dentro: [] })
    expect(quitar({ dentro: ['a', 'b'] }, 'a')).toEqual({ dentro: ['b'] })
  })

  it('la mesa conserva el orden de autoría', () => {
    expect(enMesa(['a', 'b', 'c', 'd'], { x: ['c', 'a'] })).toEqual(['b', 'd'])
  })

  it('no confía en la forma de lo guardado', () => {
    for (const malo of [null, undefined, 'texto', 42, [], ['a']]) expect(normalizar(malo)).toEqual({})
    expect(normalizar({ a: 'no lista', b: ['x', 7, null, 'x'], c: ['x', 'y'], [MESA]: ['z'] }))
      .toEqual({ b: ['x'], c: ['y'] })
    expect(() => colocar('basura', 'a', 'r')).not.toThrow()
  })
})

describe('Mesa', () => {
  const pinta = () => renderToStaticMarkup(
    <Mesa onColocar={() => {}} nombrePieza={(p) => p} nombreRanura={(r) => r}>
      <Ranura id={MESA}><Pieza id="a">Lobos en el bosque</Pieza></Ranura>
      <Ranura id="riesgos" etiqueta="Riesgos"><Pieza id="b" en="riesgos" indice={0}>Que ya no busquen músicos</Pieza></Ranura>
    </Mesa>,
  )

  it('se pinta sin lanzar y cada pieza es un botón alcanzable con teclado', () => {
    const html = pinta()
    expect(html.match(/<button type="button" class="pieza/g)).toHaveLength(2)
    expect(html).toContain('aria-pressed="false"')
    expect(html).toContain('data-ranura="riesgos"')
  })

  it('anuncia los cambios a lectores de pantalla', () => {
    expect(pinta()).toContain('aria-live="polite"')
  })
})
