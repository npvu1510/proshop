// components/Filter.js
import { useState } from 'react';
import { Card, Accordion, Form, Button } from 'react-bootstrap';

import Loader from '../components/Loader';

// components/
import { PriceSlider } from './RangeSlider';
import SearchBox from './SearchBox';

import { useDispatch, useSelector } from 'react-redux';
import {
  getCategoriesFilter,
  getMaxPriceFilter,
  getMinPriceFilter,
  getPriceRangeFilter,
  getStatusFilter,
} from '../selectors';
import productSlice from '../slices/productSlice';
import { useGetCategoriesQuery } from '../slices/categoryApiSlice';

const ProductFilter = ({ className }) => {
  const dispatch = useDispatch();

  const categoryQuery = useGetCategoriesQuery();
  let categoriesForDisplay = categoryQuery.data?.categories;
  if (categoriesForDisplay) {
    categoriesForDisplay = [{ name: 'All' }, ...categoriesForDisplay];
  }

  // price filter
  const minPrice = useSelector(getMinPriceFilter);
  const maxPrice = useSelector(getMaxPriceFilter);
  const priceRange = useSelector(getPriceRangeFilter);

  const setPriceRange = (values) => {
    dispatch(productSlice.actions.setPriceRange(values));
  };

  // category filter
  let categories = useSelector(getCategoriesFilter);

  const handleCheckBoxChange = (category, isChecked) => {
    if (category === 'All' && !isChecked && categories.length === 1) return;
    if (isChecked) {
      // ton tai
      if (categories.indexOf(category) !== -1) return;

      // chua ton tai
      dispatch(
        productSlice.actions.setCategoriesFilter([...categories, category])
      );

      console.log('Đã check ', category);
    } else {
      categories = categories.filter((cat) => cat !== category);

      dispatch(productSlice.actions.setCategoriesFilter(categories));
      if (categories.length === 0)
        dispatch(productSlice.actions.setCategoriesFilter(['All']));

      console.log('Đã uncheck ', category);
    }
  };

  // status filter
  const status = useSelector(getStatusFilter);

  const handleStatusChange = (e) => {
    const status = e.target.value;

    if (!status) return;

    dispatch(productSlice.actions.setStatusFilter(status));
  };

  const statusForDisplay = ['All', 'In stock', 'Out of stock'];

  return (
    <Accordion className={className} defaultActiveKey="0">
      <Card>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Filters</Accordion.Header>
          <Accordion.Body>
            {/* Search */}
            <Form.Group className="mb-4" controlId="categoryFilter">
              <Form.Label className="filter-label">Search</Form.Label>
              <SearchBox />
            </Form.Group>

            {/* Category Filter */}
            <Form.Group className="mb-4" controlId="categoryFilter">
              <Form.Label className="filter-label">Category</Form.Label>
              <div className="checkbox-list">
                {categoryQuery.isFetching && <Loader />}
                {!categoryQuery.isFetching &&
                  categoriesForDisplay.map((category, idx) => (
                    <Form.Check
                      type="checkbox"
                      label={category.name}
                      key={idx}
                      value={category.name}
                      checked={categories.includes(category.name)}
                      onChange={(e) => {
                        handleCheckBoxChange(category.name, e.target.checked);
                      }}
                    />
                  ))}
              </div>
            </Form.Group>

            {/* Price Range Filter */}
            <PriceSlider
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />

            {/* Status Filter */}
            <Form.Group className="mb-4" controlId="stockFilter">
              <Form.Label className="filter-label">Status</Form.Label>
              <div className="checkbox-list">
                {statusForDisplay &&
                  statusForDisplay.map((s, idx) => (
                    <Form.Check
                      key={s}
                      type="radio"
                      name="statusRadio"
                      label={s}
                      value={s}
                      {...{ defaultChecked: status.includes(s) }}
                      onChange={handleStatusChange}
                    />
                  ))}
                {/* <Form.Check type="radio" name="statusRadio" label="All" />
                <Form.Check type="radio" name="statusRadio" label="In Stock" />
                <Form.Check
                  type="radio"
                  name="statusRadio"
                  label="Out of Stock"
                /> */}
              </div>
            </Form.Group>

            {/* <Button variant="primary" type="submit">
              Apply Filters
            </Button> */}
          </Accordion.Body>
        </Accordion.Item>
      </Card>
    </Accordion>
  );
};

export default ProductFilter;
