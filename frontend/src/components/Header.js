import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'; 
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "../redux/actions/userActions";
import SearchBox from "./SearchBox";

const Header=()=>{

  const { cartItems } = useSelector(state => state.cart)
  const { userInfo } = useSelector(state => state.userLogin) 
  const dispatch = useDispatch()

  const logoutHandler = () =>{
    dispatch(logout())
  }
  return(
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand >ProShop</Navbar.Brand>
          </LinkContainer>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <SearchBox />
              <Nav className="ms-auto">

                <LinkContainer to="/cart"> 
                  <Nav.Link>
                    <i className="fas fa-shopping-cart"></i> Cart{cartItems.length !== 0 && `(${cartItems.length})`}
                  </Nav.Link>
                </LinkContainer>

                {userInfo
                  ? (
                    <NavDropdown title={userInfo.name} id='username'>
                        <LinkContainer to='/profile'>
                          <NavDropdown.Item>Profile</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Item
                          onClick = {logoutHandler}
                        >
                          Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                  ):(
                    <LinkContainer to="/login">
                      <Nav.Link ><i className="fas fa-user"></i> Login</Nav.Link>
                    </LinkContainer>
                  )
                }
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="Admin" id='aminmenu'>
                      <LinkContainer to='/admin/userlist'>
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/productlist'>
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/orderlist'>
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                  </NavDropdown>
                )}
                
              </Nav>
            </Navbar.Collapse>
          </Container>
      </Navbar>
    </header>
  )
}
export default Header