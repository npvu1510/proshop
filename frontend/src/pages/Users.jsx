import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '../slices/userApiSlice';

import { Table, Button } from 'react-bootstrap';
// import { LinkContainer } from 'react-router-bootstrap';

import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

import Modal from '../components/Modal';
import Loader from '../components/Loader';
import Message from '../components/Message';
import UserModal from '../components/UserModal';
import ConfirmDelete from '../components/ConfirmDelete';

import toast from 'react-hot-toast';
import { getUserInfo } from '../selectors';
import { useSelector } from 'react-redux';

const Orders = () => {
  const { data = null, isFetching, error, refetch } = useGetUsersQuery();
  const users = data?.data.users;

  // AUTHENTICATION
  const userInfo = useSelector(getUserInfo);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId).unwrap();

      refetch();
      toast.success(`Deleted user #${userId}`);
    } catch (err) {
      console.log(err);
      toast.error(err?.data.message || err.message);
    }
  };

  return (
    <Modal>
      <h1>Users</h1>
      {isFetching ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              if (userInfo.id === user._id) {
                return null;
              }

              return (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck style={{ color: 'green' }} />
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>

                  <td>
                    <Modal.Trigger triggerOf={`edit-product-${user._id}-modal`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </Modal.Trigger>

                    <Modal.Trigger
                      triggerOf={`delete-product-${user._id}-modal`}
                    >
                      <Button variant="danger" className="btn-sm mx-2">
                        <FaTrash />
                      </Button>
                    </Modal.Trigger>
                  </td>

                  <Modal.Window name={`edit-product-${user._id}-modal`}>
                    <UserModal user={user} refetch={refetch} />
                  </Modal.Window>

                  <Modal.Window name={`delete-product-${user._id}-modal`}>
                    <ConfirmDelete
                      resource="user"
                      onConfirm={() => {
                        handleDeleteUser(user._id);
                      }}
                      disabled={isDeleting}
                    />
                  </Modal.Window>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Modal>
  );
};

export default Orders;
