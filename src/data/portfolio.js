export const navigation = [
  { label: 'Work', href: '#work' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
]

export const experience = [
  {
    period: 'JUN 2026',
    role: 'Software Development Intern',
    organization: 'Bharat Electronics Limited',
    location: 'Bangalore, India',
    summary:
      'Contributed to a LAN-based messaging application, developing Spring Boot APIs and integrating React and Electron interfaces with backend services.',
    stack: ['Java', 'Spring Boot', 'React', 'Electron'],
  },
  {
    period: 'SEP 2026 — NOW',
    role: 'President, Career Guidance Club',
    organization: 'CIRA · Karunya University',
    location: 'Coimbatore, India',
    summary:
      'Plan and coordinate workshops, competitions, guest sessions, and career-focused events with students, faculty, and external speakers.',
    stack: ['Leadership', 'Community', 'Operations'],
  },
  {
    period: 'SEP 2025 — APR 2026',
    role: 'Web Developer',
    organization: 'KHacks · Karunya Innovation & Design Studio',
    location: 'Coimbatore, India',
    summary:
      'Built responsive frontend and backend features for the official KIDS website and developed independent full-stack applications.',
    stack: ['React', 'Django', 'PostgreSQL', 'Docker'],
  },
]

export const projects = [
  {
    number: '001',
    year: '2025',
    title: 'Klean',
    type: 'IoT / Full Stack',
    summary:
      'A connected waste reporting and collection system with separate civilian and driver experiences, route planning, image uploads, and live smart-bin telemetry.',
    stack: ['Python', 'Flask', 'React', 'ESP32', 'Leaflet.js'],
    metric: 'REAL-TIME BIN STATUS',
    art: [
      '     ┌───────┐       ╭────╮',
      '  ○──┤  68%  ├──○────┤ GPS│',
      '     └───┬───┘       ╰────╯',
      '    ╱╲   │  ▓▓▓▓▓░░',
      '   ╱__╲  └───────────────→',
    ],
  },
  {
    number: '002',
    year: '2026',
    title: 'Divine Foods',
    type: 'Commerce / Full Stack',
    summary:
      'An e-commerce platform for indigenous food products with role-based administration, inventory, ordering, reviews, and integrated payments.',
    stack: ['React', 'Node.js', 'TypeScript', 'Supabase'],
    metric: 'END-TO-END COMMERCE',
    art: [
      '   ╭───────────────╮',
      '   │  DIVINE / 01  │  +',
      '   │  ◇  ◇  ◇  ◇  │ ───→',
      '   │  CART [ 03 ]  │',
      '   ╰───────────────╯',
    ],
  },
]

export const skills = [
  { number: '01', group: 'Languages', items: ['C', 'Java', 'Python', 'JavaScript', 'HTML / CSS'] },
  { number: '02', group: 'Web systems', items: ['React', 'Node.js', 'Django', 'Flask', 'Spring Boot', 'Electron'] },
  { number: '03', group: 'Data & infra', items: ['PostgreSQL', 'Supabase', 'Docker', 'Git', 'Linux'] },
  { number: '04', group: 'Connected tools', items: ['ESP32', 'Leaflet.js', 'OpenRouteService', 'REST APIs'] },
]

export const certifications = [
  { issuer: 'Microsoft', title: 'Azure Fundamentals' },
  { issuer: 'Red Hat', title: 'System Administration I' },
  { issuer: 'Cisco', title: 'CCNA · Computer Networking' },
  { issuer: 'The Linux Foundation', title: 'Introduction to Linux' },
  { issuer: 'IBM Design', title: 'Artificial Intelligence Fundamentals' },
  { issuer: 'NPTEL', title: 'Design and Engineering of Computer Systems' },
]

export const links = {
  email: 'mailto:praneetnischal@karunya.edu.in',
  github: 'https://github.com/praneettigga',
  linkedin: 'https://linkedin.com/in/praneettigga',
}
