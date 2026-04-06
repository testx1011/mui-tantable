# Contributing to mui-tantable

Thank you for your interest in improving the project! To keep our code clear and collaborate efficiently, please follow these steps:

## Prerequisites

1. Node.js 18+ installed.
2. Clone the repository and install dependencies with `npm install`.
3. Familiarize yourself with TypeScript and React.

```bash
git clone https://github.com/testx1011/mui-tantable.git
cd mui-tantable
npm install
# or pnpm install
```

## Format and Quality

- Run `npm run lint` before submitting a PR and fix any errors.
- Use `npm run build` to ensure the library compiles.
- Add/update types in `src/` if you introduce new functionality.
- Keep dependencies under control and add entries to `package.json` only if strictly necessary.

## Git Workflow

1. Create a descriptive branch from `main`:
   ```bash
   git checkout -b feature/short-name
   ```
2. Make small commits with clear messages.
3. Rebase or merge from `main` regularly to avoid conflicts.

## Pull Requests

- Open an issue before working on large changes.
- Include in the PR description:
  - Objective of the change.
  - How to test it (link to Storybook, examples, etc.).
  - If it modifies the API, explain the effects and add documentation.
- Add tests when possible (Vitest, Playwright).
- Tag at least one reviewer or leave a comment requesting review.

## Bug Reports and Feature Requests

Use the [issue templates](.github/ISSUE_TEMPLATE/) to provide the necessary information.

## Code of Conduct

This project adopts the [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to comply with its rules and may be removed from the project if you violate them.

---

Thank you again for contributing! Your improvements make the library more useful for everyone.

[jump]: # "This file is included in README.md for more details."
