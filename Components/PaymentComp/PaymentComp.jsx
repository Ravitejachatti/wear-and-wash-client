import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { bookingSlot, getBasedOnLocation, getUserBookingSlot } from '../../Redux/App/action';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';

const PaymentComp = ({ paymentData }) => {
  const { date, timeSlot, machineName, userId, centerId, machineId } = paymentData;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    const payload = { userId, centerId, machineId, timeSlot, date };

    try {
      const response = await dispatch(bookingSlot(payload));
      dispatch(getBasedOnLocation());
      dispatch(getUserBookingSlot(userId));

      if (response?.payload?.status === "confirmed") {
        navigation.replace('Main', { screen: 'Home' });
      }
    } catch (error) {
      console.error("Error during booking:", error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <View>
      <View style={styles.container}>
        {date && <Text style={styles.heading}>Date: {date}</Text>}
        {timeSlot && <Text style={styles.heading}>Time Slot: {timeSlot}</Text>}
        {machineName && <Text style={styles.heading}>Machine: {machineName}</Text>}
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
        <Text style={styles.btnText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: 'green',
    marginBottom: 10,
  },
  btn: {
    backgroundColor: theme.color.secondary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 250,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default PaymentComp;
