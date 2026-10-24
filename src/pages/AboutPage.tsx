import { useState } from "react";
import { Link } from "@/router/Router";
import { MusicWidgetHost, type MusicWidgetStyle } from "@/components/music/MusicWidgetHost";

const CHAPTERS = [
  {
    id: "visual-foundation",
    index: "CH.01",
    title: "The Visual Foundation",
    body: [
      "I didn't start in design — I started with images. Years of photography and editing taught me where the eye lands, what feels heavy, and why some combinations feel inevitable, long before I could explain any of it in design language.",
      "Posters for college fests, retouched frames, half-finished edits — the messy work taught me more than polished decks ever did. Composition stopped being taste and became a method.",
    ],
  },
  {
    id: "systems-shift",
    index: "CH.02",
    title: "The Systems Shift",
    body: [
      "Organising events and rebuilding the systems around them turned visual instinct into product practice. I learned that a screen is downstream of a decision — name the decision a person is making, and the layout mostly designs itself.",
      "That conviction runs through everything since: design the decision, not the screen. Prototype the doubt. A clickable rough thing ends arguments faster than another slide.",
    ],
  },
  {
    id: "autonomous-intelligence",
    index: "CH.03",
    title: "Autonomous Intelligence",
    body: [
      "Now I design in the AI and interaction space — interfaces where the system acts and the human authorizes. Sentinel's 90-second verification window, LokAI's boundary gates, Feul's visible payout contract: each is about a person understanding what's happening and knowing what to do next.",
      "I build my own prototypes in code until my instincts catch up with my taste. This site is one of them.",
    ],
  },
];

const TIMELINE = [
  { period: "2026", title: "FlytBase Sentinel", detail: "Independent challenge concept — emergency response aerial command interface" },
  { period: "2025", title: "LokAI", detail: "Hackathon flagship — deterministic legal triage with boundary-safe AI responses" },
  { period: "2025", title: "Feul.AI", detail: "Startup-origin concept — voice-data marketplace for vernacular contributors" },
  { period: "2024 →", title: "Product Design & Engineering Practice", detail: "Self-directed systems, prototypes, and visual engineering" },
];

const FILM_SLIDES = [
  { id: "s1", title: "Canopy Shadow", exif: "35mm · f/2.8 · ISO 100", loc: "Monsoon Wetland Passage" },
  { id: "s2", title: "Riverboats at Dawn", exif: "50mm · f/1.8 · ISO 200", loc: "Tapi River Bank" },
  { id: "s3", title: "Solitary Egret", exif: "85mm · f/4.0 · ISO 160", loc: "Estuary Wildlife Refuge" },
  { id: "s4", title: "Stratosphere Kite", exif: "24mm · f/5.6 · ISO 100", loc: "Coastal Horizon Wind" },
];

const TOOL_GROUPS = [
  { group: "Design & Systems", tools: ["Figma", "Design Systems Tokens", "Framer", "Vector Choreography", "Typography"] },
  { group: "Engineering & Runtimes", tools: ["React 19", "TypeScript", "Next.js", "WebGL2 / GLSL", "Tailwind CSS", "Vite"] },
  { group: "Autonomous Intelligence", tools: ["Claude / Anthropic", "Cursor AI", "Python / PyTorch", "Deterministic Boundary Gates", "Acoustic Signal Processing"] },
];

