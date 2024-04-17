import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
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
import toast from 'react-hot-toast';

import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

import { getUserInfo } from '../selectors';

import cartSlice from '../slices/cartSlice';
import { useGetProductDetailsQuery } from '../slices/productApiSlice';
import { useNewReviewMutation } from '../slices/reviewApiSlice';

function ProductDetails() {
  const dispatch = useDispatch();
  const { productId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();
  const [qty, setQty] = useState(1);

  const {
    data: product,
    isLoading,
    isError: error,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const userInfo = useSelector(getUserInfo);

  let isAlreadyReviewed = null;
  if (userInfo)
    isAlreadyReviewed = product?.reviews.find(
      (review) => review.user.toString() === userInfo.id
    );

  const [newReview, { isLoading: isCreating }] = useNewReviewMutation();

  const handleQtyChange = (e) => {
    setQty(e.target.value * 1);
  };

  const handleAddtoCart = (e) => {
    const item = { ...product, qty };
    dispatch(cartSlice.actions.addToCart(item));
    toast.success(`Added product #${item._id} to cart`, { duration: 1000 });
  };

  const onSubmit = async (data) => {
    try {
      await newReview({
        ...data,
        productId: product._id,
        name: userInfo.name,
      }).unwrap();
      refetch();
      toast.success(`Review successfully`);
    } catch (err) {
      console.log(err);
      toast.error(err?.data.message || err.message);
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">Something went wrong</Message>
      ) : (
        <>
          <Meta title={product.name} />
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

          <Row className="review">
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col md={6}>
              <h2>
                {isAlreadyReviewed ? `Your review` : `Write a Customer Review`}
              </h2>
              {isCreating && <Loader />}

              {userInfo ? (
                !isAlreadyReviewed ? (
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="my-2" controlId="rating">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control as="select" {...register('rating')}>
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group className="my-2" controlId="comment">
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        row="3"
                        {...register('comment')}
                      ></Form.Control>
                    </Form.Group>
                    <Button
                      disabled={isCreating}
                      type="submit"
                      variant="primary"
                    >
                      Submit
                    </Button>
                  </Form>
                ) : (
                  <ListGroup variant="flush">
                    <ListGroup.Item key={isAlreadyReviewed._id}>
                      <strong>{isAlreadyReviewed.name}</strong>
                      <Rating value={isAlreadyReviewed.rating} />
                      <p>{isAlreadyReviewed.createdAt.substring(0, 10)}</p>
                      <p>{isAlreadyReviewed.comment}</p>
                    </ListGroup.Item>
                  </ListGroup>
                )
              ) : (
                <Message>
                  Please <Link to="/login">sign in</Link> to write a review
                </Message>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default ProductDetails;
