import * as eta from 'eta';
import fs from 'fs-extra';
import path from 'path';
import { PACKAGE_ROOT } from '../constants';
import getProjectDir from './getProjectDir';
import writeFile from './writeFile';

type Params = {
  templateDir: string;
  templateFile: string;
  /** relative to project root */
  destination?: string;
  variables?: object;
  format?: boolean;
};

export default async function copyTemplate({
  templateDir,
  templateFile,
  variables,
  destination = '.',
  format = false,
}: Params) {
  const projectDir = await getProjectDir();
  let template: string = (
    await fs.readFile(
      path.join(PACKAGE_ROOT, 'templates', templateDir, templateFile),
    )
  ).toString();

  if (templateFile.endsWith('eta')) {
    template = eta.render(template.toString(), variables ?? {});
  }

  const fullDestination = destination.endsWith('/')
    ? `${destination}${templateFile}`
    : destination === '.'
      ? templateFile
      : destination;

  const fullDestinationFilename = fullDestination.replace(/\.eta$/, '');

  await writeFile(path.join(projectDir, fullDestinationFilename), template, {
    format,
  });
}
