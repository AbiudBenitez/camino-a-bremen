/**
 * Reglas de la casa de los ladrones: el product backlog de esa noche.
 *
 * El plan del molino ya no sirve, y el burro, como Product Owner, dice qué
 * importa. El estudiante elige historias, descarta las que no aportan y las
 * apila por valor: la pila es la pirámide de la banda frente a la ventana.
 *
 * Lo que dice la Guía de Scrum (el backlog es una lista ordenada y el Product
 * Owner la ordena) se cita a la Guía. Lo que no dice —la forma «como / quiero /
 * para» y que una historia sea verificable— se cita a Cohn como práctica
 * complementaria: atribuírselo a la Guía sería una cita prestada.
 */
import { donde, normalizar } from '../../arrastre/colocacion.js'
import { ERROR, fuente, hallazgo } from '../contrato.js'

const BACKLOG = fuente('Guía de Scrum', 'Product Backlog: una lista emergente y ordenada')
const PO = fuente('Guía de Scrum', 'Product Owner: maximizar el valor del producto')
const VERIFICABLE = fuente('Práctica complementaria', 'Cohn, User Stories Applied (2004), cap. 2: historias verificables')
const ROL = fuente('Práctica complementaria', 'Cohn, User Stories Applied (2004), cap. 3: el rol de usuario')
const FORMA = fuente('Práctica complementaria', 'Cohn, User Stories Applied (2004), cap. 1: como, quiero, para')

export const PILA = 'pila'
export const CUPO_PILA = 4

/** Lo que dice el burro. El orden de valor sale de aquí, no de una clave escondida. */
export const LO_QUE_IMPORTA = [
  'Mientras haya ladrones adentro, nada más importa.',
  'Luego, llevamos días sin comer.',
  'Ya con la panza llena, cada quien busca dónde dormir.',
  'Y alguien tiene que estar atento por si vuelven.',
]

// `valor`: la posición que le toca en la pila (1 arriba). null: no va en el backlog.
export const HISTORIAS = [
  { id: 'logotipo', texto: 'Como banda, quiero un logotipo para el grupo, para que nos reconozcan.', valor: null,
    fuente: PO, nota: 'Puede servir algún día, pero esta noche no aporta nada. El Product Owner ordena por el valor de ahora.' },
  { id: 'comer', texto: 'Como banda, quiero comer lo que dejaron en la mesa, para recuperar fuerzas.', valor: 2, fuente: BACKLOG },
  { id: 'ladron', texto: 'Como ladrón, quiero recuperar mi botín, para no perder lo robado.', valor: null,
    fuente: ROL, nota: 'El rol es de alguien a quien el producto no sirve: una historia se escribe para quien recibe el valor.' },
  { id: 'vigilar', texto: 'Como banda, quiero que alguien vigile por si vuelven, para no perder la casa.', valor: 4, fuente: BACKLOG },
  { id: 'espantar', texto: 'Como banda, quiero espantar a los ladrones, para poder entrar a la casa.', valor: 1, fuente: BACKLOG },
  { id: 'bremen', texto: 'Llegar a Bremen y entrar como músico de la ciudad.', valor: null,
    fuente: FORMA, nota: 'Es el objetivo del plan viejo, y ni siquiera es una historia: no dice quién la quiere ni para qué.' },
  { id: 'dormir', texto: 'Como banda, quiero que cada quien tenga dónde dormir, para descansar a salvo.', valor: 3, fuente: BACKLOG },
  { id: 'bien', texto: 'Como banda, quiero que todo salga bien, para estar contentos.', valor: null,
    fuente: VERIFICABLE, nota: '¿Cómo se sabría que ya se cumplió? Una historia que no se puede verificar no se puede terminar.' },
]

const POR_ID = Object.fromEntries(HISTORIAS.map((h) => [h.id, h]))
export const historia = (id) => POR_ID[id] ?? null
const VALIOSAS = HISTORIAS.filter((h) => h.valor !== null)

const pilaDe = (casa) => normalizar(casa?.colocaciones)[PILA] ?? []

/** Regla 1: en la pila solo va lo que aporta valor esta noche. */
const soloValor = {
  id: 'casa.solo-valor',
  descripcion: 'La pila solo tiene historias que aportan valor esta noche.',
  fuente: PO,
  evaluar(casa) {
    return HISTORIAS.filter((h) => h.valor === null && donde(casa?.colocaciones, h.id) === PILA)
      .map((h) => hallazgo({ regla: 'casa.solo-valor', gravedad: ERROR, campo: h.id, mensaje: h.nota, fuente: h.fuente }))
  },
}

/** Regla 2: no falta nada de lo que importa. Dice cuántas faltan, no cuáles. */
const completa = {
  id: 'casa.completa',
  descripcion: 'Todo lo que importa esta noche está en la pila.',
  fuente: BACKLOG,
  evaluar(casa) {
    const faltan = VALIOSAS.filter((h) => donde(casa?.colocaciones, h.id) !== PILA).length
    if (!faltan) return []
    return [hallazgo({ regla: 'casa.completa', gravedad: ERROR, campo: PILA, fuente: BACKLOG,
      mensaje: `A la pila le ${faltan === 1 ? 'falta una historia' : `faltan ${faltan} historias`} de lo que el burro dijo que importa.` })]
  },
}

/**
 * Regla 3: lo de más valor va arriba. Señala solo el primer par fuera de
 * orden: suficiente para corregir, sin regalar la pila entera.
 */
const ordenada = {
  id: 'casa.ordenada',
  descripcion: 'La pila está ordenada por valor: lo más importante arriba.',
  fuente: BACKLOG,
  evaluar(casa) {
    const valiosas = pilaDe(casa).map(historia).filter((h) => h && h.valor !== null)
    for (let i = 1; i < valiosas.length; i++) {
      if (valiosas[i].valor < valiosas[i - 1].valor) {
        return [hallazgo({ regla: 'casa.ordenada', gravedad: ERROR, campo: valiosas[i].id, fuente: PO,
          mensaje: `«${corto(valiosas[i])}» vale más esta noche que «${corto(valiosas[i - 1])}»: tiene que ir arriba de ella. Relee lo que dijo el burro.` })]
      }
    }
    return []
  },
}

/** Regla 4: la historia propia tiene sus tres partes y alguien que recibe el valor. */
const propia = {
  id: 'casa.historia-propia',
  descripcion: 'La historia que escribe el estudiante tiene rol, deseo y propósito.',
  fuente: FORMA,
  evaluar(casa) {
    const h = casa?.propia && typeof casa.propia === 'object' ? casa.propia : {}
    const faltan = ['como', 'quiero', 'para'].filter((k) => !String(h[k] ?? '').trim())
    if (faltan.length) {
      return [hallazgo({ regla: 'casa.historia-propia', gravedad: ERROR, campo: 'propia', fuente: FORMA,
        mensaje: `A tu historia le falta ${faltan.map((k) => `«${k}…»`).join(' y ')}. Sin quién, qué y para qué, no se sabe a quién sirve.` })]
    }
    if (/ladr[oó]n/i.test(String(h.como))) {
      return [hallazgo({ regla: 'casa.historia-propia', gravedad: ERROR, campo: 'propia', fuente: ROL,
        mensaje: 'Tu historia está escrita para los ladrones. Escríbela para alguien a quien el producto sirve.' })]
    }
    return []
  },
}

function corto(h) {
  const m = /quiero (.+?),/.exec(h.texto)
  return m ? m[1] : h.texto
}

export const reglasCasa = [soloValor, completa, ordenada, propia]
