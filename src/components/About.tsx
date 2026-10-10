
import { motion, useReducedMotion } from "motion/react";
import SectionHeading from "./SectionHeading";

const interests = [
  {
    number: "01",
    title: "THINKING IN ALGORITHMS",
    field: "COMPETITIVE PROGRAMMING",
  },
  {
    number: "02",
    title: "LEARNING FROM DATA",
    field: "MACHINE LEARNING / AI",
  },
  {
    number: "03",
    title: "TURNING IDEAS INTO TOOLS",
    field: "SOFTWARE & EXPERIMENTS",
  },
];

export default function About() {
  const reduceMotion = useReducedMotion();

  const reveal = {
    initial: reduceMotion
      ? false
      : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: {
      duration: reduceMotion ? 0 : 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  };

  return (
    <section
      id="about"
      aria-label="About me"
      className="page-shell border-t border-line py-24 sm:py-32"
    >
      <SectionHeading
        number="02"
        label="THE HUMAN BEHIND THE CODE"
        title="More than a stack."
      />

      {/* Main content */}
      <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-20">

        {/* Biography */}
        <motion.div
          {...reveal}
          className="lg:col-span-6"
        >
          <div className="mb-10 flex items-center gap-3">
            <span className="h-2 w-2 bg-accent" />

            <span className="font-mono text-[10px] tracking-[0.2em] text-muted">
              A LITTLE CONTEXT / 2026
            </span>
          </div>

          <p className="max-w-xl font-display text-[clamp(1.5rem,2.5vw,2.4rem)] font-medium leading-[1.5] tracking-[-0.025em] text-ink">
            I'm a B.Tech student at{" "}
            <span className="text-accent">
              SRM University AP
            </span>{" "}
            who enjoys the space between a hard problem
            and a working solution.
          </p>

          <p className="mt-8 max-w-lg text-base leading-[1.9] text-muted">
            Competitive programming sharpens how I think.
            Machine learning and software projects let me
            turn that thinking into something people can use.
          </p>

          <p className="mt-6 max-w-lg text-base leading-[1.9] text-muted">
            I'm interested in systems that are elegant under
            the hood and effortless on the surface. I learn
            by building, testing, breaking things, and doing
            them better the next time.
          </p>

          <div className="mt-12 flex items-center gap-4">
            <div className="h-px w-10 bg-accent" />

            <p className="font-mono text-[10px] tracking-[0.15em] text-muted">
              CURIOSITY → EXPERIMENT → ITERATION
            </p>
          </div>
        </motion.div>

        {/* Technical interests index */}
        <motion.div
          {...reveal}
          className="lg:col-span-6"
        >
          <div className="flex items-center justify-between border-b border-line pb-5">
            <span className="font-mono text-[10px] tracking-[0.15em] text-muted">
              INDEX / AREAS OF INTEREST
            </span>

            <span className="font-mono text-[10px] tracking-widest text-muted">
              001—003
            </span>
          </div>

          {interests.map((interest) => (
            <div
              key={interest.number}
              className="group grid grid-cols-[2rem_1fr] gap-4 border-b border-line py-8 transition-colors duration-300 hover:border-accent/40 sm:grid-cols-[3rem_1fr] sm:gap-5"
            >
              <span className="pt-1 font-mono text-xs text-accent">
                {interest.number}
              </span>

              <div>
                <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.025em] text-ink transition-colors duration-200 group-hover:text-accent sm:text-2xl">
                  {interest.title}
                </h3>

                <p className="mt-3 font-mono text-[10px] tracking-[0.12em] text-muted">
                  {interest.field}
                </p>
              </div>
            </div>
          ))}

          <div className="mt-8 flex justify-between font-mono text-[10px] tracking-[0.12em] text-muted">
            <span>ALWAYS LEARNING</span>
            <span>NO FINISH LINE ↗</span>
          </div>
        </motion.div>
      </div>

      {/* Achievement highlight */}
      <motion.div
        {...reveal}
        className="mt-24 border-t border-line pt-10 sm:mt-32"
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">

          <div className="lg:col-span-3">
            <p className="font-mono text-xs tracking-[0.15em] text-accent">
              RECOGNITION / 2026
            </p>
          </div>

          <div className="lg:col-span-9">
            <div className="group relative overflow-hidden border border-line bg-surface p-7 transition-colors duration-300 hover:border-accent/40 sm:p-12">

              {/* Technical corner details */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-7 w-7 border-l-2 border-t-2 border-accent"
              />

              <span
                aria-hidden="true"
                className="absolute bottom-0 right-0 h-7 w-7 border-b-2 border-r-2 border-accent"
              />

              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted">
                  CODEVIUM 2026
                </span>

                <span className="font-mono text-[10px] tracking-[0.2em] text-accent">
                  001 / ACHIEVEMENT
                </span>
              </div>

              <div className="mt-12">
                <p className="font-display text-[clamp(3.5rem,9vw,7.5rem)] font-bold leading-none tracking-[-0.075em] text-accent">
                  1ST
                  <span className="ml-3 text-ink sm:ml-5">
                    PLACE.
                  </span>
                </p>

                <div className="mt-8 h-px w-full bg-line" />

                <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
                  <div>
                    <p className="font-display text-xl font-semibold text-ink sm:text-2xl">
                      Codecraft Track
                    </p>

                    <p className="mt-2 font-mono text-xs tracking-wider text-muted">
                      SRM UNIVERSITY AP / CODEVIUM 2026
                    </p>
                  </div>

                  <span className="font-mono text-xl text-accent">
                    ↗
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.div>

    </section>
  );
}
