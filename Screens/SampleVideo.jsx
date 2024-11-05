import React, { useState, useRef }  from 'react'
import { View, StyleSheet, Button,Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const SampleVideo = () => {
    const video = useRef(null);
    const [status, setStatus] = useState({});
  return (
    <View style={styles.container}>
        <Text style={styles.textShow}>How to use</Text>
    <Video
      ref={video}
      style={styles.video}
      source={{
        uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
      }}
      useNativeControls
      resizeMode={ResizeMode.CONTAIN}
      
      
    />
   
  </View>
  )
}

export default SampleVideo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    
    height: 250,
  },
  textShow:{
    fontSize: 20,
    color: '#1E90FF',

  },
  video: {
    alignSelf: 'center',
    width: 280,
    height: 220,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


// import { WebView } from 'react-native-webview';
// import Constants from 'expo-constants';
// import { StyleSheet } from 'react-native';

// export default function App() {
//   return (
//     <WebView
//       style={styles.container}
//       source={{ uri: 'https://expo.dev' }}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: Constants.statusBarHeight,
//   },
// });


// import React, { useEffect, useState } from "react";
// import { View, StyleSheet, TextInput, TouchableOpacity, Platform } from "react-native";
// import DateTimePicker from '@react-native-community/datetimepicker';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';  // Importing icons
// import { fetchCurrentDate } from "../utils/getCurrentTime";  // Assuming this function exists

// const DatePickerComponent = () => {
//   const [date, setDate] = useState(null);
//   const [show, setShow] = useState(false);
//   const [formattedDate, setFormattedDate] = useState('');
//   const [minimumDate, setMinimumDate] = useState(null);
//   const [maximumDate, setMaximumDate] = useState(null);

//   // Fetch current date once the component mounts
//   useEffect(() => {
//     const fetchInitialDate = async () => {
//       const currentDate = await fetchCurrentDate();  // Fetch the current date
//       const currentDateObj = new Date(currentDate);  // Convert to a Date object
//       setDate(currentDateObj);

//       // Set the minimum and maximum date for the DateTimePicker
//       setMinimumDate(currentDateObj);
//       const year = currentDateObj.getFullYear();
//       const month = currentDateObj.getMonth();
//       setMaximumDate(new Date(year, month + 1, 0));  // Last day of the current month

//       // Set the formatted date
//       const formatted = currentDateObj.toISOString().split('T')[0];
//       setFormattedDate(formatted);
//     };

//     fetchInitialDate();
//   }, []);

//   const handleDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShow(Platform.OS === 'ios');
//     setDate(currentDate);

//     const formatted = currentDate.toISOString().split('T')[0];
//     setFormattedDate(formatted);
//   };

//   const showDatepicker = () => {
//     setShow(true);
//   };

//   return (
//     <View style={styles.main}>
//       <View style={styles.dateInputWrapper}>
//         <TouchableOpacity style={styles.iconContainer} onPress={showDatepicker}>
//           <FontAwesome5 name="calendar-alt" size={24} color="gray" />
//         </TouchableOpacity>
//         <TextInput
//           style={styles.input}
//           placeholder="Select Date"
//           value={formattedDate}
//           onFocus={showDatepicker}
//           onChangeText={setFormattedDate} // Allow manual entry of date
//         />
//         {show && minimumDate && maximumDate && (
//           <DateTimePicker
//             value={date}
//             mode="date"
//             display="default"
//             onChange={handleDateChange}
//             minimumDate={minimumDate}  // Set the minimum date to current date
//             maximumDate={maximumDate}  // Set the maximum date to the last day of the current month
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   main: {
//     padding: 20,
//     justifyContent: 'center',
//   },
//   dateInputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 0.5,
//     borderRadius: 10,
//     padding: 5,
//   },
//   input: {
//     paddingVertical: 15,
//     paddingHorizontal: 5,
//     color: "black",
//     fontSize: 15,
//     borderColor: "black",
//     flex: 1,
//   },
//   iconContainer: {
//     paddingHorizontal: 10,
//   }
// });

// export default DatePickerComponent;



