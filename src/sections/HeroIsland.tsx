"use client"

import { useRef } from "react"
import { getLight, type LightModel } from "@/lib/lighting"
import { useSkyTime } from "@/lib/useTimeOfDay"
import GlimmerVale from "@/components/originkit/GlimmerVale"
import Aetherglint from "@/components/originkit/Aetherglint"
import BluebellPass from "@/components/originkit/BluebellPass"
import BloomingFlower from "@/components/originkit/BloomingFlower"
import MoonlitPetals from "@/components/originkit/MoonlitPetals"
import { oklch } from "@/lib/color"
/* ==========================================================================
   Interface: Preserve backward compatibility with Hero.tsx props
   ========================================================================== */

export interface HeroIslandProps {
  scrollProgress?: number // 0 (at rest) → 1 (fully scrolled down)
  scrollVelocity?: number // pixels/ms, signed (+ = down, - = up)
  showLayerA?: boolean    // Toggle meadow/video layer
  showLayerB?: boolean    // Toggle keel/thrusters layer
  wireframe?: boolean     // Debug mode
  skyTime?: number        // Optional time override (defaults to useSkyTime())
  className?: string
}

/* ==========================================================================
   Performance Constants
   ========================================================================== */

const MAX_PARALLAX_Y = 280 // Maximum upward translation in pixels
const PARALLAX_SMOOTHING = 0.08 // Lerp factor for smooth parallax

/* ==========================================================================
   Component: HeroIsland
   ========================================================================== */

