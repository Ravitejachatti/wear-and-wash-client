// // utils/timeUtils.js
// import { Alert, BackHandler, AppState } from 'react-native';
// import { fetchCurrentDate } from './getCurrentTime';

// // Function to check if device and server times match
// export const areDateAndTimeEqual = (deviceTime, serverTime) => {
//   return (
//     deviceTime.getFullYear() === serverTime.getFullYear() &&
//     deviceTime.getMonth() === serverTime.getMonth() &&
//     deviceTime.getDate() === serverTime.getDate() &&
//     deviceTime.getHours() === serverTime.getHours() &&
//     deviceTime.getMinutes() === serverTime.getMinutes()
//   );
// };

// // Function to fetch server time and compare it with device time
// export const checkDateTimeWithServer = async () => {
//   const serverTime = await fetchCurrentDate();
//   if (!serverTime) return;

//   const deviceTime = new Date();

//   if (!areDateAndTimeEqual(deviceTime, serverTime)) {
//     Alert.alert(
//       'Time Mismatch',
//       'Your device date and time settings do not match the server. Please set your Date & Time to IST.',
//       [{ text: 'OK', onPress: exitApp }]
//     );
//   }
// };

// // Exit app function
// export const exitApp = () => {
//   BackHandler.exitApp();
// };

// // Function to listen for app state changes and check timing when app is active
// export const handleAppStateChangeWithServerCheck = () => {
//   const handleAppStateChange = (nextAppState) => {
//     if (nextAppState === 'active') {
//       checkDateTimeWithServer();
//     }
//   };

//   const subscription = AppState.addEventListener('change', handleAppStateChange);

//   // Return cleanup function to remove listener when done
//   return () => {
//     subscription.remove();
//   };
// };


// utils/timeUtils.js
import { Alert, AppState, BackHandler, Platform } from 'react-native';
import { fetchCurrentDate } from './getCurrentTime';

export const areDateAndTimeEqual = (deviceTime, serverTime) => {
  return (
    deviceTime.getFullYear() === serverTime.getFullYear() &&
    deviceTime.getMonth() === serverTime.getMonth() &&
    deviceTime.getDate() === serverTime.getDate() &&
    deviceTime.getHours() === serverTime.getHours() &&
    deviceTime.getMinutes() === serverTime.getMinutes()
  );
};

export const checkDateTimeWithServer = async (setTimeMismatch) => {
  const serverTime = await fetchCurrentDate();
  if (!serverTime) return;

  const deviceTime = new Date();
  const isTimeMatched = areDateAndTimeEqual(deviceTime, serverTime);

  if (!isTimeMatched) {
    if (Platform.OS === 'android') {
      Alert.alert(
        'Time Mismatch',
        'Your device date and time settings do not match the server. Please set your Date & Time to IST.',
        [{ text: 'OK', onPress: exitApp }]
      );
    } else {
      setTimeMismatch(true); // Show lock screen on iOS instead of trying to exit
    }
  } else {
    setTimeMismatch(false); // Remove lock screen if time matches
  }
};

export const exitApp = () => {
  BackHandler.exitApp();
}

export const handleAppStateChangeWithServerCheck = (setTimeMismatch) => {
  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      checkDateTimeWithServer(setTimeMismatch);
    }
  };

  const subscription = AppState.addEventListener('change', handleAppStateChange);

  return () => {
    subscription.remove();
  };
};
