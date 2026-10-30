/**
 * Los tramos de cuento. Fieles a los Grimm y cortos: se leen en voz alta en
 * menos de medio minuto. En el sprint 2 el perro, el gallo y el bosque son
 * solo esto; sus minijuegos llegan en el sprint 3.
 */
export const ESCENAS = {
  perro: {
    titulo: 'Un perro de caza',
    parrafos: [
      'En el camino, el burro encuentra a un perro de caza tirado a la orilla, jadeando como quien corrió mucho. Está viejo, ya no sirve para cazar y su amo quiso deshacerse de él.',
      '—Me voy a Bremen a ser músico —le dice el burro—. Vente conmigo: yo toco el laúd y tú los timbales.',
    ],
    seguir: 'Seguir con el perro',
  },
  gato: {
    titulo: 'Un gato con cara de tres días de lluvia',
    parrafos: [
      'Al poco rato encuentran a un gato sentado en el camino. Ya tiene los dientes gastados y prefiere ronronear junto a la estufa que cazar ratones, así que su ama quiso ahogarlo.',
      '—Vente a Bremen —le dicen—. Tú sabes de música de noche.',
    ],
    seguir: 'Seguir con el gato',
  },
  gallo: {
    titulo: 'Un gallo en el portón',
    parrafos: [
      'Al pasar por un corral, un gallo canta en el portón con todas sus fuerzas. Mañana hay visitas y la cocinera lo quiere en la sopa: esta noche le cortan la cabeza.',
      '—Vente con nosotros —le dice el burro—. Algo mejor que la muerte encontrarás donde sea. Tienes buena voz: si cantamos juntos, algo bueno saldrá.',
    ],
    seguir: 'Seguir con el gallo',
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
