import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator,Image } from 'react-native';
import { getData } from '../Storage/getData'; // Assuming you have a function to get the token
import { getUserBookingSlot } from '../Redux/App/action';
import { getFutureUserBookings } from '../utils/futureBookingUtils';
import { useDispatch } from 'react-redux';
import { countUserFutureBookings} from '../utils/bookingUtils';


const Splash = () => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        const token = await getData('token');
        const userId = await getData('userId') // Retrieve the token from async storage
        const parseUserId = JSON.parse(userId)
        // console.log("splash screen ",parseUserId)
        

        if (token) {
          // If user is authenticated, fetch future bookings
          
          dispatch(getUserBookingSlot(parseUserId))
          .then(async (res) => {
            const bookings = res.payload;
            // console.log("All Bookings from API:", bookings);
            
    
            // Use the utility function to filter future bookings
            const futureBookings = await countUserFutureBookings(bookings,userId);
            // // console.log("Future Bookings for the User:", futureBookings);
            // // console.log(futureBookings) 
            // console.log("splash screen ", futureBookings)

          if (futureBookings.length > 0) {
            // console.log("Home")
            // Navigate to Home if future bookings exist
            navigation.replace('Main', { screen: 'Home' }); 
          } else {
            // Navigate to Location if no future bookings
            // console.log("location")
            navigation.replace('Main', { screen: 'Location' });   
          }})
        } else {
          // If no token (not authenticated), navigate to Login
          navigation.replace('Auth', { screen: 'Login' });  
        }
      } catch (error) {
        console.error('Error checking authentication and bookings', error);
      } finally {
        setIsLoading(false); // Stop loading indicator once everything is processed
      }
    };

    // Animation for the splash screen
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      checkAuthAndNavigate(); // Call the navigation logic after splash duration
    }, 3000); 
  }, []);

  // if (isLoading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }      

  return (
    <View style={styles.container}>
      <Animated.Image source={require('../assets/splash.png')} style={[styles.image, { transform: [{ scale: scaleValue }] }]}> 
       
      </Animated.Image>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200, // Adjust size as needed
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Splash;
