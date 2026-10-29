"use client";

import React, { useEffect, useRef, useState } from "react";
import { getLight, applyLight, type LightModel } from "@/lib/lighting";
import { useSkyTime } from "@/lib/useTimeOfDay";
import MoonlitPetals from "@/components/originkit/MoonlitPetals";
import { oklch } from "@/lib/color";

/* ==========================================================================
   Performance Constants & Physics
   ========================================================================== */

const INTERSECTION_THRESHOLD = 0.1; // Trigger when 10% visible
// const SCROLL_DAMPING = 0.92; // Smooth scroll velocity decay
const THRUSTER_VELOCITY_MULTIPLIER = 0.8; // Thruster flare intensity
const PARALLAX_SCALE_FACTOR = 0.45; // Island scale reduction on scroll
const MAX_PARALLAX_Y = 180; // Maximum upward translation in px

/* ==========================================================================
   Type Definitions
   ========================================================================== */

export interface HeroIslandProps {
  showLayerA?: boolean;
  showLayerB?: boolean;
  wireframe?: boolean;
  /** Active time of day driver (0–24 hours) – bound to ThermalSkyClock automatically */
  skyTime?: number;
  /** Scroll progress: 0 at rest → 1 fully scrolled down */
  scrollProgress: number;
  /** Scroll velocity (pixels/ms) for thruster flare effects */
  scrollVelocity?: number;
  /** Optional overlay opacity for the video slot (0-1) */
  videoSlotOpacity?: number;
  /** Callback when hero enters viewport */
  onEnterViewport?: () => void;
  /** Callback when hero leaves viewport */
  onExitViewport?: () => void;
  className?: string;
}

/* ==========================================================================
   Helper Functions
   ========================================================================== */

/** Clamp a value between min and max */
const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

/** Interpolate between two values using linear interpolation */
const lerp = (start: number, end: number, t: number): number => start * (1 - t) + end * t;

/* ==========================================================================
   Component: HeroIsland
   ========================================================================== */

export function HeroIsland({
  scrollProgress,
  scrollVelocity = 0,
  skyTime = useSkyTime(),
  videoSlotOpacity = 1,
  onEnterViewport,
  onExitViewport,
  className = "",
}: HeroIslandProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  const light = getLight(skyTime);
  const t = light.time;
  
  /* ------------------------------------------------------------------------
     Live Lighting Token Synchronization
     Write CSS custom properties once per frame
     ------------------------------------------------------------------------ */
  useEffect(() => {
    if (typeof document !== "undefined") {
      applyLight(light);
    }
  }, [light]);
  
  /* ------------------------------------------------------------------------
     IntersectionObserver Lifecycle Management
     Halt all heavy WebGL/Canvas loops when out of view
     ------------------------------------------------------------------------ */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > INTERSECTION_THRESHOLD;
        if (visible && !isInView) {
          setIsInView(true);
          onEnterViewport?.();
        } else if (!visible && isInView) {
          setIsInView(false);
          onExitViewport?.();
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] }
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isInView, onEnterViewport, onExitViewport]);
  
  /* ------------------------------------------------------------------------
     Parallax Physics Calculations (Shared Mutable Refs)
     Driven by scrollProgress and scrollVelocity without React re-renders
     ------------------------------------------------------------------------ */
  const paralaxY = useMemoParallax(scrollProgress, MAX_PARALLAX_Y, PARALLAX_SCALE_FACTOR);
  const thrusterScale = useMemoThrusterFlare(scrollVelocity, THRUSTER_VELOCITY_MULTIPLIER);
  const arcReactorPulse = useMemoArcReactorPulse(t);
  
  /* ------------------------------------------------------------------------
     Dynamic Material Gradients (OKLCH-driven)
     Generated from live sky palette
     ------------------------------------------------------------------------ */
  const meadowGradient = useMemoMeadowGradient(light.stops.terrain);
  const _rockStrataGradient = useMemoRockStrata(light.palette.terrain); void [_rockStrataGradient];
  const plasmaThrusterGradient = useMemoPlasmaGradient(light.palette.sunGlow);
  
  /* ------------------------------------------------------------------------
     Video Slot Relighting Filters
     Atmospheric tint + directional rim-light + night emissive glow
     ------------------------------------------------------------------------ */
  const videoFilterStyle = useMemoVideoRelightFilter(light);
  
  return (
    <div
      ref={containerRef}
      className={`hero-island-root relative w-full h-[300vh] overflow-hidden ${className}`}
      style={{ 
        willChange: "transform",
        contain: "layout style"
      }}
    >
      {/* Sticky Viewport Stage (100vh container) */}
      <div className="hero-stage sticky top-0 h-screen w-full overflow-hidden">
        {/* ====================================================================
            LAYER 0.5: SOKOVIA KEEL & PLASMA THRUSTERS (z-index: 0)
            Positioned beneath the meadow, revealed on scroll
            ==================================================================== */}
        <HeroKeelThrusters
          isVisible={isInView}
          parallaxY={paralaxY}
          thrusterScale={thrusterScale}
          arcReactorPulse={arcReactorPulse}
          plasmaGradient={plasmaThrusterGradient}
          daylight={light.daylight}
          
        />
        
        {/* ====================================================================
            LAYER 1: MEADOW BACKDROP & GENERATIVE FLOWERS (z-index: 1)
            Wide prairie horizon spanning edge-to-edge (128vw)
            ==================================================================== */}
        <MeadowBackdrop
          isVisible={isInView}
          parallaxY={paralaxY}
          gradient={meadowGradient}
          daylight={light.daylight}
          golden={light.golden}
          starOpacity={light.starOpacity}
        />
        
        {/* ====================================================================
            LAYER 2: CHARACTER VIDEO SLOT (z-index: 2)
            Masked responsive grid container on plateau center
            ==================================================================== */}
        <VideoCharacterSlot
          isVisible={isInView}
          parallaxY={paralaxY}
          opacity={videoSlotOpacity}
          filterStyle={videoFilterStyle}
          sceneTime={t}
        />
        
        {/* ====================================================================
            LAYER 3: MOONLIT PETALS CANOPY OVERHEAD (z-index: 3)
            Cherry blossom arch dropping drifting petals
            ==================================================================== */}
        <MoonlitPetalsCanopy
          isVisible={isInView}
          daylight={light.daylight}
          petalColor={light.palette.cloudRim}
        />
        
        {/* ====================================================================
            LAYER 4: FOREGROUND MACRO WILD FLOWERS (z-index: 4)
            Occluding base of desk, swaying on cursor hover
            ==================================================================== */}
        <ForegroundWildflowers
          isVisible={isInView}
          parallaxY={paralaxY}
          golden={light.golden}
          timestamp={t}
        />
      </div>
    </div>
  );
}

