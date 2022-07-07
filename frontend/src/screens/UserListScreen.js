import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button} from "react-bootstrap"; 
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch, useSelector } from "react-redux"; 
import { adminFetchUserList, deleteUserAction } from "../redux/actions/userActions";
import { USER_DELETE_RESET } from "../redux/constants/userConstants";

const UserListScreen=()=>{

    const [deleteAlert,  setDeleteAlert] = useState(null)

    const dispatch = useDispatch()
    const { 
            adminUserListLoading, 
            adminUserList, 
            adminUserRequestError
        } = useSelector(state => state.adminUserDisplay)
    
    // Is the user Logged in 
    const { loggedIn } = useSelector(state => state.userLogin)
    // Check whether user has been deleted]
    const { userDeleteSuccess } = useSelector(state => state.deleteUser)

    useEffect(()=>{
        if(loggedIn){
            // if not admin server will issue an error 
            dispatch(adminFetchUserList())
            if(userDeleteSuccess){
                dispatch({type:USER_DELETE_RESET})
            }
        }

    },[dispatch, loggedIn, userDeleteSuccess])

    const deleteHandler = (id, email) =>{
        if(window.confirm('Are you sure you want to delete this user')){
            dispatch(deleteUserAction(id))
            setDeleteAlert(`User ${email} deleted sucessfully`)
        }
    }

    return(
        <div>
            <h1>Users</h1>
            {adminUserListLoading 
            ? <Loader />
            : adminUserRequestError
            ? <Message variant="info">{adminUserRequestError}</Message>
            : !loggedIn
            ? <Message variant="warning">You need to log in to perform that action</Message>
            : (<div>
                {deleteAlert && <Message variant="success">{deleteAlert}</Message>}
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>EMAIL</th>
                            <th>NAME</th>
                            <th>USERNAME</th> 
                            <th>ADMIN</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminUserList.map(user =>(
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.email}</td>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.isAdmin 
                                    ? <i className='fas fa-check' style={{color: 'green'}}></i> 
                                    : <i className='fas fa-check' style={{color: 'red'}}></i> }
                                </td>
                                <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant="primary" className="btn-sm">
                                            <i className="fas fa-edit"></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(user._id, user.email)}>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>)
            }

        </div>

    )
}

export default UserListScreen