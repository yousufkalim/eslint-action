# ESLint Code Review

> This is a GitHub Action that use airbnb style guide to lint JavaScript and TypeScript projects in a pull request with inline error and warning annotations, It will use default airbnb and eslint recommended rules if `.eslintrc` doesn't exists in your project.

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
      - uses: yousufkalim/eslint-action@latest
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }} # Optional
          eslint-args: '--ignore-path=.gitignore'
          eslintrc: false # Set this to true if you want to use your own .eslintrc rules
          extensions: 'js,jsx,ts,tsx'
          annotations: true
```

## Security

For better security it is recommended to pin actions to a full length commit SHA.

Read more on [using third-party actions](https://docs.github.com/en/actions/learn-github-actions/security-hardening-for-github-actions#using-third-party-actions)

## Known Issues

- Yarn 2+ is not supported

## Debugging

To enable debug logs, set secret `ACTIONS_STEP_DEBUG` to `true`. Refer docs more details https://docs.github.com/en/actions/managing-workflow-runs/enabling-debug-logging#enabling-step-debug-logging