/* ==========================================================================
   Sub-Components
   ========================================================================== */

/**
 * LAYER 0.5: Sokovia Keel with Iron Man Plasma Thrusters
 * Subterranean rocky underside with reactive jet propulsion
 */
function HeroKeelThrusters({
  isVisible,
  parallaxY,
  thrusterScale,
  arcReactorPulse,
  plasmaGradient,
  daylight,
  terrainTint: _terrainTint,
}: {
  isVisible: boolean;
  parallaxY: number;
  thrusterScale: number;
  arcReactorPulse: number;
  plasmaGradient: string;
  daylight: number;
  terrainTint?: string;
}) {
  if (!isVisible) return null;
  
  const nightEmissive = 1 - daylight;
  const bounceLightOpacity = nightEmissive * 0.35;
  
  return (
    <div
      className="keel-thrusters-layer absolute inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        transform: `translateY(${parallaxY}px)`,
        transformOrigin: "center bottom",
        willChange: "transform",
      }}
    >
      {/* Subterranean Rock Strata SVG */}
      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-auto absolute bottom-0 left-0"
        style={{ height: "60vh" }}
      >
        <defs>
          {/* Multi-stop geological strata gradient */}
          <linearGradient id="strata-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={oklch({ l: 0.28, c: 0.04, h: 285 }).toString()} />
            <stop offset="40%" stopColor={oklch({ l: 0.2, c: 0.035, h: 288 }).toString()} />
            <stop offset="100%" stopColor={oklch({ l: 0.14, c: 0.03, h: 290 }).toString()} />
          </linearGradient>
          
          {/* Plasma thruster exhaust blur filter */}
          <filter id="thruster-exhaust-blur" x="-50%" y="-50%" width="200%" height="200%">
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
        </defs>
        
        {/* Craggy bedrock mass */}
        <path
          d="M 0 520
             Q 320 580, 480 680 T 800 880 T 1120 680 T 1600 520
             L 1600 1000 L 0 1000 Z"
          fill="url(#strata-gradient)"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
        
        {/* Tectonic shelf layers */}
        <path
          d="M 180 560
             Q 420 620, 580 720 T 800 900 T 1020 720 T 1420 560
             L 1420 580
             Q 1020 640, 800 740 T 580 740 T 180 580 Z"
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
        
        {/* ====================================================================
            IRON MAN PLASMA THRUSTERS (LEFT & RIGHT)
            Reactive flame cones driven by scroll velocity
            ==================================================================== */}
        <g id="plasma-thruster-system">
          {/* Left Thruster Jet */}
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
            
            {/* Primary plasma jet cone (scroll-velocity flare) */}
            <g filter="url(#thruster-exhaust-blur)">
              <polygon
                points="0,15 -42 180 0 320 42 180"
                fill={plasmaGradient}
                transform={`scale(1, ${thrusterScale})`}
              />
              <polygon points="0,15 -22 160 0 240 22 160" fill="#ffffff" opacity="0.92" />
            </g>
            
            {/* Plasma corona heat haze (displacement shimmer) */}
            <circle cx="0" cy="280" r="35" fill={plasmaGradient} opacity="0.25" filter="url(#plasma-glow)" />
          </g>
          
          {/* Right Thruster Jet */}
          <g transform="translate(1120, 720)">
            <polygon
              points="-30,-25 30,-25 25,15 -25,15"
              fill="#2d3748"
              stroke={oklch({ l: 0.35, c: 0.04, h: 250 }).toString()}
              strokeWidth="2"
            />
            <line x1="-28" y1="30" x2="28" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="-32" y1="50" x2="32" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            
            <g filter="url(#thruster-exhaust-blur)">
              <polygon
                points="0,15 -42 180 0 320 42 180"
                fill={plasmaGradient}
                transform={`scale(1, ${thrusterScale})`}
              />
              <polygon points="0,15 -22 160 0 240 22 160" fill="#ffffff" opacity="0.92" />
            </g>
            
            <circle cx="0" cy="280" r="35" fill={plasmaGradient} opacity="0.25" filter="url(#plasma-glow)" />
          </g>
          
          {/* ====================================================================
              CENTRAL APEX: ARC REACTOR & EXOSKELETON (Non-functional, purely aesthetic)
              Mounted at keel tip, pulses in sync with thermal wave
              ==================================================================== */}
          <g transform="translate(800, 900)">
            {/* Arc reactor pulsing aura */}
            <circle
              cx="0"
              cy="0"
              r="70"
              fill="url(#arc-reactor-gradient)"
              opacity={arcReactorPulse}
              filter="url(#plasma-glow)"
            />
            
            {/* Exoskeleton armor pieces (stylized representation) */}
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
        </g>
        
        {/* Upward bounce lighting from thrusters (night only) */}
        <rect
          x="0"
          y="700"
          width="1600"
          height="300"
          fill={plasmaGradient}
          opacity={bounceLightOpacity}
          filter="url(#thruster-exhaust-blur)"
        />
      </svg>
    </div>
  );
}

