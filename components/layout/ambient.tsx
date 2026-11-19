/**
 * Fundalul întregului site: o spălare rece sus (în fundalul .ambient) și o lumină caldă, slabă, în stânga.
 * Stă fix sub conținut, deci trece continuu prin toate secțiunile. Static: fără stele, grilă sau parallax.
 * Stilurile sunt în globals.css (.ambient).
 */
export function Ambient() {
  return (
    <div aria-hidden="true" className="ambient">
      <div className="ambient-glow" />
    </div>
  )
}
