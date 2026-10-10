
import { ArrowUpRight } from "lucide-react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SectionHeading from "./components/SectionHeading";
import ProjectRow from "./components/ProjectRow";
import About from "./components/About";
import Explorations from "./components/Explorations";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import { projects } from "./data/projects";

export default function App() {
  return (
    <div className="min-h-svh bg-bg text-ink">
      {/* NAVIGATION */}
      <Navbar />

      <main id="top">
        {/* HERO */}
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

        {/* ABOUT */}
        <About />

        {/* CURRENT EXPLORATIONS */}
        <Explorations />

        {/* CONTACT */}
        <Contact />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
