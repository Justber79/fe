# CLAUDE.md — Need4Deed Frontend (`fe`)

## What this repo is

The volunteer-facing dashboard and public landing page for Need4Deed — a Berlin NGO
connecting volunteers with refugee accommodation centers.

Built with: **Next.js + TypeScript**, structured as a PWA (Progressive Web App).
Deployed via AWS CloudFront.

This is an open-source project. Contributors may be volunteer developers with varying
experience levels. Be patient, explain clearly, and avoid over-engineering.

---

## Project domain — read this first

Key concepts before touching any code:

- **Deed** — a task posted by a center (e.g. "German tutoring", "translation", "childcare")
- **Volunteer** — registers via a public form, has skills, languages, location
- **Center** — refugee accommodation center in Berlin that posts deeds
- **Match** — pairing of volunteer to deed (currently done by NGO staff, later automated)
- **SDK** — shared TypeScript types live in the `sdk` repo (sibling folder). Always import
  shared types from there. Never redefine types that already exist in the SDK.

Data protection matters. Never display more personal data than is necessary.
No personal data in URLs, browser storage beyond what's needed, or console logs.

---

## Architecture

```
fe/                          ← you are here
  src/
    components/              ← Reusable UI components
    pages/ (or app/)         ← Next.js pages/routes
    hooks/                   ← Custom React hooks
    utils/                   ← Helper functions
    types/                   ← Local-only types (shared types come from SDK)
  public/                    ← Static assets
  .env.example               ← Copy to .env.local for local dev
```

### Key environment variables

```
NEXT_PUBLIC_CLOUDFRONT_URL=https://cdn.need4deed.org/images
NEXT_PUBLIC_CLOUDFRONT_DATA_URL=https://cdn.need4deed.org/data
```

---

## Local development setup

```bash
# Recommended: clone all three repos as siblings
git clone https://github.com/need4deed-org/fe.git
git clone https://github.com/need4deed-org/sdk.git

cd fe
yarn install
yarn install ../sdk      # links the local SDK for type safety
cp .env.example .env.local
yarn dev
```

Visit `http://localhost:3000`

The backend (`be` repo) should also be running locally if you're working on
anything that fetches data. See the `be` repo's CLAUDE.md for setup.

---

## Design rules

- All UI work must follow the Figma designs linked in each issue. Check before styling.
- Do not introduce new UI component libraries without discussion — check what's already used.
- This is a PWA — be mindful of performance. Avoid large dependencies.
- We aim to support users on mobile and lower-bandwidth connections (volunteers in Berlin
  may be using this on phones).

---

## Branching and commits

- Branch naming: `yourname/feature-name` (e.g. `alex/deed-card-component`)
- Commit emojis:
  - 🎨 Styling/UI
  - 🐛 Bug fix
  - ✨ New feature
  - 📝 Documentation
  - ♻️ Refactor

---

## How to contribute

1. Pick an issue labelled `good first issue` or `help wanted`
2. Check the linked Figma design in the issue before building any UI
3. Keep PRs small — one component or one feature at a time
4. Never commit `.env.local` or any API keys
5. If you're unsure what a "deed" or "match" means in context, read the domain section above

---

## What NOT to do

- Do not redefine types that exist in the SDK
- Do not store personal volunteer/refugee data in localStorage or sessionStorage
- Do not log personal data to the console
- Do not merge your own PRs
- Do not add dependencies without checking if something equivalent is already installed

---

## Current status (April 2026)

Active development. Current focus is the **internal admin dashboard** — for the Need4Deed
team to manage volunteers, centers, and deeds. The public volunteer-facing features
are next after that.

The legacy frontend (`website` repo) is being retired. Do not reference it.

---

## Contact

Questions about the project: info@need4deed.org
For code questions: open a GitHub issue or comment on the relevant PR.
