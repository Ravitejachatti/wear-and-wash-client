let count=0 
export const fetchCurrentDate = async () => {
  
  let currentDate;
  try {
    
    // const response = await fetch('http://worldtimeapi.org/api/timezone/Etc/UTC');
    // const data = await response.json(); 
    
    // // Convert the fetched UTC time to a Date object
    // currentDate = new Date(data.utc_datetime);
    // console.log("console testing")
    // console.log("current ",currentDate)

    // Get IST offset (5 hours and 30 minutes ahead of UTC)
    // const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // 5 hours and 30 minutes in milliseconds   

    // // Adjust the UTC date to IST
    // currentDate = new Date(currentDate.getTime() + istOffset);
    // // console.log("currentDate ",currentDate)
    currentDate = new Date();

  } catch (error) {
    console.log("error in fetching ",error)
    // In case of an API error, fallback to system time and adjust to IST 
    currentDate = new Date();
    
  }
   // Get IST offset (5 hours and 30 minutes ahead of UTC) 
  //  const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // 5 hours and 30 minutes in milliseconds  

   // Adjust the UTC date to IST
  //  currentDate = new Date(currentDate.getTime() + istOffset);
   // console.log("currentDate ",currentDate)
  count++
  console.log("count ",count)
  return currentDate;
};
