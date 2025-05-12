import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../Components/Config/AuthContext';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { postLogin } from '../Redux/Auth/action';
import axios from "axios";
import {Api} from '../Api/Api'
const Login = () => {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { login, isAuthenticated } = useContext(AuthContext);

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      const res =  await axios.post(`${Api}/api/user/check-phone`, { phone:phone });

      if (!res.data.exists) {
        setErrorMessage('Phone number is not registered.');
        setLoading(false);
        return;
      }
      const confirmation = await auth().signInWithPhoneNumber(phone);
      setVerificationId(confirmation.verificationId);
      setOtpSent(true);
      setErrorMessage('');
      setResendTimer(60);
      setCanResend(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error)
      setErrorMessage('Failed to send OTP. Please try again.',error);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      setLoading(true);
      const confirmation = await auth().signInWithPhoneNumber(phone);
      setVerificationId(confirmation.verificationId);
      setErrorMessage('OTP resent successfully.');
      setResendTimer(60);
      setCanResend(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage('Failed to resend OTP.');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      const credential = auth.PhoneAuthProvider.credential(verificationId, otp);

      await auth().signInWithCredential(credential);

      console.log('otp verified')

      const response = await dispatch(postLogin({ phone }));
      if (response?.payload?.message == "Login successful") {
        login(response.payload.user);
        console.log(isAuthenticated, "isAuthenticated")
      } else {
        setErrorMessage("User not registered or backend error.");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErrorMessage('OTP verification failed.');
    }
  };

  useEffect(() => {
    let timer;

    if (otpSent && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [otpSent, resendTimer]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user && otpSent) {
        console.log('Auto-login detected via Firebase:', user.phoneNumber);
        try {
          const response = await dispatch(postLogin({ phone: user.phoneNumber }));
          if (response?.payload?.message === 'Login successful') {
            console.log(response.payload.user)
            login(response.payload.user);
            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: 'Main', params: { screen: 'Location' } }],
            // });
          } else {
            setErrorMessage("User not registered or backend error.");
          }
        } catch (err) {
          console.error('Auto-verification login error:', err);
          setErrorMessage('Something went wrong during automatic login.');
        }
      }
    });
  
    return () => unsubscribe();
  }, [otpSent]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Phone</Text>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {!otpSent ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              const formatted = text.startsWith('+') ? text : '+91' + text.replace(/\D/g, '');
              setPhone(formatted);
            }}
          />
          <TouchableOpacity onPress={handleSendOTP} style={styles.button}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity onPress={handleVerifyOTP} style={styles.button}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify & Login</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleResendOTP}
            disabled={!canResend}
            style={[styles.resendBtn, !canResend && styles.resendDisabled]}
          >
            <Text style={styles.resendText}>
              {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? <Text style={{ color: 'blue' }}>Register</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  resendBtn: {
    marginTop: 15,
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  resendText: {
    color: '#1e90ff',
    fontSize: 15,
  },
  resendDisabled: {
    opacity: 0.5,
  },
});