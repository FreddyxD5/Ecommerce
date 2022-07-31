import {
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    AUTHENTICATION_SUCCESS,
    AUTHENTICATION_FAIL,
    REFRESH_SUCCESS,
    REFRESH_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    RESET_PASSWORD_CONFIRM_FAIL,
    LOGOUT,

} from './types';

import { setAlert } from './alert';

import axios from 'axios';

export const signup = (first_name, last_name, email, password, re_password) => async dispatch => {

    dispatch({
        type: SET_AUTH_LOADING
    });


    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        re_password
    });


    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/`, body, config);

        if (res.status === 201) {
            dispatch({
                type: SIGNUP_SUCCESS,
                payload: res.data
            });
            dispatch(setAlert('Usuario creado correctamente', 'green'))
        } else {
            dispatch({
                type: SIGNUP_FAIL
            });
            dispatch(setAlert('Error al crear cuenta', 'red'))
        }

        dispatch({
            type: REMOVE_AUTH_LOADING
        })

    } catch (err) {
        dispatch({
            type: SIGNUP_FAIL
        });

        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        dispatch(setAlert('Error conectando al servidor, intente más tarde.', 'red'))
    }

};


export const activate = (uid, token) => async dispatch => {

    dispatch({
        type: SET_AUTH_LOADING
    })

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({
        uid,
        token
    })

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/activation/`, body, config);
        if (res.status === 204) {
            dispatch({
                type: ACTIVATION_SUCCESS
            })
            dispatch(setAlert('Cuenta activada correctamente.', 'green'))
        } else {
            dispatch({
                type: ACTIVATION_FAIL
            })
            dispatch(setAlert('Error al activar la cuenta', 'red'))
        }
        dispatch({
            type: REMOVE_AUTH_LOADING
        })

    } catch (err) {
        dispatch({
            type: ACTIVATION_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        dispatch(setAlert('Error en el servidor por favor intente más tarde.', 'red'))
    }
}

export const check_authenticated = () => async dispatch =>{
    if(localStorage.getItem('access')){
        const config ={
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        }
        const body = JSON.stringify({
            'token':localStorage.getItem('access')
        })
    
        try{
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/verify/`, body, config)
            if (res.status ===200){
                dispatch({
                    type:AUTHENTICATION_SUCCESS
                });
            }else{
                dispatch({
                    type:AUTHENTICATION_FAIL
                });
            }
        }catch(err){
            dispatch({
                type:AUTHENTICATION_FAIL
            });    
        }
    }else{
        dispatch({
            type:AUTHENTICATION_FAIL
        });
    }
    

}
export const load_user = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        }

        try {

            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config)

            if (res.status === 200) {
                dispatch({
                    type: USER_LOADED_SUCCESS,
                    payload: res.data
                })
            } else {
                dispatch({
                    type: USER_LOADED_FAIL
                })
            }
        } catch (err) {
            dispatch({
                type: USER_LOADED_FAIL
            })
        }
    }


}

// Iniciar Sesion con usuario
export const login = (email, password) => async dispatch => {
    dispatch({
        type: SET_AUTH_LOADING
    })

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({
        email,
        password
    })

    try {

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/create/`, body, config);
        if (res.status === 200) {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
            dispatch(load_user())
            dispatch({
                type: REMOVE_AUTH_LOADING
            })
            dispatch(setAlert('Inicio de sesion con éxito', 'green'));
        } else {
            dispatch({
                type: LOGIN_FAIL
            })
            dispatch({
                type: REMOVE_AUTH_LOADING
            })
            dispatch(setAlert('Error al iniciar sesion', 'red'));
        }

    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        })
        dispatch({
            type: REMOVE_AUTH_LOADING
        })
        dispatch(setAlert('Error al iniciar sesion, intente más tarde', 'red'));

    }

}
export const refresh = () => async dispatch=>{
    if (localStorage.getItem('refresh')){
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify({
            'refresh':localStorage.getItem('refresh')
        })        
        
                    
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/refresh/`, body, config)

        try{                  
            if (res.status===200){                
                dispatch({
                    type:REFRESH_SUCCESS,
                    payload:res.data
                });
            }
            else if(res.status === 401){
                console.log('xq fallas amiguito?')

            }else{
                dispatch({
                    type:REFRESH_FAIL
                })
            }

        }catch(err){
            console.log('Error del servidor')
            dispatch({
                type:REFRESH_FAIL
            });
        }
    }else{
        dispatch({
            type:REFRESH_FAIL
        });
    }
}
export const reset_password = (email)=>async dispatch=>{
    dispatch({
        type:SET_AUTH_LOADING
    });

    const config ={
        headers:{
            'Content-Type':'application/json'
        }
    }

    const body = JSON.stringify({
         email
    })

    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password/`, body, config)

    try{
        if (res.status===204){
            dispatch({
                type:RESET_PASSWORD_SUCCESS
            })
            dispatch({
                type:REMOVE_AUTH_LOADING
            })
            dispatch(setAlert("Se le ha enviado un correo, revise su bandeja de entrada.",'green'))
        }else{
            dispatch({
                type:RESET_PASSWORD_FAIL
            });
            dispatch({
                type:REMOVE_AUTH_LOADING
            })
            dispatch(setAlert("Error sending email",'red'))
        }
    

    }catch(err){
        dispatch({
            type:RESET_PASSWORD_CONFIRM_FAIL
        });
        dispatch(setAlert("There's a problem with the servers",'red'))
    }
}

export const reset_password_confirm = (uid, token, new_password, re_new_password)=> async dispatch => {
    dispatch({
        type:SET_AUTH_LOADING
    })
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }

    const body = JSON.stringify({
        uid,
        token,
        new_password,
        re_new_password
    });    
    if (new_password !== re_new_password){
        dispatch({
            type:RESET_PASSWORD_CONFIRM_FAIL
        })
        dispatch({
            type:REMOVE_AUTH_LOADING
        })        
    }else{        
        try{
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`, body, config)
            if (res.status ===204){
                console.log('There there')
                dispatch({
                    type:RESET_PASSWORD_CONFIRM_SUCCESS
                })
                dispatch({
                    type:REMOVE_AUTH_LOADING
                })
                dispatch(setAlert('Password has been reset successfully','green'))
            }else{
                dispatch({
                    type:RESET_PASSWORD_CONFIRM_FAIL
                })
                dispatch({
                    type:REMOVE_AUTH_LOADING
                })
                dispatch(setAlert('Error updating your password','red'))
            }

        }catch(err){
            console.log(err)
            dispatch({
                type:RESET_PASSWORD_CONFIRM_FAIL
            })
            dispatch({
                type:REMOVE_AUTH_LOADING
            })
            dispatch(setAlert('Server error, try again in a few moments.','red'))
        }
    }
}
export const logout = () => dispatch =>{
    dispatch({
        type:LOGOUT
    })
    dispatch(setAlert('Succesfully looged out','green'));

}