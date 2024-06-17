import { useForm } from 'react-hook-form';
import { Button } from 'react-bootstrap';
import CustomForm from './CustomForm';

import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '../slices/productApiSlice';

import { useGetCategoriesQuery } from '../slices/categoryApiSlice';

// import { useUploadImageMutation } from '../slices/uploadSlice';

import toast from 'react-hot-toast';

import Loader from './Loader';
import { useEffect, useState } from 'react';

const ProductModal = ({ editProduct, onClose, refetch }) => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const isEditSession = Boolean(editProduct);

  const categoryQuery = useGetCategoriesQuery();
  const categoriesForDisplay = categoryQuery.data?.categories
    ? [{ name: 'Other' }, ...categoryQuery.data?.categories]
    : null;

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const onSubmit = async (data) => {
    try {
      if (!isEditSession) {
        if (data.category === 'Other') data.category = data.newCategory;
        await createProduct(data).unwrap();
        toast.success('Create successfully');
        refetch();
        onClose();
      } else {
        const { name, brand, category, price, description, countInStock } =
          data;

        const formData = new FormData();
        formData.append('_id', editProduct._id);
        formData.append('originalCategory', editProduct.category);
        formData.append('name', name);
        // formData.append('brand', brand);
        formData.append(
          'category',
          category === 'Other' ? data.newCategory : category
        );
        formData.append('price', price);
        formData.append('description', description);
        formData.append('countInStock', countInStock);

        const image = data?.image[0];
        if (image) formData.append('image', image);

        await updateProduct(formData).unwrap();
        toast.success('Update successfully');

        refetch();
        onClose();
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.data.message || err.message);
    }
  };

  const onError = (err) => {
    console.log(errors);
    console.log(err);
  };

  // other
  const [isOtherCategory, setIsOtherCategory] = useState(true);
  const categoryChoice = watch('category');

  useEffect(() => {
    if (categoryChoice === 'Other') {
      setIsOtherCategory(true);
    } else {
      setIsOtherCategory(false);
    }
  }, [categoryChoice]);

  return (
    <>
      <h2 className="mb-5">{isEditSession ? `Edit product` : `New product`}</h2>
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
            {...(editProduct && { defaultValue: editProduct.name })}
          />
        </CustomForm.Group>

        {/* <CustomForm.Group className="mb-2" controlId="formBrand">
          <CustomForm.Label>Brand</CustomForm.Label>
          <CustomForm.Control
            as="select"
            {...register('brand', {
              required: {
                value: true,
                message: 'Brand is required !',
              },
            })}
            {...(editProduct && { defaultValue: editProduct.brand })}
          >
            <option>Select Brand</option>
            <option value="Nike">Nike</option>
            <option value="Adidas">Adidas</option>
            <option value="Apple">Apple</option>
          </CustomForm.Control>
        </CustomForm.Group> */}

        {editProduct && categoriesForDisplay && (
          <CustomForm.Group className="mb-2" controlId="formCategory">
            <CustomForm.Label>Category</CustomForm.Label>

            <CustomForm.Control
              as="select"
              {...register('category', {
                required: {
                  value: true,
                  message: 'Category is required !',
                },
              })}
              defaultValue={editProduct.category}
            >
              {categoriesForDisplay.map((category, idx) => (
                <option
                  key={idx}
                  value={category.name}
                  style={
                    editProduct.category === category.name
                      ? {
                          backgroundColor: '#3c4c5d',
                          color: '#fff',
                          fontWeight: 'bold',
                        }
                      : {}
                  }
                >
                  {category.name}
                </option>
              ))}
            </CustomForm.Control>

            {isOtherCategory && (
              <CustomForm.Control
                type="text"
                placeholder="Enter new category..."
                {...register('newCategory', {
                  required: {
                    value: true,
                    message: 'Category is required!',
                  },
                })}
              />
            )}
            {errors.category && <p>{errors.category.message}</p>}
          </CustomForm.Group>
        )}

        <CustomForm.Group className="mb-2" controlId="formPrice">
          <CustomForm.Label>Price</CustomForm.Label>
          <CustomForm.Control
            type="number"
            step="0.01"
            {...register('price', {
              required: {
                value: true,
                message: 'Price is required !',
              },
            })}
            {...(editProduct && { defaultValue: editProduct.price })}
          />
        </CustomForm.Group>

        <CustomForm.Group controlId="formDescription" className="mb-2">
          <CustomForm.Label>Description</CustomForm.Label>
          <CustomForm.Control
            type="text"
            placeholder="Enter description"
            {...register('description', {
              required: {
                value: true,
                message: 'Description is required !',
              },
            })}
            {...(editProduct && { defaultValue: editProduct.description })}
          />
        </CustomForm.Group>

        {isEditSession && (
          <CustomForm.Group controlId="formCountInStock" className="mb-2">
            <CustomForm.Label>Count In Stock</CustomForm.Label>
            <CustomForm.Control
              type="number"
              placeholder="Enter count in stock"
              {...register('countInStock', {
                required: {
                  value: true,
                  message: 'Count in stock is required !',
                },
              })}
              {...(editProduct && { defaultValue: editProduct.countInStock })}
            />
          </CustomForm.Group>
        )}

        {isEditSession && (
          <CustomForm.Group controlId="formImage" className="mb-2">
            <CustomForm.Label>Image</CustomForm.Label>
            <CustomForm.Control type="file" {...register('image')} />
          </CustomForm.Group>
        )}

        {isEditSession ? (
          <Button className="mt-5" type="submit" disabled={isUpdating}>
            Update
          </Button>
        ) : (
          <Button className="mt-5" type="submit" disabled={isCreating}>
            Create
          </Button>
        )}
        {(isCreating || isUpdating) && <Loader />}
      </CustomForm>
    </>
  );
};

export default ProductModal;
