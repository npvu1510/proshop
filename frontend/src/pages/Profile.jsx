import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Form, Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { getUserInfo } from '../selectors';

import { useUpdateProfileMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/userSlice';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice';

import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

const Profile = () => {
  console.log('render Profile');

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const userInfo = useSelector(getUserInfo);

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();

  const {
    data = null,
    isLoading: isFetchingOrders,
    error: fetchingOrdersError,
  } = useGetMyOrdersQuery();
  const orders = data?.data.orders;

  if (orders) {
    console.log(orders.at(0).createdAt, typeof orders.at(0).createdAt);
  }

  console.log(orders, isFetchingOrders, fetchingOrdersError);

  const onSubmit = async ({ name, email, password, confirmPassword }) => {
    try {
      const res = await updateProfile({
        name,
        email,
        password,
        confirmPassword,
      }).unwrap();
      console.log(res);

      const { name: newName, email: newEmail } = res.data.user;
      dispatch(
        setCredentials({ userInfo: { name: newName, email: newEmail } })
      );

      toast.success('Profile updated successfully', { duration: 1000 });
    } catch (err) {
      console.error(err);
      toast.error(err?.data.message || err.message);
    }
  };

  const onError = (err) => {
    console.log(err);
    console.log(errors);
  };

  return (
    <>
      <Meta title={userInfo.name} />
      <Row>
        <Col md={3}>
          <h2>Profile</h2>
          <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                {...register('name', {
                  required: {
                    value: true,
                    message: 'Name is required !',
                  },
                })}
                defaultValue={userInfo.name}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                {...register('email', {
                  required: {
                    value: true,
                    message: 'Email is required !',
                  },
                })}
                defaultValue={userInfo.email}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                {...register('password', {
                  required: {
                    value: true,
                    message: 'Password is required !',
                  },
                })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                {...register('confirmPassword', {
                  required: {
                    value: true,
                    message: 'Confirm password is required !',
                  },
                  validate: (confirmPassword) =>
                    confirmPassword === getValues().password ||
                    'Password and confirm password do not match',
                })}
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn"
              variant="primary"
              disabled={isUpdatingProfile}
            >
              Confirm
            </Button>
          </Form>
        </Col>

        <Col md={9}>
          <h2>Orders</h2>
          {isFetchingOrders ? (
            <Loader />
          ) : fetchingOrdersError ? (
            <Message>
              {fetchingOrdersError?.data?.message ||
                fetchingOrdersError.message}
            </Message>
          ) : (
            <Table striped table hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className="btn-sm" variant="light">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
      {isUpdatingProfile && <Loader />}
    </>
  );
};
export default Profile;
