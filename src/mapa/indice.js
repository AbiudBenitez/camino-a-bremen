import { Bosque, Burro, Casa, Caseta, Corral, Final, Gallo, Gato, Molino, Perro, Tejado } from './dibujos.jsx'
import { BosqueMapa, CasaGatoMapa, CasaLadronesMapa, CasetaMapa, FinalMapa, GallineroMapa, MolinoMapa } from './destinosMapa.jsx'

/** Qué dibujo va en cada destino y en cada lugar de la banda. */
export const DIBUJO = { molino: Molino, perro: Caseta, gato: Tejado, gallo: Corral, bosque: Bosque, casa: Casa, final: Final }
export const ANIMAL = { burro: Burro, perro: Perro, gato: Gato, gallo: Gallo }

/** Los destinos tal como se ven en el mapa, más detallados que en las escenas. */
export const DESTINO_MAPA = {
  molino: MolinoMapa, perro: CasetaMapa, gato: CasaGatoMapa, gallo: GallineroMapa,
  bosque: BosqueMapa, casa: CasaLadronesMapa, final: FinalMapa,
}
