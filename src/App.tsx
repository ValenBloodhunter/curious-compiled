import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SectionHeading from "./components/SectionHeading";
import ProjectRow from "./components/ProjectRow";
import About from "./components/About";
import Explorations from "./components/Explorations";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { projects } from "./data/projects";
import { profile } from "./data/profile";

export default function App() {
  return (
    <div id="top">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-bg focus:p-4">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <section id="work" aria-label="Selected work" className="page-shell section">
          <SectionHeading title="Selected work" description="A few things I've built, tested, and learned from." />
          <div>
            {projects.map((project) => <ProjectRow key={project.id} project={project} />)}
          </div>
          <a href={`${profile.githubUrl}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="text-link more-work">More on GitHub</a>
        </section>
        <About />
        <Explorations />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
