import { useCallback, useState } from 'react'
import { MESA, colocar, enMesa, normalizar } from '../../arrastre/colocacion.js'
import { Mesa, Pieza, Ranura } from '../../arrastre/Mesa.jsx'
import { evaluar } from '../../motor/motor.js'
import { ACERCA, ANIMALES, DE_PLANEACION, OBJETIVOS, TAREAS, TERMINADO, animal, carga, tarea } from '../../motor/reglas/final.js'
import { borrador, entregado } from '../../estado/taller.js'
import { recorrido } from '../catalogo.js'
import Hallazgos from '../../componentes/Hallazgos.jsx'
import Explica from '../../componentes/Explica.jsx'
import ComoSeJuega from '../../componentes/ComoSeJuega.jsx'
import { PASOS } from '../instrucciones.js'
import NotaFlotante from '../../componentes/NotaFlotante.jsx'
import Ilustracion from '../../ilustraciones/Ilustracion.jsx'
import { ANIMAL } from '../../mapa/indice.js'
import './final.css'

const PESO = 320

// El orden en que el ladrón recorre la casa en el cuento: cocina, puerta, patio y techo.
const RECORRIDO = [
  ['fogon', 'Entra a la cocina a buscar lumbre y confunde unos ojos brillantes con brasas del fogón.'],
  ['puerta', 'Asustado, corre hacia la puerta de atrás.'],
  ['patio', 'Sale disparado y cruza el patio, junto al montón de paja.'],
  ['viga', 'Con el escándalo, la casa entera despierta.'],
]

/**
 * El acto final: la noche como un sprint. Primero la planeación (objetivo,
 * Definición de Terminado y reparto por capacidad), luego la noche que cuenta
 * el final de los Grimm con el reparto del estudiante, y al final la
 * retrospectiva, que termina en un compromiso.
 */
export default function Final({ estado, despachar }) {
  const [momento, setMomento] = useState(() => (recorrido(estado, 'final') ? 'fin' : 'plan'))

  return (
    <article className="final">
      <div className="final-titulo">
        <a className="volver" href="#mapa">← Al mapa</a>
        <h1>El acto final</h1>
        <span className="titulo-concepto">
          {ACERCA.sprint.titulo}
          <Explica titulo={ACERCA.sprint.titulo} fuente={ACERCA.sprint.fuente}>{ACERCA.sprint.explicacion}</Explica>
        </span>
      </div>
      {momento === 'plan' && <Planeacion estado={estado} despachar={despachar} onListo={() => setMomento('noche')} />}
      {momento === 'noche' && <Noche estado={estado} onAmanece={() => setMomento('retro')} />}
      {momento === 'retro' && <Retro estado={estado} despachar={despachar} onListo={() => setMomento('fin')} />}
      {momento === 'fin' && <Fin estado={estado} />}
    </article>
  )
}

