import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { postResetPassword } from '../Redux/Auth/action'; // Redux action

const validationSchema = Yup.object().shape({
  newPassword: Yup.string().min(6, 'Password too short').required('New Password is required'),
});

const ResetPassword = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { email } = route.params;
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (values) => {
    dispatch(postResetPassword({ email, newPassword: values.newPassword }))
      .then((res) => {
        if (res?.payload?.message === 'Password reset successfully') {
          navigation.navigate('Login'); // Navigate to Login screen
        } else {
          setErrorMessage('Failed to reset password');
        }
      })
      .catch(() => setErrorMessage('Failed to reset password'));
  };

  return (
    <Formik
      initialValues={{ newPassword: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Reset Password</Text>

          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          <TextInput
            style={styles.input}
            value={values.newPassword}
            onChangeText={handleChange('newPassword')}
            onBlur={handleBlur('newPassword')}
            placeholder='Enter New Password'
            placeholderTextColor='#aaa'
            secureTextEntry
          />
          {touched.newPassword && errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

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

export default ResetPassword;
