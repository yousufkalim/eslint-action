/**
 * Disable annotation
 * @author Yousuf Kalim
 */
import { info, debug } from '@actions/core';

// Function to disable annotation
export const disableAnnotations = (): void => {
  debug('Disabling Annotations');
  info('##[remove-matcher owner=eslint-compact]');
  info('##[remove-matcher owner=eslint-stylish]');
};
