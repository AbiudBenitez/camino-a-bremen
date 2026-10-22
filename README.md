# Camino a Bremen

Taller web para practicar administración de proyectos. El estudiante gestiona el proyecto de
*Los músicos de Bremen* a lo largo de seis etapas: las tres primeras con el enfoque predictivo
del PMI, y las tres últimas con Scrum, porque a media historia aparece la casa de los ladrones
y el objetivo cambia. En cada etapa produce un artefacto real y el taller se lo evalúa al
instante, citando la fuente que respalda cada observación.

**Equipo 2 · India** · Administración de Proyectos de Software · Grupo 006 · FIME, UANL.

| | |
|---|---|
| Sitio | https://abiudbenitez.github.io/camino-a-bremen/ |
| Entregas | 0.1 el 23 de octubre · 0.2 el 13 de noviembre · 1.0 el 20 de noviembre |
| Planeación | Carpeta `admonpy/scrum-taller-bremen` (backlog, sprints, plan de entregas, burndown) |
| Contexto del sprint | [`docs/contexto-scrum.md`](docs/contexto-scrum.md): equipo, fechas, backlog, capacidad, tareas con responsable y Definición de Terminado |

Este taller **no otorga una certificación oficial** del PMI ni de Scrum.org.

## Arrancar

```sh
npm install
npm run dev
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en http://localhost:5173 |
| `npm run test` | Pruebas de las reglas (vitest) |
| `npm run test:watch` | Lo mismo, en vigilancia |
| `npm run lint` | oxlint |
| `npm run build` | Compila a `dist/` con la base de GitHub Pages |
| `npm run preview` | Sirve `dist/` para revisarlo antes de unir |

## Cómo está armado

```
src/
  motor/            El motor de reglas. Corre en el navegador, sin red.
    contrato.js     Contrato único: Fuente, Hallazgo, Regla. Lo que todos cumplen.
    motor.js        Carga las reglas del artefacto y junta sus hallazgos.
    catalogo.js     Qué artefacto usa qué reglas. Una etapa nueva es un renglón aquí.
    reglas/         Un archivo por artefacto. acta.js es la etapa 1.
  etapas/           Las seis etapas del taller y dónde está el giro.
    acta/           La etapa 1: los pasos del recorrido y sus pantallas.
  componentes/      Interfaz. Sabe pintar hallazgos; no sabe de actas ni de EDT.
  estado/           Expediente del estudiante: esquema con migraciones, reductor y almacén.
  voz/              Qué dice cada personaje ante cada hallazgo. Aparte del motor.
  ia/               Cliente de la opinión opcional. Nunca se llama solo.
```

### Agregar un artefacto nuevo

1. Crea `src/motor/reglas/<artefacto>.js` y exporta un arreglo de reglas.
2. Agrega el renglón en `src/motor/catalogo.js`.
3. Escribe `<artefacto>.test.js` al lado.

La interfaz no se toca: el componente `Hallazgos` ya sabe pintar lo que salga.

Cada regla cumple esta forma:

```js
{
  id: 'acta.fechas-coherentes',
  descripcion: 'Las fechas de inicio y fin están y el fin no es anterior al inicio.',
  fuente: fuente('PMBOK', 'Desarrollar el Acta de Constitución del Proyecto'),
  evaluar(artefacto) { return [ /* hallazgos */ ] },
}
```

## Reglas de diseño

Obligatorias para todo el código. Un pull request que rompa una de estas no se une.

1. **Las reglas nunca dependen de la red.** El motor corre entero en el navegador.
2. **La IA solo se invoca si el usuario la pide** con un botón explícito. Nunca sola.
3. **La llave de la API vive solo en la función en la nube.** El cliente jamás la toca.
4. **Toda observación cita su fuente.** Una corrección sin fuente no enseña, impone.
5. **Ningún dato personal del estudiante sale de su navegador.**
6. **Degradación digna:** si la IA falla o se agota la cuota, el taller sigue y lo dice.
7. **La constancia declara que no es certificación oficial.**
8. **Agregar un artefacto nuevo no obliga a tocar la interfaz.**
9. **La IA se ve y se nombra como IA.** Su salida va separada de la del motor y etiquetada.
10. **Nada de mecánicas de enganche:** sin puntos, experiencia, medallas, rachas,
    temporizadores que penalicen, azar ni puntuación automática de la prosa.

## Estado

Sprint 1, que cierra el 22 de octubre. El motor de reglas, su contrato y las reglas de la
etapa 1 están funcionando con pruebas. La etapa 1 completa —el recorrido del acta, el
expediente guardado y el veredicto— viene en el pull request de la historia H-03 y entra a
`main` cuando pase la revisión; hasta entonces, lo que está publicado es el andamio.
