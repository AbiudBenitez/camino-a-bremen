/**
 * «Cómo se juega» de cada minijuego: pasos concretos, con los nombres que el
 * estudiante ve en pantalla. Dicen qué hacer, nunca dónde va cada cosa: si
 * regalan la respuesta, el juego pierde el ejercicio.
 *
 * Borrador: Abiud. Pendiente de la revisión de Ángel (H-25).
 */
const TOCAR = 'También puedes arrastrarla, o usar el teclado: Tab para moverte y Enter para elegir.'

export const PASOS = {
  molino: [
    `Toca una tarjeta de «Lo que sabe el burro» y después el compartimento del hatillo donde va: Objetivo, Dentro del alcance, Fuera del alcance, Riesgos o Interesados. ${TOCAR}`,
    'Si la tarjeta no va ahí, regresa a la mesa y abajo aparece por qué, con su apartado del PMBOK. Lo que no le sirve al acta se queda en la mesa.',
    'Escribe las medidas de éxito: cómo sabrá el burro que el viaje salió bien. El botón «!» de cada parte explica qué es, sin darte la respuesta.',
    'Con el hatillo lleno, presiona «Salir del molino».',
  ],
  perro: [
    `Toca a un personaje de «A quién huele el perro» y después el cuadrante de la matriz donde va. ${TOCAR}`,
    'Para cada uno piensa dos cosas: cuánto poder tiene sobre el viaje y cuánto le interesa. El poder crece hacia arriba y el interés hacia la derecha.',
    'Si no va ahí, regresa a la mesa y te dice qué eje revisar. Lo que no es un interesado se queda en la mesa.',
    'Cuando estén todos, presiona «Seguir con el perro».',
  ],
  gato: [
    `Toca una pieza de «En la mesa» y después la rama del móvil donde va: Banda reunida, Repertorio o Viaje. ${TOCAR}`,
    'Cada pieza dice sus horas. Fíjate en qué nombra y en cuánto trabajo trae: lo que no es parte de lo que se entrega se queda en la mesa.',
    'Si una pieza no va ahí, regresa y abajo aparece por qué, con su fuente.',
    'Cuando no falte ni sobre nada, presiona «Colgar el móvil».',
  ],
  gallo: [
    'Mira la red del viaje: cada caja es una actividad con su duración en días, y las flechas dicen qué tiene que terminar antes. El viaje empieza el día 0.',
    'En «Tus cálculos», ve hacia adelante por la red y escribe el inicio temprano (IT) y la finalización temprana (FT) de cada actividad.',
    'Luego ve de atrás hacia adelante: escribe el inicio tardío (IL), la finalización tardía (FL) y la holgura (H). Marca las actividades de la ruta crítica.',
    'La app no hace las cuentas: revisa las tuyas. Cada caja se pone verde cuando su renglón cuadra. Al terminar, presiona «Que cante el gallo».',
  ],
  casa: [
    'Lee lo que dice el burro, que hace de Product Owner: es lo que más importa esta noche.',
    `Toca una historia de «Lo que podría hacer la banda» y después la pila. Arriba va lo que más importa, y caben cuatro. ${TOCAR}`,
    'Escribe tu propia historia con algo que dejaste fuera en el molino: como, quiero, para.',
    'Presiona «Cantar frente a la ventana». Si el orden no convence, los ladrones no huyen: reordena y vuelve a cantar.',
  ],
  final: [
    'Elige el objetivo de la noche y lee la Definición de Terminado: así se sabrá si la noche salió bien.',
    `Toca una tarea y después al animal que la va a hacer. Cada animal aguanta despierto cierto número de horas, y su medidor se llena con lo que le toca. ${TOCAR}`,
    'Si un animal ya no aguanta más o la tarea no sirve al objetivo, la tarea regresa a la mesa y te dice por qué.',
    'Cuando cada puesto tenga a alguien, presiona «Apagar las luces y esperar». Después viene la noche y, al amanecer, la retrospectiva.',
  ],
}

/**
 * El mapa: cómo se avanza. Solo habla de lo que ya se ve; lo que sigue bajo la
 * bruma no se nombra, ni se cuenta cuántas paradas hay.
 */
export const PASOS_MAPA = [
  'Toca «Sigue» para entrar a la siguiente parada. Cada una abre con su página del cuento.',
  'El candado se quita al terminar la parada anterior. El «!» explica qué se aprende ahí.',
  'Arriba: música, la banda, tu expediente y las referencias. Tu avance se guarda en este navegador.',
]
