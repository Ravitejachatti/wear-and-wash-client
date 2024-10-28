// utils/bookingUtils.js 
import { fetchCurrentDate } from "./getCurrentTime";

// Function to count future bookings for the current user
export const countUserFutureBookings = async (bookings, userId) => {
  console.log("userId from count userBookings ",userId)
  console.log(bookings)
  if (!bookings || bookings.length === 0 || !userId) return 0;

  // Normalize userId to a string (remove surrounding quotes if they exist)
  const normalizedUserId = userId.replace(/^"(.*)"$/, "$1");

  // Get the current date (set time to current for comparison)
  const currentDate = await fetchCurrentDate();
  // console.log("currentDate:", currentDate);

  // Filter user bookings by userId and check if the date is in the future or currently ongoing
  const userFutureBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);

    // Assuming booking has `startTime` and `endTime` as properties (in 'HH:mm' format)
    const bookingStartTime = booking.timeSlot.startTime;
    const bookingEndTime = booking.timeSlot.endTime;

    // Combine bookingDate with startTime and endTime to create full Date objects
    const startDateTime = new Date(bookingDate);
    const endDateTime = new Date(bookingDate);

    // Add time part to bookingDate (assuming startTime/endTime are in 'HH:mm' format)
    const [startHours, startMinutes] = bookingStartTime.split(":").map(Number);
    const [endHours, endMinutes] = bookingEndTime.split(":").map(Number);

    startDateTime.setHours(startHours, startMinutes, 0, 0); // Add start time to bookingDate
    endDateTime.setHours(endHours, endMinutes, 0, 0); // Add end time to bookingDate

    // Normalize booking.userId._id to string
    const normalizedBookingUserId = String(booking.userId._id || booking.userId.id);
    const isUserMatch = normalizedBookingUserId === normalizedUserId;

    // Check if the booking is in the future
    const isFutureBooking = startDateTime > currentDate;

    // Check if the booking is ongoing (current date falls between start and end time)
    const isOngoingBooking = startDateTime <= currentDate && endDateTime > currentDate;

    // Log for debugging
    // // console.log({
    //   bookingDate,
    //   startDateTime,
    //   endDateTime,
    //   isUserMatch,
    //   isFutureBooking,
    //   isOngoingBooking
    // });

    // Return true if both user matches and the booking is either in the future or ongoing
    return isUserMatch && (isFutureBooking || isOngoingBooking);
  });

  console.log("userFutureBookings:", userFutureBookings);

  return userFutureBookings; // Return the count of future bookings
};
