import { 
    GET_SHIPPING_OPTION_SUCCESS,
    GET_SHIPPING_OPTION_FAIL
} from "../actions/types";
import { get_shipping_options } from "../actions/shipping";

const initialState = {
    shipping_options:null
}

export default function Shipping(state=initialState, action){
    const {type, payload }= action

    switch(type){
        case GET_SHIPPING_OPTION_SUCCESS:
            return {
                ...state,
                shipping_options:payload.shipping_options             
            }
        case GET_SHIPPING_OPTION_FAIL:
            return {
                ...state,
                shipping_options:null
            }
        default:
            return state
    }

}
