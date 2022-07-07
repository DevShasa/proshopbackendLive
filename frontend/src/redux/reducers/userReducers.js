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
    USER_UPDATE_PROFILE_RESET,
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
    USER_DELETE_RESET,
    ADMIN_GET_USER_REQUEST,
    ADMIN_GET_USER_SUCCESS,
    ADMIN_GET_USER_FAIL,
    ADMIN_UPDATE_USER_REQUEST,
    ADMIN_UPDATE_USER_SUCCESS,
    ADMIN_UPDATE_USER_FAIL,
    ADMIN_UPDATE_USER_RESET,
} from '../constants/userConstants'

export const userLoginReducer = ( state={loggedIn:false,userInfo:false }, action) =>{
    // state = {loading, userinfo, error}
    switch(action.type){
        case USER_LOGIN_REQUEST:
            return {
                ...state,
                loading: true 
            }
        case USER_LOGIN_SUCCESS:
            return {    
                loading: false, 
                userInfo: action.payload, 
                loggedIn: true
            }
        case USER_LOGIN_FAIL:
            return { 
                loading:false, 
                error: action.payload, 
                loggedIn:false,
                userInfo:false 
            }
        case USER_LOGOUT:
            return {
                loggedIn: false,
                userInfo:false 
            }
        default:
            return state
    }
}

export const userRegisterReducer = (state={}, action)=>{
    switch(action.type){
        case USER_REGISTER_REQUEST:
            return {loading: true}
        case USER_REGISTER_SUCCESS:
            return {loading: false, userInfo: action.payload}
        case USER_REGISTER_FAIL:
            return {loading: false, error: action.payload}
        case USER_LOGOUT:
            return {}
        default:
            return state
    }
}

export const userDetailsReducer = (state = {user:{} }, action)=>{
    switch(action.type){
        case USER_DETAIL_REQUEST:
            return {...state, loading: true}
        case USER_DETAIL_SUCCESS:
            return {loading: false, user: action.payload}
        case USER_DETAIL_FAIL:
            return {loading: false, error: action.payload}
        case USER_LOGOUT:
            return {}
        default:
            return state
    }
}

export const userUpdateProfileReducer = (state = {}, action)=>{
    switch(action.type){
        case USER_UPDATE_PROFILE_REQUEST:
            return {loading: true}
        case USER_UPDATE_PROFILE_SUCCESS:
            return {loading: false, userInfo: action.payload, success:true}
        case USER_UPDATE_PROFILE_FAIL:
            return {loading: false, error: action.payload}
        case USER_UPDATE_PROFILE_RESET:
            return {}
        default:
            return state
    }
}

export const adminUserListReducer = (state = {adminUserList:[]}, action )=>{
    switch(action.type){
        case USER_LIST_REQUEST:
            return {
                adminUserListLoading: true
            }
        case USER_LIST_SUCCESS:
            return {
                adminUserListLoading: false,
                adminUserList: action.payload
            }
        case USER_LIST_FAIL:
            return {
                adminUserListLoading: false,
                adminUserRequestError: action.payload
            }
        case USER_LIST_RESET:
            return {
                adminUserList:[]
            }
        default:
            return state
    }
}

export const userDeleteReducer = (state = {userDeleteSuccess:false}, action)=>{
    switch(action.type){
        case USER_DELETE_REQUEST:
            return{
                ...state,
                userDeleteLoading: true
            }
        case USER_DELETE_SUCCESS:
            return{
                userDeleteLoading: false,
                userDeleteSuccess: true
            }
        case USER_DELETE_FAIL:
            return{
                userDeleteLoading: false,
                userDeleteError: action.payload
            }
        case USER_DELETE_RESET:
            return{
                userDeleteSuccess:false
            }
        default:
            return state
    }
}

export const adminGetUserReducer = (state = {user:{} }, action)=>{
    switch(action.type){
        case ADMIN_GET_USER_REQUEST:
            return {...state, loading: true}
        case ADMIN_GET_USER_SUCCESS:
            return {loading: false, user: action.payload}
        case ADMIN_GET_USER_FAIL:
            return {
                ...state,
                loading: false, 
                error: action.payload}
        case USER_LOGOUT:
            return {
                user:{}
            }
        default:
            return state
    }
}

export const adminUpdateUserReducer = (state={success:false,}, action) =>{
    switch(action.type){
        case ADMIN_UPDATE_USER_REQUEST:
            return{...state, updateloading: true }
        case ADMIN_UPDATE_USER_SUCCESS:
            return{updateloading:false, success:true, newUserDetails: action.payload}
        case ADMIN_UPDATE_USER_FAIL:
            return {updateloading: false,success: false, userUpdateError: action.payload}
        case ADMIN_UPDATE_USER_RESET:
            return {success:false}
        default:
            return state
    }
}
