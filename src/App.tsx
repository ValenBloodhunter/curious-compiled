import { ArrowUpRight } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProjectRow from "./components/ProjectRow";
import About from "./components/About";
import Explorations from "./components/Explorations";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { portfolio } from "./data/portfolio";
import { profile } from "./data/profile";

export default function App() {
  return (
    <div id="top">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <section
          id="work"
          aria-labelledby="work-heading"
          className="shell work"
        >
          <div className="section-heading">
            <h2 id="work-heading">
              Selected <em>work.</em>
            </h2>
            <a
              href={`${profile.githubUrl}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              All repositories <ArrowUpRight size={16} />
            </a>
          </div>
          {portfolio.projects.map((project, i) => (
            <ProjectRow key={project.id} project={project} first={i === 0} />
          ))}
        </section>
        <About />
        <Explorations />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
