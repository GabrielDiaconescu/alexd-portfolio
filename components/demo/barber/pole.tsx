/**
 * Stâlpul de frizerie, desenat în SVG, într-o vitrină arcuită. Dungile urcă la nesfârșit (CSS);
 * la „mișcare redusă” stau pe loc. Pur decorativ: aria-hidden.
 */
export function BarberPole({ className = '' }: { className?: string }) {
  const period = 44
  const stripes = Array.from({ length: 14 }, (_, i) => 30 + i * period)
  return (
    <svg viewBox="0 0 320 460" className={className} aria-hidden="true">
      <defs>
        <clipPath id="arch">
          <path d="M0 460V160A160 160 0 0 1 320 160V460Z" />
        </clipPath>
        <clipPath id="pole">
          <rect x="128" y="104" width="64" height="276" rx="6" />
        </clipPath>
        <linearGradient id="brass" x1="0" x2="1">
          <stop offset="0" stopColor="#7d6234" />
          <stop offset=".45" stopColor="#e3c88f" />
          <stop offset="1" stopColor="#8a6c3a" />
        </linearGradient>
        <linearGradient id="glass" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".35" />
          <stop offset=".3" stopColor="#fff" stopOpacity=".35" />
          <stop offset=".55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".4" />
        </linearGradient>
        <radialGradient id="glow" cx=".5" cy=".45" r=".6">
          <stop offset="0" stopColor="#b08a4a" stopOpacity=".35" />
          <stop offset="1" stopColor="#b08a4a" stopOpacity="0" />
        </radialGradient>
        <path id="arc" d="M34 168A126 126 0 0 1 286 168" />
      </defs>

      {/* Vitrina */}
      <g clipPath="url(#arch)">
        <rect width="320" height="460" fill="#211b17" />
        <rect width="320" height="460" fill="url(#glow)" />
        {/* Gresia de pe jos */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={i * 40} y="404" width="40" height="56" fill={i % 2 ? '#2b241f' : '#1a1512'} />
        ))}
      </g>
      <path d="M1 460V160A159 159 0 0 1 319 160V460" fill="none" stroke="#b08a4a" strokeWidth="2" />
      <path d="M14 460V164A146 146 0 0 1 306 164V460" fill="none" stroke="#b08a4a" strokeOpacity=".35" />

      {/* Textul de pe arc */}
      <text fill="#b08a4a" fontSize="12.5" letterSpacing="6" style={{ fontFamily: 'var(--font-archivo)', fontStretch: '75%', fontWeight: 600 }}>
        <textPath href="#arc" startOffset="50%" textAnchor="middle">
          BARBERSHOP · PITEȘTI
        </textPath>
      </text>

      {/* Stâlpul */}
      <rect x="138" y="378" width="44" height="14" rx="3" fill="url(#brass)" />
      <rect x="146" y="390" width="28" height="18" fill="url(#brass)" />
      <g clipPath="url(#pole)">
        <rect x="128" y="104" width="64" height="276" fill="#f3ede3" />
        <g className="barber-stripes">
          {stripes.map((y) => (
            <g key={y}>
              <polygon points={`128,${y + 40} 192,${y} 192,${y + 16} 128,${y + 56}`} fill="#7a1f1f" />
              <polygon points={`128,${y + 62} 192,${y + 22} 192,${y + 28} 128,${y + 68}`} fill="#1b1714" />
            </g>
          ))}
        </g>
        <rect x="128" y="104" width="64" height="276" fill="url(#glass)" />
      </g>
      <rect x="128" y="104" width="64" height="276" rx="6" fill="none" stroke="#000" strokeOpacity=".35" />
      <rect x="136" y="92" width="48" height="14" rx="3" fill="url(#brass)" />
      <ellipse cx="160" cy="84" rx="18" ry="14" fill="url(#brass)" />
    </svg>
  )
}
