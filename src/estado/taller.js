/**
 * Reducer del expediente. Funciones puras: toda la logica de avance vive aqui y
 * se prueba sin montar interfaz.
 */
import { BITACORA_MAX, artefactoVacio, vacio } from './esquema.js'

function anotar(estado, tipo, datos) {
  const bitacora = [...estado.bitacora, { t: new Date().toISOString(), tipo, datos }]
  return bitacora.slice(-BITACORA_MAX)
}

function conArtefacto(estado, id, cambio) {
  const previo = estado.artefactos[id] ?? artefactoVacio()
  return {
    ...estado,
    actualizado: new Date().toISOString(),
    artefactos: { ...estado.artefactos, [id]: { ...previo, ...cambio(previo) } },
  }
}

export function reducir(estado, accion) {
  switch (accion.tipo) {
    case 'escribir':
      return conArtefacto(estado, accion.artefacto, (a) => ({
        borrador: { ...a.borrador, [accion.campo]: accion.valor },
        // Editar despues de entregar no descongela lo entregado: lo marca.
        reabierto: a.entregado != null,
      }))

    case 'entregar': {
      const siguiente = conArtefacto(estado, accion.artefacto, (a) => ({
        entregado: structuredClone(a.borrador),
        entregadoEn: new Date().toISOString(),
        intentos: a.intentos + 1,
        reabierto: false,
        resumen: accion.resumen,
      }))
      return { ...siguiente, bitacora: anotar(siguiente, 'entrega', {
        artefacto: accion.artefacto, ...accion.resumen }) }
    }

    case 'reiniciar':
      return vacio()

    case 'preferencia':
      return { ...estado, preferencias: { ...estado.preferencias, [accion.clave]: accion.valor } }

    case 'cargar':
      return accion.estado

    default:
      return estado
  }
}

// ------------------------------------------------------------- selectores
export const artefacto = (estado, id) => estado.artefactos[id] ?? artefactoVacio()
export const borrador = (estado, id) => artefacto(estado, id).borrador
export const entregado = (estado, id) => artefacto(estado, id).entregado

/** Expediente de solo lectura: lo ENTREGADO de cada etapa. Es lo que pueden
 *  consultar las reglas de etapas posteriores. Nunca el borrador. */
export function expediente(estado) {
  const out = {}
  for (const [id, a] of Object.entries(estado.artefactos)) {
    if (a.entregado) out[id] = a.entregado
  }
  return Object.freeze(out)
}

/** Puerta de cada etapa: se abre cuando la anterior fue entregada. */
const PUERTA = { 2: 'acta', 3: 'edt', 4: 'ruta', 5: 'backlog', 6: 'sprint' }

export function puedeEntrar(n, estado) {
  return n === 1 || entregado(estado, PUERTA[n]) != null
}

export function estadoEtapa(n, estado, idArtefacto) {
  if (!puedeEntrar(n, estado)) return 'bloqueada'
  const a = artefacto(estado, idArtefacto)
  if (a.entregado && a.resumen?.pasa) return 'sellada'
  if (a.entregado) return 'entregada'
  return 'abierta'
}
