import { program } from "commander";

console.log("React Native 🎉");

program
  .description('Perform React Native and Expo setup and redundant tasks without your pants falling down!')
  .command("eslint", "Configure ESLint", { executableFile: "eslint.ts" })
  .command("prettier", "Configure Prettier", { executableFile: "prettier.ts" });

program.parse();
