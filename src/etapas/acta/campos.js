/**
 * El acta, en pantallas de dos naturalezas distintas.
 *
 * Un campo por pantalla volvia el acta trece reactivos de examen. Agruparlos
 * parejo no lo arregla: cinco pantallas iguales siguen siendo cinco deberes
 * contados. Lo que rompe esa percepcion es la ASIMETRIA.
 *
 *   escena -> un campo de prosa, pregunta grande, los hechos del cuento al
 *             lado. Es donde se piensa.
 *   ficha  -> varios campos estructurados juntos, compactos. Es donde se
 *             llenan datos. Dedicarle una pantalla entera con pregunta
 *             existencial a un selector de fecha es, sin querer, comico.
 *
 * El titular de cada escena es la pregunta; el nombre formal del elemento va
 * abajo junto a la cita, como chip. Esa inversion importa: "VISION" arriba en
 * versalitas con una pregunta debajo es, letra por letra, la gramatica visual
 * de un reactivo de examen.
 */
import { NUEVE_ELEMENTOS } from '../../motor/reglas/acta.js'

const E = Object.fromEntries(NUEVE_ELEMENTOS.map((e) => [e.campo, e]))
const nombre = (c) => E[c]?.nombre ?? c

// Hechos del caso, repartidos por campo. El estudiante deja de generar desde
// cero y pasa a seleccionar, priorizar y redactar, que es la competencia que
// la materia quiere enseñar. Algunos hechos son ruido a proposito: distinguir
// lo que importa es parte del ejercicio.
const HECHOS = {
  vision: ['El burro ya no puede con los costales y su amo piensa deshacerse de él.',
           'Oyó que en Bremen la ciudad contrata músicos.',
           'Sabe rebuznar, y dicen que no suena mal.'],
  objetivos: ['Bremen está a unos doce días a pie.',
              'No tiene instrumentos.',
              'Por el camino se le pueden sumar otros.'],
  medidas: ['A la banda de la ciudad entran por audición.',
            'El burro tiene catorce años.',
            'El invierno llega en tres meses.'],
  alcance: ['Lo que quiere es tocar en Bremen, no arreglar el molino.',
            'El camino cruza un bosque.',
            'Nadie le pidió que construyera nada.'],
  entregables: ['La ciudad quiere oír al grupo tocar.',
                'Un grupo necesita más de un músico.',
                'El molino tiene goteras.'],
  riesgos: ['El bosque tiene lobos.',
            'En Bremen puede que ya no busquen músicos.',
            'El amo podría salir a buscarlo.'],
}

const prosa = (campo, pregunta, ayuda, ejemplo, tipo = 'largo') => ({
  clase: 'escena',
  id: campo,
  campo,
  etiqueta: nombre(campo),
  pregunta,
  ayuda,
  ejemplo,
  tipo,
  hechos: HECHOS[campo] ?? [],
  campos: null,
})

export const PASOS = [
  prosa('vision', '¿A qué va el burro?',
    'Una sola oración basta.',
    'Llegar a Bremen y tocar como músico de la ciudad…', 'corto'),

  prosa('objetivos', '¿Qué tiene que lograr para conseguirlo?',
    'De tres a cinco, cada uno concreto.',
    'Reunir un grupo. Recorrer el camino. Pasar la audición de la ciudad.'),

  prosa('medidas', '¿Cómo va a saber que lo logró?',
    'Al menos dos, y cada una con una cifra.',
    'Los cuatro integrantes reunidos'),

  // El alcance pregunta por lo que queda FUERA a proposito: en la etapa 4
  // aparece una casa que el estudiante nunca puso ni dentro ni fuera, y ahi
  // es donde esta frase suya se le cita de vuelta.
  prosa('alcance', '¿Qué NO es parte de esto?',
    'Lo que dejas fuera importa tanto como lo que metes.',
    'No incluye arreglar el molino ni quedarse a vivir en el camino.'),

  prosa('entregables', '¿Qué va a entregar?',
    'Productos concretos, en sustantivo. No actividades.',
    'Grupo reunido. Ruta recorrida. Audición presentada.'),

  prosa('riesgos', '¿Qué puede salir mal?',
    'Lo que puede descarrilar esto, y lo que estás dando por hecho.',
    'Lobos en el bosque. Que en Bremen ya no busquen músicos.'),

  {
    clase: 'ficha',
    id: 'ficha',
    titulo: 'La ficha del proyecto',
    entrada: 'Lo de arriba era pensar. Esto es llenar datos, y se llena rápido.',
    campos: [
      { campo: 'interesados', etiqueta: nombre('interesados'), tipo: 'largo',
        ayuda: 'En esta etapa el burro va solo. Eso también es una respuesta.' },
      { campo: 'roles', etiqueta: nombre('roles'), tipo: 'largo',
        ayuda: 'Quién hace qué. Hoy, todo lo hace uno.' },
      { campo: 'hitos', etiqueta: nombre('hitos'), tipo: 'largo',
        ayuda: 'Los puntos donde conviene parar a revisar.' },
      { campo: 'enfoque', etiqueta: nombre('enfoque'), tipo: 'largo',
        ayuda: 'Ya viene escrito. Léelo y cámbialo solo si no estás de acuerdo.',
        // Presembrado a proposito. Si el estudiante pudiera elegir "adaptativo"
        // aqui, el giro de la etapa 4 —que el supuesto predictivo se rompe—
        // quedaria incoherente. Esta frase es la que le estalla despues.
        semilla: 'El objetivo está claro y no va a cambiar, así que se planifica el camino '
               + 'completo desde el principio y se sigue el plan.' },
      { campo: 'fechaInicio', etiqueta: 'Fecha de inicio', tipo: 'fecha', ayuda: '' },
      { campo: 'fechaFin', etiqueta: 'Fecha de fin', tipo: 'fecha', ayuda: '' },
    ],
  },
]

export const REVISION = PASOS.length
export const TOTAL = PASOS.length + 1

export const CAMPOS = PASOS.flatMap((p) => p.campos ?? [p])
export const POR_CAMPO = Object.fromEntries(CAMPOS.map((c) => [c.campo, c]))

/** Semillas que se escriben solas la primera vez que se abre el acta. */
export const SEMILLAS = Object.fromEntries(
  CAMPOS.filter((c) => c.semilla).map((c) => [c.campo, c.semilla]),
)

/** En qué paso vive un campo. Lo usa «Arreglar esto» del veredicto. */
export function pasoDe(campo) {
  return PASOS.findIndex((p) => (p.campos ?? [p]).some((c) => c.campo === campo))
}
