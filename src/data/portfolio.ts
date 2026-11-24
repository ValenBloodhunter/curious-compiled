import { profile } from './profile'
import { projects, type Project } from './projects'

type Portfolio = {
  hero: {
    name: string
    title: readonly [string, string]
    intro: string
  }
  about: {
    bio: readonly string[]
    recognition: { place: string; track: string; event: string }
  }
  projects: readonly Project[]
  contact: { email: string; github: string; linkedin: string }
}

export const portfolio: Portfolio = {
  hero: {
    name: profile.displayName,
    title: ['Curious,', 'Compiled.'],
    intro: `I'm ${profile.displayName}. I build software and explore how machines learn.`,
  },
  about: {
    bio: [
      'I’m a B.Tech student at SRM University AP. Competitive programming taught me to look for the simplest idea that makes a hard problem click.',
      'I take that habit into machine learning, software, and hardware. I like building something small enough to test, seeing where it breaks, and trying again.',
    ],
    recognition: {
      place: '1st',
      track: 'Codecraft Track',
      event: 'Codevium 2026 · SRM University AP',
    },
  },
  projects,
  contact: {
    email: profile.publicEmail,
    github: profile.githubUrl,
    linkedin: profile.linkedinUrl,
  },
}
