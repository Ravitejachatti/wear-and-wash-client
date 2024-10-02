
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      } else {
      //  console.log("No value found for key:", key);
        return null;
      }
    } catch (e) {
     // console.log("Error retrieving data", e);
      throw e; 
    }
  };

 
  

  