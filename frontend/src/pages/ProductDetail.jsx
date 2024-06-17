import { useEffect, useState } from 'react';
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

import {
  getPage,
  getRatingFilter,
  getSortFilter,
  getUserInfo,
} from '../selectors';

import cartSlice from '../slices/cartSlice';
import { useGetProductDetailsQuery } from '../slices/productApiSlice';
import { useNewReviewMutation } from '../slices/reviewApiSlice';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice';
import reviewSlice from '../slices/reviewSlice';
import AppPagination from '../components/AppPagination';

function ProductDetails() {
  const dispatch = useDispatch();

  const { productId } = useParams();

  // AUTHENTICATION
  const userInfo = useSelector(getUserInfo);

  // filtering & sorting
  const ratingFilter = useSelector(getRatingFilter);
  const sortFilter = useSelector(getSortFilter);
  const currentPage = useSelector(getPage);

  // state
  const [qty, setQty] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // React hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const {
    data,
    isFetching: isProductDetailFetching,
    error,
    refetch,
  } = useGetProductDetailsQuery({ productId }, { skip: !productId });

  const [reviews, setReviews] = useState(null);

  // FILTER, SORT & PAGINATION
  useEffect(() => {
    if (!data) return;

    let filteredReviews = [...data.product.reviews];

    // filter
    if (ratingFilter !== 0)
      filteredReviews = filteredReviews.filter(
        (review) => review.rating === ratingFilter
      );

    // sort
    filteredReviews = filteredReviews.sort((a, b) => {
      if (sortFilter === 0) {
        // Mới nhất tới cũ nhất
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortFilter === 1) {
        // Cũ nhất tới mới nhất
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sortFilter === 2) {
        // Sắp xếp rating tăng dần
        return b.rating - a.rating;
      }
      if (sortFilter === 3) {
        // Sắp xếp rating giảm dần
        return a.rating - b.rating;
      }
      return 0; // Nếu không khớp với bất kỳ điều kiện nào, không sắp xếp
    });

    // Pagination
    const limit = 5;
    const start = (currentPage - 1) * limit;
    const end = start + limit;

    setTotalPages(Math.ceil(filteredReviews.length / limit));

    filteredReviews = filteredReviews.slice(start, end);

    setReviews(filteredReviews);
  }, [data, isProductDetailFetching, ratingFilter, sortFilter, currentPage]);

  // Reset trang khi filter
  useEffect(() => {
    dispatch(reviewSlice.actions.setPage(1));
  }, [ratingFilter, sortFilter, dispatch]);

  // Check đã mua sản phẩm chưa ?
  const getMyOrdersQuery = useGetMyOrdersQuery(
    { user: userInfo?.id },
    { skip: !userInfo }
  );

  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    if (!getMyOrdersQuery.data || !userInfo) return;

    setHasPurchased(
      getMyOrdersQuery.data?.data.orders.some(
        (order) =>
          order.isPaid &&
          order.orderItems.some((item) => item.product === productId)
      )
    );
  }, [userInfo, getMyOrdersQuery, productId, hasPurchased]);

  // Check đã review chưa ?
  const [hasReviewed, setIsReview] = useState(false);

  useEffect(() => {
    if (!data || !userInfo) return;
    const allReview = data.product.reviews;
    setIsReview(allReview.find((review) => review.user === userInfo.id));
  }, [data, userInfo]);

  const [newReview, { isLoading: isCreatingReview }] = useNewReviewMutation();

  // handlers
  const handleRatingFilterChange = (e) => {
    // setRatingFilter(e.target.value);
    if (!e.target.value) return;
    dispatch(reviewSlice.actions.setRatingFilter(e.target.value * 1));
  };

  const handleSortingFilterChange = (e) => {
    if (!e.target.value) return;

    dispatch(reviewSlice.actions.setSortFilter(e.target.value * 1));
  };

  const handleQtyChange = (e) => {
    setQty(e.target.value * 1);
  };

  const handleAddToCart = (e) => {
    const item = { ...data.product, qty };
    console.log(item);

    dispatch(cartSlice.actions.addToCart(item));
    toast.success(`Added product #${item._id} to cart`, { duration: 1000 });
  };

  const onSubmitReview = async (data) => {
    try {
      await newReview({
        ...data,
        productId: productId,
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
      <Link className="btn btn-light my-3" to={-1}>
        Go Back
      </Link>

      {isProductDetailFetching ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.data.message}</Message>
      ) : (
        <>
          <Meta title={data.product.name} />
          <Row>
            <Col md={6}>
              <Image src={data.product.image} alt={data.product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{data.product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={data.product.rating}
                    text={`${data.product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${data.product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {data.product.description}
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
                        <strong>${data.product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {data.product.countInStock > 0
                          ? 'In Stock'
                          : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {data.product.countInStock > 0 && (
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
                                data.product.countInStock >= 10
                                  ? 10
                                  : data.product.countInStock
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
                      disabled={data.product.countInStock === 0}
                      onClick={handleAddToCart}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className="review my-3">
            <Col md={12}>
              {hasPurchased &&
                (hasReviewed ? (
                  <h2>Your review</h2>
                ) : (
                  <h2>What is your experience with this product ?</h2>
                ))}

              {isCreatingReview && <Loader />}
              {!isCreatingReview && !userInfo && (
                <Message>
                  Please <Link to="/login">sign in</Link> to write a review
                </Message>
              )}

              {!isCreatingReview && hasPurchased ? (
                hasReviewed ? (
                  <ListGroup variant="flush">
                    <ListGroup.Item key={hasReviewed._id}>
                      <strong>{hasReviewed.name}</strong>
                      <p className="created-at">
                        {new Date(hasReviewed.createdAt).toLocaleString(
                          'en-US',
                          {
                            weekday: 'short', // Thứ trong tuần (ví dụ: "Thứ Hai")
                            year: 'numeric', // Năm đầy đủ (ví dụ: "2023")
                            month: '2-digit', // Tên tháng đầy đủ (ví dụ: "Tháng Sáu")
                            day: '2-digit', // Ngày với hai chữ số (ví dụ: "11")
                            hour: '2-digit', // Giờ với hai chữ số (ví dụ: "14")
                            minute: '2-digit', // Phút với hai chữ số (ví dụ: "20")
                            second: '2-digit', // Giây với hai chữ số (ví dụ: "30")
                            hour12: false, // Sử dụng định dạng 24 giờ
                          }
                        )}
                      </p>
                      <Rating value={hasReviewed.rating} />

                      <p>{hasReviewed.comment}</p>
                    </ListGroup.Item>
                  </ListGroup>
                ) : (
                  <Form onSubmit={handleSubmit(onSubmitReview)}>
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
                      disabled={isCreatingReview}
                      type="submit"
                      variant="primary"
                    >
                      Submit
                    </Button>
                  </Form>
                )
              ) : (
                ''
              )}
            </Col>
          </Row>

          <Row className="review">
            <Col md={12}>
              <h2>Reviews</h2>

              <Row className="my-2">
                <Col md={6}>
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    as="select"
                    value={ratingFilter}
                    onChange={handleRatingFilterChange}
                  >
                    <option value="0">All</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </Form.Control>
                </Col>

                <Col md={6}>
                  <Form.Label>Sort</Form.Label>
                  <Form.Control
                    as="select"
                    value={sortFilter}
                    onChange={handleSortingFilterChange}
                  >
                    <option value="0">Latest to Oldest</option>
                    <option value="1">Oldest to Latest</option>
                    <option value="2">Highest rating to lowest rating</option>
                    <option value="3">Lowest rating to highest rating</option>
                  </Form.Control>
                </Col>
              </Row>

              <Row>
                {reviews && reviews.length === 0 && (
                  <Col md={12}>
                    <Message>No Reviews</Message>
                  </Col>
                )}
                <ListGroup variant="flush">
                  {reviews &&
                    reviews.map((review) => (
                      <ListGroup.Item key={review._id}>
                        <strong>{review.name}</strong>
                        <p className="created-at">
                          {new Date(review.createdAt).toLocaleString('en-US', {
                            weekday: 'short', // Thứ trong tuần (ví dụ: "Thứ Hai")
                            year: 'numeric', // Năm đầy đủ (ví dụ: "2023")
                            month: '2-digit', // Tên tháng đầy đủ (ví dụ: "Tháng Sáu")
                            day: '2-digit', // Ngày với hai chữ số (ví dụ: "11")
                            hour: '2-digit', // Giờ với hai chữ số (ví dụ: "14")
                            minute: '2-digit', // Phút với hai chữ số (ví dụ: "20")
                            second: '2-digit', // Giây với hai chữ số (ví dụ: "30")
                            hour12: false, // Sử dụng định dạng 24 giờ
                          })}
                        </p>
                        <Rating value={review.rating} />

                        <p>{review.comment}</p>
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              </Row>
            </Col>
          </Row>

          {totalPages > 0 && (
            <AppPagination
              totalPages={totalPages}
              dispatchPage={(page) => {
                dispatch(reviewSlice.actions.setPage(page));
              }}
            />
          )}
        </>
      )}
    </>
  );
}

export default ProductDetails;
