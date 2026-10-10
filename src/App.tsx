export default function App() {
  return (
    <main className="min-h-svh bg-bg text-ink">
      <div className="page-shell">

        <header className="flex h-20 items-center justify-between border-b border-line">
          <span className="font-display text-2xl font-bold">
            V<span className="text-accent">/</span>
          </span>

          <span className="font-mono text-xs tracking-widest text-muted">
            PORTFOLIO / 2026
          </span>
        </header>

        <section className="flex min-h-[calc(100svh-5rem)] flex-col justify-center py-20">

          <p className="font-mono text-xs tracking-[0.2em] text-muted">
            INDEPENDENT BUILDER / SRM UNIVERSITY AP
          </p>

          <h1 className="mt-8 font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.95] tracking-[-0.07em]">
            CURIOUS,
            <br />
            <span className="text-accent">COMPILED.</span>
          </h1>

          <p className="mt-10 max-w-lg border-l-2 border-accent pl-5 text-base leading-relaxed text-muted">
            Algorithms. Intelligent systems. Ideas that refuse
            to stay ideas.
          </p>

          <div className="mt-16 font-mono text-xs tracking-widest text-muted">
            SCROLL TO EXPLORE — 001
          </div>

        </section>

      </div>
    </main>
  );
}