# Portfolio Deployment

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Local Development

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Production Build

```bash
npm run build
npm run preview
```

The production site is written to `dist/`. The output is entirely static and does not require a Node.js server after building.

## Hosting

Deploy the `dist/` directory to a static host such as Cloudflare Pages, Netlify, Vercel, or GitHub Pages. Use `npm run build` as the build command and `dist` as the output directory.

The site currently uses a single document with hash-based section navigation, so no SPA rewrite rule is required. No environment variables or secrets are needed.

## Release Checklist

- Run `npm run lint` and `npm run build`.
- Check the generated site at mobile and desktop widths.
- Confirm the resume, email, GitHub, and LinkedIn links.
- Confirm the deployment URL in social preview metadata before launch.

