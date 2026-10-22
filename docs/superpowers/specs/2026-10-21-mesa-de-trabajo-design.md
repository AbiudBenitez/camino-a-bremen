# La mesa de trabajo

Diseño de la reestructura de interfaz de «Camino a Bremen».
21 de octubre de 2026 · Equipo 2 · India

## 1. El problema

El cliente pidió un producto **divertido e interactivo**. El dueño del producto lo revisó y
dijo: *«el diseño me parece más el de una página que el de un programa divertido; está hecho
para mostrar información, no para entretener con esa información»*.

El síntoma es verificable: el producto se lee de arriba abajo con scroll, el estado se narra en
frases («Todavía no construida», «1 de 12 líneas escritas»), y el único verbo disponible es
rellenar y avanzar. Es la gramática de un artículo de documentación con formularios incrustados.

El mecanismo son dos ausencias concretas:

1. **Lo que el estudiante construye nunca aparece como esa cosa.** Está escribiendo un acta de
   constitución y no ve un acta: ve un campo de una línea que le corta su propio texto a media
   palabra y una tabla de once guiones. El placer de construir requiere ver lo construido.
2. **Nada responde.** Escribe una visión y el mundo no cambia: una fila pasa de `—` a texto
   truncado. Un programa es estado → acción → consecuencia visible → estado nuevo. El ciclo se
   corta en el tercer paso.

El reencuadre que ordena todo lo demás: **el documento no debe ser el medio, debe ser el
premio**. El espacio donde se decide y se escribe tiene que ser un programa; el expediente que
el estudiante exporta y entrega debe ser gramática de documento llevada al extremo. Hoy todo es
papel desde el principio, y entonces el papel no se siente como recompensa.

**El problema no es que haya documento: es que no hay taller.**

## 2. El criterio de credibilidad

El producto lo califica una profesora de ingeniería y enseña PMI y Scrum. Si se vuelve
caricatura, se pierde el encargo. Todo elemento nuevo pasa estas tres pruebas antes de entrar:

1. **Vocabulario.** ¿Se puede explicar con palabras del PMBOK o de la Guía de Scrum? Nodos
   bloqueados sí: son puertas de fase. Inventario de hechos sí: registro de supuestos. Monedas y
   estrellas no se pueden explicar: fuera.
2. **Captura proyectada.** ¿Sobrevive proyectado en clase sin que alguien sonría con sorna? El
   confeti no. Un sello de «línea base aprobada» sí.
3. **Supresión de la fábula.** Si se quita a Bremen, ¿sigue teniendo sentido en una herramienta
   real de proyectos? Si sí, es estructura y es seguro. Si solo funciona con el cuento, es
   decoración y hay que racionarla.

Regla de oro: entra todo lo que haga **visible el estado y la consecuencia de una decisión
profesional**. Se pierde todo en cuanto aparece **recompensa arbitraria, azar o métrica
injustificable**.

Queda prohibido en este producto: puntos, experiencia, niveles, monedas, medallas, rachas,
temporizadores que penalizan, vidas, pantallas de derrota, azar, avatares o mascotas que hablan,
confeti, tipografías de videojuego, puntuación automática de la prosa sobre 100 y tablas de
clasificación entre estudiantes.

## 3. Alcance de esta entrega

Dos cambios estructurales. Nada más.

### 3.1 Marco fijo

La aplicación deja de ser un documento con scroll y pasa a ser una cáscara que ocupa la pantalla
y no se recarga al avanzar.

```
┌──────────────────────────────────────────────────────┐
│ Camino a Bremen   ETAPA 1 · ACTA    PMI    3 de 12   │  barra de estado, fija
├────────────┬─────────────────────────┬───────────────┤
│  LA RUTA   │      EL ACTA            │  LO QUE SABES │
│            │                         │               │
│  ① activa  │  Visión                 │  · el burro   │
│  ② ▢       │  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔        │    ya no…     │
│  ③ ▢       │                         │  · oyó que…   │
│  ⋮         │  Objetivos              │               │
│            │  ·····················  │               │
├────────────┴─────────────────────────┴───────────────┤
│        ← Atrás              Siguiente: Objetivos →   │
└──────────────────────────────────────────────────────┘
```

- La cáscara mide `100dvh` y no desborda. El scroll vive **dentro** de cada panel.
- La barra de estado y la ruta sobreviven a todo cambio de tarea. Avanzar de etapa cambia el
  contenido de los paneles; el marco nunca parpadea.
- La ruta de seis nodos está siempre visible, también mientras se escribe. Deja de existir el
  botón «volver al recorrido»: no se vuelve a ningún lado.

### 3.2 Se escribe dentro del acta

Desaparece el campo de una línea. El panel central **es** el acta, con la tipografía que va a
tener al final. Las secciones vacías son renglones punteados con su encabezado, no guiones.

**La tensión que esto crea.** Si se ve el acta entera volvemos al formulario largo que ya se
descartó por aburrido, y si se ve de uno en uno volvemos al asistente que se sintió a examen.

