# Contexto de Scrum del proyecto

> **Documento derivado. No se edita a mano.** Lo genera `gen_contexto.py` desde
> `datos.py`, en el proyecto de planeación `admonpy/scrum-taller-bremen`. Si un dato
> de aquí está mal, se corrige allá y se vuelve a correr `./regenerar.sh`.

Este archivo existe para que quien abra el repositorio de código —o Claude— sepa en qué
sprint está, qué se comprometió, quién responde por cada tarea y cuántas horas quedan,
sin tener que abrir el proyecto de planeación.

## El encargo

| Elemento | Definición |
|---|---|
| Cliente | Casa editorial |
| Requerimiento | Producto tecnológico actualizado, divertido y práctico para certificar con nuevas tecnologías de administración de proyectos, con uso de IA en beneficio del usuario |
| Precisión de la docente | Debe abarcar las metodologías del **PMI y de Scrum, ambas** |
| Caso de estudio | *Los músicos de Bremen*, hermanos Grimm (dominio público) |
| Usuario | Estudiantes universitarios de administración de proyectos |
| Product Owner | La docente de la materia. No es parte del equipo de desarrollo. |
| Equipo | Equipo 2 · India, 6 integrantes |

### Integrantes

El nombre corto es el que va en la columna «Responsable», en las notas del tablero y en
los mensajes de commit cuando hace falta nombrar a alguien.

| Nombre corto | Nombre completo | Rol |
|---|---|---|
| Abiud | Abiud Misael Benítez Franco | Scrum Master y desarrollo |
| Bernardo | Bernardo Gutiérrez López | Desarrollo |
| Edgar | Edgar Adrián García Santoy | Desarrollo |
| Ángel | Ángel Alberto Oyervides Reyna | Desarrollo |
| Roberto | Roberto Cruz Martínez | Desarrollo |
| Ismael | Ismael Ortiz Caro | Desarrollo |

### Roles

| Rol | Personas | Qué hace |
|---|---|---|
| Product Owner | 1 | La docente de la materia, que representa a la editorial. Ordena el backlog y acepta o rechaza cada historia en la revisión. No forma parte del equipo de desarrollo. |
| Scrum Master | 1 | Abiud Misael Benítez. Facilita las ceremonias, cuida el tope de la daily, retira impedimentos y resguarda tablero, gráficas y minutas. También programa. |
| Equipo de desarrollo | 5 | Construye el incremento y se organiza solo. Con el Scrum Master, el equipo suma seis integrantes. |

## Las seis etapas

La primera mitad es predictiva y la segunda adaptativa, porque el cuento tiene una
ruptura a la mitad: aparece la casa de los ladrones, nadie la previó, y el objetivo
cambia. Esa ruptura es la razón de ser del producto, no un adorno.

| # | En el cuento | Enfoque | Artefacto que produce |
|---|---|---|---|
| 1 | El burro escapa de la granja | PMI · Inicio | Acta de constitución |
| 2 | Se suman el perro, el gato y el gallo | PMI · Planificación | Estructura de desglose del trabajo |
| 3 | El camino a Bremen | PMI · Cronograma | Red de precedencias y ruta crítica |
| 4 | Aparece la casa de los ladrones | Scrum · Backlog | Product backlog con historias |
| 5 | El asalto a la ventana | Scrum · Sprint | Sprint backlog y retrospectiva |
| 6 | La casa es suya | Comparación | Reflexión escrita |

### Qué revisa cada etapa

**Etapa 1 · Acta de constitución**

- Regla: Presencia de los nueve elementos del documento al patrocinador.
- Regla: Que el objetivo esté redactado en una sola oración.
- Regla: Que haya al menos dos medidas de éxito y que sean medibles.
- Regla: Que las fechas de inicio y fin estén presentes y sean coherentes entre sí.
- Opinión de la IA: Si el objetivo describe un resultado o solo una actividad, y si las medidas de éxito son verificables o son buenos deseos.

**Etapa 2 · Estructura de desglose del trabajo**

- Regla: Regla del 100 %: ningún paquete queda huérfano y nada sobra.
- Regla: Que los elementos estén redactados como entregables, es decir sustantivos, y no como fases.
- Regla: Regla 8/80: ningún paquete de trabajo fuera del rango.
- Regla: Que exista al menos un nivel de descomposición bajo cada entregable principal.
- Opinión de la IA: Si la descomposición sigue una lógica de producto o se deslizó hacia una lista de tareas.

**Etapa 3 · Red de precedencias y ruta crítica**

