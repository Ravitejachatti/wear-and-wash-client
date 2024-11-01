import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, FlatList, Platform, ActivityIndicator, Alert, Text } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';  // Importing icons
import { useDispatch, useSelector } from "react-redux";
import { getBasedOnLocation, getUserBookingSlot } from "../../Redux/App/action";
import { getData } from "../../Storage/getData";
import { addData } from "../../Storage/addData";
import { fetchCurrentDate } from "../../utils/getCurrentTime";
import RNPickerSelect from "react-native-picker-select";
import AnimatedPaymentComp from "../PaymentComp/AnimatedPaymentComp";
import { countUserFutureBookings } from "../../utils/bookingUtils";
import { getUserBookingsForCurrentMonth } from "../../utils/futureBookingUtils"

const LocationComponent = () => {
  const dispatch = useDispatch();
  const [fetchedcurrentdate, setFetchedcurrentdate] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
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

  const timeSlots = [
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
    { label: "21:00 - 22:00", value: "21:00-22:00" }

    // ...more time slots as needed
  ];

  // Fetch current date and set initial state
  useEffect(() => {
    const fetchInitialDate = async () => {
      const currentDate = await fetchCurrentDate();  // Fetch the current date
      const currentDateObj = new Date(currentDate);  // Convert to a Date object

      setFetchedcurrentdate(currentDateObj);

      // Set the minimum and maximum date for the DateTimePicker
      setMinimumDate(currentDateObj);
      const year = currentDateObj.getFullYear();
      const month = currentDateObj.getMonth();
      setMaximumDate(new Date(year, month + 1, 0));  // Last day of the current month

      // Set the formatted date
      const formatted = currentDateObj.toISOString().split('T')[0];
      setFormattedDate(formatted);
      setLoading(false);  // Set loading to false after the date is fetched
    };

    fetchInitialDate();
  }, []);

  // Ensure that we only try to filter slots after the current date is set
  useEffect(() => {
    if (fetchedcurrentdate) {
      filterAvailableSlots();
    }
  }, [fetchedcurrentdate, date]);

  const filterAvailableSlots = async () => {
    const currentDate = fetchedcurrentdate;  // Use the fetched current date
    const selectedDateValue = new Date(date);  // Use the selected date from the state

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
    const [startTime] = slot.value.split("-");
    const currentHour = fetchedcurrentdate.getHours();
    const currentMinute = fetchedcurrentdate.getMinutes();
    const [slotHour, slotMinute] = startTime.split(":");

    const slotHourInt = parseInt(slotHour, 10);
    const slotMinuteInt = parseInt(slotMinute, 10);

    // Filter based on whether the slot is in the future for today
    return (
      slotHourInt > currentHour || 
      (slotHourInt === currentHour && slotMinuteInt > currentMinute)
    );
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    const formatted = currentDate.toISOString().split('T')[0];
    setFormattedDate(formatted);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  // Fetch user location, user ID, and future bookings
  useEffect(() => {
    // console.log("useffect 2")
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
        // // console.log("bookings test ",bookings)
          // console.log("testing")
        const userBookings = await countUserFutureBookings(bookings, JSON.parse(userId));
        setFutureBookingsCount(userBookings.length);
        

        const CurrentMonth = getUserBookingsForCurrentMonth(bookings, userId);
        setCurrentMonthBooking(CurrentMonth.length);
        // console.log("testing")

        // console.log("edge Cases ",userBookings,CurrentMonth)

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


  const handleProceed = async () => {
    if (selectedMachineId && selectedTimeSlot && formattedDate) {
      try {
        await addData("machineId", selectedMachineId?._id);
        await addData("machineName", selectedMachineId?.name);
        await addData("date", formattedDate);
        await addData("timeSlot", selectedTimeSlot);
        await addData("locationId", filterLocation[0]?._id);

        alert("Data stored successfully!");
        setShowPayment(true);
      } catch (error) {
        alert("Error storing data. Please try again.");
      }
    } else {
      alert("Please select both a machine and a time slot.");
    }
  };

  
  const handleCenterChange = (value) => { 
    setSelectedTimeSlot(value);
  };

  const store = useSelector((state) => state.app.centers);
  const filterLocation = userLocation && Array.isArray(store)
    ? store.filter((item) => item.name.toLowerCase() === userLocation.toLowerCase())
    : [];
  const machines = filterLocation.length > 0 ? filterLocation[0].machineId : [];

  const renderMachineItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedMachineId(item);
        setSelectedMachineName(item.name);
      }}
      style={[
        styles.machineItem,
        {
          backgroundColor: item._id === selectedMachineId?._id ? "gray" : (item.status ? "#1E90FF" : "red"),
        },
      ]}
    >
      <FontAwesome5 name="soap" size={30} color="#fff" />
      <Text style={styles.machineName}>{item.name}</Text>
      <Text style={styles.machineStatus}>{item.status ? "Available" : "Unavailable"}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#1E90FF" />;
  }


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
