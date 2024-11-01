// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { Provider } from 'react-redux';
// import { Store } from './Redux/Store';
// import Splash from './Screens/Splash';
// import Login from './Screens/Login';
// import Register from './Screens/Register';
// import Home from './Screens/Home';
// import Profile from './Screens/Profile';
// import Location from './Screens/Location';
// import ContactUs from './Screens/ContactUs';
// import History from './Screens/History';
// import Payment from './Screens/Payment';
// import { getData } from './Storage/getData';
// import { removeItem } from './Storage/removeItem';
// import Testing from './Screens/Testing';
// import ForgetPasswordScreen from './Screens/ForgetPasswordScreen';
// import ResetPassword from './Screens/ResetPassword';

// const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator(); 

// function MainStack() {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       screenOptions={{
//         headerShown: true,
//       }}
//     >
//       <Drawer.Screen name="Home" component={Home} />
//       <Drawer.Screen name="Profile" component={Profile} />
//       <Drawer.Screen name="History" component={History} />
//       <Drawer.Screen name="Location" component={Location} />
//       <Drawer.Screen name="ContactUs" component={ContactUs} />
//       {/* <Drawer.Screen name="Testing" component={Testing} /> */}
//       <Drawer.Screen name="Logout">
//         {({ navigation }) => {
//           useEffect(() => {
//             const logout = async () => {
//               await removeItem('token');
//               navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'Login' }],
//               });
//             };
//             logout();
//           }, [navigation]);

//           return null; // No UI component for Logout
//         }}</Drawer.Screen>
//     </Drawer.Navigator>
//   );
// }

// function AuthStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Login" component={Login} />
//       <Stack.Screen name="Register" component={Register} />
//       <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
//       <Stack.Screen name="ResetPassword" component={ResetPassword} />
//     </Stack.Navigator>
//   );
// }

// export default function App() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = await getData('token');
//       setIsAuthenticated(!!token);
//       setIsLoading(false);
//     };

//     checkAuth();
//   }, []);

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <Provider store={Store}>
//       <NavigationContainer>
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//           {/* <Stack.Screen name="Splash" component={Splash} /> */}
//           {isAuthenticated ? (
//             <Stack.Screen name="Main" component={MainStack} />
//           ) : (
//             <Stack.Screen name="Auth" component={AuthStack} />
//           )}
//         </Stack.Navigator>
//       </NavigationContainer>
//     </Provider>
//   );
// }


// Testing Code 

import React, { useContext, useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider } from 'react-redux';
import { Store } from './Redux/Store';
import { useDispatch } from 'react-redux';
import { getUserBookingSlot } from './Redux/App/action';
import { AuthProvider, AuthContext } from './Components/Config/AuthContext';
import LogoutComp from './Components/Config/LogoutComp'; // Ensure the path is correct
import { countUserFutureBookings } from './utils/bookingUtils';
import Splash from './Screens/Splash';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Home from './Screens/Home';
import Profile from './Screens/Profile';
import Location from './Screens/Location';
import ContactUs from './Screens/ContactUs';
import History from './Screens/History';
import Payment from './Screens/Payment';
import { getData } from './Storage/getData';
import { removeItem } from './Storage/removeItem';
import Testing from './Screens/Testing';
import ForgetPasswordScreen from './Screens/ForgetPasswordScreen';
import ResetPassword from './Screens/ResetPassword';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MainStack() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [initialRoute, setInitialRoute] = useState('Home'); // Default initial route

  useEffect(() => {
    const fetchBookingCount = async () => {
      try {
        const userIdFromStorage = await getData('userId');
        const userId = JSON.parse(userIdFromStorage);

        // Dispatch the action to fetch user booking slots
        const res = await dispatch(getUserBookingSlot(userId));
        const bookings = res.payload;

        // Count the user's future bookings
        const Bookings = await countUserFutureBookings(bookings, userId);

        // Log for debugging
        console.log("User ID:", userId);
        console.log("Bookings:", Bookings);
        console.log("Booking count:", Bookings.length);

        // Set the initial route based on the booking count
        setInitialRoute(Bookings.length > 0 ? 'Home' : 'Location');
      } catch (err) {
        console.log("Error fetching bookings:", err);
      } finally {
        // Set loading to false after data fetching is complete
        setIsLoading(false);
      }
    };

    fetchBookingCount();
  }, [dispatch]);

  // Show a loading indicator while fetching data
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName={initialRoute} // Set the initial route dynamically
      drawerContent={(props) => <LogoutComp {...props} />}
    >
      {/* Both screens are included in the drawer menu */}
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Location" component={Location} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="History" component={History} />
      <Drawer.Screen name="ContactUs" component={ContactUs} />
    </Drawer.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}


function MainApp() {
  const { isAuthenticated } = useContext(AuthContext);
  const {  isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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

export default function App() {
  return (
    <Provider store={Store}>
      <AuthProvider>
        <NavigationContainer>
          <MainApp />
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
} 