- Regla: Paso hacia adelante: que cada inicio adelantado sea el mayor término adelantado anterior.
- Regla: Paso hacia atrás: que cada término tardío sea el menor inicio tardío siguiente.
- Regla: Que las holguras estén bien calculadas.
- Regla: Que la ruta crítica marcada sea realmente la más larga de la red.
- Opinión de la IA: Qué actividad convendría comprimir primero y por qué, si el estudiante lo pregunta.

**Etapa 4 · Product backlog con historias**

- Regla: Que cada historia use la forma de necesidad: como alguien, quiero algo, para un fin.
- Regla: Que toda historia tenga al menos dos criterios de aceptación.
- Regla: Que las estimaciones usen una escala coherente.
- Regla: Que el backlog esté ordenado y no sea una lista plana.
- Opinión de la IA: Si los criterios de aceptación son verificables o solo repiten la historia con otras palabras.

**Etapa 5 · Sprint backlog y retrospectiva**

- Regla: Que exista un Objetivo del Sprint y sea uno solo.
- Regla: Que la Definición de Terminado esté declarada y sea verificable.
- Regla: Que lo comprometido quepa en la capacidad declarada.
- Regla: Que la retrospectiva termine en un compromiso concreto, no en una queja.
- Opinión de la IA: Si el Objetivo del Sprint es un propósito o es un listado de tareas disfrazado.

**Etapa 6 · Reflexión escrita**

- Regla: Que la respuesta mencione ambos enfoques.
- Regla: Extensión mínima para que haya argumento.
- Opinión de la IA: Comenta el argumento del estudiante. No hay respuesta única: se evalúa el razonamiento, no la coincidencia con una clave.

## Sprints y entregas

Las fechas de presentación las fijó la docente.

| Entrega | Presenta | Sprint | Historias | Horas |
|---|---|---|---|---|
| 0.1 | 23 de octubre | 1 | H-01, H-03, H-05 | 58 h |
| 0.2 | 13 de noviembre | 2 | H-04, H-06, H-07, H-08, H-09 | 150 h |
| 1.0 | 20 de noviembre | 3 | H-11 | 36 h |
| 1.1 | sin fecha comprometida | — | H-10, H-12, H-13, H-14, H-15 | 86 h |

| Sprint | Ventana | Fechas | Objetivo |
|---|---|---|---|
| 1 | 14 al 22 de octubre | 2026-10-14 a 2026-10-22 | El taller está en línea y el estudiante ya recorre las dos primeras etapas de PMI con evaluación automática. |
| 2 | 24 de octubre al 12 de noviembre | 2026-10-24 a 2026-11-12 | Ruta crítica, el giro a Scrum, el product backlog y la opinión opcional de la IA. Aquí el taller ya demuestra la idea completa: los dos enfoques sobre el mismo caso. |
| 3 | 14 al 19 de noviembre | 2026-11-14 a 2026-11-19 | La etapa 5 cierra el recorrido de Scrum: planeación de sprint y retrospectiva, con sus reglas. Es la versión 1.0 que se entrega al cliente. |

El sprint 2 dura tres semanas. Se parte internamente en dos tramos con revisión propia el
**2 de noviembre**, aunque ante la clase se presente como uno solo.

`ENTREGA_DE` en `datos.py` es la fuente de verdad del reparto, no el campo de sprint de
cada historia, que es la propuesta inicial del 14 de octubre.

## Capacidad

Método de Kniberg: `velocidad estimada = días-hombre disponibles × factor de dedicación`.
Jornada ideal de 8 h. Perfil declarado: **3 h de lunes a viernes y 6 h el sábado** por
integrante, con factor de dedicación 0.70. Las interrupciones no se restan de los días: las
absorbe el factor.

| Sprint | Días | h/persona | Días-hombre | Velocidad | Horas efectivas | Plan |
|---|---|---|---|---|---|---|
| 1 | 5 L-V + 1 sáb | 21 h | 15.8 | 11.0 | 88.2 h | 58 h |
| 2 | 14 L-V + 3 sáb | 60 h | 45.0 | 31.5 | 252.0 h | 150 h |
| 3 | 3 L-V + 1 sáb | 15 h | 11.2 | 7.9 | 63.0 h | 36 h |

- Backlog completo: **330 h** (41.2 días-hombre).
- Capacidad de los tres sprints: **403.2 h**.
- Sin comprometer (versión 1.1): **86 h**.
- Holgura: **73.2 h**.

El sprint 1 cuenta desde el día de planeación (2026-10-16), no desde el inicio de la ventana,
porque el perfil se subió con el sprint ya empezado. Por eso su cifra está del lado
optimista: aplica 3 h a días que ya habían transcurrido con el perfil viejo. La capacidad
honesta del sprint 1 ronda las 71 h, y aun así el plan de 58 h cabe.

