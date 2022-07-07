import axios from 'axios';
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    FETCH_ORDER_DETAILS_REQUEST,
    FETCH_ORDER_DETAILS_SUCCESS,
    FETCH_ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    LIST_MY_ORDER_REQUEST,
    LIST_MY_ORDER_SUCCESS,
    LIST_MY_ORDER_FAIL,
    LIST_ALL_ORDERS_REQUEST,
    LIST_ALL_ORDERS_SUCCESS,
    LIST_ALL_ORDERS_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL,
} from '../constants/orderConstants'
import { CART_CLEAR_ITEMS } from '../constants/cartConstants';

export const createOrder = (order_object) =>{
    return async(dispatch, getState) =>{
        try{
            dispatch({
                type: ORDER_CREATE_REQUEST
            })

            // Get the user's token ans create header
            const { userLogin:{userInfo:{token}} } = getState()
            const config = {
                headers:{
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${token}`
                }}

            // Send the data
            const response = await axios.post(
                '/api/orders/add/',
                order_object,
                config
            )

            dispatch({
                type: ORDER_CREATE_SUCCESS,
                payload: response.data
            })

            dispatch({
                type: CART_CLEAR_ITEMS,
            })
            localStorage.removeItem("cartItems")
        
        }catch(error){
            dispatch({
                type:ORDER_CREATE_FAIL,
                payload: error.response && error.response.data.detail 
                    ? error.response.data.detail 
                    : error.message,
            })
        }
    }
}
export const getOrderDetails = (id) =>{
    return async (dispatch, getState)=>{
        try{
            dispatch({type:FETCH_ORDER_DETAILS_REQUEST})

            const {userLogin:{userInfo:{token}}} = getState()
            const config = {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }

            const response = await axios.get(`/api/orders/${id}`,config)
            dispatch({
                type:FETCH_ORDER_DETAILS_SUCCESS,
                payload: response.data
            })

        }catch(error){
            dispatch({
                type:FETCH_ORDER_DETAILS_FAIL,
                payload: error.response && error.response.data.detail 
                    ? error.response.data.detail 
                    : error.message,
            })
        }
    }
}

export const payOrder = (id, paymentToken) =>{
    return async (dispatch, getstate)=>{
        try{
            dispatch({
                type: ORDER_PAY_REQUEST
            })
            const { userLogin:{userInfo:{token}} } = getstate()
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            }
            const response = await axios.put(
                `/api/orders/${id}/pay/`,
                paymentToken,
                config
            )
            
            dispatch({ 
                type:ORDER_PAY_SUCCESS,
                payload: response.data
            })
            console.log(paymentToken)
        }catch(error){
            dispatch({
                type:ORDER_PAY_FAIL,
                payload: error.response && error.response.data.detail 
                    ? error.response.data.detail 
                    : error.message,
            })
        }
    }
}

export const fetchMyOrders = () =>{
    return async (dispatch, getState) =>{
        try{
            dispatch({type: LIST_MY_ORDER_REQUEST})

            // Get the token
            const { userLogin:{userInfo:{token}} } = getState()
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            }

            // Get the user's orders
            const response = await axios.get(
                '/api/orders/myorders/',
                config
            )
            
            // Update userOrderReducer
            dispatch({
                type: LIST_MY_ORDER_SUCCESS,
                payload: response.data
            })

        }catch(error){
            dispatch({
                type:LIST_MY_ORDER_FAIL,
                payload: error.response && error.response.data.detail 
                    ? error.response.data.detail 
                    : error.message,
            })
        }
    }
}

export const listAllProductsAction = () => async (dispatch, getState) =>{
    try{
        dispatch({type: LIST_ALL_ORDERS_REQUEST})

        const { userLogin:{userInfo:{token}} } = getState()
        const config = {
            headers:{
                'Content-type': 'application/json',
                Authorization: 'Bearer '+ token
            }
        }

        const response = await axios.get('/api/orders', config)

        dispatch({
            type: LIST_ALL_ORDERS_SUCCESS,
            payload: response.data
        })

    }catch(error){
        dispatch({
            type: LIST_ALL_ORDERS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message
        })
    }
}

export const markOrderAsDelivered= (id) => {
    return async (dispatch, getState) => {
        try{
            dispatch({type: ORDER_DELIVER_REQUEST})
            
            const { userLogin:{userInfo:{token}} } = getState()
            const config = {
                headers:{
                    'Content-type': 'application/json',
                    Authorization: 'Bearer '+ token
                }
            }
            
            const response = await axios.put(
                `/api/orders/${id}/deliver/`,
                {},
                config
            )

            dispatch({
                type: ORDER_DELIVER_SUCCESS,
                payload: response.data
            })

        }catch(error){
            dispatch({
                type: ORDER_DELIVER_FAIL,
                payload: error.response && error.response.data.detail 
                ? error.response.data.detail 
                : error.message
            })
        }
    }
}