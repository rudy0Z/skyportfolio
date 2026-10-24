/**
 * App — the persistent stage.
 *
 * Layer order:
 *   .sky-fixed   fixed, z-0   CodedSky — survives every scroll
 *   .page        z-1          hero → works → footer, transparent
 *   .hud         z-50         one compact instrument, bottom-right
 *
 * The HUD is deliberately small: a 24-hour solar dial with a digital readout
 * at its centre (drag the ring, scroll or type the digits), a timelapse
 * button, three hairline variant dots. It reads as part of the scene, not a
 * control panel.
 */

import { useEffect, useState } from "react";
import { CodedSky, type SkyVariant } from "@/sky/CodedSky";
import { TimeClock } from "@/sky/TimeClock";
import { Hero } from "@/sections/Hero";
import { Works } from "@/sections/Works";
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

export default function App() {
  const [variant, setVariant] = useState<SkyVariant>(initialVariant);
  const [hudOpen, setHudOpen] = useState(true);

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
      <div className="sky-fixed">
        <CodedSky variant={variant} />
      </div>

      <div className="page">
        <Hero />
        <Works />
        <footer className="site-foot">
          <div className="site-foot-inner">
            <span>Designed under an open sky.</span>
            <span className="site-foot-sep" aria-hidden />
            <span>{new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>

      <div className="hud" data-open={hudOpen}>
        <TimeClock />

        <div className="hud-row">
          <div className="variant-dots" role="group" aria-label="Sky texture">
            {VARIANTS.map((v) => (
              <button
                key={v}
                type="button"
                className="variant-dot"
                aria-pressed={variant === v}
                aria-label={`${v} sky`}
                title={`${v} (${VARIANTS.indexOf(v) + 1})`}
                onClick={() => setVariant(v)}
              >
                <span className="variant-dot-mark" data-v={v} aria-hidden />
              </button>
            ))}
          </div>
          <button
            type="button"
            className="hud-hide"
            onClick={() => setHudOpen((v) => !v)}
            aria-expanded={hudOpen}
            title="Toggle instrument ([)"
          >
            {hudOpen ? "—" : "◔"}
          </button>
        </div>
      </div>
    </>
  );
}
