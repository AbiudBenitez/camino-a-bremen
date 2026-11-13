/**
 * Los tramos de cuento. Fieles a los Grimm y cortos: se leen en voz alta en
 * menos de medio minuto. Los destinos que todavía no tienen minijuego son solo
 * esto.
 */
export const ESCENAS = {
  gato: {
    titulo: 'Un gato con cara de tres días de lluvia',
    parrafos: [
      'Al poco rato encuentran a un gato sentado en el camino. Ya tiene los dientes gastados y prefiere ronronear junto a la estufa que cazar ratones, así que su ama quiso ahogarlo.',
      '—Vente a Bremen —le dicen—. Tú sabes de música de noche.',
    ],
    seguir: 'Seguir con el gato',
  },
  bosque: {
    titulo: 'Cae la noche',
    parrafos: [
      'Bremen está lejos y no llegan en un día. Al caer la noche entran a un bosque. El burro y el perro se echan bajo un árbol grande, el gato sube a las ramas y el gallo vuela hasta la punta.',
      'Antes de dormirse mira hacia los cuatro vientos y ve, a lo lejos, una lucecita.',
    ],
    seguir: 'Ir hacia la luz',
  },
}
