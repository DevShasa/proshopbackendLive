import React, { useState,  } from 'react';
import { Form, Button } from "react-bootstrap"; 
import { useDispatch, useSelector } from "react-redux"; 
import { saveShippingAddress } from "../redux/actions/cartActions";
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = (props) =>{

    const { shippingAddress } = useSelector(state =>state.cart)

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)

    const dispatch = useDispatch()

    const submithandler =(e)=>{
        e.preventDefault()
        dispatch(saveShippingAddress({
            address: address,
            city: city,
            postalCode: postalCode,
            country: country
        }))
        props.history.push('/payment')
    }

    return(
        
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>Shipping Address</h1>
            <Form onSubmit={submithandler}>
                <Form.Group controlId='address'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        required 
                        type = "Address"
                        placeholder = "Enter Address"
                        value = {address ? address : ''}
                        onChange = {(e)=>setAddress(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='city'>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                        required 
                        type = "City"
                        placeholder = "Enter City"
                        value = {city ? city : ''}
                        onChange = {(e)=>setCity(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='postalCode'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                        required 
                        type = "Postal Code"
                        placeholder = "Enter Postal Code"
                        value = {postalCode ? postalCode : ''}
                        onChange = {(e)=>setPostalCode(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='country'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        required 
                        type = "Country"
                        placeholder = "Enter Country"
                        value = {country ? country : ''}
                        onChange = {(e)=>setCountry(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-2">Continue to checkout</Button>
            </Form>
        </FormContainer>
    )
}
export default ShippingScreen