# Contributing to Need4Deed's frontpage

We are lucky to have you! 🎉👍

The following is a set of guidelines for contributing to this project. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a merge request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [First Merge Request](#first-merge-request)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting features](#suggesting-features)
  - [Pull Requests](#pull-requests)
- [Styleguides](#styleguides)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript Styleguide](#javascript-styleguide)
- [License](#license)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

Perfect 👍 — here’s the **updated and polished `CONTRIBUTING.md`** for your **Need4Deed GitHub organization**, now reflecting:

- Migration from GitLab → GitHub
- Your **current setup** with `fe`, `be`, and `sdk`
- SDK linking workflow
- Mention that **designs are in Figma** and must be followed
- Clearer instructions for newcomers

---

# Contributing to Need4Deed

Thank you for your interest in contributing to **Need4Deed**!
We’re building tools that empower people to do good — and every contribution helps. 💪

---

## 🧭 How Can I Contribute?

### Your First Code Contribution

Not sure where to start?
Look through [good first issues](https://github.com/orgs/need4deed-org/projects) labeled `good first issue` in the appropriate repository.

Our main repositories:

| Repository                                            | Description                                               |
| ----------------------------------------------------- | --------------------------------------------------------- |
| [`fe`](https://github.com/need4deed-org/fe)           | Next.js PWA — main app for automating Need4Deed processes |
| [`be`](https://github.com/need4deed-org/be)           | Node.js / TypeScript API for the app                      |
| [`sdk`](https://github.com/need4deed-org/sdk)         | Shared TypeScript types and utilities between FE and BE   |
| [`website`](https://github.com/need4deed-org/website) | React/Vite static landing page (currently frozen)         |

### ⏳ Assignment Timeout

Once an issue is picked up by a developer, it should be assigned to their GitHub account. If a developer lacks sufficient permissions for self-assignment, they should ask a team member to do it.

The assignment for issues labeled "good first issue" or "ready for dev" will expire after 3 business days. After expiration, the assignment no longer guarantees that nobody else has taken the issue.

If a developer needs more time to finalize and open a PR, they can post a comment on the issue page to notify the team. This will extend the expiration period by another 3 business days. This extension is possible only once.

---

## 🚀 Your First Pull Request

### Step 1: Fork the Repository

1. Go to the repo you want to contribute to (e.g. [`fe`](https://github.com/need4deed-org/fe))
2. Click **Fork** (top-right)
3. Select your GitHub account as the destination

### Step 2: Clone Your Fork

We prefer using `yarn`. You may use other package manager, but please make sure:

1. `pre-commit` script is invoked before committing
2. do not clutter a repo with a lock file other than `yarn.lock`
3. `yarn.lock` is up to date.

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
yarn install
```

### Step 3: Add the Original Repository as a Remote

```bash
git remote add upstream https://github.com/need4deed-org/<repo-name>.git
git remote -v
```

You should see:

- `origin` → your fork
- `upstream` → the official Need4Deed repository

### Step 4: Create a New Branch

```bash
git checkout -b your_nick-feature-title
```

Example:
`git checkout -b anna-fix-login-form`

---

## 💻 Development Setup

### Monorepo-style workflow

We maintain three sibling repositories that work closely together:

```
parent/
├── fe/         # Frontend (Next.js PWA)
├── be/         # be (API)
└── sdk/        # Shared types and helpers
```

### SDK Linking

The **SDK** shares TypeScript types between the **frontend** and **be**.
We don’t fetch it from npm — we use the **local sibling folder** approach instead.

1. Make sure you have the latest branches checked out in each repo:

   ```bash
   cd sdk && git pull origin <branch>
   cd ../fe && git pull origin <branch>
   cd ../be && git pull origin <branch>
   ```

2. In `fe` and `be`, upgrade SDK locally:

   ```bash
   yarn upgrade need4deed-sdk
   ```

3. Ensure that the **current branch name** is checked out in all three repos. `fe` and `be` default branches are `develop`, `sdk` default branch is `main`. You may use feature branches as well! In such a case
   > 🔄 if you get TypeScript errors, make sure `sdk` and `be` or `fe` are aligned and freshly pulled.

---

### Content of a contribution

Please ensure all code changes directly address the issue. Minor flaws, such as a typo, may be corrected; however, if you make such corrections, please note them in the PR comments.

### Step 5: Open the PR

```bash
git push origin your_nick-feature-title
```

then go to the forked repo on your GitHub account and open the PR.
And please make sure your opened PR is wired with the issue by using a keyword, e.g. `closes` followed by the link to the issue: `#<number of issue>`

## 🎨 Design Guidelines

All UI and UX designs are maintained in **Figma**.
Before implementing any new feature or layout change:

- Always refer to the **Figma file** shared by the design team
- Match the spacing, typography, and component structure
- Discuss any deviations with the design lead before committing

> Consistency between Figma and implementation helps ensure a unified user experience.

---

## 🧩 Frontend Notes

- **FE** is a **Next.js** progressive web app (PWA)
- You can manually test a page by visiting its URL directly
- The legacy **website (Vite)** remains online but is **frozen**
- Future plan: merge the landing page into the `fe` app

---

## 🐞 Reporting Bugs

Before submitting a bug:

- Check if it’s already reported under **Issues** in the relevant repository

If not, open a [new issue](https://github.com/need4deed-org) using the **bug report template**.

---

## 💡 Suggesting Features

Feature requests are tracked as GitHub issues too.
Use the **feature request template** in the appropriate repo.

---

## 🧾 Styleguides

### Git Commit Messages

- Use **present tense** (“Add feature” not “Added feature”)
- Use **imperative mood** (“Fix bug” not “Fixes bug”)
- Keep the first line under **72 characters**
- Include related issue numbers if applicable

Use emoji prefixes when relevant:

- 🎨 `:art:` — improve structure or formatting
- 🐎 `:racehorse:` — performance improvement
- 📝 `:memo:` — docs update
- 🐛 `:bug:` — fix a bug
- 🔥 `:fire:` — remove code or files

---

## ⚖️ License

By contributing, you agree that your contributions are licensed under our
[Commons Clause + MIT License](LICENSE).

---

## 🤝 Questions?

Need help or clarification?

- Open an issue in the relevant repository
- Tag a maintainer (e.g., `@arturas`)
- Or email us at **[sowtware@need4deed.org](mailto:software@need4deed.org)** to request Slack access

---

Any contributions are welcome! 🙏
