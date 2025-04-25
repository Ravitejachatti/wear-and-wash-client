// import React, { useEffect, useState, useContext } from "react";
// import { ActivityIndicator, View } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import { Provider } from "react-redux";
// import { Store } from "./Redux/Store";
// import { useDispatch } from "react-redux";
// import { getUserBookingSlot } from "./Redux/App/action";
// import { AuthProvider, AuthContext } from "./Components/Config/AuthContext";
// import LogoutComp from "./Components/Config/LogoutComp"; // Ensure the path is correct
// import { countUserFutureBookings } from "./utils/bookingUtils";
// import Splash from "./Screens/Splash";
// import Login from "./Screens/Login";
// import Register from "./Screens/Register";
// import Home from "./Screens/Home";
// import Profile from "./Screens/Profile";
// import Location from "./Screens/Location";
// import ContactUs from "./Screens/ContactUs";
// import History from "./Screens/History";
// import Dashboard from "./Screens/Dashboard"; // Owner's Dashboard or Dashboard
// import ForgetPasswordScreen from "./Screens/ForgetPasswordScreen";
// import ResetPassword from "./Screens/ResetPassword";
// import { getData } from "./Storage/getData";
// import Testing from "./Screens/Testing";
// import { checkDateTimeWithServer, handleAppStateChangeWithServerCheck } from './utils/timeChecking';

// const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();

// function MainStack() {
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(true); // Loading state
//   const [initialRoute, setInitialRoute] = useState("Home"); // Default initial route
//   const [userRole, setUserRole] = useState(null); // State to store user role

//   useEffect(() => {
//     const fetchBookingCount = async () => {
//       try {
//         const userIdFromStorage = await getData("userId");
//         const userRoleFromStorage = await getData("userRole"); // Fetch user role from storage
//         const userId = JSON.parse(userIdFromStorage);
//         const role = JSON.parse(userRoleFromStorage); // Parse the user role
//         // console.log("userRole ", role);

//         setUserRole(role); // Set the user role in state

//         // Dispatch the action to fetch user booking slots
//         const res = await dispatch(getUserBookingSlot(userId));
//         const bookings = res.payload;

//         // Count the user's future bookings
//         const Bookings = await countUserFutureBookings(bookings, userId);

//         // Set the initial route based on the booking count
//         setInitialRoute(Bookings.length > 0 ? "Home" : "Location");
//       } catch (err) {
//         console.error("Error fetching bookings:", err);
//       } finally {
//         // Set loading to false after data fetching is complete
//         setIsLoading(false);
//       }
//     };

//     fetchBookingCount();
//   }, [dispatch]);

//   // Show a loading indicator while fetching data
//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <Drawer.Navigator
//       initialRouteName={userRole === "owner" ? "Dashboard" : initialRoute} // Navigate to Dashboard if user is owner
//       drawerContent={(props) => <LogoutComp {...props} />}
//     >
//       {userRole === "owner" ? (
//         <>
//           {/* Navigation items for owners only */}
//           <Drawer.Screen name="Dashboard" component={Dashboard} />
//           <Drawer.Screen name="Profile" component={Profile} />
//           <Drawer.Screen name="ContactUs" component={ContactUs} />
//         </>
//       ) : (
//         <>
//           {/* Navigation items for regular users */}
//           <Drawer.Screen name="Home" component={Home} />
//           <Drawer.Screen name="Location" component={Location} />
//           <Drawer.Screen name="Profile" component={Profile} />
//           <Drawer.Screen name="History" component={History} />
//           <Drawer.Screen name="ContactUs" component={ContactUs} />
//           {/* <Stack.Screen name="Testing" component={Testing}/> */}
//         </>
//       )}
//     </Drawer.Navigator>
//   );
// }

// function AuthStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Login" component={Login} />
//       <Stack.Screen name="Register" component={Register} />
//       <Stack.Screen
//         name="ForgetPasswordScreen"
//         component={ForgetPasswordScreen}
//       />
//       <Stack.Screen name="ResetPassword" component={ResetPassword} />
//     </Stack.Navigator>
//   );
// }

