import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useWishlistStore from '../../Store/Wishlist';
import useAuthStore from '../../Store/Auth';
import axios from 'axios';
import ItemCard from '../../components/ItemCard/ItemCard';
import { MoonLoader } from 'react-spinners';

export default function Wishlist() {
  const { token } = useAuthStore();
  const {
    wishlist,
    fetchWishlist,
    removeFromWishlist,
    clearWishlist,
    addToWishlist,
  } = useWishlistStore();

  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [recommendError, setRecommendError] = useState(null);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [wishlistError, setWishlistError] = useState(null);

  useEffect(() => {
    document.title = 'Wishlist | EJAR';
  }, []);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!token) return;
      try {
        setLoadingWishlist(true);
        setWishlistError(null);
        await fetchWishlist(token);
      } catch (err) {
        console.error('Error fetching wishlist:', err.message);
        setWishlistError('Oops! Couldn’t load your wishlist.');
      } finally {
        setLoadingWishlist(false);
      }
    };

    loadWishlist();
  }, [token]);

  useEffect(() => {
    if (wishlist.length === 0) return;

    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true);
        setRecommendError(null);

        const res = await axios.get('http://localhost:3000/api/product');
        const confirmed = res.data.data.filter((p) => p.confirmed === true);

        const wishlistIds = wishlist.map((w) => w.id);
        const related = confirmed.filter(
          (item) => !wishlistIds.includes(item._id)
        );

        setRecommendedItems(related.slice(0, 4));
      } catch (err) {
        console.error('Error fetching related items:', err.message);
        setRecommendError(
          'Failed to load related items. Please try again later.'
        );
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [wishlist]);

  const handleAddToWishlist = (item) => {
    const itemWithCategoryId = {
      ...item,
      category: item.category?._id || item.category,
    };

    addToWishlist(itemWithCategoryId, token);
    setRecommendedItems((prev) =>
      prev.filter((relatedItem) => relatedItem._id !== item._id)
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <i
        key={i}
        className={`fa-star ${i < rating ? 'fa-solid' : 'fa-regular'}`}
        style={{ color: i < rating ? '#ffc107' : '#ddd' }}
      ></i>
    ));
  };
  if (!token) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center text-center"
        style={{
          height: '60vh',
          color: '#777',
          textAlign: 'center',
          padding: '50px 20px',
          color: '#777',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
        }}
      >
        <i
          className="fa-regular fa-heart"
          style={{ fontSize: '70px', marginBottom: '20px', color: '#b72a67' }}
        ></i>
        <h2>You're not logged in</h2>
        <p> Please log in to view your wishlist.</p>

        <Link
          to="/login"
          className="btn mt-3 px-4 py-2 d-inline-flex align-items-center justify-content-center gap-2"
          style={{
            backgroundColor: '#562DDD',
            color: '#fff',
            borderRadius: '12px',
            fontWeight: 500,
            fontSize: '1rem',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#3f1fa7')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#562DDD')
          }
        >
          <i className="fa-solid fa-arrow-right-to-bracket"></i>
          <span>Login</span>
        </Link>
      </div>
    );
  }

  if (loadingWishlist) {
    return (
      <div
        className="container mt-4 wishlist-page d-flex flex-column justify-content-center align-items-center"
        style={{ height: '60vh' }}
      >
        <MoonLoader color="#b72a67" size={80} />
        <p className="mt-3 text-muted fs-5">
          Loading your wishlist, please wait...
        </p>
      </div>
    );
  }

  if (wishlistError) {
    return (
      <div
        className="container mt-4 wishlist-page d-flex flex-column justify-content-center align-items-center text-center"
        style={{ height: '60vh' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
            color: '#777',
            textAlign: 'center',
          }}
        >
          <i
            className="fa-solid fa-circle-exclamation"
            style={{ fontSize: '60px', color: '#b72a67', marginBottom: '20px' }}
          ></i>
          <h2>Oops! Couldn’t load your wishlist</h2>
          <p>Please check your internet connection or try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 wishlist-page">
      {/* ===== Header ===== */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h1 style={{ color: '#562DDD', fontWeight: 600, fontSize: '2.2rem' }}>
          Wishlist ({wishlist.length})
        </h1>

        {wishlist.length > 0 && (
          <button
            onClick={() => clearWishlist(token)}
            style={{
              backgroundColor: '#562DDD',
              color: '#fff',
              fontWeight: 400,
              fontSize: '1rem',
              padding: '0.6rem 1.2rem',
              borderRadius: '12px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#3f1fa7')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#562DDD')
            }
          >
            <i className="fa-solid fa-trash"></i> Clear All
          </button>
        )}
      </div>

      <hr />

      {wishlist.length > 0 ? (
        <>
          <div className="row gy-4 mb-5 mt-4">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="col-sm-6 col-md-4 col-lg-3 d-flex"
              >
                <div
                  className="w-100 position-relative"
                  style={{
                    position: 'relative',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    padding: '16px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {product.review.length === 0 && (
                    <span
                      className="position-absolute top-0 start-0 m-2 badge"
                      style={{ backgroundColor: '#06c954' }}
                    >
                      New
                    </span>
                  )}

                  <button
                    onClick={() => removeFromWishlist(product.id, token)}
                    className="position-absolute top-0 end-0 m-2"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      zIndex: 2,
                      fontSize: '1.25rem',
                      transition: 'transform 0.2s ease-in-out',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = 'scale(1.2)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = 'scale(1)')
                    }
                  >
                    <i className="fa-solid fa-trash text-danger"></i>
                  </button>

                  <div className="text-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        objectFit: 'contain',
                        borderRadius: '5px',
                        backgroundColor: '#f8f9fa',
                      }}
                    />
                  </div>

                  <h3
                    className="mt-3 mb-0 fs-6 fw-semibold text-center"
                    style={{ minHeight: '3.4rem' }}
                  >
                    {product.name}
                  </h3>

                  <div className="d-flex justify-content-center gap-3 mt-2 align-items-center">
                    <p className="fw-bold mb-0">EGP {product.daily}</p>
                    <div className="d-flex flex-column align-items-center gap-1 small">
                      <div className="d-flex align-items-center gap-1">
                        {renderStars(product.averageRating)}
                        <span
                          className="text-muted"
                          style={{ fontSize: '0.85rem' }}
                        >
                          {product.averageRating?.toFixed(1)} / 5
                        </span>
                      </div>
                      <div
                        className="text-muted"
                        style={{ fontSize: '0.8rem' }}
                      >
                        {product.review.length}{' '}
                        {product.review.length === 1 ? 'review' : 'reviews'}
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow-1" />

                  <Link
                    to={`/product/${product.id}`}
                    className="btn btn-outline-dark w-100 mt-3"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <i className="fa-solid fa-eye"></i> See Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Related Products */}
          <div className="col-12 my-5">
            <hr />
            <h4 className="mb-4 text-center" style={{ color: '#562DDD' }}>
              Explore More Products
            </h4>

            {loadingRecommendations ? (
              <div className="d-flex flex-column align-items-center justify-content-center my-5">
                <MoonLoader color="#562DDD" size={60} />
                <p className="text-muted mt-3">Loading more products...</p>
              </div>
            ) : recommendError ? (
              <div className="d-flex flex-column justify-content-center align-items-center text-center my-5">
                <i
                  className="fa-solid fa-circle-exclamation"
                  style={{ fontSize: '48px', color: '#dc3545' }}
                ></i>
                <h5 className="mt-3 text-danger">
                  Unable to load recommendations
                </h5>
                <p className="text-muted mb-0">{recommendError}</p>
              </div>
            ) : recommendedItems.length > 0 ? (
              <div className="row">
                {recommendedItems.map((product) => (
                  <div key={product._id} className="col-md-3 col-sm-12 mb-4">
                    <ItemCard
                      item={product}
                      onAddToWishlist={handleAddToWishlist}
                      renderStars={renderStars}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted mt-5">
                No additional products found.
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '50px 20px',
            color: '#777',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
          }}
        >
          <i
            className="fa-regular fa-heart"
            style={{ fontSize: '70px', marginBottom: '20px', color: '#b72a67' }}
          ></i>
          <h2>Your wishlist is empty</h2>
          <p>Start exploring and add products you love!</p>
          <Link
            to="/"
            className="btn mt-3"
            style={{
              backgroundColor: '#562DDD',
              color: '#fff',
              fontWeight: 500,
              padding: '0.6rem 1.2rem',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#3f1fa7')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = '#562DDD')
            }
          >
            <i className="fa-solid fa-arrow-right-to-bracket"></i> Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
