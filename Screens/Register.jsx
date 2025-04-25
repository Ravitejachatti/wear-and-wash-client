import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from "axios";

import { getBasedOnLocation } from '../Redux/App/action';
import { postRegister } from '../Redux/Auth/action';
import { AuthContext } from '../Components/Config/AuthContext';
import { theme } from '../theme';
import {Api} from '../Api/Api'


const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password too short').required('Password is required'),
  gender: Yup.string().required('Gender is required'),
  location: Yup.string().required('Location is required'),
  otp: Yup.string().min(6, 'OTP must be 6 digits').when('otpSent', {
    is: true,
    then: Yup.string().required('OTP is required'),
  }),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { login, isAuthenticated } = useContext(AuthContext);

  const centers = useSelector((state) => state.app.centers);

  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(getBasedOnLocation());
  }, [dispatch]);

  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    let timer;
    if (otpSent && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) setCanResend(true);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, resendTimer]);

  // Handle auto-verification login from Firebase
useEffect(() => {
  const unsubscribe = auth().onAuthStateChanged(async (user) => {
    if (user && otpSent && userData) {
      console.log('Auto-login detected via Firebase:', user.phoneNumber);
      try {
        const res = await dispatch(postRegister(userData));
        const userPayload = res.payload.user || res.payload;

        if (res?.payload?.message === 'Registration successful') {
          login(userPayload);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Main', params: { screen: 'Location' } }],
            })
          );
        } else {
          setErrorMessage('Registration failed after auto-verification.');
        }
      } catch (err) {
        console.error('Auto-verification registration error:', err);
        setErrorMessage('Something went wrong during automatic registration.');
      }
    }
  });

  return () => unsubscribe();
}, [otpSent, userData]);

  const centerOptions = centers.map((center) => ({
    label: center.name,
    value: center.id || center.name,
  }));

  const handleSendOTP = async (values) => {
    try {
      const res =  await axios.post(`${Api}/api/user/check-phone`, { phone: values.phone });

      if (res.data.exists) {
        setErrorMessage('Phone number is already registered.');
        setIsLoading(false);
        return;
      }
      const confirmation = await auth().signInWithPhoneNumber(values.phone);
      setVerificationId(confirmation.verificationId);
      setOtpSent(true);
      setUserData(values);
      setErrorMessage('');
    } catch (error) {
      console.error('OTP Send Error:', error);
      setErrorMessage('Failed to send OTP. Please check your phone number.');
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async () => {
    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
      await auth().signInWithCredential(credential);

      console.log("otp verified")

      const res = await dispatch(postRegister(userData));
      const userPayload = res.payload.user || res.payload;
      console.log("userPayload", userPayload)

      if (res?.payload?.message === 'Registration successful') {
      login(userPayload);
      // navigation.replace('Main', { screen: 'Location' });
      console.log("isAuthenticated", isAuthenticated);
        
      } else {
        setErrorMessage('Invalid OTP');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      
      setErrorMessage('OTP verification failed. Please try again.');
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(userData.phone);
      setVerificationId(confirmation.verificationId);
      setResendTimer(60);
      setCanResend(false);
      setErrorMessage('New OTP sent successfully!');
    } catch (error) {
      console.error('Resend OTP Error:', error);
      setErrorMessage('Failed to resend OTP. Please try again.');
    }
    setIsLoading(false);
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    if (!otpSent) {
      await handleSendOTP(values);
    } else {
      await handleVerifyOTP();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Formik
        initialValues={{ name: '', email: '', phone: '', password: '', gender: '', location: '', otp: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue }) => (
          <View style={styles.inputContainer}>
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

            {!otpSent ? (
              <>
                <FormInput icon="user" placeholder="Name" value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')} />
                {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                <FormInput icon="envelope" placeholder="Email" keyboardType="email-address" value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')} />
                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                <FormInput icon="phone" placeholder=" Phone" keyboardType="phone-pad"
                  value={values.phone}
                  onChangeText={(text) => {
                    const formatted = text.startsWith('+') ? text : '+91' + text.replace(/\D/g, '');
                    handleChange('phone')(formatted);
                  }}
                  onBlur={handleBlur('phone')}
                />
                {touched.phone && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                <View style={styles.inputWrapper}>
                  <FeatherIcon name="lock" size={20} color="gray" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <FeatherIcon name={showPassword ? 'eye' : 'eye-off'} size={20} color="gray" />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                <View style={styles.pickerWrapper}>
                  <RNPickerSelect
                    onValueChange={(value) => setFieldValue('gender', value)}
                    placeholder={{ label: 'Select Gender', value: null }}
                    value={values.gender}
                    items={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }]}
                    style={pickerSelectStyles}
                  />
                </View>
                {touched.gender && errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

                <View style={styles.pickerWrapper}>
                  <RNPickerSelect
                    onValueChange={(value) => setFieldValue('location', value)}
                    placeholder={{ label: 'Select Location', value: null }}
                    value={values.location}
                    items={centerOptions}
                    style={pickerSelectStyles}
                  />
                </View>
                {touched.location && errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
              </>
            ) : (
              <>
                <FormInput icon="lock" placeholder="Enter OTP" keyboardType="numeric" value={otp} onChangeText={setOtp} />
                <TouchableOpacity
                  disabled={!canResend}
                  onPress={handleResendOTP}
                  style={[styles.resendBtn, { backgroundColor: canResend ? '#1e90ff' : 'gray', opacity: canResend ? 1 : 0.5 }]}
                >
                  <Text style={styles.btnText}>{canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
              {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.btnText}>{otpSent ? 'Verify OTP' : 'Register'}</Text>}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const FormInput = ({ icon, ...props }) => (
  <View style={styles.inputWrapper}>
    <Icon name={icon} size={20} color="gray" style={styles.icon} />
    <TextInput style={styles.input} {...props} />
  </View>
);

const styles = StyleSheet.create({
  scrollView: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  inputContainer: { flex: 1, justifyContent: 'center' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc', marginVertical: 10 },
  icon: { marginRight: 10 },
  input: { flex: 1, padding: 10, fontSize: 16 },
  eyeIcon: { padding: 5 },
  pickerWrapper: { marginVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  btn: { backgroundColor: '#1e90ff', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontSize: 16 },
  errorText: { color: 'red', fontSize: 12 },
  errorMessage: { color: 'red', textAlign: 'center', marginBottom: 10 },
  resendBtn: { marginTop: 10, marginBottom: 20, padding: 10, borderRadius: 5, alignItems: 'center' },
});

const pickerSelectStyles = {
  inputIOS: { fontSize: 16, paddingVertical: 10, paddingHorizontal: 10, borderWidth: 1, borderColor: 'gray', borderRadius: 4, color: 'black' },
  inputAndroid: { fontSize: 16, paddingVertical: 10, paddingHorizontal: 10, borderWidth: 1, borderColor: 'gray', borderRadius: 4, color: 'black' },
};

export default Register;