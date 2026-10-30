/**
 * Tonos de prueba, uno por animal, mientras llega la música real. Cumplen el
 * mismo contrato que pedimos al compositor: igual tempo, igual duración, y que
 * cualquier suma en orden (burro; burro y perro; …) suene bien.
 *
 * Cuando lleguen las pistas reales, esto deja de usarse y `musica.js` las lee
 * de archivos. Nada más cambia.
 */
export const TEMPO = 96
const COMPASES = 4
const TIEMPOS = 4
export const DURACION = (COMPASES * TIEMPOS * 60) / TEMPO

// Do, La menor, Fa, Sol: una vuelta que cierra y vuelve a empezar sin costura.
const ACORDES = [[48, 52, 55], [45, 48, 52], [41, 45, 48], [43, 47, 50]]
const MELODIA = [72, 74, 76, 79, 76, 72, 69, 72, 69, 72, 77, 76, 74, 71, 67, 71]

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12)

function nota(buf, sr, inicio, dur, frecuencia, { volumen, armonico = 0, caida = 4 }) {
  const desde = Math.floor(inicio * sr)
  const hasta = Math.min(buf.length, Math.floor((inicio + dur) * sr))
  for (let i = desde; i < hasta; i++) {
    const t = (i - desde) / sr
    const ataque = Math.min(1, t / 0.012)
    // Termina en cero antes del final de la nota: sin chasquidos al cortar.
    const cola = Math.min(1, (hasta - i) / (0.02 * sr))
    const env = ataque * Math.exp(-caida * t) * cola
    const fase = 2 * Math.PI * frecuencia * t
    buf[i] += volumen * env * (Math.sin(fase) + armonico * Math.sin(3 * fase))
  }
}

// Ruido determinista: el mismo bucle suena igual cada vez y las pruebas no dependen del azar.
function ruido(semilla) {
  let s = semilla
  return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 2147483648 - 1 }
}

export function sintetizar(sr) {
  const largo = Math.round(DURACION * sr)
  const tiempo = 60 / TEMPO
  const pistas = {
    burro: new Float32Array(largo),
    perro: new Float32Array(largo),
    gato: new Float32Array(largo),
    gallo: new Float32Array(largo),
  }

  ACORDES.forEach((acorde, compas) => {
    const base = compas * TIEMPOS * tiempo
    for (let t = 0; t < TIEMPOS; t++) {
      const inicio = base + t * tiempo
      // Burro: el bajo, en cada tiempo.
      nota(pistas.burro, sr, inicio, tiempo * 0.9, hz(acorde[t % 2 === 0 ? 0 : 2] - 12),
        { volumen: 0.22, armonico: 0.3, caida: 3 })
      // Gato: arpegio en corcheas.
      for (let c = 0; c < 2; c++) {
        nota(pistas.gato, sr, inicio + (c * tiempo) / 2, tiempo * 0.45, hz(acorde[(t * 2 + c) % 3] + 12),
          { volumen: 0.07, caida: 5 })
      }
      // Gallo: la melodía.
      nota(pistas.gallo, sr, inicio, tiempo * 0.85, hz(MELODIA[compas * TIEMPOS + t]),
        { volumen: 0.08, armonico: 0.2, caida: 2.5 })
    }
  })

  // Perro: bombo en 1 y 3, platillo suave a contratiempo.
  const azar = ruido(7)
  for (let t = 0; t < COMPASES * TIEMPOS; t++) {
    const inicio = t * tiempo
    if (t % 2 === 0) {
      const desde = Math.floor(inicio * sr)
      for (let i = 0; i < 0.16 * sr && desde + i < largo; i++) {
        const s = i / sr
        const f = 45 + 70 * Math.exp(-s * 30)
        pistas.perro[desde + i] += 0.28 * Math.exp(-s * 18) * Math.sin(2 * Math.PI * f * s)
      }
    }
    const desde = Math.floor((inicio + tiempo / 2) * sr)
    for (let i = 0; i < 0.035 * sr && desde + i < largo; i++) {
      pistas.perro[desde + i] += 0.04 * Math.exp(-(i / sr) * 90) * azar()
    }
  }
  return pistas
}
