import React, { useState } from 'react';
import { Form, Button, Col,} from "react-bootstrap"; 
import { useDispatch, useSelector } from "react-redux"; 
import { savePaymentMethod } from "../redux/actions/cartActions";
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';

// User selects payment method 
export const PaymentScreen = (props)=>{
    const { shippingAddress, paymentMethod} = useSelector(state=> state.cart)
    const dispatch = useDispatch()

    if(!shippingAddress.address){
        props.history.push('/shipping')
    }

    const [payment, setPayment] = useState(paymentMethod ? paymentMethod : '')
    const [message, setMessage] = useState('')


    const submitHandler = (e)=>{
        e.preventDefault()
        if(payment === ''){
            setMessage('Please select payment method')
        }else{
            dispatch(savePaymentMethod(payment))
            props.history.push('/placeorder')
            setMessage('')
        }

    }

    return(
        <FormContainer>
            <CheckoutSteps step1 step2 step3/>
            <Form onSubmit={submitHandler}>
                <Form.Group >
                    {message &&(<Message variant="warning">{message}</Message>)}

                    <Form.Label as="legend">Select Payment Method</Form.Label>
                    <Col>
                        <Form.Check
                            type='radio'
                            label="Paypal"
                            id = 'paypal'
                            name = 'payment'
                            value = "Paypal"
                            defaultChecked = {paymentMethod === "Paypal"}
                            onChange={(e)=>setPayment(e.currentTarget.value)}
                        >
                        </Form.Check>
                    </Col>
                    <Col>
                        <Form.Check
                            type='radio'
                            label="Mpesa"
                            id = 'mpesa'
                            name = 'payment'
                            value = "Mpesa"
                            defaultChecked = {paymentMethod === "Mpesa"}
                            onChange={(e)=>setPayment(e.currentTarget.value)}
                        >
                        </Form.Check>
                    </Col>
                </Form.Group>
                <Button type="submit" variant="primary">
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen;