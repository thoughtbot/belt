import { execSync } from 'child_process';

// copies files over from a sample app generated with `bin/belt.js`
// See CONTRIBUTING.md for more info
function run() {
  const appDir = process.argv[2];

  if (!appDir || appDir.includes('builds')) {
    console.error('Please provide an app directory, relative to `builds`');
    console.error('Usage: node bin/sync-from-app.js MyApp --dry-run');
    process.exit(1);
  }

  const excludes = [
    'node_modules',
    '.cache',
    '.expo',
    '.vscode',
    'assets',
    '.git',
    '.gitignore',
  ];

  const excludesStr = excludes.map((e) => `--exclude ${e}`).join(' ');

  // provide additional flags, eg. --dry-run
  const flags = `-avp ${process.argv[3] || ''}`;

  const command = `rsync ${flags} ${excludesStr} builds/${appDir}/ templates/boilerplate/`;
  console.log(command);
  execSync(command, {
    stdio: 'inherit',
  });

  console.log(
    "\n\n🎉 Success! Ensure that all files have copied over correctly, remove any unwanted modifications (eg. app.json, package.json, etc), and manually remove any files that need to be deleted (these don't sync)",
  );
}

run();
