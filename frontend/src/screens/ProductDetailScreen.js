import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Card, Form, } from 'react-bootstrap'
import Rating from '../components/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { productDetailRequest, createNewReview } from '../redux/actions/productActions';
import { addToCart} from '../redux/actions/cartActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../redux/constants/productConstants';

import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductScreen = ({ match, history }) =>{
    const [quantity, setQuantity] = useState(1)
    const [ rating, setRating ] = useState(0)
    const [ comment, setComment ] = useState('')

    const dispatch  = useDispatch()

    const { loading , error, product } = useSelector(state => state.productDetail)
    const { userInfo } = useSelector(state=> state.userLogin)
    const {
        newReviewLoading, 
        newReviewSuccess, 
        newReviewError } = useSelector(state=> state.newProductReview)

    // Use the url to update redux store
    useEffect(()=>{

        if(newReviewSuccess){
            setRating(0)
            setComment('')
            dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
        }
        dispatch(productDetailRequest(match.params.id))
    }, [match.params.id, dispatch, newReviewSuccess, userInfo]) 


    const addToCartHandler =()=>{
        dispatch(addToCart(match.params.id, quantity))
        // history.push(`/cart/${match.params.id}?qty=${quantity}`)
        history.push(`/cart`)
    }

    function submitHandler(e){
        e.preventDefault()
        dispatch(createNewReview(
            match.params.id,
            {rating:Number(rating), comment}
        ))
    }

    return(
        <div>
            <Link to="/" className="btn btn-light my-3">Go Back</Link>
            {loading
                ? <Loader />
                : error 
                ? <Message variant ="danger" >{error}</Message>
                : (<div>
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name} fluid/>
                        </Col>
                        <Col md={3}>
                            <ListGroup variant="flush">

                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'}/>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    Price: ${product.price}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    Description: {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col md={3} className="mt-4">
                            <Card>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>
                                                <strong>
                                                    ${product.price}
                                                </strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>{product.countInStock > 0 ? 'In Stock' : 'Out of stock' }</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Quantity</Col>
                                                <Col className="my-1">
                                                    <Form.Control
                                                        as = "select"
                                                        value = {quantity}
                                                        onChange = {(e) => setQuantity(e.target.value)}
                                                    >
                                                        {
                                                            [...Array(product.countInStock).keys()].map((x) =>(
                                                                <option key={x+1} value={x+1}>{x+1}</option>
                                                            ))
                                                        }
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item> 
                                    )}
                                    <ListGroup.Item>
                                        <Button 
                                        onClick = {addToCartHandler}
                                        className="btn btn-block" 
                                        style={{width: '100%'}} 
                                        type="button"
                                        disabled = {product.countInStock === 0}
                                        >
                                            Add to Cart
                                        </Button> 
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col md={6}>
                            <h4>REVIEWS</h4>
                            {product.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}

                            <ListGroup>
                                {product.reviews.map(review =>(
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} color ="#f8e825"/>
                                        <p>Review created at: {review.createdAt.substring(0, 10)}</p>
                                        <p
                                            style={{
                                                border: "1px solid black",
                                                padding: "5px",
                                                borderRadius: "5px",
                                                borderColor: "grey"
                                            }}
                                        >
                                            {review.comment}
                                        </p>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    {newReviewLoading && <Loader />}
                                    { newReviewSuccess && <Message variant="success">Review submitted sucessfylly</Message>}
                                    { newReviewError && <Message variant="danger">{newReviewError}</Message> }
                                    <h4>Write a review</h4>
                                    {userInfo
                                    ? <Form onSubmit = {submitHandler}>
                                        <Form.Group controlId="rating">
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Control
                                                as='select'
                                                value={rating}
                                                onChange={(e)=> setRating(e.target.value)}
                                            >
                                                <option value=''>Select...</option>
                                                <option value='1'>1 - Poor</option>
                                                <option value='2'>2 - Fair</option>
                                                <option value='3'>3 - Good</option>
                                                <option value='4'>4 - Very Good</option>
                                                <option value='5'>5 - Excellent</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId="comment">
                                            <Form.Label>Review</Form.Label>
                                            <Form.Control
                                                as='textarea'
                                                row='5'
                                                value= {comment}
                                                onChange={(e)=>setComment(e.target.value)}
                                            >
                                            </Form.Control>
                                        </Form.Group>
                                        <Button
                                            disabled={newReviewLoading}
                                            type = 'submit'
                                            variant='primary'
                                            className="mt-2"
                                        >
                                            Submit Comment
                                        </Button>
                                    </Form>
                                    : (
                                        <Message variant="info">
                                            <Link to="/login">Log in </Link>to write a review
                                        </Message>
                                    )
                                    }
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </div>)
            }
        </div>
    )
}
export default ProductScreen;