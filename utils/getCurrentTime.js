import { Api } from "../Api/Api";

export const fetchCurrentDate = async () => {
  let currentDate;
  try {
    // Fetch the current time from the backend
    const response = await fetch(`${Api}/api/current-time`);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    // Convert the fetched server time to a Date object
    currentDate = new Date(data.currentTime);
  } catch (error) {
    // console.log("Error in fetching time: ", error);
    // Fallback to system time if API fails
    currentDate = new Date();
  }

  // console.log(currentDate)

  return currentDate;
};
