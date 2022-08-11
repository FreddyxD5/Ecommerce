import { 
    GET_SHIPPING_OPTION_SUCCESS,
    GET_SHIPPING_OPTION_FAIL
} from "./types";
import axios from "axios";

export const get_shipping_options = () => async dispatch =>{
    const config = {
        headers:{            
            'Accept':'application/json'
        }
    }
        
    try{        
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/shipping/get-shipping-options`, config)

        if (res.status === 200){           
            console.log(res.data) 
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