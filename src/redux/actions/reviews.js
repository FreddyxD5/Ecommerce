import axios from "axios"

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
} from "./types"

export const get_product_review = productId => async dispatch =>{    
    if(localStorage.getItem('access')){
        const config = {
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Authorization':`JWT ${localStorage.getItem('access')}`
            }
        }

        try{
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/get_review/${productId}`, config)
            if (res.status === 200){
                dispatch({
                    type:GET_PRODUCT_REVIEW_SUCCESS,
                    payload:res.data
                })
            }else{
                dispatch({
                    type:GET_PRODUCT_REVIEW_FAIL
                })        
            }
        }catch(err){
            dispatch({
                type:GET_PRODUCT_REVIEW_FAIL
            })
        }        
    }else{
        dispatch({
            type:GET_PRODUCT_REVIEW_FAIL
        })
    }

}

export const get_product_reviews = productId => async dispatch =>{    
    if(localStorage.getItem('access')){
        const config = {
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Authorization':`JWT ${localStorage.getItem('access')}`
            }
        }

        try{
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/get_reviews/${productId}`, config)
            if (res.status === 200){                
                dispatch({
                    type:GET_PRODUCT_REVIEWS_SUCCESS,
                    payload:res.data
                })
            }else{
                dispatch({
                    type:GET_PRODUCT_REVIEWS_FAIL
                })        
            }
        }catch(err){
            dispatch({
                type:GET_PRODUCT_REVIEWS_FAIL
            })
        }        
    }else{
        dispatch({
            type:GET_PRODUCT_REVIEWS_FAIL
        })
    }

}

export const add_review = (productId, rating, comment) => async dispatch =>{
    if(localStorage.getItem('access')){
        const config = {
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Authorization':`JWT ${localStorage.getItem('access')}`
            }
        }
                
        const body = JSON.stringify({           
            rating,
            comment
        })

        try{
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/reviews/add_review/${productId}`, body, config)
            if (res.status ===201){
                dispatch({
                    type:ADD_PRODUCT_REVIEW_SUCCESS,
                    payload:res.data
                })
            }else{
                dispatch({
                    type:ADD_PRODUCT_REVIEW_FAIL
                })
            }

        }catch(err){
            dispatch({
                type:ADD_PRODUCT_REVIEW_FAIL
            })
        }
    }
}

export const update_review = (product_id, rating, comment) => async dispatch =>{
    if(localStorage.getItem('access')){
        const config = {
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Authorization':`JWT ${localStorage.getItem('access')}`
            }
        }
                
        const body = JSON.stringify({           
            rating,
            comment
        })   


        try{
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/reviews/add_review/${product_id}`, body, config)
            if (res.status === 200){
                dispatch({
                    type:UPDATE_PRODUCT_REVIEW_SUCCESS,
                    payload:res.data
                })
            }else{
                dispatch({
                    type:UPDATE_PRODUCT_REVIEW_FAIL
                })
            }

        }catch(err){
            dispatch({
                type:UPDATE_PRODUCT_REVIEW_FAIL
            })
        }
    }
}

export const delete_review = productId => async dispatch =>{
    if(localStorage.getItem('access')){
        const config = {
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json',
                'Authorization':`JWT ${localStorage.getItem('access')}`
            }
        }

        try{
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/reviews/remove_review/${productId}`, config)
            if (res.status ===200){
                dispatch({
                    type:REMOVE_PRODUCT_REVIEW_SUCCESS,
                    payload:res.data
                })
            }else{
                dispatch({
                    type:REMOVE_PRODUCT_REVIEW_FAIL
                })
            }

        }catch(err){
            dispatch({
                type:REMOVE_PRODUCT_REVIEW_FAIL
            })
        }
    
    }
}

export const filter_reviews = (product_id, rating) => async dispatch =>{
    const config = {
        headers:{
            'Accept':'application/json'
        }
    }

    let myRating;

    if (rating === 0.5)
        myRating = '0.5';
    else if (rating === 1 || rating === 1.0)
        myRating = '1.0';
    else if (rating === 1.5)
        myRating = '1.5';
    else if (rating === 2 || rating === 2.0)
        myRating = '2.0';
    else if (rating === 2.5)
        myRating = '2.5';
    else if (rating === 3 || rating === 3.0)
        myRating = '3.0';
    else if (rating === 3.5)
        myRating = '3.5';
    else if (rating === 4 || rating === 4.0)
        myRating = '4.0';
    else if (rating === 4.5)
        myRating = '4.5';
    else
        myRating = '5.0';

    try{
        const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/reviews/filter_reviews/${product_id}?rating=${myRating}`,
                config)

        
        if (res.status === 200){
            dispatch({
                type:FILTER_REVIEW_BY_RATING_SUCCESS,
                payload:res.data
            })
        }
        else{
            dispatch({
                type:FILTER_REVIEW_BY_RATING_FAIL
            })
        }
    }catch(errr){
        dispatch({
            type:FILTER_REVIEW_BY_RATING_FAIL
        })
    }

}