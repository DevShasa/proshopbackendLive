import axios from 'axios';
import { CART_ADD_ITEM,
        CART_REMOVE_ITEM,
        CART_SAVE_SHIPPING_ADDRESS,
        CART_SAVE_PAYMENT_METHOD
    } from '../constants/cartConstants'

export const addToCart= (id, quantity) => async(dispatch, getState) =>{
    const response =  await axios.get(`/api/products/${id}`)

    // yeet the data cartReducer
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: response.data._id, 
            name: response.data.name,
            image: response.data.image,
            price: parseFloat(response.data.price),
            countInStock: response.data.countInStock,
            qty: Number(quantity) 
        }
    })

    // Save data into localstorage 
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (p_id) => 
    async(dispatch, getState)=>{
        // This will update state
        dispatch({
            type: CART_REMOVE_ITEM,
            payload: p_id
        })

        // Update localstorage from redux store
        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
    } 


export const saveShippingAddress = (data) =>{
    return (dispatch)=>{
        dispatch({
            type: CART_SAVE_SHIPPING_ADDRESS,
            payload: data
        })

        localStorage.setItem('shippingAddress', JSON.stringify(data))
    }
} 

export const savePaymentMethod = (paymentMethod) =>{
    return (dispatch)=>{
        dispatch({
            type: CART_SAVE_PAYMENT_METHOD,
            payload: paymentMethod
        })
        localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod))
    }
}