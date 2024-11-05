import React, { useRef, useEffect, useState } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import PaymentComp from './PaymentComp';
import { getData } from '../../Storage/getData';

const AnimatedPaymentComp = ({ isVisible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(1000)).current; // Initial off-screen position
  const [paymentData, setPaymentData] = useState({
    date: null,
    timeSlot: null,
    machineName: null,
    userId: null,
    centerId: null,
    machineId: null,
  });

  useEffect(() => {
    const fetchUserSelectedDetails = async () => {
      try {
        const date = await getData("date");
        const machineName = await getData("machineName");
        const timeSlot = await getData("timeSlot");
        const userId = await getData("userId");
        const centerId = await getData("locationId");
        const machineId = await getData("machineId");

        setPaymentData({
          date: date ? JSON.parse(date) : null,
          timeSlot: timeSlot ? JSON.parse(timeSlot) : null,
          machineName: machineName ? JSON.parse(machineName) : null,
          userId: userId ? JSON.parse(userId) : null,
          centerId: centerId ? JSON.parse(centerId) : null,
          machineId: machineId ? JSON.parse(machineId) : null,
        });
      } catch (error) {
        console.error("Failed to fetch user-selected details from AsyncStorage", error);
      }
    };

    if (isVisible) {
      // Fetch data and show the component
      fetchUserSelectedDetails();
      Animated.timing(slideAnim, {
        toValue: 0, // Slide up to become visible
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      // Hide the component
      Animated.timing(slideAnim, {
        toValue: 1000, // Slide down to hide
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.innerContainer}>
        <PaymentComp paymentData={paymentData} onVisibilityChange={onClose} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 0,
    overflow: 'hidden',
  },
});

export default AnimatedPaymentComp;
