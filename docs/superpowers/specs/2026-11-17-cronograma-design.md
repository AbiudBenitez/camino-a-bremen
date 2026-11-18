# Cronograma en el mapa (H-26)

Pedido de la Product Owner el 13 de noviembre: ver el progreso en la pantalla principal.

## Qué es

1. **Línea de etapas**, siempre visible sobre el mapa. Las paradas en orden, cada una
   hecha, actual o cerrada, agrupadas por enfoque (PMI, Scrum). En escritorio ancho va en la
   fila de la cabecera, entre el título y los botones; en pantallas angostas, como franja
   bajo la cabecera.
2. **Gantt desplegable.** Tocar la línea abre un panel con una barra por parada recorrida:
   desde que terminó la anterior (o desde que empezó el taller) hasta que terminó esa. La
   actual es una barra abierta hasta ahora. Las cerradas no tienen barra. Pie con su fuente:
   PMBOK 6.6 Controlar el Cronograma.

## Reglas que no se rompen

- **El giro no se adelanta.** Antes de recorrer el bosque, la línea termina en «?» y ni la
  casa ni el acto final existen en el DOM, igual que en el mapa (`visibles`).
- **Lista negra.** Muestra fechas reales; no califica, no compara, no dice rápido ni lento,
  no cuenta minutos. Es la bitácora en forma de Gantt, no un temporizador.
- **Sin dependencias.** SVG y CSS propios.

## Datos

Ya existen: `estado.creado` (inicio) y `estado.recorrido[id]` (hora en que se terminó cada
parada). Lógica pura en `src/mapa/cronograma.js`; la interfaz en `LineaEtapas.jsx` y
`Gantt.jsx`. Datos viejos sin `creado` caen al primer recorrido o a ahora.

## Pruebas

- Antes del bosque no aparecen casa ni final, ni en la línea ni en el Gantt.
- Cada parada recorrida tiene barra; las cerradas no; la actual va abierta.
- Estado vacío y estado completo se pintan sin lanzar.
