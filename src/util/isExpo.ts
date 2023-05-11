import fs from "fs";
import path from "path";
import getProjectDir from "./getProjectDir";
import { log } from "console";
import isExactStringIncluded from "./isExactStringIncluded";

export default async function isExpoProject() {
  const rootDir = await getProjectDir();

  try {
    const data = fs.readFileSync(path.join(rootDir, "package.json"), "utf8");
    return isExactStringIncluded(data, "expo");
  } catch (err) {
    log("err", err);
  }
}
