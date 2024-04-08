import { useSearchParams, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import FormContainer from '../components/FormContainer';

import { useSignupMutation } from '../slices/userApiSlice';
import { getUserInfo } from '../selectors';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

import { setCredentials } from '../slices/userSlice';

const Register = () => {
  const dispatch = useDispatch();

  const userInfo = useSelector(getUserInfo);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const [signup, { isLoading }] = useSignupMutation();

  const onSubmit = async (data) => {
    try {
      const res = await signup(data).unwrap();
      dispatch(setCredentials(res.data));
    } catch (err) {
      console.log(err);
      toast.error(err.data.message);
    }
  };
  const onError = (error) => {
    console.log(error);
    console.log(errors);
  };

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  if (userInfo) return <Navigate to={redirect} />;

  return (
    <FormContainer>
      <h1>Sign up</h1>

      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <Form.Group className="my-2">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            {...register('name', {
              required: { value: true, message: 'Name is required !' },
            })}
          />
        </Form.Group>

        <Form.Group className="my-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            {...register('email', {
              required: { value: true, message: 'Email is required !' },
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Entered value does not match email format',
              },
            })}
          />
          {errors.email && (
            <Form.Text className="text-muted">{errors.email.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className="my-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            {...register('password', {
              required: { value: true, message: 'Password is required !' },
              minLength: {
                value: 3,
                message: 'Password must be at least 3 characters',
              },
            })}
          />
        </Form.Group>

        <Form.Group className="my-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            // id="confirmPassword"
            type="password"
            placeholder="Enter password"
            {...register('confirmPassword', {
              required: {
                value: true,
                message: 'Confirm password is required !',
              },
              minLength: {
                value: 3,
                message: 'Confirm password must be at least 3 characters',
              },
              validate: (value) =>
                value === getValues('password') || 'The passwords do not match',
            })}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Sign up
        </Button>

        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default Register;
