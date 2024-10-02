
import * as types from "./actionTypes"
import { Api } from "../../Api/Api"
import axios from "axios"



export const getBasedOnLocation =()=> (dispatch)=>{
    dispatch({type:types.GET_LOCATION_REQUEST})

  return  axios.get(`${Api}/api/centers`)
    .then(res=>{
     return  dispatch({type:types.GET_LOCATION_SUCCESS, payload:res.data.data})
    })
    .catch(err=>{
    return  dispatch({type:types.GET_LOCATION_FAILURE, payload:err})
    })
}



export const bookingSlot =(payload)=> (dispatch)=>{
  // console.log("action payload ", payload)
  dispatch({type:types.POST_BOOK_SLOT_REQUEST})

return  axios.post(`${Api}/api/bookings/createBookingAndUpdateSlot`, payload)
  .then(res=>{
   return  dispatch({type:types.POST_BOOK_SLOT_SUCCESS, payload:res.data.data})
  })
  .catch(err=>{
  return  dispatch({type:types.POST_LOCATION_FAILURE, payload:err})
  })
}



export const getUserBookingSlot =()=> (dispatch)=>{
  
  dispatch({type:types.GET_USER_BOOK_SLOT_REQUEST})

return  axios.get(`${Api}/api/bookings`, )
  .then(res=>{
   return  dispatch({type:types.GET_USER_BOOK_SLOT_SUCCESS, payload:res.data.data})
  })
  .catch(err=>{
  return  dispatch({type:types.GET_USER_BOOK_SLOT_FAILURE, payload:err}) 
  })
} 