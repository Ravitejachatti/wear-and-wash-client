import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./Screens/Home";
import Splash from "./Screens/Splash";
import Register from "./Screens/Register";
import Login from "./Screens/Login";
import Settings from "./Screens/Settings";
import Profile from "./Screens/Profile";
import { Provider } from "react-redux";
import { Store } from "./Redux/Store";
import Location from "./Screens/Location";
import Payment from "./Screens/Payment";
import { useEffect, useState } from "react";
import { getData } from "./Storage/getData"; 

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MainStack() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          height: 80,
        },
        headerTitle: "",
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Location" component={Location} />
      <Drawer.Screen name="Payment" component={Payment} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getData("token"); 
      setIsAuthenticated(!!token); 
      setIsLoading(false); 
    };

    checkAuth(); 
  }, []);

  if (isLoading) {
    
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Group>
            {!isAuthenticated ? (
              <>
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="Splash"
                  component={Splash}
                />
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="Register"
                  component={Register}
                />
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="Login"
                  component={Login}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="Main"
                  component={MainStack}
                />
              </>
            )}
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
