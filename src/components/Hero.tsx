import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import CoordinateMotif from "./CoordinateMotif";

const headline = ["I LIKE HARD", "PROBLEMS.", "AND MAKING", "THINGS WORK."];

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="hero-heading" className="hero-stage relative overflow-hidden">
      <div aria-hidden="true" className="hero-ambient" />
      <div className="page-shell relative z-10 grid min-h-[calc(100svh-5rem)] items-center gap-x-10 gap-y-12 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : .5 }}
            className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-muted sm:text-xs"
          >
            <span className="eyebrow-mark" aria-hidden="true" />
            INDEPENDENT BUILDER <span className="text-accent">/</span> SRM UNIVERSITY AP
          </motion.p>

          <h1
            id="hero-heading"
            className="mt-11 font-display text-[clamp(2.15rem,9vw,6.9rem)] font-bold leading-[.96] tracking-[-.075em] sm:text-[clamp(3.9rem,7.3vw,6.9rem)] lg:text-[clamp(4rem,6.7vw,6.9rem)]"
          >
            {headline.map((line, index) => (
              <motion.span
                key={line}
                className="block w-fit whitespace-nowrap"
                initial={reduced ? false : { opacity: 0, y: 22, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: reduced ? 0 : .72, delay: reduced ? 0 : .1 + index * .105, ease: [.16,1,.3,1] }}
              >
                {index === 3 ? (
                  <span className="relative inline-block">
                    <span className="hero-gradient-type">{line}</span>
                    <motion.span
                      aria-hidden="true"
                      className="hero-underline"
                      initial={reduced ? false : { scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: reduced ? 0 : .82, delay: reduced ? 0 : .82, ease: [.16,1,.3,1] }}
                    />
                  </span>
                ) : line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : .6, delay: reduced ? 0 : .6 }}
            className="mt-9 max-w-xl text-base leading-[1.85] text-muted sm:text-lg"
          >
            Algorithms, intelligent systems, and ideas that refuse to stay ideas.
            <span className="text-ink"> I like building what I can imagine.</span>
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : .6, delay: reduced ? 0 : .75 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <a className="hero-cta group" href="#work">
              EXPLORE MY WORK <ArrowDownRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
            </a>
            <a className="hero-cta-secondary group font-mono text-[11px] tracking-[.1em] text-ink" href="https://github.com/ValenBloodhunter" target="_blank" rel="noopener noreferrer">
              GITHUB <ArrowUpRight size={17} className="text-accent transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </motion.div>
          <div className="mt-16 hidden items-center gap-3 font-mono text-[10px] tracking-[.16em] text-muted lg:flex">
            <span className="h-px w-10 bg-accent/65" /> SCROLL TO EXPLORE <span className="text-accent">↓</span> 001
          </div>
        </div>

        <div className="lg:col-span-4">
          <CoordinateMotif />
          <div className="mt-7 flex items-center gap-3 border-t border-line/75 pt-5 font-mono text-[10px] tracking-[.12em] text-muted">
            <Sparkles size={15} className="text-accent" aria-hidden="true" />
            <span>CURRENTLY BUILDING / LEARNING</span>
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_14px_rgba(134,244,218,.7)]" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
