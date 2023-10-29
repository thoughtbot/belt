import getProjectType from './getProjectType';

export default async function isExpo() {
  const projectType = await getProjectType();
  return projectType === 'expo-bare' || projectType === 'expo-managed';
}
