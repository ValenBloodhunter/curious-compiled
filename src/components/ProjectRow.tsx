import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "../data/projects";

type VisualProps = { children: ReactNode; name: string; fig: string; variant: string };

function VisualFrame({ children, name, fig, variant }: VisualProps) {
  return (
    <div aria-hidden="true" className={`project-visual project-visual--${variant} flex flex-col justify-between p-5 sm:p-7`}>
      <div className="relative z-10 flex justify-between gap-3 border-b border-line/65 pb-4 visual-caption">
        <span>{name}</span><span>{fig}</span>
      </div>
      <div className="relative z-10 flex-1">{children}</div>
      <div className="relative z-10 mt-4 flex justify-between gap-2 border-t border-line/65 pt-4 visual-caption">
        <span>PROJECT / CONCEPT VISUAL</span><span className="text-accent">●</span>
      </div>
    </div>
  );
}

function WarrantyVisual() {
  return (
    <VisualFrame name="WARRANTY / ROUTING SYSTEM" fig="FIG 01" variant="warranty">
      <div className="mx-auto flex max-w-[340px] flex-col items-center py-8">
        <div className="visual-glass rounded-md px-7 py-2.5 text-center visual-mono text-[10px] tracking-widest text-ink">INCOMING QUERY</div>
        <span className="h-8 w-px bg-accent/55" />
        <div className="relative w-full rounded-lg border border-[#8c91f5]/50 bg-[#47427e]/25 p-5 text-center shadow-[0_0_32px_rgba(149,119,240,.10)]">
          <p className="visual-caption text-[#bcaeff]">DECISION ENGINE / τ</p>
          <p className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">Cost <span className="text-[#a69aff]">×</span> Quality</p>
          <p className="mt-2 visual-mono text-[10px] text-muted">R(τ) ≤ ε</p>
        </div>
        <div className="h-7 w-px bg-[#9d96ef]/50" />
        <div className="w-[60%] border-t border-[#9d96ef]/55" />
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center">
            <div className="h-5 w-px bg-[#9d96ef]/55" />
            <div className="w-full rounded-md border border-accent/35 bg-accent/[.06] p-3 text-center">
              <p className="visual-caption text-accent">ROUTE A</p>
              <p className="mt-2 font-display text-sm font-semibold text-ink">CHEAP MODEL</p>
              <p className="mt-1 text-[9px] tracking-wider text-muted visual-mono">IF QUALIFIED</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-5 w-px bg-[#9d96ef]/55" />
            <div className="w-full rounded-md border border-[#9b97df]/30 bg-[#9087ff]/[.06] p-3 text-center">
              <p className="visual-caption text-[#bbaeff]">ROUTE B</p>
              <p className="mt-2 font-display text-sm font-semibold text-ink">FRONTIER</p>
              <p className="mt-1 text-[9px] tracking-wider text-muted visual-mono">FALLBACK</p>
            </div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function VeilVisual() {
  return (
    <VisualFrame name="VEIL / SIGNAL DETECTION" fig="FIG 02" variant="veil">
      <div className="flex h-full flex-col justify-center py-9">
        <div className="flex justify-between visual-caption"><span>MESSAGE INPUT</span><span>SCAN_001</span></div>
        <div className="visual-glass mt-4 rounded-lg p-5 sm:p-7">
          <div className="flex gap-2"><i className="h-1.5 w-1.5 rounded-full bg-[#fb7e9a]/70"/><i className="h-1.5 w-1.5 rounded-full bg-[#f5ca6d]/70"/><i className="h-1.5 w-1.5 rounded-full bg-accent/70"/></div>
          <p className="mt-5 font-mono text-sm leading-[1.95] text-ink sm:text-base">
            Congratulations! <span className="rounded bg-accent/15 px-1 text-accent">Claim</span> your <span className="rounded bg-accent/15 px-1 text-accent">prize</span> now.
          </p>
          <div className="mt-7 flex gap-2">{["TF-IDF", "VECTOR", "CLASSIFY"].map(t => <span key={t} className="rounded border border-line/80 px-2 py-1 visual-caption">{t}</span>)}</div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="visual-caption">ILLUSTRATIVE OUTPUT</span>
          <span className="rounded-md border border-accent/35 bg-accent/10 px-4 py-2 font-mono text-xs font-semibold tracking-[.14em] text-accent">SPAM ↗</span>
        </div>
      </div>
    </VisualFrame>
  );
}

function SkillSetuVisual() {
  return (
    <VisualFrame name="SKILLSETU / VOICE DISCOVERY" fig="FIG 03" variant="skillsetu">
      <div className="flex h-full flex-col justify-center py-8">
        <div className="flex items-center justify-between visual-caption"><span>VOICE INPUT / ABSTRACT WAVEFORM</span><span className="text-[#d9bbff]">◉</span></div>
        <svg viewBox="0 0 400 112" className="mt-5 w-full" role="presentation">
          <defs><linearGradient id="voice-wave" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#70c1ff"/><stop offset=".5" stopColor="#c0a6ff"/><stop offset="1" stopColor="#87f2db"/></linearGradient></defs>
          <line x1="0" y1="56" x2="400" y2="56" stroke="#35455f"/>
          {Array.from({length: 37}, (_, i) => {
            const height = 7 + Math.abs(Math.sin(i * .59) * Math.cos(i * .22)) * 73;
            return <line key={i} x1={8+i*10.7} x2={8+i*10.7} y1={56-height/2} y2={56+height/2} stroke="url(#voice-wave)" strokeWidth="3" strokeLinecap="round" opacity={i<3 || i>34 ? .35 : .9}/>;
          })}
        </svg>
        <div className="mt-4 flex flex-col gap-3">
          {["Government schemes", "Livelihood opportunities"].map((text, i) => (
            <div key={text} className="visual-glass flex items-center justify-between gap-2 rounded-md p-4 text-sm text-ink">
              <span><span className="mr-3 font-mono text-[10px] text-[#c0a6ff]">0{i+1}</span>{text}</span><span className="text-accent">↗</span>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

function CampusFlowVisual() {
  return (
    <VisualFrame name="CAMPUSFLOW / ROUTE STUDY" fig="FIG 04" variant="campusflow">
      <div className="flex h-full flex-col justify-center py-7">
        <svg viewBox="0 0 400 235" className="w-full" role="presentation">
          <defs><linearGradient id="campus-route" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#79b4ff"/><stop offset="1" stopColor="#90f6e0"/></linearGradient></defs>
          <g stroke="#526784" strokeWidth="1" fill="#182940" fillOpacity=".65">
            <rect x="25" y="25" width="85" height="65" rx="3"/><rect x="135" y="25" width="105" height="45" rx="3"/>
            <rect x="270" y="25" width="100" height="90" rx="3"/><rect x="25" y="125" width="95" height="65" rx="3"/>
            <rect x="155" y="110" width="85" height="80" rx="3"/><rect x="275" y="150" width="95" height="40" rx="3"/>
          </g>
          <path d="M70 105 L70 108 L135 108 L135 85 L255 85 L255 135 L320 135" stroke="url(#campus-route)" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="5 8"/>
          <circle cx="70" cy="105" r="7" fill="#0e1423" stroke="#88c6ff" strokeWidth="2"/>
          <circle cx="320" cy="135" r="16" fill="#86f4da" fillOpacity=".1"/>
          <circle cx="320" cy="135" r="6" fill="#86f4da"/>
          <g fill="#9eafc8" fontFamily="monospace" fontSize="10"><text x="48" y="122">A</text><text x="336" y="144">B</text></g>
        </svg>
        <div className="mt-3 flex items-center justify-between border-t border-line/70 pt-4 visual-caption">
          <span>POINT A → POINT B</span><span className="text-[#97c7ff]">ROUTE / 001</span>
        </div>
      </div>
    </VisualFrame>
  );
}

function ProjectVisual({ type }: { type: Project["visual"] }) {
  switch(type) {
    case "warranty": return <WarrantyVisual />;
    case "veil": return <VeilVisual />;
    case "skillsetu": return <SkillSetuVisual />;
    case "campusflow": return <CampusFlowVisual />;
  }
}

export default function ProjectRow({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedMotion();
  const reverse = index % 2 === 1;

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .12 }}
      transition={{ duration: reduced ? 0 : .65, ease: [.16,1,.3,1] }}
      className="project-row border-t border-line py-14 sm:py-20"
    >
      <a href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} on GitHub`} className="group block rounded-md">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className={reverse ? "lg:order-2" : ""}>
            <p className="font-mono text-[11px] tracking-[.14em] text-muted">
              <span className="text-accent">{String(index+1).padStart(2,"0")}</span>
              <span className="mx-3 text-line">/</span>{project.category}
            </p>
            <h3 className="mt-7 font-display text-[clamp(3rem,6.6vw,6rem)] font-bold leading-[1] tracking-[-.075em] text-ink transition-colors duration-300 group-hover:text-accent">{project.name}</h3>
            <p className="mt-6 max-w-lg font-display text-xl font-medium leading-snug text-ink sm:text-2xl">{project.tagline}</p>
            <p className="mt-5 max-w-lg text-sm leading-[1.95] text-muted sm:text-base">{project.description}</p>
            <div className="mt-7 flex flex-wrap gap-x-4 gap-y-3">
              {project.stack.map((tech) => <span key={tech} className="font-mono text-[10px] tracking-[.08em] text-muted">{tech}</span>)}
            </div>
            <span className="mt-10 inline-flex items-center gap-3 border-b border-accent/40 pb-3 font-mono text-xs tracking-[.13em] text-ink transition-all group-hover:gap-5 group-hover:border-accent group-hover:text-accent">
              EXPLORE PROJECT <ArrowUpRight size={17} strokeWidth={1.5}/>
            </span>
          </div>
          <div className={reverse ? "lg:order-1" : ""}>
            <ProjectVisual type={project.visual} />
          </div>
        </div>
      </a>
    </motion.article>
  );
}
