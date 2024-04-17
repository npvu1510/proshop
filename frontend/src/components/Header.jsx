import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import toast from 'react-hot-toast';

import { getUserInfo } from '../selectors';
import { getCart } from '../selectors';

import { useLogoutMutation } from '../slices/userApiSlice';
import userSlice from '../slices/userSlice';
import SearchBox from './SearchBox';

const Header = () => {
  const dispatch = useDispatch();
  console.log('re-render Header');

  const cart = useSelector(getCart);
  const userInfo = useSelector(getUserInfo);

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const res = await logout().unwrap();
      toast.success(res.message, { duration: 1000 });
      dispatch(userSlice.actions.removeUser());
      // navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>ProShop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox />
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {cart.numItems !== 0 && (
                    <Badge pill bg="successF" style={{ marginLeft: '5px' }}>
                      {cart.numItems}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name}>
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>
                        <FaUser /> Profile
                      </NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </NavDropdown.Item>
                  </NavDropdown>

                  {userInfo.isAdmin && (
                    <NavDropdown title="Admin">
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link ink href="/login">
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
