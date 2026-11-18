/**
 * De dónde sale lo que dice el taller y dónde sí se certifica.
 *
 * Las referencias son las obras que el motor cita de verdad (`fuente()` en
 * src/motor/reglas). Una prueba revisa que cada obra citable tenga su entrada:
 * si una regla nueva cita algo, aquí tiene que aparecer.
 *
 * De las certificaciones solo va el nombre y el sitio oficial de cada
 * organismo. Precios y requisitos cambian y no los podemos sostener.
 *
 * Borrador: Abiud. Pendiente de la revisión de Ángel (H-25).
 */

export const REFERENCIAS = [
  {
    obra: 'PMBOK',
    cita: 'Project Management Institute (2017). Guía de los fundamentos para la dirección de proyectos (Guía del PMBOK), 6.ª edición. Newtown Square, PA: PMI.',
    usa: 'El molino, el perro, el gato y el gallo: acta de constitución, interesados, EDT y cronograma.',
  },
  {
    obra: 'Guía de Scrum',
    cita: 'Schwaber, K. y Sutherland, J. (2020). La Guía de Scrum: la guía definitiva de Scrum, las reglas del juego.',
    usa: 'La casa y el acto final: product backlog, objetivo del sprint, capacidad y retrospectiva.',
    enlace: 'https://scrumguides.org/',
    textoEnlace: 'Léela gratis en scrumguides.org',
  },
  {
    obra: 'Práctica complementaria',
    cita: 'Project Management Institute. Practice Standard for Work Breakdown Structures.',
    usa: 'El gato: la regla del 100 %.',
  },
  {
    obra: 'Práctica complementaria',
    cita: 'Heurística 8/80 para el tamaño de los paquetes de trabajo. Práctica común en dirección de proyectos, sin un autor único.',
    usa: 'El gato: cuánto trabajo cabe en una pieza.',
  },
  {
    obra: 'Práctica complementaria',
    cita: 'Mendelow, A. (1991). Stakeholder mapping.',
    usa: 'El perro: la estrategia para cada cuadrante de la matriz de poder e interés.',
  },
  {
    obra: 'Práctica complementaria',
    cita: 'Cohn, M. (2004). User Stories Applied: For Agile Software Development. Boston: Addison-Wesley.',
    usa: 'La casa: historias con la forma «como, quiero, para» y que se puedan verificar.',
  },
  {
    obra: 'Material del curso',
    cita: 'Plantilla de carta constitutiva y su guía de elaboración. Material del curso de administración de proyectos.',
    usa: 'El formato del acta de constitución.',
  },
]

export const CUENTO = {
  cita: 'Grimm, J. y Grimm, W. Los músicos de Bremen (Die Bremer Stadtmusikanten). Cuentos de la infancia y del hogar, n.º 27.',
  usa: 'La historia que hilvana el taller. Los textos son una adaptación breve del equipo.',
}

export const CERTIFICACIONES = [
  {
    organismo: 'Project Management Institute (PMI)',
    enfoque: 'Enfoque predictivo, el de las etapas del molino al gallo.',
    certificaciones: ['CAPM · Certified Associate in Project Management', 'PMP · Project Management Professional'],
    enlace: 'https://www.pmi.org/',
    sitio: 'pmi.org',
  },
  {
    organismo: 'Scrum.org',
    enfoque: 'Scrum, el de la casa y el acto final.',
    certificaciones: ['PSM · Professional Scrum Master', 'PSPO · Professional Scrum Product Owner'],
    enlace: 'https://www.scrum.org/',
    sitio: 'scrum.org',
  },
  {
    organismo: 'Scrum Alliance',
    enfoque: 'Scrum, el de la casa y el acto final.',
    certificaciones: ['CSM · Certified ScrumMaster', 'CSPO · Certified Scrum Product Owner'],
    enlace: 'https://www.scrumalliance.org/get-certified',
    sitio: 'scrumalliance.org',
  },
]
