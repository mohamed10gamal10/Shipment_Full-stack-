import { motion, useReducedMotion } from "framer-motion";

const ROUTE = "M70 350 C 170 350, 170 245, 280 235 S 420 150, 490 82";

// Hero picture: a route from Fayoum to Cairo with a truck driving along it.
export function HeroRoute() {
  const reduce = useReducedMotion();
  const font = { fontFamily: "var(--font-display)" };
  return (
    <svg viewBox="0 0 560 430" className="hero-art" role="img" aria-label="A truck driving along the route from Fayoum to Cairo">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#ffffff" strokeOpacity="0.07" />
        </pattern>
      </defs>
      <rect width="560" height="430" rx="28" fill="#0a2a33" />
      <rect width="560" height="430" rx="28" fill="url(#grid)" />

      {/* quiet side roads */}
      <path d="M0 120 C 120 140, 200 90, 330 130 S 500 200, 560 170" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="10" fill="none" />
      <path d="M130 430 C 150 330, 260 330, 300 430" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="8" fill="none" />

      {/* the route */}
      <path d={ROUTE} stroke="#ffffff" strokeOpacity="0.28" strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round" fill="none" />
      <motion.path
        d={ROUTE}
        stroke="#f5b700"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
      />

      {/* pins */}
      <g>
        <circle cx="70" cy="350" r="16" fill="#f5b700" />
        <circle cx="70" cy="350" r="6" fill="#0a2a33" />
        <text x="94" y="356" fill="#fff" fontSize="20" fontWeight="700" style={font}>Fayoum</text>
      </g>
      <g>
        <circle cx="490" cy="82" r="16" fill="#fff" />
        <circle cx="490" cy="82" r="6" fill="#0a2a33" />
        <text x="486" y="56" fill="#fff" fontSize="20" fontWeight="700" textAnchor="end" style={font}>Cairo</text>
      </g>

      {/* the truck */}
      <g>
        {!reduce && <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" path={ROUTE} />}
        <g transform={reduce ? "translate(280 235)" : undefined}>
          <rect x="-20" y="-11" width="24" height="17" rx="3" fill="#f5b700" />
          <rect x="6" y="-7" width="13" height="13" rx="3" fill="#ffffff" />
          <circle cx="-11" cy="8" r="4" fill="#0a2a33" stroke="#fff" strokeWidth="2" />
          <circle cx="11" cy="8" r="4" fill="#0a2a33" stroke="#fff" strokeWidth="2" />
        </g>
      </g>

      {/* parcels in the corner */}
      <g transform="translate(400 300)">
        <rect width="70" height="52" rx="6" fill="#f5b700" />
        <rect x="30" width="10" height="52" fill="#0a2a33" opacity="0.2" />
        <rect x="52" y="-34" width="52" height="36" rx="5" fill="#fff3cc" transform="translate(-16 0)" />
      </g>
    </svg>
  );
}

// Small isometric parcel used for empty states and the login side panel.
export function BoxArt({ size = 160 }) {
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 160 144" fill="none" aria-hidden="true">
      <ellipse cx="80" cy="130" rx="54" ry="9" fill="#0a2a33" opacity="0.08" />
      <path d="M80 18 L132 44 L80 70 L28 44 Z" fill="#ffd54d" />
      <path d="M28 44 L80 70 L80 126 L28 100 Z" fill="#d99e00" />
      <path d="M132 44 L80 70 L80 126 L132 100 Z" fill="#f5b700" />
      <path d="M54 31 L106 57" stroke="#0a2a33" strokeOpacity="0.2" strokeWidth="9" />
      <path d="M80 18 L132 44 L132 100 L80 126 L28 100 L28 44 Z" stroke="#0a2a33" strokeWidth="3" strokeLinejoin="round" />
      <path d="M28 44 L80 70 L132 44 M80 70 V126" stroke="#0a2a33" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? "logo--light" : ""}`}>
      <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill={light ? "#f5b700" : "#0a2a33"} />
        <path d="M14 24l18-9 18 9v18l-18 9-18-9z" fill={light ? "#0a2a33" : "#f5b700"} />
        <path d="M14 24l18 9 18-9M32 33v18" stroke={light ? "#f5b700" : "#0a2a33"} strokeWidth="3" fill="none" strokeLinejoin="round" />
      </svg>
      <span>Waybill</span>
    </span>
  );
}
