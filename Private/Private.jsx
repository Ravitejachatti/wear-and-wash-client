import React, { useEffect, useState } from 'react'
import { getData } from '../Storage/getData'

const Private = () => {

  const [token,setToken] = useState(null)

  useEffect(()=>{
    const getTokenData = async()=>{
      let token = await getData("token");
      // console.log("token: " + token)
      if(token){
        setToken(token)
      }
    }

    getTokenData()
  },[])

 

  const auth =  token?true:false;
  if(auth){
    return false
  }
  else{
    return true
  }
}

export default Private