**Prohibido por el capítulo 12:** subir la capacidad en el papel o recortar la calidad. Las
tres salidas legítimas ante un desbordamiento son quitar alcance, agregar gente o subir el
factor de dedicación con trabajo real.

## Backlog

Importancia de 0 a 100, la pone el Product Owner. El umbral de aceptación sale del capítulo
12: obligatorio ≥ 60, deseable 50–59, opcional 30–49. Las historias técnicas se financian
reservando 14 % del factor de dedicación.

| Id | Nombre | Tipo | Imp. | Umbral | Entrega | Sprint | Horas |
|---|---|---|---|---|---|---|---|
| H-01 | Despliegue automático del taller | Técnica | — | Obligatorio | 0.1 | 1 | 12 h |
| H-03 | Etapa 1: acta de constitución | Usuario | 90 | Obligatorio | 0.1 | 1 | 32 h |
| H-04 | Etapa 2: estructura de desglose del trabajo | Usuario | 85 | Obligatorio | 0.2 | 2 | 30 h |
| H-05 | Avance guardado en el navegador | Usuario | 62 | Obligatorio | 0.1 | 1 | 14 h |
| H-06 | Etapa 3: ruta crítica | Usuario | 75 | Obligatorio | 0.2 | 2 | 38 h |
| H-07 | El giro: aparece la casa de los ladrones | Usuario | 80 | Obligatorio | 0.2 | 2 | 24 h |
| H-08 | Etapa 4: product backlog del asalto | Usuario | 70 | Obligatorio | 0.2 | 2 | 34 h |
| H-09 | Opinión opcional de la IA | Usuario | 65 | Obligatorio | 0.2 | 2 | 24 h |
| H-10 | Descarga de los artefactos | Usuario | 40 | Opcional | 1.1 | — | 14 h |
| H-11 | Etapa 5: sprint y retrospectiva | Usuario | 60 | Obligatorio | 1.0 | 3 | 36 h |
| H-12 | Etapa 6: comparación PMI contra Scrum | Usuario | 50 | Deseable | 1.1 | — | 20 h |
| H-13 | Constancia de término | Usuario | 55 | Deseable | 1.1 | — | 14 h |
| H-14 | Pruebas con estudiantes reales | Usuario | 45 | Opcional | 1.1 | — | 24 h |
| H-15 | Funciona en un teléfono modesto | Usuario | 30 | Opcional | 1.1 | — | 14 h |

- **Obligatorio** (60): Debe estar en la versión 1.0. Sin esto el producto no cumple el requerimiento del cliente: las dos metodologías recorridas de punta a punta, con la IA en beneficio del usuario.
- **Deseable** (50–59): Debería estar en la versión 1.0, pero el producto sale adelante si se entrega poco después en una 1.1 cercana.
- **Opcional** (30–49): Puede esperar a la versión 1.1. Es mejora del producto, no requisito del cliente.

## Definición de Terminado

Una historia no se cierra sin los 7 puntos:

1. La historia cumple todos sus criterios de aceptación.
2. El código está en la rama principal y pasó revisión de otra persona por pull request.
3. El cambio está publicado y funcionando en la dirección en línea.
4. Las reglas que la historia agregue tienen prueba automatizada.
5. Toda observación que el taller muestre cita su fuente: PMBOK o Guía de Scrum.
6. Se probó en al menos dos dispositivos, uno de ellos teléfono.
7. Ningún dato personal del estudiante sale de su navegador.

## Riesgos

| Id | Riesgo | Probabilidad | Impacto | Respuesta |
|---|---|---|---|---|
| R1 | El motor de reglas resulta más difícil de lo estimado y retrasa todo lo demás | Media | Alto | Se construye en el sprint 1 con solo dos artefactos. Si se complica, las etapas 3 a 6 reducen su número de reglas en lugar de desaparecer. |
| R2 | El sprint 2 dura tres semanas y oculta un atraso | Alta | Alto | Se parte internamente en dos tramos con una revisión propia el 2 de noviembre, aunque ante la clase se presente como un solo sprint. |
| R3 | La cuota de la API de inteligencia artificial se agota | Media | Bajo | La IA es opcional por diseño. Agotada la cuota, el taller sigue evaluando con reglas y lo informa. Ninguna etapa depende de ella. |
| R4 | Un integrante se atrasa o se ausenta | Media | Medio | Se trabaja en parejas y todo pasa por revisión, de modo que siempre hay dos personas que conocen cada parte. |
| R5 | El estudiante no entiende qué se le pide en una etapa | Media | Medio | La historia H-14 prueba el taller con seis estudiantes ajenos antes de la entrega final, y obliga a corregir los tres puntos de confusión más frecuentes. |
| R6 | Se confunde la constancia con una certificación oficial | Baja | Alto | El propio documento declara de forma visible que no lo es, y así consta en los criterios de aceptación de la historia H-13. |

