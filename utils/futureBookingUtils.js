export const getUserBookingsForCurrentMonth = (bookings, userId) => {
  // // console.log(bookings)
  userId = JSON.parse(userId)
  
  const currentDate = new Date();
  // // console.log("Current Date: ", currentDate.toString()); // Log the full date for debugging
  const currentMonth = currentDate.getMonth() + 1; // Adjust to human-readable month (Jan is 1, Dec is 12)
  const currentYear = currentDate.getFullYear();
  // // console.log("Current Month (1-based index): ", currentMonth); 
  // // console.log("Current Year: ", currentYear)
    // Filter bookings where the userId matches and the booking is within the current month
    const currentMonthBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      // // console.log("booking date ",bookingDate)
      
      const bookingMonth = bookingDate.getMonth()+1;
      const bookingYear = bookingDate.getFullYear();
      // // console.log("bookingMonth ",bookingMonth) 
      // // console.log("booking Year ",bookingYear) 
      // // console.log("booking.userid ",booking.userId._id)
      const status = ( booking.userId._id === userId )
        // // console.log('status ',status)

      
  
      // Return only bookings by the user that are in the same year and month
      return (
        booking.userId._id === userId &&
        bookingMonth === currentMonth &&
        bookingYear === currentYear
      );
    });

     // console.log("currentMonthBookings ",currentMonthBookings.length)
    return currentMonthBookings; // Return the number of bookings for the current month
  };