export function HeroIsland({
  scrollProgress = 0,
  scrollVelocity = 0,
  showLayerA = true,
  showLayerB = true,
  wireframe = false,
  skyTime = useSkyTime(),
  className = "",
}: HeroIslandProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  void scrollVelocity
  void wireframe
  
  // Parse OKLCH color strings for GlimmerVale integration
  const parseOklchForGlimmer = (oklchStr: string): string => {
    try {
      const match = oklchStr.match(/oklch\(([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/)
      if (!match) return "#FFFFFF"
      const [, l, c, h] = match
      const ok = { l: parseFloat(l), c: parseFloat(c), h: parseFloat(h) }
      return oklch(ok).toString()
    } catch {
      return "#FFFFFF"
    }
  }

  // Compute dynamic lighting model from skyTime
  const light = getLight(skyTime)

  return (
    <div
      ref={containerRef}
      className={`hero-island-root relative w-full h-full ${className}`}
      style={{
        transform: "perspective(1200px) rotateX(var(--tilt-y, 0deg)) rotateY(var(--tilt-x, 0deg))",
        transformStyle: "preserve-3d",
        transition: "transform 140ms ease-out",
      }}
    >
      {/* ============================================================
          LAYER 0.5: SOKOVIA KEEL & PLASMA THRUSTERS (z-index: 0)
          ============================================================ */}
      {showLayerB && (
        <SokoviaKeelThrusters
          daylight={light.daylight}
          plasmaGradient={parseOklchForGlimmer(light.palette.sunGlow)}
          scrollProgress={scrollProgress}
        />
      )}

      {/* ============================================================
          LAYER 1: CINEMATIC MEADOW HORIZON (Aetherglint + BluebellPass + GlimmerVale)
          z-index: 1 — Composited WebGL grass, carpet blooms & particle ridge
          ============================================================ */}
      {showLayerA && (
        <MeadowBackdrop scrollProgress={scrollProgress} light={light} />
      )}

      {/* ============================================================
          LAYER 2: CHARACTER VIDEO SLOT ON HILL CREST
          z-index: 2 — Obsidian glass frame with live relighting & portrait
          ============================================================ */}
      <VideoCharacterSlot
        visible={showLayerA}
        daylight={light.daylight}
        cloudKeyX={light.cloud.keyX}
        cloudKeyY={light.cloud.keyY}
        sunGlow={light.palette.sunGlow}
        scrollProgress={scrollProgress}
      />

      {/* ============================================================
          LAYER 3: MOONLIT PETALS CANOPY OVERHEAD
          z-index: 3 — Cherry blossom arch with drifting petals
          ============================================================ */}
      <MoonlitPetalsCanopy
        visible={showLayerA}
        daylight={light.daylight}
        petalColor={light.palette.cloudRim}
      />

      {/* ============================================================
          LAYER 4: FOREGROUND BLOOMING FLOWER (WebGL Shader)
          z-index: 4 — Originkit blooming flower integrated
          ============================================================ */}
      <ForegroundBloomingFlower visible={showLayerA} />
    </div>
  )
}

/* ==========================================================================
   Sub-Component: Sokovia Keel & Plasma Thrusters
   ============================================================ */

interface SokoviaKeelThrustersProps {
  daylight: number
  plasmaGradient: string
  scrollProgress?: number
}

const SokoviaKeelThrusters = (props: SokoviaKeelThrustersProps) => {
  const { plasmaGradient: _plasmaGradient, daylight, scrollProgress = 0 } = props
  const nightEmissive = 1 - daylight
  const bounceLightOpacity = nightEmissive * 0.35
  const parallaxY = lerp(0, -scrollProgress * (MAX_PARALLAX_Y * 0.7), PARALLAX_SMOOTHING)

  return (
    <div
      className="keel-thrusters-layer absolute inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        transform: `translateY(${parallaxY}px)`,
        willChange: "transform",
      }}
    >
      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-auto absolute bottom-0 left-0"
        style={{ height: "60vh" }}
      >
        <defs>
          {/* Rock strata multi-stop gradient */}
          <linearGradient id="strata-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={oklch({ l: 0.28, c: 0.04, h: 285 }).toString()} />
            <stop offset="40%" stopColor={oklch({ l: 0.2, c: 0.035, h: 288 }).toString()} />
            <stop offset="100%" stopColor={oklch({ l: 0.14, c: 0.03, h: 290 }).toString()} />
          </linearGradient>

          {/* Plasma thruster blur filter */}
          <filter id="thruster-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blurredFlame" />
            <feMerge>
              <feMergeNode in="blurredFlame" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Plasma corona glow */}
          <filter id="plasma-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Arc reactor gradient */}
          <radialGradient id="arc-reactor-gradient">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#0284c7" opacity="0.5" />
            <stop offset="100%" stopColor="#0284c7" opacity="0" />
          </radialGradient>
        </defs>

        {/* Craggy bedrock mass */}
        <path
          d="M 0 520 Q 320 580, 480 680 T 800 880 T 1120 680 T 1600 520 L 1600 1000 L 0 1000 Z"
          fill="url(#strata-gradient)"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        {/* Tectonic shelf layers */}
        <path
          d="M 180 560 Q 420 620, 580 720 T 800 900 T 1020 720 T 1420 560 L 1420 580 Q 1020 640, 800 740 T 580 740 T 180 580 Z"
          fill="rgba(45, 42, 38, 0.6)"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="0.5"
        />

        {/* Hanging ancient root tendrils */}
        <g stroke={oklch({ l: 0.22, c: 0.025, h: 290 }).toString()} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7">
          <path d="M 380 680 Q 370 740, 350 790 T 360 840" />
          <path d="M 420 700 Q 430 770, 410 830 T 425 880" />
          <path d="M 1220 680 Q 1230 740, 1250 790 T 1240 840" />
          <path d="M 1180 700 Q 1170 770, 1190 830 T 1175 880" />
          <path d="M 720 860 Q 700 910, 715 960" />
          <path d="M 880 860 Q 900 910, 885 960" />
        </g>

        {/* LEFT PLASMA THRUSTER */}
        <g transform="translate(480, 720)">
          {/* Steel gimbal mount */}
          <polygon
            points="-30,-25 30,-25 25,15 -25,15"
            fill="#2d3748"
            stroke={oklch({ l: 0.35, c: 0.04, h: 250 }).toString()}
            strokeWidth="2"
          />

          {/* Bell nozzle cooling ribs */}
          <line x1="-28" y1="30" x2="28" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1="-32" y1="50" x2="32" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

          {/* Primary plasma jet cone */}
          <g filter="url(#thruster-blur)">
            <polygon
              points="0,15 -42 180 0 320 42 180"
              fill={_plasmaGradient}
            />
            <polygon points="0,15 -22 160 0 240 22 160" fill="#ffffff" opacity="0.92" />
          </g>

          {/* Plasma corona heat shimmer */}
          <circle cx="0" cy="280" r="35" fill={_plasmaGradient} opacity="0.25" filter="url(#plasma-glow)" />
        </g>

        {/* RIGHT PLASMA THRUSTER */}
        <g transform="translate(1120, 720)">
          <polygon
            points="-30,-25 30,-25 25,15 -25,15"
            fill="#2d3748"
            stroke={oklch({ l: 0.35, c: 0.04, h: 250 }).toString()}
            strokeWidth="2"
          />
          <line x1="-28" y1="30" x2="28" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1="-32" y1="50" x2="32" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

          <g filter="url(#thruster-blur)">
            <polygon
              points="0,15 -42 180 0 320 42 180"
              fill={_plasmaGradient}
            />
            <polygon points="0,15 -22 160 0 240 22 160" fill="#ffffff" opacity="0.92" />
          </g>

          <circle cx="0" cy="280" r="35" fill={_plasmaGradient} opacity="0.25" filter="url(#plasma-glow)" />
        </g>

        {/* CENTRAL APEX: ARC REACTOR EXOSKELETON */}
        <g transform="translate(800, 900)">
          {/* Arc reactor aura */}
          <circle cx="0" cy="0" r="70" fill="url(#arc-reactor-gradient)" filter="url(#plasma-glow)" />

          {/* Stylized exoskeleton armor */}
          <ellipse
            cx="0"
            cy="-30"
            rx="12"
            ry="14"
            fill="#991b1b"
            stroke={oklch({ l: 0.6, c: 0.15, h: 350 }).toString()}
            strokeWidth="2"
          />
          <rect x="-8" y="-34" width="16" height="4" rx="2" fill="#38bdf8" opacity="0.8" />

          {/* Chest plate arc reactor core */}
          <circle cx="0" cy="5" r="6" fill="#ffffff" stroke="#38bdf8" strokeWidth="2.5" filter="url(#plasma-glow)" />

          {/* Arms thrusting downward */}
          <line x1="-18" y1="-10" x2="-24" y2="20" stroke="#991b1b" strokeWidth="6" strokeLinecap="round" />
          <line x1="18" y1="-10" x2="24" y2="20" stroke="#991b1b" strokeWidth="6" strokeLinecap="round" />
          <circle cx="-24" cy="22" r="5" fill="#38bdf8" filter="url(#plasma-glow)" />
          <circle cx="24" cy="22" r="5" fill="#38bdf8" filter="url(#plasma-glow)" />

          {/* Boot jets */}
          <line x1="-12" y1="25" x2="-16" y2="90" stroke="#00f0ff" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
          <line x1="12" y1="25" x2="16" y2="90" stroke="#00f0ff" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
        </g>

        {/* Upward bounce lighting from thrusters (night only) */}
        <rect
          x="0"
          y="700"
          width="1600"
          height="300"
          fill={_plasmaGradient}
          opacity={bounceLightOpacity}
          filter="url(#thruster-blur)"
        />
      </svg>
    </div>
  )
}

