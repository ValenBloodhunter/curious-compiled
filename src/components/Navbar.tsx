import { profile } from "../data/profile";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === "dark");

  function toggleTheme() {
    const theme = dark ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#e9eff8" : "#0c1220");
    setDark(!dark);
    try { localStorage.setItem("theme", theme); } catch { /* Keep the toggle usable when storage is blocked. */ }
  }

  return (
    <header className="page-shell site-nav">
      <a className="site-name" href="#top" aria-label="Back to top">{profile.displayName}</a>
      <div className="nav-actions">
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>
          {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
