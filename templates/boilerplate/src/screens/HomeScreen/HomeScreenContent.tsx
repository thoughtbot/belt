import { ReactNode } from 'react';
import { Image, Platform, StyleSheet, TextProps, View } from 'react-native';
import UnStyledText from 'src/components/Text';
import useTheme from 'src/theme/useTheme';

// TODO: sample, remove
export default function HomeScreenContent() {
  return (
    <>
      <Image
        source={{
          uri: 'https://github.com/user-attachments/assets/4cb9fb46-6c96-4ac0-b7f9-8560e44e11d1',
        }}
        width={130}
        height={130}
        style={{
          alignSelf: 'center',
          marginTop: 42,
        }}
        accessibilityIgnoresInvertColors
      />
      <Text
        style={[styles.paragraph, styles.centered]}
        accessibilityRole="header"
      >
        Welcome to your new app! Here are some notes and tips to get you
        started.
      </Text>

      <Card>
        <Text>
          <Text style={styles.bold}>We set some things up for you:</Text> Expo,
          TanStack Query, Testing Library, React Navigation, and more!
        </Text>
      </Card>

      <Card>
        <Text style={styles.bold}>Some notes about organization</Text>
        <View style={styles.orgBullets} accessibilityRole="list">
          <BulletListItem>
            Reusable components go in{' '}
            <UnStyledText style={styles.inlineCode}>
              src/components
            </UnStyledText>
          </BulletListItem>

          <BulletListItem>
            Screens go in{' '}
            <UnStyledText style={styles.inlineCode}>
              {'src/screens/{MyScreen}/{MyScreen}.tsx'}
            </UnStyledText>
          </BulletListItem>

          <BulletListItem>
            Screen-specific code goes in{' '}
            <UnStyledText style={styles.inlineCode}>
              {'src/screens/{MyScreen}'}
            </UnStyledText>
          </BulletListItem>

          <BulletListItem>
            Navigation code goes in{' '}
            <UnStyledText style={styles.inlineCode}>
              src/navigators
            </UnStyledText>
          </BulletListItem>

          <BulletListItem>
            Tests are co-located with code. Eg.{' '}
            <UnStyledText style={styles.inlineCode}>
              {'__tests__/{MyComponent}.test.tsx'}
            </UnStyledText>
          </BulletListItem>
        </View>
      </Card>

      <Card>
        <Text>
          <Text style={styles.bold}>To add a new bottom tab</Text> head to{' '}
          <Text style={styles.inlineCode}>TabNavigator.tsx</Text> and follow the
          instructions commented there.
        </Text>
      </Card>

      <Card>
        <Text>
          <Text style={styles.bold}>To add a new screen</Text> head to the
          screens directory and mount it in the appropriate stack.
        </Text>
      </Card>

      <Card>
        <Text>
          Check out an <Text style={styles.bold}>example API call</Text> using
          TanStack Query in{' '}
          <Text style={styles.inlineCode}>AboutScreen.tsx</Text>.
        </Text>
      </Card>

      <Card>
        <Text>
          Check out <Text style={styles.bold}>a sample test</Text> in{' '}
          <Text style={styles.inlineCode}>
            src/__tests__/App.integration.test.tsx
          </Text>
          .
        </Text>
      </Card>

      <Card>
        <Text>
          Sample code is marked with a{' '}
          <Text style={styles.inlineCode}>“TODO”</Text> comment.{' '}
          <Text style={styles.bold}>Search the codebase</Text> for{' '}
          <Text style={styles.inlineCode}>“TODO”</Text> and remove any desired
          sample code.
        </Text>
      </Card>
    </>
  );
}

function Text({ style, ...props }: TextProps) {
  return <UnStyledText {...props} style={[styles.text, style]} />;
}

function BulletListItem({ children }: { children: ReactNode }) {
  return (
    <View style={styles.bulletItem}>
      <Text style={styles.bullet}>{'\u2022'}</Text>
      <Text style={styles.itemText}>{children}</Text>
    </View>
  );
}

function Card({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    lineHeight: 24,
  },
  paragraph: {
    fontSize: 19,
    lineHeight: 24,
    marginBottom: 24,
    marginTop: 12,
  },
  card: {
    marginBottom: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  centered: {
    textAlign: 'center',
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  bullet: {
    fontSize: 20,
    lineHeight: 22,
    marginRight: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
  },

  orgBullets: {
    marginTop: 12,
  },
  inlineCode: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontWeight: '500',
    fontSize: 15,
  },
  bold: {
    fontWeight: 'bold',
  },
});
