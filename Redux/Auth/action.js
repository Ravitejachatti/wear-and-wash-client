import * as types from "./actionTypes";
import { Api } from "../../Api/Api";
import axios from "axios";



export const postRegister = (payload) => (dispatch) => {
     
     dispatch({ type: types.USER_REGISTER_REQUEST });
     
     return axios
       .post(`${Api}/api/user/register`, payload)
       .then((res) => {
        //  console.log("action", res)
        return dispatch({ type: types.USER_REGISTER_SUCCESS, payload: res.data });
          
       })
       .catch((err) => {
       return  dispatch({ type: types.USER_REGISTER_FAILURE, payload: err });
         
       });
   };

   // OTP Verification Action
export const postVerifyOtp = (payload) => (dispatch) => {
  dispatch({ type: types.OTP_VERIFY_REQUEST });

  return axios
    .post(`${Api}/api/user/verifyOtp`, payload) // Endpoint for OTP verification
    .then((res) => {
      return dispatch({ type: types.OTP_VERIFY_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      return dispatch({ type: types.OTP_VERIFY_FAILURE, payload: err });
    });
};


   export const postLogin = (payload) => (dispatch) => {
    console.log("dispatch")
    dispatch({ type: types.USER_LOGIN_REQUEST });
    console.log("after dispatch")
    return axios
      .post(`${Api}/api/user/login`, payload)
      .then((res) => {
        // console.log("action", res)
       return dispatch({ type: types.USER_LOGIN_SUCCESS, payload: res.data });
         
      })
      .catch((err) => {
      return  dispatch({ type: types.USER_LOGIN_FAILURE, payload: err });
        
      });
  };



export const postRequestOtp = (payload) => (dispatch) => {
  dispatch({ type: types.OTP_REQUEST });
  

  return axios
    .post(`${Api}/api/user/request-reset-otp`, payload) // Endpoint for requesting OTP
    .then((res) => {
      
      return dispatch({ type: types.OTP_REQUEST_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      return dispatch({ type: types.OTP_REQUEST_FAILURE, payload: err });
    });
};

export const postResetVerifyOtp = (payload) => (dispatch) => {
  dispatch({ type: types.POST_OTP_VERIFY_REQUEST });

  return axios
    .post(`${Api}/api/user/verify-reset-otp`, payload) // Endpoint for OTP verification
    .then((res) => {
      return dispatch({ type: types.POST_OTP_VERIFY_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      return dispatch({ type: types.POST_OTP_VERIFY_FAILURE, payload: err });
    });
};

export const postResetPassword = (payload) => (dispatch) => {
  dispatch({ type: types.PASSWORD_RESET_REQUEST });

  return axios
    .post(`${Api}/api/user/reset-password`, payload) // Endpoint for resetting password
    .then((res) => {
      return dispatch({ type: types.PASSWORD_RESET_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      return dispatch({ type: types.PASSWORD_RESET_FAILURE, payload: err });
    });
};
