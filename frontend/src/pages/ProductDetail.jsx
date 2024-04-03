import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Link, useParams } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  Card,
  Image,
  Button,
  Form,
} from 'react-bootstrap';

import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';

import { useGetProductDetailsQuery } from '../slices/productSlice';
import cartSlice from '../slices/cartSlice';

function ProductDetails() {
  const [qty, setQty] = useState(1);
  const { productId } = useParams();
  const {
    data: product,
    isLoading,
    isError: error,
  } = useGetProductDetailsQuery(productId);

  const dispatch = useDispatch();

  const handleQtyChange = (e) => {
    setQty(e.target.value * 1);
  };

  const handleAddtoCart = (e) => {
    const item = { ...product, qty };
    dispatch(cartSlice.actions.addToCart(item));
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        // <div>{error?.data.message || error.error}</div>
        // <Message variant="danger">{error?.data.message || error.error}</Message>
        <Message variant="danger">Something went wrong</Message>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>QTY:</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={handleQtyChange}
                          >
                            {[
                              ...Array(
                                product.countInStock >= 10
                                  ? 10
                                  : product.countInStock
                              ).keys(),
                            ].map((element) => (
                              <option key={element} value={element + 1}>
                                {element + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={handleAddtoCart}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default ProductDetails;