## Seguimiento

El Release Burn Down Chart y el BackLog Burn Down Chart se generan con `burndown.py`,
`fig_bdc.py` y `gen_bdc.py`. Eje Y en días-hombre, que es el punto de historia de Kniberg;
los puntos Fibonacci de las tarjetas no se grafican porque están en otra escala.

El único dato que se captura a mano es `AVANCE` en `datos.py`: un renglón por sprint
cerrado, con `terminado`, `nuevo` y `retrabajo` en horas, y es lo que el **Product Owner
aceptó** en la revisión, no lo que el equipo cree que avanzó.

Todavía no hay ningún sprint cerrado: las dos gráficas dibujan sólo la previsión del plan de entregas.

## Historias con su desglose

### H-01 · Despliegue automático del taller

Entrega 0.1 · umbral Obligatorio · 12 h · importancia —

> Como **equipo de desarrollo** necesito **que cada cambio unido a la rama principal se publique solo** para **que lo que mostremos en la demo sea siempre lo que está en línea**.

**Criterios de aceptación**

- Los seis integrantes tienen acceso de escritura en GitHub.
- Al unir a la rama principal, el sitio se publica solo en GitHub Pages.
- La página abre en el teléfono de al menos dos integrantes.

**Validación**

Se abre un pull request con un cambio visible de texto y se une a la rama principal. Sin tocar nada más, se recarga la dirección pública en el proyector y el cambio ya está ahí. Se abre la misma dirección en un teléfono.

**Notas**

Historia técnica: va en lista separada y el Product Owner no la ordena. Se financia reservando 14 % del factor de dedicación del sprint 1. Aquí quedan la rama principal protegida y la revisión por pull request que exige la Definición de Terminado.

**Tareas**

| Tarea | Horas | Responsable |
|---|---|---|
| Crear el repositorio, proteger la rama principal y dejar plantilla de pull request | 2 | Abiud |
| Arrancar el proyecto con React y Vite y dejarlo corriendo en local | 2 | Abiud |
| Configurar la publicación automática en GitHub Pages al unir a la rama principal | 4 | Bernardo |
| Dar acceso de escritura a los seis y probar un pull request de punta a punta | 2 | Abiud |
| Probar la dirección pública en dos teléfonos distintos | 2 | Ismael |

### H-03 · Etapa 1: acta de constitución

Entrega 0.1 · umbral Obligatorio · 32 h · importancia 90

> Como **estudiante de administración de proyectos** necesito **redactar el acta de constitución del proyecto de Bremen y que el taller me señale al instante qué elementos me faltan** para **aprender los elementos del acta sin memorizar una lista**.

**Criterios de aceptación**

- El formulario presenta los nueve elementos con su explicación.
- Al enviar, se señala cuáles faltan y por qué cada uno importa.
- Cada observación cita el apartado del PMBOK que la respalda.
- El acta se puede corregir y volver a enviar sin límite.

**Validación**

Se entra a la etapa 1 y se envía un acta incompleta a propósito: el taller señala los elementos faltantes, cada uno con su cita del PMBOK. Se corrigen dos y se vuelve a enviar: ahora sólo marca lo que sigue faltando.

**Notas**

Fuente: PMBOK, acta de constitución del proyecto, con los nueve elementos del material del curso. Aquí viven las tareas del motor de reglas que antes eran la historia H-02: es la primera historia que lo necesita para existir.

**Tareas**

| Tarea | Horas | Responsable |
|---|---|---|
| Definir el contrato del motor: recibe el artefacto y devuelve si pasa, el mensaje y la cita de la fuente | 2 | Abiud |
| Implementar el motor y la carga de reglas desde archivos separados de la interfaz | 6 | Edgar |
| Escribir las reglas de los nueve elementos del acta con su cita del PMBOK | 8 | Ángel |
| Pruebas automatizadas de las reglas del acta | 4 | Edgar |
| Formulario del acta con los nueve campos y la explicación de cada uno | 6 | Roberto |
| Pantalla de resultado: faltantes, por qué importa cada uno y la cita | 4 | Roberto |
| Permitir corregir y volver a enviar sin límite | 2 | Ismael |

### H-04 · Etapa 2: estructura de desglose del trabajo

Entrega 0.2 · umbral Obligatorio · 30 h · importancia 85

