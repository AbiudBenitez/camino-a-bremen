/**
 * Los tramos de cuento. Fieles a los Grimm y cortos: se leen en voz alta en
 * menos de medio minuto.
 *
 * ESCENAS son los destinos que solo son cuento. CUENTOS es la página de libro
 * que abre cada minijuego antes de su dinámica, cada vez que se entra.
 *
 * Ninguna página antes de la casa insinúa que el plan va a dejar de servir: el
 * giro no se adelanta.
 */
export const ESCENAS = {
  bosque: {
    titulo: 'Cae la noche',
    parrafos: [
      'Bremen está lejos y no llegan en un día. Al caer la noche entran a un bosque. El burro y el perro se echan bajo un árbol grande, el gato sube a las ramas y el gallo vuela hasta la punta.',
      'Antes de dormirse mira hacia los cuatro vientos y ve, a lo lejos, una lucecita.',
    ],
    seguir: 'Ir hacia la luz',
  },
}

export const CUENTOS = {
  molino: {
    titulo: 'El burro del molino',
    parrafos: [
      'Un molinero tenía un burro que durante muchos años cargó costales al molino sin cansarse. Ahora el burro está viejo, ya no puede con la carga, y su amo piensa deshacerse de él.',
      'El burro se da cuenta a tiempo y decide irse a Bremen a ser músico de la ciudad. Antes de salir arma su hatillo: cada cosa que sabe va en su lugar, o se queda en el molino.',
    ],
  },
  perro: {
    titulo: 'Un perro de caza',
    parrafos: [
      'En el camino, el burro encuentra a un perro de caza tirado a la orilla, jadeando como quien corrió mucho. Está viejo, ya no sirve para cazar y su amo quiso deshacerse de él.',
      '—Me voy a Bremen a ser músico —le dice el burro—. Vente conmigo: yo toco el laúd y tú los timbales.',
      'Al perro le queda el olfato. Antes de seguir, husmea el camino: a quién le importa el viaje y quién tiene poder para cambiarlo.',
    ],
  },
  gato: {
    titulo: 'Un gato con cara de tres días de lluvia',
    parrafos: [
      'Al poco rato encuentran a un gato sentado en el camino. Ya tiene los dientes gastados y prefiere ronronear junto a la estufa que cazar ratones, así que su ama quiso ahogarlo.',
      '—Vente a Bremen —le dicen—. Tú sabes de música de noche.',
      'El gato tiene un móvil colgado del tejado. Antes de irse quiere colgar en él todo lo que la banda va a entregar para llegar a Bremen: que no falte nada y que no sobre nada.',
    ],
  },
  gallo: {
    titulo: 'Un gallo en el portón',
    parrafos: [
      'Al pasar por un corral, un gallo canta en el portón con todas sus fuerzas. Mañana hay visitas y la cocinera lo quiere en la sopa: esta noche le cortan la cabeza.',
      '—Vente con nosotros —le dice el burro—. Algo mejor que la muerte encontrarás donde sea. Tienes buena voz: si cantamos juntos, algo bueno saldrá.',
      'El gallo acepta, pero antes quiere saber cuánto dura el viaje y qué parte no se puede atrasar.',
    ],
  },
  casa: {
    titulo: 'La lucecita',
    parrafos: [
      'Los cuatro caminan hacia la luz, que se hace cada vez más grande, hasta que llegan a una casa iluminada. El burro, que es el más alto, se asoma a la ventana.',
      '—¿Qué ves? —le pregunta el gallo.',
      '—Una mesa servida con buena comida y buena bebida, y unos ladrones sentados, dándose la gran vida.',
    ],
  },
  final: {
    titulo: 'Una noche en la casa',
    parrafos: [
      'Los cuatro se sientan a la mesa y comen lo que dejaron los ladrones como si les esperaran cuatro semanas de hambre. Luego apagan la luz.',
      'Desde el bosque, el jefe de los ladrones mira la casa. Si la ve a oscuras y en silencio, va a mandar a alguien a revisar. La banda tiene una noche para prepararse.',
    ],
  },
}
