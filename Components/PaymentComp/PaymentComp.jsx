import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getData } from '../../Storage/getData';
import { useDispatch } from 'react-redux';
import { bookingSlot, getBasedOnLocation, getUserBookingSlot } from '../../Redux/App/action';
import { theme } from '../../theme';
import { useNavigation } from '@react-navigation/native';

const PaymentComp = () => {
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState(null);
  const [machineName, setMachineName] = useState(null);
  const [centerId ,setCenterId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [machineId,setMachineId] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation()

  useEffect(() => {
    
    const userSelectedDetails = async () => {
      try {
        const date = await getData("date");
        const machineName = await getData("machineName");
        const timeSlot = await getData("timeSlot");
        const userId = await getData("userId");
        const centerId = await getData("locationId");
        const machineId  = await getData("machineId");

        //console.log("console ids",userId,centerId, machineId,timeSlot, date)

        if (date && timeSlot && machineName && userId && centerId && machineId) {
            console.log("CHECKING ids",userId,centerId,machineName, machineId,timeSlot, date)
          setDate(JSON.parse(date));
          setTimeSlot(JSON.parse(timeSlot));
          setMachineName(JSON.parse(machineName));
          setUserId(JSON.parse(userId));
          setCenterId(JSON.parse(centerId));
          setMachineId(JSON.parse(machineId));
        }
      } catch (error) {
        console.error("Failed to fetch user-selected details from AsyncStorage", error);
      }
    };

    userSelectedDetails();
  // Focus listener to refetch data when screen is focused
  const unsubscribe = navigation.addListener('focus', () => {
    userSelectedDetails();
  });

  return unsubscribe; // Cleanup the listener on unmount
}, [navigation]);

  const handleSubmit = async () => {
  const payload = {
    userId, centerId, machineId, timeSlot, date
  };
  
  try {
    const response = await dispatch(bookingSlot(payload));
    dispatch(getBasedOnLocation());
    dispatch(getUserBookingSlot());
    console.log("Booking response:", response);
    if(response?.payload?.status === "confirmed"){
      navigation.replace('Main', { screen: 'Home' });
    }
  } catch (error) {
    console.error("Error during booking:", error);
    alert("Booking failed. Please try again.");
  }
};


  return (
    <View >
     
      <View style={styles.container}>
        {date && <Text style={styles.heading}>Date : {date}</Text>}
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
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9', 
    marginTop:100
  },
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
