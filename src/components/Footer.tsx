import { ArrowUp } from "lucide-react";
import { profile } from "../data/profile";

export default function Footer() {
  return (
    <footer className="shell footer">
      <p>
        © {new Date().getFullYear()} {profile.displayName}
      </p>
      <nav aria-label="Footer navigation">
        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        {profile.linkedinUrl.trim() && (
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        )}
        <a href="#top">
          Back to top <ArrowUp size={14} />
        </a>
      </nav>
    </footer>
  );
}
