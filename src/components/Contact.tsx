import { ArrowUpRight } from "lucide-react";
import { portfolio } from "../data/portfolio";

export default function Contact() {
  const email = portfolio.contact.email.trim();
  const href = email ? `mailto:${email}` : portfolio.contact.github;
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="shell contact"
    >
      <h2 id="contact-heading">
        <a href={href}>
          Say <em>hello.</em>
          <ArrowUpRight aria-hidden="true" />
        </a>
      </h2>
      <p>Have a project or a question in mind?</p>
      <a
        className="text-link"
        href={href}
      >
        {email || "Find me on GitHub"}
      </a>
    </section>
  );
}
