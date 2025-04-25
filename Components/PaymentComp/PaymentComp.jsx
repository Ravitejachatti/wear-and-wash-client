import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { bookingSlot, getBasedOnLocation, getUserBookingSlot } from '../../Redux/App/action';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import RazorpayCheckout from 'react-native-razorpay';
import axios from "axios";
import {getData} from '../../Storage/getData'
import { Api } from "../../Api/Api";

const PaymentComp = ({ paymentData, onVisibilityChange }) => {
  const { date, timeSlot, machineName, userId, centerId, machineId } = paymentData;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [amount1, setAmount1] = useState(null);
  const [amount2, setAmount2] = useState(null);

  // const handlePayment = async (amount) => {
  //   setSelectedAmount(amount);
  //   setIsLoading(true);

  //   const options = {
  //     description: 'Slot Booking Payment',
  //     image: 'https://your-logo-url.com/logo.png', // Replace with your logo
  //     currency: 'INR',
  //     key: 'rzp_test_oRzIqkugevfm47', // Replace with your Razorpay API Key
  //     amount: amount * 100, // Convert to paisa
  //     name: 'Your App Name',
  //     prefill: {
  //       email: 'user@example.com',
  //       contact: '9999999999',
  //       name: 'User Name',
  //     },
  //     theme: { color: theme.color.primary },
  //   };

  //   try {
  //     const payment = await RazorpayCheckout.open(options);
  //     console.log('Payment Success:', payment);
  //     handleSubmit();
  //   } catch (error) {
  //     console.log('Payment Failed:', error);
  //     alert('Payment Failed. Please try again.');
  //     setIsLoading(false);
  //   }
  // };

  
  useEffect(() => {
    // Fetch the center name from AsyncStorage
    const fetchCenterName = async () => {
      try {
        const centerName = await getData('userLocation');  // Assuming 'centerName' is stored in AsyncStorage
        if (centerName) {
          fetchAmounts(centerName); // Pass the center name to fetch the amounts
        }
      } catch (error) {
        console.error("Error fetching center name:", error);
        setError("Failed to fetch center data.");
      }
    };
  
    // Fetch amounts once the component mounts
    fetchCenterName();
  }, []); // Run once when the component mounts
  
  // Fetch amounts from the backend based on the center name
  const fetchAmounts = async (centerName) => {
    try {
      if (typeof centerName !== 'string') {
        throw new Error('Invalid center name');
      }
      console.log("centerName",centerName)
      const cleanedCenterName = centerName?.replaceAll('"', '').trim();
      const { data } = await axios.get(`${Api}/payment/getAmounts`, {
        params: { centerName: cleanedCenterName },
      });
  
      if (data) {
        setAmount1(data.amount1);   
        setAmount2(data.amount2); 
      }
    } catch (error) {
      console.error("Error fetching amounts: ", error);
      setError("Failed to load payment amounts.");
    }
  };

const handlePayment = async (amount) => { 
  setSelectedAmount(amount);
  setIsLoading(true);

  username = JSON.parse(await getData('name'))
  email = JSON.parse(await getData('email'))
  phone = JSON.parse(await getData('phone'))
  console.log("username",username)


  try {
    // 1. Get Order ID from the backend
    console.log("Api",Api)
    const { data } = await axios.post(`${Api}/payment/createOrder`, { amount }); 
    console.log("data",data.order.id)   
     
    const options = {
      description: "Slot Booking Payment",
      image: "assets/icon.png", // Replace with your logo
      currency: "INR",
      key: "rzp_live_YrCTwtuhYHlVgm", // Replace with your Razorpay API Key
      amount: amount * 100, // Convert to paisa
      name: "WearnWash",
      order_id: data.order.id, // Razorpay Order ID from the backend
      prefill: {
        email: email,
        contact: phone,
        name: username,
      },
      theme: { color: "#3399cc" }, 
    };

    // 2. Open Razorpay Checkout
    console.log(options)
    const payment = await RazorpayCheckout.open(options);
    console.log("Payment Success:", payment);

    // 3. Verify payment with backend
    const verifyRes = await axios.post(`${Api}/payment/verifyPayment`, payment);

    if (verifyRes.data.success) {
      // alert("Payment Verified Successfully!");
      handleSubmit(amount);
    } else {
      alert("Payment Verification Failed.");
      setIsLoading(false);
    }
  } catch (error) {
    console.log("Payment Failed:", error);
    alert("Payment Failed. Please try again.");
    setIsLoading(false);
  }
};
  const handleSubmit = async (amountPaid) => {
  

    setIsLoading(true);
    const payload = { userId, centerId, machineId, timeSlot, date, amountPaid, upiId };

    try {
      const response = await dispatch(bookingSlot(payload));
      console.log(response)
      dispatch(getBasedOnLocation());
      dispatch(getUserBookingSlot(userId));
      console.log("response",response.payload[0].status)
      if (response?.payload?.length > 0 && response.payload[0].status === 'confirmed') {
        console.log('Booking Success:', response.payload[0]);
        alert('Booking Successful!');
        navigation.replace('Main', { screen: 'Home' });
      } else {
        if (onVisibilityChange) {
          onVisibilityChange(false);
        }
      }
    } catch (error) {
      console.error('Error during booking:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onVisibilityChange) {
      onVisibilityChange(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.mainHeading}>Booking Data</Text>
      <View style={styles.container}>
        {date && <Text style={styles.heading}>Date: <Text style={styles.value}>{date}</Text></Text>}
        {timeSlot && <Text style={styles.heading}>Time Slot: <Text style={styles.value}>{timeSlot}</Text></Text>}
        {machineName && <Text style={styles.heading}>Machine: <Text style={styles.value}>{machineName}</Text></Text>}

        {/* <TextInput
          style={styles.input}
          placeholder="Enter your UPI ID"
          value={upiId}
          onChangeText={(text) => {
            setUpiId(text);
            setError('');
          }}
        /> */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.paymentOptions}>
        <TouchableOpacity onPress={() => handlePayment(amount1)} style={styles.priceBtn}>
          <View style={{ flexDirection: 'row'}}>
          <Image source={require('../../assets/detergent.png')} style={styles.icon} />
          <Text style={{color:"white", fontWeight:'bold'}}>Pay</Text>
          </View>

          <Text style={styles.btnText}>60ml - ₹{amount1}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePayment(amount2)} style={styles.priceBtn}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={require('../../assets/detergent.png')} style={styles.icon} />
          <Image source={require('../../assets/detergent.png')} style={[styles.icon, { marginLeft: -4 }]} />
          <Text style={{color:"white", fontWeight:'bold'}}>Pay</Text>
        </View>
          <Text style={styles.btnText}>120ml - ₹{amount2}</Text>
        </TouchableOpacity>
      </View>
      </View>
      <Text style={styles.noteText}>
      <Text style={styles.caution}>Caution:</Text> Payment is for liquid detergent.{'\n'}
      {/* <Text style={styles.note}>Note:</Text> Laundry Liquid is 20% more than regular ₹10 packets. */}
    </Text>
      <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
        <Text style={styles.closeBtnText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  }, 
  mainHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontWeight: '400',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: '100%',
    marginTop: 15,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 15,
  },
  priceBtn: {
    backgroundColor: theme.color.secondary, 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 14,
    color: 'grey',
    lineHeight: 20,
    marginTop: 10,
  },
  
  caution: {
    fontWeight: '',
    color: '#D32F2F', // Red for warning
  },
  
  note: {
    fontWeight: '',
    color: '#1976D2', // Blue for info
  },
  closeBtn: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 10,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 2,
  },
  
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  
  priceBtn: {
    backgroundColor: theme.color.secondary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    flex: 1,
    marginHorizontal: 6,
  },
});

export default PaymentComp;