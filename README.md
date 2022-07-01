# ESLint Code Review

> This is a GitHub Action that lints JavaScript and TypeScript projects in a pull request with inline error and warning annotations, It will use `.eslintrc.js` rules if exists in your project.

![Lint](https://github.com/yousufkalim/eslint-action/workflows/Lint/badge.svg)

![Annotation](assets/annotation.png)

## Usage

`.github/workflows/lint.yml`:

```yml
name: Lint

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  eslint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Installing required libraries
        run: |
          npm i
          npm i eslint-config-airbnb
          npm i eslint-plugin-spellcheck
      - uses: yousufkalim/eslint-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }} # Optional
          eslint-args: "--ignore-path=.gitignore"
          extensions: "js,jsx,ts,tsx"
          annotations: true
```

## Security

For better security it is recommended to pin actions to a full length commit SHA.

Read more on [using third-party actions](https://docs.github.com/en/actions/learn-github-actions/security-hardening-for-github-actions#using-third-party-actions)

## Known Issues

- Yarn 2+ is not supported

## Debugging

To enable debug logs, set secret `ACTIONS_STEP_DEBUG` to `true`. Refer docs more details https://docs.github.com/en/actions/managing-workflow-runs/enabling-debug-logging#enabling-step-debug-logging