function Planeacion({ estado, despachar, onListo }) {
  const datos = borrador(estado, 'final')
  const col = normalizar(datos.colocaciones)
  const [nota, setNota] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [lecturas, setLecturas] = useState(0)

  const escribir = useCallback((campo, valor) => {
    setResultado(null)
    despachar({ tipo: 'escribir', artefacto: 'final', campo, valor })
  }, [despachar])

  const alColocar = (id, ranura, indice) => {
    const nuevas = colocar(col, id, ranura, { indice })
    const error = evaluar('final', { ...datos, colocaciones: nuevas }).hallazgos
      .find((h) => (h.regla === 'final.sirve' && h.campo === id) || (h.regla === 'final.capacidad' && h.campo === ranura))
    if (error) { setNota({ tarjeta: tarea(id)?.texto ?? id, mensaje: error.mensaje, fuente: error.fuente }); return }
    setNota(null)
    escribir('colocaciones', nuevas)
  }

  const empezar = () => {
    const r = evaluar('final', datos)
    const hallazgos = r.hallazgos.filter((h) => DE_PLANEACION.includes(h.regla))
    const errores = hallazgos.filter((h) => h.gravedad === 'error').length
    if (!errores) { onListo(); return }
    setLecturas((n) => n + 1)
    setResultado({ ...r, hallazgos, resumen: { ...r.resumen, total: hallazgos.length, errores, avisos: hallazgos.length - errores, pasa: false } })
  }

  return (
    <>
      <ComoSeJuega pasos={PASOS.final} />

      <div className="acuerdos">
        <fieldset className="objetivo">
          <legend>
            Objetivo de la noche
            <Explica titulo={ACERCA.objetivo.titulo} fuente={ACERCA.objetivo.fuente}>{ACERCA.objetivo.explicacion}</Explica>
          </legend>
          {OBJETIVOS.map((o) => (
            <label key={o.id} className="opcion">
              <input type="radio" name="objetivo" value={o.id} checked={datos.objetivo === o.id}
                onChange={() => escribir('objetivo', o.id)} />
              <span>{o.texto}</span>
            </label>
          ))}
        </fieldset>
        <div className="terminado">
          <p className="ranura-etiqueta">
            Definición de Terminado
            <Explica titulo={ACERCA.terminado.titulo} fuente={ACERCA.terminado.fuente}>{ACERCA.terminado.explicacion}</Explica>
          </p>
          <p>{TERMINADO}</p>
        </div>
      </div>

      <Mesa onColocar={alColocar} nombrePieza={(id) => tarea(id)?.texto ?? id}
        nombreRanura={(r) => animal(r)?.nombre.toLowerCase() ?? 'la mesa'} className="casa-noche">
        <Ranura id={MESA} etiqueta="Lo que se podría hacer esta noche" className="mesa-final">
          {enMesa(TAREAS.map((t) => t.id), col).map((id) => (
            <Pieza key={id} id={id}>{tarea(id).texto}<span className="horas"> · {tarea(id).horas} h</span></Pieza>
          ))}
        </Ranura>

        <section className="banda-puestos" aria-label="Quién hace qué esta noche">
          <p className="ranura-etiqueta capacidad-titulo">
            Cada animal y cuántas horas aguanta despierto
            <Explica titulo={ACERCA.capacidad.titulo} fuente={ACERCA.capacidad.fuente}>{ACERCA.capacidad.explicacion}</Explica>
          </p>
          <div className="puestos">
            {ANIMALES.map((a) => {
              const Dibujo = ANIMAL[a.id]
              const lleva = carga(col, a.id)
              return (
                <Ranura key={a.id} id={a.id} etiqueta={a.nombre} className="puesto">
                  <svg className="puesto-animal" viewBox="0 0 60 50" aria-hidden="true">
                    <Ilustracion clave={`animal-${a.id}`} x={30} y={45} ancho={60}><Dibujo /></Ilustracion>
                  </svg>
                  <span className="medidor" aria-label={`${lleva} de ${a.capacidad} horas`}>
                    {Array.from({ length: a.capacidad }, (_, i) => <span key={i} className={i < lleva ? 'llena' : ''} />)}
                    <span className="cifra">{lleva} / {a.capacidad} h</span>
                  </span>
                  {(col[a.id] ?? []).map((id, i) => (
                    <Pieza key={id} id={id} en={a.id} indice={i}>{tarea(id)?.texto ?? id}<span className="horas"> · {tarea(id)?.horas} h</span></Pieza>
                  ))}
                </Ranura>
              )
            })}
          </div>
        </section>

        <NotaFlotante nota={nota} onCerrar={() => setNota(null)} />

        <div className="pie-final">
          <button type="button" className="primario" onClick={empezar}>Apagar las luces y esperar</button>
          <Hallazgos key={lecturas} resultado={resultado} />
        </div>
      </Mesa>
    </>
  )
}

