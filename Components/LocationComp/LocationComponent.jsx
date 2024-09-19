import React, { useEffect, useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { View, StyleSheet, Text, TextInput, FlatList, Platform, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getBasedOnLocation } from "../../Redux/App/action";
import { useNavigation } from "@react-navigation/native";
import { getData } from "../../Storage/getData";
import { addData } from "../../Storage/addData";
import { theme } from "../../theme";
import DateTimePicker from '@react-native-community/datetimepicker';

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

  const store = useSelector((state) => state.app.centers);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        dispatch(getBasedOnLocation());
        const location = await getData("userLocation");
        console.log("Retrieved location from AsyncStorage:", location);
        if (location) {
          setUserLocation(JSON.parse(location));
        }
      } catch (error) {
        console.error("Error fetching location data or AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const filterLocation = userLocation && Array.isArray(store)
    ? store.filter((item) => item.name.toLowerCase() === userLocation.toLowerCase())
    : [];

  const machines = filterLocation.length > 0 ? filterLocation[0].machineId : [];

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
    console.log("checking date", selectedDate)
  
    const isAvailable = machine.bookedSlots.every((slot) => {
      const slotDate = new Date(slot.date).toISOString().split('T')[0];
      const [slotStartTime, slotEndTime] = [slot.timeRange.startTime, slot.timeRange.endTime];
  
      console.log("Checking slot:", { selectedDate, slotDate, selectedStartTime, selectedEndTime, slotStartTime, slotEndTime });
  
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
          backgroundColor: item._id === selectedMachineId?._id ? "gray" : (item.status ? "green" : "red"),
        },
      ]}
    >
      <Text style={styles.machineName}>{item.name}</Text>
      <Text>{item.status ? "Available" : "Unavailable"}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={theme.color.primary} />;
  }

  const id = filterLocation[0]?._id;

  const handleProceed = async () => {
    if (selectedMachineId && selectedTimeSlot) {
      console.log("clicked", selectedMachineId);
      const selectedDate = formattedDate || new Date().toISOString().split('T')[0];

      console.log("selectedDate", selectedDate);

      try {
        await addData("machineId", selectedMachineId?._id);
        await addData("machineName", selectedMachineId?.name);
        await addData("date", selectedDate);
        await addData("timeSlot", selectedTimeSlot);
        await addData("locationId", id);
        console.log("Data stored successfully!");

        setTimeout(() => {
          navigation.navigate("Payment");
        }, 100);
      } catch (error) {
        console.error("Error storing data:", error);
      }
    } else {
      console.log("Please select both a machine and a time slot.");
    }
  };

  console.log("machines", machines);

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

  console.log("date", date);

  return (
    <View style={styles.main}>
      <View style={styles.dropDownContainer}>
        <View style={styles.inputWrapper}>
          <RNPickerSelect
            onValueChange={handleCenterChange}
            placeholder={{
              label: "Select the Slot",
              value: null,
            }}
            items={[
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
            ]}
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
              placeholder: styles.placeholder,
              iconContainer: styles.iconContainer,
            }}
          />
        </View>

        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Select Date"
            value={formattedDate}
            onFocus={showDatepicker} 
          />

          {show && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
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


      <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed}>
        <Text style={styles.proceedBtnText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dropDownContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    borderWidth: 0.5,
    borderRadius: 23,
    marginBottom: 30,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: "black",
    fontSize: 23,
  },
  placeholder: {
    color: "black",
  },
  iconContainer: {
    top: 10,
    right: 10,
  },
  listContainer: {
    flexDirection: 'row',  
    flexWrap: 'wrap',  
    width: '100%',  
  },
  machineItem: {
    width: 120,
    height: 160,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5, 
    marginBottom: 10,
  },
  machineName: {
    color: "white",
    fontSize: 16,
  },
  btn: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "60%",
    margin: "auto",
    backgroundColor: theme.color.secondary,
    marginVertical: 20,
  },
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#333',
  },
  proceedBtn:{
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
  }
});



export default LocationComponent;
