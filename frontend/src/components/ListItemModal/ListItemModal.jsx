import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '../RegisterComponents/TextInput';
import FileInput from '../RegisterComponents/FileInput';
import useAuthStore from '../../Store/Auth';
import useProductStore from '../../Store/product';
import useCategoryStore from '../../Store/categoryStore';

export default function ListItemModal() {
  const { token } = useAuthStore();
  const { postProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const initialValues = {
    name: '',
    description: '',
    category: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    daily: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Title should be at least 3 characters long')
      .max(30, 'Title should be at most 30 characters long')
      .matches(
        /^[a-zA-Z0-9_ ]+$/,
        'Only letters, numbers, underscores, and spaces are allowed.'
      )
      .required('Title is required'),
    description: Yup.string()
      .min(20, 'Description should be at least 20 characters long')
      .max(300, 'Description should be at most 300 characters long')
      .required('Description is required'),
    category: Yup.string().required('Category is required'),
    image1: Yup.string().required('Image 1 is required'),
    image2: Yup.string(),
    image3: Yup.string(),
    image4: Yup.string(),
    daily: Yup.number()
      .min(1, 'Price should be at least 1')
      .max(10000, 'Price should be at most 10000')
      .typeError('Price must be a number')
      .required('Price is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('category', values.category);
      formData.append('daily', values.daily);
      formData.append('images', values.image1);
      if (values.image2) formData.append('images', values.image2);
      if (values.image3) formData.append('images', values.image3);
      if (values.image4) formData.append('images', values.image4);

      try {
        await postProduct(token, formData);

        // Close the modal using DOM manipulation
        const modalElement = document.getElementById('productModal');
        if (modalElement) {
          // Remove modal-specific classes and styles
          modalElement.classList.remove('show');
          modalElement.style.display = 'none';

          // Remove the backdrop
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.parentNode.removeChild(backdrop);
          }

          // Enable scrolling on body
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }

        formik.resetForm();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleModalClose = () => {
    formik.resetForm();
  };

  return (
    <div
      className="modal modal-lg fade col-10"
      id="productModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content" style={{ backgroundColor: 'white' }}>
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Rent your product
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleModalClose}
            />
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <TextInput type="text" label="Title" id="name" formik={formik} />
              <TextInput
                type="text"
                label="Description"
                id="description"
                formik={formik}
              />
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className={`form-select ${
                    formik.touched.category && formik.errors.category
                      ? 'is-invalid'
                      : ''
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.category}
                >
                  <option value="">Select a category</option>
                  {categories &&
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <div className="invalid-feedback">
                    {formik.errors.category}
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-start">
                <FileInput
                  label="Main Image"
                  fieldName="image1"
                  formik={formik}
                />
              </div>
              <label className="h6">Additional Images</label>
              <div className="d-flex flex-column flex-lg-row justify-content-between">
                <FileInput label="Image 1" fieldName="image2" formik={formik} />
                <FileInput label="Image 2" fieldName="image3" formik={formik} />
                <FileInput label="Image 3" fieldName="image4" formik={formik} />
              </div>
              <TextInput
                type="number"
                label="Price"
                id="daily"
                formik={formik}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleModalClose}
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Rent
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
