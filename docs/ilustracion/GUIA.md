# Guía de ilustración · Camino a Bremen

Para Edgar. Qué dibujar, en qué orden, en qué formato y con qué reglas, para que cada
dibujo entre al taller sin retoques. El taller ya tiene un hueco para cada ilustración: mientras
no llega, muestra un dibujo provisional; cuando llega, el archivo se coloca y reemplaza al
provisional sin tocar el juego.

## 1. El estilo

- **Libro ilustrado, hecho a mano.** Lápiz, tinta, acuarela, gouache o pintura digital a mano
  (Procreate, Krita, Photoshop). **Nada generado con IA**: es regla del proyecto y el cliente es
  una editorial.
- **Amable, no infantil.** Lo usan estudiantes universitarios y se proyecta en clase. Animales
  con expresión, sin ropa ni rasgos de caricatura exagerados.
- **Referencias de ambiente:** las dos fotos que pasó Abiud (el valle con montañas a lo lejos y
  el camino empedrado con cerca de madera). Para los animales, los grabados de cuentos clásicos.
- **Luz:** el sol está arriba a la derecha. La luz viene de la derecha y las sombras caen a la
  izquierda, en todos los dibujos.
- **Solo de día.** La noche la hace el taller oscureciendo los dibujos; no hace falta otra
  versión.

### Paleta de referencia

No es obligatoria al pie de la letra, pero cuanto más se acerque, mejor cuadra con lo demás.

| Qué | Colores |
|---|---|
| Cielo, de arriba al horizonte | `#1f5fa8` `#5f9bd0` `#bcd6e6` `#f4e2bd` |
| Montañas, de lejos a cerca | `#a4adca` `#8595b6` `#74887f` |
| Valle | `#a9a96a` `#8f9a52` |
| Tierra cercana | `#cfa165` `#bb8a52` `#9c6c40` |
| Piedra del camino | `#9a9d97` `#878a84` y juntas `#4b4e4a` |
| Madera de la cerca | `#b9643a` `#7f3c22` |
| Techos | `#b5432f` |
| Burro · perro · gato · gallo | `#8f8a86` · `#b07a46` · `#4a4a52` · `#c8452e` |
| Contorno, si se usa | `#2b2620` |

## 2. Qué dibujar y en qué orden

**Primero un solo boceto del burro**, para aprobar el estilo antes de hacer todo lo demás.

| Prioridad | Qué | Archivos | Fecha |
|---|---|---|---|
| 1 | Los cuatro animales | `animal-burro.png` `animal-perro.png` `animal-gato.png` `animal-gallo.png` | 2 de noviembre |
| 2 | Los siete destinos | `destino-molino.png` `destino-perro.png` `destino-gato.png` `destino-gallo.png` `destino-bosque.png` `destino-casa.png` `destino-final.png` | 9 de noviembre |
| 3 | El fondo del mapa y la bruma | `mapa-fondo.png` `mapa-bruma.png` | 12 de noviembre |

El 2 de noviembre es la revisión interna del sprint 2; el 18 se presenta la versión final. Lo
que no llegue se queda con el dibujo provisional: nada se rompe.

## 3. Medidas exactas

El taller coloca cada dibujo por su **punto de apoyo**: el lugar donde toca el suelo. Si el
punto de apoyo está donde dice la tabla, el dibujo cae justo en su lugar.

| Tipo | Lienzo | Punto de apoyo | Fondo |
|---|---|---|---|
| Animal | 1200 × 1000 px | (600, 900): centrado, patas sobre la línea a 900 px | Transparente |
| Destino | 1000 × 800 px | (500, 700): centro de la base sobre la línea a 700 px | Transparente |
| Fondo del mapa | 3200 × 1800 px | — | Opaco |
| Bruma | 3200 × 1800 px | — | Transparente |

### Animales

- De pie, **de perfil, mirando a la derecha** (hacia donde avanza el camino).
- **Los cuatro a la misma escala**, como si estuvieran juntos: el burro es el más grande y el
  gallo el más chico. Como guía, de ancho: burro ~900 px, perro ~650, gato ~480, gallo ~420.
- Que se reconozcan **en escala de grises**: cada uno con un tono claramente distinto (burro gris
  medio, perro café claro, gato oscuro, gallo rojo con cola oscura). Así los distingue también
  quien no ve bien los colores.
