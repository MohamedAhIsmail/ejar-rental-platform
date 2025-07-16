import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import TextInput from '../../components/RegisterComponents/TextInput';
import PasswordInput from '../../components/RegisterComponents/PasswordInput';
import useAuthStore from '../../Store/Auth';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import ejarLogo from '../../assets/logo.png';
import { toast } from 'react-toastify';

export default function Login() {
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuthStore();
  const message = location.state?.message || null;

  // SECURITY: Block token-in-URL issue from affecting React login
  useEffect(() => {
    document.title = 'Login | EJAR';

    const query = new URLSearchParams(window.location.search);
    if (query.has('token')) {
      console.warn('Token in URL detected — clearing it from React app');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (message) {
      toast.warn(message);
    }
  }, [message]);

  const formik = useFormik({
    initialValues: {
      identifier: '', //  Accepts email or phone
      password: '',
      rememberMe: false,
    },
    validationSchema: Yup.object({
      identifier: Yup.string()
        .test('is-valid-identifier', function (value) {
          if (!value) {
            return this.createError({
              message: 'Email or phone number is required.',
            });
          }
          // Check if it's a valid email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(value)) {
            return true; // Valid email
          }
          const phoneRegex = /^01[0125][0-9]{8}$/; // Egyptian phone number format
          if (phoneRegex.test(value)) {
            return true; // Valid phone number
          }

          return this.createError({
            message:
              'Invalid format. Use a valid email (e.g., user@example.com) or a valid Egyptian number (01xxxxxxxxx).',
          });
        })
        .required('Email or phone number is required.'),
      password: Yup.string()
        .min(8, 'Password should be at least 8 characters long')
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          'Password must contain at least one uppercase, one lowercase letter, one number, and one special character'
        )
        .required('password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setApiError(null);
        setIsLoading(true);

        const response = await axios.post(
          'http://localhost:3000/api/auth/login',
          {
            identifier: values.identifier, // Send email OR phone
            password: values.password,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (response.status === 200) {
          console.log('Login Successful:', response.data);
          const token = response.data.token;
          // Store token in Zustand(and local/session storage depending on rememberMe)
          setToken(response.data.token, values.rememberMe);
          // Decode token
          const decoded = jwtDecode(token);
          console.log('Decoded token:', decoded);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (error) {
        console.error('API Error:', error.response?.data);
        setApiError(error.response?.data?.message || 'Invalid credentials.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        setIsLoading(false);
        setSubmitting(false);
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
      }}
    >
      <div className="container" style={{ maxWidth: '900px', width: '100%' }}>
        <div className="text-center mb-3">
          <Link to="/">
            <img
              src={ejarLogo}
              alt="Ejar Logo"
              style={{
                height: '80px',
                cursor: 'pointer',
                marginBottom: '50px',
              }}
            />
          </Link>
        </div>

        <h2
          className="text-left"
          style={{
            color: '#562DDD',
            fontSize: '34px',
            fontWeight: 700,
            marginBottom: '20px',
          }}
        >
          Log in to Ejar
        </h2>

        {apiError && (
          <div className="alert alert-danger text-center">{apiError}</div>
        )}

        <form onSubmit={formik.handleSubmit} className="row g-3">
          {/* IDENTIFIER (EMAIL or PHONE) */}
          <div className="col-12">
            <TextInput
              label="Email or Phone Number"
              id="identifier"
              formik={formik}
            />
          </div>

          {/* PASSWORD */}
          <div className="col-12">
            <PasswordInput label="Password" id="password" formik={formik} />
          </div>

          {/* REMEMBER ME CHECKBOX */}
          <div className="col-12">
            <div className="form-check">
              <input
                type="checkbox"
                id="rememberMe"
                className="form-check-input"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />
              <label
                className="form-check-label"
                htmlFor="rememberMe"
                style={{ fontSize: '16px' }}
              >
                Remember Me
              </label>
            </div>
          </div>

          <div className="col-12 text-center">
            <button
              type="submit"
              className="btn"
              disabled={isLoading}
              style={{
                backgroundColor: '#562DDD',
                color: 'white',
                width: '70%',
                fontSize: '22px',
                marginTop: '5px',
                marginBottom: '10px',
              }}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                'Log In'
              )}
            </button>
            {/* FORGOT PASSWORD & REGISTER LINKS */}
            <p className="text-center mt-2">
              <span
                className="text-danger"
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </span>
            </p>

            <p className="mt-3" style={{ fontSize: '16px' }}>
              Don't have account ?{' '}
              <span
                onClick={() => navigate('/register')}
                style={{
                  color: '#5A3FFF',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                register
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
