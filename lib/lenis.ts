import type Lenis from 'lenis'

/**
 * Instanța Lenis activă (una singură, creată de components/layout/smooth-scroll.tsx).
 * E null pe server, la „mișcare redusă” și până la montare: celelalte componente trebuie să știe să se descurce fără ea
 * (de exemplu SmoothAnchors cade pe scrollIntoView).
 */
let current: Lenis | null = null

export const getLenis = () => current
export const setLenis = (lenis: Lenis | null) => {
  current = lenis
}
