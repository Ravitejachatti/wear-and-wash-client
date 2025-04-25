import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Api } from '../Api/Api';


const ContactUs = () => {
  const route = useRoute();
  const filteredBookings = route.params?.filteredBookings || [];
  const machineId = filteredBookings.length > 0 ? filteredBookings[0].machineId._id : null;


  const phoneNumber = '+919030856384'; // Full phone number with country code
  const whatsappNumber = '919030856384'; // WhatsApp number with country code

  const handleWhatsApp = () => {
      const url = `whatsapp://send?text=Hello!&phone=${whatsappNumber}`;
      Linking.openURL(url).catch(err => {
          Alert.alert('Error', 'Make sure you have WhatsApp installed on your device.');
      });
  };
    const handlePhoneCall = () => {
        const url = `tel:${phoneNumber}`;
        Linking.openURL(url).catch(err => {
            Alert.alert('Error', 'Unable to make a phone call.');
        });
    };

    const handlePreviousCall = async () => {
        if (!machineId) {
            Alert.alert('Error', 'No machine ID found.');
            return;
        }
    
        try {
            const response = await fetch(`${Api}/api/bookings/getdetails/lastused/${machineId}`);
            const data = await response.json();
    
            if (response.ok && data.phone) {
                const phoneNumber = data.phone;
                const url = `tel:${phoneNumber}`;
                Linking.openURL(url).catch(err => {
                    Alert.alert('Error', 'Unable to make a phone call.');
                });
            } else {
                Alert.alert('Error', 'No previous user found for this machine.');
            }
        } catch (error) {
            console.error("Error fetching last used person's phone:", error);
            Alert.alert('Error', 'Could not retrieve previous user.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Contact Us</Text>
            
            <Text style={styles.questionText}>1. How can I book a slot?</Text>
            <Text style={styles.answerText}>You can book a slot by selecting the date and time from the booking page.</Text>

            <Text style={styles.questionText}>2. What are the payment options available?</Text>
            <Text style={styles.answerText}>We accept various payment methods including credit/debit cards and UPI.</Text>

            <Text style={styles.questionText}>3. Can I change or cancel my booking?</Text>
            <Text style={styles.answerText}>No, you can't change or cancel your bookings</Text>

            <Text style={styles.questionText}>4. How can I contact customer support?</Text>
            <Text style={styles.answerText}>You can reach us through WhatsApp or by calling the number below.</Text>

            <TouchableOpacity style={styles.buttonWhatsup} onPress={handleWhatsApp}>
                <Text style={styles.buttonText}>Contact via WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handlePhoneCall}>
                <Text style={styles.buttonText}>Call Us</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.buttonPrevious, filteredBookings.length === 0 && styles.disabledButton]}
                onPress={handlePreviousCall}
                disabled={filteredBookings.length === 0}
            >
                <Text style={styles.buttonText}>Call Previous</Text>    
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10,
    },
    answerText: {
        fontSize: 16,
        marginBottom: 20,
        color: '#555',
    },
    buttonWhatsup: {
        backgroundColor: '#25D366', // iOS default blue color
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    button: {
      backgroundColor: '#1E90FF', // iOS default blue color
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 10,
  },
  buttonPrevious: {
    backgroundColor: '#FFA500', // iOS default blue color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
},
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: 'gray',  // Disabled color
        opacity: 0.6,             // Reduced opacity
    },
});

export default ContactUs;
