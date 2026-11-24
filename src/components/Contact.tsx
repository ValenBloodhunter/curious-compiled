import { ArrowUpRight } from "lucide-react";
import { profile } from "../data/profile";

export default function Contact() {
  const email = profile.publicEmail.trim();
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="shell contact"
    >
      <h2 id="contact-heading">
        <a href={email ? `mailto:${email}` : profile.githubUrl}>
          Say <em>hello.</em>
          <ArrowUpRight aria-hidden="true" />
        </a>
      </h2>
      <p>Have a project or a question in mind?</p>
      <a
        className="text-link"
        href={email ? `mailto:${email}` : profile.githubUrl}
      >
        {email || "Find me on GitHub"}
      </a>
    </section>
  );
}
