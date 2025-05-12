// utils/instantBookingUtil.js
import moment from "moment-timezone";
import { Alert } from "react-native";
import { addData } from "../Storage/addData"; // Adjust path if needed
import axios from "axios";
import { Api } from "../Api/Api"

export const handleInstantBooking = async ({
  isSlotAvailable,
  machines,
  filterMachinesByTimeSlot,
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
  console.log("currentSlot ",currentSlot)

  // ❗️ Declare availableMachine before the loop
  let availableMachine = null;
  for (const machine of machines) {
    console.log("machineid ",machine._id)
    try {
      const response = await axios.post(`${Api}/api/bookings/getInstantbooking`, {
        machineId: machine._id
      });
      console.log("response ",response.data)

      if (response.data?.available) {
        availableMachine = machine;
        break;
      }
    } catch (error) {
      console.log("Instant booking check failed:", error.message);
    }
  }


  if (!availableMachine) {
    Alert.alert("Slot Unavailable", "No machine is available for the next 1 hour.");
    return;
  }

  await addData("machineId", availableMachine._id);
  await addData("machineName", availableMachine.name);
  await addData("date", todayDate);
  await addData("timeSlot", currentSlot);
  await addData("locationId", filterLocation[0]?._id);

  setSelectedMachineId(availableMachine);
  setSelectedTimeSlot(currentSlot);
  setSelectedDate(todayDate);
  setShowPayment(true);
};