> Como **estudiante de administración de proyectos** necesito **construir la estructura de desglose del trabajo y que se revise contra las reglas del PMBOK** para **entender por qué una EDT mal hecha se nota**.

**Criterios de aceptación**

- Se pueden crear, anidar y reordenar elementos.
- Se verifica la regla del 100 %, la regla 8/80 y la redacción como entregable.
- Cada incumplimiento explica la regla que no se cumplió.
- La EDT se guarda y se recupera al volver.

**Validación**

Se arma una EDT con un paquete redactado como actividad y una rama que no suma al 100 %. Al validar, el taller marca cada incumplimiento con la regla que lo respalda. Se corrige, se recarga la página y la EDT sigue ahí.

**Notas**

Reglas verificadas: 100 %, 8/80 y redacción como entregable, no como actividad. Necesita el motor de reglas de H-03 y el guardado de H-05. Decisión del 20 de octubre: la EDT se captura como esquema de texto indentado, donde la sangría es la profundidad, y no como árbol arrastrable. Un árbol con arrastrar y soltar es un sprint entero y no enseña nada que el esquema no enseñe. Las horas quedan por reestimar en la planeación.

**Tareas**

| Tarea | Horas | Responsable |
|---|---|---|
| Captura de la EDT como esquema de texto indentado y su analizador a árbol | 8 | Roberto |
| Guardar y recuperar el árbol completo | 4 | Ismael |
| Regla del 100 % | 4 | Ángel |
| Regla 8/80 | 2 | Ángel |
| Regla de redacción como entregable y no como actividad | 4 | Edgar |
| Mensajes de incumplimiento con la regla citada | 4 | Bernardo |
| Pruebas automatizadas de las tres reglas | 4 | Abiud |

### H-05 · Avance guardado en el navegador

Entrega 0.1 · umbral Obligatorio · 14 h · importancia 62

> Como **estudiante que recorre el taller en varias sesiones** necesito **que el taller recuerde mi avance** para **continuarlo otro día sin rehacer lo anterior**.

**Criterios de aceptación**

- El progreso y los artefactos se guardan en el navegador.
- Al volver, el taller ofrece continuar donde se quedó.
- No se guarda ningún dato personal.
- Hay forma visible de reiniciar el taller.

**Validación**

Se avanza la etapa 1 a medias, se cierra el navegador por completo y se vuelve a abrir: el taller ofrece continuar donde se quedó. Se presiona reiniciar y queda limpio.

**Notas**

Define el formato de almacenamiento que usarán todas las etapas siguientes. Conviene cerrarlo temprano aunque su valor para el estudiante se note después.

**Tareas**

| Tarea | Horas | Responsable |
|---|---|---|
| Definir el formato de almacenamiento del avance y de los artefactos | 4 | Bernardo |
| Guardar y leer del navegador, con manejo del caso en que esté bloqueado | 4 | Ismael |
| Ofrecer continuar donde se quedó al volver | 2 | Bernardo |
| Botón de reinicio visible con confirmación | 2 | Abiud |
| Revisar que no se guarde ningún dato personal | 2 | Ismael |

### H-06 · Etapa 3: ruta crítica

Entrega 0.2 · umbral Obligatorio · 38 h · importancia 75

> Como **estudiante de administración de proyectos** necesito **calcular la ruta crítica del camino a Bremen y que se revise mi cálculo paso por paso** para **ver en dónde me equivoqué y no solo que me equivoqué**.

**Criterios de aceptación**

- Se presenta la red con sus duraciones y el estudiante captura los cuatro tiempos.
- Se verifica el paso hacia adelante, el paso hacia atrás y las holguras por separado.
- Si el error está en el paso hacia adelante, no se marcan como errores los siguientes.
- Se acepta tanto la nomenclatura IA, TA, IT, TT como TPI, TPT, TRI, TRT.

**Validación**

Se captura la red con un error deliberado en un tiempo del paso hacia adelante. El taller señala ese paso y no marca como errores los tiempos que dependen de él. Se repite con la otra nomenclatura y la acepta igual.

**Notas**

Conflicto de nomenclatura del curso: las presentaciones usan IA, TA, IT, TT y el método TPI, TPT, TRI, TRT. Se aceptan las dos; nadie debe perder el ejercicio por las letras.

**Tareas**

