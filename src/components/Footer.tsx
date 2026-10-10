
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { profile } from "../data/profile";

export default function Footer() {
  const year = new Date().getFullYear();

  const footerName =
    profile.displayName.trim() || profile.tagline;

  return (
    <footer className="border-t border-line bg-bg">
      <div className="page-shell py-10 sm:py-14">

        {/* Upper footer */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">

          {/* Brand */}
          <div>
            <a
              href="#top"
              aria-label="Back to top"
              className="inline-block font-display text-3xl font-bold tracking-[-0.05em] text-ink transition-colors hover:text-accent"
            >
              V
              <span className="text-accent">
                /
              </span>
            </a>

            <p className="mt-5 font-mono text-[10px] tracking-[0.15em] text-muted">
              BUILT WITH INTENTION.
              <br />
              NOT A TEMPLATE.
            </p>
          </div>

          {/* Links */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-8 gap-y-5"
          >
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-widest text-muted transition-colors hover:text-accent"
            >
              GITHUB

              <ArrowUpRight
                size={15}
                strokeWidth={1.5}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>

            {profile.linkedinUrl.trim() && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-widest text-muted transition-colors hover:text-accent"
              >
                LINKEDIN

                <ArrowUpRight
                  size={15}
                  strokeWidth={1.5}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            )}

            <a
              href="#top"
              className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-widest text-ink transition-colors hover:text-accent"
            >
              BACK TO TOP

              <ArrowUp
                size={15}
                strokeWidth={1.5}
                className="transition-transform group-hover:-translate-y-1"
              />
            </a>
          </nav>
        </div>

        {/* Bottom divider */}
        <div className="mt-14 border-t border-line pt-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <p className="font-mono text-[10px] tracking-[0.1em] text-muted">
              © {year} {footerName}
            </p>

            <p className="font-mono text-[10px] tracking-[0.2em] text-ink">
              CURIOUS,
              <span className="text-accent">
                {" "}COMPILED.
              </span>
            </p>

          </div>
        </div>
      </div>
    </footer>
  );
}
