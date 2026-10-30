"use client";

import { useEffect, useRef, useState } from "react";
import { HeroIsland } from "./HeroIsland";
import { momentLabel } from "@/lib/timeOfDay";
import { useSkyTime } from "@/lib/useTimeOfDay";
import { Link } from "@/router/Router";

interface HeroProps {
  showLayerA?: boolean;
  showLayerB?: boolean;
  wireframe?: boolean;
}

export function Hero({
  showLayerA = true,
  showLayerB = true,
  wireframe = false,
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const t = useSkyTime();

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const travel = section.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, travel)));
      setScrollProgress(p);
      stage.style.setProperty("--p", p.toFixed(4));
      document.documentElement.setAttribute("data-scrolled", p > 0.04 ? "true" : "false");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      stage.style.setProperty("--tilt-x", `${(nx * 3.5).toFixed(2)}deg`);
      stage.style.setProperty("--tilt-y", `${(-ny * 2.5).toFixed(2)}deg`);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <section ref={sectionRef} className="hero" data-hud-section="Home">
      <div ref={stageRef} className="hero-stage">
        {/* ── TWO-LAYER FLOATING ISLAND PLACEHOLDER SVG ────────────────── */}
        <div className="hero-island-wrap">
          <div className="hero-island">
            <HeroIsland
              scrollProgress={scrollProgress}
              showLayerA={showLayerA}
              showLayerB={showLayerB}
              wireframe={wireframe}
            />
          </div>
        </div>

        {/* ── copy ────────────────────────────────────────────────────── */}
        <div className="hero-copy">
          <p className="hero-eyebrow">
            <span className="hero-dot" aria-hidden />
            Portfolio — 2026
            <span className="hero-sep" aria-hidden>/</span>
            <span className="hero-moment">{momentLabel(t)}</span>
          </p>

          <h1 className="hero-title">
            <span>Product Designer</span>
            <span className="hero-title-alt">&amp; Engineer</span>
          </h1>

          <p className="hero-lede">
            Designing in the AI space and thinking in systems — building
            products end to end, from the first question to the shipped
            interface.
          </p>

          <div className="hero-actions">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn btn-primary"
            >
              Selected work
            </a>
            <Link href="/about" className="btn btn-ghost">
              About studio
            </Link>
          </div>
        </div>

        <div className="hero-hint" aria-hidden>
          <span className="hero-hint-line" />
          <span className="hero-hint-text">Scroll to reveal underside thrusters &amp; mech keel</span>
        </div>
      </div>
    </section>
  );
}
