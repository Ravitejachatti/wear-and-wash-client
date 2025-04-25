import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { postResetPassword } from '../Redux/Auth/action';
import FeatherIcon from 'react-native-vector-icons/Feather'; // 👁️ Eye icon

// ✅ Validation schema with confirmPassword
const validationSchema = Yup.object().shape({
  newPassword: Yup.string().min(6, 'Password too short').required('New Password is required'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
});

const ResetPassword = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { phone } = route.params;
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 👁️ States for showing/hiding passwords
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (values) => {
    setIsLoading(true);
    dispatch(postResetPassword({ phone, newPassword: values.newPassword }))
      .then((res) => {
        if (res?.payload?.message === 'Password reset successfully') {
          setIsLoading(false);
          navigation.navigate('Login');
        } else {
          setErrorMessage('Failed to reset password');
          setIsLoading(false);
        }
      })
      .catch(() => {
        setErrorMessage('Failed to reset password');
        setIsLoading(false);
      });
  };

  return (
    <Formik
      initialValues={{ newPassword: '', confirmPassword: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Reset Password</Text>

          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

          {/* New Password */}
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              value={values.newPassword}
              onChangeText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              placeholder='Enter New Password'
              placeholderTextColor='#aaa'
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
              <FeatherIcon name={showNewPassword ? 'eye' : 'eye-off'} size={20} color="gray" />
            </TouchableOpacity>
          </View>
          {touched.newPassword && errors.newPassword && (
            <Text style={styles.errorText}>{errors.newPassword}</Text>
          )}

          {/* Confirm Password */}
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              placeholder='Confirm Password'
              placeholderTextColor='#aaa'
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <FeatherIcon name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="gray" />
            </TouchableOpacity>
          </View>
          {touched.confirmPassword && errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

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
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
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