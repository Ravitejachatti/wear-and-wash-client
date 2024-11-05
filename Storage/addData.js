import AsyncStorage from "@react-native-async-storage/async-storage";

export const addData = async (key, value) => {
  try {
    if (!key || value === undefined) {
      // console.log("Invalid key or value:", key, value);
      return;
    }
    const jsonValue = JSON.stringify(value);

    await AsyncStorage.setItem(key, jsonValue);
    // // console.log(`Data stored under key "${key}":`, jsonValue);
  } catch (e) {
    console.error("Error saving data to AsyncStorage:", e);
  }
};
