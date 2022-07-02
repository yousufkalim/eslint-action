import path from 'node:path';
import fs from 'node:fs';
import { notice, startGroup, endGroup, info } from '@actions/core';
import { exec } from '@actions/exec';

import { disableAnnotations } from './annotations';
import getChangedFiles from './get-changed-files';
import { eslintRules } from './eslint-rules';

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
    fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintRules));
  }

  const execOptions = [path.resolve(inputs.binPath, 'eslint'), ...files, ...inputs.eslintArgs].filter(Boolean);

  await exec('npm i eslint eslint-config-airbnb eslint-plugin-spellcheck');

  await exec('node', execOptions);
};
