import fs from "fs-extra";
import path from "path";

export default async function getProjectDir(
  base: string = process.cwd()
): Promise<string> {
  let previous = null;
  let dir = base;

  do {
    try {
      // This will throw if there is no package.json in the directory
      await fs.readFile(path.join(dir, "package.json"));

      // if didn't throw, package.json exists, return dir
      return dir;
    } catch {
      // Expected to throw if no package.json is present
    } finally {
      previous = dir;
      dir = path.dirname(dir);
    }
  } while (dir !== previous);

  throw new Error(
    "No project found. Ensure you are inside of a project directory with a package.json file."
  );
}
