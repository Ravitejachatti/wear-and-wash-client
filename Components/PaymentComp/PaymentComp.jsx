import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { bookingSlot, getBasedOnLocation, getUserBookingSlot } from '../../Redux/App/action';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';

const PaymentComp = ({ paymentData, onVisibilityChange }) => {
  const { date, timeSlot, machineName, userId, centerId, machineId } = paymentData;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [upiId, setUpiId] = useState(''); // State for UPI ID
  const [error, setError] = useState(''); // State for validation error

  const handleSubmit = async () => {
    if (!upiId.trim()) {
      setError('UPI ID is required.');
      return;
    }

    setIsLoading(true);
    const payload = { userId, centerId, machineId, timeSlot, date, upiId };

    try {
      const response = await dispatch(bookingSlot(payload));
      dispatch(getBasedOnLocation());
      dispatch(getUserBookingSlot(userId));

      if (response?.payload?.status === 'confirmed') {
        navigation.replace('Main', { screen: 'Home' });
      } else {
        if (onVisibilityChange) {
          onVisibilityChange(false);
        }
      }
    } catch (error) {
      console.error('Error during booking:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onVisibilityChange) {
      onVisibilityChange(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.mainHeading}>Booking Data</Text>
      <View style={styles.container}>
        {date && <Text style={styles.heading}>Date: <Text style={styles.value}>{date}</Text></Text>}
        {timeSlot && <Text style={styles.heading}>Time Slot: <Text style={styles.value}>{timeSlot}</Text></Text>}
        {machineName && <Text style={styles.heading}>Machine: <Text style={styles.value}>{machineName}</Text></Text>}
        <TextInput
          style={styles.input}
          placeholder="Enter your UPI ID"
          value={upiId}
          onChangeText={(text) => {
            setUpiId(text);
            setError(''); // Clear error on input
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <TouchableOpacity onPress={handleSubmit} style={[styles.btn, isLoading && styles.disabledBtn]} disabled={isLoading}>
        <Text style={styles.btnText}>{isLoading ? 'Processing...' : 'Proceed'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
        <Text style={styles.closeBtnText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  }, 
  mainHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontWeight: '400',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: '100%',
    marginTop: 15,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  btn: {
    backgroundColor: theme.color.secondary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginVertical: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledBtn: {
    backgroundColor: '#d3d3d3',
  },
  closeBtn: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 10,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentComp;
