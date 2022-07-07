import React, {useState, useEffect} from 'react';
// import { Link } from 'react-router-dom';
import { Form, Button, Row, Col, Alert,  Table} from "react-bootstrap"; 
import { LinkContainer } from "react-router-bootstrap";
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch, useSelector } from "react-redux"; 
import { getUserDetails, updateUserProfile } from "../redux/actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../redux/constants/userConstants";
import { fetchMyOrders } from "../redux/actions/orderActions";

const ProfileScreen = ({ history}) =>{

        // Redux imports 
        const dispatch = useDispatch()


        const [ email, setEmail ] = useState('')
        const [ name, setName ] = useState('')
        const [ password, setPassword ] = useState('')
        const [ confirmPassword, setConfirmPassword ] = useState('')
        const [ message, setMessage ] = useState('')
        const [editProfile, setEditProfile] = useState(false)

        // Data from userDetails reducer, which is updated when this component loads
        const { user, loading, error } =  useSelector(state => state.userDetails)
        // Data from userLogin reducer to make sure that user  is logged in before any changes
        const { userInfo } = useSelector(state => state.userLogin)
        // Data from the userUpdate reducer which gets updated when user update request is successful
        const { success } = useSelector(state => state.userUpdate)
        const { ordersLoading, ordersList, ordersError } = useSelector(state => state.userOrders)

        useEffect(()=>{
            // Not logged in 
            if(!userInfo){
                history.push('/login')
            }else{
                // user is logged in, check the userdetails reducer and updateprofilereducer
                if(!user || !user.name || success){
                    dispatch({
                        // clean the userUpdate reducer which, holds update response from db
                        type: USER_UPDATE_PROFILE_RESET
                    })
                    // Fetch current data
                    dispatch(getUserDetails('profile'))
                    // Fetch user's order details, update redux 
                    dispatch( fetchMyOrders() )
                }else{
                    setEmail(user.email)
                    setName(user.name)
                }
            }
        }, [dispatch, history, user, userInfo, success])
    
    
        const submitHandler = (e) =>{
            e.preventDefault()
            if(password !== confirmPassword){
                setMessage('The passwords do not match')
            }else{
                // dispatch data to backend
                dispatch(updateUserProfile({
                    // 'id': user._id,
                    'name': name,
                    'email': email,
                    'password': password
                }))
                setMessage('')
            }
            
        }
    
        return(
            <Row>
                <Col md={3}>
                    <h2>User Profile</h2>
                    {message && <Message variant="info">{message}</Message>}
                    {error && <Message variant="danger">{error}</Message>}
                    {loading && <Loader/>}
                    {editProfile
                        ? (
                            <Form onSubmit = {submitHandler}> 
                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    required 
                                    type = "name"
                                    placeholder = "Enter Name"
                                    value = {name}
                                    onChange = {(e) => setName(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='email'>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    required
                                    type = "email"
                                    placeholder = "Enter Email"
                                    value = {email}
                                    onChange = {(e) => setEmail(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='password'>
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type = "password"
                                    placeholder = "Confirm Password"
                                    value = {confirmPassword}
                                    onChange = {(e) => setConfirmPassword(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='passwordConfirm'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type = "password"
                                    placeholder = "Enter Password"
                                    value = {password}
                                    onChange = {(e) => setPassword(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            <Button type="submit" variant="primary" className="mt-2">Change Details</Button>
                        </Form>
                        ):
                        (
                            <div>
                                <p>Name</p>
                                <Alert variant='dark'>{name}</Alert>
                                <p>Email</p>
                                <Alert variant='dark'>{email}</Alert>
                                <Button 
                                    variant="primary"
                                    onClick = {() => setEditProfile(true)}
                                >
                                    Update Profile
                                </Button>
                            </div>
                        )
                    }

                </Col>
                <Col md={9}>
                    <h2>My Orders</h2>
                    {ordersLoading
                        ? <Loader />
                        : ordersError
                        ? <Message variant='danger'> {ordersError}</Message>
                        : ordersList.length === 0 
                        ? <Message variant='info'>You have no orders</Message>
                        : (<Table striped responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>DATE</th>
                                    <th>TOTAL</th>
                                    <th>PAID</th> 
                                    <th>DELIVERED</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersList.map(order=> (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.createdAt.substring(0,10)}</td>
                                        <td>{order.totalPrice}</td>
                                        <td>{order.isPaid ? "Order Paid" : "Not Paid"}</td>
                                        <td>{order.isDelivered ? "Delivered" : "Not Delivered"}</td>
                                        <td>
                                            <LinkContainer to = {`/order/${order._id}`} >
                                                <Button variant={order.isPaid ? "outline-dark" : "success"}>
                                                    View Order
                                                </Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            </Table>)}
                </Col>
            </Row>
        )
}
export default ProfileScreen