import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../redux/actions/productActions';
import ProductCarousel from "../components/ProductCarousel";

const HomeScreen = ({history}) =>{

    const dispatch = useDispatch()
    const productList = useSelector(state => state.productList )
    const {error, loading, products, page, pages} = productList

    // Check if there is a search parameter
    // ?page=3, ?keyword=playstation&page=1, ?keyword=playstation
    let searchParams = history.location.search
    console.log("SEARCHPARAMS:> " +searchParams)
    useEffect(()=>{
        dispatch(listProducts(searchParams))
    }, [dispatch, searchParams])

    return(
        <div>
            {!searchParams && <ProductCarousel /> }
            <h1>Latest Products</h1>
            {loading 
                ? <Loader />  // if loading is true do this 
                : error // if loading is false, check whether there is an error
                ? <Message variant ="danger" >{error}</Message>
                // if there is no error
                    :   
                    <div>
                        <Row> 
                            {products.map(p =>(
                                <Col sm={12} md={6} lg={4} xl={3} 
                                    key={p._id}
                                >
                                    <Product product={p} />
                                </Col> 
                            ))}
                        </Row>
                        <Paginate pages ={pages} page={page} searchParams={searchParams}/> 
                    </div>
            }

        </div>
    )
}
export default HomeScreen;