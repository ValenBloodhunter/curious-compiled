
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "../data/projects";

// ============================================================
// WARRANTY — AI MODEL ROUTING VISUAL
// ============================================================

function WarrantyVisual() {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-[340px] flex-col justify-between border border-line bg-surface p-5 sm:p-8"
    >
      <div className="flex justify-between font-mono text-[10px] tracking-widest text-muted">
        <span>WARRANTY / ROUTING ENGINE</span>
        <span>FIG. 001</span>
      </div>

      <div className="my-8 flex flex-col items-center">
        {/* Incoming query */}
        <div className="border border-line px-7 py-3 font-mono text-xs tracking-widest text-ink">
          INCOMING QUERY
        </div>

        <div className="h-8 w-px bg-line" />

        {/* Decision engine */}
        <div className="w-full max-w-[260px] border border-accent/50 bg-accent/5 px-5 py-4 text-center">
          <p className="font-mono text-[10px] tracking-widest text-accent">
            INTELLIGENT ROUTER
          </p>

          <p className="mt-3 font-display text-xl font-semibold text-ink">
            Cost vs. Quality
          </p>

          <p className="mt-2 font-mono text-[10px] text-muted">
            RISK ≤ BUDGET
          </p>
        </div>

        {/* Branch diagram */}
        <div className="h-7 w-px bg-line" />
        <div className="h-px w-1/2 bg-line" />

        <div className="grid w-full grid-cols-2 gap-4">
          {/* Cheap model */}
          <div className="flex flex-col items-center">
            <div className="h-6 w-px bg-line" />

            <div className="w-full border border-accent/40 p-4 text-center">
              <p className="font-mono text-[10px] text-accent">
                ROUTE A
              </p>

              <p className="mt-2 font-display text-sm font-semibold text-ink sm:text-lg">
                CHEAP MODEL
              </p>

              <p className="mt-2 font-mono text-[9px] text-muted">
                IF QUALIFIED
              </p>
            </div>
          </div>

          {/* Frontier model */}
          <div className="flex flex-col items-center">
            <div className="h-6 w-px bg-line" />

            <div className="w-full border border-line p-4 text-center">
              <p className="font-mono text-[10px] text-muted">
                ROUTE B
              </p>

              <p className="mt-2 font-display text-sm font-semibold text-ink sm:text-lg">
                FRONTIER
              </p>

              <p className="mt-2 font-mono text-[9px] text-muted">
                FALLBACK
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line pt-5 font-mono text-[10px] tracking-wider">
        <span className="text-muted">
          OBJECTIVE / MINIMIZE COST
        </span>

        <span className="text-accent">
          R(τ) ≤ ε
        </span>
      </div>
    </div>
  );
}

// ============================================================
// VEIL — TEXT CLASSIFICATION VISUAL
// ============================================================

