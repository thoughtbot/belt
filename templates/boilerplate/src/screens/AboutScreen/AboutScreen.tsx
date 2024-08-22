import Feather from '@expo/vector-icons/Feather';
import { useQuery } from '@tanstack/react-query';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Screen from 'src/components/Screen';
import api, { GithubProject } from 'src/util/api/api';

export default function AboutScreen() {
  return <GitHubProjects />;
}

function Header() {
  return (
    <>
      <Text style={styles.heading} accessibilityRole="header">
        Open Source
      </Text>
      <Text style={styles.paragraph}>
        Here are a few projects that we maintain.
      </Text>
    </>
  );
}

// TODO: sample data, remove
function GitHubProjects() {
  const { data, isLoading } = useQuery({
    queryKey: ['githubRepos'],
    queryFn: api.githubRepos,
  });

  const projects = data?.projects
    ? data.projects.sort((a, b) => (b.stars || 0) - (a.stars || 0)).slice(0, 30)
    : [];

  return (
    <Screen padHorizontal={false} scroll={false}>
      <FlatList
        data={projects}
        renderItem={({ item }) => <Project project={item} />}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={Header}
        stickyHeaderHiddenOnScroll
        ListEmptyComponent={
          isLoading ? <ActivityIndicator /> : <Text>No results found</Text>
        }
        style={{ flexGrow: 0 }}
      />
    </Screen>
  );
}

// TODO: sample data, remove
function Project({ project }: { project: GithubProject }) {
  const { name, description, stars } = project;
  const formatStars = () => {
    if (!stars || stars < 1000) {
      return stars;
    }

    return `${(stars / 1000).toFixed(1)}k`;
  };
  const formattedStars = formatStars();

  return (
    <View style={styles.project}>
      <View style={styles.projectHeader}>
        <Text accessibilityRole="header" style={styles.projectName}>
          {name}
        </Text>

        {formattedStars != null && (
          <View style={styles.starContainer}>
            <Feather name="star" size={16} color="black" />
            <Text aria-label={`${formattedStars} stars`}>{formatStars()}</Text>
          </View>
        )}
      </View>

      <Text style={styles.projectDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  heading: {
    fontWeight: '800',
    fontSize: 24,
    marginTop: 48,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  project: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
  },
  projectName: {
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  projectStars: {
    //
  },
});
