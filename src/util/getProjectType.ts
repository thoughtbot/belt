import readPackageJson from "./readPackageJson";

type ProjectType = "expo-bare" | "expo-managed" | "react-native";

export default async function getProjectType(): Promise<ProjectType> {
  const packageJson = await readPackageJson();
  const hasExpo = packageJson.dependencies?.hasOwnProperty("expo");
  const hasReactNativeUnimodules = packageJson.dependencies?.hasOwnProperty(
    "react-native-unimodules"
  );
  if (hasExpo) {
    return hasReactNativeUnimodules ? "expo-bare" : "expo-managed";
  }

  return "react-native";
}
