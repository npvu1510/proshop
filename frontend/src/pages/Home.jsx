import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productApiSlice';

import { Row, Col, Accordion } from 'react-bootstrap';

import Product from '../components/Product';
import AppPagination from '../components/AppPagination';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import ProductFilter from '../components/ProductFilter';

import ProductCarousel from '../components/ProductCarousel';
import { useSelector } from 'react-redux';
import {
  getCategoriesFilter,
  getPriceRangeFilter,
  getStatusFilter,
} from '../selectors';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';

const Home = () => {
  const [searchParams] = useSearchParams();
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(null);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // search
  const search = searchParams.get('search') || '';

  // categories filter
  const categories = useSelector(getCategoriesFilter);

  // price range filter
  const [minPrice, maxPrice] = useSelector(getPriceRangeFilter);

  // status
  const status = useSelector(getStatusFilter);

  // pagination
  const currentPage = parseInt(searchParams.get('page'), 10) || 1;

  // Debounce function for search and price filter

  const [isLoadingDebounce, setIsLoadingDebounce] = useState(false);
  const debounceFetch = useCallback(
    debounce((minPrice, maxPrice, search) => {
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
      setDebouncedSearch(search);
      setIsLoadingDebounce(false);
    }, 200),
    [] // Adjust the delay as needed
  );

  useEffect(() => {
    setIsLoadingDebounce(true);
    debounceFetch(minPrice, maxPrice, search);
  }, [minPrice, maxPrice, search, debounceFetch]);

  const { data, isFetching, error } = useGetProductsQuery({
    search: debouncedSearch,
    categories,
    minPrice: debouncedMinPrice,
    maxPrice: debouncedMaxPrice,
    status,
    page: currentPage,
  });

  const products = data?.data.products;
  const totalPages = data?.data.totalPages;

  return (
    <>
      <Meta />
      {!search && <ProductCarousel />}
      <h1>Products</h1>

      <Row>
        <Col xl={3} lg={4} md={5} sm={12}>
          <Accordion defaultActiveKey="0">
            <ProductFilter className={'mt-3'} />
          </Accordion>
        </Col>
        {(isFetching || isLoadingDebounce) && <Loader />}
        {!isFetching ||
          (error && (
            <Message variant="danger">
              {error?.data.message || error.message}
            </Message>
          ))}

        {!isFetching && !isLoadingDebounce && products && (
          <>
            <Col xl={9} lg={8} md={7} sm={12}>
              <Row>
                {products.map((product) => (
                  <Col key={product._id} sm={6} md={12} lg={6} xl={4}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
            </Col>
            <AppPagination totalPages={totalPages} />
          </>
        )}
      </Row>
    </>
  );
};

export default Home;