export function AboutPage({
  externalMusicStyle,
}: {
  externalMusicStyle?: MusicWidgetStyle;
}) {
  const [activeSlide, setActiveSlide] = useState<string | null>(null);

  return (
    <div className="about-page relative w-full pt-28 pb-32 px-4 sm:px-8 max-w-6xl mx-auto select-text text-white">
      {/* Header Breadcrumb */}
      <div className="mb-14">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 mb-3">
          <Link href="/" className="hover:text-white transition-colors">HOME</Link>
          <span>/</span>
          <span className="text-amber-300">EXPLORER&apos;S STUDIO // ABOUT</span>
        </div>
        <h1 className="font-serif text-[42px] sm:text-[60px] font-normal leading-[1.05] tracking-tight">
          Life Outside Pixels is Still Pixels
        </h1>
        <p className="mt-3 font-sans text-[17px] text-white/70 max-w-2xl font-light leading-relaxed">
          From photography and composition to decision architecture and autonomous intelligence.
        </p>
      </div>

      {/* Two Column Layout: Sticky Left Profile & Soundtrack, Right Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Portrait & Switchable Music Player */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          {/* Portrait Placeholder Card */}
          <div className="p-4 rounded-2xl border border-white/15 bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
            <div className="relative aspect-[4/5] w-full rounded-xl bg-gradient-to-b from-neutral-800 to-neutral-950 flex flex-col items-center justify-center p-6 text-center border border-white/5">
              <svg viewBox="0 0 120 120" className="w-24 h-24 mb-4 text-white/30">
                <circle cx="60" cy="45" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M 20 105 C 20 75, 40 68, 60 68 C 80 68, 100 75, 100 105" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="font-serif text-[20px] font-medium text-white">Rudraksh Singh</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mt-1">
                SYSTEMS &amp; PRODUCT DESIGNER
              </span>
              <span className="font-mono text-[9px] text-white/40 mt-3">
                SURAT, INDIA · 21°N
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[9.5px] uppercase tracking-wider text-white/50 px-1">
              <span>PLATE · PORTRAIT // 2026</span>
              <span>CANON EOS 35MM</span>
            </div>
          </div>

          {/* Switchable Music Player Widget */}
          <MusicWidgetHost defaultStyle="pinui" externalStyle={externalMusicStyle} />
        </div>

        {/* Right Column: 3 Chapters, Timeline, Tools, Film Slide Gallery */}
        <div className="lg:col-span-7 space-y-20">
          {/* 3 Chapters */}
          <div className="space-y-16">
            {CHAPTERS.map((ch) => (
              <article key={ch.id} className="p-6 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                  {ch.index}
                </span>
                <h2 className="font-serif text-[30px] sm:text-[38px] font-medium leading-tight text-white mt-2 mb-4">
                  {ch.title}
                </h2>
                <div className="space-y-4 font-sans text-[15px] font-light leading-relaxed text-white/80">
                  {ch.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Film Slide Mounts Gallery (35mm Photography) */}
          <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-md">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">
              OBSERVATORY // 35MM FILM SLIDE ARCHIVE
            </div>
            <h3 className="font-serif text-[24px] font-medium text-white mb-6">
              Snapshots Outside the Screen
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {FILM_SLIDES.map((slide) => (
                <div
                  key={slide.id}
                  onClick={() => setActiveSlide(slide.id)}
                  className="group relative p-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  {/* Film Slide Perforated Frame */}
                  <div className="aspect-[4/3] rounded bg-black/70 border border-white/10 flex flex-col items-center justify-center p-3 text-center mb-2">
                    <span className="font-mono text-[12px] text-white/40 group-hover:text-amber-300 transition-colors">
                      [35MM SLIDE]
                    </span>
                    <span className="font-sans text-[13px] text-white font-medium mt-1">
                      {slide.title}
                    </span>
                  </div>
                  <div className="font-mono text-[8.5px] uppercase tracking-wider text-white/50 flex justify-between">
                    <span>{slide.exif}</span>
                    <span>{slide.id.toUpperCase()}</span>
                  </div>
                  <div className="font-sans text-[10px] text-white/40 truncate mt-0.5">
                    {slide.loc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-md">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">
              CHRONOLOGY // FLIGHT RECORD
            </div>
            <h3 className="font-serif text-[24px] font-medium text-white mb-6">
              Experience &amp; Challenges
            </h3>
            <div className="space-y-6">
              {TIMELINE.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <span className="font-mono text-[11px] font-bold text-amber-300 w-16 pt-0.5">
                    {item.period}
                  </span>
                  <div>
                    <h4 className="font-sans text-[15px] font-semibold text-white">
                      {item.title}
                    </h4>
                    <p className="font-sans text-[13px] text-white/60 font-light mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tools & Engineering Matrix */}
          <div className="p-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-md">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">
              SYSTEM CAPABILITIES // TOOL MATRIX
            </div>
            <h3 className="font-serif text-[24px] font-medium text-white mb-6">
              Core Competencies
            </h3>
            <div className="space-y-6">
              {TOOL_GROUPS.map((tg) => (
                <div key={tg.group}>
                  <div className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-white/70 mb-2">
                    {tg.group}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tg.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10.5px] text-white/85"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Film Slide Lightbox Modal */}
      {activeSlide && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 cursor-pointer"
          onClick={() => setActiveSlide(null)}
        >
          <div className="relative p-8 rounded-3xl border border-white/20 bg-neutral-900 text-center max-w-md">
            <div className="font-mono text-[10px] text-amber-300 uppercase tracking-widest mb-2">
              35MM CHROMOGENIC SLIDE MOUNT
            </div>
            <div className="aspect-[4/3] rounded-xl bg-black border border-white/10 flex items-center justify-center p-6 mb-4">
              <span className="font-serif text-[24px] text-white">
                {FILM_SLIDES.find((s) => s.id === activeSlide)?.title}
              </span>
            </div>
            <div className="font-mono text-[11px] text-white/70">
              {FILM_SLIDES.find((s) => s.id === activeSlide)?.exif}
            </div>
            <div className="font-sans text-[12px] text-white/50 mt-1">
              {FILM_SLIDES.find((s) => s.id === activeSlide)?.loc}
            </div>
            <button
              type="button"
              className="mt-6 px-4 py-1.5 rounded-full border border-white/20 font-mono text-[10px] text-white/70 hover:bg-white/10"
              onClick={() => setActiveSlide(null)}
            >
              Close Slide ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
