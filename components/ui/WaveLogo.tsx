interface WaveLogoProps {
  size?: number;
}

export function WaveLogo({ size = 48 }: WaveLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="wl-bg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#1a3050" />
          <stop offset="100%" stopColor="#0c1a2e" />
        </linearGradient>
        <clipPath id="wl-clip">
          <rect width="48" height="48" rx="11" />
        </clipPath>
      </defs>

      {/* Dark navy background */}
      <rect width="48" height="48" rx="11" fill="url(#wl-bg)" />

      <g clipPath="url(#wl-clip)">
        {/*
          Wave body: a single thick stroke on a C-shaped bezier.
          The path sweeps from lower-right (tail), up the right side,
          arcs left across the top (crest back), down the left spine,
          and ends lower-left (base). The stroke width fills the wave
          band; the open center of the C reveals the dark background
          naturally — no hollow math needed.
        */}
        <path
          d="M 42 44
             C 46 36, 46 16, 40 10
             C 34 4, 22 2, 14 8
             C 6 14, 4 26, 6 36
             C 8 44, 16 50, 24 49"
          stroke="#3d7ec0"
          strokeWidth="13"
          strokeLinecap="round"
          fill="none"
        />

        {/*
          Wave face: a slightly narrower, lighter-blue stroke
          inset from the main wave. Painted on top so the outer
          edge of the main stroke stays as the darker body ring.
        */}
        <path
          d="M 40 43
             C 43 36, 43 18, 38 13
             C 33 8, 23 7, 17 13
             C 10 19, 9 29, 11 38
             C 13 45, 20 49, 27 48"
          stroke="#88c4ec"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/*
          Foam: a filled crescent blob at the breaking crest (top-right).
          It overhangs slightly beyond the stroke to give the curl effect.
        */}
        <path
          fill="white"
          d="M 38 8
             C 40 4, 45 4, 47 9
             C 49 14, 47 20, 44 22
             C 42 18, 41 13, 40 11
             C 39 8, 38 8, 38 8 Z"
        />

        {/* Small wisp above the main foam */}
        <path
          fill="white"
          opacity="0.72"
          d="M 35 6 C 37 3, 41 4, 42 8 C 40 5, 37 5, 35 6 Z"
        />

        {/* Spray droplets off the crest tip */}
        <circle cx="46" cy="9"  r="1.1"  fill="white" opacity="0.65" />
        <circle cx="47" cy="15" r="0.85" fill="white" opacity="0.5"  />
        <circle cx="44" cy="6"  r="0.75" fill="white" opacity="0.55" />
      </g>
    </svg>
  );
}
