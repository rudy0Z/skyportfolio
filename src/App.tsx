"use client";

import { useEffect, useState } from "react";
import { RouterProvider, useRoute } from "@/router/Router";
import { CodedSky, type SkyVariant } from "@/sky/CodedSky";
import { Header } from "@/components/Header";
import { TypeGardenLoader } from "@/components/TypeGardenLoader";
import { CelestialNight } from "@/components/CelestialNight";
import { ButterflyCursor } from "@/components/ButterflyCursor";
import { ThermalSkyClock } from "@/sky/ThermalSkyClock";

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
import { LabPage } from "@/pages/LabPage";
import { setSkyTime } from "@/lib/useTimeOfDay";

const VARIANT_KEY = "sky-variant";

function PortfolioContent() {
  const { path } = useRoute();
  const [variant] = useState<SkyVariant>("volumetric");
  const [hasLoadedGarden, setHasLoadedGarden] = useState(false);
  const [isLoaderDocked, setIsLoaderDocked] = useState(false);
  const [fullscreenGarden, setFullscreenGarden] = useState(false);
  const [clockSize, setClockSize] = useState<"thumbnail" | "full">("thumbnail");

  // Visual layer flags
  const showLayerA = true;
  const showLayerB = true;
  const wireframe = false;
  const forceAurora = false;
  const forceNight = false;
  const butterflyEnabled = true;

  useEffect(() => {
    window.localStorage.setItem(VARIANT_KEY, "volumetric");
    const params = new URLSearchParams(window.location.search);
    params.set("variant", "volumetric");
    const t = params.get("t");
    window.history.replaceState(null, "", `${window.location.pathname}?${params}${window.location.hash}`);
    if (t) {
      const [h, m] = t.split(":").map(Number);
      if (Number.isFinite(h)) setSkyTime(h + (m || 0) / 60, "manual");
    }
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

      {/* ── Fixed Top-Right Corner Clock (Refined Luxury Pill) ─────── */}
      <div
        className="fixed top-3.5 right-4 sm:right-6 z-50 pointer-events-auto cursor-pointer"
        onClick={() => {
          setClockSize((prev) => (prev === "thumbnail" ? "full" : "thumbnail"));
        }}
      >
        <ThermalSkyClock
          size={clockSize}
          onSizeChange={setClockSize}
          expandable={true}
        />
      </div>
      {clockSize === "full" && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setClockSize("thumbnail")}
          aria-hidden="true"
        />
      )}

      {/* ── Persistent Top Navigation Notch ─────────────── */}
      <Header
        isLoaderDocked={isLoaderDocked}
        onOpenGarden={() => setFullscreenGarden(true)}
      />

      {/* ── Type Garden Blooming Loader (Mounts on initial load or on request) ── */}
      {(!hasLoadedGarden || fullscreenGarden) && (
        <TypeGardenLoader
          onDockingStart={() => setIsLoaderDocked(true)}
          onComplete={() => {
            setHasLoadedGarden(true);
            setIsLoaderDocked(true);
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
            <AboutPage externalMusicStyle="pinui" />
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

        {path === "/lab" && <LabPage />}

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
