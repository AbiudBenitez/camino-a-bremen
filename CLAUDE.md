# Camino a Bremen · código

Cliente del taller de administración de proyectos. Taller web de seis etapas sobre *Los
músicos de Bremen*: etapas 1 a 3 con el enfoque predictivo del PMI, etapas 4 a 6 con Scrum.
En la etapa 4 aparece la casa de los ladrones y el objetivo cambia. **Ese giro es la razón de
ser del producto, no un adorno.**

**Cliente:** casa editorial. **Usuario:** estudiantes universitarios de administración de
proyectos. **Product Owner:** la docente. **Equipo:** Equipo 2 · India, seis integrantes.

El requisito del cliente dice **divertido e interactivo**, y la docente lo subrayó. No es
decoración: una pantalla que solo informa no cumple el encargo.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Código | Este repositorio. `main` protegida, se publica solo en GitHub Pages al unir. |
| Contexto de Scrum: equipo, sprints, fechas, backlog, capacidad, tareas con responsable, DoD, riesgos | **`docs/contexto-scrum.md`** |
| Planeación y entregables `.docx` | Carpeta hermana `admonpy/scrum-taller-bremen`, que no es repositorio git |
| Especificaciones de diseño | `docs/superpowers/specs/` |
| Cómo trabaja el equipo (ramas, commits, revisión) | `COMO-COLABORAR.md` |

`docs/contexto-scrum.md` **es un documento derivado y no se edita a mano.** Lo genera
`gen_contexto.py` desde `datos.py`, en el proyecto de planeación. Si un dato de ahí está mal,
se corrige allá y se corre `./regenerar.sh`. Lo mismo vale para los `.docx`.

## Estado

Sección sostenida a mano. **Última revisión: 22 de octubre de 2026.** Si la fecha ya quedó
atrás, verifica con `git log` y `gh pr list` antes de creerle.

- Sprint 1 cierra el **22 de octubre** y se presenta el **23**. La entrega 0.1 son H-01, H-03
  y H-05.
- `main` todavía trae solo el andamio previo al formulario. **Lo que está publicado en línea
  no es lo que el equipo construyó**, y eso se arregla al unir el PR #1.
