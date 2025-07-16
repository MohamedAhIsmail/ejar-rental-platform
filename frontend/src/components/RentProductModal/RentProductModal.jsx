import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuthStore from '../../Store/Auth';
import { useParams } from 'react-router-dom';
import useProcessStore from '../../Store/process';

export default function RentProductModal() {
  const { id: productId } = useParams();
  const { token } = useAuthStore();
  const { postProcess } = useProcessStore();

  const initialValues = {
    startDate: '',
    endDate: '',
    price: 0,
  };

  const validationSchema = Yup.object({
    startDate: Yup.date()
      .required('Start date is required')
      .min(new Date(), 'Start date must be in the future'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date')
      .test(
        'is-greater',
        'End date must be greater than start date',
        function (value) {
          const { startDate } = this.parent;
          return !startDate || !value || new Date(value) > new Date(startDate);
        }
      ),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be a positive number'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const updatedData = {
        startDate: values.startDate,
        endDate: values.endDate,
        price: values.price,
      };
      try {
        await postProcess(productId, updatedData, token);

        // Close the modal using DOM manipulation
        const modalElement = document.getElementById('rentModal');
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
        console.log(error);
      }
    },
  });

  return (
    <div
      className="modal fade"
      id="rentModal"
      tabIndex={-1}
      aria-labelledby="rentModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="rentModalLabel">
              Rent Product
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <label htmlFor="startDate" className="form-label">
                  Start Date
                </label>
                <input
                  type="date"
                  className={`form-control ${
                    formik.touched.startDate && formik.errors.startDate
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="startDate"
                  name="startDate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.startDate}
                />
                {formik.touched.startDate && formik.errors.startDate && (
                  <div className="invalid-feedback">
                    {formik.errors.startDate}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  className={`form-control ${
                    formik.touched.endDate && formik.errors.endDate
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="endDate"
                  name="endDate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.endDate}
                />
                {formik.touched.endDate && formik.errors.endDate && (
                  <div className="invalid-feedback">
                    {formik.errors.endDate}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  className={`form-control ${
                    formik.touched.price && formik.errors.price
                      ? 'is-invalid'
                      : ''
                  }`}
                  id="price"
                  name="price"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                />
                {formik.touched.price && formik.errors.price && (
                  <div className="invalid-feedback">{formik.errors.price}</div>
                )}
              </div>

              <div className="mb-3">+ 20 EGP delivery fees</div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Rent Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
