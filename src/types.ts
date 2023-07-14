export type PackageJson = {
  [k: string]: unknown;
  dependencies?: {
    [k: string]: unknown;
  };
  devDependencies?: {
    [k: string]: unknown;
  };
};
