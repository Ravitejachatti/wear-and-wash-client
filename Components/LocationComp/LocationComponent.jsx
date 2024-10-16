import React, { useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { countUserFutureBookings } from '../../utils/bookingUtils';
import RNPickerSelect from "react-native-picker-select";
import { View, StyleSheet, Text, TextInput, FlatList, Platform, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getBasedOnLocation, getUserBookingSlot } from "../../Redux/App/action";
import { useNavigation } from "@react-navigation/native";
import { getData } from "../../Storage/getData";
import { addData } from "../../Storage/addData";
import { theme } from "../../theme";
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';  // Importing icons
import AnimatedPaymentComp from "../PaymentComp/AnimatedPaymentComp";
import { getUserBookingsForCurrentMonth } from "../../utils/futureBookingUtils";
import { fetchCurrentDate } from "../../utils/getCurrentTime";


const LocationComponent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const [selectedMachineName, setSelectedMachineName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const [userId, setUserId] = useState(null);
  const [futureBookingsCount, setFutureBookingsCount] = useState(0); // To track future bookings
  const [showPayment, setShowPayment] = useState(false);
  const [currentMonthBooking, setCurrentMonthBooking] = useState(0);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [minimumDate, setMinimumDate] = useState(null);
  const [maximumDate, setMaximumDate] = useState(null);


  const timeSlots = [
    { label: "09:00 - 09:30", value: "09:00-09:30" },
    { label: "09:30 - 10:00", value: "09:30-10:00" },
    { label: "10:00 - 10:30", value: "10:00-10:30" },
    { label: "10:30 - 11:00", value: "10:30-11:00" },
    { label: "11:00 - 11:30", value: "11:00-11:30" },
    { label: "11:30 - 12:00", value: "11:30-12:00" },
    { label: "12:00 - 12:30", value: "12:00-12:30" },
    { label: "12:30 - 13:00", value: "12:30-13:00" },
    { label: "13:00 - 13:30", value: "13:00-13:30" },
    { label: "13:30 - 14:00", value: "13:30-14:00" },
    { label: "14:00 - 14:30", value: "14:00-14:30" },
    { label: "14:30 - 15:00", value: "14:30-15:00" },
    { label: "15:00 - 15:30", value: "15:00-15:30" },
    { label: "15:30 - 16:00", value: "15:30-16:00" },
    { label: "16:00 - 16:30", value: "16:00-16:30" },
    { label: "16:30 - 17:00", value: "16:30-17:00" },
    { label: "17:00 - 17:30", value: "17:00-17:30" },
    { label: "17:30 - 18:00", value: "17:30-18:00" },
    { label: "18:00 - 18:30", value: "18:30-19:00" },
    { label: "18:30 - 19:00", value: "19:00-19:30" }
  ];


  const getCurrentTime = async () => {
    const currentDate = await fetchCurrentDate();  // Get the current date with the correct timezone
  const currentHour = currentDate.getHours();    // Use `getHours()` to get the local hours
  const currentMinute = currentDate.getMinutes(); // Use `getMinutes()` to get the local minutes

  // Ensure proper formatting of hours and minutes with padding
  const formattedHour = currentHour.toString().padStart(2, '0');
  const formattedMinute = currentMinute.toString().padStart(2, '0');

  console.log(`Current Time: ${formattedHour}:${formattedMinute}`);
  return { currentHour: formattedHour, currentMinute: formattedMinute };
};

  // const isSlotAvailable = async (slot) => {
  //   const [startTime] = slot.value.split("-");
  //   const { currentHour, currentMinute } = await getCurrentTime();
  //   // console.log("location ",currentHour)

  //   // Compare times to see if the slot is available
  //   const [slotHour, slotMinute] = startTime.split(":");
  //   return (
  //     parseInt(slotHour, 10) > parseInt(currentHour, 10) ||
  //     (parseInt(slotHour, 10) === parseInt(currentHour, 10) &&
  //       parseInt(slotMinute, 10) > parseInt(currentMinute, 10))
  //   );
  // };   

  const isSlotAvailable = async (slot) => {
    const [startTime] = slot.value.split("-"); // Extract the start time
    const { currentHour, currentMinute } = await getCurrentTime(); // Get the current time
    console.log("Current Hour: ", currentHour, "Current Minute: ", currentMinute);
  
    const [slotHour, slotMinute] = startTime.split(":");
  
    // Convert to integers for comparison
    const slotHourInt = parseInt(slotHour, 10);
    const slotMinuteInt = parseInt(slotMinute, 10);
    const currentHourInt = parseInt(currentHour, 10);
    const currentMinuteInt = parseInt(currentMinute, 10);
    console.log("testing 3 ",slotHourInt,slotMinuteInt,currentHourInt,currentMinuteInt)
  
    // Check if the slot is at least one hour ahead of the current time
    return (
      slotHourInt > currentHourInt + 1 || 
      (slotHourInt === currentHourInt + 1 && slotMinuteInt > currentMinuteInt)
    );
  };
  

  const filterAvailableSlots = async () => {
    const currentDate = await fetchCurrentDate();  // Only fetch once
    const selectedDateValue = new Date(date);
    let filteredSlots;
  
    // Compare selected date with the current date
    if (selectedDateValue.toDateString() === currentDate.toDateString()) { 
      filteredSlots = timeSlots.filter(isSlotAvailable);  // Filter future slots for the same day
      console.log(filteredSlots," testing 2")
    } else {
      filteredSlots = timeSlots;  // Show all slots for future dates
    }
    
    setAvailableSlots(filteredSlots);
  };
  

  const store = useSelector((state) => state.app.centers);
  const filterLocation = userLocation && Array.isArray(store)
    ? store.filter((item) => item.name.toLowerCase() === userLocation.toLowerCase())
    : [];
  const machines = filterLocation.length > 0 ? filterLocation[0].machineId : [];
  
  

  // Fetch user location, user ID, and future bookings
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        dispatch(getBasedOnLocation());
        const location = await getData("userLocation");
        const userId = await getData("userId");
        setUserId(JSON.parse(userId));

        if (location) {
          setUserLocation(JSON.parse(location));
        }

        // Fetch future bookings
        const response = await dispatch(getUserBookingSlot()); // Ensure getUserBookingSlot is an async action
        const bookings = response.payload;
        // console.log("bookings in location ",bookings)


        // Count bookings for the current month
        const userBookings = await countUserFutureBookings(bookings, JSON.parse(userId));
        // console.log("User bookings in home:", userBookings);

        setFutureBookingsCount(userBookings.length); // Update the future bookings count
        // console.log("futurebooking count in location ",futureBookingsCount)

        // console.log("currentMonthbookingBefore ",currentMonthBooking)

        const CurrentMonth = getUserBookingsForCurrentMonth(bookings,userId)
        // console.log("currentMonth original ",CurrentMonth.length)
        //const currentMonthBooking = getUserBookingsForCurrentMonth(bookings,JSON.parse(userId))
        setCurrentMonthBooking(CurrentMonth.length)
        // console.log("current Month bookings ",currentMonthBooking)

        // console.log("currentMonthbookingAfter ",currentMonthBooking)
        setLoading(true);

        if (userBookings.length > 0) {
          Alert.alert('You have upcoming bookings!'); // Alert the user if they have any future bookings 
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    const filteredSlots = timeSlots.filter(isSlotAvailable);
    console.log("filtering slots")
    console.log(filteredSlots)
    setAvailableSlots(filteredSlots);


const currentDate = async () =>{
     let currentDate1 = await fetchCurrentDate()
   currentDate1 = new Date(currentDate1);

// Extract year and month
const year = currentDate1.getFullYear();
const month = currentDate1.getMonth(); // Note: 0-indexed

// Set minimum date to the current date
const minimumDate = currentDate1;
setMinimumDate(minimumDate)

// Set maximum date to the last day of the current month
const maximumDate = new Date(year, month + 1, 0); // Last day of the month
setMaximumDate(maximumDate)

// console.log("Minimum Date:", minimumDate);  // Output: Current date
// console.log("Maximum Date:", maximumDate);  // Output: Last day of September 2024
  
}
    

    fetchData();
    currentDate();
  }, [dispatch]);

  const handleCenterChange = (value) => { 
    setSelectedTimeSlot(value);
  };

  const handleMachinePress = (machine) => {
    setSelectedMachineId(machine);
    setSelectedMachineName(machine.name);
  };

  const filterMachinesByTimeSlot = (machine) => {
    if (!selectedTimeSlot || !formattedDate) return true;

    const [selectedStartTime, selectedEndTime] = selectedTimeSlot.split("-");
    const selectedDate = date.toISOString().split('T')[0];

    const isAvailable = machine.bookedSlots.every((slot) => {
      const slotDate = new Date(slot.date).toISOString().split('T')[0];
      const [slotStartTime, slotEndTime] = [slot.timeRange.startTime, slot.timeRange.endTime];

      if (slotDate === selectedDate) {
        return (selectedEndTime <= slotStartTime) || (selectedStartTime >= slotEndTime);
      }
      return true;
    });

    return isAvailable;
  };

  const renderMachineItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleMachinePress(item)}
      style={[
        styles.machineItem,
        {
          backgroundColor: item._id === selectedMachineId?._id ? "gray" : (item.status ? "#1E90FF" : "red"), // Blue color when available
        },
      ]}
    >
      {/* Washing machine icon */}
      <FontAwesome5 name="soap" size={30} color="#fff" />
      <Text style={styles.machineName}>{item.name}</Text>
      <Text style={styles.machineStatus}>{item.status ? "Available" : "Unavailable"}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#1E90FF" />; // Blue color for loading spinner
  }

  const id = filterLocation[0]?._id;

  const handleProceed = async () => {
    if (selectedMachineId && selectedTimeSlot && formattedDate) {
      const selectedDate = formattedDate || new Date().toISOString().split('T')[0];

      try {
        await addData("machineId", selectedMachineId?._id);
        await addData("machineName", selectedMachineId?.name);
        await addData("date", selectedDate);
        await addData("timeSlot", selectedTimeSlot);
        await addData("locationId", id);

        alert("Data stored successfully!"); 
        //  <AnimatedPaymentComp/>
        setShowPayment(true);

      } catch (error) {
        // console.error("Error storing data:", error);
        alert("Error storing data. Please try again.");
      }
    } else {
      alert("Please select both a machine and a time slot.");
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    const formatted = currentDate.toISOString().split('T')[0];
    console.log("formated date",formatted)
    setFormattedDate(formatted);
    filterAvailableSlots(); // Re-filter slots based on the selected date
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.main}>
     <View style={styles.dateInputWrapper}>
          <TouchableOpacity style={styles.iconContainer} onPress={showDatepicker}>
            <FontAwesome5 name="calendar-alt" size={24} color="gray" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Select Date"
            value={formattedDate}
            onFocus={showDatepicker}
            onChangeText={setFormattedDate} // Allow manual entry of date
          />
          {show && minimumDate && maximumDate && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
              minimumDate={minimumDate}  // Set the minimum date to current date
              maximumDate={maximumDate}  // Set the maximum date to the last day of the current month
            />
          )}
        </View>
      <View style={styles.dropDownContainer}>
        <View style={styles.inputWrapper}>
          <RNPickerSelect
            onValueChange={handleCenterChange}
            placeholder={{
              label: "Select the Slot",
              value: null,
            }}
            items={availableSlots}
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
              placeholder: styles.placeholder,
              iconContainer: styles.iconContainer,
            }}
          />
        </View>

       
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={machines.filter(filterMachinesByTimeSlot)}
          renderItem={renderMachineItem}
          keyExtractor={(item) => item._id}
          numColumns={3}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.proceedBtn, futureBookingsCount > 0 ||  currentMonthBooking >= 4 ? styles.disabledBtn : null]} // Disable styling
        onPress={handleProceed}
        disabled={futureBookingsCount > 0  || currentMonthBooking >= 4 } // Disable button if user has future bookings
      >
        <Text style={styles.proceedBtnText}>
          {futureBookingsCount > 0 || currentMonthBooking >= 4 ? "Booking Unavailable" : "Proceed"}
        </Text>
      </TouchableOpacity>
      {/* Animated PaymentComp */}
      <AnimatedPaymentComp
        isVisible={showPayment}
        onClose={() => setShowPayment(false)} // Close the payment screen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropDownContainer: {
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  inputWrapper: {
    borderWidth: 0.5,
    borderRadius: 10,
    marginBottom: 30,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    color: "black",
    fontSize: 15,
    borderColor: "black",
  },
  placeholder: {
    color: "black",
  },
  iconContainer: {
    top: 10,
    right: 10,
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",  // Allows items to wrap to the next line
    justifyContent: "space-around",  // Distributes the items evenly in the row
    width: "100%",
    marginVertical: 5, // Adds vertical spacing between rows
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 5,
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 5,
  },
  machineItem: {
    width: 100,
    height: 120,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    margin:5,
    marginLeft:11  ,
    backgroundColor: '#1E90FF',  // Default blue for available machines
  },
  machineName: {
    color: "white",
    fontSize: 14,
    
  },
  machineStatus: {
    color: "white",
    fontSize: 12,
  },
  proceedBtn: {
    backgroundColor: "#1E90FF",  // Blue button when active
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  disabledBtn: {
    backgroundColor: "#ccc", // Gray color for disabled button
  },
  proceedBtnText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LocationComponent;
