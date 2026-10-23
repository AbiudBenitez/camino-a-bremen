/**
 * Avance del acta. Sin numero y sin circulos.
 *
 * «Paso 3 de 13» es una cuenta de deudas pendientes, y trece circulos huecos
 * en fila son, sin querer, una hoja de burbujas de examen. Una barra continua
 * dice lo mismo sin que se pueda contar lo que falta.
 */
export default function Progreso({ paso, total, titulo, onIr }) {
  return (
    <div className="progreso">
      <div className="riel" role="progressbar" aria-valuenow={paso + 1}
           aria-valuemin={1} aria-valuemax={total} aria-label="Avance del acta">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`tramo${i === paso ? ' aqui' : ''}${i < paso ? ' hecho' : ''}`}
            aria-label={`Ir al paso ${i + 1}`}
            onClick={() => onIr(i)}
          />
        ))}
      </div>
      {titulo && <p className="donde">{titulo}</p>}
    </div>
  )
}
