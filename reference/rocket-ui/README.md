# Rocket UI reference

This folder is a selective, read-only design reference extracted from the original
`quantumworld (1).zip` archive supplied by the project owner. It is **not** imported
by the running application, so it does not change the portal, public site, Supabase,
or build output.

Use it to restore the visual language of the original Rocket application while
preserving the portal workflows already implemented.

## What to reuse selectively

- `src/styles/index.css` and `src/styles/tailwind.css`: colour, typography, spacing,
  and animation reference.
- `src/components/ui/CSSParticleField.tsx`, `src/app/components/QuantumNetworkGL.tsx`,
  and `src/app/components/QuantumWebGL.tsx`: optional visual-motion primitives.
- `src/app/components/*Section.tsx`: composition, cards, and section rhythm.
- `src/components/Header.tsx` and `src/components/Footer.tsx`: public-marketing
  navigation reference only; they should not replace the authenticated portal shell.

## Guardrails

- Keep public marketing pages separate from portal work.
- Do not copy environment files, build configuration, database code, or old portal
  pages from the archive.
- Adapt components into the current codebase rather than importing this folder at
  runtime. That avoids overwriting the newer portal functionality and Supabase flows.
