import { ArrowUpRight } from "lucide-react";
import { profile } from "../data/profile";

export default function Navbar() {
  return (
    <header className="site-nav page-shell">
      <a className="site-name" href="#top" aria-label="Curious Compiled, back to top">
        <span className="brand-symbol" aria-hidden="true">c/c</span>
        <span>curious<span className="brand-comma">,</span><br />compiled.</span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href="#work">Work</a><a href="#about">Human</a><a href="#lab">Signals</a>
      </nav>
      <a className="nav-contact" href={`mailto:${profile.publicEmail}`}>Let's connect <ArrowUpRight size={15} aria-hidden="true" /></a>
    </header>
  );
}
