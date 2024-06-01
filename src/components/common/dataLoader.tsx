
import React from 'react'; 
import {Audio,Circles} from "react-loader-spinner"; 
  
export default function SpinnerLoading(){ 
  return ( 
    <div> 
      
      <Circles 
        height="80"
        width="80"
        color="white"
        ariaLabel="loading"
      />  
    </div> 
  ) 
} 