/* ==========================================================================
   Sub-Component: Meadow Backdrop with Aetherglint, BluebellPass & GlimmerVale
   ============================================================ */

interface MeadowBackdropProps {
  scrollProgress: number
  light: LightModel
}

function MeadowBackdrop({ scrollProgress, light }: MeadowBackdropProps) {
  const parallaxY = lerp(0, -scrollProgress * MAX_PARALLAX_Y, PARALLAX_SMOOTHING)

  return (
    <div
      className="meadow-backdrop-layer absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 1,
        transform: `translateY(${parallaxY}px)`,
        willChange: "transform",
        maskImage: "linear-gradient(to top, black 70%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to top, black 70%, transparent 100%)",
      }}
    >
      {/* ── Sublayer 1A: Aetherglint Prairie Grass & Rock Mounds ── */}
      <div
        className="aetherglint-meadow-layer absolute inset-0 transition-opacity duration-700 pointer-events-auto"
        style={{
          opacity: Math.max(0.4, light.daylight),
          mixBlendMode: "normal",
        }}
      >
        <Aetherglint
          speed={40}
          wind={85}
          density={65}
          scale={160}
          background="transparent"
          grassColor={light.palette.terrain}
          tipColor={light.palette.cloudRim}
          flowerColor={light.palette.sunGlow}
          advanced={{
            litColor: light.palette.cloudRim,
            hotColor: light.palette.sunGlow,
            shadowColor: light.stops.terrain.toString(),
            rootColor: light.stops.zenith.toString(),
            stemColor: light.palette.terrain,
            rockColor: "#2a2228",
            rockLitColor: light.palette.cloudRim,
            rockDarkColor: "#141014",
            glowColor: light.palette.sunGlow,
            glowAmount: 35,
            moundHeight: 6,
            bladeLength: 95,
            bladeWidth: 90,
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            minWidth: 0,
            minHeight: 0,
          }}
        />
      </div>

      {/* ── Sublayer 1B: BluebellPass Deep Night Horizon & Carpet Blooms ── */}
      <div
        className="bluebell-pass-layer absolute inset-0 transition-opacity duration-700 pointer-events-none"
        style={{
          opacity: Math.max(0.35, (1 - light.daylight) * 0.95),
          mixBlendMode: light.daylight < 0.5 ? "screen" : "soft-light",
        }}
      >
        <BluebellPass
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            aspectRatio: "auto",
          }}
          advanced={{
            skyTop: light.stops.zenith.toString(),
            skyMid: light.stops.mid.toString(),
            skyHorizon: light.stops.horizon.toString(),
            carpetCount: 2600,
            flowerCount: 340,
            grassCount: 1100,
            milkyOpacity: (1 - light.daylight) * 70,
            cloudOpacity: (1 - light.daylight) * 45,
            glowSize: 140,
            hazeColor: light.palette.cloudRim,
            grassLit: light.palette.terrain,
          }}
        />
      </div>

      {/* ── Sublayer 1C: GlimmerVale Particle Ridge Glitter & Glints ── */}
      <div
        className="glimmervale-ridge-layer absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.7,
          mixBlendMode: "screen",
        }}
      >
        <GlimmerVale
          speed={45}
          scale={90}
          density={70}
          sparkle={60}
          background="#000000"
          skyTop={light.stops.zenith.toString()}
          skyHorizon={light.stops.horizon.toString()}
          advanced={{
            crestColor: light.palette.cloudRim,
            slopeColor: light.palette.terrain,
            slopeDeep: light.stops.terrain.toString(),
            glowColor: light.palette.sunGlow,
            skyMid: light.stops.mid.toString(),
            pointSize: 90,
            midCount: 120,
            bokehCount: 90,
            grassCount: 280,
            glintCount: 25,
            seed: 42,
            hover: 50,
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  )
}

