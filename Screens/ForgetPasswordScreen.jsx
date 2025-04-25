import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { postRequestOtp, postResetVerifyOtp } from '../Redux/Auth/action'; // Redux actions
import auth from "@react-native-firebase/auth";

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  otp: Yup.string().min(6, 'OTP must be 6 digits').when('otpRequested', {
    is: true,
    then: Yup.string().required('OTP is required'),
  }),
});

const ForgetPasswordScreen = () => {
  const [otpRequested, setOtpRequested] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);

  const handleRequestOtp = async(values) => {
    console.log(values)
    setIsLoading(true); // Set loading to true when request starts
    // dispatch(postRequestOtp(values))
    //   .then((res) => {
    //     setIsLoading(false); // Stop loading when request completes
    //     if (res?.payload?.message === 'OTP sent to your email.') {
    //       setOtpRequested(true);
    //     } else {
    //       setErrorMessage('Failed to send OTP');
    //     }
    //   })
    //   .catch(() => {
    //     setIsLoading(false); // Stop loading if request fails
    //     setErrorMessage('Failed to send OTP');
    //   });
    try{
      console.log("values ",values.phone)
    const confirmation = await auth().signInWithPhoneNumber(values.phone);
    setVerificationId(confirmation.verificationId);
    setIsLoading(false);
    setOtpRequested(true);
    }catch(error){
      console.error("OTP Send Error:", error);
      console.log("error ",error)
      setErrorMessage("Failed to send OTP. Please check your phone number.", error);
      setIsLoading(false);
    }

  };

  const handleVerifyOtp = async (values) => {
    setIsLoading(true); // Set loading to true when verification starts
    // dispatch(postResetVerifyOtp({ email: values.email, otp: values.otp }))
    //   .then((res) => {
    //     setIsLoading(false); // Stop loading when verification completes
    //     if (res?.payload?.message === 'OTP verified successfully') {
    //       navigation.navigate('ResetPassword', { email: values.email }); // Navigate to Reset Password
    //     } else {
    //       setErrorMessage('Invalid OTP');
    //     }
    //   })
    //   .catch(() => {
    //     setIsLoading(false); // Stop loading if verification fails
    //     setErrorMessage('OTP verification failed');
    //   });
    console.log("values ",values)
    try{
      console.log(values.otp)
    const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
    await auth().signInWithCredential(credential);
    setIsLoading(false);
    navigation.navigate('ResetPassword', { phone: values.phone }); // Navigate to Reset Password
    }catch(error){
        setIsLoading(false); // Stop loading if verification fails
        setErrorMessage('OTP verification failed');
    }

  };

  const handleSubmit = (values) => {
    if (!otpRequested) {
      handleRequestOtp(values); // Request OTP if not requested
    } else {
      handleVerifyOtp(values); // Verify OTP if already requested
    }
  };

  return (
    <Formik
      initialValues={{ phone: '', otp: '' }}
      // validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Forget Password</Text>

          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          <TextInput
            keyboardType='phone-number'
            style={styles.input}
            value={values.phone}
            onChangeText={(text) => {
              // Ensure phone number includes country code
              let formattedText = text.startsWith("+") ? text : "+91" + text.replace(/\D/g, "");
              handleChange("phone")(formattedText);
            }}
            onBlur={handleBlur('phone')}
            placeholder='phone'
            placeholderTextColor='#aaa'
          />
          {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {otpRequested && (
            <>
              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                onBlur={handleBlur('otp')}
                placeholder='Enter OTP'
                placeholderTextColor='#aaa'
                keyboardType='numeric'
              />
              {touched.otp && errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}
            </>
          )}

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            {isLoading ? ( // Show loading indicator when isLoading is true
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{otpRequested ? 'Verify OTP' : 'Request OTP'}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default ForgetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#1e90ff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});