function Noche({ estado, onAmanece }) {
  const col = normalizar(borrador(estado, 'final').colocaciones)
  const quien = (t) => animal(Object.keys(col).find((a) => col[a].includes(t)))
  return (
    <section className="noche" aria-labelledby="noche-titulo">
      <h2 id="noche-titulo">A medianoche</h2>
      <p>El jefe de los ladrones ve la casa a oscuras y en silencio, y manda a uno a revisar.</p>
      {RECORRIDO.map(([t, antes], i) => {
        const a = quien(t)
        return (
          <p key={t} className="paso" style={{ animationDelay: `${0.6 + i * 1.1}s` }}>
            {antes} {a ? <><strong>{a.nombre}</strong>, que cuidaba {tarea(t).lugar.toLowerCase()}, {a.hace}.</> : null}
          </p>
        )
      })}
      <p className="paso" style={{ animationDelay: `${0.6 + RECORRIDO.length * 1.1}s` }}>
        El ladrón corre con su jefe: «En esa casa hay un monstruo en cada rincón». Los ladrones no volvieron nunca.
      </p>
      <button type="button" className="primario paso" style={{ animationDelay: `${1 + RECORRIDO.length * 1.1}s` }} onClick={onAmanece}>
        Amanece →
      </button>
    </section>
  )
}

function Retro({ estado, despachar, onListo }) {
  const datos = borrador(estado, 'final')
  const retro = datos.retro && typeof datos.retro === 'object' ? datos.retro : {}
  const [resultado, setResultado] = useState(null)
  const [leyendo, setLeyendo] = useState(false)

  const escribir = (k, v) => {
    setResultado(null)
    despachar({ tipo: 'escribir', artefacto: 'final', campo: 'retro', valor: { ...retro, [k]: v } })
  }

  const cerrar = () => {
    setLeyendo(true)
    setResultado(null)
    const r = evaluar('final', datos)
    setTimeout(() => {
      setLeyendo(false)
      despachar({ tipo: 'entregar', artefacto: 'final', resumen: r.resumen })
      if (r.resumen.pasa) {
        despachar({ tipo: 'llegar', destino: 'final' })
        onListo()
      } else {
        setResultado(r)
      }
    }, PESO)
  }

  return (
    <section className="retro" aria-labelledby="retro-titulo">
      <div className="retro-cabeza">
        <h2 id="retro-titulo">La retrospectiva, con el desayuno</h2>
        <Explica titulo={ACERCA.retro.titulo} fuente={ACERCA.retro.fuente}>{ACERCA.retro.explicacion}</Explica>
      </div>
      <p>Amaneció y la casa sigue siendo suya. Antes de la próxima noche, la banda se sienta a ver cómo le fue.</p>
      {[['bien', '¿Qué nos funcionó?', 'Cada quien supo cuál era su puesto.'],
        ['mejorar', '¿Qué mejoramos para la próxima?', 'El gallo casi se queda dormido en la viga.'],
        ['compromiso', '¿A qué nos comprometemos para el siguiente sprint?', 'El gallo duerme una siesta antes de la guardia.']]
        .map(([k, etiqueta, ejemplo]) => (
          <label key={k} className="campo-retro">
            <span>{etiqueta}</span>
            <textarea id={`retro-${k}`} rows={2} value={typeof retro[k] === 'string' ? retro[k] : ''} placeholder={ejemplo}
              onChange={(e) => escribir(k, e.target.value)} />
          </label>
        ))}
      <div className="pie-final">
        <button type="button" className="primario" onClick={cerrar} disabled={leyendo}>
          {leyendo ? 'La banda lo platica…' : 'Cerrar la retrospectiva'}
        </button>
        <Hallazgos key={estado.artefactos.final?.intentos ?? 0} resultado={resultado} />
      </div>
    </section>
  )
}

function Fin({ estado }) {
  const retro = entregado(estado, 'final')?.retro
  const compromiso = retro && typeof retro.compromiso === 'string' ? retro.compromiso.trim() : ''
  return (
    <section className="salida fin" role="status">
      <h2>Y se quedaron a vivir ahí</h2>
      <p>
        A los cuatro músicos de Bremen les gustó tanto la casa que ya no quisieron salir de ella. Nunca llegaron a
        Bremen, y no les hizo falta: el plan cambió, y supieron cambiar con él.
      </p>
      {compromiso && (
        <p className="compromiso"><span className="ranura-etiqueta">Su compromiso para el siguiente sprint</span>{compromiso}</p>
      )}
      <a className="como-boton primario" href="#mapa">Ver el camino recorrido →</a>
    </section>
  )
}
