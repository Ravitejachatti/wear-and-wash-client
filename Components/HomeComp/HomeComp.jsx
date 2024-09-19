import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { bookingSlot, getUserBookingSlot } from '../../Redux/App/action';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../../theme';
import { getData } from '../../Storage/getData';

const HomeComp = () => {
    const store = useSelector(state => state.app.bookings);
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        dispatch(getUserBookingSlot())
            .then(async res => {
                const userId = await getData("userId");
                setUserId(JSON.parse(userId));
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    // Filter the bookings by matching userId with booking's userId
    const filteredBookings = store?.filter(booking => booking.userId._id === userId);

    console.log("Filtered Bookings", filteredBookings);

    return (
        <View>
            
            <View>
                {filteredBookings?.length > 0 ? (
                    filteredBookings.map(item => (
                        <View key={item._id}>
                            <Text>Date: {item.date.split("T")[0]}</Text>
                            <Text>Location: {item.centerId.name}</Text>
                            <Text>Machine: {item.machineId.name}</Text>
                            {
                                item?.machineId?.bookedSlots?.map(slot => (
                                    <Text key={slot._id}>{slot?.timeRange?.startTime} - {slot?.timeRange?.endTime}</Text>
                                ))
                            }
                        </View>
                    ))
                ) : (
                    <Text>No bookings found for this user.</Text>
                )}
            </View>

            <View>
                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Start</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: theme.color.secondary,
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
    loginButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default HomeComp;
