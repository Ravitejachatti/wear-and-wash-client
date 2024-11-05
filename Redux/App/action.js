import * as types from "./actionTypes";
import { Api } from "../../Api/Api";
import axios from "axios";

export const getBasedOnLocation = () => (dispatch) => {
  dispatch({ type: types.GET_LOCATION_REQUEST });

  return axios
    .get(`${Api}/api/centers`)
    .then((res) => {
      return dispatch({
        type: types.GET_LOCATION_SUCCESS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      return dispatch({ type: types.GET_LOCATION_FAILURE, payload: err });
    });
};

export const bookingSlot = (payload) => (dispatch) => {
  // // console.log("action payload ", payload)
  dispatch({ type: types.POST_BOOK_SLOT_REQUEST });

  return axios
    .post(`${Api}/api/bookings/createBookingAndUpdateSlot`, payload)
    .then((res) => {
      return dispatch({
        type: types.POST_BOOK_SLOT_SUCCESS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      return dispatch({ type: types.POST_LOCATION_FAILURE, payload: err });
    });
};

export const getUserBookingSlot = (id) => (dispatch) => {
  dispatch({ type: types.GET_USER_BOOK_SLOT_REQUEST });

  return axios
    .get(`${Api}/api/bookings/${id}`, {})
    .then((res) => {
      // console.log("dispatch response ",res.payload)
      return dispatch({
        type: types.GET_USER_BOOK_SLOT_SUCCESS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      return dispatch({ type: types.GET_USER_BOOK_SLOT_FAILURE, payload: err });
    });
};

export const getUsersByCenter = (centerName) => (dispatch) => {
  dispatch({ type: types.GET_USERS_BY_CENTER_REQUEST }); // Dispatching request action

  return axios
    .get(`${Api}/api/user/${centerName}`)
    .then((res) => {
      // Assuming res.data.data contains the array of users
      dispatch({
        type: types.GET_USERS_BY_CENTER_SUCCESS,
        payload: res.data, // Dispatching success action with the data
      });
    })
    .catch((err) => {
      // Dispatching failure action with the error response
      dispatch({
        type: types.GET_USERS_BY_CENTER_FAILURE,
        payload: err.response?.data || { message: "Error fetching users" },
      });
    });
};

export const fetchusers = (centerName) => (dispatch) => {
  dispatch({ type: types.FETCH_USERS_REQUEST }); // Dispatching request action

  return axios
    .get(`${Api}/api/user/register/${centerName}`)
    .then((response) => {
      // console.log("response ",response.payload)
      dispatch({
        type: types.FETCH_USERS_SUCCESS,
        payload: response.data, // Use response data correctly
      });
    })
    .catch((error) => {
      dispatch({
        type: types.FETCH_USERS_FAILURE,
        payload: error.response?.data?.data || {
          message: "Error fetching users",
        },
      });
    });
};

export const acceptUser = (userId) => async (dispatch) => {
  // console.log("accept user",userId)
  dispatch({ type: types.ACCEPT_USER_REQUEST });
  try {
    await axios.post(`${Api}/api/user/accept/${userId}`);
    const payloads = { id: userId }; // Create the payload
    // console.log("Payload for ACCEPT_USER_SUCCESS:", payloads); // Log the payload
    dispatch({ type: types.ACCEPT_USER_SUCCESS, payload: { id: userId } });
  } catch (error) {
    dispatch({
      type: types.ACCEPT_USER_FAILURE,
      payload: error.response?.data || { message: "Error accepting user" },
    });
  }
};

export const rejectUser = (userId) => async (dispatch) => {
  dispatch({ type: types.REJECT_USER_REQUEST });
  try {
    await axios.post(`${Api}/api/user/reject/${userId}`);
    const payloads = { id: userId }; // Create the payload
    // console.log("Payload for REJECT_USER_SUCCESS:", payloads); // Log the payload
    dispatch({ type: types.REJECT_USER_SUCCESS, payload: { id: userId } });
  } catch (error) {
    dispatch({
      type: types.REJECT_USER_FAILURE,
      payload: error.response?.data || { message: "Error rejecting user" },
    });
  }
};
