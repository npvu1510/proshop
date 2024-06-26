import { useSearchParams } from 'react-router-dom';

import { Row, Col } from 'react-bootstrap';

import Product from '../components/Product';
import AppPagination from '../components/AppPagination';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

import { useGetProductsQuery } from '../slices/productApiSlice';
import ProductCarousel from '../components/ProductCarousel';

const Home = () => {
  const [searchParams] = useSearchParams();

  const currentPage = searchParams.get('page') * 1 || 1;
  const search = searchParams.get('search') || '';

  // console.log('rerender HOMEPAGE PAGE ', search);

  const { data, isLoading, error } = useGetProductsQuery({
    page: currentPage,
    search,
  });
  // console.log(error);
  const products = data?.data.products;
  const totalPages = data?.data.totalPages;

  return (
    <>
      {isLoading ? (
        <>
          <Loader />
          <ProductCarousel />
        </>
      ) : error ? (
        <Message variant="danger">
          {error?.data.message || error.message}
        </Message>
      ) : (
        <>
          <Meta />
          {!search && <ProductCarousel />}
          <h1>Latest Products</h1>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
      <AppPagination currentPage={1} totalPages={totalPages} />
    </>
  );
};
export default Home;
