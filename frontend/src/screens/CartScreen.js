import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Card, Button } from 'react-bootstrap'
import Message from '../components/Message'; 
import { addToCart, removeFromCart } from '../redux/actions/cartActions';

const CartScreen = ({ match, location, history })=>{
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.cart)

    // const productId = match.params.id
    // const quantity = location.search 
    //                     ? parseInt(location.search.split('=')[1]) 
    //                     : 1
    // useEffect(()=>{
    //     if(productId){
    //         // Create a new product
    //         dispatch(addToCart(productId, quantity))
    //     }
    // }, [dispatch, productId, quantity])

    const removeCartItem = (p_id) =>{
        dispatch(removeFromCart(p_id)) 
    }

    const checkoutHandler = ()=>{
        // go to login, however if loggedin will redirect to shipping page
        history.push('/login?redirect=shipping')
    }
    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 
                    ? (
                        <Message variant="info">
                            Your cart is empty <Link to='/'>Go Back</Link>
                        </Message> ) 
                    :(
                        <ListGroup>
                            {cartItems.map(item =>(
                                <ListGroup.Item key={item.product}>
                                    <Row>
                                        <Col md={2}>
                                            <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>
                                        <Col md={3}>
                                            <Link to= {`/product/${item.product}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={2}>
                                            ${item.price}
                                        </Col>
                                        <Col md={3}>
                                            <Form.Control
                                                as = "select"
                                                value = {item.qty}
                                                onChange = {(e) => dispatch(addToCart(item.product, e.target.value))}
                                            >
                                                {
                                                    [...Array(item.countInStock).keys()].map((x) =>(
                                                        <option key={x+1} value={x+1}>{x+1}</option>
                                                    ))
                                                }
                                            </Form.Control>
                                        </Col>
                                        <Col md={2}>
                                            <Button onClick={() => removeCartItem(item.product)}>
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )
                }
            </Col>
            <Col md={4}>
                <h1>Total</h1>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Row>
                                <Col md={6}>
                                    <h4>Items:</h4>
                                </Col>
                                <Col md={6}>
                                    <h4>{cartItems.reduce((acc, item)=>acc + item.qty, 0)} </h4>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col md={6}>
                                        <h4>Total:</h4>
                                </Col>
                                <Col md={6}>
                                    <h4>${cartItems.reduce((acc, item)=>acc + (item.qty * item.price), 0).toFixed(2)}  </h4>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button
                                type = 'button'
                                className = "btn-block"
                                style = {{width:"100%"}}
                                disabled = {cartItems.length === 0}
                                onClick = {checkoutHandler}
                            >
                                Proceed to checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}
export default CartScreen