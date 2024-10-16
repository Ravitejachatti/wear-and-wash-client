import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { postRequestOtp, postResetVerifyOtp } from '../Redux/Auth/action'; // Redux actions

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

  const handleRequestOtp = (values) => {
    setIsLoading(true); // Set loading to true when request starts
    dispatch(postRequestOtp(values))
      .then((res) => {
        setIsLoading(false); // Stop loading when request completes
        if (res?.payload?.message === 'OTP sent to your email.') {
          setOtpRequested(true);
        } else {
          setErrorMessage('Failed to send OTP');
        }
      })
      .catch(() => {
        setIsLoading(false); // Stop loading if request fails
        setErrorMessage('Failed to send OTP');
      });
  };

  const handleVerifyOtp = (values) => {
    setIsLoading(true); // Set loading to true when verification starts
    dispatch(postResetVerifyOtp({ email: values.email, otp: values.otp }))
      .then((res) => {
        setIsLoading(false); // Stop loading when verification completes
        if (res?.payload?.message === 'OTP verified successfully') {
          navigation.navigate('ResetPassword', { email: values.email }); // Navigate to Reset Password
        } else {
          setErrorMessage('Invalid OTP');
        }
      })
      .catch(() => {
        setIsLoading(false); // Stop loading if verification fails
        setErrorMessage('OTP verification failed');
      });
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
      initialValues={{ email: '', otp: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Forget Password</Text>

          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          <TextInput
            keyboardType='email-address'
            style={styles.input}
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            placeholder='Email'
            placeholderTextColor='#aaa'
          />
          {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {otpRequested && (
            <>
              <TextInput
                style={styles.input}
                value={values.otp}
                onChangeText={handleChange('otp')}
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
