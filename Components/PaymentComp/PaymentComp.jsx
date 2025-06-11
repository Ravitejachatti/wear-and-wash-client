import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert  } from 'react-native';
import { useDispatch } from 'react-redux';
import { bookingSlot, getBasedOnLocation, getUserBookingSlot } from '../../Redux/App/action';
import { useNavigation } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import axios from "axios";
import { getData } from '../../Storage/getData';
import { Api } from "../../Api/Api";
import {POST_BOOK_SLOT_FAILURE, POST_BOOK_SLOT_REQUEST, POST_BOOK_SLOT_SUCCESS} from "../../Redux/App/actionTypes"
import FullScreenLoader from '../../utils/fullscreenLoading';

const PaymentComp = ({ paymentData, onVisibilityChange, setBusy }) => {
  const { date, timeSlot, machineName, userId, centerId, machineId } = paymentData;
  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [amount1, setAmount1] = useState(75);
  const [amount2, setAmount2] = useState(120);

  useEffect(() => {
    const fetchCenterName = async () => {
      try {
        const centerName = await getData('userLocation');
        if (centerName) {
          fetchAmounts(centerName);
        }
      } catch (error) {
        console.error("Error fetching center name:", error);
        setError("Failed to fetch center data.");
      }
    };
    fetchCenterName();
  }, []);

  const fetchAmounts = async (centerName) => {
    try {
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
    setIsLoading(true);
    try {
      const username = JSON.parse(await getData('name'));
      const email = JSON.parse(await getData('email'));
      const phone = JSON.parse(await getData('phone'));

      const { data } = await axios.post(`${Api}/payment/createOrder`, {
        amount,
        userId,
        centerId,
        machineId,
        date,
        timeSlot,
      });

      const options = {
        description: "Slot Booking Payment",
        image: "https://your-logo-url.com/logo.png",
        currency: "INR",
        // key: "rzp_live_YrCTwtuhYHlVgm",
        key: "rzp_test_Zl7MbXdxwUGMIF",
        amount: amount * 100,
        name: "WearnWash",
        order_id: data.order.id,
        prefill: {
          email: email,
          contact: phone,
          name: username,
        },
        theme: { color: "#3399cc" },
      };

      const payment = await RazorpayCheckout.open(options);
     
          // setShowFullScreenLoader(true); // Show loader after payment
      await handleSubmit(amount, payment);
    } catch (error) {
      alert("Payment Failed. Please try again.");
      setBusy(false); 
      handleClose(); // Close the payment modal
    } finally {
      setIsLoading(false);
    }
  };

 const handleSubmit = async (amountPaid, payment) => {
  setIsLoading(true); // Start showing loader
  try {
    const paymentId = payment.razorpay_payment_id;
    const payload = { userId, centerId, machineId, timeSlot, date, amountPaid, paymentId };
    const action = await dispatch(bookingSlot(payload));
    dispatch(getBasedOnLocation());
    dispatch(getUserBookingSlot(userId));

    if (action.type === POST_BOOK_SLOT_SUCCESS) {
      Alert.alert(
        "✅ Booking Successful!",
        "Start washing within 10 minutes of your booking start time"
      );
      handleClose(); // ✅ Now close after success
      navigation.replace('Main', { screen: 'Home' });
    } else {
      const message =
        action.payload?.message ||
        action.error?.message ||
        'Unknown error, please try again.';
      Alert.alert("❌ Booking Failed", message);
      handleClose(); // ✅ Also close after failure
    }
  } catch (err) {
    console.error('Unexpected error in handleSubmit:', err);
    Alert.alert('Booking Failed', err.message || 'Something went wrong.');
    handleClose();
  } finally {
    setIsLoading(false); // Stop showing loader
    // setShowFullScreenLoader(false); // Hide loader after booking
  }
};

  const handleClose = () => {
    if (onVisibilityChange) {
      onVisibilityChange(false);
    }
    setBusy(false); // Reset busy state
  };

  return (
    <View style={styles.wrapper}>
      {showFullScreenLoader && <FullScreenLoader />}
      <Text style={styles.mainHeading}>Booking Data</Text>
      <View style={styles.container}>
        {date && <Text style={styles.text}>Date: {date}</Text>}
        {timeSlot && <Text style={styles.text}>Time Slot: {timeSlot}</Text>}
        {machineName && <Text style={styles.text}>Machine: {machineName}</Text>}

        {isLoading && <ActivityIndicator size="large" color="#007bff" />}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.paymentOptions}>
          <TouchableOpacity onPress={() => handlePayment(amount1)} style={styles.priceBtn}>
            <View style={styles.btnContent}>
              <Image source={require('../../assets/small_jar.png')} style={styles.icon} />
              <Text style={styles.btnText}>60ml</Text>
            </View>
            <View style={styles.payBtnContent}>
              <Text style={styles.payText}>Pay ₹{amount1}</Text>
            </View>
            
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handlePayment(amount2)} style={styles.priceBtn}>
            <View style={styles.btnContent}>
              <Image source={require('../../assets/big_jar.png')} style={styles.icon} />
              <Text style={styles.btnText}>120ml</Text>
            </View>
            <View style={styles.payBtnContent}>
              <Text style={styles.payText}>Pay ₹{amount2}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Close and note text */}

        <View>
          <Text style={styles.Notetext}>Note: Payment is for the Detergent Only</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  paymentOptions: {
    flexDirection: 'column',
    gap: 10,
    marginVertical: 20,
  },
  priceBtn: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  payText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  icon: {
    width: 40,
    height: 40,
  },
  payBtnContent: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  Notetext: {
    color: 'red',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentComp;