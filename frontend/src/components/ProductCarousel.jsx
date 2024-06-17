import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Loader from './Loader';
import Message from './Message';

import { useGetTopRatingProductsQuery } from '../slices/productApiSlice';

const ProductCarousel = () => {
  const { data, isLoading, error } = useGetTopRatingProductsQuery();
  const topProducts = data?.data?.products;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>err.message</Message>
      ) : (
        <Carousel pause="hover" className="bg-primary mb-4">
          {topProducts.map((product) => (
            <Carousel.Item key={product._id}>
              <Link to={`/products/${product._id}`}>
                <Image
                  src={product.image}
                  alt={`${product.image}'s image`}
                  fluid
                />
                <Carousel.Caption id="carousel-caption">
                  <h2>
                    {product.name} (${product.price})
                  </h2>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </>
  );
};
export default ProductCarousel;
