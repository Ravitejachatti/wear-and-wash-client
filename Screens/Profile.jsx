import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getData } from '../Storage/getData';

const UserProfile = () => {
   const [name, setName] = useState(null);
   const [email,setEmail] = useState(null);
   const [number,setNumber] = useState(null);
   const [location,setLocation] = useState(null);
   useEffect(()=>{
     const userProfile =async()=>{
        
        const  name  = await getData("name")
        const  email  = await getData("email")
        const  number  = await getData("phone")
        const  location  = await getData("userLocation")
        if(name && email && number && location){
          setName(JSON.parse(name));
          setEmail(JSON.parse(email));
          setLocation(JSON.parse(location));
          setNumber(JSON.parse(number));
        }

        console.log(email, number, location,name)
     }

     userProfile()
   },[])
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.profileImage}
          source={{
            uri: 'https://your-image-url-here.jpg',
          }}
        />
      </View>


      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <FontAwesome name="user" size={20} color="#4CAF50" />
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{name}</Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome name="phone" size={20} color="#2196F3" />
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{number}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="envelope" size={20} color="#FFC107" />
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="map-marker" size={20} color="#FF5722" />
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{location}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E3F2FD', 
    justifyContent:"center",
    alignContent:"center"
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20, 
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2196F3', 
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16, 
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1, 
  },
  value: {
    fontSize: 16,
    color: '#555',
    flex: 2,
  },
});

export default UserProfile;
