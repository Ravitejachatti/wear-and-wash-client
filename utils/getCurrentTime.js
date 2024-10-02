export const fetchCurrentDate = async () => {
    let currentDate;
    try {
      const response = await fetch('http://worldtimeapi.org/api/timezone/Etc/UTC');
      const data = await response.json();
      currentDate = new Date(data.utc_datetime);
      console.log("Fetched current date from API:", currentDate);
    } catch (error) {
      console.error("Error fetching the current date from API:", error);
      // Fallback to system time in case of an API error
      currentDate = new Date();
    }
    return currentDate;
  };