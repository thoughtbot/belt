import appendToFile from './appendToFile';

/**
 * lines should be separated by newlines
 */
export default async function addToGitignore(lines: string) {
  return appendToFile('.gitignore', lines);
}
