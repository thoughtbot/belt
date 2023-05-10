import { log } from "console";
import * as fsExtra from "fs-extra";
import * as fs from "fs";
import getProjectDir from "../util/getProjectDir";
import * as path from "path";
import chalk from "chalk";
import { exec } from "child_process";
import { input, select } from "@inquirer/prompts";
import formatFile from "../util/formatFile";

export default async function runPrettier() {
  log("Create your Prettier config!");

  const projectDir = await getProjectDir();

  if (await fsExtra.exists(path.join(projectDir, "prettierrc.js"))) {
    log("prettier.js config file already exists");
  } else if (await fsExtra.exists(path.join(projectDir, ".prettierrc"))) {
    log(".prettierrc config file already exists");
  } else {
    const getTabWidthAnswer = await input({
      message: "What's your preferred tab width?",
      default: "2",
      validate: (value) => (isNaN(parseInt(value)) ? "Not a number!" : true),
    });

    const getPrintWidthAnswer = await input({
      message: "What's your preferred print width?",
      default: "80",
      validate: (value) => (isNaN(parseInt(value)) ? "Not a number!" : true),
    });

    const getBracketSpacingAnswer = await select({
      message: "Print spaces between brackets in object literals.",
      choices: [
        {
          name: "true",
          value: "true",
          description: "Example: { foo: bar }",
        },
        {
          name: "false",
          value: "false",
          description: "Example: {foo: bar}",
        },
      ],
    });

    const getSingleQuoteAnswer = await select({
      message: "Use single quotes.",
      choices: [
        {
          name: "true",
          value: "true",
          description: `'example'`,
        },
        {
          name: "false",
          value: "false",
          description: `"example"`,
        },
      ],
    });

    const getSemicolonAnswer = await select({
      message: "Print semicolons at the end of statements",
      choices: [
        {
          name: "true",
          value: "true",
        },
        {
          name: "false",
          value: "false",
        },
      ],
    });
    const answers = {
      tabWidth: Number(getTabWidthAnswer),
      printWidth: Number(getPrintWidthAnswer),
      semicolons: getSemicolonAnswer === "true" ? true : false,
      singleQuote: getSingleQuoteAnswer === "true" ? true : false,
      bracketSpacing: getBracketSpacingAnswer === "true" ? true : false,
      trailingCommas: await select({
        message: "Print trailing commas in multi-line comma-separated structures",
        choices: [
          {
            name: "es5",
            value: "es5",
            description:
              "Trailing commas where valid in ES5 (objects, arrays, etc.). No trailing commas in type parameters in TypeScript.",
          },
          {
            name: "none",
            value: "none",
            description: "No trailing commas.",
          },
          {
            name: "all",
            value: "all",
            description: "Trailing commas wherever possible.",
          },
        ],
      }),
      bracketLine: await select({
        message:
          "Put > of a multi-line JSX element at the end of the last line instead of being alone on the next line",
        choices: [
          {
            name: "true",
            value: "true",
            description: `
            <button
             className="prettier-class"
             id="prettier-id"
             onClick={this.handleClick}>
             Click Here
            </button>`,
          },
          {
            name: "none",
            value: "none",
            description: `
            <button
              className="prettier-class"
              id="prettier-id"
              onClick={this.handleClick}
            >
              Click Here
            </button>`,
          },
          {
            name: "all",
            value: "all",
            description: "Trailing commas wherever possible.",
          },
        ],
      }),
    };

    if (await fsExtra.exists(path.join(projectDir, ".prettierignore"))) {
      log(".prettierignore config file already exists");
    } else {
      const prettierIgnoreTemplate = await fs.readFileSync(
        path.join(projectDir, "src", "templates", ".prettierignore.template"),
        { encoding: "utf8" }
      );

      await fs.writeFileSync(path.join(projectDir, ".prettierignore"), prettierIgnoreTemplate);
    }
    // todo use appropriate packager, probably utility function
    exec("yarn add prettier");

    await fs.writeFileSync(path.join(projectDir, ".prettierrc"), JSON.stringify(answers));

    await formatFile(path.join(projectDir, ".prettierrc"));
    await formatFile(path.join(projectDir, ".prettierignore"));
    log(chalk.green("🎉 Prettier successfully configured"));
  }
}
