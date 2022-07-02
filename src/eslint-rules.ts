export const eslintRules = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'airbnb', 'airbnb/hooks'],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['spellcheck'],
  rules: {
    'no-duplicate-imports': 'error',
    'no-self-compare': 'error',
    'eqeqeq': 'error',
    'camelcase': 'error',
    'spellcheck/spell-checker': [
      1,
      {
        comments: true,
        strings: true,
        identifiers: true,
        templates: true,
        lang: 'en_US',
        skipWords: ['dict', 'aff', 'hunspellchecker', 'hunspell', 'utils'],
        skipIfMatch: ['http://[^s]*', '^[-\\w]+/[-\\w\\.]+$'],
        skipWordIfMatch: ['^foobar.*$'],
        minLength: 3,
      },
    ],
  },
};