- `feat/formulario-del-acta` (PR #1) trae la etapa 1 completa: motor, expediente, recorrido
  del acta y 41 pruebas. Espera la aprobación de Bernardo.
- `docs/mesa-de-trabajo` trae la especificación de la mesa de trabajo, aprobada en alcance y
  **sin construir**: es trabajo del sprint 2.

## Stack y comandos

React 19 con Vite 8, publicado en GitHub Pages. Pruebas con vitest, lint con oxlint. **Sin
router:** la navegación es estado, para que Pages no necesite reescrituras. **Sin
dependencias de interfaz ni de animación**; si alguna hace falta, se propone antes de
agregarla. El paquete pesa ~77 KB comprimido y ese número se cuida.

```sh
npm install
npm run dev     # servidor local
npm run test    # vitest
npm run lint    # oxlint, sin advertencias
npm run build   # lo mismo que corre la revisión
```

## Reglas de diseño

Obligatorias. Un cambio que rompa una de estas no se une.

1. Las reglas nunca dependen de la red. El motor corre entero en el navegador.
2. La IA solo se invoca si el usuario la pide con un botón explícito. Nunca sola.
3. La llave de la API vive solo en la función en la nube. El cliente jamás la toca.
4. Toda observación cita su fuente: el apartado del PMBOK o de la Guía de Scrum. Una
   corrección sin fuente no enseña, impone.
5. Ningún dato personal del estudiante sale de su navegador.
6. Degradación digna: si la IA falla o se agota la cuota, el taller sigue y lo dice.
7. La constancia declara de forma visible que no es certificación oficial.
8. Agregar un artefacto nuevo no obliga a tocar la interfaz.

A estas se suman dos que salieron de la revisión de patrones oscuros:

9. **La IA se ve y se nombra como IA.** Su salida va separada de la del motor y etiquetada.
   El personaje puede acompañar el fracaso; nunca firma un juicio que lo hizo un modelo.
10. **Nada de mecánicas de enganche.** Ver la lista negra más abajo.

## Arquitectura

| Carpeta | Qué vive ahí |
|---|---|
| `src/motor/` | Motor de reglas. `contrato.js` define Fuente, Hallazgo y Regla; `motor.js` las corre; `catalogo.js` dice qué reglas usa cada artefacto. |
| `src/motor/reglas/` | Un archivo por artefacto, con sus pruebas al lado. |
| `src/estado/` | `esquema.js` (versión y migraciones), `taller.js` (reductor puro) y `almacen.js` (escritura a `localStorage`). Llega con el PR #1. |
| `src/voz/` | Catálogo de personajes: qué dice el burro, el perro, el gato o el gallo ante cada hallazgo. **Separado del motor a propósito.** Llega con el PR #1. |
| `src/etapas/` | Las seis etapas. `acta/campos.js` define los pasos del recorrido de la etapa 1. |
| `src/componentes/` | Interfaz. Sabe pintar hallazgos; no sabe de actas ni de EDT. |
| `src/ia/` | Cliente de la opinión opcional. |

Contrato de una regla: `{ id, descripcion, fuente, evaluar(artefacto) -> Hallazgo[] }`. El
motor valida la forma **una vez por catálogo** antes de correrla, para que una regla mal
escrita falle en las pruebas y no en silencio frente al estudiante.

Dos reglas que salieron de errores reales:

- **La gravedad de un hallazgo sigue la confianza de la regla, no su importancia.** Una
  heurística que se equivoca con abreviaturas es aviso, no error.
- **Lo que el estudiante escribió no se asume con una forma.** Una lista se normaliza antes de
  recorrerse, en la regla y en el componente. Confiar en el tipo tiró la pantalla a blanco una
  vez.

## Decisiones de producto

- **Etapas 2 y 3 se capturan como texto y tabla**, no como árbol arrastrable ni grafo
  dibujable. La EDT es un esquema indentado que se analiza a árbol; la red de precedencias es
  una tabla de actividades con duración y predecesoras. **Matiz que no se negocia:** en la
  etapa 3 el estudiante sigue calculando los cuatro tiempos y la holgura; la app los verifica,
  **no los calcula.** Si los calcula, la etapa pierde el ejercicio.
- **La etapa 1 no es un formulario parejo.** Son seis escenas de prosa más una ficha de datos
  y la revisión. Un recorrido uniforme de trece pasos idénticos se siente como un examen, y
  así lo reportó el usuario.
- **El campo de enfoque viene pre-sembrado**, no vacío: es una predicción del estudiante que
  la etapa 4 le va a citar de vuelta. La pregunta de alcance es **«¿qué NO es parte de
  esto?»** por la misma razón.
- **El giro de la etapa 4 no se anuncia antes.** Nada en las etapas 1 a 3 insinúa que el plan
  va a dejar de servir. Si se adelanta, se gasta el único momento que el producto tiene.

## Lista negra

No se proponen ni se agregan: puntos, experiencia, medallas, rachas, temporizadores que
penalizan, azar, mascotas que hablan por hablar, confeti y puntuación automática de la prosa.
El producto es un taller que se califica solo con reglas citables.

## Convenciones

- Español en el dominio (`motor`, `reglas`, `hallazgo`, `fuente`); inglés donde lo impone el
  framework (`useState`, `props`).
- Comentarios: solo donde explican una decisión. Ninguno que repita lo que dice el código.
- Commits en español, imperativo, una línea, sin punto final.
- Ramas `feat/`, `fix/`, `chore/`, `docs/`. Nada se une a `main` sin revisión de otra persona:
  es parte de la Definición de Terminado, no un trámite.
- Las reglas nuevas llevan prueba. También es parte de la Definición de Terminado.

## Preguntas abiertas

- Proveedor de LLM para la opinión opcional y su tope de llamadas (historia H-09, sprint 2).
- Herramienta de tablero. El reporte comparativo recomienda **Jira plan Free**. Al importar
  el CSV, la estimación se configura en **Time (hours)**, no en puntos de historia.
- Los nueve elementos del acta salieron de la plantilla de la docente y **esperan la
  confirmación de Ángel**.

## Instrucciones para Claude

- Responde en español. El código y sus identificadores pueden ir en inglés.
- Lee `docs/contexto-scrum.md` antes de estimar, repartir trabajo o nombrar responsables. No
  lo edites: se regenera.
- Respeta el alcance del sprint en curso y no adelantes funcionalidades de sprints
  posteriores.
- Cumple las diez reglas de diseño. Si algo las contradice, dilo en lugar de buscarle la
  vuelta.
- Antes de agregar una dependencia, propón y espera confirmación.
- Antes de un cambio grande, propón el plan y espera confirmación.
- Verifica antes de afirmar. En este proyecto ya hubo tres diagnósticos falsos que se cayeron
  al comprobarlos: un desbordamiento en teléfono que era un recorte del navegador sin cabeza,
  un `dist/` supuestamente versionado y una agrupación uniforme que empeoraba la etapa 1.
