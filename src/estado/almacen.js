/**
 * Persistencia en el navegador. Ningun dato personal sale de aqui: no hay red.
 *
 * Tres cosas que el andamio anterior no hacia y que cuestan trabajo del
 * estudiante: migrar en vez de borrar, escribir con retardo en vez de en cada
 * tecla, y avisar cuando el navegador no deja guardar.
 */
import { VERSION, migrar, vacio } from './esquema.js'

const CLAVE = 'camino-a-bremen/expediente'
const RESPALDO = 'camino-a-bremen/expediente.respaldo'
const RETARDO = 400

let pendiente = null
let temporizador = null

/** @returns {{estado: object, aviso: string|null}} */
export function leer() {
  let crudo
  try {
    crudo = localStorage.getItem(CLAVE)
  } catch {
    return { estado: vacio(), aviso: 'Tu navegador no deja guardar el avance. Puedes trabajar, ' +
      'pero si cierras la pestaña se pierde. Descarga el expediente antes de salir.' }
  }
  if (!crudo) return { estado: vacio(), aviso: null }

  try {
    const migrado = migrar(JSON.parse(crudo))
    if (migrado) return { estado: migrado, aviso: null }
  } catch { /* cae al aviso de abajo */ }

  // No se pudo leer: se respalda el original tal cual antes de empezar de cero,
  // para no destruir lo que el estudiante escribio.
  try { localStorage.setItem(RESPALDO, crudo) } catch { /* sin respaldo, ni modo */ }
  return { estado: vacio(), aviso: 'No se pudo leer tu avance anterior y se empezó de nuevo. ' +
    'La copia vieja quedó guardada por si hace falta recuperarla.' }
}

function volcar() {
  temporizador = null
  if (!pendiente) return true
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ ...pendiente, version: VERSION }))
    pendiente = null
    return true
  } catch {
    return false
  }
}

/** Guarda con retardo: localStorage es sincrono y serializar en cada tecla
 *  se siente en un teléfono de gama media. */
export function guardar(estado, alFallar) {
  pendiente = estado
  if (temporizador) clearTimeout(temporizador)
  temporizador = setTimeout(() => {
    if (!volcar() && alFallar) alFallar()
  }, RETARDO)
}

/** Vacía el buffer ya. Se llama al salir del campo y al ocultarse la página. */
export function volcarYa() {
  if (temporizador) clearTimeout(temporizador)
  return volcar()
}

export function limpiar() {
  pendiente = null
  if (temporizador) clearTimeout(temporizador)
  try { localStorage.removeItem(CLAVE); return true } catch { return false }
}

/** El expediente como archivo. Es el respaldo real del estudiante y es además
 *  lo que entrega para que se lo califiquen. */
export function descargar(estado) {
  const texto = JSON.stringify(estado, null, 2)
  const url = URL.createObjectURL(new Blob([texto], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `camino-a-bremen-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importar(archivo) {
  const migrado = migrar(JSON.parse(await archivo.text()))
  if (!migrado) throw new Error('Ese archivo no es un expediente de este taller')
  return migrado
}
