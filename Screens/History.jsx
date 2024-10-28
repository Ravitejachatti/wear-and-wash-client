import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBookingSlot } from '../Redux/App/action';
import { getData } from '../Storage/getData';
import { removeItem } from '../Storage/removeItem';
import { useNavigation } from '@react-navigation/native';

const History = () => {
    const store = useSelector(state => state.app.bookings);
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);
    const [ bookings, setBookings] = useState([])
    const navigation = useNavigation();


    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const storedUserId = await getData("userId");
                console.log("userId from ",storedUserId)
                if (!storedUserId) {
                    // console.error("User ID not found");
                    return;
                }
    
                setUserId(JSON.parse(storedUserId));
                console.log("response from the home ",userId)
                // console.log("before")
                const res = await dispatch(getUserBookingSlot(JSON.parse(storedUserId)));
                console.log("response from the history ",res.payload)
                setBookings(res.payload)

            } catch (err) {
                console.error(err);
            }
        };

        fetchBookings();
    }, [dispatch]);

    const handleLogout = async () => {
        await removeItem('token');
        navigation.navigate("Login");
    };

    const userBookings = store?.filter(booking => booking.userId._id === userId) || [];

    const renderBookingItem = ({ item }) => (
        <View style={styles.bookingItem}>
            <Text style={styles.bookingDate}>Date: {item.date.split("T")[0]}</Text>
            <Text style={styles.bookingLocation}>Location: {item.centerId.name}</Text>
            <Text style={styles.bookingMachine}>Machine: {item.machineId.name}</Text>
            <Text style={styles.bookingTimeSlot}>Time Slot: {item.timeSlot.startTime} - {item.timeSlot.endTime}</Text>
            <View style={styles.separator} />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Booking History</Text>
            <View style={styles.content}>
                {userBookings.length > 0 ? (
                    <FlatList
                        data={bookings}
                        renderItem={renderBookingItem}
                        keyExtractor={item => item._id}
                    />
                ) : (
                    <Text style={styles.noBookingsText}>No bookings found for this user.</Text>
                )}
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f8',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    content: {
        flex: 1,
    },
    bookingItem: {
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    bookingDate: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4a4a4a',
    },
    bookingLocation: {
        fontSize: 16,
        color: '#6a6a6a',
    },
    bookingMachine: {
        fontSize: 16,
        color: '#6a6a6a',
    },
    bookingTimeSlot: {
        fontSize: 16,
        color: '#6a6a6a',
    },
    separator: {
        marginVertical: 10,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    noBookingsText: {
        fontSize: 18,
        color: '#4a4a4a',
        textAlign: 'center',
        marginTop: 20,
    },
    logoutButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    logoutButtonText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default History;
