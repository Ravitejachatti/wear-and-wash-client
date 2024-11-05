import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getData } from '../Storage/getData';

const UserProfile = () => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [number, setNumber] = useState(null);
  const [location, setLocation] = useState(null);
  const [gender, setGender] = useState(null);
  const [avatarSource, setAvatarSource] = useState(null);

  useEffect(() => {
    const userProfile = async () => {
      const name = await getData('name');
      const email = await getData('email');
      const number = await getData('phone');
      const location = await getData('userLocation');
      const gender = await getData('gender');

      if (name && email && number && location) {
        setName(JSON.parse(name));
        setEmail(JSON.parse(email));
        setLocation(JSON.parse(location));
        setNumber(JSON.parse(number));
        setGender(JSON.parse(gender));

        // Set avatar source based on gender
        if (JSON.parse(gender) === 'Male') {
          setAvatarSource(require('../assets/male_icon.png'));
        } else if (JSON.parse(gender) === 'Female') {
          setAvatarSource(require('../assets/female_icon.jpg'));
        } else {
          setAvatarSource(require('../assets/male_icon.png'));
        }
      }
    };

    userProfile();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {avatarSource && (
          <Image style={styles.profileImage} source={avatarSource} />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.headerText}>User Profile</Text>
        <View style={styles.infoRow}>
          <FontAwesome name="user" size={24} color="#00796B" />
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{name}</Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome name="phone" size={24} color="#0288D1" />
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{number}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="envelope" size={24} color="#FFA000" />
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="map-marker" size={24} color="#D32F2F" />
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
    padding: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#0288D1',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginHorizontal: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#777',
    flex: 2,
  },
});

export default UserProfile;
