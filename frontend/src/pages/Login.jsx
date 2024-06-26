import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Row, Col, Button, Form } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';

import { useLoginMutation } from '../slices/authApiSlice';
import userSlice from '../slices/userSlice';
import { getUserInfo } from '../selectors';

const Login = () => {
  // console.log('LOGIN');
  const dispatch = useDispatch();

  // AUTHENTICATION
  const userInfo = useSelector(getUserInfo);

  // REACT HOOK FORM
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async ({ email, password }) => {
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(userSlice.actions.setUserInfo(res.user));
      toast.success('Login successfully', { duration: 1000 });
    } catch (err) {
      console.log(err);
      toast.error(err.data.message);
    }
  };

  const onError = (e) => {
    // console.log(e);
  };

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  if (userInfo) return <Navigate to={redirect} replace />;

  return (
    <FormContainer>
      <h1>Sign in</h1>

      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            {...register('email', {
              required: {
                value: true,
                message: 'Email is required',
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'invalid email address',
              },
            })}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email && errors.email.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            {...register('password', {
              required: {
                value: true,
                message: 'Password is required',
              },
              minLength: {
                value: 3,
                message: 'Password must be at least 3 characters long',
              },
            })}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password && errors.password.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="btn"
          disabled={isLoading}
        >
          Sign in
        </Button>
        {isLoading && <Loader />}
      </Form>
      <Row>
        <Col>
          Don't have an account ?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : `/register`}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default Login;
