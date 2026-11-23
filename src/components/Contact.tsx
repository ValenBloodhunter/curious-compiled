import { profile } from "../data/profile";

export default function Contact() {
  const email = profile.publicEmail.trim();
  const mailtoHref = email
    ? `mailto:${email}?subject=${encodeURIComponent("Hello from your portfolio")}`
    : null;

  return (
    <section id="contact" aria-labelledby="contact-heading" className="page-shell section contact">
      <h2 id="contact-heading">Let's make something.</h2>
      <p>Interesting problems, collaborations, and good conversations are always welcome.</p>
      {mailtoHref ? (
        <a className="text-link contact-email" href={mailtoHref}>{email}</a>
      ) : (
        <a className="text-link" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">Get in touch on GitHub</a>
      )}
    </section>
  );
}
