/** Las seis etapas del taller. El cuento marca dónde el proyecto deja de ser predictivo. */
export const ETAPAS = [
  { n: 1, cuento: 'El burro escapa de la granja', enfoque: 'PMI · Inicio', artefacto: 'Acta de constitución', id: 'acta', historia: 'H-03' },
  { n: 2, cuento: 'Se suman el perro, el gato y el gallo', enfoque: 'PMI · Planificación', artefacto: 'Estructura de desglose del trabajo', id: 'edt', historia: 'H-04' },
  { n: 3, cuento: 'El camino a Bremen', enfoque: 'PMI · Cronograma', artefacto: 'Red de precedencias y ruta crítica', id: 'ruta', historia: 'H-06' },
  { n: 4, cuento: 'Aparece la casa de los ladrones', enfoque: 'Scrum · Backlog', artefacto: 'Product backlog con historias', id: 'backlog', historia: 'H-08' },
  { n: 5, cuento: 'El asalto a la ventana', enfoque: 'Scrum · Sprint', artefacto: 'Sprint backlog y retrospectiva', id: 'sprint', historia: 'H-11' },
  { n: 6, cuento: 'La casa es suya', enfoque: 'Comparación', artefacto: 'Reflexión escrita', id: 'reflexion', historia: 'H-12' },
]

/** Dónde el objetivo cambia y el plan deja de servir. */
export const EL_GIRO = 4
