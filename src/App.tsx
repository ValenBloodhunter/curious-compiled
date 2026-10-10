
import { ArrowUpRight } from "lucide-react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SectionHeading from "./components/SectionHeading";
import ProjectRow from "./components/ProjectRow";

import { projects } from "./data/projects";

export default function App() {
  return (
    <div className="min-h-svh bg-bg text-ink">
      <Navbar />

      <main id="top">
        <Hero />

        {/* SELECTED WORK */}
        <section
          id="work"
          className="page-shell border-t border-line py-24 sm:py-32"
        >
          <SectionHeading
            number="01"
            label="SELECTED WORK"
            title="Proof of curiosity."
            description="A few things I've built, broken, fixed, and learned from."
          />

          <div className="mt-16 sm:mt-24">
            {projects.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>

          <a
            href="https://github.com/ValenBloodhunter?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-12 inline-flex min-h-11 items-center gap-3 font-mono text-xs tracking-widest text-muted transition-colors hover:text-accent"
          >
            MORE EXPERIMENTS ON GITHUB
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </section>

        {/* ABOUT — temporary */}
        <section
          id="about"
          className="page-shell border-t border-line py-28"
        >
          <p className="font-mono text-xs tracking-widest text-accent">
            02 / ABOUT
          </p>

          <h2 className="mt-6 font-display text-5xl font-bold">
            More than a stack.
          </h2>
        </section>

        {/* CONTACT — temporary */}
        <section
          id="contact"
          className="page-shell border-t border-line py-28"
        >
          <p className="font-mono text-xs tracking-widest text-accent">
            04 / SAY HELLO
          </p>

          <h2 className="mt-6 font-display text-5xl font-bold">
            Have an idea?
          </h2>
        </section>
      </main>
    </div>
  );
}
