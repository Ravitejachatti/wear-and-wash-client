// utils/instantBookingUtil.js
import moment from "moment-timezone";
import { Alert } from "react-native";
import { addData } from "../Storage/addData"; // Adjust path if needed
import axios from "axios";
import { Api } from "../Api/Api"

export const handleInstantBooking = async ({
  selectedMachineId,
  filterMachinesByTimeSlot,
  machines,
  isSlotAvailable,
  setSelectedMachineId,
  setSelectedTimeSlot,
  setSelectedDate,
  setShowPayment,
  filterLocation
}) => {
  const now = moment().tz("Asia/Kolkata");
  const oneHourLater = now.clone().add(1, "hour");

  const currentSlot = `${now.format("HH:mm")}-${oneHourLater.format("HH:mm")}`;
  const todayDate = now.format("YYYY-MM-DD");

  const checkAvailability = async (machineId) => {
    try {
      const response = await axios.post(`${Api}/api/bookings/getInstantbooking`, {
        machineId: machineId
      });
      return response.data?.available;
    } catch (error) {
      console.error("Availability check failed:", error.message);
      return false;
    }
  };

  const proceedWithBooking = async (machine) => {
    await addData("machineId", machine._id);
    await addData("machineName", machine.name);
    await addData("date", todayDate);
    await addData("timeSlot", currentSlot);
    await addData("locationId", filterLocation[0]?._id);

    setSelectedMachineId(machine);
    setSelectedTimeSlot(currentSlot);
    setSelectedDate(todayDate);
    setShowPayment(true);
  };

  // First: check selected machine
  if (selectedMachineId) {
    const isSelectedAvailable = await checkAvailability(selectedMachineId._id);
    if (isSelectedAvailable) {
      await proceedWithBooking(selectedMachineId);
      return;
    } else {
      // Ask user if they want to try other machines
      Alert.alert(
        "Selected Machine Unavailable",
        "Do you want to book an available machine instead?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            onPress: async () => {
              // Loop through other machines to find one
              let availableMachine = null;
              for (const machine of machines) {
                if (machine._id === selectedMachineId._id) continue;
                const available = await checkAvailability(machine._id);
                if (available) {
                  availableMachine = machine;
                  break;
                }
              }

              if (availableMachine) {
                await proceedWithBooking(availableMachine);
              } else {
                Alert.alert("No Machines Available", "No machines are free for the next 1 hour.");
              }
            },
          },
        ]
      );
      return;
    }
  }

  // No machine selected, go ahead with looping all
  let fallbackMachine = null;
  for (const machine of machines) {
    const available = await checkAvailability(machine._id);
    if (available) {
      fallbackMachine = machine;
      break;
    }
  }

  if (fallbackMachine) {
    await proceedWithBooking(fallbackMachine);
  } else {
    Alert.alert("No Machines Available", "No machines are free for the next 1 hour.");
  }
};
