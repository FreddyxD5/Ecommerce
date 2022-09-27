import {
    GET_PRODUCT_REVIEW_SUCCESS,
    GET_PRODUCT_REVIEW_FAIL,
    GET_PRODUCT_REVIEWS_SUCCESS,
    GET_PRODUCT_REVIEWS_FAIL,
    ADD_PRODUCT_REVIEW_SUCCESS,
    ADD_PRODUCT_REVIEW_FAIL,
    REMOVE_PRODUCT_REVIEW_SUCCESS,
    REMOVE_PRODUCT_REVIEW_FAIL,
    UPDATE_PRODUCT_REVIEW_SUCCESS,
    UPDATE_PRODUCT_REVIEW_FAIL,
    FILTER_REVIEW_BY_RATING_SUCCESS,
    FILTER_REVIEW_BY_RATING_FAIL,
} from "../actions/types"


const initialState = {
    review:null,
    reviews:null
}
export default function Review(state=initialState, action){
    const { type, payload } = action

    switch(type){
        case GET_PRODUCT_REVIEW_SUCCESS:
            return {
                ...state,
                review:payload.review
            }        
        case GET_PRODUCT_REVIEW_FAIL:
            return {
                ...state,
                review:{}
            }
        case GET_PRODUCT_REVIEWS_SUCCESS:
            return {
                ...state,
                reviews:payload.reviews
            }
        case GET_PRODUCT_REVIEWS_FAIL:
            return {
                ...state,
                reviews:[]
            }
        case ADD_PRODUCT_REVIEW_SUCCESS:
            return{
                ...state,
                review:payload.review,
                reviews:payload.reviews
            }
        case ADD_PRODUCT_REVIEW_FAIL:
            return {
                ...state,
                review:{},
               
            }
        case REMOVE_PRODUCT_REVIEW_SUCCESS:
            return {
                ...state,
                review:{},
                reviews:payload.reviews
            }
        case REMOVE_PRODUCT_REVIEW_FAIL:
            return {
                ...state,                
            }
        case UPDATE_PRODUCT_REVIEW_SUCCESS:
            return {
                ...state,
                review:payload.review,
                reviews:payload.reviews
            }
        case UPDATE_PRODUCT_REVIEW_FAIL:
            return {
                ...state,
                review:null,
                reviews:null
            }
        
        case FILTER_REVIEW_BY_RATING_SUCCESS:
            return {
                ...state,
                reviews:payload.reviews
            }
        
        case FILTER_REVIEW_BY_RATING_FAIL:
            return {
                ...state                
            }
        
        default:
            return state
    }


}