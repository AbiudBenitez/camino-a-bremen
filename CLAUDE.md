# Camino a Bremen · código

Cliente del taller de administración de proyectos. La planeación (backlog, sprints, plan de
entregas, burndown) vive en otro repositorio de trabajo: `admonpy/scrum-taller-bremen`, donde
los `.docx` se generan con scripts y no se editan a mano.

## Qué es

Taller web de seis etapas sobre *Los músicos de Bremen*. Etapas 1 a 3 con el enfoque predictivo
del PMI, etapas 4 a 6 con Scrum. En la etapa 4 aparece la casa de los ladrones y el objetivo
cambia: ese giro es la razón de ser del producto, no un adorno.

**Cliente:** casa editorial. **Usuario:** estudiantes universitarios de administración de
proyectos. **Product Owner:** la docente.

## Stack

React 19 con Vite 8, publicado en GitHub Pages. Pruebas con vitest, lint con oxlint. Sin
router: la navegación es estado, para que Pages no necesite reescrituras. Sin dependencias de
interfaz; si alguna hace falta, se discute antes de agregarla.

## Reglas de diseño

Obligatorias. Un cambio que rompa una de estas no se une.

1. Las reglas nunca dependen de la red. El motor corre entero en el navegador.
2. La IA solo se invoca si el usuario la pide con un botón explícito. Nunca sola.
3. La llave de la API vive solo en la función en la nube. El cliente jamás la toca.
4. Toda observación cita su fuente: el apartado del PMBOK o de la Guía de Scrum.
5. Ningún dato personal del estudiante sale de su navegador.
6. Degradación digna: si la IA falla o se agota la cuota, el taller sigue y lo dice.
7. La constancia declara de forma visible que no es certificación oficial.
8. Agregar un artefacto nuevo no obliga a tocar la interfaz.

## Arquitectura

| Carpeta | Qué vive ahí |
|---|---|
| `src/motor/` | Motor de reglas. `contrato.js` define Fuente, Hallazgo y Regla; `motor.js` las corre; `catalogo.js` dice qué reglas usa cada artefacto. |
| `src/motor/reglas/` | Un archivo por artefacto, con sus pruebas al lado. |
| `src/etapas/` | Las seis etapas y dónde está el giro. |
| `src/componentes/` | Interfaz. Sabe pintar hallazgos, no sabe de actas ni de EDT. |
| `src/almacenamiento/` | Avance del estudiante en `localStorage`, con respaldo si el navegador no deja escribir. |
| `src/ia/` | Cliente de la opinión opcional. |

Contrato de una regla: `{ id, descripcion, fuente, evaluar(artefacto) -> Hallazgo[] }`. El motor
valida la forma antes de correrla, para que una regla mal escrita falle en las pruebas y no en
silencio frente al estudiante.

## Convenciones

- Español en el dominio (`motor`, `reglas`, `hallazgo`, `fuente`); inglés donde lo impone el
  framework (`useState`, `props`).
- Comentarios: solo donde explican una decisión. Ninguno que repita lo que dice el código.
- Commits en español, imperativo, una línea.
- Ramas `feat/`, `fix/`, `chore/`. Nada se une a `main` sin revisión de otra persona.
- Las reglas nuevas llevan prueba. Es parte de la Definición de Terminado.

## Instrucciones para Claude

- Responde en español.
- Respeta el alcance del sprint en curso. No adelantes etapas de sprints posteriores.
- Antes de agregar una dependencia, propón y espera confirmación.
- Antes de un cambio grande, propón el plan y espera confirmación.
- Si algo contradice las reglas de diseño, dilo en lugar de buscarle la vuelta.
