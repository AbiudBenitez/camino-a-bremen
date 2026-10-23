import { Component } from 'react'

/**
 * Red de seguridad. Sin esto, cualquier error de render deja la pantalla en
 * blanco y el estudiante pierde de vista su trabajo sin saber por qué.
 *
 * Regla de diseño 6, degradación digna: el taller puede fallar, pero lo dice y
 * no se lleva por delante lo que la persona escribió.
 */
export default class Red extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="se-rompio" role="alert">
        <h2>Se rompió algo del taller</h2>
        <p>
          Tu avance sigue guardado en este navegador. Recarga la página; si vuelve a pasar,
          descarga tu expediente desde el recorrido y repórtalo al equipo.
        </p>
        <p className="detalle"><code>{String(this.state.error?.message ?? this.state.error)}</code></p>
        <div className="acciones">
          <button type="button" className="primario" onClick={() => window.location.reload()}>
            Recargar
          </button>
          <a className="como-boton" href="#inicio" onClick={() => this.setState({ error: null })}>
            Volver al recorrido
          </a>
        </div>
      </div>
    )
  }
}
