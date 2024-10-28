import React, { useEffect, useState } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Api } from '../../Api/Api';

const MachineStart = ({ value }) => {
  const [isButtonEnabled, setIsButtonEnabled] = useState(false); // State to manage button enable/disable
  const booking = value && value.length > 0 ? value[0] : null; // Get the first booking only if value is not null or empty

  // Function to check whether the current time falls within the first 5 minutes of the start time
  const checkTimeSlot = () => {
    if (!booking) return; // Exit if booking is null

    const currentTime = new Date(); // Get the current time
    const { startTime } = booking.timeSlot;

    // Create a Date object for the start time
    const startDateTime = new Date();
    const [startHour, startMinute] = startTime.split(":");
    startDateTime.setHours(startHour);
    startDateTime.setMinutes(startMinute);
    startDateTime.setSeconds(0); // Set seconds to 0

    // Create a Date object for 5 minutes after the start time
    const fiveMinutesLater = new Date(startDateTime);
    fiveMinutesLater.setMinutes(fiveMinutesLater.getMinutes() + 5);

    // Enable the button if the current time is between start time and 5 minutes later
    if (currentTime >= startDateTime && currentTime <= fiveMinutesLater) {
      setIsButtonEnabled(true); // Enable the button
    } else {
      setIsButtonEnabled(false); // Disable the button
    }
  };

  useEffect(() => {
    if (!booking) return; // Prevent setting the interval if booking is null

    // Check the time slot every second to enable or disable the button automatically
    const intervalId = setInterval(checkTimeSlot, 1000); // Check every second

    // Clean up the interval when the component unmounts or booking changes
    return () => clearInterval(intervalId);
  }, [booking]); // Depend on booking to reset interval if it changes

  // Function to send machine status to the backend server
  const startMachine = async () => {
    if (!booking) return; // Prevent executing if booking is null
    const centerId = booking.centerId._id; // Assuming you have centerId in the booking object
    const machineId = booking.machineId._id; // Assuming you have machineId in the booking object

    try {
      const response = await fetch(`${Api}/api/update-machine-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          centerId,
          machineId,
          status: true
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert('Machine Started and Status Updated on the Server!');
      } else {
        console.error(result.error);
        alert('Failed to update the machine status.');
      }
    } catch (error) {
      console.error('Error updating machine status:', error);
      alert('Failed to communicate with the server.');
    }
  };

  // console.log("filteredBooking from the start ", value);

  return (
    <View >
      

      <TouchableOpacity
      onPress={startMachine}
      disabled={!isButtonEnabled}
      style={[
        styles.button,
        isButtonEnabled ? styles.buttonEnabled : styles.buttonDisabled,
      ]}
    >
      <Text style={styles.buttonText}>Start Machine</Text>
    </TouchableOpacity>

           
    </View>
  );
};

const styles = StyleSheet.create({

  button: {
    marginTop:20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonEnabled: {
    backgroundColor: '#1E90FF',
  },
  buttonDisabled: {
    backgroundColor: 'lightgray',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight:'bold'
    
  },
});

export default MachineStart;
