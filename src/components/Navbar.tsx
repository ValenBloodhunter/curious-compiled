import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { label: "WORK", href: "#work" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 18);
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maximum > 0 ? (window.scrollY / maximum) * 100 : 0);
      const line = window.scrollY + window.innerHeight * .37;
      let current = "";
      for (const link of links) {
        const section = document.querySelector<HTMLElement>(link.href);
        if (section && section.offsetTop <= line) current = link.href;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`lab-nav sticky top-0 z-50 transition-colors duration-300 ${scrolled || menuOpen ? "lab-nav--scrolled" : ""}`}>
        <div className="page-shell flex h-20 items-center justify-between">
          <a href="#top" onClick={() => setMenuOpen(false)} aria-label="Back to top" className="group flex items-center gap-3">
            <span className="lab-nav-brand flex h-10 w-10 items-center justify-center rounded-lg font-display text-lg font-bold tracking-tight text-ink">
              V<span className="text-accent">/</span>
            </span>
            <span className="hidden font-mono text-[10px] tracking-[.15em] text-muted transition-colors group-hover:text-ink sm:block">CURIOUS, COMPILED.</span>
          </a>

          <nav className="hidden items-center gap-3 md:flex lg:gap-6" aria-label="Primary navigation">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={active === link.href ? "location" : undefined}
                className={`group relative inline-flex min-h-10 items-center gap-2 rounded-lg px-3 font-mono text-[11px] tracking-[.15em] transition-[color,background-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/[.06] hover:text-ink hover:shadow-[0_0_24px_rgba(134,244,218,.08)] ${
                  active === link.href
                    ? "bg-accent/[.075] text-ink shadow-[inset_0_0_0_1px_rgba(134,244,218,.16)]"
                    : "text-muted"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 shrink-0 rounded-full bg-accent transition-[opacity,transform,box-shadow] duration-300 group-hover:scale-110 group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(134,244,218,.6)] ${
                    active === link.href ? "opacity-100" : "opacity-0"
                  }`}
                />
                {link.label}
              </a>
            ))}
            <a
              href="https://github.com/ValenBloodhunter"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-2 rounded-sm border border-line px-4 font-mono text-[11px] tracking-[.12em] text-ink transition-all hover:border-accent/60 hover:bg-accent/5"
            >
              GITHUB <ArrowUpRight size={15} className="text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </nav>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex min-h-11 items-center gap-3 font-mono text-xs tracking-[.12em] text-ink md:hidden"
          >
            <span>{menuOpen ? "CLOSE" : "MENU"}</span>{menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <div aria-hidden="true" className="lab-progress absolute bottom-0 left-0" style={{ width: `${progress}%` }} />
      </header>

      {menuOpen && (
        <div id="mobile-navigation" className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto border-t border-line bg-bg/98 backdrop-blur-2xl md:hidden">
          <nav aria-label="Mobile navigation" className="page-shell flex flex-col gap-8 py-14">
            <p className="font-mono text-[10px] tracking-[.2em] text-muted">INDEX / NAVIGATION</p>
            {links.map((link, index) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="flex items-start gap-5 font-display text-5xl font-bold tracking-[-.06em] text-ink transition-colors hover:text-accent">
                <span className="mt-2 font-mono text-xs font-normal tracking-normal text-accent">0{index + 1}</span>{link.label}
              </a>
            ))}
            <div className="mt-6 border-t border-line pt-8">
              <a href="https://github.com/ValenBloodhunter" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="inline-flex items-center gap-3 font-mono text-sm tracking-widest text-accent">GITHUB <ArrowUpRight size={17} /></a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
