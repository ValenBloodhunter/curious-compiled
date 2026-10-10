
import { ArrowUpRight, Mail } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { profile } from "../data/profile";

export default function Contact() {
  const reduceMotion = useReducedMotion();

  const email = profile.publicEmail.trim();

  const mailtoHref = email
    ? `mailto:${email}?subject=${encodeURIComponent(
        "Hello from your portfolio"
      )}`
    : null;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden border-t border-line"
    >
      <div className="page-shell relative py-24 sm:py-32 lg:py-40">

        {/* Section index */}
        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 12 }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex flex-wrap items-center justify-between gap-4"
        >
          <p className="font-mono text-xs tracking-[0.15em] text-accent">
            04 / SAY HELLO
          </p>

          <p className="font-mono text-[10px] tracking-[0.15em] text-muted">
            IDEAS ARE MEANT TO BE BUILT
          </p>
        </motion.div>

        {/* Main typography */}
        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 25 }
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
            duration: reduceMotion ? 0 : 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <h2
            id="contact-heading"
            className="font-display text-[clamp(2.75rem,9vw,9rem)] font-bold leading-[0.98] tracking-[-0.075em]"
          >
            <span className="block">
              HAVE AN IDEA?
            </span>

            <span className="mt-2 block">
              LET'S MAKE
            </span>

            {mailtoHref ? (
              <a
                href={mailtoHref}
                className="group mt-2 inline-flex items-center gap-3 text-accent transition-opacity duration-300 hover:opacity-75 sm:gap-7"
                aria-label="Send me an email"
              >
                IT REAL.

                <ArrowUpRight
                  aria-hidden="true"
                  className="h-[0.65em] w-[0.65em] shrink-0 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2"
                />
              </a>
            ) : (
              <span className="mt-2 inline-flex items-center gap-3 text-accent sm:gap-7">
                IT REAL.

                <ArrowUpRight
                  aria-hidden="true"
                  className="h-[0.65em] w-[0.65em] shrink-0 stroke-[1.5]"
                />
              </span>
            )}
          </h2>
        </motion.div>

        {/* Description and action */}
        <div className="mt-16 grid gap-10 border-t border-line pt-10 lg:mt-24 lg:grid-cols-12 lg:gap-12">

          <div className="lg:col-span-6">
            <p className="max-w-lg font-display text-xl leading-relaxed tracking-[-0.02em] text-ink sm:text-2xl">
              Interesting problems, collaborations,
              and good conversations are always welcome.
            </p>

            <p className="mt-5 max-w-md text-sm leading-[1.9] text-muted sm:text-base">
              Whether it's a challenging technical idea,
              a project worth exploring, or simply
              something interesting to discuss.
            </p>
          </div>

          <div className="flex flex-col items-start justify-between gap-10 lg:col-span-6 lg:items-end">

            {/* Main action */}
            {mailtoHref ? (
              <a
                href={mailtoHref}
                className="group inline-flex min-h-14 items-center gap-6 border border-accent bg-accent px-7 py-4 font-mono text-xs font-semibold tracking-[0.12em] text-bg transition-colors duration-300 hover:bg-transparent hover:text-accent"
              >
                <Mail size={18} strokeWidth={1.5} />

                SEND AN EMAIL

                <ArrowUpRight
                  size={18}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            ) : (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-14 items-center gap-6 border border-accent bg-accent px-7 py-4 font-mono text-xs font-semibold tracking-[0.12em] text-bg transition-colors duration-300 hover:bg-transparent hover:text-accent"
              >
                VIEW MY GITHUB

                <ArrowUpRight
                  size={18}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            )}

            {/* Contact metadata */}
            <div className="space-y-3 lg:text-right">
              <p className="font-mono text-[10px] tracking-[0.2em] text-muted">
                CONNECT / COLLABORATE / CREATE
              </p>

              {email && (
                <a
                  href={mailtoHref ?? undefined}
                  className="block break-all font-mono text-xs text-ink transition-colors hover:text-accent sm:text-sm"
                >
                  {email}
                </a>
              )}

              <span className="block font-mono text-[10px] tracking-widest text-muted">
                ALWAYS CURIOUS ABOUT WHAT'S NEXT.
              </span>
            </div>
          </div>
        </div>

        {/* Decorative bottom marker */}
        <div
          aria-hidden="true"
          className="mt-20 flex items-center gap-3 sm:mt-28"
        >
          <span className="h-2 w-2 rounded-full bg-accent" />

          <div className="h-px flex-1 bg-line" />

          <span className="font-mono text-[10px] tracking-widest text-muted">
            END / 004
          </span>
        </div>
      </div>
    </section>
  );
}
