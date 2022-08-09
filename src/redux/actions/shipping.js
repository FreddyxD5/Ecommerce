import { 
    GET_SHIPPING_OPTION_SUCCESS,
    GET_SHIPPING_OPTION_FAIL
} from "./types";
import axios from "axios";

export const get_shipping_options = () => async dispatch =>{
    const headers = {
        headers:{
            'Content-Type':'application/json',
            'Accept':'application/json'
        }
    }
    try{
        
        const res = await res.get(`${process.env.REACT_APP_API_URL}/shipping/get-shipping-options`, headers)
        if (res.status === 200){
            dispatch({
                type:GET_SHIPPING_OPTION_SUCCESS,
                payload:res.data
            })
        }else{
            dispatch({
                type:GET_SHIPPING_OPTION_FAIL
            })
        }
    }catch(err){
        dispatch({
            type:GET_SHIPPING_OPTION_FAIL
        })
    }

}