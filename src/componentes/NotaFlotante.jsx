import { cita } from '../motor/contrato.js'

/**
 * Lo que dice el animal cuando una tarjeta no va ahí. Flota al pie de la
 * pantalla para leerse en el momento del error, sin buscarlo con scroll. No es
 * un modal: no bloquea la mesa y se va con «Entendido» o al colocar otra pieza.
 *
 * La región viva existe siempre, vacía o no, para que el lector de pantalla
 * anuncie la nota en cuanto aparece.
 */
export default function NotaFlotante({ nota, onCerrar }) {
  return (
    <div className={`nota-flotante${nota ? ' visible' : ''}`} role="status">
      {nota && (
        <>
          <p className="nota-tarjeta">«{nota.tarjeta}» regresó a la mesa.</p>
          <p>{nota.mensaje}</p>
          <p className="fuente">{cita(nota.fuente)}</p>
          <button type="button" className="nota-cerrar" onClick={onCerrar}>Entendido</button>
        </>
      )}
    </div>
  )
}
