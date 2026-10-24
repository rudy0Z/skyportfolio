import { Link } from "@/router/Router";

export function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-page relative w-full pt-28 pb-32 px-4 sm:px-8 max-w-5xl mx-auto select-text text-white">
      {/* Print-specific style overrides */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #111111 !important;
          }
          .no-print, nav, footer, .hud, .sky-fixed {
            display: none !important;
          }
          .resume-container {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .print-card {
            border: 1px solid #e5e7eb !important;
            background: #ffffff !important;
            color: #111111 !important;
            box-shadow: none !important;
          }
          .print-text-dark {
            color: #111111 !important;
          }
          .print-text-muted {
            color: #4b5563 !important;
          }
        }
      `}</style>

      {/* Header and Print Actions (no-print) */}
      <div className="no-print mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2">
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-amber-300">TELEMETRY DOSSIER // CURRICULUM VITAE</span>
          </div>
          <h1 className="font-serif text-[38px] sm:text-[50px] font-normal tracking-tight">
            Rudraksh Singh
          </h1>
          <p className="font-sans text-[15px] text-white/70 font-light">
            Systems &amp; Product Designer · Autonomous Interfaces · Frontend Engineer
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-full bg-white text-black font-mono text-[11px] font-semibold uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-lg flex items-center gap-2"
          >
            <span>Print Dossier (Ctrl+P)</span>
            <span>🖨</span>
          </button>
        </div>
      </div>

      {/* Main Resume Container */}
      <div className="resume-container space-y-8">
        {/* Top Summary Banner */}
        <div className="print-card p-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl">
          <div className="font-mono text-[9px] uppercase tracking-wider text-amber-300 mb-2">
            EXECUTIVE SUMMARY // CORE ARCHITECTURE THESIS
          </div>
          <p className="print-text-dark font-sans text-[14.5px] font-light text-white/85 leading-relaxed">
            Product designer and systems engineer operating at the intersection of complex state machines,
            autonomous AI copilots, and high-fidelity interaction runtimes. Specialized in designing emergency
            decision windows, deterministic boundary gates, and low-latency WebGL interfaces that ensure
            meaningful human authorization over autonomous agents.
          </p>
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-4 font-mono text-[11px] text-white/60 print-text-muted">
            <span>Location: Surat, India (21°N)</span>
            <span>·</span>
            <span>Email: rudra.singh.design@gmail.com</span>
            <span>·</span>
            <span>Portfolio: skyportfolio.app</span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column (8 cols): Experience & Case Studies */}
          <div className="md:col-span-8 space-y-8">
            <div className="print-card p-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 pb-2 border-b border-white/10">
                EXPERIENCE // SYSTEMS &amp; PRODUCT PRACTICE
              </div>

              {/* FlytBase Sentinel */}
              <div>
                <div className="flex justify-between items-baseline">
                  <h3 className="print-text-dark font-serif text-[20px] font-medium text-white">
                    FlytBase Sentinel
                  </h3>
                  <span className="font-mono text-[11px] text-amber-300 font-bold">2026</span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-white/50 print-text-muted mb-2">
                  Lead Interaction Architect &amp; Frontend Engineer · Independent Concept
                </div>
                <ul className="list-disc list-inside space-y-1.5 font-sans text-[13px] text-white/75 print-text-dark font-light">
                  <li>Designed the 90-Second Human Verification Window for wildfire initial-attack aerial command.</li>
                  <li>Engineered the Attention Arbiter algorithm to suppress non-critical drone telemetry during active fire spread.</li>
                  <li>Constructed dual-fidelity 2D tactical grid and 3D terrain exploration degradation ladders with zero UI drift.</li>
                </ul>
              </div>

              {/* LokAI */}
              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-baseline">
                  <h3 className="print-text-dark font-serif text-[20px] font-medium text-white">
                    LokAI (Consumer Legal Rights)
                  </h3>
                  <span className="font-mono text-[11px] text-amber-300 font-bold">2025</span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-white/50 print-text-muted mb-2">
                  Product Designer &amp; Design Technologist · Material+ Top 10 Winner
                </div>
                <ul className="list-disc list-inside space-y-1.5 font-sans text-[13px] text-white/75 print-text-dark font-light">
                  <li>Built deterministic legal AI boundary gates, eliminating LLM hallucinations in statutory citations.</li>
                  <li>Implemented multilingual typography engine (Devanagari, Tamil, English) localized for Indian dispute channels.</li>
                  <li>Structured stop-tier response modes that disable statutory drafting when evidence merit is absent.</li>
                </ul>
              </div>

              {/* Feul.AI */}
              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-baseline">
                  <h3 className="print-text-dark font-serif text-[20px] font-medium text-white">
                    Feul.AI
                  </h3>
                  <span className="font-mono text-[11px] text-amber-300 font-bold">2025</span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-white/50 print-text-muted mb-2">
                  Product Designer · Startup Concept
                </div>
                <ul className="list-disc list-inside space-y-1.5 font-sans text-[13px] text-white/75 print-text-dark font-light">
                  <li>Designed transparent micro-payout escrow contract models for vernacular voice crowdsourcing.</li>
                  <li>Developed client-side real-time acoustic waveform validation reducing contributor rejection rates by 65%.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Tool Stack, Education, Honors */}
          <div className="md:col-span-4 space-y-8">
            {/* Technical Skills */}
            <div className="print-card p-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 pb-2 border-b border-white/10">
                TECHNICAL ARSENAL
              </div>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-amber-300 mb-1">
                  Design Architecture
                </div>
                <p className="font-sans text-[12px] text-white/75 print-text-dark">
                  Figma, Design System Tokens, State Machines, Information Hierarchy, Microcopy.
                </p>
              </div>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-sky-300 mb-1">
                  Frontend Engineering
                </div>
                <p className="font-sans text-[12px] text-white/75 print-text-dark">
                  React 19, TypeScript, Next.js, WebGL2 / GLSL Shaders, Tailwind CSS, Vite.
                </p>
              </div>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 mb-1">
                  Autonomous AI Runtimes
                </div>
                <p className="font-sans text-[12px] text-white/75 print-text-dark">
                  Human-in-the-Loop Architecture, Prompt Boundary Gates, Claude API, Python.
                </p>
              </div>
            </div>

            {/* Honors & Recognitions */}
            <div className="print-card p-6 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl space-y-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 pb-2 border-b border-white/10">
                HONORS &amp; RECOGNITIONS
              </div>
              <div className="font-sans text-[12px] text-white/80 print-text-dark">
                <strong>Material+ Hackathon 2025:</strong> Top 10 Finalist for LokAI deterministic legal triage.
              </div>
              <div className="font-sans text-[12px] text-white/80 print-text-dark">
                <strong>FlytBase Sentinel Challenge:</strong> Commended autonomous initial-attack command interface.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
