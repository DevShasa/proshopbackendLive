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
    PRODUCT_CREATE_RESET,
    PRODUCT_EDIT_REQUEST,
    PRODUCT_EDIT_SUCCESS,
    PRODUCT_EDIT_FAIL,
    PRODUCT_EDIT_RESET,
    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,
    PRODUCT_CREATE_REVIEW_RESET,
    GET_TOP_PRODUCTS_REQUEST,
    GET_TOP_PRODUCTS_SUCCESS,
    GET_TOP_PRODUCTS_FAIL,
} from '../constants/productConstants';

export const productListReducer = (state ={products:[]}, action )=>{
    switch(action.type){
        case PRODUCT_LIST_REQUEST:
            return {loading:true, products:[]}
        case PRODUCT_LIST_SUCCESS:
            return { 
                        loading:false, 
                        products:action.payload.products,
                        page: action.payload.page,
                        pages: action.payload.pages 
                }
        case PRODUCT_LIST_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}

export const topProductsReducer = (state={ topProducts:[]}, action) => {
    switch(action.type){
        case GET_TOP_PRODUCTS_REQUEST:
            return { 
                ...state,
                loading: true
            }
        case GET_TOP_PRODUCTS_SUCCESS:
            return{
                loading: false,
                topProducts: action.payload
            }
        case GET_TOP_PRODUCTS_FAIL:
            return{
                loading: false, 
                error: action.payload
            }
        default: 
            return state
    }
}

export const productDetailReducer = (state ={ product:{reviews: [], } }, action )=>{
    switch(action.type){
        case PRODUCT_DETAIL_REQUEST:
            return {loading:true, ...state}
        case PRODUCT_DETAIL_SUCCESS:
            // return {loading:false, product:Object.assign(state.product, action.payload)}
            return {
                loading:false, 
                product:{
                    ...state.product,
                    ...action.payload 
                }
            }
        case PRODUCT_DETAIL_FAIL:
            return {loading:false, error:action.payload}
        default:
            return state
    }
}

export const productDeleteReducer = (state = {}, action) =>{
    switch(action.type){
        case PRODUCT_DELETE_REQUEST:
            return {deleteLoading: true}
        case PRODUCT_DELETE_SUCCESS:
            return {
                deleteSuccess: true,
                deleteLoading: false,
                deleteMessage: action.payload
            }
        case PRODUCT_DELETE_FAIL:
            return{
                deleteLoading: false,
                deleteError: action.payload
            }
        default:
            return state
    }
}

export const productCreateReducer = (state = {}, action) => {
    switch (action.type){
        case PRODUCT_CREATE_REQUEST:
            return { createLoading: true }
        case PRODUCT_CREATE_SUCCESS: 
            return {
                createLoading: false,
                createSuccess: true,
                createdProduct: action.payload
            }
        case PRODUCT_CREATE_FAIL:
            return{
                createLoading: false,
                createError: action.payload
            }
        case PRODUCT_CREATE_RESET:
            return{}
        default:
            return state
    }
}

export const productEditReducer = (state = {}, action) =>{
    switch(action.type){
        case PRODUCT_EDIT_REQUEST:
            return {editLoading: true}
        case PRODUCT_EDIT_SUCCESS:
            return {
                editSuccess: true,
                editLoading: false,
                editedProduct: action.payload
            }
        case PRODUCT_EDIT_FAIL:
            return{
                editLoading: false,
                editError: action.payload
            }
        case PRODUCT_EDIT_RESET:
            return {}
        default:
            return state
    }
}

export const productReviewCreateReducer = (state = {}, action) =>{
    switch(action.type){
        case PRODUCT_CREATE_REVIEW_REQUEST:
            return{
                newReviewLoading: true
            }
        case PRODUCT_CREATE_REVIEW_SUCCESS:
            return{
                newReviewLoading: false,
                newReviewSuccess: true
            }
        case PRODUCT_CREATE_REVIEW_FAIL:
            return{
                newReviewLoading: false,
                newReviewError: action.payload
            }
        case PRODUCT_CREATE_REVIEW_RESET:
            return{}
        default:
            return state
    }
}