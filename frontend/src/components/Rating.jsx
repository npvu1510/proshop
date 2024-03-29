import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function Rating({ rating, numReviews }) {
  const numFullStars = Math.floor(rating);
  const stars = Array.from({ length: 5 }, (_, index) => {
    return (
      <span key={index}>
        {index + 1 > numFullStars ? (
          rating - index === 0.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )
        ) : (
          <FaStar />
        )}
      </span>
    );
  });

  return (
    <div className="rating">
      {stars}
      <span>{`${numReviews} ${numReviews <= 1 ? `review` : `reviews`}`}</span>
    </div>
  );
}

export default Rating;
