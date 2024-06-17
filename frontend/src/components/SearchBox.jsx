import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Form } from 'react-bootstrap';

const SearchBox = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  return (
    // onSubmit={handleSubmit(onSubmit, onError)}
    <Form className="d-flex">
      <Form.Control
        style={{ fontSize: '0.8rem', padding: '0.3rem' }}
        type="text"
        name="search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSearchParams({ search: e.target.value });
        }}
      />
    </Form>
  );
};
export default SearchBox;
