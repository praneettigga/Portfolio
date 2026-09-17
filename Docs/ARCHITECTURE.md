# Portfolio Architecture

## Overview

The portfolio is a static, single-page React application built with Vite. It has no backend, database, authentication, or runtime environment variables. All portfolio content is stored in local JavaScript data and rendered by reusable React components.

## Application Structure

- `src/App.jsx` composes the page sections and owns global animation setup.
- `src/data/portfolio.js` is the source of truth for navigation, experience, projects, skills, certifications, and contact links.
- `src/components/` contains reusable interface pieces such as the navigation, section heading, ASCII artwork, and project cards.
- `src/styles/` contains the visual tokens, responsive layout, and animation states.
- `public/images/` stores website images, including the source portrait; `Docs/References/` stores the downloadable resume.

## Data Flow

Local portfolio data is imported into the page and mapped into presentational components. External links are optional: when a project URL is missing, its card displays a non-interactive `CASE STUDY PENDING` label. This lets links and media be added later without changing component structure.

## Animation

GSAP and ScrollTrigger manage scroll reveals, section progress, pinned accents, and subtle portrait movement. CSS handles hover, focus, and navigation transitions. Animation setup is scoped to the page and cleaned up when React unmounts. Visitors requesting reduced motion receive a static layout without scroll choreography.

## Assets and Hosting

Vite fingerprints imported assets during production builds. The original portrait is stored in `public/images/`, while the hero uses the transparent, web-optimized dither portrait in `src/assets/portrait-pixel.png` with an animated pixel overlay. The PDF remains local to the repository. The generated site can be hosted by any static provider.
