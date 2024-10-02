import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PaymentComp from './PaymentComp'; // Assuming PaymentComp is in the same directory

const AnimatedPaymentComp = ({ isVisible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(1000)).current; // Initial position off-screen

  useEffect(() => {
    if (isVisible) {
      // Animate the component sliding up
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to the top of the screen (visible)
        duration: 500, // Animation duration in milliseconds
        useNativeDriver: true,
      }).start();

      // Automatically close after 3 seconds
      const autoCloseTimeout = setTimeout(() => {
        onClose(); // Close the payment screen after the delay
      }, 3000); // 3000 ms = 3 seconds

      // Clean up the timeout when the component unmounts or `isVisible` changes
      return () => clearTimeout(autoCloseTimeout);
    }
  }, [isVisible, slideAnim, onClose]);

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          transform: [{ translateY: slideAnim }], // Bind translateY to animated value
        },
      ]}
    >
      {/* Payment Component */}
      <View style={styles.innerContainer}>
        <PaymentComp />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%', // Full-screen height for the animated view
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Ensure it's on top of other views
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 0, // No rounded corners for full-screen
    overflow: 'hidden',
  },
});

export default AnimatedPaymentComp;
