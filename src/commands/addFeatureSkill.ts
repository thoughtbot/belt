import { confirm, select } from '@inquirer/prompts';
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
  variant?: string;
};

type VariantsManifest = {
  default: string;
  variants: { name: string; label: string }[];
};

/**
 * The generic, feature-agnostic machinery behind `belt agent add <feature>`
 * (ADR-0004). Given a feature's skill source at templates/<feature>/
 * (ADR-0011), copies its reference/ directory verbatim and stamps SKILL.md's
 * frontmatter with Belt's version, then hands off to the user's coding
 * agent. Features offering a variant choice (ADR-0009, ADR-0016) declare it
 * via templates/<feature>/variants.json and nest each variant's source
 * under templates/<feature>/<variant>/; features without one keep today's
 * flat templates/<feature>/ layout.
 */
export async function addFeatureSkill(feature: string, options: Options = {}) {
  const { interactive = true } = options;
  globals.interactive = interactive;

  // relative to templates/ — either "<feature>" or "<feature>/<variant>"
  const featureSourcePath = await resolveFeatureSourcePath(
    feature,
    interactive,
  );

  const sourceSkillPath = path.join(
    PACKAGE_ROOT,
    'templates',
    featureSourcePath,
    'SKILL.md',
  );

  if (!(await fs.exists(sourceSkillPath))) {
    throw new Error(
      `Unknown feature "${feature}" — no skill found at templates/${featureSourcePath}/SKILL.md.`,
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
        message: `belt-add-${feature} is already installed (${describeSkillMetadata(
          installedMetadata,
        )}) and differs from the version being emitted (${describeSkillMetadata(
          incomingMetadata,
        )}). Overwrite it?`,
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
    templateDir: path.join(featureSourcePath, 'reference'),
    destinationDir: path.join(destinationDir, 'reference'),
  });

  printHandoff(feature);
}

/**
 * A feature with a variants.json manifest (ADR-0016) prompts for one of its
 * curated variants (ADR-0009) and resolves to "<feature>/<variant>"; a
 * feature without one resolves to "<feature>" directly, unchanged from
 * before variants existed. Returned path is relative to templates/.
 */
async function resolveFeatureSourcePath(
  feature: string,
  interactive: boolean,
): Promise<string> {
  const variantsManifestPath = path.join(
    PACKAGE_ROOT,
    'templates',
    feature,
    'variants.json',
  );

  if (!(await fs.exists(variantsManifestPath))) {
    return feature;
  }

  const manifest = JSON.parse(
    (await fs.readFile(variantsManifestPath)).toString(),
  ) as VariantsManifest;

  const chosenVariant = interactive
    ? await select({
        message: 'Which library?',
        // This @inquirer/prompts version's select() has no `default` option
        // — the first choice is what's pre-highlighted, so the thoughtbot
        // default variant is sorted to the front instead.
        choices: [...manifest.variants]
          .sort(
            (a, b) =>
              Number(b.name === manifest.default) -
              Number(a.name === manifest.default),
          )
          .map(({ name, label }) => ({
            name: label,
            value: name,
          })),
      })
    : manifest.default;

  return path.join(feature, chosenVariant);
}

/**
 * Only the feature-content-relevant fields are compared — a bare Belt
 * version bump re-stamps silently (ADR-0013). `variant` is included so
 * switching variants on re-run always confirms, even if version and
 * expoSdkRange happen to match between the two variants (ADR-0017).
 */
function skillContentDiffers(
  installed: SkillMetadata,
  incoming: SkillMetadata,
) {
  return (
    installed.version !== incoming.version ||
    installed.expoSdkRange !== incoming.expoSdkRange ||
    installed.variant !== incoming.variant
  );
}

function describeSkillMetadata(metadata: SkillMetadata) {
  const variant = metadata.variant ? `${metadata.variant}, ` : '';
  return `${variant}v${metadata.version ?? 'unknown'}, targeting Expo ${
    metadata.expoSdkRange ?? 'unknown'
  }`;
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
