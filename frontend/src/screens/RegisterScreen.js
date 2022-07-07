import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from "react-bootstrap"; 
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch, useSelector } from "react-redux"; 
import { register } from "../redux/actions/userActions";
import FormContainer from '../components/FormContainer';

const RegisterScreen = ({location, history }) =>{

    // the user may be redirected from some other previous location
    const redirect = location.search ? location.search.split("=")[1] : '/'

    // Redux imports 
    const dispatch = useDispatch()
    const { /*userInfo,*/ loading, error } =  useSelector(state => state.userRegister)

    const [registerData, setRegisterData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: '', 
        message: ''
    })

    const loggedIn = useSelector(state=> state.userLogin)
    useEffect(()=>{
        if(loggedIn.userInfo){
            history.push(redirect)
        }
    }, [history, loggedIn.userInfo, redirect])

    const handleChange = (e) => {
        setRegisterData({ ...registerData,  [e.target.name]: e.target.value })
    }

    const submitHandler = (e) =>{
        e.preventDefault()

        if(registerData.password !== registerData.confirmPassword){
            setRegisterData({
                ...registerData,
                message: "Passwords do not match"
            })
        }else{
            dispatch(register(registerData.name, registerData.email, registerData.password))
        }
        
    }

    return(
        <FormContainer>
            <h1>Register</h1>
            {registerData.message && <Message variant="info">{registerData.message}</Message>}
            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader/>}
            <Form onSubmit = {submitHandler}> 
                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        required 
                        type = "name"
                        placeholder = "Enter Name"
                        value = {registerData.name}
                        onChange = {handleChange}
                        name = "name"
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        required
                        type = "email"
                        placeholder = "Enter Email"
                        value = {registerData.email}
                        onChange = {handleChange}
                        name = "email"
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        required
                        type = "password"
                        placeholder = "Confirm Password"
                        value = {registerData.confirmPassword}
                        onChange = {handleChange}
                        name = 'confirmPassword' 
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='passwordConfirm'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type = "password"
                        placeholder = "Enter Password"
                        value = {registerData.password}
                        onChange = {handleChange}
                        name = 'password' 
                    >
                    </Form.Control>
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-2">Sign In</Button>
            </Form>
            <Row className='py-3'>
                <Col>
                    Have an account? 
                    <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}
export default RegisterScreen;