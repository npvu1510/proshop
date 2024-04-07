import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Form, Button } from 'react-bootstrap';

import FormContainer from '../components/FormContainer';
import Steps from '../components/Steps';

import cartSlice from '../slices/cartSlice';
import { getCart } from '../selectors';

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector(getCart);
  const shippingAddress = cart.shippingAddress;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onConfirm = (data) => {
    console.log(data);
    dispatch(cartSlice.actions.setShippingAddress(data));
    navigate('/payment');
  };

  const onError = (e) => {
    console.log(errors);
  };

  return (
    <>
      <Steps currentStep={2} />
      <FormContainer>
        <Form onSubmit={handleSubmit(onConfirm, onError)}>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              defaultValue={
                shippingAddress.address ? shippingAddress.address : ''
              }
              placeholder="Enter address"
              {...register('address', {
                required: {
                  value: true,
                  message: 'Address is required !',
                },
              })}
            />
            {errors.address && <Form.Text>{errors.address.message}</Form.Text>}
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              defaultValue={
                shippingAddress.country ? shippingAddress.country : ''
              }
              placeholder="Enter country"
              {...register('country', {
                required: {
                  value: true,
                  message: 'Country is required !',
                },
              })}
            />
            {errors.country && <Form.Text>{errors.country.message}</Form.Text>}
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Postal code</Form.Label>
            <Form.Control
              type="number"
              defaultValue={
                shippingAddress.postalCode ? shippingAddress.postalCode : ''
              }
              placeholder="Enter postal code"
              {...register('postalCode', {
                required: {
                  value: true,
                  message: 'Postal code is required !',
                },
              })}
            />
            {errors.postalCode && (
              <Form.Text>{errors.postalCode.message}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              defaultValue={shippingAddress.city ? shippingAddress.city : ''}
              placeholder="Enter City"
              {...register('city', {
                required: {
                  value: true,
                  message: 'City is required !',
                },
              })}
            />
            {errors.city && <Form.Text>{errors.city.message}</Form.Text>}
          </Form.Group>

          <Button className="btn mt-2" variant="primary" type="submit">
            Confirm
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default Shipping;
