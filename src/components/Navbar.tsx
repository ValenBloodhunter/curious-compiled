import { useRef } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const sections = [
  ["work", "Work"],
  ["about", "About"],
  ["lab", "Field notes"],
  ["contact", "Contact"],
] as const;

export default function Navbar() {
  const menu = useRef<HTMLDialogElement>(null);
  return (
    <header className="site-nav">
      <a href="#top" className="wordmark" aria-label="Debashis Das home">
        <svg
          viewBox="0 0 36 28"
          width="36"
          height="28"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M19 3h-7L3 14l9 11h7M32 3h-7L16 14l9 11h7"
            stroke="currentColor"
            strokeWidth="4.2"
          />
        </svg>
        Debashis Das
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {sections.slice(0, 3).map(([id, name]) => (
          <a key={id} href={`#${id}`}>
            {name}
          </a>
        ))}
      </nav>
      <a className="header-contact" href="#contact">
        Get in touch <ArrowUpRight size={15} />
      </a>
      <button
        className="menu-trigger"
        onClick={() => menu.current?.showModal()}
        aria-haspopup="dialog"
      >
        Menu <Menu size={17} />
      </button>
      <dialog ref={menu} className="index" aria-label="Site menu" data-lenis-prevent>
        <button
          className="close"
          aria-label="Close menu"
          onClick={() => menu.current?.close()}
        >
          <X />
        </button>
        <nav>
          {sections.map(([id, name]) => (
            <a key={id} href={`#${id}`} onClick={() => menu.current?.close()}>
              {name}
              <ArrowUpRight />
            </a>
          ))}
        </nav>
      </dialog>
    </header>
  );
}
