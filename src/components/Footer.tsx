import { profile } from "../data/profile";

export default function Footer() {
  return (
    <footer className="page-shell footer">
      <p>&copy; {new Date().getFullYear()} {profile.displayName.trim() || profile.tagline}</p>
      <nav aria-label="Footer navigation">
        <a className="text-link" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
        {profile.linkedinUrl.trim() && (
          <a className="text-link" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        )}
        <a className="text-link" href="#top">Back to top</a>
      </nav>
    </footer>
  );
}