/* ==========================================================================
   Sub-Component: Video Character Slot with Live Relighting & Hill Crest Anchor
   ============================================================ */

interface VideoCharacterSlotProps {
  visible: boolean
  daylight: number
  cloudKeyX: number
  cloudKeyY: number
  sunGlow: string
  scrollProgress?: number
}

function VideoCharacterSlot({
  visible,
  daylight,
  cloudKeyX,
  cloudKeyY,
  sunGlow,
  scrollProgress = 0,
}: VideoCharacterSlotProps) {
  if (!visible) return null

  const nightEmissive = 1 - daylight

  // Calculate directional rim-light shadow offset
  const rimShadowX = cloudKeyX * 30
  const rimShadowY = cloudKeyY * 15
  const parallaxY = lerp(0, -scrollProgress * (MAX_PARALLAX_Y * 0.85), PARALLAX_SMOOTHING)

  return (
    <div
      className="video-slot-container absolute left-0 right-0 flex items-center justify-center pointer-events-none"
      style={{
        zIndex: 2,
        bottom: "24vh",
        transform: `translateY(${parallaxY}px)`,
        willChange: "transform, opacity",
      }}
    >
      <div
        data-slot="character-video-slot"
        className="relative aspect-[16/9] w-[min(80vw,900px)] max-h-[40vh]"
        style={{
          opacity: 1,
          willChange: "opacity",
        }}
      >
        {/* Obsidian Glass Frame */}
        <div
          className="absolute inset-0 rounded-xl backdrop-blur-2xl saturate-[1.35]"
          style={{
            backgroundColor: "rgba(16, 20, 36, 0.85)",
            border: `1px solid rgba(255, 255, 255, 0.14)`,
            boxShadow: `
              inset 0 1px 0 rgba(255, 255, 255, 0.18),
              0 24px 48px -12px rgba(0, 0, 0, 0.45),
              0 8px 16px -8px rgba(0, 0, 0, 0.35)
            `,
          }}
        />

        {/* Video / Visual Media Container with Live Relighting Filters */}
        <div
          className="absolute inset-2 rounded-lg overflow-hidden"
          style={{
            filter: `
              sepia(${0.25})
              saturate(${1.3})
              contrast(1.02)
              drop-shadow(${rimShadowX}px ${rimShadowY}px 20px ${sunGlow})
            `,
            backgroundColor: `rgba(245, 158, 11, ${nightEmissive * 0.15})`,
          }}
        >
          {/* Real visual media: portrait cutout on hill crest with studio ambient backing */}
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)`,
            }}
          >
            {/* Ambient solar backlight radial glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 45%, ${sunGlow} 0%, transparent 65%)`,
                opacity: 0.12 * daylight + 0.06,
              }}
            />

            {/* Optional video element with fallback error handling */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-0 transition-opacity duration-700"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            >
              <source src="/videos/designer-vintage-desk-loop.mp4" type="video/mp4" />
            </video>

            {/* Real visual media: /portrait-cutout.png */}
            <div className="relative z-10 flex flex-col items-center justify-end w-full h-full pt-3">
              <img
                src="/portrait-cutout.png"
                alt="Rudraksh Singh - Product Designer & Engineer"
                className="h-[88%] w-auto max-w-[85%] object-contain select-none pointer-events-none drop-shadow-[0_16px_28px_rgba(0,0,0,0.65)] transition-transform duration-500 hover:scale-[1.02]"
                loading="eager"
              />
            </div>

            {/* Delicate border highlights and telemetry badge */}
            <div className="absolute top-2.5 left-3 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE STUDIO FEED</span>
            </div>

            <div className="absolute bottom-2 right-3 z-20 text-[9px] font-mono text-white/40 tracking-wider uppercase">
              Altitude 01 · Knoll Crest
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
   Sub-Component: Moonlit Petals Canopy
   ============================================================ */

interface MoonlitPetalsCanopyProps {
  visible: boolean
  daylight: number
  petalColor: string
}

function MoonlitPetalsCanopy({ visible, daylight, petalColor }: MoonlitPetalsCanopyProps) {
  if (!visible) return null

  const dayProportion = daylight
  const nightShadowOpacity = (1 - daylight) * 0.25

  return (
    <div className="moonlit-petals-canopy-layer absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
      {/* Cherry Blossom Arch (Top Right Quadrant) */}
      <div
        className="absolute top-0 right-0 w-[60vw] h-[50vh]"
        style={{ opacity: 0.85 - dayProportion * 0.3 }}
      >
        <MoonlitPetals
          background="#000000"
          blossomColor={petalColor}
          speed={100}
          petals={180}
          wind={35}
          scale={95}
          direction="left"
          glow={60}
          advanced={{
            seed: 42,
            flowers: 12000,
            flowerSize: 7,
            clumpSize: 12,
            twigs: 35,
            crownReach: 110,
            branchColor: "#3E3539",
            highlight: 105,
            dofBlur: 3.5,
            petalColor: "#EDE6EA",
            petalSize: 110,
            fallSpeed: 95,
            nearShare: 18,
            drift: -4,
            wobble: 105,
            swayAmp: 9,
            swayPeriod: 3200,
            bokehFirst: 2500,
            bokehEvery: 6500,
            bokehSize: 9,
            bokehOpacity: 90,
            haloSize: 110,
            hazeColor: "#2F2A2C",
            hazeOpacity: 45,
            grain: 8,
            vignette: 40,
          }}
          style={{
            position: "absolute",
            top: "-10%",
            right: "-15%",
            filter: `drop-shadow(0 12px 24px rgba(0,0,0,${nightShadowOpacity}))`,
          }}
        />
      </div>

      {/* Soft procedural shadow cast across upper atmosphere */}
      <div
        className="absolute top-0 right-0 w-[70vw] h-[40vh]"
        style={{
          background: "radial-gradient(ellipse at 70% 0%, rgba(0,0,0,0.25) 0%, transparent 60%)",
          mixBlendMode: "multiply",
          opacity: 0.6 - dayProportion * 0.4,
        }}
      />
    </div>
  )
}

/* ==========================================================================
   Sub-Component: Foreground Blooming Flower
   ============================================================ */

interface ForegroundBloomingFlowerProps {
  visible: boolean
}

function ForegroundBloomingFlower({ visible }: ForegroundBloomingFlowerProps) {
  if (!visible) return null

  return (
    <div
      className="foreground-bloom-layer absolute inset-0 pointer-events-auto"
      style={{ zIndex: 4 }}
    >
      {/* Lower Right Cluster */}
      <div className="absolute bottom-0 right-0 w-[40vw] h-[35vh]">
        <BloomingFlower
          baseColor="#C4327E"
          stemColor="#2F7A4F"
          accentColor="#FFD98A"
          accentMix={100}
          density={100}
          dotSize={10}
          speed={50}
          distance={2820}
          tilt={66}
          bloom={{ closed: 0, stagger: 0.55 }}
          style={{ position: "absolute", bottom: 0, right: 0 }}
        />
      </div>
    </div>
  )
}

/* ==========================================================================
   Helper Functions
   ========================================================================== */

function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t
}

export default HeroIsland