// Components/Config/LogoutComp.js (or DrawerContent.js)
import React, { useContext } from 'react';
import { TouchableOpacity, Text, Alert, View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { AuthContext } from './AuthContext'; // Ensure this path is correct

const LogoutComp = (props) => {
  const { logout } = useContext(AuthContext);

  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => logout(props.navigation) }
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      {/* Render the default drawer items */}
      <DrawerItemList {...props} itemStyle={styles.drawerItem} />

      {/* Custom Logout Button */}
      <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light gray background
    paddingTop: 60, // Space at the top
  },
  drawerItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 10,
  },
  logoutButton: {
    padding: 15,
    backgroundColor: '#ff4d4d', // Red background for the logout button
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LogoutComp;
