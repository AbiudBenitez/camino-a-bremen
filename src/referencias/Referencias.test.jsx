import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Referencias from './Referencias.jsx'
import { CERTIFICACIONES, REFERENCIAS } from './fuentes.js'
import { OBRAS } from '../motor/contrato.js'
import { CATALOGO } from '../motor/catalogo.js'

describe('Referencias', () => {
  it('cada obra que el motor cita tiene su referencia completa', () => {
    const citadas = new Set(Object.values(CATALOGO).flatMap((a) => a.reglas.map((r) => r.fuente.obra)))
    for (const obra of citadas) expect(REFERENCIAS.some((r) => r.obra === obra), obra).toBe(true)
    for (const r of REFERENCIAS) expect(OBRAS[r.obra], r.cita).toBeTruthy()
  })

  it('cada práctica complementaria que cita el motor aparece con su autor', () => {
    const apartados = Object.values(CATALOGO).flatMap((a) => a.reglas.map((r) => r.fuente))
      .filter((f) => f.obra === 'Práctica complementaria').map((f) => f.apartado)
    const citas = REFERENCIAS.map((r) => r.cita).join(' ')
    for (const autor of ['Cohn', 'Work Breakdown Structures', 'Mendelow', '8/80']) {
      if (apartados.some((a) => a.includes(autor))) expect(citas).toContain(autor)
    }
  })

  it('los enlaces son https y abren aparte sin pasar datos', () => {
    const html = renderToStaticMarkup(<Referencias />)
    for (const c of CERTIFICACIONES) expect(c.enlace).toMatch(/^https:\/\//)
    expect(html.match(/target="_blank"/g).length).toBe(html.match(/rel="noopener noreferrer"/g).length)
  })

  it('dice de forma visible que el taller no es certificación oficial', () => {
    expect(renderToStaticMarkup(<Referencias />)).toMatch(/no otorga una certificación oficial/)
  })
})
