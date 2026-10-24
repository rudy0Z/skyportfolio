import { useEffect, useState } from "react";

export function ExcavationCraterFooter() {
  const [copied, setCopied] = useState(false);
  const [handleCopied, setHandleCopied] = useState(false);
  const [activeSocial, setActiveSocial] = useState<string | null>(null);
  const [ignitionActive, setIgnitionActive] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [times, setTimes] = useState({ surat: "", sf: "", utc: "" });

  // Update multi-timezone clocks every second
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();

      const format = (tz: string) =>
        now.toLocaleTimeString("en-US", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });

      setTimes({
        surat: format("Asia/Kolkata"),
        sf: format("America/Los_Angeles"),
        utc: format("UTC"),
      });
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText("rudraksh.singhh@outlook.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyHandle = () => {
    navigator.clipboard?.writeText("@rudrakshsinghh");
    setHandleCopied(true);
    setTimeout(() => setHandleCopied(false), 2500);
  };

  const handleReturnToOrbit = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleIgnitionToggle = () => {
    setIgnitionActive(true);
    setTimeout(() => {
      setShowCallModal(true);
      setIgnitionActive(false);
    }, 400);
  };

  return (
    <footer className="excavation-crater-footer relative w-full overflow-hidden bg-gradient-to-b from-transparent via-[#0b0c10] to-[#050608] pt-20 pb-16 text-white border-t border-white/10">
      {/* ============================================================== */}
      {/* EXCAVATION CRATER RIM PLACEHOLDER SVG                          */}
      {/* The massive geological hollow in bedrock where island lifted   */}
      {/* ============================================================== */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>ALTITUDE 04 // THE EXCAVATION CRATER (BEDROCK ZERO)</span>
          </div>
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-white/40">
            SURAT 21°10&apos;N 72°49&apos;E · ELEVATION -42M
          </span>
        </div>

        {/* Detailed Crater Placeholder SVG */}
        <div className="w-full rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden p-4">
          <svg viewBox="0 0 1200 420" className="w-full h-auto max-h-[360px] overflow-visible">
            <defs>
              <linearGradient id="craterRock" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2c2a26" />
                <stop offset="50%" stopColor="#1a1917" />
                <stop offset="100%" stopColor="#0a0a0c" />
              </linearGradient>
              <linearGradient id="hollowGlow" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Distant Quarry Walls */}
            <path
              d="M 0 120
                 C 200 90, 420 140, 600 130
                 C 780 120, 1000 85, 1200 110
                 L 1200 420 L 0 420 Z"
              fill="#131418"
            />

            {/* Deep Excavation Pit / Crater Rim Silhouette */}
            <path
              d="M -40 220
                 C 140 225, 260 270, 360 300
                 C 480 330, 720 330, 840 300
                 C 940 270, 1060 225, 1240 220
                 L 1240 420 L -40 420 Z"
              fill="url(#craterRock)"
              stroke="#3a3731"
              strokeWidth="1.5"
            />

            {/* Glowing Uplift Hollow Core (Where Island Lifted Off) */}
            <ellipse cx="600" cy="330" rx="340" ry="70" fill="url(#hollowGlow)" />
            <ellipse
              cx="600"
              cy="330"
              rx="280"
              ry="50"
              fill="none"
              stroke="#10b981"
              strokeWidth="1"
              strokeDasharray="4 8"
              opacity="0.4"
            />

            {/* Geological Quarry Bench Terraces & Fault Lines */}
            <path
              d="M 120 280 C 240 310, 380 340, 520 350"
              stroke="#44403c"
              strokeWidth="2"
              fill="none"
              strokeDasharray="3 3"
            />
            <path
              d="M 680 350 C 820 340, 960 310, 1080 280"
              stroke="#44403c"
              strokeWidth="2"
              fill="none"
              strokeDasharray="3 3"
            />

            {/* Surveyor Tripods & Beacon Lights on Crater Rim */}
            <g transform="translate(240, 245)">
              <line x1="0" y1="0" x2="-8" y2="30" stroke="#71717a" strokeWidth="2" />
              <line x1="0" y1="0" x2="8" y2="30" stroke="#71717a" strokeWidth="2" />
              <line x1="0" y1="0" x2="0" y2="30" stroke="#71717a" strokeWidth="2" />
              <circle cx="0" cy="-3" r="3" fill="#ef4444" className="animate-ping" />
              <circle cx="0" cy="-3" r="2.5" fill="#f87171" />
            </g>

            <g transform="translate(960, 245)">
              <line x1="0" y1="0" x2="-8" y2="30" stroke="#71717a" strokeWidth="2" />
              <line x1="0" y1="0" x2="8" y2="30" stroke="#71717a" strokeWidth="2" />
              <line x1="0" y1="0" x2="0" y2="30" stroke="#71717a" strokeWidth="2" />
              <circle cx="0" cy="-3" r="3" fill="#38bdf8" className="animate-ping" />
              <circle cx="0" cy="-3" r="2.5" fill="#38bdf8" />
            </g>

            {/* Uplink Energy Particles rising to orbit */}
            <circle cx="560" cy="270" r="1.5" fill="#6ee7b7" opacity="0.8" />
            <circle cx="640" cy="240" r="2" fill="#6ee7b7" opacity="0.7" />
            <circle cx="610" cy="190" r="1.5" fill="#6ee7b7" opacity="0.5" />
            <circle cx="580" cy="150" r="1" fill="#6ee7b7" opacity="0.4" />
          </svg>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CLEAN FOOTER ELEMENTS                                          */}
      {/* ============================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* 1. Surveyor's Plaque (Cast Metal Bedrock Plaque) */}
        <div className="md:col-span-5 p-6 rounded-xl border border-white/15 bg-black/40 backdrop-blur-md">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2">
            SURVEYOR&apos;S BENCHMARK // CAST METAL INSCRIPTION
          </div>
          <h3 className="font-serif text-[26px] font-normal tracking-tight text-white/95 mb-3 leading-snug">
            &ldquo;From this ground, we build systems.&rdquo;
          </h3>
          <p className="font-sans text-[13.5px] font-light text-white/60 leading-relaxed mb-4">
            Every interface starts with solid bedrock: unyielding clarity on what decisions humans must make,
            and where autonomous systems must step back and request authority.
          </p>
          <div className="flex items-center gap-2 font-mono text-[10px] text-white/40">
            <span>RUDRAKSH SINGH</span>
            <span>·</span>
            <span>2024 — {new Date().getFullYear()}</span>
          </div>
        </div>

        {/* 2. Book Call Button (Ignition Switch Style) & 3. Communication HUD */}
        <div className="md:col-span-7 flex flex-col gap-6">
          {/* Ignition Switch Book Call Button */}
          <div className="p-6 rounded-xl border border-white/15 bg-neutral-900/60 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-mono text-[9.5px] uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span>CONSULTATION IGNITION DOCK</span>
              </div>
              <div className="font-sans text-[15px] font-semibold text-white">
                Initiate Architecture Briefing
              </div>
              <div className="font-sans text-[12px] text-white/50">
                Direct discussion on product design, AI command interfaces, or design engineering.
              </div>
            </div>

            {/* Physical Aviation Ignition Switch Button */}
            <button
              type="button"
              onClick={handleIgnitionToggle}
              className={`group relative px-6 py-3 rounded-xl border font-mono text-[12px] uppercase tracking-wider font-bold transition-all shadow-lg ${
                ignitionActive
                  ? "bg-amber-400 text-black border-amber-300 shadow-amber-400/40"
                  : "bg-neutral-800 border-white/20 text-white hover:border-amber-400/60 hover:bg-neutral-750"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-amber-400 group-hover:scale-125 transition-transform">⚡</span>
                <span>FLIP IGNITION →</span>
              </span>
            </button>
          </div>

          {/* Communication HUD: Unified @rudrakshsinghh Orbit Hub & Multi-Timezone Clocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Unified @rudrakshsinghh Social Orbit Transmitter */}
            <div className="p-5 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="font-mono text-[9px] uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span>COMMUNICATION TRANSMITTER</span>
                </div>
                <span className="font-mono text-[9px] text-white/40">FREQ // GLOBAL</span>
              </div>

              {/* Central Unified Handle Dock with Surrounding Orbital Constellation */}
              <div className="relative py-4 flex flex-col items-center justify-center">
                {/* Orbital Guide Ring */}
                <div className="absolute inset-x-2 inset-y-1 rounded-full border border-dashed border-white/10 pointer-events-none -z-0" />

                {/* Central Luminous Handle Pill */}
                <button
                  type="button"
                  onClick={handleCopyHandle}
                  className="group relative z-10 px-4 py-2 rounded-full bg-neutral-900 border border-white/20 hover:border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center gap-2 transition-all hover:scale-105"
                  title="Click to copy unified handle"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-mono text-[13px] font-bold text-white tracking-wide">
                    @rudrakshsinghh
                  </span>
                  <span className="font-mono text-[10px] text-white/50 group-hover:text-cyan-300 transition-colors">
                    {handleCopied ? "✓ COPIED" : "⧉"}
                  </span>
                </button>

                {/* Surrounding Arranged Social Media Satellites */}
                <div className="relative z-10 flex items-center justify-center gap-2.5 sm:gap-3 mt-4">
                  {/* X / Twitter */}
                  <a
                    href="https://x.com/rudrakshsinghh"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => setActiveSocial("x")}
                    onMouseLeave={() => setActiveSocial(null)}
                    className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/20 border border-white/15 hover:border-white text-white flex items-center justify-center transition-all hover:scale-110 shadow-md font-bold text-[12px]"
                    title="X (Twitter) // @rudrakshsinghh"
                  >
                    𝕏
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/rudy0Z"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => setActiveSocial("github")}
                    onMouseLeave={() => setActiveSocial(null)}
                    className="h-9 w-9 rounded-full bg-white/5 hover:bg-emerald-950/60 border border-white/15 hover:border-emerald-400 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md font-mono text-[11px]"
                    title="GitHub // rudy0Z"
                  >
                    gh
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com/in/rudraksh-singh"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => setActiveSocial("linkedin")}
                    onMouseLeave={() => setActiveSocial(null)}
                    className="h-9 w-9 rounded-full bg-white/5 hover:bg-sky-950/60 border border-white/15 hover:border-sky-400 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md font-bold text-[11px]"
                    title="LinkedIn // in/rudraksh-singh"
                  >
                    in
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:rudraksh.singhh@outlook.com"
                    onMouseEnter={() => setActiveSocial("mail")}
                    onMouseLeave={() => setActiveSocial(null)}
                    className="h-9 w-9 rounded-full bg-white/5 hover:bg-amber-950/60 border border-white/15 hover:border-amber-400 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md text-[13px]"
                    title="Direct Outlook Mail // rudraksh.singhh@outlook.com"
                  >
                    ✉
                  </a>

                  {/* ReadCV */}
                  <a
                    href="https://rudrakshsingh.page"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => setActiveSocial("web")}
                    onMouseLeave={() => setActiveSocial(null)}
                    className="h-9 w-9 rounded-full bg-white/5 hover:bg-purple-950/60 border border-white/15 hover:border-purple-400 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md font-mono text-[10px]"
                    title="Live Domain // rudrakshsingh.page"
                  >
                    cv
                  </a>
                </div>

                {/* Telemetry Route Descriptor */}
                <div className="mt-3 font-mono text-[10px] text-white/50 text-center h-4">
                  {activeSocial === "x" && <span className="text-white">ROUTE ──► x.com/rudrakshsinghh</span>}
                  {activeSocial === "github" && <span className="text-emerald-300">ROUTE ──► github.com/rudy0Z</span>}
                  {activeSocial === "linkedin" && <span className="text-sky-300">ROUTE ──► linkedin.com/in/rudraksh-singh</span>}
                  {activeSocial === "mail" && <span className="text-amber-300">ROUTE ──► rudraksh.singhh@outlook.com</span>}
                  {activeSocial === "web" && <span className="text-purple-300">ROUTE ──► rudrakshsingh.page</span>}
                  {!activeSocial && <span>TRANSPONDER LOCKED // 5 SATELLITE CHANNELS</span>}
                </div>
              </div>

              {/* Quick direct copy email strip */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[11px]">
                <span className="text-white/40">Direct:</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="text-white hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span>rudraksh.singhh@outlook.com</span>
                  <span className="text-[10px] text-white/50">{copied ? "✓" : "⧉"}</span>
                </button>
              </div>
            </div>

            {/* Multi-Timezone Clocks */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md">
              <div className="font-mono text-[9px] uppercase tracking-wider text-white/40 mb-2">
                GLOBAL TELEMETRY CLOCKS
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between items-center text-white/80">
                  <span className="text-white/40">SURAT (IST)</span>
                  <span className="font-semibold text-emerald-400">{times.surat || "12:00:00"}</span>
                </div>
                <div className="flex justify-between items-center text-white/80">
                  <span className="text-white/40">SAN FRANCISCO (PT)</span>
                  <span className="text-sky-300">{times.sf || "12:00:00"}</span>
                </div>
                <div className="flex justify-between items-center text-white/80">
                  <span className="text-white/40">UNIVERSAL (UTC)</span>
                  <span className="text-white/60">{times.utc || "12:00:00"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. "Return to Orbit" Scroll-to-Top Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-white/40">
        <div>DESIGNED UNDER AN OKLCH RAYMARCHED SKY // LAT 21°N</div>

        <button
          type="button"
          onClick={handleReturnToOrbit}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 hover:text-white text-white/70 transition-all"
        >
          <span>▲ RETURN TO ORBIT (00:00 N, 00:00 E)</span>
        </button>
      </div>

      {/* Consultation Modal Placeholder */}
      {showCallModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-neutral-900 p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-amber-300">
                IGNITION PROTOCOL // BRIEFING DISPATCH
              </span>
              <button
                type="button"
                onClick={() => setShowCallModal(false)}
                className="font-mono text-[14px] text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>
            <h4 className="font-serif text-[22px] font-medium text-white mb-2">
              Schedule Architecture Briefing
            </h4>
            <p className="font-sans text-[13px] text-white/60 mb-6 font-light">
              Let&apos;s evaluate your system constraints, autonomous AI interaction models, or product vision.
            </p>
            <div className="space-y-3 mb-6">
              <a
                href="mailto:rudraksh.singhh@outlook.com?subject=Product%20Architecture%20Inquiry"
                className="w-full block py-3 text-center rounded-xl bg-white text-black font-semibold text-[13px] hover:bg-amber-300 transition-colors"
              >
                Dispatch Email Briefing →
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full py-2.5 rounded-xl border border-white/20 font-mono text-[11px] text-white/80 hover:bg-white/5"
              >
                {copied ? "✓ Copied to Clipboard" : "Copy Direct Email (rudraksh.singhh@outlook.com)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
