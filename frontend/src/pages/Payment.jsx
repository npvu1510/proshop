import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Navigate } from 'react-router-dom';

import Steps from '../components/Steps';
import FormContainer from '../components/FormContainer';

import cartSlice from '../slices/cartSlice';
import { getCart } from '../selectors';

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const onConfirm = (data) => {
    dispatch(cartSlice.actions.setPaymentMethod(data.paymentMethod));
    navigate('/place-order');
  };

  const { shippingAddress } = useSelector(getCart);

  if (Object.keys(shippingAddress).length === 0)
    return <Navigate to="/shipping" replace />;

  return (
    <FormContainer>
      <Steps currentStep={4} />
      <Form onSubmit={handleSubmit(onConfirm)}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="PayPal or Credit Card"
              value="PayPal"
              {...register('paymentMethod')}
            />
            <Form.Check
              type="radio"
              className="my-2"
              label="QR Pay"
              value="QR"
              {...register('paymentMethod')}
              defaultChecked
            />
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          Confirm
        </Button>
      </Form>
    </FormContainer>
  );
};

export default Payment;
