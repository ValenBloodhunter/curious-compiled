
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import CoordinateMotif from "./CoordinateMotif";

const headline = [
  "I LIKE HARD",
  "PROBLEMS.",
  "AND MAKING",
  "THINGS WORK.",
];

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden"
    >
      {/* Faint 12-column construction grid */}
      <div
        className="page-shell pointer-events-none absolute inset-0 hidden grid-cols-12 opacity-25 lg:grid"
        aria-hidden="true"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="border-r border-line"
          />
        ))}
      </div>

      <div className="page-shell relative z-10 grid min-h-[calc(100svh-5rem)] grid-cols-1 items-center gap-x-8 py-16 lg:grid-cols-12 lg:py-20">

        {/* Main headline */}
        <div className="lg:col-span-8">

          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.15em] text-muted sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>
              INDEPENDENT BUILDER / SRM UNIVERSITY AP
            </span>
          </div>

          <h1
            id="hero-heading"
            className="mt-10 font-display text-[clamp(2.4rem,10vw,5rem)] font-bold leading-[0.98] tracking-[-0.065em] sm:text-[clamp(4rem,8.1vw,7rem)] lg:text-[clamp(4.25rem,7vw,7.25rem)]"
          >
            {headline.map((line, index) => (
              <motion.span
                key={line}
                className="relative block w-fit whitespace-nowrap"
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: 16 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.55,
                  delay: reduceMotion ? 0 : 0.1 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line}

                {index === 3 && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute -bottom-2 left-0 h-[3px] w-full origin-left bg-accent sm:h-[4px]"
                    initial={reduceMotion ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.65,
                      delay: reduceMotion ? 0 : 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                )}
              </motion.span>
            ))}
          </h1>

          <div className="mt-12 flex flex-wrap items-center gap-7 sm:mt-16">
            <a
              href="#work"
              className="group inline-flex min-h-11 items-center gap-3 border-b border-accent pb-2 font-mono text-xs font-medium tracking-[0.1em] text-ink transition-colors hover:text-accent"
            >
              EXPLORE MY WORK
              <ArrowDownRight
                size={17}
                strokeWidth={1.5}
                className="transition-transform duration-200 group-hover:translate-x-1 group-hover:translate-y-1"
              />
            </a>

            <a
              href="https://github.com/ValenBloodhunter"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-[0.1em] text-muted transition-colors hover:text-ink"
            >
              GITHUB
              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>
          </div>

          <div className="mt-16 hidden font-mono text-[10px] tracking-[0.15em] text-muted lg:block">
            SCROLL TO EXPLORE — 001
          </div>
        </div>

        {/* Coordinate motif and introduction */}
        <div className="mt-14 border-t border-line pt-8 lg:col-span-4 lg:mt-0 lg:border-t-0 lg:border-l lg:py-6 lg:pl-8">
          <CoordinateMotif />

          <div className="mt-8">
            <p className="max-w-sm font-body text-base leading-[1.8] text-muted">
              I build at the intersection of{" "}
              <span className="text-ink">algorithms</span>,{" "}
              <span className="text-ink">
                intelligent systems
              </span>
              , and ideas that refuse to stay ideas.
            </p>

            <div className="mt-9 flex items-center gap-3 border-t border-line pt-6">
              <span className="relative flex h-2 w-2">
                <span
                  aria-hidden="true"
                  className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-20"
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>

              <span className="font-mono text-[10px] tracking-[0.12em] text-muted">
                CURRENTLY BUILDING / LEARNING
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
