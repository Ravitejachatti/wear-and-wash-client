import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Api } from '../Api/Api';
import { useDispatch } from 'react-redux';
import { postRegister, postVerifyOtp } from '../Redux/Auth/action';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]+$/, 'Phone number must be numeric').required('Phone is required'),
  password: Yup.string().min(6, 'Password too short').required('Password is required'),
  gender: Yup.string().required('Gender is required'),
  location: Yup.string().required('Location is required'),
  otp: Yup.string().min(6, 'OTP must be 6 digits').when('otpSent', {
    is: true,
    then: Yup.string().required('OTP is required'),
  })
});

const Register = () => {
  const dispatch = useDispatch();
  const [otpSent, setOtpSent] = useState(false); // Track OTP status
  const [errorMessage, setErrorMessage] = useState(null);
  const [otp, setOtp] = useState('');
  const [userData, setUserData] = useState(null); // Store user data after initial registration
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false); // Loading state


  const handleSubmit = (values) => {
    setIsLoading(true);
    if (!otpSent) {
      // Initial Registration
      dispatch(postRegister(values))
      
        .then((res) => {
          if (res?.payload?.response?.data?.message) {
             // console.log("register")
            setErrorMessage(res?.payload?.response?.data?.message);
          } else if (res?.payload?.message === 'OTP sent to your email. Please verify to complete registration.') {
            setOtpSent(true);
            setIsLoading(false);
            setUserData(values); // Save the user data for OTP verification
            setErrorMessage(''); // Clear previous errors
            
          }
        })
        .catch((err) => {
          // console.log('error', err);
        });
    } else {
      // OTP Verification
      setIsLoading(true);
      dispatch(postVerifyOtp({ name: userData.name, email: userData.email, password:userData.password, phone:userData.phone, gender:userData.gender, location:userData.location, role:userData.role, otp }))
        .then((res) => {
          // console.log("res",res.payload.message)
          if (res?.payload?.message === 'Registration successful') {
            setIsLoading(false);
            navigation.replace('Login');
          } else {
            setErrorMessage('Invalid OTP');
          }

        })
        .catch((err) => {
          // console.log('error', err);
          setErrorMessage('OTP verification failed');
        });
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
            <Text style={styles.errorMessage}>{errorMessage}</Text>

            {!otpSent ? (
              <>
                <View style={styles.inputWrapper}>
                  <Icon name="user" size={20} color="gray" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    placeholder="Name"
                  />
                </View>
                {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                <View style={styles.inputWrapper}>
                  <Icon name="envelope" size={20} color="gray" style={styles.icon} />
                  <TextInput
                    keyboardType="email-address"
                    style={styles.input}
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder="Email"
                  />
                </View>
                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                <View style={styles.inputWrapper}>
                  <Icon name="phone" size={20} color="gray" style={styles.icon} />
                  <TextInput
                    keyboardType="numeric"
                    style={styles.input}
                    value={values.phone}
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    placeholder="Phone"
                  />
                </View>
                {touched.phone && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                <View style={styles.inputWrapper}>
                  <Icon name="lock" size={20} color="gray" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    placeholder="Password"
                    secureTextEntry
                  />
                </View>
                {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                <View style={styles.pickerWrapper}>
                  <RNPickerSelect
                    onValueChange={(value) => setFieldValue('gender', value)}
                    placeholder={{ label: 'Select Gender', value: null }}
                    value={values.gender}
                    items={[
                      { label: 'Male', value: 'Male' },
                      { label: 'Female', value: 'Female' },
                    ]}
                    style={pickerSelectStyles}
                  />
                </View>
                {touched.gender && errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

                <View style={styles.pickerWrapper}>
                  <RNPickerSelect
                    onValueChange={(value) => setFieldValue('location', value)}
                    placeholder={{ label: 'Select Location', value: null }}
                    value={values.location}
                    items={[
                      { label: 'MHP-1', value: 'MHP-1' },
                      { label: 'MHP-2', value: 'MHP-2' },
                      { label: 'MHP-3', value: 'MHP-3' },
                      { label: 'AUB1-1', value: 'AUB1-1' },
                      { label: 'AUB1-2', value: 'AUB1-2' },
                      { label: 'AUB2-1', value: 'AUB2-1' },
                      { label: 'AUB2-3', value: 'AUB2-3' },
                      { label: 'SMT-1', value: 'SMT-1' },
                      { label: 'SMT-2', value: 'SMT-2' },
                      { label: 'MT-1', value: 'MT-1' },
                      { label: 'MMT-2', value: 'MMT-2' },
                    ]}
                    style={pickerSelectStyles}
                  />
                </View>
                {touched.location && errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
              </>
            ) : (
              <View style={styles.inputWrapper}>
                <Icon name="lock" size={20} color="gray" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="Enter OTP"
                  keyboardType="numeric"
                />
              </View>
            )}

            <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
            {isLoading ? ( // Show loading indicator when isLoading is true
              <ActivityIndicator size="small" color="#fff" />
            ) : (<Text style={styles.btnText}>{otpSent ? 'Verify OTP' : 'Register'}</Text>)}
              
            </TouchableOpacity>
            
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  pickerWrapper: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 10,
  },
  btn: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
  },
};
