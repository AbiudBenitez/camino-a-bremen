import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { MESA } from './colocacion.js'
import './arrastre.css'

/**
 * La interacción que comparten todos los minijuegos: tocar una pieza y luego
 * tocar dónde va. Arrastrar es la vía rápida para lo mismo; el teclado y el
 * toque son la vía completa (regla de diseño 11).
 *
 * Pointer Events y no el drag and drop de HTML, que en teléfono no funciona.
 * La Mesa no sabe de actas ni de EDT: avisa `onColocar(pieza, ranura, indice)`
 * y el minijuego decide qué hacer con eso.
 */
const Contexto = createContext(null)

// Distancia antes de que un toque se vuelva arrastre, y en pantalla táctil el
// tiempo que hay que sostener la pieza: sin eso, deslizar para hacer scroll
// sobre una lista de tarjetas las levantaría todas.
const UMBRAL = 6
const SOSTENER = 180

export function Mesa({ onColocar, nombrePieza, nombreRanura, className = '', children }) {
  const [elegida, setElegida] = useState(null)
  const [aviso, setAviso] = useState('')
  const [arrastre, setArrastre] = useState(null)
  const gesto = useRef(null)
  const fantasma = useRef(null)
  const recienSoltada = useRef(false)

  const colocar = useCallback((pieza, ranura, indice) => {
    onColocar(pieza, ranura, indice)
    setElegida(null)
    setAviso(ranura === MESA
      ? `«${nombrePieza(pieza)}» regresó a la mesa.`
      : `«${nombrePieza(pieza)}» quedó en ${nombreRanura(ranura)}.`)
  }, [onColocar, nombrePieza, nombreRanura])

  const elegir = useCallback((pieza) => {
    const nueva = elegida === pieza ? null : pieza
    setElegida(nueva)
    setAviso(nueva ? `Elegiste «${nombrePieza(nueva)}». Ahora elige dónde va.` : 'Ninguna pieza elegida.')
  }, [elegida, nombrePieza])

  const soltar = useCallback(() => setElegida(null), [])

  const iniciar = useCallback((e, pieza) => {
    if (e.button !== 0) return
    gesto.current = { pieza, x: e.clientX, y: e.clientY, t: Date.now(), tactil: e.pointerType === 'touch', activo: false, sobre: null }
  }, [])

  // El clic que el navegador dispara al terminar un arrastre no es una elección.
  const fueArrastre = useCallback(() => {
    if (!recienSoltada.current) return false
    recienSoltada.current = false
    return true
  }, [])

  useEffect(() => {
    const destino = (x, y) => {
      const el = document.elementFromPoint(x, y)
      const sobrePieza = el?.closest('[data-pieza][data-en]')
      if (sobrePieza && sobrePieza.dataset.en !== MESA && sobrePieza.dataset.pieza !== gesto.current?.pieza) {
        return { ranura: sobrePieza.dataset.en, indice: Number(sobrePieza.dataset.indice) }
      }
      const r = el?.closest('[data-ranura]')
      return r ? { ranura: r.dataset.ranura } : null
    }

    const mover = (e) => {
      const g = gesto.current
      if (!g) return
      if (!g.activo) {
        if (Math.hypot(e.clientX - g.x, e.clientY - g.y) < UMBRAL) return
        if (g.tactil && Date.now() - g.t < SOSTENER) { gesto.current = null; return }
        g.activo = true
        setArrastre({ pieza: g.pieza, sobre: null })
      }
      if (fantasma.current) {
        fantasma.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
      const d = destino(e.clientX, e.clientY)
      if (d?.ranura !== g.sobre?.ranura || d?.indice !== g.sobre?.indice) {
        g.sobre = d
        setArrastre({ pieza: g.pieza, sobre: d })
      }
    }

    const terminar = (cancelado) => () => {
      const g = gesto.current
      gesto.current = null
      if (!g?.activo) return
      setArrastre(null)
      recienSoltada.current = true
      setTimeout(() => { recienSoltada.current = false }, 0)
      if (!cancelado && g.sobre) colocar(g.pieza, g.sobre.ranura, g.sobre.indice)
    }

    // Con la pieza ya sostenida, el dedo no debe desplazar la página.
    const sinScroll = (e) => {
      const g = gesto.current
      if (g?.tactil && (g.activo || Date.now() - g.t >= SOSTENER)) e.preventDefault()
    }

    const arriba = terminar(false)
    const cancelar = terminar(true)
    window.addEventListener('pointermove', mover)
    window.addEventListener('pointerup', arriba)
    window.addEventListener('pointercancel', cancelar)
    document.addEventListener('touchmove', sinScroll, { passive: false })
    return () => {
      window.removeEventListener('pointermove', mover)
      window.removeEventListener('pointerup', arriba)
      window.removeEventListener('pointercancel', cancelar)
      document.removeEventListener('touchmove', sinScroll)
    }
  }, [colocar])

  const valor = useMemo(() => ({
    elegida, arrastre, colocar, elegir, soltar, iniciar, fueArrastre,
  }), [elegida, arrastre, colocar, elegir, soltar, iniciar, fueArrastre])

  return (
    <Contexto.Provider value={valor}>
      <div className={`mesa${arrastre ? ' arrastrando' : ''} ${className}`}
        onKeyDown={(e) => { if (e.key === 'Escape' && elegida) { e.stopPropagation(); soltar() } }}>
        {children}
        <p className="oculto-visual" aria-live="polite">{aviso}</p>
        {arrastre && (
          <div className="fantasma" aria-hidden="true" ref={(el) => {
            fantasma.current = el
            // Se posiciona al montar; después lo mueve el puntero sin pasar por React.
            if (el && !el.style.transform && gesto.current) {
              el.style.transform = `translate(${gesto.current.x}px, ${gesto.current.y}px)`
            }
          }}>
            <span>{nombrePieza(arrastre.pieza)}</span>
          </div>
        )}
      </div>
    </Contexto.Provider>
  )
}

/**
 * Una pieza. En la mesa, `en` se omite; colocada, trae su ranura y su posición.
 * Tocar otra pieza ya colocada con una elegida la mete antes de ella: así se
 * ordena una pila sin arrastrar.
 */
export function Pieza({ id, en = MESA, indice, className = '', children }) {
  const m = useContext(Contexto)
  const elegida = m.elegida === id
  const levantada = m.arrastre?.pieza === id

  const alTocar = (e) => {
    e.stopPropagation()
    if (m.fueArrastre()) return
    if (m.elegida && m.elegida !== id && en !== MESA) m.colocar(m.elegida, en, indice)
    else m.elegir(id)
  }

  return (
    <button type="button" className={`pieza${elegida ? ' elegida' : ''}${levantada ? ' levantada' : ''} ${className}`}
      data-pieza={id} data-en={en} data-indice={indice}
      aria-pressed={elegida}
      onPointerDown={(e) => m.iniciar(e, id)}
      onClick={alTocar}>
      {children}
    </button>
  )
}

/** Un lugar donde va una o varias piezas. La mesa misma es `<Ranura id={MESA}>`. */
export function Ranura({ id, etiqueta, className = '', children }) {
  const m = useContext(Contexto)
  const disponible = m.elegida != null
  const sobre = m.arrastre?.sobre?.ranura === id

  const poner = (e) => {
    e.stopPropagation()
    m.colocar(m.elegida, id)
  }

  return (
    <div className={`ranura${disponible ? ' disponible' : ''}${sobre ? ' sobre' : ''} ${className}`}
      data-ranura={id} onClick={disponible ? poner : undefined}>
      {etiqueta && <p className="ranura-etiqueta">{etiqueta}</p>}
      {children}
      {disponible && (
        <button type="button" className="poner-aqui" onClick={poner}>
          {id === MESA ? 'Devolver a la mesa' : 'Poner aquí'}
          {etiqueta && id !== MESA && <span className="oculto-visual"> en {etiqueta}</span>}
        </button>
      )}
    </div>
  )
}
