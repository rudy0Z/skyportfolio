"use client";

import { useEffect, useState } from "react";
import { RouterProvider, useRoute } from "@/router/Router";
import { CodedSky, type SkyVariant } from "@/sky/CodedSky";
import { SolarChronometer, type HudStyle } from "@/sky/hud/SolarChronometer";
import { Header } from "@/components/Header";
import { TypeGardenLoader } from "@/components/TypeGardenLoader";
import { CelestialNight } from "@/components/CelestialNight";
import { ButterflyCursor } from "@/components/ButterflyCursor";
import { DevMenu } from "@/components/DevMenu";
import { type MusicWidgetStyle } from "@/components/music/MusicWidgetHost";

// Page & Section Components
import { Hero } from "@/sections/Hero";
import { StackingProjects } from "@/sections/StackingProjects";
import { ExcavationCraterFooter } from "@/sections/ExcavationCraterFooter";
import { AboutPage } from "@/pages/AboutPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { JournalPage } from "@/pages/JournalPage";
import { ResumePage } from "@/pages/ResumePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { CaseStudyPage } from "@/pages/CaseStudyPage";
import { setSkyTime } from "@/lib/useTimeOfDay";

const VARIANT_KEY = "sky-variant";
const VARIANTS: SkyVariant[] = ["volumetric", "dither", "vector"];

function initialVariant(): SkyVariant {
  if (typeof window === "undefined") return "volumetric";
  const url = new URLSearchParams(window.location.search).get("variant");
  if (url === "vector" || url === "dither" || url === "volumetric") return url;
  const stored = window.localStorage.getItem(VARIANT_KEY);
  if (stored === "vector" || stored === "dither" || stored === "volumetric") return stored;
  return "volumetric";
}

function PortfolioContent() {
  const { path } = useRoute();
  const [variant, setVariant] = useState<SkyVariant>(initialVariant);
  const [hudOpen, setHudOpen] = useState(true);
  const [hudStyle, setHudStyle] = useState<HudStyle>("pinui");
  const [musicStyle, setMusicStyle] = useState<MusicWidgetStyle>("pinui");
  const [hasLoadedGarden, setHasLoadedGarden] = useState(false);
  const [fullscreenGarden, setFullscreenGarden] = useState(false);

  // Dev Menu feature flags
  const [showLayerA, setShowLayerA] = useState(true);
  const [showLayerB, setShowLayerB] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [forceAurora, setForceAurora] = useState(false);
  const [forceNight, setForceNight] = useState(false);
  const [butterflyEnabled, setButterflyEnabled] = useState(true);

  useEffect(() => {
    window.localStorage.setItem(VARIANT_KEY, variant);
    const params = new URLSearchParams(window.location.search);
    params.set("variant", variant);
    const t = params.get("t");
    window.history.replaceState(null, "", `${window.location.pathname}?${params}${window.location.hash}`);
    if (t) {
      const [h, m] = t.split(":").map(Number);
      if (Number.isFinite(h)) setSkyTime(h + (m || 0) / 60, "manual");
    }
  }, [variant]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === "1") setVariant("volumetric");
      if (e.key === "2") setVariant("dither");
      if (e.key === "3") setVariant("vector");
      if (e.key === "[") setHudOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* ── Persistent Raymarched / Halftone Sky Engine ──────────────── */}
      <div className="sky-fixed">
        <CodedSky variant={variant} />
      </div>

      {/* ── Celestial Night Pack (Shooting Stars & Aurora) ──────────── */}
      <CelestialNight forceAurora={forceAurora} forceNight={forceNight} />

      {/* ── Garden Butterfly Cursor Trail ───────────────────────────── */}
      <ButterflyCursor enabled={butterflyEnabled} />

      {/* ── Persistent Header with Docked Botanical Logo ─────────────── */}
      <Header onOpenGarden={() => setFullscreenGarden(true)} />

      {/* ── Type Garden Blooming Loader (Mounts on initial load or on request) ── */}
      {(!hasLoadedGarden || fullscreenGarden) && (
        <TypeGardenLoader
          onComplete={() => {
            setHasLoadedGarden(true);
            setFullscreenGarden(false);
          }}
        />
      )}

      {/* ── Main Multi-Page Route Viewport ──────────────────────────── */}
      <main className="page relative z-10 min-h-screen">
        {path === "/" && (
          <>
            <Hero
              showLayerA={showLayerA}
              showLayerB={showLayerB}
              wireframe={wireframe}
            />
            <StackingProjects />
            <ExcavationCraterFooter />
          </>
        )}

        {path === "/about" && (
          <>
            <AboutPage externalMusicStyle={musicStyle} />
            <ExcavationCraterFooter />
          </>
        )}

        {path === "/projects" && (
          <>
            <ProjectsPage />
            <ExcavationCraterFooter />
          </>
        )}

        {path === "/journal" && (
          <>
            <JournalPage />
            <ExcavationCraterFooter />
          </>
        )}

        {path === "/resume" && (
          <>
            <ResumePage />
            <ExcavationCraterFooter />
          </>
        )}

        {path === "/404" && (
          <>
            <NotFoundPage />
            <ExcavationCraterFooter />
          </>
        )}

        {path.startsWith("/case/") && (
          <>
            <CaseStudyPage />
            <ExcavationCraterFooter />
          </>
        )}
      </main>

      {/* ── Solar Chronometer Instrument HUD (Bottom-Right) ──────────── */}
      <div
        className="hud fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/15 shadow-2xl transition-all"
        data-open={hudOpen}
      >
        <SolarChronometer
          externalStyle={hudStyle}
          onStyleChange={(s) => setHudStyle(s)}
        />

        <div className="hud-row flex items-center justify-between mt-2 pt-2 border-t border-white/10 font-mono text-[10px]">
          <div className="variant-dots flex items-center gap-1.5" role="group" aria-label="Sky texture">
            {VARIANTS.map((v) => (
              <button
                key={v}
                type="button"
                className={`px-2 py-0.5 rounded text-[8.5px] uppercase transition-all ${
                  variant === v
                    ? "bg-white text-black font-bold"
                    : "bg-white/10 text-white/50 hover:text-white"
                }`}
                onClick={() => setVariant(v)}
                title={`Switch sky shader: ${v}`}
              >
                {v[0].toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="hud-hide text-white/50 hover:text-white px-1.5 py-0.5 rounded"
            onClick={() => setHudOpen((v) => !v)}
            aria-expanded={hudOpen}
            title="Toggle instrument ([)"
          >
            {hudOpen ? "—" : "◔"}
          </button>
        </div>
      </div>

      {/* ── Developer Feature Test Control Center (Bottom-Left) ──────── */}
      <DevMenu
        currentVariant={variant}
        onVariantChange={setVariant}
        currentHudStyle={hudStyle}
        onHudStyleChange={setHudStyle}
        currentMusicStyle={musicStyle}
        onMusicStyleChange={setMusicStyle}
        showLayerA={showLayerA}
        onToggleLayerA={() => setShowLayerA(!showLayerA)}
        showLayerB={showLayerB}
        onToggleLayerB={() => setShowLayerB(!showLayerB)}
        wireframe={wireframe}
        onToggleWireframe={() => setWireframe(!wireframe)}
        forceAurora={forceAurora}
        onToggleAurora={() => setForceAurora(!forceAurora)}
        forceNight={forceNight}
        onToggleNight={() => setForceNight(!forceNight)}
        butterflyEnabled={butterflyEnabled}
        onToggleButterfly={() => setButterflyEnabled(!butterflyEnabled)}
      />
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <PortfolioContent />
    </RouterProvider>
  );
}
