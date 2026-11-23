import { ArrowUpRight } from "lucide-react";
import { profile } from "../data/profile";

export default function Contact() {
  const email = profile.publicEmail.trim();
  return (
    <section id="contact" aria-labelledby="contact-heading" className="page-shell section contact">
      <div className="contact-top"><span>GOOD THINGS START WITH A CONVERSATION.</span><span className="status-dot" /></div>
      <h2 id="contact-heading">Have a signal?<br /><a href={email ? `mailto:${email}` : profile.githubUrl}>Send it my way.<ArrowUpRight aria-hidden="true" /></a></h2>
      <div className="contact-bottom"><p>Ideas, difficult problems, or a simple hello.<br />I'd like to hear it.</p><a className="text-link contact-email" href={email ? `mailto:${email}` : profile.githubUrl}>{email || "Find me on GitHub"}</a></div>
    </section>
  );
}
