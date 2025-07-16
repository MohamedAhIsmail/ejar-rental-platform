import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import PasswordInput from '../RegisterComponents/PasswordInput';

export default function ResetPassword() {
  const { token } = useParams(); // Get token from URL
  const [apiMessage, setApiMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Reset Password | EJAR';
  }, []);

  const formik = useFormik({
    initialValues: { newPassword: '', confirmPassword: '' },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(8, 'Password should be at least 8 characters long')
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          'Password must contain at least one uppercase, one lowercase letter, one number, and one special character'
        )
        .required('New password is required'),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          'Password must contain at least one uppercase, one lowercase letter, one number, and one special character'
        )
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      try {
        setApiMessage(null);
        setIsLoading(true);

        const response = await axios.post(
          `http://localhost:3000/api/auth/reset-password/${token}`,
          { newPassword: values.newPassword }
        );

        if (response.status === 200) {
          setApiMessage(
            '✅ Password reset successful! Redirecting to login...'
          );
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        setApiMessage(error.response?.data?.message || 'Something went wrong.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa', // optional light background
        padding: '20px',
      }}
    >
      <div className="container" style={{ maxWidth: '900px', width: '100%' }}>
        <h2
          className="text-center"
          style={{ color: '#562DDD', fontWeight: '700' }}
        >
          Reset Your Password
        </h2>
        <p className="text-center">Enter your new password below.</p>

        {apiMessage && (
          <div className="alert alert-info text-center">{apiMessage}</div>
        )}

        <form onSubmit={formik.handleSubmit} className="row g-3">
          {/* NEW PASSWORD */}
          <div className="col-12">
            <PasswordInput
              label="New Password"
              id="newPassword"
              formik={formik}
            />
          </div>
          {/* CONFIRM PASSWORD */}
          <div className="col-12">
            <PasswordInput
              label="Confirm New Password"
              id="confirmPassword"
              formik={formik}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="col-12 text-center">
            <button
              type="submit"
              className="btn"
              disabled={isLoading}
              style={{
                backgroundColor: '#562DDD',
                color: 'white',
                width: '70%',
                fontSize: '20px',
                fontWeight: 'bold',
                marginTop: '10px',
                marginBottom: '15px',
              }}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Updating...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
