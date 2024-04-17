import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Row, Col, ListGroup, Card, Image, Button } from 'react-bootstrap';

import toast from 'react-hot-toast';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { getUserInfo } from '../selectors';

import Loader from '../components/Loader';
import Message from '../components/Message';

import {
  useDeliverOrderMutation,
  useGetOrderByIdQuery,
  usePayOrderMutation,
} from '../slices/orderApiSlice';
import { useGetPayPalClientIdQuery } from '../slices/paypalApiSlice';
import Meta from '../components/Meta';

const Order = () => {
  const { id } = useParams();
  const userInfo = useSelector(getUserInfo);

  const { data, isLoading: isLoadingOrder, refetch } = useGetOrderByIdQuery(id);

  const order = data?.data.order;
  const user = order?.user;

  const {
    data: paypal,
    isLoading: isLoadingPayPal,
    error: errorPayPal,
    isError: isErrorPayPal,
  } = useGetPayPalClientIdQuery();

  const [payOrder, { isLoading: isPayingOrder }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: isDelivering }] = useDeliverOrderMutation();

  const [{ dispatch }] = usePayPalScriptReducer();
  useEffect(() => {
    if (!isLoadingPayPal || !errorPayPal) {
      const loadPayPalScript = async () => {
        dispatch({
          type: 'resetOptions',
          value: {
            clientId: paypal.data.clientId,
          },
        });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) loadPayPalScript();
      }
    }
  }, [order, paypal, isLoadingPayPal, errorPayPal, isErrorPayPal, dispatch]);

  const isPreparing = isLoadingOrder || isLoadingPayPal;

  if (isPreparing) return <Loader />;

  const onApprove = (data, actions) => {
    return actions.order
      .capture()
      .then(async function (details) {
        console.log(details);
        if (details.status === 'COMPLETED') {
          try {
            await payOrder({ id, details }).unwrap();
            refetch();
            toast.success('Payment successful');
          } catch (error) {
            console.error(
              'An error occurred while processing the payment',
              error
            );

            toast.error('An error occurred while processing capturing order');
          }
        } else {
          console.error(
            'An error occurred while processing capturing order',
            details
          );

          toast.error('An error occurred while processing capturing order');
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error('An error occurred while processing capturing order');
      });
  };

  const onError = (error) => {
    toast.error(error?.data?.message || error.message);
  };

  const onCancel = (data, actions) => {
    console.log('cancel');
  };

  const handleDeliver = async () => {
    try {
      await deliverOrder(id).unwrap();
      toast.success(`Delivered #${id}`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(err?.data.message || err.message);
    }
  };

  return (
    <>
      <Meta title={`Order #${id}`} />
      <h1>Order #{id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>

              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Address</strong>{' '}
                {`${order.shippingAddress.postalCode}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`}
              </p>

              {order.isDelivered ? (
                <Message variant="success">Delivered</Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Items</h2>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
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
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <Button
                  className="btn"
                  variant="primary"
                  onClick={handleDeliver}
                >
                  Mark as delivered
                </Button>
              )}
              {!order.isPaid && (
                <ListGroup.Item>
                  {/* <Button
                    className="btn-block"
                    variant="primary"
                    onClick={handlePay}
                  >
                    Pay now
                  </Button> */}
                  <PayPalButtons
                    onApprove={onApprove}
                    onError={onError}
                    onCancel={onCancel}
                  />
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Order;
