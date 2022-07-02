/**
 * Get changed files from PR
 * @author Yousuf Kalim
 */
import { getOctokit, context } from '@actions/github';
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types';

type FileNamesList = string[];

// File type
type File = {
  filename: string;
  status: string;
};

/**
 * Get file names from files array
 * @param {File[]} files
 * @return {FileNamesList}
 */
const getFileNames = (files: File[]): FileNamesList => {
  // Filtering out files that are deleted
  return files.filter((file) => file.status !== 'removed').map((file) => file.filename);
};

/**
 * Get changed files from PR
 * @param {string} token
 * @return {FileNamesList}
 */
const getChangedFiles = async (token: string): Promise<FileNamesList> => {
  // Intializing github octokit
  const octokit = getOctokit(token);
  const pullRequest = context.payload.pull_request; // Getting PR Info

  let filenames: FileNamesList = [];

  //   Checking if code is pushed in default branch or PR is created
  if (!pullRequest?.number) {
    // If PR is not created and code is pushed in default branch, then we have to perform lint on new commits only
    const getCommitEndpointOptions = octokit.rest.repos.getCommit.endpoint.merge({
      owner: context.repo.owner,
      repo: context.repo.repo,
      ref: context.sha,
    });

    type ReposGetCommitResponse = GetResponseDataTypeFromEndpointMethod<typeof octokit.rest.repos.getCommit>;
    const response: ReposGetCommitResponse[] = await octokit.paginate(getCommitEndpointOptions);
    const filesArr = response.map((data) => data.files);

    const filesChangedInCommit = filesArr.reduce((acc, val) => acc?.concat(val || []), []);

    filenames = getFileNames(filesChangedInCommit as File[]);
  } else {
    // if PR is created, then we have to perform lint on all files in PR
    const listFilesEndpointOptions = octokit.rest.pulls.listFiles.endpoint.merge({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pullRequest.number,
    });

    type PullsListFilesResponse = GetResponseDataTypeFromEndpointMethod<typeof octokit.rest.pulls.listFiles>;
    const filesChangedInPR: PullsListFilesResponse = await octokit.paginate(listFilesEndpointOptions);

    filenames = getFileNames(filesChangedInPR as File[]);
  }

  return filenames;
};

// Export
export default getChangedFiles;
