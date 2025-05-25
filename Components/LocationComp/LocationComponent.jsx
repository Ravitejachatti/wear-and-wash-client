import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList, Platform, ActivityIndicator, Alert, Text, Dimensions } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';  // Importing icons
import { FontAwesome5, MaterialCommunityIcons } from 'react-native-vector-icons';

import { useDispatch, useSelector } from "react-redux";
import { getBasedOnLocation, getUserBookingSlot } from "../../Redux/App/action";
import { getData } from "../../Storage/getData";
import { addData } from "../../Storage/addData";
import { fetchCurrentDate } from "../../utils/getCurrentTime";
import RNPickerSelect from "react-native-picker-select";
import AnimatedPaymentComp from "../PaymentComp/AnimatedPaymentComp";
import { countUserFutureBookings } from "../../utils/bookingUtils";
import { getUserBookingsForCurrentMonth } from "../../utils/futureBookingUtils"
import moment from "moment-timezone";
import Testing from "../../Screens/Testing";
const screenWidth = Dimensions.get("window").width;
import { handleInstantBooking as bookNow } from "../../utils/intantBooking";
import checkSlotAvailability from "../../utils/checkAvailability";
import { removeItem } from "../../Storage/removeItem";


const LocationComponent = () => {
  
  const dispatch = useDispatch();
  const [fetchedcurrentdate, setFetchedcurrentdate] = useState( moment(new Date()).tz('Asia/Kolkata').format('YYYY-MM-DD'));
  const [date, setDate] = useState(new Date()); // Default date is the current date
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState(
    moment(new Date()).tz('Asia/Kolkata').format('YYYY-MM-DD')
  );
  const [minimumDate, setMinimumDate] = useState(null);
  const [maximumDate, setMaximumDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [futureBookingsCount, setFutureBookingsCount] = useState(0);
  const [currentMonthBooking, setCurrentMonthBooking] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const [selectedMachineName, setSelectedMachineName] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [filteredMachines, setFilteredMachines] = useState([]);
const [machineLoading, setMachineLoading] = useState(false);
const [machineAvailability, setMachineAvailability] = useState({});
const [availabilityLoading, setAvailabilityLoading] = useState(false);
const [instantBookingLoading, setInstantBookingLoading] = useState(false);




  const timeSlots = [
    
      { label: "00:00 - 01:00", value: "00:00-01:00" },
      { label: "01:00 - 02:00", value: "01:00-02:00" },
      { label: "02:00 - 03:00", value: "02:00-03:00" },
      { label: "03:00 - 04:00", value: "03:00-04:00" },
      { label: "04:00 - 05:00", value: "04:00-05:00" },
      { label: "05:00 - 06:00", value: "05:00-06:00" },
      { label: "06:00 - 07:00", value: "06:00-07:00" },
      { label: "07:00 - 08:00", value: "07:00-08:00" },
      { label: "08:00 - 09:00", value: "08:00-09:00" },
      { label: "09:00 - 10:00", value: "09:00-10:00" },
      { label: "10:00 - 11:00", value: "10:00-11:00" },
      { label: "11:00 - 12:00", value: "11:00-12:00" },
      { label: "12:00 - 13:00", value: "12:00-13:00" },
      { label: "13:00 - 14:00", value: "13:00-14:00" },
      { label: "14:00 - 15:00", value: "14:00-15:00" },
      { label: "15:00 - 16:00", value: "15:00-16:00" },
      { label: "16:00 - 17:00", value: "16:00-17:00" },
      { label: "17:00 - 18:00", value: "17:00-18:00" },
      { label: "18:00 - 19:00", value: "18:00-19:00" },
      { label: "19:00 - 20:00", value: "19:00-20:00" },
      { label: "20:00 - 21:00", value: "20:00-21:00" },
      { label: "21:00 - 22:00", value: "21:00-22:00" },
      { label: "22:00 - 23:00", value: "22:00-23:00" },
      { label: "23:00 - 00:00", value: "23:00-00:00" }
  
  

    // ...more time slots as needed
  ];



  // Fetch current date and set initial state
  useEffect(() => {
    const fetchInitialDate = async () => {
      const currentDate = await fetchCurrentDate();  // Fetch the current date
      const currentDateObj = new Date();  // Convert to a Date object

      setFetchedcurrentdate(currentDateObj);

      // Set the minimum and maximum date for the DateTimePicker
      setMinimumDate(currentDateObj);
      const year = currentDateObj.getFullYear();
      const month = currentDateObj.getMonth();
      setMaximumDate(new Date(year, month + 1, 0));  // Last day of the current month

      // Set the formatted date
      const formatted = currentDateObj.toISOString().split('T')[0];
      setFormattedDate(formatted);
      setSelectedDate(formatted); // ✅ Fix: set selectedDate to today
      setLoading(false);  // Set loading to false after the date is fetched
    };

    fetchInitialDate();
  }, []);

  // Ensure that we only try to filter slots after the current date is set
  useEffect(() => {
    console.log("Selected date changed:", selectedDate);
    if (selectedDate) {
      filterAvailableSlots();
    }
  }, [selectedDate]);

  const filterAvailableSlots = async () => {
    const currentDate = new Date(fetchedcurrentdate);  // Use the fetched current date
    const selectedDateValue = new Date(selectedDate); // ✅ use the actual selected date from state  // Use the selected date from the state

    let filteredSlots = [];

    if (selectedDateValue.toDateString() === currentDate.toDateString()) {
      // For today's date, filter only future time slots based on the current time
      const slotChecks = timeSlots.map(async (slot) => {
        const available = await isSlotAvailable(slot);
        return available ? slot : null;
      });
      filteredSlots = (await Promise.all(slotChecks)).filter(Boolean); // Filter out null (unavailable) slots
    } else if (selectedDateValue > currentDate) {
      // If the selected date is in the future, show all time slots without filtering
      filteredSlots = timeSlots;
    } else {
      // If the selected date is in the past, no slots are available
      filteredSlots = [];
    }

    // Set the available slots in the state
    setAvailableSlots(filteredSlots);
  };

  

  const isSlotAvailable = async (slot) => {
    const [slotHour, slotMinute] = slot.value.split("-")[0].split(":").map(Number); // get start time
  
    const now = moment.tz(new Date(), "Asia/Kolkata"); // current time in IST
    const selectedDateMoment = moment.tz(selectedDate, "YYYY-MM-DD", "Asia/Kolkata");
    //console.log(selectedDate)
  
    const isToday = now.isSame(selectedDateMoment, 'day');
  
    // Create full slot time in selected date
    const slotDateTime = selectedDateMoment.clone().set({ hour: slotHour, minute: slotMinute, second: 0, millisecond: 0 });
  
    if (isToday) {
      return slotDateTime.isAfter(now); // Only show future time slots
    }
  
    return true; // All slots allowed for future dates
  };

  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   // //console.log("selected date ",currentDate)
  //   setShow(Platform.OS === 'ios');
  //   setDate(currentDate);

  //   // Manually format the date as YYYY-MM-DD in local time
  // const year = currentDate.getFullYear();
  // const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 to month as it's zero-based
  // const day = String(currentDate.getDate()).padStart(2, '0');

  // const formatted = `${year}-${month}-${day}`;
  // setFormattedDate(formatted)
  // };

 

  // Fetch user location, user ID, and future bookings
  useEffect(() => {
    // // //console.log("useffect 2")
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

        const response = await dispatch(getUserBookingSlot(JSON.parse(userId)));

        const bookings = response.payload;
        // // // //console.log("bookings test ",bookings)
          // // //console.log("testing")
        const userBookings = await countUserFutureBookings(bookings, JSON.parse(userId));
        setFutureBookingsCount(userBookings.length);
        

        const CurrentMonth = getUserBookingsForCurrentMonth(bookings, userId); 
        setCurrentMonthBooking(CurrentMonth.length);
        // // //console.log("testing")

        // //console.log("edge Cases ",userBookings,CurrentMonth)

        if (userBookings.length > 0) {
          Alert.alert('You have upcoming bookings!');
        }
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
const parseTimeToDate = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const filterMachinesByTimeSlot = async (machine) => {
  if (!selectedTimeSlot || !selectedDate) return true;

  const [startTime, endTime] = selectedTimeSlot.split("-");

  setCheckingAvailability(true); // Start loading
  const available = await checkSlotAvailability(
    machine._id,
    selectedDate,
    startTime,
    endTime
  );
  setCheckingAvailability(false); // Stop loading

  return available;
};


  const handleProceed = async () => {
    if (selectedMachineId && selectedTimeSlot && formattedDate) {
      try {
        await addData("machineId", selectedMachineId?._id);
        await addData("machineName", selectedMachineId?.name);
        await addData("date", selectedDate);
        await addData("timeSlot", selectedTimeSlot);
        await addData("locationId", filterLocation[0]?._id);

        
        setShowPayment(true);
      } catch (error) {
        alert("Error storing data. Please try again.");
      }
    } else {
      alert("Please select both a machine and a time slot.");
    }
  };

 const handleClosePayment = async () => {
  setShowPayment(false);

  // Cleanup only if it was instant booking
  await removeItem("machineId");
  await removeItem("machineName");
  await removeItem("date");
  await removeItem("timeSlot");
  await removeItem("locationId");

  setSelectedMachineId(null);
  setSelectedMachineName(null);
  setSelectedTimeSlot(null);
  setSelectedDate(formattedDate);
};


  
const handleCenterChange = (value) => {
  setSelectedTimeSlot(value);
  setSelectedMachineId(null);  // Clear selected machine
  setSelectedMachineName(null); // Optional: Clear machine name too
};

useEffect(() => {
  const updateAvailability = async () => {
    if (!selectedTimeSlot || !selectedDate || machines.length === 0) return;

    setAvailabilityLoading(true);
    const [startTime, endTime] = selectedTimeSlot.split("-");

    const availabilityMap = {};
    await Promise.all(
      machines.map(async (machine) => {
        const isAvailable = await checkSlotAvailability(machine._id, selectedDate, startTime, endTime);
        availabilityMap[machine._id] = isAvailable;
      })
    );

    setMachineAvailability(availabilityMap);
    setAvailabilityLoading(false);
  };

  updateAvailability();
}, [selectedTimeSlot, selectedDate, machines]);



  const store = useSelector((state) => state.app.centers);
  const filterLocation = userLocation && Array.isArray(store)
    ? store.filter((item) => item.name.toLowerCase() === userLocation.toLowerCase())
    : [];
  const machines = filterLocation.length > 0 ? filterLocation[0].machineId : [];
  //console.log("machines ",filterLocation)



const renderMachineItem = ({ item }) => {
  const isSelected = item._id === selectedMachineId?._id;
  const isAvailable = machineAvailability[item._id];

  let iconColor = "skyblue"; // Default gray
  // // if (isSelected) iconColor = "#6c757d"; // Dark gray when selected
  // // else if (isAvailable === true) iconColor = "skyblue"; // Blue when available
  // if (isAvailable === false) iconColor = "#dc3545"; // Red when unavailable

  return (
    <TouchableOpacity

      onPress={() => {
        if (isAvailable) {
                  setSelectedMachineId(item);
                  setSelectedMachineName(item.name);
                } else {
                  Alert.alert("Unavailable", "This machine is not available for the selected slot.");
                }
      }}
            style={[
        styles.machineItemMinimal,
        isSelected ? { borderColor: "skyblue", borderWidth: 2 }: { borderColor: "transparent", borderWidth: 0 },
        isAvailable === false ? { backgroundColor: "#f8d7da" } : { backgroundColor: "#f5f5f5" }
      ]}
    >
    <View style={{ alignItems: 'center',}}>
      <MaterialCommunityIcons name="washing-machine" size={80} color={iconColor} />
      <Text style={styles.machineNameMinimal}>{item.name}</Text>
    </View>

    </TouchableOpacity>
  );
};


  if (loading) {
    return <ActivityIndicator size="large" color="#1E90FF" />;
  }
const handleInstantBooking = async () => {
  try {
    setInstantBookingLoading(true); // Start loading
    await bookNow({
      isSlotAvailable,
      selectedMachineId,
      machines,
      filterMachinesByTimeSlot,
      setSelectedMachineId,
      setSelectedTimeSlot,
      setSelectedDate,
      setShowPayment,
      filterLocation
    });
  } catch (error) {
    Alert.alert("Error", "Something went wrong while booking.");
    console.error(error);
  } finally {
    setInstantBookingLoading(false); // Stop loading
  }
};



  return (
    <View style={styles.main}>
     <View style={styles.dateInputWrapper}>
     <Testing onDateChange={setSelectedDate} />
         
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
            inputIOS: {
                ...styles.input,
                fontWeight: '600',
                color: '#333',
              },
              inputAndroid: {
                ...styles.input,
                fontWeight: '600',
                color: '#333',
              },
              placeholder: {
                ...styles.placeholder,
                fontWeight: '500',
                color: '#888',
              },
              iconContainer: styles.iconContainer,
           
            }}
          />
        </View>

       
      </View>

{availabilityLoading ? (
  <ActivityIndicator size="large" color="#1E90FF" />
) : (
  <FlatList
    data={machines}
    renderItem={renderMachineItem}
    keyExtractor={(item) => item._id}
    numColumns={3}
    showsHorizontalScrollIndicator={false}
     contentContainerStyle={{ paddingBottom: 20 }}
  />
)}

      <TouchableOpacity
        style={[styles.proceedBtn, futureBookingsCount > 0 ||  currentMonthBooking >= 4 ? styles.disabledBtn : null]} // Disable styling
        onPress={handleProceed}
        disabled={futureBookingsCount > 0  || currentMonthBooking >= 4 } // Disable button if user has future bookings
      >
        <Text style={styles.proceedBtnText}>
          {futureBookingsCount > 0 || currentMonthBooking >= 4 ? "Booking Unavailable" : "Proceed"}
        </Text>
      </TouchableOpacity>
<TouchableOpacity
  style={[styles.proceedBtn, { backgroundColor: "#ff9800" }]} // Orange
  onPress={handleInstantBooking}
  disabled={instantBookingLoading}
>
  {instantBookingLoading ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={[styles.proceedBtnText, { color: "#fff" }]}>
      Book Instant Slot
    </Text>
  )}
</TouchableOpacity>

      {/* Animated PaymentComp */}
      <AnimatedPaymentComp
        isVisible={showPayment}
        onClose={handleClosePayment} // Close the payment screen
      />
    </View>
  );
};









