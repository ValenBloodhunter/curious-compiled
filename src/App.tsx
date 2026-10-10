
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

export default function App() {
  return (
    <div className="min-h-svh bg-bg text-ink">
      <Navbar />

      <main id="top">
        <Hero />

        {/* Temporary Work Section */}
        <section
          id="work"
          className="page-shell border-t border-line py-28"
        >
          <p className="font-mono text-xs tracking-widest text-accent">
            01 / SELECTED WORK
          </p>

          <h2 className="mt-6 font-display text-5xl font-bold">
            Proof of curiosity.
          </h2>

          <p className="mt-4 text-muted">
            Selected projects will appear here.
          </p>
        </section>

        {/* Temporary About Section */}
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

        {/* Temporary Contact Section */}
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
