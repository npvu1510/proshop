import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Row, Col, Card, ListGroup, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Steps from '../components/Steps';
import Message from '../components/Message';
import Loader from '../components/Loader';

import { getCart } from '../selectors';

import { useCreateOrderMutation } from '../slices/orderApiSlice';

import toast from 'react-hot-toast';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const {
    cartItems,

    shippingAddress,
    paymentMethod,

    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useSelector(getCart);

  if (!shippingAddress) navigate('/shipping');

  if (!paymentMethod) navigate('/payment');

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const handleCreateOrder = async () => {
    try {
      const order = {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,

        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const res = await createOrder(order).unwrap();
      toast.success(`Order created successfully`);

      navigate(`/order/${res.data.newOrder._id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.data.message);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Steps currentStep={5} />

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1>Shipping</h1>
              <p>
                <strong>
                  Address:{' '}
                  {`${shippingAddress.postalCode}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.country}`}
                </strong>
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h1>Payment method</h1>
              <p>
                <strong>Method:</strong> {paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h1>Items</h1>

              {cartItems.length === 0 ? (
                <Message>Your cart is empty !</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="submit"
                  className="btn-block"
                  disabled={cartItems.length === 0 || isLoading}
                  onClick={handleCreateOrder}
                >
                  Create order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default PlaceOrder;
