/** Sello de goma. Los documentos de proyecto se sellan: es lo más parecido a un
 *  premio que cabe sin traicionar el tono del producto. */
export default function Sello({ texto = 'Acta aprobada', fecha }) {
  return (
    <div className="sello" role="img" aria-label={`${texto}${fecha ? `, ${fecha}` : ''}`}>
      <span className="sello-texto">{texto}</span>
      {fecha && <span className="sello-fecha">{fecha}</span>}
    </div>
  )
}
