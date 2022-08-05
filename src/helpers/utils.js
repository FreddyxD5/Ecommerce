export const config_auth ={
    headers:{
        'Content-Type':'application/json',
        'Accept':'application/json',
        'Authorization': `JWT ${localStorage.getItem('access')}`
    }
}