| Tarea | Horas | Responsable |
|---|---|---|
| Modelar la red de precedencias del camino a Bremen con sus duraciones | 4 | Ángel |
| Pantalla de captura de los cuatro tiempos de cada actividad | 8 | Roberto |
| Regla del paso hacia adelante | 6 | Ángel |
| Regla del paso hacia atrás | 6 | Ángel |
| Regla de las holguras y marcado de la ruta crítica | 6 | Edgar |
| No encadenar errores: si falla un paso, no marcar lo que depende de él | 4 | Edgar |
| Aceptar las dos nomenclaturas: IA, TA, IT, TT y TPI, TPT, TRI, TRT | 2 | Ismael |
| Pruebas automatizadas de las reglas de la red | 2 | Edgar |

### H-07 · El giro: aparece la casa de los ladrones

Entrega 0.2 · umbral Obligatorio · 24 h · importancia 80

> Como **estudiante de administración de proyectos** necesito **que a mitad del taller aparezca la casa de los ladrones y eche abajo mi plan** para **entender en carne propia por qué existen los enfoques adaptativos**.

**Criterios de aceptación**

- Al terminar la etapa 3 se presenta el cambio de alcance como un hecho, no como una opción.
- Se muestra explícitamente qué partes del plan anterior dejaron de servir.
- Se explica por qué a partir de ahí el taller cambia a Scrum.
- El estudiante conserva acceso a sus artefactos de PMI para compararlos después.

**Validación**

Se termina la etapa 3 y aparece el cambio de alcance, sin opción de rechazarlo. Se muestra la lista de lo que el plan anterior dejó de servir y la explicación del cambio a Scrum. Se abre el acta de la etapa 1 y sigue disponible para comparar.

**Notas**

Es la historia que justifica que el producto cubra PMI y Scrum. Sin este giro el taller son dos temarios pegados.

**Tareas**

| Tarea | Horas | Responsable |
|---|---|---|
| Pantalla del cambio de alcance al cerrar la etapa 3, sin opción de rechazarlo | 6 | Abiud |
| Lista de lo que el plan anterior dejó de servir, armada con los artefactos del estudiante | 8 | Abiud |
| Texto que explica por qué el taller cambia a Scrum, con su cita | 4 | Bernardo |
| Dejar accesibles los artefactos de PMI para compararlos después | 4 | Bernardo |
| Marcar el giro en el avance guardado para que no se repita al volver | 2 | Ismael |

### H-08 · Etapa 4: product backlog del asalto

Entrega 0.2 · umbral Obligatorio · 34 h · importancia 70

> Como **estudiante de administración de proyectos** necesito **escribir el product backlog del asalto a la casa y que se revise el formato de mis historias** para **aprender a redactarlas bien antes de tener que hacerlo en un proyecto real**.

**Criterios de aceptación**

- Se pueden crear, ordenar y estimar historias.
- Se verifica la forma de la historia y la presencia de criterios de aceptación.
- Se señala cuando una historia es técnica disfrazada de historia de usuario.
- El backlog se exporta en formato de texto.

**Validación**

Se escribe una historia sin criterios y una tarea técnica redactada como historia de usuario: el taller marca las dos cosas. Se corrigen, se reordena el backlog y se exporta a texto.

**Notas**

Fuentes: Guía de Scrum 2020 y el formato de tarjeta del material del curso, con los mismos seis campos de esta ficha.

**Tareas**

| Tarea | Horas | Responsable |
|---|---|---|
| Editor de historias: crear, ordenar y estimar | 8 | Roberto |
| Guardar el backlog del estudiante en su avance | 2 | Roberto |
| Regla del formato «Como… Necesito… Para…» | 6 | Bernardo |
| Regla de al menos dos criterios de aceptación | 4 | Bernardo |
| Regla que detecta historia técnica disfrazada de historia de usuario | 6 | Edgar |
| Exportar el backlog a texto | 4 | Bernardo |
| Pruebas automatizadas de las reglas del backlog | 4 | Ismael |

### H-09 · Opinión opcional de la IA

Entrega 0.2 · umbral Obligatorio · 24 h · importancia 65

> Como **estudiante que ya terminó un artefacto** necesito **pedir la opinión de la inteligencia artificial sobre lo que escribí** para **recibir comentarios que una regla no puede dar**.

**Criterios de aceptación**

- Hay un botón explícito: la inteligencia artificial nunca se invoca sola.
- La llamada pasa por una función en la nube; la llave nunca está en el cliente.
- Existe un tope de llamadas por sesión y el estudiante ve cuántas le quedan.
- Si el servicio falla o la cuota se agota, el taller sigue funcionando con las reglas y lo dice con claridad.
- No se envía ningún dato personal del estudiante en la petición.

**Validación**

Se envía un texto y no pasa nada hasta presionar el botón: entonces llega el comentario. Se agota el tope a propósito y el taller lo dice y sigue funcionando con las reglas. Se muestra en el repositorio que la llave vive en la función, no en el cliente.

