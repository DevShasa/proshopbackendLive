import React, { useEffect } from 'react';
import { Table, Button, Row, Col } from "react-bootstrap";
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch, useSelector } from "react-redux"; 
import { listProducts,
        deleteProductAction,
        createProductAction
    } from '../redux/actions/productActions';
import { Link } from 'react-router-dom';
import { PRODUCT_CREATE_RESET } from '../redux/constants/productConstants';
import Paginate from "../components/Paginate";
import SearchBox from "../components/SearchBox";


const AdminProductListScreen = (props) =>{ 

    const dispatch = useDispatch()
    const { loading, products, error, pages, page } = useSelector(state => state.productList)
    const { loggedIn, userInfo } = useSelector(state => state.userLogin)
    const { deleteLoading, deleteSuccess, deleteError} = useSelector(state => state.deleteProduct)
    const { createLoading,  createSuccess, createdProduct, createError} = useSelector(state => state.productCreate)

    function createProductHandler(){
        dispatch(createProductAction())
    }

    function deleteHandler(id){
        if(window.confirm('Are you sure you want to delete this product')){
            dispatch(deleteProductAction(id))
        }
    }

    let searchParams = props.history.location.search
    useEffect(()=>{
        
        if(!userInfo.isAdmin) {
            // if user is not admin, redirect to login,
            // if user loggedin login page redirect to homepage
            props.history.push('/login')
        }

        if(createSuccess){
            props.history.push(`/admin/product/${createdProduct._id}/edit`)
        }else{
            // pass on the search paramters if present
            dispatch(listProducts(searchParams))
        }

        dispatch({type: PRODUCT_CREATE_RESET })


    },[dispatch,loggedIn,props, userInfo, deleteSuccess, createSuccess, createdProduct,searchParams])


    return(
        <div>
            <h1>Products</h1>
            <Row>
                <Col md={6}>                
                    <Button className="my-3" onClick={createProductHandler}>
                        <i className="fas fa-plus"></i> Create Product
                    </Button>
                </Col>
                <Col md={6}>
                    <SearchBox isAdmin={true}/>
                </Col>
            </Row>

            {deleteLoading && <Loader />}
            {deleteError && <Message variant="warning">{deleteError}</Message>}

            {createLoading && <Loader />}
            {createError && <Message variant="warning">{createError}</Message>}

            {loading
                ? <Loader />
                : error
                ? <Message variant="info">{error}</Message>
                : userInfo.isAdmin
                ? (
                    <div>
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>BRAND</th>
                                    <th>Category</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product =>(
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.brand}</td>
                                        <td>{product.category}</td>
                                        <td>
                                            <Link to={`/admin/product/${product._id}/edit`}>
                                                <Button className="btn-sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button variant="danger" className="btn-sm" onClick={()=>deleteHandler(product._id) }>
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Paginate page={page} pages={pages} isAdmin={true} searchParams={searchParams} />
                    </div>
                )
            : <Message variant="warning">Page only acessible to admins</Message>
            }
        </div>
    )
}
export default AdminProductListScreen