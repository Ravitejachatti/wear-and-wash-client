// utils/bookingUtils.js
import { fetchCurrentDate } from "./getCurrentTime";


// Function to count future bookings for the current user
export const countUserFutureBookings = async (bookings, userId) => {
  if (!bookings || bookings.length === 0 || !userId) return 0;

  // Normalize userId to a string (remove surrounding quotes if they exist)
  const normalizedUserId = userId.replace(/^"(.*)"$/, "$1");

  // Get the current date (set time to midnight for comparison)
  // Get the current date from an external API (WorldTimeAPI example)
  const currentDate =  await fetchCurrentDate()

  console.log("currentDate ",currentDate)
  // Filter user bookings by userId and check if the date is in the future
  const userFutureBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    // Assuming booking has `starttime` and `endtime` as properties (in 'HH:mm' format, e.g., '14:00')
    const bookingStartTime = booking.timeSlot.startTime; // Time slot start time (e.g., '14:00')
    const bookingEndTime = booking.timeSlot.endTime; // Time slot end time (e.g., '16:00')

    // Combine bookingDate with starttime and endtime to create full Date objects
    const startDateTime = new Date(bookingDate);
    const endDateTime = new Date(bookingDate);

    // Add time part to bookingDate (assuming starttime/endtime are in 'HH:mm' format)
    const [startHours, startMinutes] = bookingStartTime.split(":").map(Number);
    const [endHours, endMinutes] = bookingEndTime.split(":").map(Number);

    startDateTime.setHours(startHours, startMinutes, 0, 0); // Add starttime to bookingDate
    endDateTime.setHours(endHours, endMinutes, 0, 0); // Add endtime to bookingDate

    // Convert booking date string to Date object

    // Normalize booking.userId._id or booking.userId.id to string
    const normalizedBookingUserId = String(
      booking.userId._id || booking.userId.id
    );
    const isUserMatch = normalizedBookingUserId === normalizedUserId;
    const isFutureBooking = bookingDate > currentDate; // Check if booking start time is in the future
    const isOngoingBooking =
      startDateTime <= currentDate && endDateTime > currentDate; // Check if the booking is currently ongoing

    // Log the matches for debugging
    //console.log("User Match:", isUserMatch, "Future Date Match:", isFutureDate);

    // Return true if both user matches and the booking date is in the future
    return isUserMatch && (isFutureBooking && isOngoingBooking);
  });

  // Log filtered user future bookings for debugging
  //console.log("Filtered User Future Bookings:", userFutureBookings);
  console.log("userFutureBookings ", userFutureBookings);

  return userFutureBookings; // Return the array of future bookings
};