const styles = StyleSheet.create({
  main:{

  alignItems:"center",
  justifyContent:"center"
  },
  dropDownContainer: {
    marginTop:20,
    marginBottom: 20,
    marginHorizontal: 20,
    width:"75%"
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#d3d3d3",
    marginBottom: 20,
  },
input: {
  paddingVertical: 12,
  paddingHorizontal: 10,
  fontSize: 16,
  color: "#333",
  fontWeight: "600", // added boldness
},
  placeholder: {
    color: "#999",
  },
  iconContainer: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  dateInputWrapper: {
    
    alignItems: "center",
    justifyContent:"center",
    marginBottom: 10,
    marginTop:20,
   
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow items to wrap to the next line
    justifyContent: "space-between", // Distribute items evenly
    paddingHorizontal: 10,
    width: "100%", // Take full width of the screen
  },
  machineItem: {
    flexBasis: "30%", // Each item takes 30% of the container width
    margin: 5, // Add spacing between items
    height: screenWidth * 0.3, // Make height proportional to screen width
    borderRadius: 15,
    backgroundColor: "#007bff", // Vibrant blue for available machines
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6, // Adds depth and shadow for Android
  },
  machineName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginVertical:5,
  },
  machineStatus: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "400",
    textAlign: "center",
  },
  proceedBtn: {
    width:"75%",
    backgroundColor: "skyblue", // Green button when active
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8, // Adds depth and shadow for Android
  },
  disabledBtn: {
    backgroundColor: "#b0b0b0", // Softer gray for a disabled button
  },
  proceedBtnText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },

machineNameMinimal: {
  fontSize: 13,
  fontWeight: "600",
  textAlign: "center",
  color: "gray",
},
machineItemMinimal: {
  width: screenWidth / 3 - 20, // 3 per row with margin
  aspectRatio: 1, // makes it a square box
  padding: 5,
  height: screenWidth / 3 - 20, // Maintain square aspect ratio
  margin: 5,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f5f5f5",
  borderRadius: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},



});


export default LocationComponent;