// function MainApp() {
//   const { isAuthenticated } = useContext(AuthContext);
//   const { isLoading } = useContext(AuthContext);
  

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>  
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (

//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {isAuthenticated ? (
//         <Stack.Screen name="Main" component={MainStack} />
//       ) : (
//         <Stack.Screen name="Auth" component={AuthStack} />
//         // <Stack.Screen name="Testing" component={Testing}/>
//       )}
//     </Stack.Navigator>
//   );
// }

// export default function App() {

//   useEffect(() => {
//     // Initial check when the app starts
//     checkDateTimeWithServer();

//     // Set up listener for app state changes
//     const cleanupAppStateListener = handleAppStateChangeWithServerCheck();

//     // Clean up the listener on unmount
//     return () => {
//       cleanupAppStateListener();
//     };
//   }, []);
//   return (
//     <Provider store={Store}>
//       <AuthProvider>
//         <NavigationContainer>
//           <MainApp />
//         </NavigationContainer>
//       </AuthProvider>
//     </Provider>
//   );
// }



import React, { useEffect, useState, useContext } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Provider } from "react-redux";
import { Store } from "./Redux/Store";
import { useDispatch } from "react-redux";
import { getUserBookingSlot } from "./Redux/App/action";
import { AuthProvider, AuthContext } from "./Components/Config/AuthContext";
import LogoutComp from "./Components/Config/LogoutComp";
import { countUserFutureBookings } from "./utils/bookingUtils";
import Splash from "./Screens/Splash";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import Home from "./Screens/Home";
import Profile from "./Screens/Profile";
import Location from "./Screens/Location";
import ContactUs from "./Screens/ContactUs";
import History from "./Screens/History";
import Dashboard from "./Screens/Dashboard";
import ForgetPasswordScreen from "./Screens/ForgetPasswordScreen";
import ResetPassword from "./Screens/ResetPassword";
import { getData } from "./Storage/getData";
import Testing from "./Screens/Testing";
import { checkDateTimeWithServer, handleAppStateChangeWithServerCheck } from './utils/timeChecking';

const Stack = createStackNavigator(); 
const Drawer = createDrawerNavigator();

function MainStack() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Home");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchBookingCount = async () => {
      try {
        const userIdFromStorage = await getData("userId");
        const userRoleFromStorage = await getData("userRole");
        const userId = JSON.parse(userIdFromStorage);
        const role = JSON.parse(userRoleFromStorage);

        setUserRole(role);
        console.log("userid",userIdFromStorage)

        const res = await dispatch(getUserBookingSlot(userId));
        const bookings = res.payload;
        // console.log("bookings",bookings)
        const Bookings = await countUserFutureBookings(bookings, userId);

        setInitialRoute(Bookings.length > 0 ? "Home" : "Location");
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingCount();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName={userRole === "owner" ? "Dashboard" : initialRoute}
      drawerContent={(props) => <LogoutComp {...props} />}
    >
      {userRole === "owner" ? (
        <>
          <Drawer.Screen name="Dashboard" component={Dashboard} />
          <Drawer.Screen name="Profile" component={Profile} />
          <Drawer.Screen name="ContactUs" component={ContactUs} />
        </>
      ) : (
        <>
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Location" component={Location} />
          <Drawer.Screen name="Profile" component={Profile} />
          <Drawer.Screen name="History" component={History} />
          <Drawer.Screen name="ContactUs" component={ContactUs} />
        </>
      )}
    </Drawer.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen
        name="ForgetPasswordScreen"
        component={ForgetPasswordScreen}
      />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}

function MainApp() {
  const { isAuthenticated } = useContext(AuthContext);
  const { isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

// LockScreen component for time mismatch overlay
function LockScreen() {
  return (
    <View style={styles.lockScreen}>
      <Text style={styles.lockText}>
        Please adjust your device's date and time to match the server's time (IST) to continue using the app.
      </Text>
    </View>
  );
}

export default function App() {
  const [timeMismatch, setTimeMismatch] = useState(false);

  useEffect(() => {
    checkDateTimeWithServer(setTimeMismatch);
    const cleanupAppStateListener = handleAppStateChangeWithServerCheck(setTimeMismatch);

    return () => {
      cleanupAppStateListener();
    };
  }, []);

  return (
    <Provider store={Store}>
      <AuthProvider>
        <NavigationContainer>
          {timeMismatch ? <LockScreen /> : <MainApp />}
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lockScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lockText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
