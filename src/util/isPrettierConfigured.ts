import fsExtra from "fs-extra";
import path from "path";
import getProjectDir from "./getProjectDir";
import readPackageJson from "./readPackageJson";

export default async function isPrettierConfigured() {
  const packageJson = await readPackageJson();

  const projectDir = await getProjectDir();

  const hasPrettierConfigInPackageJson = Object.prototype.hasOwnProperty.call(
    packageJson,
    "prettier"
  );
  const hasPrettierrcJsFile = await fsExtra.exists(
    path.join(projectDir, "prettierrc.js")
  );
  const hasPrettierrcFile = await fsExtra.exists(
    path.join(projectDir, ".prettierrc")
  );
  const hasPrettierrcJsonFile = await fsExtra.exists(
    path.join(projectDir, ".prettierrc.json")
  );
  const hasPrettierConfigFile = await fsExtra.exists(
    path.join(projectDir, ".prettier.config.js")
  );

  return (
    hasPrettierConfigInPackageJson ||
    hasPrettierrcJsFile ||
    hasPrettierrcFile ||
    hasPrettierrcJsonFile ||
    hasPrettierConfigFile
  );
}
