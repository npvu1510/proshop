import { useForm } from 'react-hook-form';

import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchBox = () => {
  console.log('RERENDER SEARCHBOX');

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  // const onSubmit = (data) => {
  //   console.log(data);
  // };

  // const onError = (err) => {
  //   console.log(err);
  // };

  // useEffect(() => {
  //   console.log('rerender');
  // }, [register]);

  return (
    // onSubmit={handleSubmit(onSubmit, onError)}
    <Form className="d-flex">
      <Form.Control
        type="text"
        name="search"
        value={search}
        onChange={(e) => {
          console.log(e.target.value);
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
