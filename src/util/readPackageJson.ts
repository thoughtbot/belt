import fs from "fs-extra";
import path from "path";
import { PackageJson } from "../types";
import getProjectDir from "./getProjectDir";

export default async function readPackageJson() {
  const rootDir = await getProjectDir();
  const pkg = await fs.readFile(path.join(rootDir, "package.json"));
  return JSON.parse(pkg.toString()) as PackageJson;
}
