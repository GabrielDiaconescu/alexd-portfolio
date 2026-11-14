import { ImageResponse } from 'next/og'

export const ogSize = { width: 1200, height: 630 }

/** Imaginea de previzualizare pentru linkuri (Open Graph), în stilul site-ului. */
export function renderOg({ eyebrow, title, footer, accent = '#ff6a3d' }: { eyebrow: string; title: string; footer: string; accent?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: '#05070d',
          color: '#f1ede4',
          backgroundImage: `radial-gradient(circle at 85% 20%, ${accent}33, transparent 55%)`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', color: '#a8a294' }}>
          <span>{eyebrow}</span>
          <span>Web Design · Development · Motion</span>
        </div>
        <div style={{ display: 'flex', fontSize: 84, lineHeight: 1.02, letterSpacing: -2, maxWidth: 980 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(241,237,228,0.2)', paddingTop: 28 }}>
          <span style={{ fontSize: 40 }}>
            Alex D<span style={{ color: '#ff6a3d' }}>.</span>
          </span>
          <span style={{ fontSize: 24, color: '#a8a294' }}>{footer}</span>
        </div>
      </div>
    ),
    ogSize,
  )
}
