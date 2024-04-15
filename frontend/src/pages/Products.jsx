import { useForm } from 'react-hook-form';
import {
  useGetProductsQuery,
  useCreateProductMutation,
} from '../slices/productApiSlice';

import { Row, Col, Button, Table, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

import Message from '../components/Message';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import CreateProductModal from '../components/CreateProductModal';

export const Products = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const { data, isLoading: isQuerying, error, refetch } = useGetProductsQuery();

  const products = data?.data.products;
  console.log(isQuerying, products);

  const handleDelete = (id) => {
    console.log(id);
  };

  return (
    <Modal>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Modal.Trigger triggerOf="create-product-modal">
            <Button className="btn-sm m-3">
              <FaPlus /> Create Product
            </Button>
          </Modal.Trigger>
        </Col>
      </Row>

      {isQuerying ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Modal.Trigger
                        triggerOf={`edit-product-${product._id}-modal`}
                      >
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </Modal.Trigger>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => handleDelete(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>

                  <Modal.Window name={`edit-product-${product._id}-modal`}>
                    <CreateProductModal
                      refetch={refetch}
                      editProduct={product}
                    />
                  </Modal.Window>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* PAGINATE PLACEHOLDER */}
        </>
      )}

      <Modal.Window name="create-product-modal">
        <CreateProductModal refetch={refetch} />
      </Modal.Window>
    </Modal>
  );
};
export default Products;