- Silueta clara: en la banda se ven a unos 70 px de ancho, y en teléfono aún más chicos.

### Destinos

- Vista de **tres cuartos, un poco desde arriba**, como se ven en el mapa.
- Incluye su sombra en el suelo; nada de cielo ni de terreno alrededor.
- Qué es cada uno:
  - **Molino:** de piedra, con techo cónico, aspas de celosía y costales en la base. Si se
    quiere que las aspas giren, van aparte en `destino-molino-aspas.png`, con el centro del eje en
    el centro del lienzo.
  - **Perro:** caseta de madera con cerca, y el perro echado junto a ella.
  - **Gato:** casa pequeña de entramado de madera, con el gato sobre el tejado.
  - **Gallo:** gallinero con rampa y el gallo parado en la cerca.
  - **Bosque:** frondoso, con muchos árboles y volumen; es el más ancho de todos.
  - **Casa de los ladrones:** casa de campo con **una ventana encendida**. Es la luz que ve el
    gallo desde el bosque.
  - **Acto final:** los cuatro animales encimados (burro, perro, gato, gallo) frente a esa
    ventana.

### Fondo del mapa

- Usa **`plantilla-mapa.svg`** (en esta misma carpeta) como capa guía, debajo de tu dibujo, y
  **bórrala antes de exportar**.
- **Sin destinos, sin rótulos y sin camino.** Por donde pasa el camino, deja tierra lisa: el
  taller lo dibuja encima porque cambia con el avance del estudiante. Si quieres dibujar el
  camino a mano, va en una capa aparte, `mapa-camino.png`, transparente.
- Tres franjas de profundidad, como en la plantilla: **cielo y montañas** arriba, **valle** en
  medio y **tierra cercana** abajo, con más detalle mientras más cerca.
- La **franja superior** (200 px) la tapa el cabezal: nada importante ahí.
- Las **franjas amarillas** de la plantilla son los rótulos: sin detalle importante debajo.
- **Bruma**, en `mapa-bruma.png` aparte: neblina blanca y suave que cubra la zona morada de la
  plantilla, sobre fondo transparente. Se quita cuando el estudiante llega a la casa.

## 4. Cómo entregar

- **PNG con transparencia** (RGBA), en sRGB y sin compresión con pérdida. El taller los convierte
  a un formato ligero; no hace falta optimizarlos.
- **El archivo fuente con capas** (`.psd`, `.procreate` o `.kra`), por si hay que ajustar algo.
- **Los nombres exactos** de la tabla de la sección 2: minúsculas, con guiones y sin espacios.
- **Sin texto ni firma dentro del dibujo**, y sin marcos ni sombras decorativas. El crédito va
  en la pantalla de créditos del taller.

## 5. Reglas que no se negocian

1. Hecho a mano. Nada generado con IA.
2. Nada copiado de otros libros, películas o personajes, ni de las figuras del PMBOK.
3. Luz desde la derecha y misma escala entre los animales.
4. Ningún texto dentro de los dibujos: los nombres y conceptos los pone el taller.

## 6. Crédito y permiso

Edgar conserva la autoría. Al entregar, autoriza que las ilustraciones se usen en el taller y en
la entrega a la editorial, con el crédito **«Ilustraciones: Edgar Adrián García Santoy»**.

## 7. Antes de entregar, revisa

- [ ] El lienzo mide exactamente lo de la tabla.
- [ ] El punto de apoyo está donde dice la tabla.
- [ ] El fondo es transparente (salvo `mapa-fondo.png`).
- [ ] La luz viene de la derecha.
- [ ] El nombre del archivo es el de la tabla.
- [ ] No hay texto, firma ni marco dentro del dibujo.
- [ ] La capa guía de la plantilla está borrada.

## Para el equipo: cómo entra un dibujo al taller

1. Copiar el archivo a `public/ilustraciones/`.
2. En `src/ilustraciones/catalogo.js`, escribir su nombre en el `archivo` que le corresponde
   (`'animal-burro': { lienzo: 'animal', archivo: 'animal-burro.png' }`).
3. Revisar en el mapa, la banda y las escenas que cae en su lugar. Si cambia de posición algún
   destino en `src/mapa/trazo.js`, regenerar la plantilla.
