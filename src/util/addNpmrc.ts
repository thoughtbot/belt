import copyTemplateDirectory from './copyTemplateDirectory';

export default async function addNpmrc(destinationDir = '.') {
  await copyTemplateDirectory({
    templateDir: 'npmrc',
    destinationDir,
  });
}
