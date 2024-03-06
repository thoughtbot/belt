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
    android?: {
      googleServicesFile: string;
      package?: string;
    };
    ios?: {
      googleServicesFile?: string;
      bundleIdentifier?: string;
    };
    [k: string]: unknown;
  };
};
