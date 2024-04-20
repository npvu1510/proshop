import { useForm } from 'react-hook-form';

import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchBox = () => {
  const [setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  return (
    // onSubmit={handleSubmit(onSubmit, onError)}
    <Form className="d-flex">
      <Form.Control
        type="text"
        name="search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSearchParams({ search: e.target.value });
        }}
        // {...register('search', {
        //   minLength: {
        //     value: 5,
        //     message: 'A search query must be greater than 5 characters',
        //   },
        // })}
      />

      <Button type="submit" variant="outline-success" className="p-2 mx-2">
        Search
      </Button>
    </Form>
  );
};
export default SearchBox;