**Notas**

Requisito explícito del cliente. Bloqueada hasta decidir proveedor de LLM y tope de llamadas. Reglas de diseño 2, 3, 5 y 6.

**Tareas**

| Tarea | Horas | Responsable |
|---|---|---|
| Decidir proveedor de LLM y tope de llamadas por sesión, y dejarlo escrito | 2 | Abiud |
| Función en la nube que recibe el texto y devuelve el comentario, con la llave sólo ahí | 8 | Ismael |
| Botón explícito, estado de carga y manejo del error en el cliente | 4 | Ismael |
| Contador de llamadas restantes visible para el estudiante | 2 | Ángel |
| Degradación digna: si falla o se agota la cuota, avisarlo y seguir con reglas | 4 | Abiud |
| Revisar que no viaje ningún dato personal en la petición | 4 | Edgar |

### H-10 · Descarga de los artefactos

Entrega 1.1 · umbral Opcional · 14 h · importancia 40

> Como **estudiante que tiene que entregar evidencia en su clase** necesito **descargar los artefactos que produje** para **entregarlos o guardarlos**.

**Criterios de aceptación**

- Cada artefacto se exporta como archivo de texto o PDF.
- La descarga la inicia el estudiante.
- El archivo incluye la fecha y el nombre del artefacto.

**Validación**

Se descargan el acta y la EDT y se abren los archivos en el proyector: traen el nombre del artefacto y la fecha.

**Notas**

Sin servidor: la generación del PDF corre en el navegador.

**Tareas**

| Tarea | Horas | Responsable |
|---|---|---|
| Exportar el acta y la EDT a PDF con el generador de H-13 | 4 | Roberto |
| Encabezado del archivo con el nombre del artefacto y la fecha | 2 | Ángel |
| Exportar los artefactos de Scrum: backlog, sprint y retrospectiva | 4 | Ismael |
| Botón de descarga visible en cada etapa | 2 | Bernardo |
| Probar la descarga en teléfono y en computadora | 2 | Edgar |

### H-11 · Etapa 5: sprint y retrospectiva

Entrega 1.0 · umbral Obligatorio · 36 h · importancia 60

> Como **estudiante de administración de proyectos** necesito **planear el sprint del asalto y cerrarlo con una retrospectiva** para **practicar los dos eventos que más se confunden**.

**Criterios de aceptación**

- Se exige un Objetivo del Sprint y una Definición de Terminado.
- Se avisa si lo comprometido excede la capacidad declarada.
- La retrospectiva pide un compromiso concreto para el siguiente sprint.
- Se señala si el Objetivo del Sprint es en realidad una lista de tareas.

**Validación**

Se intenta cerrar la planeación sin Objetivo del Sprint y no deja. Se escribe una lista de tareas como objetivo y lo marca. Se compromete más de la capacidad declarada y avisa. Se cierra la retrospectiva sin compromiso y lo pide.

**Notas**

Es la etapa donde el estudiante practica exactamente lo que el equipo está haciendo en esta reunión.

**Tareas**

| Tarea | Horas | Responsable |
|---|---|---|
| Pantalla de planeación: objetivo del sprint, Definición de Terminado y capacidad declarada | 6 | Roberto |
| Regla que exige objetivo del sprint y Definición de Terminado | 6 | Bernardo |
| Regla que avisa si lo comprometido excede la capacidad declarada | 6 | Edgar |
| Regla que detecta objetivo del sprint que en realidad es una lista de tareas | 6 | Ángel |
| Pantalla de retrospectiva que pide un compromiso concreto | 6 | Abiud |
| Guardar el sprint y la retrospectiva en el avance, con pruebas de las reglas | 6 | Ismael |

### H-12 · Etapa 6: comparación PMI contra Scrum

Entrega 1.1 · umbral Deseable · 20 h · importancia 50

> Como **estudiante que ya recorrió las dos mitades del taller** necesito **comparar por escrito cómo resolvió cada enfoque el mismo proyecto** para **cerrar el taller con una conclusión propia**.

**Criterios de aceptación**

- Se muestran lado a lado los artefactos de PMI y los de Scrum que el estudiante produjo.
- Se pide una reflexión escrita con extensión mínima.
- La inteligencia artificial comenta el argumento sin calificarlo como correcto o incorrecto.
- Se aclara que no existe una única respuesta válida.

**Validación**

Se abre la etapa 6 con los artefactos de un recorrido completo: aparecen lado a lado los de PMI y los de Scrum. Se escribe una reflexión corta y pide la extensión mínima. Se pide la opinión de la IA y comenta el argumento sin calificarlo.

**Notas**

