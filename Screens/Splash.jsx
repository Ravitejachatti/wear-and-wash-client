import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const Splash = () => {
  const scaleValue = useRef(new Animated.Value(0)).current; 
  const navigation = useNavigation()
  useEffect(() => {
  
    Animated.timing(scaleValue, {
      toValue: 1, 
      duration: 3000, 
      useNativeDriver: true, 
    }).start();
    setTimeout(() => {
        navigation.replace("Register")
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { transform: [{ scale: scaleValue }] }]}>
        Wear and Wash
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Splash;
