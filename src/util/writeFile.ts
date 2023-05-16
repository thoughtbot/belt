import chalk from "chalk";
import fs from "fs-extra";
import formatFile from "./formatFile";

type Options = {
  format?: boolean;
};

export default async function writeFile(
  filePath: string,
  contents: string,
  { format = false }: Options = {}
) {
  console.log(chalk.bold(`🔨 Creating ${filePath}`));
  fs.writeFile(filePath, contents);

  if (format) {
    await formatFile(filePath);
  }
}
