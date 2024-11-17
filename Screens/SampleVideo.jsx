import React, { useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const SampleVideo = () => {
  const video = useRef(null);

  return (
    <View style={styles.container}>
      <Text style={styles.textShow}>How to use</Text>
      <Video
        ref={video}
        style={styles.video}
        source={require('../assets/workingVideo.mp4')}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
      />
    </View>
  );
};

export default SampleVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 250,
  },
  textShow: {
    fontSize: 20,
    color: '#1E90FF',
  },
  video: {
    alignSelf: 'center',
    width: 280,
    height: 220,
  },
});



// import { useEvent } from 'expo';
// import { useVideoPlayer, VideoView } from 'expo-video';
// import { StyleSheet, View, Button } from 'react-native';

// const videoSource =
//   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

// const SampleVideo = () => {
//   const player = useVideoPlayer(videoSource, player => {
//     player.loop = true;
//     player.play();
//   });

//   const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

//   return (
//     <View style={styles.contentContainer}>
//       <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
//       <View style={styles.controlsContainer}>
//         <Button
//           title={isPlaying ? 'Pause' : 'Play'}
//           onPress={() => {
//             if (isPlaying) {
//               player.pause();
//             } else {
//               player.play();
//             }
//           }}
//         />
//       </View>
//     </View>
//   );
// }

// export default SampleVideo
// const styles = StyleSheet.create({
//   contentContainer: {
//     flex: 1,
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 50,
//   },
//   video: {
//     width: 350,
//     height: 275,
//   },
//   controlsContainer: {
//     padding: 10,
//   },
// });

