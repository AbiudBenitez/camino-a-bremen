# Cómo colaborar

Guía corta para los seis. Si algo aquí choca con lo que diga el equipo en la daily, gana el
equipo y se actualiza este archivo.

## Una vez

```sh
git clone git@github.com:AbiudBenitez/camino-a-bremen.git
cd camino-a-bremen
npm install
npm run dev
```

Si `git clone` por SSH falla, te falta subir tu llave a GitHub: Settings → SSH and GPG keys.

## Cada vez que agarras una actividad

```sh
git switch main
git pull
git switch -c feat/nombre-corto-de-lo-que-haces
```

Trabaja, y conforme avances:

```sh
npm run test        # tus reglas pasan
npm run lint        # sin advertencias
git add -A
git commit -m "Reglas del 100 % de la EDT"
git push -u origin feat/nombre-corto-de-lo-que-haces
```

Luego abres el pull request en GitHub. La plantilla te pide la historia, la Definición de
Terminado y cómo probarlo. **No se une a `main` sin que otra persona lo revise**: es parte de
la Definición de Terminado, no un trámite.

## Nombres de rama

| Para | Prefijo | Ejemplo |
|---|---|---|
| Una actividad del sprint backlog | `feat/` | `feat/reglas-acta` |
| Arreglar algo que ya estaba | `fix/` | `fix/fecha-fin-anterior` |
| Documentos, configuración, limpieza | `chore/` | `chore/plantilla-de-pr` |

## Mensajes de commit

En español, en imperativo, una línea, sin punto final. Qué cambia, no qué archivo tocaste.

- Sí: `Agregar la regla 8/80 de la EDT`
- No: `cambios`, `update app.jsx`, `arreglos varios`

## Qué revisar cuando te toca revisar

1. ¿Cumple los criterios de aceptación de su historia?
2. ¿Las reglas nuevas traen prueba?
3. ¿Toda observación que se le muestra al estudiante trae su cita?
4. ¿Se rompió alguna de las diez reglas de diseño del README?
5. ¿Pasa `npm run lint`, `npm run test` y `npm run build`?

Revisar es leer el código y probarlo, no apretar «Approve». Si algo no se entiende, pregúntalo
en el pull request: esa pregunta suele ser el hallazgo.

## Qué pasa al unir a main

Dos cosas solas: corre la revisión (lint, pruebas, compilación) y, si pasa, el sitio se publica
en https://abiudbenitez.github.io/camino-a-bremen/. Lo que esté en `main` es lo que se ve en la
demo. Por eso `main` siempre tiene que estar sano.

## Qué nunca se sube

- Llaves de API, contraseñas ni archivos `.env`. La llave de la IA vive en la función en la
  nube; en el repositorio solo va `.env.example`, vacío.
- `node_modules/` ni `dist/`.
- Datos personales de nadie.

## Dónde está lo demás

La planeación (backlog, sprints, responsables, plan de entregas y las gráficas de burndown)
vive en la carpeta `admonpy/scrum-taller-bremen` y se genera con scripts: los `.docx` no se
editan a mano.

Lo que necesitas de ahí ya está volcado en `docs/contexto-scrum.md`: tus tareas con tus horas,
las fechas, la capacidad del sprint y la Definición de Terminado. Ese archivo también se
genera, así que tampoco se edita a mano.
