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

  useEffect(() => {
    const updateNavigation = () => {
      setScrolled(window.scrollY > 24);

      const position = window.scrollY + window.innerHeight * 0.35;
      let current = "";

      for (const link of links) {
        const section = document.querySelector<HTMLElement>(link.href);

        if (section && section.offsetTop <= position) {
          current = link.href;
        }
      }

      setActive(current);
    };

    updateNavigation();

    window.addEventListener("scroll", updateNavigation, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateNavigation);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
          scrolled || menuOpen
            ? "border-line bg-bg/95 backdrop-blur-md"
            : "border-transparent bg-bg"
        }`}
      >
        <div className="page-shell flex h-20 items-center justify-between">
          {/* Brand */}
          <a
            href="#top"
            onClick={() => setMenuOpen(false)}
            className="group flex items-center gap-5"
            aria-label="Back to top"
          >
            <span className="font-display text-2xl font-bold tracking-tight">
              V<span className="text-accent">/</span>
            </span>

            <span className="hidden translate-x-1 font-mono text-[10px] tracking-widest text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100 lg:block">
              CURIOUS, COMPILED.
            </span>
          </a>

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-9 md:flex"
            aria-label="Primary navigation"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={
                  active === link.href ? "location" : undefined
                }
                className="group relative font-mono text-[11px] tracking-[0.15em] text-muted transition-colors hover:text-ink"
              >
                {link.label}

                <span
                  className={`absolute -bottom-2 left-0 h-[2px] w-3 bg-accent transition-opacity ${
                    active === link.href
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </a>
            ))}

            <a
              href="https://github.com/ValenBloodhunter"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-ink transition-colors hover:text-accent"
            >
              GITHUB
              <ArrowUpRight size={15} strokeWidth={1.5} />
            </a>
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex min-h-11 items-center gap-2 font-mono text-xs tracking-widest md:hidden"
          >
            {menuOpen ? (
              <X size={20} strokeWidth={1.5} />
            ) : (
              <Menu size={20} strokeWidth={1.5} />
            )}

            <span>{menuOpen ? "CLOSE" : "MENU"}</span>
          </button>
        </div>
      </header>

      {/* Mobile navigation overlay */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto border-t border-line bg-bg md:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="page-shell flex flex-col gap-8 py-16"
          >
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-start gap-5 font-display text-5xl font-bold tracking-tight transition-colors hover:text-accent"
              >
                <span className="mt-2 font-mono text-xs font-normal text-muted">
                  0{index + 1}
                </span>

                {link.label}
              </a>
            ))}

            <div className="mt-8 border-t border-line pt-8">
              <a
                href="https://github.com/ValenBloodhunter"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-3 font-mono text-sm tracking-widest text-accent"
              >
                GITHUB
                <ArrowUpRight size={18} />
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}