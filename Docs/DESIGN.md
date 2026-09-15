# Portfolio Design System

## Direction

The site combines a monochrome ASCII interface with an editorial portfolio layout. It borrows the dense technical character of Mauricio Juba's landing page and the pacing and section choreography of Nesh, while keeping the result personal and suitable for an early-career software engineer.

## Visual Language

- Near-black background, warm off-white foreground, muted grey metadata, hairline borders, and a pale cyan system accent (`#c3fffc`).
- The supplied portrait is cropped into the hero and processed as a coarse square-pixel monochrome dither while preserving recognizable facial and clothing detail.
- Oversized split-weight sans-serif headings are paired with a monospace interface typeface; the surname and technical status marks carry the cyan accent.
- Section numbers, coordinates, status labels, brackets, rules, and ASCII marks make the page feel technical without imitating a terminal window.
- Content uses a wide twelve-column desktop grid and collapses to a single-column mobile layout.

## Page Narrative

1. Hero — identity, role, portrait, current status, and scroll cue.
2. Selected Work — employment and leadership timeline.
3. Projects — large case-study cards for Klean and Divine Foods.
4. Toolkit — technical capabilities grouped by discipline.
5. Education and Leadership — academic context and community work.
6. Certifications — compact credential index.
7. Beyond the Build — Linux, DevOps, IoT, and a subtle music-production note.
8. Contact — direct email and profile links with resume download.

## Interaction and Motion

- Content reveals use small vertical offsets, opacity, and staggered timing.
- The landing canvas animates flowing, breathing dither clouds at up to 30 fps; pointer movement brightens the field and leaves expanding, fading cyan ripples. Portrait brightness and position breathe gently alongside pointer parallax.
- A single animation loop pauses outside the viewport or in hidden tabs. Reduced-motion preference changes apply immediately.
- Portrait pixels gently brighten and darken in slow, overlapping waves within the photo silhouette. This uses the shared animation loop and stops under reduced motion; facial geometry stays fixed.
- Live pointer coordinates appear in the bottom `CRSR` HUD readout on hover-capable devices.
- Section labels and dividers react to scroll progress.
- Project rows shift typography and ASCII thumbnails on hover or keyboard focus.
- The portrait receives restrained parallax rather than continuous decorative motion.
- All controls have visible focus states and work without a pointer.
- `prefers-reduced-motion` removes parallax, smooth scrolling, and reveal dependencies.
- Touch devices retain ambient pixel motion without pointer effects; reduced-motion users receive a static field.

## Responsive Rules

Desktop layouts emphasize scale and negative space. Tablet layouts reduce headline size and simplify multi-column grids. Mobile layouts place the portrait behind the name treatment, use a compact menu, avoid pinned behavior, and preserve at least 44px interactive targets.
