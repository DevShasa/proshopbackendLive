import axios from 'axios'
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_DETAIL_REQUEST,
    USER_DETAIL_SUCCESS,
    USER_DETAIL_FAIL,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_REQUEST,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_LIST_RESET,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,
    ADMIN_GET_USER_REQUEST,
    ADMIN_GET_USER_SUCCESS,
    ADMIN_GET_USER_FAIL,
    ADMIN_UPDATE_USER_REQUEST,
    ADMIN_UPDATE_USER_SUCCESS,
    ADMIN_UPDATE_USER_FAIL,
} from '../constants/userConstants';
import { FETCH_ORDER_DETAILS_RESET } from '../constants/orderConstants';

const config = {
    // Content-Type: application/x-www-form-urlencoded
    headers:{'Content-type':'application/json'}
}

export const Login = (email, password) =>
    async (dispatch) =>{
        try{
            dispatch({
                type: USER_LOGIN_REQUEST
            })

            const response =  await axios.post(
                    '/api/users/login/', 
                    {'username': email, 'password': password}, 
                    config
                )

            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: response.data
            })

            localStorage.setItem('userInfo', JSON.stringify(response.data))

        }catch(error){
            dispatch({
                type:USER_LOGIN_FAIL,
                payload: error.response && error.response.data.detail 
                    ? error.response.data.detail 
                    : error.message,
            })
        }
    }

export const logout = () => (dispatch) =>{
    // Remove item from localstorage 
    // then dispatch logout command to reducer
    localStorage.removeItem('userInfo')
    dispatch({type: USER_LOGOUT})
    dispatch({type: USER_LIST_RESET})
    dispatch({type:FETCH_ORDER_DETAILS_RESET})
}


export const register = (name, email, password) => {
    return async(dispatch) =>{
        try{
            dispatch({type: USER_REGISTER_REQUEST})

            const response = await axios.post(
                '/api/users/register/', 
                { 'email':email, 'name': name,'password': password}, 
                config 
            )
            // Register the user
            dispatch({
                type: USER_REGISTER_SUCCESS,
                payload: response.data
            })
            // Log in the user 
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: response.data
            })
            localStorage.setItem('userInfo', JSON.stringify(response.data))

        }catch(error){
            dispatch({
                type:USER_REGISTER_FAIL,
                payload: error.response && error.response.data.detail 
                    ? error.response.data.detail 
                    : error.message,
            })
        }
    }
}

export const getUserDetails = (id)=>{
    return async(dispatch, getState)=>{
        try{
            dispatch({type:USER_DETAIL_REQUEST})

            // Get authorization token from current user
            //  getstate().userLogin.userInfo.token
            const { userLogin:{ userInfo:{token}} } = getState()
            // Put the authorization token inside http header
            const authConfig = {
                headers: { 
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            }
            const url = `api/users/${id}`
            const response = await axios.get(url, authConfig)
            // url will evaluate to 'api/users/profile' its a string value 
            dispatch({
                type: USER_DETAIL_SUCCESS,
                payload: response.data
            })
        }catch(error){
            dispatch({
                type:USER_DETAIL_FAIL,
                payload: error.response && error.response.data.detail 
                    ? error.response.data.detail 
                    : error.message,
            })
        }
    }
}


export const updateUserProfile = (user) =>{
    return async(dispatch, getState) =>{
        try{
            // Load the current profile
            dispatch({type: USER_UPDATE_PROFILE_REQUEST})

            // Get some essential http packages to send 
            const { userLogin:{userInfo:{token}}} = getState()
            const authConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }
            // send put request to the server 
            const response = await axios.put(
                'api/users/profile/update/',
                user,
                authConfig
            )
            
            // Dispatch the sucessful data update to the store
            dispatch({
                type: USER_UPDATE_PROFILE_SUCCESS,
                payload: response.data
            })

            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: response.data
            })
            localStorage.setItem('userInfo', JSON.stringify(response.data))

        }catch(error){
            dispatch({
                type:USER_UPDATE_PROFILE_FAIL,
                payload: error.response && error.response.data.detail 
                    ? error.response.data.detail 
                    : error.message,
            })
        }
    }
}

export const adminFetchUserList = () =>{
    return async (dispatch, getState) =>{
        try{
            dispatch({type:USER_LIST_REQUEST})

            const { userLogin: {userInfo:{token}} } = getState()
            const authConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }

            // get the data
            const response = await axios.get(
                '/api/users/',
                authConfig
            )

            // Dispatch data to adminFetchUserList
            dispatch({
                type: USER_LIST_SUCCESS,
                payload: response.data
            })
            
        }catch(error){
            dispatch({
                type:USER_LIST_FAIL,
                payload: error.response && error.response.data.detail 
                    ? error.response.data.detail 
                    : error.message,
            })
        }
    }
}

export const deleteUserAction = (id) =>{
    return async(dispatch, getState) => {
        try{
            dispatch({type:USER_DELETE_REQUEST})

            // Get the Admin's Auth token 
            const { userLogin: {userInfo:{token}} } = getState()
            const authConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }
            // Send the delete request to the backend 
            const response = await axios.delete(
                `/api/users/delete/${id}`,
                authConfig
            )

            // Update the reducer 
            dispatch({
                type: USER_DELETE_SUCCESS,
                payload: response.data,
            })


        }catch(error){
            dispatch({
                type:USER_DELETE_FAIL,
                payload: error.response && error.response.data.detail 
                    ? error.response.data.detail 
                    : error.message,
            }) 
        }
    }
}

export const adminGetUserByIdAction = (id) =>{
    return async(dispatch, getState) =>{
        try{
            dispatch({type: ADMIN_GET_USER_REQUEST})

            const { userLogin:{userInfo:{token}} } = getState()
            const config = {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }

            const response = await axios.get( `/api/users/${id}`, config )

            dispatch({
                type: ADMIN_GET_USER_SUCCESS,
                payload: response.data
            })

        }catch(error){
            dispatch({
                type:ADMIN_GET_USER_FAIL,
                payload: error.response && error.response.data.detail 
                    ? error.response.data.detail 
                    : error.message,
            }) 
        }
    }
}

export const adminUpdateUserAction = (id, newUserData) => {
    return async(dispatch, getState) =>{
        try{
            dispatch({type:ADMIN_UPDATE_USER_REQUEST})

            // Get admin credentials from loggedin instance
            const {userLogin:{userInfo:{token}}} = getState()
            const config = {
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }

            // Send the data via axios
            const response = axios.put(`/api/users/update/${id}/`, newUserData, config)

            dispatch({
                type: ADMIN_UPDATE_USER_SUCCESS,
                payload: response.data
            })

        }catch(error){
            dispatch({
                type:ADMIN_UPDATE_USER_FAIL,
                payload: error.response && error.response.data.detail 
                    ? error.response.data.detail 
                    : error.message,
            }) 
        }
    }
}
