import fs from 'fs-extra';

const gitignoreEta = './templates/boilerplate/.gitignore.eta';
const gitignore = './templates/boilerplate/.gitignore';

/**
 * There is no way for npm to package the .gitignore file in
 * templates/boilerplate/.gitignore.  The solution is to instead include a
 * differently named file with the package, which we name .gitignore.eta to take
 * advantage of the fact that we already parse .eta template files.  We then
 * verify the .gitignore file and the .gitignore.eta file stay in sync via a
 * pre-commit hook.  Any time .gitignore.eta is updated, we need to re-generate
 * .gitignore.
 */
export function copyGitIgnoreTemplate() {
  fs.writeFileSync(gitignore, generateGitignoreContents());
}

/**
 * check if templates/boilerplate/.gitignore exists and matches the .gitignore.eta template
 * @returns exits with error if it does not match
 */
export function checkGitIgnoreTemplate() {
  const gitIgnoreContents = fs.readFileSync(gitignore, 'utf-8');

  if (gitIgnoreContents !== generateGitignoreContents()) {
    console.error(`
----------------------------------------------------------------------------
                  🔔 ERROR: Unable to commit changes
----------------------------------------------------------------------------

Auto-generated file, templates/boilerplate/.gitignore, does not match
.gitignore.eta template. Run:

node bin/generate-gitignore.js

to update the .gitignore file. See the comment at the top of
templates/boilerplate/.gitignore for more info.
`);
    process.exit(1);
  }
}

/**
 * generate templates/boilerplate/.gitignore contents from .gitignore.eta template
 */
export function generateGitignoreContents() {
  const gitIgnoreContents = fs.readFileSync(gitignoreEta, 'utf-8');

  return `# -----------------------------------------------------------------------------
# This file is generated from .gitignore.eta in bin/util/gitignoreUtil.js, do
# not modify directly
# -----------------------------------------------------------------------------

# this file is not packaged to npm, because npm does not support packaging
# .gitignore files. we package .gitignore.eta instead. We still want to have a
# .gitignore file present though for two reasons:
#
#  - The belt repo uses this file to ignore files that should not be committed
#  - NPM uses this file to exclude files from the NPM package
#
# This file is auto-generated in a pre-commit hook. See bin/generate-gitignore.js

# -----------------------------------------------------------------------------
# The following are not in .gitignore.eta because we don't want them to be
# ignored in generated Belt apps. But we do want to ignore them in the Belt repo
# and the npm package, so we add them.
#
# This file is auto-generated. To make changes here, update it in
# bin/util/gitignoreUtil.js
# -----------------------------------------------------------------------------

bun.lockb
yarn.lock
package-lock.json
pnpm-lock.yaml

# -----------------------------------------------------------------------------
# begin .gitignore contents from .gitignore.eta
# -----------------------------------------------------------------------------

${gitIgnoreContents}`;
}