**La resolución.** El acta se ve completa pero **solo una sección está activa**: resaltada,
enfocada, con su pregunta y sus hechos al lado; el resto visible pero atenuado y en modo lectura.
«Siguiente» mueve la sección activa hacia abajo por la hoja. Se conserva la guía de uno en uno y
se ve lo construido.

## 4. Arquitectura

### 4.1 Componentes nuevos

| Archivo | Responsabilidad |
| --- | --- |
| `src/armazon/Armazon.jsx` | La cáscara: rejilla de regiones, pestañas en teléfono, banner de almacenamiento |
| `src/armazon/BarraEstado.jsx` | Proyecto, etapa, método activo y avance. Solo lee |
| `src/armazon/Ruta.jsx` | Los seis nodos con su estado. Sustituye la lista de tarjetas del inicio |
| `src/etapas/acta/Hoja.jsx` | El acta como documento. Decide qué sección está activa |
| `src/etapas/acta/Seccion.jsx` | Una sección: encabezado y, según esté activa, editor o texto |

### 4.2 Componentes que se eliminan

| Archivo | Por qué |
| --- | --- |
| `src/componentes/Progreso.jsx` | El avance queda representado dos veces en dos idiomas. La hoja llenándose ya lo dice |
| `src/etapas/acta/Revision.jsx` | La hoja está siempre a la vista; revisar deja de ser un paso |
| `Ruptura` dentro de `App.jsx` | Regala el giro de la etapa 4 en la portada, antes de que el estudiante juegue nada |

### 4.3 Componentes que cambian

- **`App.jsx`** queda reducido a montar `Armazon` y decidir qué modo se muestra.
- **`FormularioActa.jsx`** deja de dibujar pasos y pasa a ser el modo del acta: sostiene cuál es
  la sección activa y coloca `Hoja` y el panel de hechos.
- **`Campo.jsx`** se conserva para los campos estructurados que viven dentro de una sección
  (fechas y listas). Su variante `grande` se absorbe en el editor de `Seccion`.

### 4.4 Lo que no se toca

El motor de reglas y su contrato, el catálogo de voces, el expediente en `localStorage` con sus
migraciones, el reducer, los 320 ms de espera antes del veredicto, los hallazgos de tres en
tres, «Arreglar esto →», el sello de acta aprobada y el aliento del burro. Las 41 pruebas
existentes deben seguir pasando sin modificarse.

## 5. Estado y flujo de datos

No se agrega estado persistido. La sección activa es estado de interfaz y vive en
`FormularioActa`, no en el expediente: si el estudiante recarga, vuelve a la primera sección sin
nada escrito, o a la primera sección vacía si ya había escrito algo.

```
useTaller  ──estado──▶  Armazon  ──▶  BarraEstado   (lee)
                           │
                           ├──▶  Ruta               (lee + despacha navegación de etapa)
                           │
                           └──▶  FormularioActa
                                     │ seccionActiva (estado local)
                                     ├──▶ Hoja ──▶ Seccion ──▶ Campo
                                     │         despacha  { tipo: 'escribir', … }
                                     └──▶ Hechos
```

El motor se invoca en tres momentos, igual que hoy: nunca al teclear; los avisos del campo al
intentar avanzar; el veredicto completo solo cuando el estudiante lo pide.

## 6. Comportamiento

- **Sección activa.** Siempre hay exactamente una. Al entrar al acta es la primera sección sin
  escribir; si todas están escritas, es la última.
- **Avanzar.** «Siguiente» mueve la sección activa a la siguiente. Si la sección produce avisos,
  se muestran y el paso se queda; volver a pulsar avanza y el botón dice «Seguir de todos modos».
  Este comportamiento ya existe y se conserva.
- **Saltar.** Tocar cualquier sección de la hoja la vuelve activa. El orden es sugerido, no
  obligatorio.
- **Teclado.** `Enter` avanza desde un campo de una línea. `Ctrl`/`Cmd`+`Enter` avanza desde un
  editor multilínea, donde `Enter` sigue siendo renglón nuevo. `Esc` desenfoca sin cambiar de
  sección. Debe poderse completar el acta entera sin ratón.
- **Foco.** Al cambiar la sección activa, el foco entra al editor. Sin esto, quien navega con
  teclado o lector de pantalla se queda atrás.
- **Movimiento.** Transiciones de 120 a 200 ms, solo `transform` y `opacity`. Todo respeta
  `prefers-reduced-motion` desde el primer día.

## 7. Teléfono

Tres pestañas inferiores: **Ruta · Acta · Hechos**, con Acta por defecto. Esa barra inferior es
de las señales más fuertes de «programa» que existen en móvil, y resuelve el reparto de las tres
regiones sin inventar nada.

Restricciones que ya nos mordieron y que no se pueden repetir:

- `100dvh`, nunca `100vh`: con el teclado abierto, `vh` recorta el layout.
- Ningún elemento fijo al borde inferior en la pantalla de escritura: el teclado lo tapa. La
  barra de acciones se queda al final del panel del acta, que es el que scrollea.
- Campos a `font-size: max(16px, 1rem)`: por debajo, iOS hace zoom en cada enfoque.
- Áreas de toque de 44 px como mínimo.

