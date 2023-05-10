import { program } from "commander";

console.log("React Native 🎉");

program
  .name("thoughtbelt")
  .description(
    "Perform React Native and Expo setup and redundant tasks without your pants falling down!"
  )

  .command("eslint")
  .description("Configure ESLint")
  .action(async () => await import("./eslint"))

  .command("prettier")
  .description("Configure Prettier")
  .action(() => import("./prettier"))
  .showHelpAfterError()
  .parse();
