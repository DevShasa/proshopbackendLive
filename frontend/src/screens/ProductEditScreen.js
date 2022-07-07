import React, {useState, useEffect} from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { productDetailRequest, editProductAction } from '../redux/actions/productActions';
import { PRODUCT_EDIT_RESET } from '../redux/constants/productConstants';

const ProductEditScreen = (props) =>{

    const productID = props.match.params.id
    
    const [ name, setName ] = useState("")
    const [ brand, setBrand ] = useState("")
    const [ category, setCategory ] = useState("")
    const [ description, setDescription ] = useState("")
    const [ price, setPrice ] = useState(0)
    const [ countInStock, setCountInStock ] = useState(0)
    const [ image, setImage ] = useState("")
    const [ adminError, setAdminError ] = useState(false)
    const [updated, setIsUpdated] = useState(false)
    const [uploading, seUploading] = useState(false)

    const dispatch = useDispatch()

    const { userInfo } = useSelector(state => state.userLogin)
    const { loading, product, error } = useSelector(state => state.productDetail)
    const { editSuccess, editError,  editLoading} = useSelector(state=> state.editProduct)

    useEffect(()=>{
        if(!userInfo){
            // is user loggedin? 
            props.history.push(`/login?redirect=admin/product/${productID}/edit`)
        }else {
            // is user an admin? 
            if(!userInfo.isAdmin){
                setAdminError(true)
            }else{
                if(editSuccess){setIsUpdated(true)}
                // product exists and matches the id passed in url
                if(!product.name || product._id !== Number(productID) || editSuccess){
                    // if there is no product name, nothing in the redux store
                    // if the product id in the redux store does not match id passed in url
                    // if there has been a sucessful edit (editSuccess), refetch new data
                    dispatch({type: PRODUCT_EDIT_RESET}) // empty the redux store
                    dispatch(productDetailRequest(productID)) // fetch updated data using productID
                }else{
                    setName(product.name)
                    setBrand(product.brand)
                    setCategory(product.category)
                    setDescription(product.description)
                    setPrice(product.price)
                    setCountInStock(product.countInStock)
                    setImage(product.image)
                }
            }
        }
    },[product, dispatch,productID, props, userInfo, editSuccess])

    function submitHandler(e){
        e.preventDefault()
        const newData = {
            name,
            brand, 
            category, 
            image, 
            price, 
            countInStock: Number(countInStock), 
            description
        }
        // console.log(newData)
        dispatch(editProductAction(productID, newData))
    }

    async function uploadFileHandler (e){ 
        const file = e.target.files[0]
        const formData = new FormData()
        
        // creates a key value pair
        formData.append('newProductImage', file)
        formData.append('product_id', productID) 

        seUploading(true)

        try{
            const config = { headers:{ 'Content-Type': 'multipart/form-data' }}
            const { data } = await axios.post( '/api/products/upload/', formData, config )
            console.log(formData)

            setImage(data)
            seUploading(false)

        }catch(error){
            seUploading(false)
        }
    }   

    return(
        <div>
            <h1>Edit Product</h1>
            <Link to="/admin/productlist">go back</Link>

            {editError && <Message variant="danger">{editError}</Message>}

            {loading
                ? <Loader />
                : error
                ? <Message variant = "danger">{error}</Message>
                : adminError
                ? <Message variant = "danger">Not Authorised to access this page</Message>
                : editLoading
                ? <Loader />
                : (
                    <FormContainer>
                        {updated && (
                            <Message variant="primary">
                                Product updated {` `}
                                <Link to="/admin/productlist"> go back</Link>
                            </Message>
                        )}
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='name' className="mt-2">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type = "text"
                                    placeholder = "Enter Name"
                                    value = {name}
                                    onChange = {(e) => setName(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='brand' className="mt-2">
                                <Form.Label>Brand</Form.Label>
                                <Form.Control
                                    type = "text"
                                    placeholder = "Enter Brand"
                                    value = {brand}
                                    onChange = {(e) => setBrand(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='category' className="mt-2">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type = "text"
                                    placeholder = "Enter Category"
                                    value = {category}
                                    onChange = {(e) => setCategory(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            
                            <Form.Group controlId='description' className="mt-2">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type = "text"
                                    placeholder = "Enter Cescription"
                                    value = {description}
                                    onChange = {(e) => setDescription(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='price' className="mt-2">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type = "number"
                                    placeholder = "Enter price"
                                    value = {price}
                                    onChange = {(e) => setPrice(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            
                            <Form.Group controlId='countInStock' className="mt-2">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type = "number"
                                    placeholder = "Enter stock"
                                    value = {countInStock}
                                    onChange = {(e) => setCountInStock(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='image' className="mt-2">
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type = "text"
                                    placeholder = "Enter Image"
                                    value = {image}
                                    disabled
                                    readOnly
                                >
                                </Form.Control>
                                <Form.Control
                                    type = "file"
                                    // id='image-file'
                                    label = 'Choose File'
                                    custom = "true"
                                    onChange = {uploadFileHandler}
                                ></Form.Control>
                                {uploading && <Loader/>}
                            </Form.Group>
                            
                            <Button variant="primary" type="submit" className="mt-2">
                                Update 
                            </Button>
                        </Form>
                    </FormContainer>
                )
            }
        </div>
    )

}
export default ProductEditScreen;