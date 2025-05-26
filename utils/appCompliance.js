// src/utils/appCompliance.js
import { Platform, Alert, Linking } from "react-native";
import InAppUpdates, { IAUUpdateKind } from "sp-react-native-in-app-updates";
import VersionCheck from "react-native-version-check";
import DeviceInfo from "react-native-device-info";
import { checkDateTimeWithServer, handleAppStateChangeWithServerCheck } from "./timeChecking";

const inAppUpdates = new InAppUpdates();

export async function enforceAppCompliance(setTimeMismatch) {
  // 1️⃣ Server‐time drift enforcement
  checkDateTimeWithServer(setTimeMismatch);
  const cleanupTime = handleAppStateChangeWithServerCheck(setTimeMismatch);

  // 2️⃣ Android in-app update / Play Store redirect
  if (Platform.OS === "android") {
    try {
      // get local bundle version:
      const currentVersion = DeviceInfo.getVersion();

      // check if an in-place update is available:
      const needs = await inAppUpdates.checkNeedsUpdate({ curVersion: currentVersion });
      if (needs.shouldUpdate) {
        // try an in-app immediate update first:
        try {
          await inAppUpdates.startUpdate({ updateType: IAUUpdateKind.IMMEDIATE });
        } catch (err) {
          console.warn("in-app update failed, falling back to Play Store", err);

          // fallback: open Play Store page for your app
          const storeUrl = await VersionCheck.getStoreUrl({
            provider: "playStore",
            appID: DeviceInfo.getBundleId(),
          });
          Alert.alert(
            "Update Available",
            "A newer version is available. Please update the app to continue.",
            [
              
              { text: "Update", onPress: () => Linking.openURL(storeUrl) },
            ],
            { cancelable: false }
          );
        }
      }
    } catch (err) {
      console.warn("version-check failed:", err);
    }
  }

  // return cleanup function for the time watcher
  return cleanupTime;
}
