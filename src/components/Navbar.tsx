import { useRef } from "react";
import { Menu, X } from "lucide-react";
export default function Navbar() {
  const menu = useRef<HTMLDialogElement>(null);
  return (
    <header className="site-nav">
      <a href="#top" className="monogram" aria-label="Curious Compiled home">
        c/c.
      </a>
      <button
        className="menu-trigger"
        onClick={() => menu.current?.showModal()}
        aria-haspopup="dialog"
      >
        Index <Menu size={15} aria-hidden="true" />
      </button>
      <dialog ref={menu} className="index" aria-label="Site index">
        <button
          className="close"
          aria-label="Close index"
          onClick={() => menu.current?.close()}
        >
          <X />
        </button>
        <nav>
          {[
            ["work", "Selected work"],
            ["about", "About"],
            ["lab", "Experiments"],
            ["contact", "Contact"],
          ].map(([id, name]) => (
            <a key={id} href={`#${id}`} onClick={() => menu.current?.close()}>
              {name}
            </a>
          ))}
        </nav>
      </dialog>
    </header>
  );
}
