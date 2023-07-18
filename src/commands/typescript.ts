import chalk from "chalk";
import { log } from "console";
import * as eta from "eta";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath, URL } from "url";
import addDependency from "../util/addDependency";
import getProjectDir from "../util/getProjectDir";
import getProjectType from "../util/getProjectType";
import writeFile from "../util/writeFile";

// for manual testing, change this to another name so doesn't conflict
// with project's tsconfig.json
const tsConfig = "tsconfig.json";
const dirname = fileURLToPath(new URL(".", import.meta.url));

export default async function addTypescript() {
  const projectDir = await getProjectDir();

  if (await fs.exists(path.join(projectDir, tsConfig))) {
    log(
      chalk.yellow(
        "tsconfig.json already exists, exiting.\nIf you would like to perform a fresh TypeScript install, delete this file and rerun the script.\n"
      )
    );
    return;
  }

  await addDependency("typescript @types/react", { dev: true });

  const projectType = await getProjectType();
  const template = await fs.readFile(
    path.join(dirname, "templates", "tsconfig.json.eta")
  );
  const fileContents = eta.render(template.toString(), {
    expo: projectType === "expo-bare" || projectType === "expo-managed",
  });

  await writeFile(path.join(projectDir, tsConfig), fileContents, {
    format: true,
  });

  log(
    chalk.green(
      "\n🎉 TypeScript successfully configured\nConsider renaming your existing JS files as .ts or .tsx.\n"
    )
  );
}
