export type PackageJson = {
  [k: string]: unknown;
  scripts: Record<string, string>;
  dependencies?: {
    [k: string]: unknown;
  };
  devDependencies?: {
    [k: string]: unknown;
  };
};

export type AppJson = {
  expo: {
    [k: string]: unknown;
  };
};
