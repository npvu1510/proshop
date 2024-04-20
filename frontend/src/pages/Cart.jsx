import { useDispatch, useSelector } from 'react-redux';

import {
  Row,
  Col,
  Card,
  ListGroup,
  Form,
  Image,
  Button,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

import { FaTrashAlt } from 'react-icons/fa';

import Message from '../components/Message';
import Meta from '../components/Meta';

import { getCart } from '../selectors';
import cartSlice from '../slices/cartSlice';

const Cart = () => {
  console.log('rerender CART');
  const dispatch = useDispatch();

  // const cartItems = useSelector(getCartItems);
  const cart = useSelector(getCart);
  const cartItems = cart.cartItems;
  // console.log(cart);

  const handleQtyChange = (product) => {
    dispatch(cartSlice.actions.addToCart(product));
  };

  const handleRemoveFromCart = (id) => {
    dispatch(cartSlice.actions.removeFromCart(id));
  };

  return (
    <>
      <Meta title="Cart" />

      <Link className="btn btn-light my-3" to={-1}>
        Go back
      </Link>

      <Row>
        <Col md={8}>
          <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>

          {cartItems.length === 0 && <Message>Your cart is empty</Message>}

          {cartItems.length !== 0 && (
            <ListGroup variant="flush">
              {cartItems.map((cartItem) => (
                <ListGroup.Item key={cartItem._id}>
                  <Row>
                    <Col md={2}>
                      <Image
                        src={cartItem.image}
                        alt={cartItem.name}
                        fluid
                        rounded
                      />
                    </Col>

                    <Col md={3}>
                      <Link to={`/product/${cartItem._id}`}>
                        {cartItem.name}
                      </Link>
                    </Col>

                    <Col md={2}>${cartItem.price}</Col>

                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={cartItem.qty}
                        onChange={(e) => {
                          handleQtyChange({
                            ...cartItem,
                            qty: e.target.value * 1,
                          });
                        }}
                      >
                        {[
                          ...Array(
                            cartItem.countInStock > 10
                              ? 10
                              : cartItem.countInStock
                          ).keys(),
                        ].map((item) => (
                          <option key={item} value={item + 1}>
                            {item + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>

                    <Col md={2}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={(e) => {
                          handleRemoveFromCart(cartItem._id);
                        }}
                      >
                        <FaTrashAlt />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        {cartItems.length !== 0 && (
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Subtotal ({cart.numItems})</h2>${cart.itemsPrice}
                </ListGroup.Item>

                <ListGroup.Item>
                  <LinkContainer to="/shipping">
                    <Button type="button" className="button-block">
                      Proceed to checkout
                    </Button>
                  </LinkContainer>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
};

export default Cart;
