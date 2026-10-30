import { useCallback, useEffect } from 'react'
import { banda, deNoche } from '../destinos/catalogo.js'
import { callar, iniciar, mezclar, sonando } from './musica.js'

/**
 * Conecta la música con el expediente. Nunca suena sin que el estudiante haya
 * dicho que sí, y nada del juego depende de oírla.
 */
export function useMusica(estado, despachar) {
  const sonido = estado.preferencias?.sonido ?? null
  const capas = banda(estado).join(',')
  const noche = deNoche(estado)

  useEffect(() => {
    if (sonido !== true) { callar(); return }
    const mezcla = { banda: capas.split(','), noche }
    if (sonando()) { mezclar(mezcla); return }
    // Al recargar con la música encendida, el navegador exige un gesto antes
    // de sonar: arranca con el primer toque o tecla.
    const arrancar = async () => { await iniciar(); mezclar(mezcla) }
    window.addEventListener('pointerdown', arrancar, { once: true })
    window.addEventListener('keydown', arrancar, { once: true })
    return () => {
      window.removeEventListener('pointerdown', arrancar)
      window.removeEventListener('keydown', arrancar)
    }
  }, [sonido, capas, noche])

  // Se llama desde el clic del botón: ese clic es el gesto que el navegador pide.
  const elegir = useCallback((si) => {
    if (si) iniciar()
    despachar({ tipo: 'preferencia', clave: 'sonido', valor: si })
  }, [despachar])

  return { sonido, elegir }
}
