import { profile } from "../data/profile";

export default function Navbar() {
  return (
    <header className="page-shell site-nav">
      <a className="site-name" href="#top" aria-label="Back to top">{profile.displayName}</a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}
