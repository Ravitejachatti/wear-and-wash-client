import AsyncStorage from '@react-native-async-storage/async-storage';
export const getAllAsyncStorageData = async () => {
    try {
      // Get all keys from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
  
      // If you want to check the keys
      // console.log('All keys:', keys);
  
      // Retrieve values for all keys
      const items = await AsyncStorage.multiGet(keys);
  
      // Transform the array of key-value pairs into an object for easier access
      const data = items.reduce((acc, [key, value]) => {
        acc[key] = value ? JSON.parse(value) : null; // Parse JSON if needed
        return acc;
      }, {});
  
      // console.log('All AsyncStorage data:', data);
      return data;
    } catch (error) {
      console.error('Error retrieving AsyncStorage data:', error);
      return null;
    }
  };
  