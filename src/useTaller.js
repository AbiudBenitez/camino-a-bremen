import { useCallback, useEffect, useState } from 'react'
import { descargar, guardar, importar, leer, limpiar, volcarYa } from './estado/almacen.js'
import { vacio } from './estado/esquema.js'
import { reducir } from './estado/taller.js'

/** Expediente + persistencia. Un solo lugar donde la interfaz toca el estado. */
export function useTaller() {
  // Inicialización perezosa: leer el almacén es trabajo y solo se hace una vez.
  const [inicial] = useState(leer)
  const [estado, setEstado] = useState(inicial.estado)
  const [aviso, setAviso] = useState(inicial.aviso)
  const [guardadoA, setGuardadoA] = useState(null)

  const despachar = useCallback((accion) => {
    setEstado((previo) => {
      const siguiente = reducir(previo, accion)
      guardar(siguiente, () => setAviso(
        'Tu navegador dejó de guardar el avance. Descarga el expediente para no perderlo.'))
      setGuardadoA(new Date())
      return siguiente
    })
  }, [])

  // El buffer se vacía al ocultarse la página. No en beforeunload, que en
  // Safari móvil no es de fiar.
  useEffect(() => {
    const alOcultar = () => { if (document.visibilityState === 'hidden') volcarYa() }
    document.addEventListener('visibilitychange', alOcultar)
    window.addEventListener('pagehide', volcarYa)
    return () => {
      document.removeEventListener('visibilitychange', alOcultar)
      window.removeEventListener('pagehide', volcarYa)
    }
  }, [])

  const reiniciar = useCallback(() => {
    limpiar()
    setEstado(vacio())
    setGuardadoA(null)
  }, [])

  const cargarArchivo = useCallback(async (archivo) => {
    try {
      const cargado = await importar(archivo)
      despachar({ tipo: 'cargar', estado: cargado })
    } catch (e) {
      setAviso(e.message)
    }
  }, [despachar])

  return {
    estado, despachar, aviso, descartarAviso: () => setAviso(null),
    guardadoA, reiniciar, descargar: () => descargar(estado), cargarArchivo,
  }
}
