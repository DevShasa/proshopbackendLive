import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from "react-bootstrap"; 
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch, useSelector } from "react-redux"; 
import { Login } from "../redux/actions/userActions";
import FormContainer from '../components/FormContainer';

const LoginScreen = ({location, history }) =>{



    // the user may be redirected from some other previous location
    // if there is no redirect from preious location user will be redirected ...
    // to homescreen upon logging in 
    const redirect = location.search ? location.search.split("=")[1] : '/'

    // Redux imports 
    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo, loading, error } = userLogin

    const [viewpassword, setViewPassword] = useState(false)
    const [loginData, setloginData] = useState({
        email: '',
        password: ''
    })

    useEffect(()=>{
        if(userInfo){
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const handleChange = (e) => {
        setloginData({ ...loginData,  [e.target.name]: e.target.value })
    }

    const submitHandler = (e) =>{
        // login will update userinfo reducer
        e.preventDefault()
        dispatch(Login(loginData.email, loginData.password))
    }

    return(
        <FormContainer>
            <h1>Sign in </h1>
            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader/>}
            <Form onSubmit = {submitHandler}> 
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type = "email"
                        placeholder = "Enter Email"
                        value = {loginData.email}
                        onChange = {handleChange}
                        name = "email"
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type = {viewpassword ? "text" : "password"}
                        placeholder = "Enter Your Password"
                        value = {loginData.password}
                        onChange = {handleChange}
                        name = 'password' 
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mt-2">
                    <Form.Check 
                        label = {viewpassword ? "Hide Password" : "View Password"}
                        type="checkbox"
                        value = {viewpassword}
                        onChange = {()=>setViewPassword(!viewpassword)}
                    />
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-2">Sign In</Button>
            </Form>
            <Row className='py-3'>
                <Col>
                    {/* pass on the redirect so the user can be redirected to shopping cart or previous location */}
                    New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}
export default LoginScreen;