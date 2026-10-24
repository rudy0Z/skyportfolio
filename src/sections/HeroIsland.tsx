interface HeroIslandProps {
  scrollProgress: number; // 0 (at rest, hero surface) to 1 (fully lifted/revealed)
  showLayerA?: boolean;
  showLayerB?: boolean;
  wireframe?: boolean;
}

export function HeroIsland({
  scrollProgress,
  showLayerA = true,
  showLayerB = true,
  wireframe = false,
}: HeroIslandProps) {
  // Parallax transforms:
  // As scrollProgress increases, the island lifts upward and tilts slightly
  const p = Math.max(0, Math.min(1, scrollProgress));
  const liftY = -p * 50; // Balanced vertical lift combined with CSS camera pull-back
  const thrusterFlameScale = 0.8 + p * 0.7; // Thruster flames flare as scroll pushes
  const mechPulse = 0.9 + Math.sin(p * Math.PI) * 0.3;

  return (
    <div className="hero-island-container relative w-full h-full flex items-center justify-center overflow-visible select-none pointer-events-none">
      <svg
        viewBox="0 0 1600 1000"
        className="w-full h-auto max-h-[92vh] overflow-visible drop-shadow-[0_24px_48px_rgba(0,0,0,0.4)]"
      >
        <defs>
          {/* Gradients for Rock Strata & Geological Depth */}
          <linearGradient id="strata1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#433e38" />
            <stop offset="40%" stopColor="#2c2a26" />
            <stop offset="100%" stopColor="#1a1917" />
          </linearGradient>
          <linearGradient id="strata2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#544e45" />
            <stop offset="100%" stopColor="#252320" />
          </linearGradient>

          {/* Prairie Grass Gradient */}
          <linearGradient id="meadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#869f68" />
            <stop offset="45%" stopColor="#5d7249" />
            <stop offset="100%" stopColor="#3d4c30" />
          </linearGradient>

          {/* Rocket Thruster Flame Gradient (Industrial Plasma) */}
          <linearGradient id="thrusterFire" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="20%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#f97316" stopOpacity="0.8" />
            <stop offset="90%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>

          {/* Iron Man Repulsor Beam Gradient */}
          <radialGradient id="repulsorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#67e8f9" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#0284c7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>

          {/* Thruster exhaust smoke blur */}
          <filter id="exhaustBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Global Group with Scroll Elevation Lift */}
        <g
          transform={`translate(0, ${liftY})`}
          stroke={wireframe ? "#00ffcc" : "none"}
          strokeWidth={wireframe ? 1 : 0}
          strokeDasharray={wireframe ? "3 3" : "none"}
        >
          {/* ============================================================== */}
          {/* LAYER B: UNDERSIDE KEEL, ROOTS, ROCKET THRUSTERS & IRON MAN    */}
          {/* ============================================================== */}
          {showLayerB && (
            <g id="layer-b-keel" className="transition-opacity duration-300">
              {/* Rock Strata Base Mass */}
              <path
                d="M 120 440
                   C 180 540, 260 620, 360 680
                   C 460 740, 560 790, 680 840
                   C 740 865, 780 885, 800 900
                   C 820 885, 860 865, 920 840
                   C 1040 790, 1140 740, 1240 680
                   C 1340 620, 1420 540, 1480 440
                   Z"
                fill={wireframe ? "none" : "url(#strata1)"}
              />

              {/* Layered Geological Crags & Fault Lines */}
              <path
                d="M 220 480
                   C 320 570, 480 650, 640 720
                   C 730 760, 770 790, 800 820
                   C 830 790, 870 760, 960 720
                   C 1120 650, 1280 570, 1380 480
                   C 1260 520, 1100 580, 960 610
                   C 800 640, 640 610, 220 480 Z"
                fill={wireframe ? "none" : "url(#strata2)"}
                opacity="0.8"
              />

              <path
                d="M 340 540
                   C 480 620, 650 710, 800 750
                   C 950 710, 1120 620, 1260 540
                   C 1100 600, 950 630, 800 630
                   C 650 630, 500 600, 340 540 Z"
                fill={wireframe ? "none" : "#1c1b18"}
                opacity="0.9"
              />

              {/* Hanging Roots Clusters */}
              <g stroke="#3a342c" strokeWidth="2.5" strokeLinecap="round" fill="none">
                {/* Left Root Cluster */}
                <path d="M 380 650 Q 370 720, 350 780 T 360 830" />
                <path d="M 420 670 Q 430 740, 410 810 T 425 870" />
                <path d="M 460 690 Q 480 770, 470 840" />

                {/* Right Root Cluster */}
                <path d="M 1220 650 Q 1230 720, 1250 780 T 1240 830" />
                <path d="M 1180 670 Q 1170 740, 1190 810 T 1175 870" />
                <path d="M 1140 690 Q 1120 770, 1130 840" />

                {/* Center Root Tendrils near Keel */}
                <path d="M 720 810 Q 700 870, 715 920" />
                <path d="M 880 810 Q 900 870, 885 920" />
              </g>

              {/* ── INDUSTRIAL ROCKET THRUSTERS (LEFT & RIGHT GIMBALS) ──────── */}
              {/* Left Rocket Thruster Unit */}
              <g id="left-thruster" transform="translate(480, 710)">
                {/* Steel Gimbal Mount Bracket */}
                <polygon points="-25,-20 25,-20 20,10 -20,10" fill="#2d3748" stroke="#4a5568" strokeWidth="1.5" />
                {/* Bell Nozzle */}
                <path d="M -20 10 L 20 10 L 32 60 L -32 60 Z" fill="#1a202c" stroke="#718096" strokeWidth="2" />
                {/* Nozzle Cooling Ribs */}
                <line x1="-24" y1="25" x2="24" y2="25" stroke="#e2e8f0" strokeWidth="1" opacity="0.4" />
                <line x1="-28" y1="42" x2="28" y2="42" stroke="#e2e8f0" strokeWidth="1" opacity="0.4" />

                {/* Blasting Downward Flame Exhaust Plume */}
                <g transform={`scale(1, ${thrusterFlameScale})`}>
                  <polygon
                    points="0,60 -36,180 0,260 36,180"
                    fill="url(#thrusterFire)"
                    filter="url(#exhaustBlur)"
                  />
                  <polygon points="0,60 -18,140 0,190 18,140" fill="#ffffff" opacity="0.9" />
                </g>
              </g>

              {/* Right Rocket Thruster Unit */}
              <g id="right-thruster" transform="translate(1120, 710)">
                {/* Steel Gimbal Mount Bracket */}
                <polygon points="-25,-20 25,-20 20,10 -20,10" fill="#2d3748" stroke="#4a5568" strokeWidth="1.5" />
                {/* Bell Nozzle */}
                <path d="M -20 10 L 20 10 L 32 60 L -32 60 Z" fill="#1a202c" stroke="#718096" strokeWidth="2" />
                {/* Nozzle Cooling Ribs */}
                <line x1="-24" y1="25" x2="24" y2="25" stroke="#e2e8f0" strokeWidth="1" opacity="0.4" />
                <line x1="-28" y1="42" x2="28" y2="42" stroke="#e2e8f0" strokeWidth="1" opacity="0.4" />

                {/* Blasting Downward Flame Exhaust Plume */}
                <g transform={`scale(1, ${thrusterFlameScale})`}>
                  <polygon
                    points="0,60 -36,180 0,260 36,180"
                    fill="url(#thrusterFire)"
                    filter="url(#exhaustBlur)"
                  />
                  <polygon points="0,60 -18,140 0,190 18,140" fill="#ffffff" opacity="0.9" />
                </g>
              </g>

              {/* ── CENTRAL APEX: IRON MAN / MECH SUIT EXOSKELETON ────────── */}
              {/* Mounted at the very keel (x=800, y=900) thrusting the island upward */}
              <g id="iron-man-apex" transform="translate(800, 895)">
                {/* Arc Reactor & Repulsor Blast Aura */}
                <circle cx="0" cy="30" r="60" fill="url(#repulsorGlow)" opacity={mechPulse} />

                {/* Exoskeleton Mech Helmet & Head */}
                <ellipse cx="0" cy="-22" rx="9" ry="11" fill="#b91c1c" stroke="#f59e0b" strokeWidth="1.5" />
                <rect x="-6" y="-24" width="12" height="3" rx="1.5" fill="#38bdf8" />

                {/* Armor Torso & Arc Reactor Chest */}
                <polygon points="-16,-10 16,-10 12,18 -12,18" fill="#991b1b" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="0" cy="2" r="5" fill="#ffffff" stroke="#38bdf8" strokeWidth="2" />

                {/* Shoulders & Arms Thrusting Downward / Inverted Flight */}
                {/* Left Arm & Repulsor Palm */}
                <path d="M -16 -6 L -28 12 L -24 32" stroke="#b91c1c" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                <circle cx="-24" cy="34" r="4" fill="#38bdf8" />
                <line x1="-24" y1="36" x2="-28" y2="120" stroke="#38bdf8" strokeWidth="3" opacity="0.8" />

                {/* Right Arm & Repulsor Palm */}
                <path d="M 16 -6 L 28 12 L 24 32" stroke="#b91c1c" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                <circle cx="24" cy="34" r="4" fill="#38bdf8" />
                <line x1="24" y1="36" x2="28" y2="120" stroke="#38bdf8" strokeWidth="3" opacity="0.8" />

                {/* Legs & Boot Jet Thrusters */}
                <path d="M -8 18 L -12 45 L -10 60" stroke="#991b1b" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M 8 18 L 12 45 L 10 60" stroke="#991b1b" strokeWidth="5" strokeLinecap="round" fill="none" />

                {/* Boot Repulsor Core Jets */}
                <g transform={`scale(1, ${thrusterFlameScale})`}>
                  <line x1="-10" y1="62" x2="-14" y2="180" stroke="#00f0ff" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="10" y1="62" x2="14" y2="180" stroke="#00f0ff" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="-10" y1="62" x2="-14" y2="140" stroke="#ffffff" strokeWidth="2" />
                  <line x1="10" y1="62" x2="14" y2="140" stroke="#ffffff" strokeWidth="2" />
                </g>
              </g>
            </g>
          )}

          {/* ============================================================== */}
          {/* LAYER A: TOP MEADOW SURFACE, GRASSES, DESK, LAPTOP & DESIGNER */}
          {/* ============================================================== */}
          {showLayerA && (
            <g id="layer-a-meadow">
              {/* Prairie Knoll Terrain Surface */}
              <path
                d="M -40 440
                   C 180 435, 380 420, 600 425
                   C 720 428, 880 428, 1000 424
                   C 1220 420, 1420 435, 1640 440
                   L 1640 480
                   C 1420 490, 1220 500, 1000 505
                   C 880 508, 720 508, 600 505
                   C 380 500, 180 490, -40 480 Z"
                fill={wireframe ? "none" : "url(#meadowGradient)"}
              />

              {/* Prairie Grass Blades & Wildflower Stems */}
              <g stroke="#a3b889" strokeWidth="1.75" strokeLinecap="round" opacity="0.85">
                {/* Grass tufts across the ridge */}
                <path d="M 480 425 Q 485 400, 490 380" />
                <path d="M 485 425 Q 492 405, 502 385" />
                <path d="M 495 425 Q 490 405, 485 390" />

                <path d="M 620 426 Q 628 402, 635 382" />
                <path d="M 628 426 Q 635 408, 645 388" />

                <path d="M 980 424 Q 975 400, 970 380" />
                <path d="M 988 424 Q 995 405, 1002 385" />

                <path d="M 1120 428 Q 1125 405, 1135 385" />
                <path d="M 1130 428 Q 1138 410, 1148 392" />
              </g>

              {/* Wildflower Petal Accents */}
              <circle cx="490" cy="378" r="3" fill="#f43f5e" />
              <circle cx="503" cy="384" r="2.5" fill="#fbbf24" />
              <circle cx="636" cy="380" r="3" fill="#38bdf8" />
              <circle cx="970" cy="378" r="3" fill="#f43f5e" />
              <circle cx="1136" cy="383" r="2.5" fill="#fbbf24" />

              {/* ── VINTAGE DESK, LAPTOP & SEATED DESIGNER ───────────────── */}
              {/* Placed gracefully at center ridge (x=800, y=425) */}
              <g id="designer-station" transform="translate(800, 425)">
                {/* Vintage Solid Wooden Work Desk */}
                {/* Tabletop */}
                <rect x="-90" y="-85" width="180" height="9" rx="2" fill="#5c4033" stroke="#3e2723" strokeWidth="1.5" />
                {/* Desk Legs (Trestle style) */}
                <line x1="-75" y1="-76" x2="-80" y2="0" stroke="#4a3525" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="75" y1="-76" x2="80" y2="0" stroke="#4a3525" strokeWidth="4.5" strokeLinecap="round" />
                {/* Leg Crossbar */}
                <line x1="-78" y1="-35" x2="78" y2="-35" stroke="#3e2723" strokeWidth="2.5" />

                {/* Brass Architect Lamp */}
                <g transform="translate(-60, -85)">
                  <line x1="0" y1="0" x2="-8" y2="-32" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="-8" y1="-32" x2="10" y2="-48" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 6 -52 L 18 -46 L 14 -40 Z" fill="#b8860b" />
                  {/* Warm light cone */}
                  <polygon points="12,-43 45,-10 0,-10" fill="#fef08a" opacity="0.15" />
                </g>

                {/* Ceramic Coffee Mug */}
                <rect x="-35" y="-95" width="7" height="10" rx="1.5" fill="#f1f5f9" />

                {/* Open Modern Laptop */}
                <g transform="translate(-15, -85)">
                  {/* Laptop Base */}
                  <rect x="0" y="-2" width="38" height="3" rx="1" fill="#94a3b8" />
                  {/* Laptop Screen Tilted Back */}
                  <polygon points="4,-2 34,-2 38,-30 8,-30" fill="#334155" stroke="#64748b" strokeWidth="1" />
                  {/* Glowing Display */}
                  <polygon points="6,-3 32,-3 36,-28 10,-28" fill="#e0f2fe" opacity="0.9" />
                  {/* Code / Radar lines on screen */}
                  <line x1="12" y1="-23" x2="28" y2="-23" stroke="#0284c7" strokeWidth="1.5" />
                  <line x1="10" y1="-17" x2="24" y2="-17" stroke="#0284c7" strokeWidth="1.5" />
                  <line x1="8" y1="-11" x2="30" y2="-11" stroke="#0284c7" strokeWidth="1.5" />
                </g>

                {/* Studio Work Chair */}
                <rect x="30" y="-72" width="28" height="6" rx="2" fill="#1e293b" />
                <rect x="52" y="-105" width="6" height="35" rx="2" fill="#1e293b" />
                <line x1="44" y1="-66" x2="44" y2="0" stroke="#0f172a" strokeWidth="4" />

                {/* Seated Designer Figure */}
                <g id="designer-figure" transform="translate(42, -90)">
                  {/* Head & Thoughtful Posture */}
                  <circle cx="-5" cy="-38" r="9" fill="#e2e8f0" />
                  {/* Hair / Cap */}
                  <path d="M -15 -42 Q -5 -50, 4 -40 Z" fill="#0f172a" />
                  {/* Torso (Jacket) */}
                  <path d="M -12 -28 C -14 -12, -4 0, 8 18" stroke="#334155" strokeWidth="13" strokeLinecap="round" fill="none" />
                  {/* Arm Resting on Table towards Laptop keyboard */}
                  <path d="M -10 -22 Q -30 -12, -45 5" stroke="#334155" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  {/* Hand on Trackpad */}
                  <circle cx="-47" cy="5" r="3" fill="#cbd5e1" />
                  {/* Crossed Legs under desk */}
                  <path d="M 5 18 L 10 50 L -15 90" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none" />
                </g>
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
