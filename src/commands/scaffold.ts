import ora from 'ora';
import copyTemplateDirectory from '../util/copyTemplateDirectory';

export default async function createScaffold() {
  const spinner = ora().start('Creating directory structure');

  await copyTemplateDirectory({
    templateDir: 'scaffold',
  });

  spinner.succeed('Created directories');
}
