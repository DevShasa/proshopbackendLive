import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listAllProductsAction } from "../redux/actions/orderActions";


export const OrderListScreen = (props) =>{

    const dispatch = useDispatch()
    const { ordersLoading, orders, ordersError} = useSelector(state =>state.allOrders)
    const { userInfo } = useSelector(state => state.userLogin)

    useEffect(() =>{
        if(!userInfo.isAdmin){
            props.history.push('/login')
        }else{
            dispatch(listAllProductsAction())
        }
    },[dispatch, props, userInfo])

    return(
        <div>
            {ordersLoading
                ? <Loader />
                : ordersError
                ? <Message variant="danger">{ordersError}</Message>
                :(
                    
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>USER</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th>VIEW ORDER</th>

                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order =>(
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.user.username}</td>
                                    <td>{order.createdAt.substring(0,10)}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>{order.isPaid
                                        ? <i className='fas fa-check' style={{color: 'green'}}></i>
                                        : <i className='fas fa-xmark' style={{color: 'red'}}></i>}
                                    </td>
                                    <td>{order.isDelivered
                                        ? <i className='fas fa-check' style={{color: 'green'}}></i>
                                        : <i className='fas fa-xmark' style={{color: 'red'}}></i>}
                                    </td>
                                    <td>
                                        <Link to={`/order/${order._id}`}>
                                            <Button className="btn-sm">
                                                Details
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </Table>
                )
            }
        </div>
    )
}
export default OrderListScreen