## 8. Errores y casos borde

| Caso | Comportamiento |
| --- | --- |
| El navegador no deja guardar | Banner visible dentro de la cáscara, sobre la barra de estado. El taller sigue funcionando y lo dice |
| Un expediente guardado trae un campo con otra forma | Se normaliza al leerlo. Ni el sensor, ni la regla, ni el editor pueden lanzar por esto |
| Un error de render | La red de seguridad ya existente muestra qué pasó y recuerda que el avance sigue guardado |
| Ventana más baja que el contenido | Cada panel scrollea por dentro; la cáscara nunca desborda |
| Pantalla muy angosta | Pestañas inferiores por debajo de 52 rem |

## 9. Pruebas

- Las 41 existentes siguen pasando sin modificarse. Si alguna hay que tocar, es señal de que se
  rompió un contrato que esta entrega no debía tocar.
- `Hoja` y `Seccion` se pintan con `renderToStaticMarkup` para los doce campos del acta, con
  valores del tipo correcto, del tipo equivocado, vacíos y nulos. Es la clase de fallo que ya
  tumbó la pantalla una vez.
- Exactamente una sección activa en todo momento.
- La sección activa inicial es la primera vacía.
- Avanzar desde la última sección no se sale del rango.
- `Armazon` se pinta sin lanzar con un expediente vacío y con uno lleno.

## 10. Presupuesto y riesgos

**Costo estimado: 40 a 50 horas.** Se aplica a la etapa 1, y las etapas 2 a 6 nacen ya dentro
del marco, así que no hay retrabajo. Quedan unas 80 horas de margen sobre el backlog
comprometido de las etapas 2 a 5 y la IA.

**El bundle no debe crecer de forma significativa.** Hoy son ~77 KB comprimidos. Esto es
reorganización de layout, estado y CSS: cero librerías nuevas. Si en algún momento entran
grabados, el presupuesto es de +15 KB en total y cada imagen adicional hay que justificarla.

| Riesgo | Probabilidad × impacto | Mitigación |
| --- | --- | --- |
| El reparto en tres regiones no resuelve bien en teléfono | Alta × Alto | El teléfono se diseña en los primeros días, no al final |
| Se pierde legibilidad del texto de ayuda al comprimir el layout | Alta × Medio | Recortar prosa con disciplina. Es el intercambio que se está comprando a propósito |
| La hoja completa a la vista devuelve la sensación de formulario largo | Media × Alto | Una sola sección activa, el resto atenuado y en lectura. Comprobarlo con un compañero ajeno al equipo antes de darlo por bueno |
| La reestructura se come el margen y deja sin construir etapas | Media × Alto | Alcance congelado en los dos cambios de esta sección. Cualquier otra cosa va a la 1.1 |

## 11. Fuera de alcance: candidatos a la versión 1.1

Quedan documentados aquí porque se decidieron y se descartaron por presupuesto, no por malos:

- **Fichas de hechos manipulables.** Tocar una la inserta, la marca como usada o la descarta por
  irrelevante. Convierte lectura pasiva en operación, e introduce verbos más allá de escribir.
- **Validación viva mientras se escribe**: número de oraciones, presencia de verbo de resultado,
  criterios medibles. Parece juego y es rúbrica.
- **Deshacer con historial**: «versión 1 (predictiva)» contra «versión 2 (adaptativa)», lado a
  lado al final. Es control de cambios, de lo más defendible académicamente y de lo que más
  sensación de programa produce.
- **Cambio irreversible de paleta y vocabulario al pasar a Scrum**: de «plan» a «backlog», de
  «aprobar» a «refinar». El contenido del taller expresado como mecánica.
- **Grabados de Grimm a una tinta**, como marca de agua en la hoja. Nunca como personaje que
  habla.
- **El gesto grande: la etapa 4 sobre el texto del propio estudiante.** Cuando irrumpe la casa de
  los ladrones, el taller trae de vuelta la frase de alcance que el estudiante escribió en la
  etapa 1, se la muestra rompiéndose contra el hecho nuevo y lo obliga a replanificar sobre sus
  propias palabras. Es el corazón del argumento del taller y lo único que cierra el ciclo acción
  → consecuencia. Justifica por sí solo que el producto exista.
- **El expediente exportado en gramática de documento plena**: serif, márgenes, numeración,
  firma. Aquí el documento vuelve, pero como premio.

## 12. Decisiones registradas

- **21 oct** · Se construye la mesa de trabajo mínima (marco fijo y escritura dentro de la hoja).
  La reestructura completa, de 120 a 190 horas, no cabe junto con las etapas 2 a 6 y queda como
  candidata a la 1.1.
- **21 oct** · Se retira la banda de ruptura de la pantalla de inicio. Explicaba la tesis del
  producto a costa de regalar el giro de la etapa 4.
- **21 oct** · El avance deja de tener indicador propio. La hoja llenándose es el indicador.
- **Nada de esto se construye antes del 23 de octubre.** Los dos días que quedan son para cerrar
  el sprint 1.
