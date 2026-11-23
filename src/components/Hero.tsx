import { ArrowDown, ArrowUpRight } from "lucide-react";
import NeuralPortrait from "./NeuralPortrait";

export default function Hero() {
  return (
    <div className="hero-scroll">
    <section aria-labelledby="hero-heading" className="hero">
      <NeuralPortrait />
      <div className="hero-layout page-shell">
        <h1 id="hero-heading">Human<br /><span>instinct.</span></h1>
        <p className="hero-description">Debashis Das.<br />Building at the intersection of algorithms, intelligent systems, and a restless mind.</p>
        <p className="hero-counterpart" aria-hidden="true">Machine<br /><span>precision.</span></p>
        <div className="hero-chapter">
          <h2>Instinct becomes<br /><span>intelligence.</span></h2>
          <p>A thought takes shape. A system takes form.<br />The work begins where the two connect.</p>
        </div>
        <div className="hero-bottom">
          <a href="#work" className="hero-enter">Enter the work <ArrowDown size={17} aria-hidden="true" /></a>
          <span className="hero-status"><i /> Scroll to transform. Keep going to explore.</span>
          <a href="#about" className="hero-credit">The human behind it <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </div>
      <div className="story-track" aria-hidden="true"><span /></div>
    </section>
    </div>
  );
}