function VeilVisual() {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-[300px] flex-col justify-between border border-line bg-surface p-5 sm:p-8"
    >
      <div className="flex justify-between font-mono text-[10px] tracking-widest text-muted">
        <span>VEIL / ANALYSIS</span>
        <span>FIG. 002</span>
      </div>

      <div className="my-10">
        <p className="mb-4 font-mono text-[10px] tracking-widest text-muted">
          SAMPLE INPUT / MESSAGE
        </p>

        <div className="border-l-2 border-line pl-5">
          <p className="font-mono text-base leading-relaxed text-ink sm:text-lg">
            Congratulations! Claim your{" "}
            <span className="text-accent">
              prize
            </span>{" "}
            now.
          </p>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {["CLAIM", "PRIZE", "NOW"].map((word) => (
            <span
              key={word}
              className="border border-line px-3 py-1.5 font-mono text-[10px] text-muted"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-line pt-5">
        <span className="font-mono text-[10px] tracking-widest text-muted">
          ILLUSTRATIVE OUTPUT
        </span>

        <span className="font-mono text-sm tracking-widest text-accent">
          SPAM ↗
        </span>
      </div>
    </div>
  );
}

// ============================================================
// SKILLSETU — VOICE & RECOMMENDATIONS VISUAL
// ============================================================

function SkillSetuVisual() {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-[300px] flex-col justify-between border border-line bg-surface p-5 sm:p-8"
    >
      <div className="flex justify-between font-mono text-[10px] tracking-widest text-muted">
        <span>SKILLSETU / VOICE</span>
        <span>FIG. 003</span>
      </div>

      <div className="my-8">
        <p className="font-mono text-[10px] tracking-widest text-muted">
          VOICE-FIRST DISCOVERY
        </p>

        {/* Audio waveform */}
        <svg
          viewBox="0 0 400 110"
          className="mt-4 h-auto w-full"
        >
          <line
            x1="0"
            y1="55"
            x2="400"
            y2="55"
            stroke="var(--line)"
          />

          {Array.from({ length: 35 }).map((_, i) => {
            const height =
              8 +
              Math.abs(
                Math.sin(i * 0.65) *
                Math.cos(i * 0.23)
              ) * 70;

            return (
              <line
                key={i}
                x1={12 + i * 11}
                x2={12 + i * 11}
                y1={55 - height / 2}
                y2={55 + height / 2}
                stroke={
                  i > 9 && i < 25
                    ? "var(--accent)"
                    : "var(--muted)"
                }
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Recommendation list */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="text-sm text-ink">
              Government schemes
            </span>

            <span className="font-mono text-xs text-accent">
              ↗
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-ink">
              Livelihood opportunities
            </span>

            <span className="font-mono text-xs text-accent">
              ↗
            </span>
          </div>
        </div>
      </div>

      <p className="font-mono text-[10px] tracking-widest text-muted">
        CONCEPT VISUAL / NOT LIVE DATA
      </p>
    </div>
  );
}

// ============================================================
// CAMPUSFLOW — ABSTRACT CAMPUS ROUTE VISUAL
// ============================================================

function CampusFlowVisual() {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-[300px] flex-col justify-between border border-line bg-surface p-5 sm:p-8"
    >
      <div className="flex justify-between font-mono text-[10px] tracking-widest text-muted">
        <span>CAMPUSFLOW / ROUTES</span>
        <span>FIG. 004</span>
      </div>

      <div className="my-6">
        <svg
          viewBox="0 0 400 220"
          className="h-auto w-full"
        >
          {/* Abstract campus blocks */}
          <g
            stroke="var(--line)"
            strokeWidth="1"
            fill="none"
          >
            <rect
              x="25"
              y="25"
              width="85"
              height="65"
            />

            <rect
              x="135"
              y="25"
              width="105"
              height="45"
            />

            <rect
              x="270"
              y="25"
              width="100"
              height="90"
            />

            <rect
              x="25"
              y="125"
              width="95"
              height="65"
            />

            <rect
              x="155"
              y="110"
              width="85"
              height="80"
            />

            <rect
              x="275"
              y="150"
              width="95"
              height="40"
            />
          </g>

          {/* Route */}
          <path
            d="M 70 105 L 70 108 L 135 108 L 135 85 L 255 85 L 255 135 L 320 135"
            stroke="var(--accent)"
            strokeWidth="2"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray="5 6"
          />

          {/* Starting position */}
          <circle
            cx="70"
            cy="105"
            r="7"
            fill="var(--bg)"
            stroke="var(--accent)"
            strokeWidth="2"
          />

          {/* Destination */}
          <circle
            cx="320"
            cy="135"
            r="10"
            fill="var(--accent)"
            fillOpacity="0.15"
          />

          <circle
            cx="320"
            cy="135"
            r="4"
            fill="var(--accent)"
          />

          {/* Map labels */}
          <g
            fill="var(--muted)"
            fontFamily="monospace"
            fontSize="10"
          >
            <text x="50" y="120">A</text>
            <text x="333" y="140">B</text>
          </g>
        </svg>

        <div className="mt-4 flex justify-between border-t border-line pt-5 font-mono text-[10px] tracking-widest text-muted">
          <span>POINT A → POINT B</span>

          <span className="text-accent">
            ROUTE / 001
          </span>
        </div>
      </div>

      <p className="font-mono text-[10px] tracking-widest text-muted">
        ABSTRACT MAP / NOT LIVE DATA
      </p>
    </div>
  );
}

// ============================================================
// VISUAL SELECTOR
// ============================================================

function ProjectVisual({
  type,
}: {
  type: Project["visual"];
}) {
  switch (type) {
    case "warranty":
      return <WarrantyVisual />;

    case "veil":
      return <VeilVisual />;

    case "skillsetu":
      return <SkillSetuVisual />;

    case "campusflow":
      return <CampusFlowVisual />;
  }
}

// ============================================================
// MAIN PROJECT ROW COMPONENT
// ============================================================

type ProjectRowProps = {
  project: Project;
  index: number;
};

export default function ProjectRow({
  project,
  index,
}: ProjectRowProps) {
  const reduceMotion = useReducedMotion();

  const reversed = index % 2 !== 0;

  return (
    <motion.article
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
        amount: 0.15,
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="border-t border-line py-12 sm:py-20"
    >
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${project.name} repository on GitHub`}
        className="group block rounded-sm"
      >
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Project information */}
          <div
            className={
              reversed ? "lg:order-2" : ""
            }
          >
            {/* Project number and category */}
            <p className="font-mono text-xs tracking-[0.15em] text-muted">
              {String(index + 1).padStart(2, "0")}

              <span className="mx-3 text-line">
                /
              </span>

              {project.category}
            </p>

            {/* Project name */}
            <h3 className="mt-8 font-display text-[clamp(3rem,7vw,6rem)] font-bold leading-none tracking-[-0.07em] transition-colors duration-200 group-hover:text-accent">
              {project.name}
            </h3>

            {/* Project tagline */}
            <p className="mt-7 max-w-lg font-display text-xl font-medium leading-snug text-ink sm:text-2xl">
              {project.tagline}
            </p>

            {/* Description */}
            <p className="mt-5 max-w-lg text-sm leading-[1.9] text-muted sm:text-base">
              {project.description}
            </p>

            {/* Technologies */}
            <div className="mt-8 flex flex-wrap gap-x-4 gap-y-3">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[10px] tracking-wider text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Project link */}
            <div className="mt-12 inline-flex items-center gap-3 border-b border-line pb-3 font-mono text-xs tracking-widest text-ink transition-colors group-hover:border-accent group-hover:text-accent">
              VIEW PROJECT

              <ArrowUpRight
                size={17}
                strokeWidth={1.5}
                className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </div>
          </div>

          {/* Custom project visualization */}
          <div
            className={`transition-transform duration-300 group-hover:scale-[1.015] ${
              reversed ? "lg:order-1" : ""
            }`}
          >
            <ProjectVisual type={project.visual} />
          </div>

        </div>
      </a>
    </motion.article>
  );
}
