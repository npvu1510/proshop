import toast from 'react-hot-toast';

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from '../slices/productApiSlice';

import { Row, Col, Button, Table, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

import Message from '../components/Message';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';

import ProductModal from '../components/ProductModal';

export const Products = () => {
  const { data, isLoading: isQuerying, error, refetch } = useGetProductsQuery();

  const [deteteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = data?.data.products;

  const handleDelete = async (id) => {
    try {
      await deteteProduct(id).unwrap();

      refetch();
      toast.success(`Deleted product #${id}`);
    } catch (err) {
      console.log(err);
      toast.error(err?.data.message || err.message);
    }
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
                    <Modal.Trigger
                      triggerOf={`edit-product-${product._id}-modal`}
                    >
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </Modal.Trigger>

                    <Modal.Trigger
                      triggerOf={`delete-product-${product._id}-modal`}
                    >
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => handleDelete(product._id)}
                        disabled={isDeleting}
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                    </Modal.Trigger>
                  </td>

                  <Modal.Window name={`edit-product-${product._id}-modal`}>
                    <ProductModal refetch={refetch} editProduct={product} />
                  </Modal.Window>

                  <Modal.Window name={`delete-product-${product._id}-modal`}>
                    <ConfirmDelete
                      resource="product"
                      onConfirm={() => {
                        handleDelete(product._id);
                      }}
                      disabled={isDeleting}
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
        <ProductModal refetch={refetch} />
      </Modal.Window>
    </Modal>
  );
};
export default Products;
