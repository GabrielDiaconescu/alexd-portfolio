import type { ReactNode } from 'react'

/** Tranziția discretă la schimbarea paginii: animație CSS (fără JS), dezactivată la „mișcare redusă” (vezi globals.css). */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="animate-page-in">{children}</div>
}
