
export type Project = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  stack: string[];
  href: string;
  visual: "warranty" | "veil" | "skillsetu" | "campusflow";
};

export const projects: Project[] = [
  {
    id: "warranty",
    name: "WARRANTY",
    category: "LLM SYSTEMS / OPTIMIZATION",
    tagline: "Making AI cheaper without ignoring quality.",
    description:
      "A cost-aware LLM routing system that estimates query difficulty and calibrates routing decisions against a user-defined quality-regression budget. Explores statistical certification, verification, caching, and live auditing.",
    stack: [
      "JAVASCRIPT",
      "PYTHON",
      "TF-IDF / SVD",
      "KNN",
      "STATISTICAL TESTING",
    ],
    href: "https://github.com/ValenBloodhunter/Warranty",
    visual: "warranty",
  },
  {
    id: "veil",
    name: "VEIL",
    category: "MACHINE LEARNING / NLP",
    tagline: "Turning noisy messages into a clear signal.",
    description:
      "A text spam classifier using TF-IDF and Multinomial Naive Bayes, achieving approximately 98% test accuracy on the evaluated dataset.",
    stack: [
      "PYTHON",
      "SCIKIT-LEARN",
      "TF-IDF",
      "NAIVE BAYES",
    ],
    href: "https://github.com/ValenBloodhunter/Veil",
    visual: "veil",
  },
  {
    id: "skillsetu",
    name: "SKILLSETU",
    category: "AI / ACCESSIBILITY",
    tagline: "Making opportunities easier to discover.",
    description:
      "A voice-oriented hackathon prototype helping users discover relevant government schemes and livelihood opportunities.",
    stack: [
      "PYTHON",
      "STREAMLIT",
      "LLM INTEGRATION",
    ],
    href: "https://github.com/ValenBloodhunter/SkillSetu",
    visual: "skillsetu",
  },
  {
    id: "campusflow",
    name: "CAMPUSFLOW",
    category: "MAPS / REAL-TIME WEB",
    tagline: "Making a campus feel more connected.",
    description:
      "A campus-focused mapping and real-time web application prototype using Google Maps and Firebase.",
    stack: [
      "JAVASCRIPT",
      "FIREBASE",
      "GOOGLE MAPS",
    ],
    href: "https://github.com/ValenBloodhunter/CampusFlow",
    visual: "campusflow",
  },
];
