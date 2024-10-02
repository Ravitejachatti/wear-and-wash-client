import React from 'react'
import { View,Text} from 'react-native'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import HomeComp from '../Components/HomeComp/HomeComp';
import {getAllAsyncStorageData} from "../Storage/getAllAsyncStorageData"
const Home = () => {
  getAllAsyncStorageData();
  return (
    <View>
       <HomeComp/>
      
    </View>
  )
}

export default Home 