import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

import Product from '../components/Product';

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Something went wrong');
        console.log(res);
        const data = await res.json();

        setProducts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
        {!isLoading &&
          !error &&
          products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
      </Row>
    </>
  );
}

export default Home;
