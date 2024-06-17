import { Form } from 'react-bootstrap';
import ReactSlider from 'react-slider';

export const PriceSlider = ({
  minPrice,
  maxPrice,
  priceRange,
  setPriceRange,
}) => {
  const handleSliderChange = (values) => {
    setPriceRange(values);
  };

  // console.log(minPrice, maxPrice, priceRange);

  return (
    <Form.Group className="mb-4" controlId="priceRangeFilter">
      <Form.Label className="filter-label">Price</Form.Label>
      <div className="d-flex justify-content-between">
        <span>{priceRange[0]}</span>
        <span>{priceRange[1]}</span>
      </div>
      <ReactSlider
        className="custom-slider"
        thumbClassName="custom-thumb"
        trackClassName="custom-track"
        min={minPrice}
        max={maxPrice}
        value={priceRange}
        onChange={handleSliderChange}
        withTracks={true}
        pearling
        minDistance={5}
      />
    </Form.Group>
  );
};
