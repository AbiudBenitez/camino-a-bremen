import { useState } from 'react'

/** Descargar, cargar y empezar de cero. El reinicio a la vista es criterio de H-05. */
export default function Expediente({ taller }) {
  const [confirmando, setConfirmando] = useState(false)
  return (
    <section className="expediente">
      <h2>Tu expediente</h2>
      <p className="ayuda">
        Se guarda solo en este navegador. Si lo limpias o cambias de equipo, se pierde:
        descárgalo para conservarlo. Ese archivo es también lo que entregas.
      </p>
      <div className="acciones">
        <button type="button" onClick={taller.descargar}>Descargar</button>
        <label className="como-boton">
          Cargar
          <input type="file" accept="application/json" hidden
            onChange={(e) => e.target.files[0] && taller.cargarArchivo(e.target.files[0])} />
        </label>
        {confirmando ? (
          <span className="confirmar">
            ¿Borrar todo lo escrito?
            <button type="button" className="peligro"
              onClick={() => { taller.reiniciar(); setConfirmando(false) }}>Sí, empezar de cero</button>
            <button type="button" onClick={() => setConfirmando(false)}>Cancelar</button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirmando(true)}>Empezar de cero</button>
        )}
      </div>
      <p className="no-oficial">
        Este taller no otorga una certificación oficial del PMI ni de Scrum.org. Lo que escribes
        no sale de este navegador.
      </p>
    </section>
  )
}
