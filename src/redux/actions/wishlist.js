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
} from "./types"

import { setAlert } from "./alert"
import axios from "axios"

export const get_wishlist = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        }

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/wishlist/wishlist_items`, config)

            if (res.status === 200) {
                dispatch({
                    type: GET_WISHLIST_SUCESS,
                    payload: res.data
                })                
            } else {
                dispatch({
                    type: GET_WISHLIST_FAIL
                })
            }

        } catch (err) {
            dispatch({
                type: GET_WISHLIST_FAIL
            })
        }

    } else {
        dispatch({
            type: GET_WISHLIST_FAIL
        })
    }

}

export const add_wishlist_item = productId => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        }

        const product_id = productId
        const body = JSON.stringify({ product_id })

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/wishlist/add_item`, body, config)

            if (res.status === 201) {
                dispatch({
                    type: ADD_WISHLIST_ITEM_SUCCESS,
                    payload: res.data
                })
                dispatch(setAlert('El producto se ha añadido a su lista de deseos'))
            } else {
                dispatch({
                    type: ADD_WISHLIST_ITEM_FAIL
                })
            }
        } catch (err) {
            dispatch({
                type: ADD_WISHLIST_ITEM_FAIL
            })
        }
    } else {
        dispatch({
            type: ADD_WISHLIST_ITEM_FAIL
        })
    }
}

export const remove_wishlist_item = productId => async dispatch => {
    if (localStorage.getItem('access')) {
        const product_id = productId
        const body = JSON.stringify({ product_id })

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            },
            data: body
        }

        

        try {
            const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/wishlist/remove_item`, config)

            if (res.status === 200) {
                dispatch({
                    type: REMOVE_WISHLIST_ITEM_SUCCESS,
                    payload: res.data
                })
                dispatch(setAlert('El producto se ha quitado de su lista de deseos'))
            } else {
                dispatch({
                    type: REMOVE_WISHLIST_ITEM_FAIL
                })
            }
        } catch (err) {
            dispatch({
                type: REMOVE_WISHLIST_ITEM_FAIL
            })
        }
    } else {
        dispatch({
            type: REMOVE_WISHLIST_ITEM_FAIL
        })
    }
}

export const get_wishlist_item_total = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        }

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/wishlist/get_item_total`, config)

            if (res.status === 200) {
                dispatch({
                    type: GET_WISHLIST_ITEM_TOTAL_SUCESS,
                    payload: res.data
                })
            }
            else {
                dispatch({
                    type: GET_WISHLIST_ITEM_TOTAL_FAIL
                })
            }
        } catch (err) {
            dispatch({
                type: GET_WISHLIST_ITEM_TOTAL_FAIL
            })
        }
    } else {
        dispatch({
            type: GET_WISHLIST_ITEM_TOTAL_FAIL
        })
    }

}