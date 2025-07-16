import React from 'react';
import './ListingCard.css';
import { Link } from 'react-router-dom';

export default function ListingCard({ product }) {
  return (
    <div
      className="mb-3 col-12 col-sm-6 col-md-4 col-lg-3 rounded-3"
      style={{
        boxShadow: '5px 5px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div className="card border-0">
        <div className="square-image position-relative d-block">
          <Link to={`/product/${product.id}`}>
            <img src={product.images[0]} alt="" />
          </Link>
          <h5>
            <span
              className={`position-absolute badge rounded-pill ${
                !product.confirmed
                  ? 'bg-warning'
                  : product.status === 'available'
                  ? 'bg-success'
                  : product.status === 'rented'
                  ? 'bg-danger'
                  : product.status === 'unavailable'
                  ? 'bg-secondary'
                  : ''
              }`}
              style={{
                left: '10px',
                top: '10px',
              }}
            >
              {product.confirmed ? product.status : 'not confirmed'}
            </span>
          </h5>
        </div>
        <div className="card-body">
          <Link
            className="card-title text-nowrap overflow-hidden fw-bold h4 text-center text-decoration-none d-block"
            to={`/product/${product.id}`}
          >
            {product.name}
          </Link>
          <div className="d-flex flex-column justify-content-between">
            <p className="card-title h5 mt-1">
              Listed on {new Date(product.createdAt).toLocaleDateString()}
            </p>
            <p className="card-title h5 mt-1">EGP {product.daily}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
