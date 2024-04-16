import { useForm } from 'react-hook-form';
import { Button } from 'react-bootstrap';
import CustomForm from './CustomForm';

import { useUpdateUserMutation } from '../slices/userApiSlice';

import toast from 'react-hot-toast';

import Loader from './Loader';

const UserModal = ({ user, onClose, refetch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const onSubmit = async (data) => {
    try {
      console.log({ ...data, _id: user._id });
      await updateUser({ ...data, _id: user._id }).unwrap();
      toast.success('Update successfully');
      refetch();
      onClose();
    } catch (err) {
      console.log(err);
      toast.error(err?.data.message || err.message);
    }
  };

  const onError = (err) => {
    console.log(errors);
    console.log(err);
  };

  return (
    <>
      <h2 className="mb-5">Update user</h2>
      <CustomForm onSubmit={handleSubmit(onSubmit, onError)} type="modal">
        <CustomForm.Group className="mb-2" controlId="formProductName">
          <CustomForm.Label>Name</CustomForm.Label>
          <CustomForm.Control
            type="text"
            placeholder="Enter product name"
            {...register('name', {
              required: {
                value: true,
                message: 'Name is required !',
              },
            })}
            defaultValue={user.name}
          />
        </CustomForm.Group>

        <CustomForm.Group className="mb-2" controlId="formPrice">
          <CustomForm.Label>Email</CustomForm.Label>
          <CustomForm.Control
            type="email"
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
            defaultValue={user.email}
          />
        </CustomForm.Group>

        <CustomForm.Group>
          <CustomForm.Check
            type="checkbox"
            label="Admin"
            {...register('isAdmin')}
            defaultChecked={user.isAdmin}
          />
        </CustomForm.Group>

        <Button className="mt-5" type="submit" disabled={isUpdating}>
          Update
        </Button>
        {isUpdating && <Loader />}
      </CustomForm>
    </>
  );
};

// const UserModal = () => {
//   return (
//     <div>
//       <h1>User modal</h1>
//     </div>
//   );
// };

export default UserModal;
