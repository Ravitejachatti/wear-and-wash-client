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