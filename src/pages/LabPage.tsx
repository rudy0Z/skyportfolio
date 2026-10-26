import { useState } from "react";
import { Link } from "@/router/Router";
import {
  StarfieldButton,
  EmberglowHorizon,
  GlimmerVale,
  Aetherglint,
} from "@/components/originkit";

type LabTab = "button" | "horizon" | "vale" | "aether";

export function LabPage() {
  const [activeTab, setActiveTab] = useState<LabTab>("button");

  // Starfield button interactive state
  const [btnLabel, setBtnLabel] = useState("INITIATE DOCKING");
  const [btnColor, setBtnColor] = useState("#FC731C");
  const [clickCount, setClickCount] = useState(0);

  // Emberglow horizon state
  const [horizonY, setHorizonY] = useState(80);
  const [sunXPos, setSunXPos] = useState(55);
  const [rippleSpeed, setRippleSpeed] = useState(60);

  return (
    <div className="lab-page min-h-screen w-full bg-[#07090e] text-white pt-24 pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Breadcrumb & Telemetry Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400 mb-1">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>LABORATORY // EXPERIMENTAL SHADERS &amp; ORIGINKIT VAULT</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Originkit Component Gallery
            </h1>
            <p className="font-sans text-sm text-white/50 mt-1 max-w-2xl">
              Isolated laboratory sandbox for high-fidelity WebGL2 shaders, procedural flora, and interactive cosmic button primitives. Kept separate from the main portfolio page.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/originkit-showcase.html"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 font-mono text-[11px] transition-all flex items-center gap-1.5"
            >
              <span>↗</span>
              <span>Standalone HTML</span>
            </a>
            <Link
              href="/"
              className="px-4 py-1.5 rounded-lg border border-cyan-400/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 font-mono text-[11px] transition-all"
            >
              ← Back to Main Page
            </Link>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md mb-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("button")}
            className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "button"
                ? "bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>✦</span>
            <span>Starfield Button</span>
            <span className="text-[10px] opacity-70">(Motion + Canvas)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("horizon")}
            className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "horizon"
                ? "bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>🌅</span>
            <span>Emberglow Horizon</span>
            <span className="text-[10px] opacity-70">(Sunset Shader)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("vale")}
            className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "vale"
                ? "bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>🌼</span>
            <span>Glimmer Vale</span>
            <span className="text-[10px] opacity-70">(3D Daisy Ridges)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("aether")}
            className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "aether"
                ? "bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>🌾</span>
            <span>Aetherglint</span>
            <span className="text-[10px] opacity-70">(Prairie Grass Wind)</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: STARFIELD BUTTON SHOWCASE                               */}
        {/* ============================================================== */}
        {activeTab === "button" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-8 sm:p-12 flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden">
              <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-white/40">
                ACTIVE INTERACTIVE PREVIEW // HOVER &amp; CLICK
              </div>

              {/* Central Button Display */}
              <div className="flex flex-col items-center gap-6 z-10">
                <StarfieldButton
                  label={btnLabel}
                  glow={{ color: btnColor, size: 24, opacity: 100 }}
                  stroke={{ color: btnColor, size: 100, speed: 50, count: 1, thickness: 2 }}
                  pixel={{ color: btnColor, size: 4, density: 60, brightness: 100 }}
                  onClick={() => setClickCount((c) => c + 1)}
                  style={{ minWidth: 240, minHeight: 52 }}
                />

                <div className="font-mono text-xs text-white/50 flex items-center gap-2">
                  <span>Clicks registered:</span>
                  <span className="text-amber-400 font-bold">{clickCount}</span>
                </div>
              </div>

              {/* Sub-presets row */}
              <div className="mt-12 pt-8 border-t border-white/10 w-full flex flex-wrap items-center justify-center gap-4">
                <div className="font-mono text-[10px] uppercase text-white/40 w-full text-center mb-1">
                  ALTERNATIVE READY-TO-USE PRESETS
                </div>
                <StarfieldButton
                  label="ORBIT ROUTE"
                  glow={{ color: "#00F0FF", size: 18, opacity: 100 }}
                  stroke={{ color: "#00F0FF", size: 80, speed: 60, count: 2, thickness: 1.5 }}
                  pixel={{ color: "#00F0FF", size: 3, density: 50, brightness: 100 }}
                  style={{ minWidth: 160 }}
                />
                <StarfieldButton
                  label="NEBULA DUSK"
                  glow={{ color: "#A855F7", size: 20, opacity: 100 }}
                  stroke={{ color: "#A855F7", size: 90, speed: 40, count: 1, thickness: 2 }}
                  pixel={{ color: "#A855F7", size: 4, density: 70, brightness: 100 }}
                  style={{ minWidth: 160 }}
                />
                <StarfieldButton
                  label="EMERALD SIGNAL"
                  glow={{ color: "#10B981", size: 18, opacity: 100 }}
                  stroke={{ color: "#10B981", size: 85, speed: 70, count: 1, thickness: 2 }}
                  pixel={{ color: "#10B981", size: 3, density: 40, brightness: 100 }}
                  style={{ minWidth: 160 }}
                />
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
                  <span>⚙</span>
                  <span>Interactive Controls</span>
                </h3>

                <div className="space-y-5 font-mono text-xs">
                  <div>
                    <label className="block text-white/60 mb-1.5 uppercase text-[10px]">
                      Button Text Label
                    </label>
                    <input
                      type="text"
                      value={btnLabel}
                      onChange={(e) => setBtnLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1.5 uppercase text-[10px]">
                      Glow &amp; Beam Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { name: "Amber", hex: "#FC731C" },
                        { name: "Cyan", hex: "#00F0FF" },
                        { name: "Violet", hex: "#A855F7" },
                        { name: "Emerald", hex: "#10B981" },
                      ].map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setBtnColor(c.hex)}
                          className={`p-2 rounded border text-center transition-all ${
                            btnColor === c.hex
                              ? "border-white bg-white/20 text-white font-bold"
                              : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                          }`}
                        >
                          <div
                            className="h-3 w-3 rounded-full mx-auto mb-1"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-[9px] block">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 font-mono text-[10px] text-white/40 space-y-1">
                <div>ENGINE: Canvas Pixel Grid + Motion Path</div>
                <div>FRAME RATE: 60 FPS Target</div>
                <div>BEAM DIRECTION: Counter-Clockwise (CCW)</div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: EMBERGLOW HORIZON SHADER SHOWCASE                       */}
        {/* ============================================================== */}
        {activeTab === "horizon" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-black/80 overflow-hidden relative shadow-2xl">
              <div className="absolute top-4 left-4 z-20 font-mono text-[10px] uppercase tracking-widest text-amber-300 bg-black/60 px-3 py-1 rounded-full border border-amber-500/30 backdrop-blur-md">
                EMBERGLOW HORIZON // SUNSET &amp; DUSK SHADER (AMBERVESPER)
              </div>

              {/* WebGL2 AmberVesper / Emberglow Canvas */}
              <div className="w-full h-[540px] relative">
                <EmberglowHorizon
                  advanced={{
                    horizon: horizonY,
                    sunX: sunXPos,
                    rippleSpeed: rippleSpeed,
                    shimmer: 12,
                    heatWave: 10,
                  }}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              {/* Bottom Interactive HUD Bar */}
              <div className="p-4 bg-neutral-950/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-white/40 block text-[9px] uppercase">
                      Horizon Height ({horizonY}%)
                    </span>
                    <input
                      type="range"
                      min={50}
                      max={95}
                      value={horizonY}
                      onChange={(e) => setHorizonY(Number(e.target.value))}
                      className="w-28 accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <span className="text-white/40 block text-[9px] uppercase">
                      Sun X ({sunXPos}%)
                    </span>
                    <input
                      type="range"
                      min={10}
                      max={90}
                      value={sunXPos}
                      onChange={(e) => setSunXPos(Number(e.target.value))}
                      className="w-28 accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <span className="text-white/40 block text-[9px] uppercase">
                      Ripple Speed ({rippleSpeed})
                    </span>
                    <input
                      type="range"
                      min={10}
                      max={120}
                      value={rippleSpeed}
                      onChange={(e) => setRippleSpeed(Number(e.target.value))}
                      className="w-28 accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="text-[10px] text-white/50">
                  Move mouse over canvas to trigger interactive heatwave ripples
                </div>
              </div>
            </div>

            {/* Architectural note answering user question */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-5 text-amber-200/90 font-mono text-xs leading-relaxed">
              <span className="font-bold text-amber-400 block mb-1">
                ✦ ARCHITECTURAL INSIGHT — THE HORIZON GEOMETRY:
              </span>
              Notice why this horizon feels so atmospheric: the camera pitch sits at 114° with the horizon line fixed at 80% down the frame. The glowing sun core, red/peach atmospheric scatter, and tree silhouette ridge-line all meet right at the bottom edge. When you gaze through prairie wildflowers (like in the worm&apos;s-eye daisy reference), this low-angle horizon compression is what creates the emotional sunset glow!
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: GLIMMER VALE SHOWCASE                                   */}
        {/* ============================================================== */}
        {activeTab === "vale" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-black/80 overflow-hidden relative shadow-2xl">
              <div className="absolute top-4 left-4 z-20 font-mono text-[10px] uppercase tracking-widest text-violet-300 bg-black/60 px-3 py-1 rounded-full border border-violet-500/30 backdrop-blur-md">
                GLIMMER VALE // PROCEDURAL 3D TERRAIN RIDGES &amp; BIG DAISIES
              </div>

              {/* WebGL2 GlimmerVale Canvas */}
              <div className="w-full h-[540px] relative">
                <GlimmerVale style={{ width: "100%", height: "100%" }} />
              </div>

              <div className="p-4 bg-neutral-950/90 border-t border-white/10 flex items-center justify-between font-mono text-xs text-white/60">
                <span>Features: 72,000 Ridge Points · Procedural Big Daisies · Wind Sway · Chromatic Aberration Fringe</span>
                <span className="text-violet-400">WebGL2 Native</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: AETHERGLINT SHOWCASE                                    */}
        {/* ============================================================== */}
        {activeTab === "aether" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-black/80 overflow-hidden relative shadow-2xl">
              <div className="absolute top-4 left-4 z-20 font-mono text-[10px] uppercase tracking-widest text-emerald-300 bg-black/60 px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md">
                AETHERGLINT // PRAIRIE GRASS BLADES &amp; FLOWER STALKS WIND SIMULATION
              </div>

              {/* WebGL2 Aetherglint Canvas */}
              <div className="w-full h-[540px] relative">
                <Aetherglint style={{ width: "100%", height: "100%" }} />
              </div>

              <div className="p-4 bg-neutral-950/90 border-t border-white/10 flex items-center justify-between font-mono text-xs text-white/60">
                <span>Features: Vector Wind Field · Rock Meshes · Interactive Cursor Breeze · Dynamic Grass Stems</span>
                <span className="text-emerald-400">Interactive Cursor Follow</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
