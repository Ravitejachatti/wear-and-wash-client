import axios from "axios";
import { Api } from "../Api/Api";

const checkSlotAvailability = async (machineId, date, startTime, endTime) => {
  try {
    console.log("machineId, date, startTime, endTime", machineId, date, startTime, endTime);

        const res = await axios.post(`${Api}/payment/check-availability`, {
        machineId,
        date,
        startTime,
        endTime
        });

        console.log("Slot availability response", res.data);
 
    return res.data.isAvailable; 
  } catch (err) {
    console.error("Slot check error", err);
    return false;
  }
};

module.exports = checkSlotAvailability;
