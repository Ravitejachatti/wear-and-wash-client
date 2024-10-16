import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert,ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { bookingSlot, getUserBookingSlot } from '../../Redux/App/action';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { getData } from '../../Storage/getData';
import { removeItem } from '../../Storage/removeItem';
import { useNavigation } from '@react-navigation/native';
import { countUserFutureBookings } from '../../utils/bookingUtils';
import Testing from '../../Screens/Testing';



const HomeComp = () => {
    const store = useSelector(state => state.app.bookings);
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);
    const [bookingCount, setBookingCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
    const [history, setHistory] = useState(null)
    const [ filteredBookings, setfilteredBookings ] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Fetch bookings
                const storedUserId = await getData("userId");
                // console.log(storedUserId)
                if (!storedUserId) {
                    // console.error("User ID not found");
                    return;
                }
    
                setUserId(JSON.parse(storedUserId));
                // console.log("before")
                const res = await dispatch(getUserBookingSlot());
                setIsLoading(false);
                // console.log("after")
    
                // Get bookings for the current user
                const bookings = res.payload;
                // console.log("bookings in the home")
                // console.log("Bookings:", bookings);
    
                // Count bookings for the current month
                const userBookings = await countUserFutureBookings(bookings, JSON.parse(storedUserId));
                // console.log("User bookings in home:", userBookings);
    
                setfilteredBookings(userBookings); // Set actual bookings, not the count
                setBookingCount(userBookings.length);
                // // console.log(filteredBookings.length)
            } catch (err) {
                // console.error("Error fetching bookings:", err);
            }
        };
        fetchBookings();
    }, []);
    

    // While the data is loading, show a loading spinner
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

    // const handleLogout = async () => {
    //     const token = await getData('token');
    //     const res = await removeItem('token');
    //     navigation.navigate('Login');
    // };

    // Filter the bookings by matching userId with booking's userId
    const Bookings = store?.filter(booking => booking.userId._id === userId);
    // console.log('filtered Bookings',filteredBookings.length)
 
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Your Bookings</Text>
            </View>

            <View style={styles.bookingsContainer}>
                {bookingCount >= 4 ? (
                    <Text style={styles.messageText}>
                        You have completed your bookings for this month.
                    </Text>
                ) : filteredBookings?.length > 0 ? (
                    filteredBookings.map(item => (
                        <View key={item._id} style={styles.bookingCard}>
                            <Text style={styles.bookingText}>
                                <Text style={styles.label}>Date:</Text> {item.date.split("T")[0]}
                            </Text>
                            <Text style={styles.bookingText}>
                                <Text style={styles.label}>Location:</Text> {item.centerId.name}
                            </Text>
                            <Text style={styles.bookingText}>
                                <Text style={styles.label}>Machine:</Text> {item.machineId.name}
                            </Text>
                            <Text style={styles.bookingText}>
                                <Text style={styles.label}>Time Slot:</Text> {item.timeSlot.startTime} - {item.timeSlot.endTime}
                            </Text>
                        </View>

                    ))
                ) : (
                    <Text style={styles.noBookingsText}>No bookings found for this user.</Text>
                )}
            </View>

            <View style={styles.videoContainer}>
              <Testing/>
            </View>

           
      
            <TouchableOpacity style={styles.startButton}>
                <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity> */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: '#f9f9f9', // Light background for contrast with the blue color
    },
    headerContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E90FF', // Blue color for the header
        textAlign: 'center',
    },
    bookingsContainer: {
        marginBottom: 20,
    },
    bookingCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    bookingText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        color: '#1E90FF', // Blue color for the labels
    },
    messageText: {
        fontSize: 18,
        color: '#FF4500', // Orange color for warning or important messages
        textAlign: 'center',
        marginBottom: 20,
    },
    noBookingsText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
    },
    videoContainer: {
        
        backgroundColor: 'blue',
        marginBottom: '20',
    },
    startButton: {
        backgroundColor: '#1E90FF', // Blue for the main button
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    // logoutButton: {
    //     backgroundColor: '#1E90FF', // Red for the logout button to indicate a critical action
    //     paddingVertical: 15,
    //     borderRadius: 10,
    //     alignItems: 'center',
    //     shadowColor: '#1E90FF',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 4,
    //     elevation: 5,
    // },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default HomeComp;  
