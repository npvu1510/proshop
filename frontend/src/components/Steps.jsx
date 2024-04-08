import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Steps = ({
  steps = [
    { title: 'Sign in', to: '/login' },
    { title: 'Cart', to: '/cart' },
    { title: 'Shipping', to: '/shipping' },
    { title: 'Payment', to: '/payment' },
    { title: 'Place Order', to: '/place-order' },
  ],
  currentStep = 1,
}) => {
  return (
    <Nav className="justify-content-center mb-4">
      {steps.map((step, idx) =>
        idx + 1 > currentStep ? (
          <Nav.Item key={idx}>
            <Nav.Link disabled>{step.title}</Nav.Link>
          </Nav.Item>
        ) : (
          <Nav.Item key={idx}>
            <LinkContainer to={step.to}>
              <Nav.Link>{step.title}</Nav.Link>
            </LinkContainer>
          </Nav.Item>
        )
      )}
    </Nav>
  );
};

export default Steps;
