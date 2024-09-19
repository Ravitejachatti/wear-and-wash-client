import * as types from "./actionTypes"

const init = {
    isLoading:false,
    isError:false,
    centers:[],
    bookings:[]
}


export const reducer = (oldState=init,action)=>{
    const {type,payload}= action;

    switch(type){
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
      return{
        ...oldState,
        isLoading:true,
         isError:false,
        bookings:[]
      }
    case types.GET_USER_BOOK_SLOT_SUCCESS:
      return{
        ...oldState,
        isLoading:false,
        isError:false,
        bookings:payload
      }
    case types.GET_USER_BOOK_SLOT_FAILURE:
       return{
        ...oldState,
        isLoading:false,
        isError:true,
        bookings:[]
       }
        default:
            return oldState
    }
}