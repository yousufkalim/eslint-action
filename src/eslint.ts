import path from 'node:path';
import fs from 'node:fs';
import { notice, startGroup, endGroup, info } from '@actions/core';
import { exec } from '@actions/exec';

import { disableAnnotations } from './annotations';
import getChangedFiles from './get-changed-files';

export interface Inputs {
  token: string;
  annotations: boolean;
  eslintArgs: string[];
  eslintrc: boolean;
  binPath: string;
  extensions: string[];
}

export const runEslint = async (inputs: Inputs): Promise<void> => {
  if (!inputs.annotations) {
    disableAnnotations();
  }

  const changedFiles = await getChangedFiles(inputs.token);

  startGroup('Files changed.');
  changedFiles.forEach((file) => info(`- ${file}`));
  endGroup();

  const files = changedFiles.filter((filename) => {
    const isFileSupported = inputs.extensions.find((ext) => filename.endsWith(`.${ext}`));
    return isFileSupported;
  });

  if (files.length === 0) {
    notice('No files found. Skipping.');
    return;
  }

  startGroup('Files for linting.');
  files.forEach((file) => info(`- ${file}`));
  endGroup();

  if (!inputs.eslintrc) {
    fs.writeFileSync(
      '.eslintrc.js',
      `module.exports = {
          env: {
            browser: true,
            es2021: true,
          },
          extends: ["eslint:recommended", "airbnb", "airbnb/hooks"],
          parserOptions: {
            ecmaVersion: 12,
            sourceType: "module",
          },
          plugins: ["spellcheck"],
          rules: {
            "no-duplicate-imports": "error",
            "no-self-compare": "error",
            eqeqeq: "error",
            camelcase: "error",
            "spellcheck/spell-checker": [
              1,
              {
                comments: true,
                strings: true,
                identifiers: true,
                templates: true,
                lang: "en_US",
                skipWords: ["dict", "aff", "hunspellchecker", "hunspell", "utils"],
                skipIfMatch: ["http://[^s]*", "^[-\\w]+/[-\\w\\.]+$"],
                skipWordIfMatch: ["^foobar.*$"],
                minLength: 3,
              },
            ],
          },
        };
        `,
    );
  }

  const execOptions = [path.resolve(inputs.binPath, 'eslint'), ...files, ...inputs.eslintArgs].filter(Boolean);

  startGroup('Exec options');
  info(execOptions.join(' '));
  endGroup();

  startGroup('Inputs');
  info(JSON.stringify(inputs));
  endGroup();

  startGroup('Dir');
  info(fs.readdirSync(path.resolve('../../_actions/yousufkalim/eslint-action')).join('\n'));
  endGroup();

  await exec('node', execOptions);
};