/**
 * LAYER 1: Meadow Backdrop & Generative Prairie
 * Wide horizon with procedural wildflower clusters
 */
function MeadowBackdrop({
  isVisible,
  parallaxY,
  gradient,
  daylight: _daylight,
  golden,
  starOpacity,
}: {
  isVisible: boolean;
  parallaxY: number;
  gradient: string;
  daylight: number;
  golden: number;
  starOpacity: number;
}) {
  if (!isVisible) return null;
  
  return (
    <div
      className="meadow-backdrop-layer absolute inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        transform: `translateY(${parallaxY}px) scale(${1 - parallaxY / 800})`,
        transformOrigin: "center bottom",
        willChange: "transform",
      }}
    >
      {/* Wide prairie horizon */}
      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMax slice"
        className="w-[128vw] absolute bottom-[-10%] left-[-14vw]"
        style={{ maxHeight: "65vh" }}
      >
        <defs>
          {/* Procedural grass gradient */}
          <linearGradient id="grass-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={oklch({ l: 0.58, c: 0.18, h: 125 })} />
            <stop offset="45%" stopColor={oklch({ l: 0.42, c: 0.22, h: 130 })} />
            <stop offset="100%" stopColor={oklch({ l: 0.28, c: 0.15, h: 135 })} />
          </linearGradient>
          
          {/* Stipple dust texture */}
          <filter id="stipple-dust">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        
        {/* Base prairie terrain */}
        <path
          d="M -100 400
             Q 320 390, 580 405 T 800 410 T 1020 405 T 1700 400
             L 1700 480
             Q 1020 490, 800 495 T 580 490 T -100 480 Z"
          fill={gradient}
          filter="url(#stipple-dust)"
        />
        
        {/* Grass blade silhouettes (animated sways via CSS keyframes) */}
        <g stroke="url(#grass-gradient)" strokeWidth="2" strokeLinecap="round" opacity="0.85">
          {[...Array(40)].map((_, i) => {
            const x = 200 + i * 32;
            const height = 25 + Math.random() * 35;
            const curve = (Math.random() - 0.5) * 20;
            return (
              <path
                key={i}
                d={`M ${x} 410 Q ${x + curve} ${410 - height}, ${x + curve * 0.5} ${410 - height * 0.8}`}
                style={{
                  animation: `grassSway ${2 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            );
          })}
        </g>
        
        {/* Wildflower clusters */}
        <g opacity="0.75">
          {[...Array(25)].map((_, i) => {
            const x = 250 + i * 55;
            const hue = 280 + Math.random() * 60; // rose-violet range
            
            const color = oklch({ l: 0.65, c: 0.12, h: hue }).toString();
            return (
              <circle
                key={i}
                cx={x}
                cy={405 - Math.random() * 20}
                r={2.5 + Math.random() * 2}
                fill={color}
              />
            );
          })}
        </g>
        
        {/* Dawn/dusk golden hour rim lighting on crest */}
        <path
          d="M -100 400 Q 320 390, 580 405 T 800 410 T 1020 405 T 1700 400"
          stroke="url(#golden-rim)"
          strokeWidth="3"
          strokeOpacity={golden * 0.4}
          fill="none"
        />
        
        <defs>
          <linearGradient id="golden-rim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={oklch({ l: 0.85, c: 0.18, h: 45 })} stopOpacity="0" />
            <stop offset="50%" stopColor={oklch({ l: 0.75, c: 0.22, h: 38 })} stopOpacity={golden * 0.6} />
            <stop offset="100%" stopColor={oklch({ l: 0.85, c: 0.18, h: 45 })} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Night sky sparkle overlay */}
      {starOpacity > 0.1 && (
        <div
          className="meadow-sparkles absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,${starOpacity * 0.4}) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            backgroundPosition: "center",
            opacity: starOpacity,
          }}
        />
      )}
    </div>
  );
}

/**
 * LAYER 2: Character Video Slot Container
 * Responsive masked grid for vintage desk loop playback
 */
function VideoCharacterSlot({
  isVisible,
  parallaxY,
  opacity,
  filterStyle,
  sceneTime,
}: {
  isVisible: boolean;
  parallaxY: number;
  opacity: number;
  filterStyle: React.CSSProperties;
  sceneTime: number;
}) {
  if (!isVisible) return null;
  
  return (
    <div
      className="video-slot-container absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        zIndex: 2,
        transform: `translateY(${parallaxY * 0.7}px)`,
        willChange: "transform",
      }}
    >
      {/* Responsive CSS Grid Slot Container */}
      <div
        data-slot="character-video-slot"
        className="relative aspect-[16/9] w-[min(80vw,900px)] max-h-[40vh]"
        style={{
          opacity,
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
        
        {/* Video Element Container with Live Relighting */}
        <div
          className="absolute inset-2 rounded-lg overflow-hidden"
          style={filterStyle}
        >
          {/* Place your high-res video here */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{
              filter: "contrast(1.05) saturate(1.1)",
            }}
          >
            {/* Replace with your actual video source */}
            <source src="/videos/designer-vintage-desk-loop.mp4" type="video/mp4" />
            {/* Fallback placeholder background */}
            <div
              className="absolute inset-0 bg-slate-800 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)`,
              }}
            >
              <p className="text-slate-400 text-sm font-mono">VIDEO SLLOT READY</p>
            </div>
          </video>
          
          {/* Laptop screen / lamp emissive glow overlay (night mode) */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-amber-400/20 via-transparent to-indigo-400/10"
            style={{
              opacity: (1 - sceneTime % 12 / 12) * 0.5,
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * LAYER 3: Moonlit Petals Canopy Overhead
 * Cherry blossom arch across top right viewport
 */
function MoonlitPetalsCanopy({
  isVisible,
  daylight,
  petalColor,
}: {
  isVisible: boolean;
  daylight: number;
  petalColor: string;
}) {
  if (!isVisible) return null;
  
  const nightShadowOpacity = (1 - daylight) * 0.25;
  const dayProportion = daylight;
  
  return (
    <div
      className="moonlit-petals-canopy-layer absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 3 }}
    >
      {/* Cherry Blossom Arch (Top Right Quadrant) */}
      <div
        className="absolute top-0 right-0 w-[60vw] h-[50vh]"
        style={{
          opacity: 0.85 - dayProportion * 0.3,
        }}
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
  );
}

/**
 * LAYER 4: Foreground Macro Wildflowers
 * Large stylized blooms occluding desk base, swaying on cursor
 */
function ForegroundWildflowers({
  isVisible,
  parallaxY,
  golden,
  timestamp,
}: {
  isVisible: boolean;
  parallaxY: number;
  golden: number;
  timestamp: number;
}) {
  if (!isVisible) return null;
  
  return (
    <div
      className="foreground-wildflowers-layer absolute inset-0 pointer-events-auto"
      style={{
        zIndex: 4,
        transform: `translateY(${parallaxY * 0.3}px)`,
        willChange: "transform",
      }}
    >
      {/* Cursor-responsive macro blooms (large SVG-style graphics) */}
      <div className="absolute bottom-0 left-0 w-full h-[35vh]">
        {/* Left cluster */}
        <div className="absolute bottom-0 left-0 w-[40vw] h-full flex items-end justify-start space-x-8">
          {[...Array(12)].map((_, i) => (
            <WildflowerBloom
              key={`left-${i}`}
              index={i}
              side="left"
              golden={golden}
              timestamp={timestamp}
              isHoverable={true}
            />
          ))}
        </div>
        
        {/* Right cluster */}
        <div className="absolute bottom-0 right-0 w-[40vw] h-full flex items-end justify-end space-x-10">
          {[...Array(10)].map((_, i) => (
            <WildflowerBloom
              key={`right-${i}`}
              index={i}
              side="right"
              golden={golden}
              timestamp={timestamp}
              isHoverable={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Individual stylized wildflower bloom component
 */
function WildflowerBloom({
  index,
  side: _side,
  golden,
  timestamp,
  isHoverable,
}: {
  index: number;
  side: "left" | "right";
  golden: number;
  timestamp: number;
  isHoverable: boolean;
}) {
  const baseHue = 280 + Math.random() * 70; // Rose to violet
  const saturation = 0.6 + Math.random() * 0.35;
  const lightness = 0.55 + Math.random() * 0.25;
  const sizeMult = 0.8 + Math.random() * 0.6;
  
  const [colors] = React.useState(() => ({
    stroke: oklch({ l: lightness, c: saturation * 0.3, h: baseHue }),
    fill: oklch({ l: lightness + 0.1, c: saturation, h: baseHue }),
  }));
  const { stroke: strokeColor, fill: fillColor } = colors;
  
  // Gentle sway animation based on timestamp
  const swayAngle = Math.sin(timestamp * 0.5 + index * 0.7) * 3;
  const petalOffset = Math.cos(timestamp * 0.8 + index * 1.1) * 2;
  
  return (
    <div
      className={`relative flex-shrink-0 transition-transform duration-200 ${
        isHoverable ? "cursor-pointer hover:scale-110" : ""
      }`}
      style={{
        width: "80px",
        height: `${120 * sizeMult}px`,
      }}
    >
      <svg
        viewBox="0 0 80 120"
        className="w-full h-full"
        style={{
          transform: `rotate(${swayAngle}deg) translateY(${petalOffset}px)`,
          transformOrigin: "bottom center",
        }}
      >
        {/* Stem */}
        <path
          d={`M 40 120 Q ${40 + Math.sin(index) * 10} ${120 - 60}, ${40 + Math.cos(index) * 8} ${120 - 100}`}
          stroke={oklch({ l: 0.35, c: 0.08, h: 125 })}
          strokeWidth="3"
          fill="none"
        />
        
        {/* Petals (stylized geometric representation) */}
        <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5">
          {[...Array(5)].map((_, i) => {
            const angle = (i / 5) * Math.PI * 2;
            const x = 40 + Math.cos(angle) * 25;
            const y = 70 + Math.sin(angle) * 20;
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx="12"
                ry="18"
                style={{
                  animation: `petalWiggle ${2 + Math.random()}s ease-in-out infinite`,
                  animationDelay: `${Math.random()}s`,
                }}
              />
            );
          })}
        </g>
        
        {/* Center pistil */}
        <circle cx="40" cy="70" r="6" fill="#fef08a" stroke="#f59e0b" strokeWidth="1" />
      </svg>
      
      {/* Golden hour backlighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${oklch({ l: 0.85, c: 0.15, h: 45 })} ${golden * 0.3}, transparent 60%)`,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}

/* ==========================================================================
   Custom Hooks (Memoization Utilities)
   ========================================================================== */

/** Parallax Y-offset calculation: smooth interpolation from scrollProgress */
function useMemoParallax(scrollProgress: number, maxY: number, _scaleFactor: number): number {
  const ref = useRef(0);
  const target = -scrollProgress * maxY;
  ref.current = lerp(ref.current, target, 0.08);
  return ref.current;
}

/** Thruster flame scale: flares based on scroll velocity */
function useMemoThrusterFlare(scrollVelocity: number, multiplier: number): number {
  const ref = useRef(1);
  const rawVelocity = Math.abs((scrollVelocity || 0) * 1000);
  const target = clamp(1 + rawVelocity * multiplier, 1, 2.2);
  ref.current = lerp(ref.current, target, 0.15);
  return ref.current;
}

/** Arc reactor pulse: driven by thermal wave sine */
function useMemoArcReactorPulse(time: number): number {
  const ref = useRef(1);
  const target = 0.7 + Math.sin(time * 3.5) * 0.3;
  ref.current = lerp(ref.current, target, 0.1);
  return ref.current;
}

/** Generate meadow gradient from OKLCH terrain color */
function useMemoMeadowGradient(terrain: any): string {
  const lBase = (terrain?.l ?? 0.5) * 0.8;
  const cBase = (terrain?.c ?? 0.15) * 1.2;
  const hBase = terrain?.h ?? 120;
  return "linear-gradient(to bottom, " +
    oklch({ l: lBase + 0.2, c: cBase * 0.6, h: hBase }) + ", " +
    oklch({ l: lBase, c: cBase, h: hBase }) + ", " +
    oklch({ l: lBase - 0.1, c: cBase * 1.1, h: hBase + 5 }) + ")";
}

/** Generate rock strata gradient from terrain palette */
function useMemoRockStrata(terrain: any): string {
  const l = terrain?.l ?? 0.3;
  const c = terrain?.c ?? 0.05;
  const h = terrain?.h ?? 45;
  return "linear-gradient(to bottom, " +
    oklch({ l: l + 0.08, c: c * 0.9, h: h - 3 }) + ", " +
    oklch({ l: l - 0.05, c: c * 0.85, h: h + 2 }) + ", " +
    oklch({ l: l - 0.12, c: c * 0.8, h: h + 5 }) + ")";
}

/** Generate plasma thruster gradient from sun glow color */
function useMemoPlasmaGradient(sunGlow: any): string {
  const h = Math.round(sunGlow?.h ?? 190);
  return "url(#thruster-fire-gradient-" + h + ")";
}

/** Generate video relight filters based on lighting model */
function useMemoVideoRelightFilter(light: LightModel): React.CSSProperties {
  const { palette, grade, cloud, daylight } = light;
  const nightEmissive = 1 - daylight;
  
  return {
    // Atmospheric tint multiplication and night emissive balance
    filter: `
      sepia(${grade.tintAmount * 0.25})
      saturate(${1 + grade.tintAmount * 0.3})
      contrast(${1.02 - nightEmissive * 0.08})
      brightness(${0.88 + daylight * 0.24})
      drop-shadow(${cloud.keyX * 40}px ${cloud.keyY * 20}px ${24 + Math.abs(cloud.keyX) * 15}px ${palette.sunGlow})`,
    mixBlendMode: "screen" as const,
  };
}

/* ==========================================================================
   Tailwind Keyframe Extensions (Add to global CSS or tailwind.config.js)
   ========================================================================== */
/*
keyframes: {
  grassSway: {
    "0%, 100%": { transform: "rotate(-2deg)" },
    "50%": { transform: "rotate(2deg)" },
  },
  petalWiggle: {
    "0%, 100%": { transform: "skewX(-3deg)" },
    "50%": { transform: "skewX(3deg)" },
  },
}
*/

/* ==========================================================================
   Export Convenience Wrappers
   ========================================================================== */

export function HeroIslandAnalog(props: Omit<HeroIslandProps, "skyTime">) {
  return <HeroIsland {...props} skyTime={useSkyTime()} />;
}

export default HeroIsland;
