"use client";

/**
 * Hero — the framing container.
 *
 * The hero does not draw a scene. It stages one:
 *
 *   .hero-art-slot   ← your editorial image/video cutout goes here. It is
 *                       positioned over the plateau's surface, clipped to the
 *                       island silhouette, and graded by the sky (the same
 *                       --grade-* variables the clouds use).
 *   <Island/>        ← the atmospheric plateau: soft silhouette, dissolving
 *                       edges, mist at the rim. No illustration.
 *
 * Scroll drives one CSS variable (`--p`) on the sticky stage; all motion is
 * transform/opacity, so the reveal stays off the paint path.
 */

import { useEffect, useRef } from "react";
import { Island } from "./Island";
import { momentLabel } from "@/lib/timeOfDay";
import { useSkyTime } from "@/lib/useTimeOfDay";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
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

  return (
    <section ref={sectionRef} className="hero" data-hud-section="Home">
      <div ref={stageRef} className="hero-stage">
        {/* ── the plateau + mist ─────────────────────────────────────── */}
        <div className="hero-island-wrap">
          <div className="hero-island">
            <Island />
          </div>
        </div>

        {/*
          ── editorial art slot ──────────────────────────────────────────
          This is the seam for the real illustration: a transparent PNG or a
          looping video cutout of the designer at the desk. Position it over
          the plateau surface; the wrapper already masks it to the island and
          carries the same light grading as the sky.
        */}
        <div className="hero-art-slot" data-slot="hero-art">
          {/* Replace this node with <img> / <video> when the art is ready. */}
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
            <a href="#work" className="btn btn-primary">
              Selected work
            </a>
            <a href="#about" className="btn btn-ghost">
              About
            </a>
          </div>
        </div>

        <div className="hero-hint" aria-hidden>
          <span className="hero-hint-line" />
          <span className="hero-hint-text">Scroll to lift the field</span>
        </div>
      </div>
    </section>
  );
}
