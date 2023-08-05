import readPackageJson from './readPackageJson';

type ProjectType = 'expo-bare' | 'expo-managed' | 'react-native';

export default async function getProjectType(): Promise<ProjectType> {
  const packageJson = await readPackageJson();
  const hasExpo = hasProperty(packageJson.dependencies, 'expo');
  const hasReactNativeUnimodules = hasProperty(
    packageJson.dependencies,
    'react-native-unimodules',
  );
  if (hasExpo) {
    return hasReactNativeUnimodules ? 'expo-bare' : 'expo-managed';
  }

  return 'react-native';
}

function hasProperty(
  object: Record<string, unknown> | undefined,
  property: string,
) {
  return Object.prototype.hasOwnProperty.call(object, property);
}