Cierra el argumento del taller. No hay respuesta única y el taller lo declara.

**Tareas**

| Tarea | Horas | Responsable |
|---|---|---|
| Vista lado a lado de los artefactos de PMI y de Scrum del estudiante | 8 | Roberto |
| Campo de reflexión con extensión mínima y guardado | 4 | Bernardo |
| Conectar la opinión de la IA para que comente el argumento sin calificarlo | 4 | Ismael |
| Aviso de que no hay una única respuesta válida, y pruebas de la etapa | 4 | Abiud |

### H-13 · Constancia de término

Entrega 1.1 · umbral Deseable · 14 h · importancia 55

> Como **estudiante que terminó el taller** necesito **una constancia de haberlo completado** para **tener evidencia de lo que hice**.

**Criterios de aceptación**

- Se emite al completar las seis etapas con evaluación aprobatoria.
- Incluye un folio verificable y la fecha.
- Declara de forma visible que no es una certificación oficial del PMI ni de Scrum.org.
- Se descarga como PDF.

**Validación**

Se completa el recorrido y se emite la constancia. Se descarga el PDF y en el proyector se leen el folio, la fecha y el aviso de que no es certificación oficial.

**Notas**

Regla de diseño 7: la constancia declara de forma visible que no es una certificación oficial del PMI ni de Scrum.org.

**Tareas**

| Tarea | Horas | Responsable |
|---|---|---|
| Generador de PDF en el navegador, reutilizable por los demás artefactos | 6 | Edgar |
| Plantilla de la constancia con folio verificable y fecha | 4 | Ángel |
| Aviso visible de que no es certificación oficial del PMI ni de Scrum.org | 2 | Ángel |
| Emitir sólo al completar las seis etapas con evaluación aprobatoria | 2 | Bernardo |

### H-14 · Pruebas con estudiantes reales

Entrega 1.1 · umbral Opcional · 24 h · importancia 45

> Como **equipo de desarrollo** necesito **probar el taller con compañeros reales de la materia** para **corregir lo que confunde antes de la entrega final**.

**Criterios de aceptación**

- Al menos seis estudiantes ajenos al equipo recorren el taller completo.
- Se registra dónde se atoran y cuánto tardan.
- Se corrigen los tres problemas más frecuentes.
- Los hallazgos quedan documentados para la presentación.

**Validación**

Se presenta la bitácora de las seis sesiones con compañeros: dónde se atoró cada uno y cuánto tardó. Se muestran los tres arreglos hechos a partir de eso, ya publicados.

**Notas**

Programarla al inicio del sprint 3: los arreglos necesitan días hábiles después y ese sprint sólo tiene tres útiles.

**Tareas**

| Tarea | Horas | Responsable |
|---|---|---|
| Guion de la sesión de prueba y qué se registra | 2 | Abiud |
| Conseguir seis compañeros ajenos al equipo y agendar las sesiones | 2 | Ángel |
| Acompañar las seis sesiones y cronometrarlas | 6 | Roberto |
| Bitácora de dónde se atora cada uno y cuánto tarda | 4 | Bernardo |
| Corregir los tres problemas más frecuentes | 8 | Edgar |
| Documentar los hallazgos para la presentación | 2 | Ismael |

### H-15 · Funciona en un teléfono modesto

Entrega 1.1 · umbral Opcional · 14 h · importancia 30

> Como **estudiante que solo cuenta con un teléfono modesto y datos móviles** necesito **que el taller cargue rápido y se vea completo en mi pantalla** para **poder usarlo sin pedir prestada una computadora**.

**Criterios de aceptación**

- Se prueba en al menos cuatro dispositivos distintos, incluyendo teléfonos.
- Carga en menos de cinco segundos con datos móviles.
- Es usable con teclado y tiene contraste suficiente.
- Ningún texto se corta en pantallas de 360 píxeles de ancho.

**Validación**

Se abre el taller en cuatro dispositivos, dos de ellos teléfonos, uno con datos móviles y cronómetro a la vista. Se recorre una etapa completa sólo con teclado.

**Notas**

Umbrales: 360 píxeles de ancho sin texto cortado y carga en menos de cinco segundos con datos móviles.

**Tareas**

| Tarea | Horas | Responsable |
|---|---|---|
| Revisar que ningún texto se corte a 360 píxeles de ancho | 4 | Roberto |
| Medir y bajar el tiempo de carga a menos de cinco segundos con datos móviles | 4 | Edgar |
| Recorrido completo sólo con teclado y revisión de contraste | 4 | Ángel |
| Probar en cuatro dispositivos, dos de ellos teléfonos | 2 | Ismael |
