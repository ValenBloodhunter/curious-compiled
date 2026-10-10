
import { motion, useReducedMotion } from "motion/react";
import SectionHeading from "./SectionHeading";

const explorations = [
  {
    number: "01",
    title: "ALGORITHMS",
    subtitle: "PROBLEM SOLVING / COMPETITIVE PROGRAMMING",
    description:
      "Getting better at problem solving, one contest at a time. Exploring algorithms, data structures, and the mathematics behind efficient solutions.",
    reference: "LOGIC / 001",
  },
  {
    number: "02",
    title: "INTELLIGENT SYSTEMS",
    subtitle: "MACHINE LEARNING / AI",
    description:
      "Exploring what useful machine learning actually looks like. From understanding models to building systems that make intelligent decisions.",
    reference: "INTELLIGENCE / 002",
  },
  {
    number: "03",
    title: "HARDWARE & SYSTEMS",
    subtitle: "EMBEDDED SYSTEMS / ROBOTICS",
    description:
      "Experimenting with the connection between code and the physical world. Curious about microcontrollers, control systems, and robotics.",
    reference: "PHYSICAL / 003",
  },
];

export default function Explorations() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="lab"
      aria-label="Current explorations"
      className="page-shell border-t border-line py-24 sm:py-32"
    >
      <SectionHeading
        number="03"
        label="IN THE LAB"
        title="Always somewhere between idea and prototype."
        description="A few directions my curiosity keeps pulling me toward."
      />

      {/* Field notes */}
      <div className="mt-16 border-t border-line sm:mt-24">
        {explorations.map((item, index) => (
          <motion.div
            key={item.number}
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 18 }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.5,
              delay: reduceMotion ? 0 : index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group relative border-b border-line py-9 transition-colors duration-300 hover:border-accent/40 sm:py-12"
          >
            <div className="grid items-start gap-5 lg:grid-cols-12 lg:gap-8">

              {/* Index */}
              <div className="lg:col-span-1">
                <span className="font-mono text-xs tracking-widest text-accent">
                  {item.number}
                </span>
              </div>

              {/* Exploration heading */}
              <div className="lg:col-span-5">
                <h3 className="font-display text-[clamp(1.8rem,3.4vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.05em] text-ink transition-colors duration-300 group-hover:text-accent">
                  {item.title}
                </h3>

                <p className="mt-4 font-mono text-[10px] tracking-[0.12em] text-muted">
                  {item.subtitle}
                </p>
              </div>

              {/* Description */}
              <div className="lg:col-span-5">
                <p className="max-w-md text-sm leading-[1.9] text-muted sm:text-base">
                  {item.description}
                </p>
              </div>

              {/* Technical marker */}
              <div className="hidden justify-end lg:col-span-1 lg:flex">
                <span className="font-mono text-xl text-line transition-colors duration-300 group-hover:text-accent">
                  +
                </span>
              </div>
            </div>

            {/* Subtle hover indicator */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full"
            />
          </motion.div>
        ))}
      </div>

      {/* Closing note */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />

          <p className="font-mono text-[10px] tracking-[0.15em] text-muted">
            FIELD NOTES / CONTINUOUSLY EVOLVING
          </p>
        </div>

        <span className="font-mono text-[10px] tracking-[0.15em] text-muted">
          LEARN → BUILD → REPEAT
        </span>
      </div>
    </section>
  );
}
