import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';

const ContactUs = () => {
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
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ContactUs;
