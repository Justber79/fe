# Need4Deed Frontend (FE)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash

yarn dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🧭 About This Project

This repository (`fe`) is the **Next.js Progressive Web App (PWA)** for **Need4Deed**, automating and supporting our platform’s business processes.
It is actively developed and will eventually include our public landing page (currently hosted separately).

### Related Repositories

| Repository                                            | Description                                           |
| ----------------------------------------------------- | ----------------------------------------------------- |
| [`backend`](https://github.com/need4deed-org/be)      | Node.js / TypeScript API backend                      |
| [`sdk`](https://github.com/need4deed-org/sdk)         | Shared TypeScript types and helpers used by FE and BE |
| [`website`](https://github.com/need4deed-org/website) | Legacy React/Vite landing page (currently frozen)     |

---

## ⚙️ Local Development Setup

The FE, BE, and SDK are designed to work together locally in a **sibling-folder setup**:

```
parent/
├── fe/         # Frontend (Next.js app)
├── be/          # Backend (API)
└── sdk/        # Shared TypeScript SDK
```

NEXT_PUBLIC_CLOUDFRONT_URL=https://d2nwrdddg8skub.cloudfront.net/images
NEXT_PUBLIC_CLOUDFRONT_DATA_URL=https://d2nwrdddg8skub.cloudfront.net/data

### 1. Clone All Repositories

Make sure you have all three repos cloned in the same parent directory:

```bash
git clone https://github.com/need4deed-org/fe.git
git clone https://github.com/need4deed-org/be.git
git clone https://github.com/need4deed-org/sdk.git
```

---

## 🌐 Modifying API types

The `sdk` repo contains the API types that are used by `be` and `fe`. These are published as an npm package `need4deed-sdk`. The following points must be considered before modifying these types.

1. Modifying the API types in `sdk` must be followed by republishing the `need4deed-sdk` package to the npm registry.
   https://www.npmjs.com/package/need4deed-sdk

2. The `fe`, `be` and `sdk` should then be upgraded using the following command.

```bash
yarn upgrade need4deed-sdk --latest
```

### 🚧 Avoid workarounds

- Linking the `sdk` locally will result in updated package references in the `package.json` file which will diverge from the published stable version of the `need4deed-sdk` This may result in production failures and is best avoided.
- Using local type definitions and other workarounds is not acceptable.

---

## 🎨 Design Guidelines

All designs and layouts are defined in **Figma**.
Before implementing or modifying any UI component:

- Follow the design from the official Figma project shared by the Need4Deed design team
- Match typography, spacing, and component structure
- Discuss any changes or deviations with the design team before merging

> Keeping the FE aligned with Figma ensures consistency and quality across our app.

---

## 🧪 Development Notes

- You can manually open the specific page you’re working on via its local URL (e.g. `http://localhost:3000/dashboard`)
- The FE app will gradually incorporate the public landing page currently hosted on Amplify/S3
- The `website` repo is frozen until the merge into this app is complete

---

## 🤝 How to Contribute

We welcome all contributions — from bug fixes to feature development.

1. **Fork** this repository

2. **Clone** your fork

3. **Create a new branch**

   ```bash
   git checkout -b your_nick-feature-name
   ```

4. **Commit your changes**
   Follow our commit message style guide:
   - Use present tense (“Add feature” not “Added feature”)
   - Use imperative mood (“Fix bug” not “Fixes bug”)
   - Keep it short (under 72 chars)
   - Prefix with an emoji when relevant:
     - 🎨 — style/format improvements
     - 🐛 — bug fix
     - 📝 — docs
     - 🔥 — removing code/files

5. **Push** your branch and open a **Pull Request** to `main`

6. Tag a maintainer for review (`@arturas`, etc.)

---

## 🐞 Reporting Bugs & Suggesting Features

- Use the **Issues** tab in this repository
- Check existing issues before opening a new one
- Use the provided templates for **bug reports** and **feature requests**

---

## ⚖️ License

By contributing, you agree that your contributions are licensed under our
[Commons Clause + MIT License](LICENSE).

---
