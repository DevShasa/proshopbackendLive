import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom';
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import {getTopProducts} from "../redux/actions/productActions";


function ProductCarousel() {

    const dispatch = useDispatch()
    const { topProducts, loading, error} = useSelector(state => state.top)

    useEffect(()=>{
        dispatch(getTopProducts())
    },[dispatch])

    return (
        <div>
            {loading
                ? <Loader />
                : error
                ? <Message variant="danger">{error}</Message>
                :(
                    <Carousel pause="hover" className="bg-dark">
                        {topProducts.map((p)=>(
                            <Carousel.Item key = {p._id}>
                                <Link to={`/product/${p._id}`}>
                                    <Image src={p.image} alt={p.name} fluid/>
                                    <Carousel.Caption>
                                        <h4>{p.name} ${p.price}</h4>
                                    </Carousel.Caption>
                                </Link>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )
            }
        </div>
    )
}

export default ProductCarousel