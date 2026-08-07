import { confirm } from '@inquirer/prompts';
import matter from 'gray-matter';
import fs from 'fs-extra';
import path from 'path';
import { PACKAGE_ROOT, globals } from '../constants';
import copyTemplateDirectory from '../util/copyTemplateDirectory';
import print from '../util/print';
import stampSkillFrontmatter from '../util/stampSkillFrontmatter';
import writeFile from '../util/writeFile';
import packageJson from '../../package.json';

type Options = {
  interactive?: boolean;
};

type SkillMetadata = {
  version?: string;
  expoSdkRange?: string;
};

/**
 * The generic, feature-agnostic machinery behind `belt agent add <feature>`
 * (ADR-0004). Given a feature's skill source at templates/<feature>/
 * (ADR-0011), copies its reference/ directory verbatim and stamps SKILL.md's
 * frontmatter with Belt's version, then hands off to the user's coding
 * agent.
 */
export async function addFeatureSkill(feature: string, options: Options = {}) {
  const { interactive = true } = options;
  globals.interactive = interactive;

  const sourceSkillPath = path.join(
    PACKAGE_ROOT,
    'templates',
    feature,
    'SKILL.md',
  );

  if (!(await fs.exists(sourceSkillPath))) {
    throw new Error(
      `Unknown feature "${feature}" — no skill found at templates/${feature}/SKILL.md.`,
    );
  }

  const destinationDir = path.join('.claude', 'skills', `belt-add-${feature}`);
  const destinationSkillPath = path.join(destinationDir, 'SKILL.md');

  const sourceContents = (await fs.readFile(sourceSkillPath)).toString();
  const { data: incomingMetadata } = matter(sourceContents) as {
    data: SkillMetadata;
  };

  if (await fs.exists(destinationSkillPath)) {
    const installedContents = (
      await fs.readFile(destinationSkillPath)
    ).toString();
    const { data: installedMetadata } = matter(installedContents) as {
      data: SkillMetadata;
    };

    const shouldConfirm =
      interactive && skillContentDiffers(installedMetadata, incomingMetadata);

    if (shouldConfirm) {
      const proceed = await confirm({
        message: `belt-add-${feature} is already installed (v${
          installedMetadata.version ?? 'unknown'
        }, targeting Expo ${
          installedMetadata.expoSdkRange ?? 'unknown'
        }) and differs from the version being emitted (v${
          incomingMetadata.version ?? 'unknown'
        }, targeting Expo ${
          incomingMetadata.expoSdkRange ?? 'unknown'
        }). Overwrite it?`,
      });

      if (!proceed) {
        return;
      }
    }
  }

  await writeFile(
    destinationSkillPath,
    stampSkillFrontmatter(sourceContents, { beltVersion: packageJson.version }),
  );

  await copyTemplateDirectory({
    templateDir: path.join(feature, 'reference'),
    destinationDir: path.join(destinationDir, 'reference'),
  });

  printHandoff(feature);
}

/**
 * Only the feature-content-relevant fields are compared — a bare Belt
 * version bump re-stamps silently (ADR-0013).
 */
function skillContentDiffers(
  installed: SkillMetadata,
  incoming: SkillMetadata,
) {
  return (
    installed.version !== incoming.version ||
    installed.expoSdkRange !== incoming.expoSdkRange
  );
}

function printHandoff(feature: string) {
  print(`
Added .claude/skills/belt-add-${feature}/

Next: run /belt-add-${feature} in Claude Code, or point your coding agent at its SKILL.md.
`);
}

/**
 * Commander requires this signature to be ...args: unknown[]
 * Actual args are:
 *   ([<feature>, <Options hash>, <Command>])
 */
export default function addFeatureSkillAction(...args: unknown[]) {
  const feature = (args[0] as string[])[0];
  const options = (args[0] as unknown[])[1] as Options;
  return addFeatureSkill(feature, options);
}
