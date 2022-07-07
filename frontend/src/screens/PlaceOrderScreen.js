import React, { useEffect } from 'react';
import {Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap"; 
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; 
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import { createOrder } from "../redux/actions/orderActions";
import { ORDER_CREATE_RESET } from "../redux/constants/orderConstants";

const PlaceOrderScreen = (props)=>{

    // if success is true, order has been sucessfuly saved to database...
    // ..push the user to the final checkout page, which fetches the new order from db 
    const { order, error, success } = useSelector(state=> state.orderCreate)

    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)

    // Calculate totalprice, tax and shipping
    const itemsPrice = cart.cartItems
                            .reduce((accumulator, item)=> accumulator + item.price * item.qty, 0)
                            .toFixed(2)
    const shippingPrice = (itemsPrice > 100 ? 0 : 10).toFixed(2)
    const taxPrice = ((0.082)* itemsPrice).toFixed(2)
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2)

    // If there is no payment method redirect back to payment screen 
    if(!cart.paymentMethod){
        props.history.push('/payment')
    }

    useEffect(()=>{
        if(success){
            // Redirect the user to the order page 
            props.history.push(`/order/${order._id}`)
            // Order has been created successfully therefore clear orderCreducer
            dispatch({type: ORDER_CREATE_RESET})
        }
    },[success, props.history, dispatch]) // eslint-disable-line 
    // adding order.id causes an error because the object does not exist until created

    const placeOrder = ()=>{
        dispatch(createOrder({
            orderItems: cart.cartItems,
            paymentMethod: cart.paymentMethod,
            taxPrice: taxPrice,
            totalPrice: totalPrice,
            shippingAddress: {...cart.shippingAddress, shippingPrice:shippingPrice}
        }))
    }

    return(
        <div>
            <CheckoutSteps step1 step2 step3 step4/>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Shipping: </strong>
                                {cart.shippingAddress.address}{', '}
                                {cart.shippingAddress.city}{', '}
                                {cart.shippingAddress.postalCode}{', '}
                                {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Pay Via: </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0 
                                ? <Message variant="info">Your Cart is Empty</Message>
                                : (
                                    <ListGroup variant="flush">
                                        {cart.cartItems.map((item, index)=>(
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded/>
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )
                            }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <h2>Totals</h2>
                    <Card className='mt-4'>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                Order summary
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items: </Col>
                                    <Col>${itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping: </Col>
                                    <Col>${shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax: </Col>
                                    <Col>${taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total: </Col>
                                    <Col>${totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {error &&(
                                <ListGroup.Item>
                                    <Message variant='danger'>{error}</Message>
                                </ListGroup.Item>
                            )}
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    style = {{width: '100%'}}
                                    disabled = {cart.cartItems===0}
                                    onClick={placeOrder}
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
export default PlaceOrderScreen 
