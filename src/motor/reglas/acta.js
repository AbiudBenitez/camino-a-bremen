/**
 * Reglas de la etapa 1: acta de constitución del proyecto.
 *
 * Los nueve elementos salen de la plantilla que entrega la materia
 * (Plantilla_acta_constitutiva.docx, sección "Guía para la elaboración de la
 * carta constitutiva"). Ángel confirma la lista contra el material antes de
 * cerrar la historia H-03; el motor no depende de cuáles sean, solo de que
 * estén declarados aquí.
 */
import { AVISO, ERROR, fuente, hallazgo } from '../contrato.js'

export const NUEVE_ELEMENTOS = [
  { campo: 'vision', nombre: 'Visión', porque: 'Es la frase que alinea a todos los interesados hacia la misma meta.' },
  { campo: 'objetivos', nombre: 'Objetivos', porque: 'Sin objetivos específicos y medibles no hay forma de saber si el proyecto terminó bien.' },
  { campo: 'alcance', nombre: 'Alcance', porque: 'Delimita qué entra y qué no, y es lo primero que se discute cuando algo cambia.' },
  { campo: 'entregables', nombre: 'Entregables', porque: 'Son los productos concretos por los que el patrocinador paga.' },
  { campo: 'interesados', nombre: 'Partes interesadas', porque: 'Quién tiene parte activa y pasiva en el proyecto, y quién aprueba.' },
  { campo: 'roles', nombre: 'Roles y responsabilidades', porque: 'Un entregable sin responsable es un entregable que nadie hace.' },
  { campo: 'enfoque', nombre: 'Enfoque de implementación', porque: 'Cómo se va a acometer el proyecto, antes de planear el detalle.' },
  { campo: 'hitos', nombre: 'Cronograma e hitos', porque: 'Marca los puntos donde el patrocinador puede revisar y decidir.' },
  { campo: 'riesgos', nombre: 'Riesgos, supuestos y restricciones', porque: 'Lo que puede descarrilar el proyecto se declara desde el acta, no después.' },
]

const PMBOK_ACTA = fuente('PMBOK', 'Desarrollar el Acta de Constitución del Proyecto')
const PLANTILLA = fuente('Material del curso', 'Plantilla de carta constitutiva, guía de elaboración')

const vacio = (v) => !v || String(v).trim().length === 0

/** Regla 1: los nueve elementos están presentes. */
const elementosPresentes = {
  id: 'acta.elementos-presentes',
  descripcion: 'El acta declara los nueve elementos de la plantilla del curso.',
  fuente: PLANTILLA,
  evaluar(acta) {
    return NUEVE_ELEMENTOS.filter((e) => vacio(acta?.[e.campo])).map((e) =>
      hallazgo({
        regla: 'acta.elementos-presentes',
        gravedad: ERROR,
        campo: e.campo,
        mensaje: `Falta ${e.nombre}. ${e.porque}`,
        fuente: PLANTILLA,
      }),
    )
  },
}

/** Regla 2: la visión cabe en una sola oración. */
const visionUnaOracion = {
  id: 'acta.vision-una-oracion',
  descripcion: 'La visión se redacta en una sola oración, corta y clara.',
  fuente: PLANTILLA,
  evaluar(acta) {
    const texto = String(acta?.vision ?? '').trim()
    if (!texto) return []
    const oraciones = texto.split(/[.!?]+\s+|[.!?]+$/).filter((o) => o.trim().length > 0)
    if (oraciones.length <= 1) return []
    return [
      hallazgo({
        regla: 'acta.vision-una-oracion',
        gravedad: ERROR,
        campo: 'vision',
        mensaje: `Tu visión tiene ${oraciones.length} oraciones. La plantilla pide una sola: si no cabe en una oración, todavía no está decidida.`,
        fuente: PLANTILLA,
      }),
    ]
  },
}

/** Regla 3: al menos dos medidas de éxito, y que sean verificables. */
const medidasDeExito = {
  id: 'acta.medidas-de-exito',
  descripcion: 'Hay al menos dos medidas de éxito y cada una es verificable.',
  fuente: PMBOK_ACTA,
  evaluar(acta) {
    const medidas = (acta?.medidas ?? []).map((m) => String(m).trim()).filter(Boolean)
    const out = []
    if (medidas.length < 2) {
      out.push(
        hallazgo({
          regla: 'acta.medidas-de-exito',
          gravedad: ERROR,
          campo: 'medidas',
          mensaje: `Llevas ${medidas.length} medida(s) de éxito y hacen falta al menos dos. Con una sola, cualquier resultado se puede contar como éxito.`,
          fuente: PMBOK_ACTA,
        }),
      )
    }
    // Heurística deliberadamente simple: una medida sin cifra ni porcentaje rara
    // vez es verificable. Lo cualitativo lo juzga la IA, si el estudiante la pide.
    medidas
      .filter((m) => !/\d/.test(m))
      .forEach((m) =>
        out.push(
          hallazgo({
            regla: 'acta.medidas-de-exito',
            gravedad: AVISO,
            campo: 'medidas',
            mensaje: `«${m}» no trae ninguna cifra. Una medida de éxito sin número no se puede verificar al cierre.`,
            fuente: PMBOK_ACTA,
          }),
        ),
      )
    return out
  },
}

/** Regla 4: fechas de inicio y fin presentes y coherentes entre sí. */
const fechasCoherentes = {
  id: 'acta.fechas-coherentes',
  descripcion: 'Las fechas de inicio y fin están y el fin no es anterior al inicio.',
  fuente: PMBOK_ACTA,
  evaluar(acta) {
    const out = []
    const inicio = acta?.fechaInicio
    const fin = acta?.fechaFin
    if (vacio(inicio)) {
      out.push(hallazgo({
        regla: 'acta.fechas-coherentes', gravedad: ERROR, campo: 'fechaInicio',
        mensaje: 'Falta la fecha de inicio del proyecto.', fuente: PMBOK_ACTA,
      }))
    }
    if (vacio(fin)) {
      out.push(hallazgo({
        regla: 'acta.fechas-coherentes', gravedad: ERROR, campo: 'fechaFin',
        mensaje: 'Falta la fecha de fin del proyecto.', fuente: PMBOK_ACTA,
      }))
    }
    if (!vacio(inicio) && !vacio(fin) && new Date(fin) < new Date(inicio)) {
      out.push(hallazgo({
        regla: 'acta.fechas-coherentes', gravedad: ERROR, campo: 'fechaFin',
        mensaje: 'La fecha de fin es anterior a la de inicio.', fuente: PMBOK_ACTA,
      }))
    }
    return out
  },
}

export const reglasActa = [elementosPresentes, visionUnaOracion, medidasDeExito, fechasCoherentes]
