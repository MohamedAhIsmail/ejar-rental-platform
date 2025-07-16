import React, { useEffect, useState } from 'react';
import ejarLogo from '../../assets/logo.png';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../Store/Auth';
import useNotificationStore from '../../Store/notificationStore';
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import useWishlistStore from '../../Store/Wishlist';

const socket = io('http://localhost:3000');

export default function Navbar() {
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();
  const {
    notifications,
    hasUnread,
    fetchNotifications,
    markAsRead,
    addNotification,
  } = useNotificationStore();
  const [searchQuery, setSearchQuery] = useState('');

  let decodedToken;
  if (token) {
    decodedToken = jwtDecode(token);
  }
  const userId = decodedToken?.id;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
    e.target.reset(); // Reset the form after submission
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
const { fetchWishlist } = useWishlistStore();

useEffect(() => {
  if (token) {
    fetchWishlist(token);
  } else {
    // Clear wishlist when logging out
    useWishlistStore.setState({ wishlist: [], count: 0 });
  }
}, [token]);

  const { count } = useWishlistStore(); // Get wishlist count from store


  useEffect(() => {
    // Only join and set up listeners if we have a token and userId
    if (token && userId) {
      // Fetch unread notifications when the component mounts or user logs in
      fetchNotifications(token);

      // Join the user's notification channel
      socket.emit('joinUserNotifications', userId);
      console.log(userId);

      // Set up the listener for verification changes
      const handleVerificationChange = (data) => {
        console.log('Verification status notification:', data);

        if (data.isVerified) {
          toast.success(data.message);
        } else {
          toast.warning(data.message);
        // Logout the user and redirect to login page
          setTimeout(() => {
           logout();
            navigate('/login');
          }, 1500); 
        }

        // Add to notification store
        addNotification({
          _id: data.notificationId || `temp-${Date.now()}`,
          message: data.message,
          type: 'verification',
          data: data,
          createdAt: new Date().toISOString(),
          read: false,
          isTemp: !data.notificationId,
        });
      };

      // Product confirmation notification handler
      const handleProductConfirmation = (data) => {
        console.log('Product confirmation notification:', data);

        // Show toast notification
        if (data.confirmed === true) {
          toast.success(data.message);
        } else {
          toast.warning(data.message);
        }

        // Add to notification store
        addNotification({
          _id: data.notificationId || `temp-${Date.now()}`,
          message: data.message,
          type: 'product_confirmation',
          data: data,
          createdAt: new Date().toISOString(),
          read: false,
          isTemp: !data.notificationId,
        });
      };

      // Register the listener
      socket.on('userVerificationChanged', handleVerificationChange);
      // Register the product confirmation listener
      socket.on('productConfirmationChanged', handleProductConfirmation);

      // Clean up function to remove the listener when component unmounts
      return () => {
        socket.off('userVerificationChanged', handleVerificationChange);
        socket.off('productConfirmationChanged', handleProductConfirmation);
      };
    }
  }, [token, userId, fetchNotifications, addNotification]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white p-3">
        <div className="container">
          {/* Logo */}
          <div className="col-1">
            <Link to="/">
              <img src={ejarLogo} className="img-fluid" width={50} />
            </Link>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="d-flex col-9 col-lg-3 col-xl-4 col-xxl-5"
          >
            <div className="input-group">
              <input
                className="form-control bg-light rounded-start-1 border-0 ps-4"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
              <button
                type="submit"
                className="input-group-text rounded-end-1 border-0 pe-4"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>

          {/* Sandwich icon */}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
          >
            <div className="offcanvas-body">
              <ul className="navbar-nav w-100 mx-auto d-flex justify-content-around">
                <div className="d-flex flex-lg-row flex-column gap-lg-2">
                  <li className="nav-item ms-lg-3 mx-auto">
                    <Link className="nav-link" aria-current="page" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item mx-auto">
                    <Link className="nav-link" to="/product">
                      Products
                    </Link>
                  </li>
                  {token && (
                    <li className="nav-item mx-auto">
                      <Link className="nav-link" to="/requests">
                        Requests
                      </Link>
                    </li>
                  )}
                </div>
                {token && (
                  <div className="d-flex flex-lg-row flex-column gap-lg-2">
                    {/* Wishlist icon in desktop text in mobile */}
                    <li className="nav-item d-none d-lg-block">
                      <Link className="nav-link" to="/wishlist">
                        <i className="fa-regular fa-heart"></i>
                        {count > 0 && (
                    <span className="position-absolute top-25 start-75 translate-middle badge rounded-pill bg-danger">
                      {count}
                    </span>
                     )}
                   </Link>
                    </li>
                    <li className="nav-item d-block d-lg-none mx-auto">
                      <Link className="nav-link" to="/wishlist">
                        Wishlist
                        {count > 0 && (
                          <span className="badge rounded-pill bg-danger ms-1">
                      {count}
                    </span>
                     )}
                      </Link>
                    </li>

                    {/* History */}
                    <li className="nav-item d-none d-lg-block">
                      <Link className="nav-link" to="/history">
                        <i className="fa-solid fa-clock-rotate-left"></i>
                      </Link>
                    </li>
                    <li className="nav-item d-block d-lg-none mx-auto">
                      <Link className="nav-link" to="/history">
                        History
                      </Link>
                    </li>

                    {/* Messages */}
                    <li className="nav-item d-none d-lg-block">
                      <Link className="nav-link" to="/chat">
                        <i className="fa-regular fa-message"></i>
                      </Link>
                    </li>
                    <li className="nav-item d-block d-lg-none mx-auto">
                      <Link className="nav-link" to="/chat">
                        Messages
                      </Link>
                    </li>

                    {/* Notification bell icon with badge */}
                    <li className="nav-item dropdown d-none d-lg-block">
                      <a
                        className="nav-link dropdown-toggle position-relative"
                        href="#"
                        id="notificationDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fa-regular fa-bell"></i>
                        {hasUnread && (
                          <span className="position-absolute top-25 start-75 translate-middle badge rounded-pill bg-danger">
                            {notifications.length}
                            <span className="visually-hidden">
                              unread notifications
                            </span>
                          </span>
                        )}
                      </a>
                      <ul
                        className="dropdown-menu notification-dropdown"
                        aria-labelledby="notificationDropdown"
                      >
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <li
                              key={notification._id}
                              className="notification-item"
                            >
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  markAsRead(notification._id, token)
                                }
                              >
                                {notification.message}
                                <small className="text-muted d-block">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString()}
                                </small>
                              </button>
                            </li>
                          ))
                        ) : (
                          <li>
                            <span className="dropdown-item">
                              No new notifications
                            </span>
                          </li>
                        )}
                      </ul>
                    </li>

                    {/* Mobile notification with dropdown */}
                    <li className="nav-item dropdown d-block d-lg-none mx-auto">
                      <a
                        className="nav-link dropdown-toggle position-relative"
                        href="#"
                        id="mobileNotificationDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Notifications
                        {hasUnread && (
                          <span className="badge rounded-pill bg-danger ms-2">
                            {notifications.length}
                          </span>
                        )}
                      </a>
                      <ul
                        className="dropdown-menu notification-dropdown"
                        aria-labelledby="mobileNotificationDropdown"
                      >
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <li
                              key={notification._id}
                              className="notification-item"
                            >
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  markAsRead(notification._id, token)
                                }
                              >
                                {notification.message}
                                <small className="text-muted d-block">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString()}
                                </small>
                              </button>
                            </li>
                          ))
                        ) : (
                          <li>
                            <span className="dropdown-item">
                              No new notifications
                            </span>
                          </li>
                        )}
                      </ul>
                    </li>

                    {/* Profile & Logout */}
                    <li className="nav-item dropdown d-none d-lg-block">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fa-regular fa-user"></i>
                      </a>

                      <ul
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <li>
                          <Link
                            className="dropdown-item"
                            to={`/profile/${userId}`}
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={handleLogout}
                          >
                            Logout
                          </a>
                        </li>
                      </ul>
                    </li>

                    <li className="nav-item d-block d-lg-none mx-auto">
                      <Link className="nav-link" to={`/profile/${userId}`}>
                        Profile
                      </Link>
                    </li>
                    <li className="nav-item d-block d-lg-none mx-auto">
                      <a className="nav-link" href="#" onClick={handleLogout}>
                        Logout
                      </a>
                    </li>
                  </div>
                )}

                {/* List an item button */}
                <li className="nav-item mx-auto mt-3 m-lg-0">
                  {token ? (
                    <button
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#productModal"
                      className="btn btn-primary rounded-1 fw-bold"
                    >
                      List an item
                    </button>
                  ) : (
                    <>
                      <Link
                        className="btn btn-primary rounded-1 me-3 fw-bold"
                        to="/login"
                      >
                        Login
                      </Link>
                      <Link
                        className="btn btn-primary rounded-1 fw-bold"
                        to="/register"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
