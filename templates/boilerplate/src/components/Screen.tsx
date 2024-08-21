import { useNavigation } from '@react-navigation/native';
import { StatusBarStyle } from 'expo-status-bar';
import { ReactNode } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type Props = KeyboardAwareScrollViewProps & {
  padHorizontal?: boolean;
  scroll?: boolean;
  /**
   * If true, a safe area view is not added for the top of the screen, since it is
   * handled instead by React Navigation
   */
  hasHeader?: boolean;
  /** A React component to render fixed to the bottom of the screen. It is not
   * positioned absolutely and would show above a tab bar. If your screen does
   * not have a tab bar, set fixedBottomAddSafeArea to ensure a safe area view
   * is used on the bottom */
  FixedBottomComponent?: ReactNode;
  fixedBottomAddSafeArea?: boolean;
  statusBarStyle?: StatusBarStyle;
};

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView,
);

export default function Screen({
  style,
  padHorizontal = true,
  scroll = true,
  testID,
  /** if screen has a navigation header, safe area view is not needed, since header takes into account */
  hasHeader = false,
  children,
  FixedBottomComponent,
  fixedBottomAddSafeArea = false,
  ...props
}: Props) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={styles.wrapper}
      edges={{
        top: hasHeader ? 'off' : 'additive',
        bottom: 'off',
      }}
    >
      <View
        testID={testID}
        style={[
          styles.contentContainer,
          padHorizontal && styles.horizontalPadding,
          style,
        ]}
      >
        {scroll ? (
          <AnimatedKeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic"
            bounces
            onAccessibilityEscape={() => navigation.goBack()}
            testID={`${testID || 'ScreenContainer'}ScrollView`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 0,
            }}
            {...props}
          >
            {children}
          </AnimatedKeyboardAwareScrollView>
        ) : (
          children
        )}
      </View>
      {!!FixedBottomComponent && (
        <View
          style={[
            fixedBottomAddSafeArea && {
              paddingBottom: insets.bottom,
            },
          ]}
        >
          {FixedBottomComponent}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  horizontalPadding: {
    paddingHorizontal: 20,
  },
});
