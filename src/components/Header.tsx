import { Link, useRoute } from "@/router/Router";
import { TypeGardenLoader } from "./TypeGardenLoader";

interface HeaderProps {
  onOpenGarden: () => void;
}

export function Header({ onOpenGarden }: HeaderProps) {
  const { path } = useRoute();

  const NAV_LINKS = [
    { href: "/", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/journal", label: "Journal" },
    { href: "/resume", label: "Resume" },
  ];

  return (
    <header className="site-header fixed top-0 inset-x-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-md bg-black/20 border-b border-white/5 transition-all">
      {/* Docked Type Garden Botanical Logo */}
      <div className="flex items-center gap-3">
        <TypeGardenLoader isPersistentLogo={true} onOpenFullscreen={onOpenGarden} />
      </div>

      {/* Main Navigation */}
      <nav className="flex items-center gap-1 sm:gap-2 rounded-full p-1 bg-black/40 border border-white/10 backdrop-blur-md">
        {NAV_LINKS.map((link) => {
          const isActive = path === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 sm:px-4 py-1 rounded-full font-mono text-[11px] sm:text-[12px] uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Telemetry Badge */}
      <div className="hidden md:flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-white/50">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span>SURAT 21°N // OKLCH SKY</span>
      </div>
    </header>
  );
}
