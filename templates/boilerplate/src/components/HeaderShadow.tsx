import { Animated, StyleSheet } from 'react-native';

type Props = {
  animatedScrollOffset: Animated.Value;
  fixedTop?: boolean;
  animationScrollDistance?: number;
};

const SHADOW_HEIGHT = 12; // Height of the element that creates the shadow. Will never be seen.

export default function HeaderShadow({
  animatedScrollOffset = new Animated.Value(0),
  fixedTop = false,
  animationScrollDistance = 32,
}: Props) {
  const shadowOpacity = animatedScrollOffset.interpolate({
    inputRange: [0, animationScrollDistance],
    outputRange: [0, 0.4], // Change of opacity of the shadow by changing the opacity of the entire component
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.shadow,
        {
          backgroundColor: '#fff',
          opacity: shadowOpacity,
          bottom: fixedTop ? 'auto' : 0,
          top: fixedTop ? -SHADOW_HEIGHT : 'auto',
          zIndex: fixedTop ? 10 : 0,
          shadowOpacity: 0.4,
          height: SHADOW_HEIGHT,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  shadow: {
    // Shadow is applied to its own element so it can be faded in and out
    // with opacity which is more performant to animate
    position: 'absolute',
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowRadius: 5.46,
  },
});
