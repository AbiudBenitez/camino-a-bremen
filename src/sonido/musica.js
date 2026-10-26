/**
 * La música en capas. Las cuatro pistas arrancan juntas en el mismo instante y
 * nunca se detienen: las de los animales que aún no se suman suenan a volumen
 * cero. Así no hay forma de que se desfasen.
 *
 * Web Audio y no `<audio loop>`, que deja un hueco audible al reiniciar.
 */
import { ANIMALES } from '../destinos/catalogo.js'
import { sintetizar } from './sintesis.js'

const VOLUMEN = 0.5
// Constante de tiempo de las rampas: un animal entra, no aparece de golpe.
const SUAVE = 0.6

let ctx = null
let maestro = null
let filtro = null
const capas = {}

/** Solo se puede llamar desde un gesto del usuario: los navegadores lo exigen. */
export async function iniciar() {
  if (ctx) { await ctx.resume(); return }
  const Contexto = window.AudioContext ?? window.webkitAudioContext
  if (!Contexto) return
  ctx = new Contexto()
  maestro = ctx.createGain()
  maestro.gain.value = 0
  filtro = ctx.createBiquadFilter()
  filtro.type = 'lowpass'
  filtro.frequency.value = 18000
  filtro.connect(maestro)
  maestro.connect(ctx.destination)

  const pistas = sintetizar(ctx.sampleRate)
  const arranque = ctx.currentTime + 0.1
  for (const animal of ANIMALES) {
    const buffer = ctx.createBuffer(1, pistas[animal].length, ctx.sampleRate)
    buffer.copyToChannel(pistas[animal], 0)
    const fuente = ctx.createBufferSource()
    fuente.buffer = buffer
    fuente.loop = true
    const g = ctx.createGain()
    g.gain.value = 0
    fuente.connect(g).connect(filtro)
    fuente.start(arranque)
    capas[animal] = g
  }
}

export const sonando = () => ctx?.state === 'running'

/** Qué animales suenan y si es de noche. De noche la misma música se apaga en los agudos. */
export function mezclar({ banda, noche }) {
  if (!ctx) return
  const t = ctx.currentTime
  for (const animal of ANIMALES) {
    capas[animal]?.gain.setTargetAtTime(banda.includes(animal) ? 1 : 0, t, SUAVE)
  }
  filtro.frequency.setTargetAtTime(noche ? 1100 : 18000, t, 1.2)
  maestro.gain.setTargetAtTime(VOLUMEN, t, SUAVE)
}

export function callar() {
  if (!ctx) return
  maestro.gain.setTargetAtTime(0, ctx.currentTime, 0.15)
  setTimeout(() => { if (maestro.gain.value < 0.01) ctx.suspend() }, 900)
}
