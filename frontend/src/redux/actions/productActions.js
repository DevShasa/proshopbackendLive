import axios from 'axios';
import { 
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAIL_REQUEST,
    PRODUCT_DETAIL_SUCCESS,
    PRODUCT_DETAIL_FAIL,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,
    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,
    PRODUCT_EDIT_REQUEST,
    PRODUCT_EDIT_SUCCESS,
    PRODUCT_EDIT_FAIL,
    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,
    GET_TOP_PRODUCTS_REQUEST,
    GET_TOP_PRODUCTS_SUCCESS,
    GET_TOP_PRODUCTS_FAIL,
} from '../constants/productConstants'

export const listProducts = (searchParams ='') => async (dispatch)=> {
    try{
        dispatch({
            type: PRODUCT_LIST_REQUEST
        })

        // if keyword localhost:8000/api/products?keyword=phones
        const response = await axios.get(`/api/products${searchParams}`)
        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: response.data
        })
    }catch(error){
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: error.response && error.response.data.detail 
                        ? error.response.data.detail 
                        : error.message ,
        })
    }
}

export const getTopProducts = ()=>{
    return async (dispatch)=> {
        try{
            dispatch({type: GET_TOP_PRODUCTS_REQUEST})

            const response = await axios.get('/api/products/top/')
            dispatch({
                type: GET_TOP_PRODUCTS_SUCCESS,
                payload: response.data
            })

        }catch(error){
            dispatch({
                type:GET_TOP_PRODUCTS_FAIL,
                payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message
            })
        }
    }
}

export const productDetailRequest = (id) =>
    async (dispatch) =>{
        try{
            dispatch({
                type: PRODUCT_DETAIL_REQUEST
            })

            const response = await axios.get(`/api/products/${id}`)
            dispatch({
                type: PRODUCT_DETAIL_SUCCESS,
                payload: response.data
            })
        } catch (error){
            dispatch({
                type:PRODUCT_DETAIL_FAIL,
                payload: error.response && error.response.data.detail 
                // return Response({'detail': 'No Order Items'},  status=status.HTTP_400_BAD_REQUEST)
                    ? error.response.data.detail 
                    : error.message ,
            })
        }
    }

export const deleteProductAction = (id) =>{
    return async(dispatch, getState) =>{
        try{
            dispatch({type:PRODUCT_DELETE_REQUEST})

            const { userLogin:{userInfo:{token}} } = getState()
            const config = {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }

            const response = await axios.delete(
                `/api/products/delete/${id}`,
                config
            )

            dispatch({
                type:PRODUCT_DELETE_SUCCESS,
                payload: response.data
            })

        }catch(error){
            dispatch({
                type:PRODUCT_DELETE_FAIL,
                payload: error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.response
            })
        }
    }
}

export const createProductAction = () => async (dispatch, getState) => {
    try{
        dispatch({type:PRODUCT_CREATE_REQUEST})

        const { userLogin:{userInfo:{token}} } = getState()
        const config = {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }
        
        // The server will create a template product
        // product list page will then redirect to edit page where details can be changed
        const response = await axios.post( `/api/products/create/`, {}, config )

        dispatch({
            type: PRODUCT_CREATE_SUCCESS,
            payload: response.data
        })

    }catch(error){
        dispatch({
            type:PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.response
        })
    }
}

export const editProductAction = (id, newData) => async (dispatch, getState) =>{
    try{
        dispatch({type:PRODUCT_EDIT_REQUEST})

        const { userLogin:{userInfo:{token}} } = getState()
        const config = {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }

        const response = await axios.put(
            `/api/products/update/${id}/`,
            newData,
            config
        )

        dispatch({
            type:PRODUCT_EDIT_SUCCESS,
            payload: response.data
        })

        // update the Product Detail Reducer directly instead...
        // ..of requesting an update from frontend
        // dispatch({
        //     type: PRODUCT_DETAIL_SUCCESS,
        //     payload: response.data
        // })

    }catch(error){
        dispatch({
            type:PRODUCT_EDIT_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.response
        })
    }
}

export const createNewReview = (product_id, review) => async (dispatch, getState) =>{
    try{
        dispatch({type:PRODUCT_CREATE_REVIEW_REQUEST})

        const { userLogin:{userInfo:{token}} } = getState()
        const config = {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }

        const response = await axios.post(
            `/api/products/${product_id}/review/`,
            review,
            config
        )

        dispatch({
            type:PRODUCT_CREATE_REVIEW_SUCCESS,
            payload: response.data
        })

    }catch(error){
        dispatch({
            type:PRODUCT_CREATE_REVIEW_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.response
        })
    }
}