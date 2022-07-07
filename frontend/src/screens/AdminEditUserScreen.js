import React, {useState, useEffect} from 'react';
import { Button, Form } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { adminGetUserByIdAction, adminUpdateUserAction } from '../redux/actions/userActions';
import FormContainer from '../components/FormContainer';
import { ADMIN_UPDATE_USER_RESET } from "../redux/constants/userConstants";

const AdminEditUserScreen = (props) =>{

    const dispatch = useDispatch()
    const userId = props.match.params.id
    const { loading, user, error } = useSelector(state =>state.adminGetUser)
    const { userInfo } = useSelector(state => state.userLogin)
    const { success, userUpdateError, updateloading } = useSelector(state => state.adminUserUpdate)

    const [ email, setEmail ] = useState("")
    const [ name, setName ] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)
    const [ adminError, setAdminError ] = useState(false)

    useEffect(()=>{
        if(!userInfo){
            // User not logged in 
            props.history.push(`/login?redirect=admin/user/${userId}/edit`)
        }else if(!userInfo.isAdmin){
            // User logged in but not admin
            setAdminError(true)
        }else{
            // User is loggedin and admin 
            if(!user.name || user._id !==  parseInt(userId)  || success){
                // If user does not exist, does not match url id, details have already changed
                dispatch({type: ADMIN_UPDATE_USER_RESET}) 
                dispatch(adminGetUserByIdAction(userId))
            }else{
                setEmail(user.email)
                setName(user.name)
                setIsAdmin(user.isAdmin)
            }
        }
    }, [dispatch, props, userInfo, user, success,userId])

    function submitHandler(e){
        e.preventDefault()
        dispatch(adminUpdateUserAction(
            props.match.params.id,
            { name, email, isAdmin}
        ))
    }

    return(
        <FormContainer>
            <Link to="/admin/userlist">go back</Link>
            {loading 
                ? <Loader />
                : error
                ? <Message>{error}</Message>
                : adminError
                ? <Message>Not authorised to access this page</Message>
                :(<div>
                    <h2>{`Change ${user.name}'s details`}</h2>
                    { updateloading && <Loader />}
                    { userUpdateError && <Message variant="danger">{userUpdateError}</Message>}
                    <Form onSubmit = {submitHandler}>
                        <Form.Group controlId='username' className="mt-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type = "name"
                                placeholder = "Enter Name"
                                value = {name}
                                onChange = {(e) => setName(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='email' className="mt-2">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type = "email"
                                placeholder = "Enter Email"
                                value = {email}
                                onChange = {(e) => setEmail(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="my-3" controlId="Checkbox">
                            <Form.Check 
                                type="checkbox" 
                                label="Admin"
                                checked = {isAdmin} 
                                onChange = {(e) => setIsAdmin(e.currentTarget.checked)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Update
                        </Button>
                    </Form>
                </div>
                )
            }
        </FormContainer>
    )

}

export default AdminEditUserScreen