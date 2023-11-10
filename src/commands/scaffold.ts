import chalk from 'chalk';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import print from '../util/print';

export default async function createScaffold() {
  print(chalk.bold('👖 Creating directory structure'));
  print(`
    src/
      components/
      util/
        hooks/
      test/
  `);

  await copyTemplateDirectory({
    templateDir: 'scaffold',
  });
  print('✅ Created directories');
}
