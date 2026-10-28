/**
 * Geometría del mapa: un valle visto de tres cuartos, en 16:9. Al fondo las
 * montañas, en medio el valle y al frente la tierra. El camino sube desde abajo
 * y se pierde en la bruma; los destinos quedan junto a él, no encima, y se
 * achican con la distancia.
 *
 * Esta misma geometría genera la plantilla que usa quien ilustra
 * (docs/ilustracion/plantilla-mapa.svg): si un punto se mueve aquí, la
 * plantilla se regenera y el dibujo sigue cuadrando.
 */
import { DESTINOS, abierto } from '../destinos/catalogo.js'

export const LIENZO = { ancho: 1600, alto: 900 }

/** Dónde se apoya cada destino (el centro de su base) y a qué escala se dibuja. */
export const PUNTOS = {
  molino: [380, 742],
  perro: [1080, 768],
  gato: [1240, 614],
  gallo: [720, 580],
  bosque: [496, 470],
  casa: [1300, 392],
  final: [1450, 420],
}
/** Qué tan alto es cada dibujo sin escalar: ahí arriba flota la burbuja de «Sigue». */
export const ALTURA = { molino: 205, perro: 60, gato: 110, gallo: 60, bosque: 135, casa: 105, final: 85 }
export const ESCALA = { molino: 1.6, perro: 1.3, gato: 1, gallo: 0.85, bosque: 1, casa: 0.8, final: 0.7 }

/**
 * El camino, por tramos. Cada tramo lleva su ancho y el tamaño de sus losas,
 * que se achican con la distancia. `tras` es el destino que hay que recorrer
 * para que el tramo se vea andado; el primero se ve andado siempre, porque el
 * burro sale de ahí.
 */
export const CAMINO = [
  { d: 'M330 900 C380 830 440 795 520 780', ancho: 70, losa: 'g', tras: null },
  { d: 'M520 780 C640 758 840 760 930 720', ancho: 55, losa: 'm', tras: 'molino' },
  { d: 'M930 720 C1010 684 1100 640 1070 600', ancho: 40, losa: 'c', tras: 'perro' },
  { d: 'M1070 600 C1040 562 900 556 820 540', ancho: 27, losa: 'c', tras: 'gato' },
  { d: 'M820 540 C730 522 640 500 660 470', ancho: 17, losa: 'x', tras: 'gallo' },
  { d: 'M660 470 C680 440 820 420 940 404', ancho: 10, losa: 'x', tras: 'bosque' },
  { d: 'M940 404 C1050 390 1180 386 1290 394', ancho: 8, losa: 'x', tras: 'bosque' },
  { d: 'M1300 396 C1350 404 1400 412 1440 418', ancho: 7, losa: 'x', tras: 'casa' },
]

/** Veredas cortas del camino a cada destino. */
export const VEREDAS = {
  molino: { d: 'M488 772 C460 762 432 752 410 744', ancho: 16, losa: 'm' },
  perro: { d: 'M960 712 C1000 735 1040 752 1070 764', ancho: 13, losa: 'c' },
  gato: { d: 'M1084 612 C1130 614 1180 614 1218 614', ancho: 9, losa: 'x' },
  gallo: { d: 'M800 545 C780 556 760 568 742 576', ancho: 7, losa: 'x' },
  bosque: { d: 'M654 470 C620 470 590 471 560 472', ancho: 6, losa: 'x' },
}

/** Lo que tapa la bruma hasta que la casa se abre: el giro no se adelanta. */
export const BAJO_LA_BRUMA = new Set(['casa', 'final'])

export function visibles(estado) {
  const despejado = abierto(estado, 'casa')
  return DESTINOS.filter((d) => despejado || !BAJO_LA_BRUMA.has(d.id))
}
