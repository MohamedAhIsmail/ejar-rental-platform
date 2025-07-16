import React, { useEffect } from 'react';
import ListingCard from '../ListingCard/ListingCard';
import products from '../../assets/products.json';
import useProductStore from '../../Store/product';
import useAuthStore from '../../Store/Auth';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Listings() {
  const { id: userId } = useParams();
  const { userProducts, getUserProducts } = useProductStore();
  const { token } = useAuthStore();
  const tokenId = jwtDecode(token);
  let confirmedProducts = userProducts;

  useEffect(() => {
    getUserProducts(token, userId);
  }, [getUserProducts, token, userId]);

  if (tokenId.id !== userId) {
    confirmedProducts = userProducts.filter((item) => item.confirmed === true);
  }

  return (
    <div className="container">
      <h2 className="my-5 border-bottom pb-3 text-center text-lg-start">
        Listings
      </h2>
      <div className="row gx-5 mx-5">
        {userProducts.length === 0 ? (
          <div className="text-center" style={{ color: '#777' }}>
            <i
              className="bi bi-card-list"
              style={{
                fontSize: '60px',
                marginBottom: '20px',
                color: '#b72a67',
              }}
            />
            <h3 className="h1">No Listings Found</h3>
            <p>Try adding a new product or check back later.</p>
          </div>
        ) : (
          <div className="row d-flex flex-row flex-wrap justify-content-center justify-content-lg-start">
            {confirmedProducts.map((product) => (
              <ListingCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
