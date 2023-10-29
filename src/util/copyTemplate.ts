import * as eta from 'eta';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath, URL } from 'url';
import getProjectDir from './getProjectDir';
import writeFile from './writeFile';

// for manual testing, change this to another name so doesn't conflict
// with project's tsconfig.json
const dirname = fileURLToPath(new URL('.', import.meta.url));

type Params = {
  templateDir: string;
  templateFile: string;
  /** relative to project root, with leading './' */
  destination: string;
  variables?: object;
};

export default async function copyTemplate({
  templateDir,
  templateFile,
  destination,
  variables,
}: Params) {
  const projectDir = await getProjectDir();
  let template: string | Buffer = await fs.readFile(
    path.join(
      dirname,
      '..',
      'commands',
      'templates',
      templateDir,
      templateFile,
    ),
  );

  if (templateFile.endsWith('eta')) {
    template = eta.render(template.toString(), variables ?? {});
  }

  const fullDestination = destination.endsWith('/')
    ? `${destination}${templateFile.replace('.eta', '')}`
    : destination;

  await writeFile(path.join(projectDir, fullDestination), template.toString(), {
    format: true,
  });
}
