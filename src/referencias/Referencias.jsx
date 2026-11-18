import { OBRAS } from '../motor/contrato.js'
import { CERTIFICACIONES, CUENTO, REFERENCIAS } from './fuentes.js'
import './referencias.css'

const Externo = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">{children}<span className="visualmente-oculto"> (abre en otra pestaña)</span></a>
)

/** De dónde sale lo que dice el taller, y dónde sí se certifica lo que se practica aquí. */
export default function Referencias() {
  return (
    <article className="referencias">
      <a className="volver" href="#mapa">← Al mapa</a>
      <h1>Referencias y certificaciones</h1>
      <p className="ref-entrada">
        Cada observación del taller cita el apartado de su fuente. Aquí están las obras completas, y los
        organismos que sí otorgan certificaciones oficiales.
      </p>

      <section aria-labelledby="ref-fuentes">
        <h2 id="ref-fuentes">De dónde sale la información</h2>
        <ol className="ref-lista">
          {REFERENCIAS.map((r) => (
            <li key={r.cita}>
              <span className="ref-obra">{OBRAS[r.obra]}</span>
              <p className="ref-cita">{r.cita}</p>
              <p className="ref-usa">{r.usa}</p>
              {r.enlace && <p className="ref-enlace"><Externo href={r.enlace}>{r.textoEnlace}</Externo></p>}
            </li>
          ))}
          <li>
            <span className="ref-obra">El cuento</span>
            <p className="ref-cita">{CUENTO.cita}</p>
            <p className="ref-usa">{CUENTO.usa}</p>
          </li>
        </ol>
      </section>

      <section aria-labelledby="ref-certificaciones">
        <h2 id="ref-certificaciones">Dónde sí se certifica</h2>
        <p className="no-oficial-grande">
          Este taller no otorga una certificación oficial. Te ayuda a practicar los conceptos; la certificación la
          da cada organismo, con su propio examen y sus propios requisitos.
        </p>
        <ul className="ref-organismos">
          {CERTIFICACIONES.map((c) => (
            <li key={c.organismo}>
              <h3>{c.organismo}</h3>
              <p className="ref-usa">{c.enfoque}</p>
              <ul>{c.certificaciones.map((x) => <li key={x}>{x}</li>)}</ul>
              <p className="ref-enlace"><Externo href={c.enlace}>Sitio oficial: {c.sitio}</Externo></p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
