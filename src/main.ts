/**
 * Eslint Action
 * @author Yousuf Kalim
 */
import { setFailed, getInput, getBooleanInput } from '@actions/core';

import { Inputs, runEslint } from './eslint';

/**
 * run
 * This function will run at start and get the user inputs
 * @return {void}
 */
const run = async (): Promise<void> => {
  try {
    // Getting user inputs
    const inputs: Inputs = {
      token: getInput('github-token', { required: true }),
      annotations: getBooleanInput('annotations'),
      eslintArgs: getInput('eslint-args').split(' '),
      eslintrc: getBooleanInput('eslintrc'),
      autofix: getBooleanInput('auto-fix-before-test'),
      binPath: getInput('bin-path'),
      extensions: getInput('extensions')
        .split(',')
        .map((ext) => ext.trim()),
    };

    // Running eslint with user inputs
    await runEslint(inputs);

    // If no error, then set success
    process.exit(0);
  } catch (err) {
    // If error, then set failed
    setFailed(err.message);
  }
};

run();
