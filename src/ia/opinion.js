/**
 * Cliente de la opinión opcional de la IA (historia H-09).
 *
 * Tres reglas que este archivo no puede romper:
 *  - Solo se llama si el estudiante presiona el botón. Nunca sola.
 *  - La llave de la API vive en la función en la nube, jamás aquí.
 *  - Si falla, el taller sigue y lo dice. Nada depende de esto.
 */
const ENDPOINT = import.meta.env.VITE_ENDPOINT_IA ?? ''

export const IA_DISPONIBLE = Boolean(ENDPOINT)

/**
 * @param {string} artefacto  Id del artefacto, por ejemplo 'acta'.
 * @param {string} texto      Solo el texto del artefacto. Nada de datos personales.
 * @returns {Promise<{ok: boolean, comentario?: string, motivo?: string}>}
 */
export async function pedirOpinion(artefacto, texto) {
  if (!IA_DISPONIBLE) {
    return { ok: false, motivo: 'La opinión de la IA todavía no está configurada en este despliegue.' }
  }
  try {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artefacto, texto }),
    })
    if (!r.ok) {
      return { ok: false, motivo: r.status === 429
        ? 'Se agotó la cuota de la IA por hoy. Las reglas siguen evaluando igual.'
        : 'La IA no respondió. Las reglas siguen evaluando igual.' }
    }
    const datos = await r.json()
    return { ok: true, comentario: datos.comentario }
  } catch {
    return { ok: false, motivo: 'No hay conexión con la IA. Las reglas siguen evaluando igual.' }
  }
}
