import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
    CART_CLEAR_ITEMS
} from '../constants/cartConstants';

export const cartReducer = (state = {cartItems:[], shippingAddress:{}}, action) =>{

    switch(action.type){
        case CART_ADD_ITEM:
            // item looks something like this 
            //  {product: "product_name", data:{id:1, name:"prd1"}}
            const action_item = action.payload
            // if item exists it is loaded into  item_if_exists
            const item_if_exists = state.cartItems.find(x => x.product === action_item.product)

            if(item_if_exists){
                return{
                    ...state,
                    cartItems: state.cartItems.map(x => 
                        x.product  === item_if_exists.product 
                            ? action_item // replace old productobject with new productobject
                            : x 
                    )
                }
            }else{
                return {
                    ...state, 
                    cartItems:[...state.cartItems, action_item]
                } 
            }
        case CART_REMOVE_ITEM:
            return{
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            }
        case CART_SAVE_SHIPPING_ADDRESS:
            return{
                ...state,
                shippingAddress: action.payload
            }
        case CART_SAVE_PAYMENT_METHOD:
            return{
                ...state,
                paymentMethod: action.payload
            }
        case CART_CLEAR_ITEMS:
            return {
                ...state,
                cartItems:[]
            }
        default:
            return state
        
        
    }
}