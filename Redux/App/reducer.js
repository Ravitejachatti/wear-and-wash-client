import * as types from "./actionTypes";

const init = {
  isLoading: false,
  isError: false,
  centers: [],
  bookings: [],
  tempusers: [],
  users: [],
};

export const reducer = (oldState = init, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.GET_LOCATION_REQUEST:
      return {
        ...oldState,
        isLoading: true,
        isError: false,
        centers: [],
      };
    case types.GET_LOCATION_SUCCESS:
      return {
        ...oldState,
        isLoading: false,
        isError: false,
        centers: payload,
      };

    case types.GET_LOCATION_FAILURE:
      return {
        ...oldState,
        isLoading: false,
        isError: true,
        centers: [],
      };

    case types.GET_USER_BOOK_SLOT_REQUEST:
      return {
        ...oldState,
        isLoading: true,
        isError: false,
        bookings: [],
      };
    case types.GET_USER_BOOK_SLOT_SUCCESS:
      return {
        ...oldState,
        isLoading: false,
        isError: false,
        bookings: payload,
      };
    case types.GET_USER_BOOK_SLOT_FAILURE:
      return {
        ...oldState,
        isLoading: false,
        isError: true,
        bookings: [],
      };
    case types.GET_USERS_BY_CENTER_REQUEST:
      return {
        ...oldState,
        isLoading: true,
        isError: false,
        tempusers: [],
      };
    case types.GET_USERS_BY_CENTER_SUCCESS:
      return {
        ...oldState,
        isLoading: false,
        isError: false,
        tempusers: payload, // Assuming payload is the array of users
      };
    case types.GET_USERS_BY_CENTER_FAILURE:
      return {
        ...oldState,
        isLoading: false,
        isError: true,
        tempusers: [],
      };
    case types.FETCH_USERS_REQUEST:
      return {
        ...oldState,
        isLoading: false,
        isError: false,
        users: [],
      };
    case types.FETCH_USERS_SUCCESS:
      return {
        ...oldState,
        isLoading: false,
        isError: false,
        users: payload,
      };
    case types.FETCH_USERS_FAILURE:
      return {
        ...oldState,
        isLoading: false,
        isError: true,
        users: [],
      };
    // Inside the switch statement of the reducer
    case types.ACCEPT_USER_REQUEST:
      return {
        ...oldState,
        isLoading: true,
        isError: false,
      };
    case types.ACCEPT_USER_SUCCESS:
      const updatedTempUsers = oldState.tempusers.filter(
        (user) => user._id !== payload.id
      );
      const acceptedUser = oldState.tempusers.find(
        (user) => user._id === payload.id
      );
      return {
        ...oldState,
        isLoading: false,
        isError: false,
        users: [...oldState.users, acceptedUser], // Add the accepted user to users
        tempusers: updatedTempUsers, // Use a new array reference
      };
    case types.ACCEPT_USER_FAILURE:
      return {
        ...oldState,
        isLoading: false,
        isError: true,
      };
    case types.REJECT_USER_REQUEST:
      return {
        ...oldState,
        isLoading: true,
        isError: false,
      };

    case types.REJECT_USER_SUCCESS:
      const rejectedTempUsers = oldState.tempusers.filter(
        (user) => user._id !== payload.id
      );
      // console.log("rejected user ",rejectedTempUsers)
      return {
        ...oldState,
        isLoading: false,
        isError: false,
        tempusers: rejectedTempUsers, // Remove rejected user from tempusers
      };
    case types.REJECT_USER_FAILURE:
      return {
        ...oldState,
        isLoading: false,
        isError: true,
      };

    default:
      return oldState;
  }
};
