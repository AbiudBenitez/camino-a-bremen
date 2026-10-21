/** Dónde vas del acta. Es la señal de avance más barata que existe y evita que
 *  una secuencia larga se sienta sin fondo. */
export default function Progreso({ paso, total, onIr }) {
  return (
    <div className="progreso">
      <p className="cuenta">
        Paso <strong>{Math.min(paso + 1, total)}</strong> de {total}
      </p>
      <ol className="pasos" aria-label="Avance del acta">
        {Array.from({ length: total }, (_, i) => (
          <li key={i}>
            <button
              type="button"
              className={`punto${i === paso ? ' aqui' : ''}${i < paso ? ' hecho' : ''}`}
              aria-label={`Ir al paso ${i + 1}`}
              aria-current={i === paso ? 'step' : undefined}
              onClick={() => onIr(i)}
            />
          </li>
        ))}
      </ol>
    </div>
  )
}
