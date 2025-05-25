import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment-timezone'; // Import moment-timezone for time zone conversion

const Testing = ({ onDateChange }) => {
  const [date, setDate] = useState(new Date()); // Default date is the current date
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState(
    moment(new Date()).tz('Asia/Kolkata').format('YYYY-MM-DD')
  );
  const [minimumDate, setMinimumDate] = useState(null);
  const [maximumDate, setMaximumDate] = useState(null);

  useEffect(() => {
    const currentDateObj = moment().tz('Asia/Kolkata').toDate(); // Convert to IST
    setMinimumDate(currentDateObj);

    // Calculate the maximum date (last day of the current month in IST)
    const year = currentDateObj.getFullYear();
    const month = currentDateObj.getMonth();
    const maxDate = new Date(year, month + 1, 0); // Last day of the current month
    setMaximumDate(maxDate);
  }, []);
  

  // Function to handle the change in date
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // Close the picker on Android

    // Update the date in the state
    setDate(currentDate);

    // Convert the date to Indian Standard Time (IST)
    const localDate = moment(currentDate).tz('Asia/Kolkata').format('YYYY-MM-DD');
    setFormattedDate(localDate);
    if (onDateChange) {
      onDateChange(localDate); // Pass the formatted date to the parent
    }
  };

  // Function to show the date picker
  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View style={ styles.dateView }>
      {/* Button to open the date picker */}
      

      {/* TextInput to display and manually edit the date */}
      <TextInput
        style={{
          
          borderColor: '#ccc',
          padding: 10,
          fontSize: 16, 
          fontWeight: "600",
          color: "#333"
          
          
        }}
        value={formattedDate}
        onChangeText={(text) => {
          setFormattedDate(text);
          if (onDateChange) onDateChange(text); // Update the parent component when text is manually edited
        }}
        placeholder="YYYY-MM-DD"
      />

      {show &&  minimumDate && maximumDate &&  (
        <DateTimePicker
          value={date} // Set the initial date
          mode="date" // Choose the mode (date, time, or datetime)
          display="default" // Display style (spinner, default, etc.)
          onChange={onChange} // Handle date change
          minimumDate={minimumDate}  // Set the minimum date to current date
          maximumDate={maximumDate}
        />
      )}

<TouchableOpacity style={styles.iconContainer} onPress={showDatepicker}>
            <FontAwesome5 name="calendar-alt" size={24} color="gray" />
          </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dateView:{
    alignItems: "center",
    justifyContent:"center",
    display:"flex",
    flexDirection:'row',
    gap:90,
    width:"80%",
    borderWidth:1,
    borderColor:"#ccc",
    borderRadius:8,
    paddingHorizontal:20,
    paddingVertical:5
  },
  iconContainer: {
    
    paddingHorizontal: 10,
  },
});

export default Testing;
