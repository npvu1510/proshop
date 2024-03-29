import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  const currentYear = new Date().getDate();
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p>ProShop &copy; {currentYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
{
  /* <div>
<div>
  <div className="text-center py-3">
    <p>ProShop &copy; {currentYear}</p>
  </div>
</div>
</div> */
}
export default Footer;
