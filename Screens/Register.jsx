import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Api } from '../Api/Api';
import { useDispatch } from 'react-redux';
import { postRegister } from '../Redux/Auth/action';
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]+$/, 'Phone number must be numeric').required('Phone is required'),
  password: Yup.string().min(6, 'Password too short').required('Password is required'),
  gender: Yup.string().required('Gender is required'),
  location: Yup.string().required('Location is required'),
});

const Register = () => {

    const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState(null);
  const navigation = useNavigation()

  const handleSubmit = (values) => {

console.log(values)

 dispatch(postRegister(values))

 .then(res=>{
  console.log("response", res);
  
  if(res?.payload?.response?.data?.message){
    setErrorMessage(res?.payload?.response?.data?.message)
  }
  if(res?.payload?.message === "Sign up successful"){
    navigation.replace("Login")
  }
 })
 .catch(err=>{
  console.log("error", err)
 })

   
};    
console.log("hare krishna ");
console.log("error message",errorMessage)

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Formik
        initialValues={{ name: '', email: '', phone: '', password: '', gender: '', location: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            
            <View style={styles.inputWrapper}>
                {/* {errorMessage && <Text style={{textAlign:"center", color:"red"}}>{errorMessage}</Text>} */}
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

            <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
              <Text style={styles.btnText}>Register</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  inputContainer: {
    paddingHorizontal: 30,
    marginTop: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingLeft: 10,
  },
  icon: {
    paddingRight: 10,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: theme.color.primary,
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
    paddingLeft: 10,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, 
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, 
  },
});

export default Register;
