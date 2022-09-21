import {
    GET_WISHLIST_SUCESS,
    GET_WISHLIST_FAIL,
    ADD_WISHLIST_ITEM_SUCCESS,
    ADD_WISHLIST_ITEM_FAIL,
    GET_WISHLIST_ITEM_TOTAL_SUCESS,
    GET_WISHLIST_ITEM_TOTAL_FAIL,
    REMOVE_WISHLIST_ITEM_SUCCESS,
    REMOVE_WISHLIST_ITEM_FAIL,
    CLEAR_WISHLIST,
} from "../actions/types"


const initialState = {
    'items':null,
    'total_items':null
}
export default function Wishlist(state=initialState, action){
    const  { type, payload} = action

    switch(type){
        case GET_WISHLIST_SUCESS:
            return {
                ...state,
                items:payload.wishlist
            }            
        case ADD_WISHLIST_ITEM_SUCCESS:
            return {
                ...state,
                items:payload.wishlist                
            }        
        case REMOVE_WISHLIST_ITEM_SUCCESS:
            return {
                ...state,
                items:payload.wishlist
            }
        case GET_WISHLIST_ITEM_TOTAL_SUCESS:
            return {
                ...state,
                total_items:payload.total_items
            }
        case REMOVE_WISHLIST_ITEM_FAIL:
        case GET_WISHLIST_FAIL:
        case ADD_WISHLIST_ITEM_FAIL:
        case GET_WISHLIST_ITEM_TOTAL_FAIL:
            return {
                ...state
            }

        case CLEAR_WISHLIST:
            return {
                ...state,
                items:[],
                total_items:0
            }
        default:
            return state            
    }

}