import path from "path";
import getProjectDir from "./getProjectDir";
import fs from "fs-extra";

export default async function readPackageJson() {
  const rootDir = await getProjectDir();
  const pkg = await fs.readFile(path.join(rootDir, "package.json"));
  return JSON.parse(pkg.toString());
}
