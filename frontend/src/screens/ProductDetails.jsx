import { Link, useParams } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Card,
  Image,
  Button,
} from 'react-bootstrap';

import Rating from '../components/Rating';
import { useState, useEffect } from 'react';

function ProductDetails() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  console.log('RERENDER with', product);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error('Something went wrong 1');

        const { data, message = null } = await res.json();

        if (message) throw new Error(message);
        setProduct(data.product);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {/* <Link className="btn btn-light my-3" to="/product/5">
        Test
      </Link> */}

      {isLoading && (
        <Row>
          <p>Loading...</p>
        </Row>
      )}
      {!isLoading && error && (
        <Row>
          <p>{error}</p>
        </Row>
      )}

      {!isLoading && !error && product && (
        <Row>
          <Col md={5}>
            <Image src={product.image} alt={`${product.name}'s image`} fluid />
          </Col>

          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroupItem>
                <h3>{product.name}</h3>
              </ListGroupItem>
              <ListGroupItem>
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                />
              </ListGroupItem>

              <ListGroupItem>
                <span>Description: {product.description}</span>
              </ListGroupItem>
            </ListGroup>
          </Col>

          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? `In Stock` : `Out Of Stock`}
                    </Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <Button
                    className="btn-block"
                    type="button"
                    disabled={product.countInStock === 0}
                  >
                    Add to card
                  </Button>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}

export default ProductDetails;
