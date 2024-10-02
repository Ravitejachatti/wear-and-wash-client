import React, { useState, useRef }  from 'react'
import { View, StyleSheet, Button,Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const Testing = () => {
    const video = useRef(null);
    const [status, setStatus] = useState({});
  return (
    <View style={styles.container}>
        <Text style={styles.textShow}>How to use</Text>
    <Video
      ref={video}
      style={styles.video}
      source={{
        uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
      }}
      useNativeControls
      resizeMode={ResizeMode.CONTAIN}
      
      
    />
   
  </View>
  )
}

export default Testing

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    
    height: 250,
  },
  textShow:{
    fontSize: 20,
    color: '#1E90FF',

  },
  video: {
    alignSelf: 'center',
    width: 280,
    height: 220,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


// import { WebView } from 'react-native-webview';
// import Constants from 'expo-constants';
// import { StyleSheet } from 'react-native';

// export default function App() {
//   return (
//     <WebView
//       style={styles.container}
//       source={{ uri: 'https://expo.dev' }}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: Constants.statusBarHeight,
//   },
// });


