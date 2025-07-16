import React from "react";
import { useEffect } from "react";
import "./HomeItemsSection.css";
import { Link } from "react-router-dom";
import useProductStore from "../../Store/productsStore";
import { MoonLoader } from "react-spinners";
import HomeCard from "../HomeCard/HomeCard";

function HomeItemsSection() {
  const { products, loading, error, fetchSortedProducts } = useProductStore();

  const maxProductsToShow = 8;

  useEffect(() => {
    fetchSortedProducts();
  }, [fetchSortedProducts]);

  const confirmedProducts = products.filter((item) => item.confirmed === true);

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = parseInt(rating, 10);
    const emptyStars = totalStars - filledStars;

    return (
      <>
        {Array(filledStars)
          .fill()
          .map((_, i) => (
            <span key={`filled-${i}`} className="star filled">
              <i className="fa-solid fa-star"></i>
            </span>
          ))}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <span key={`empty-${i}`} className="star empty">
              <i className="fa-regular fa-star"></i>
            </span>
          ))}
      </>
    );
  };


  // loader
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          width: "100%",
        }}
      >
        <MoonLoader color="#b72a67" size={80} />
        <p style={{ marginTop: 20, fontSize: "18px", color: "#555" }}>
          Loading latest items, please wait...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px 20px",
          color: "#777",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <i
          className="bi bi-cart-xbi bi-bag-x"
          style={{ fontSize: "60px", marginBottom: "20px", color: "#b72a67" }}
        ></i>
        <h2>Oops! Couldn't load items</h2>
        <p>Please check your internet connection or try again later.</p>
      </div>
    );
  }

  return (
    <div className="items-section">
      <h2 className="mb-5">Explore Our New Items</h2>

      <div >
        <div className="row">
          {confirmedProducts.slice(0, maxProductsToShow).map((item) => (
            <HomeCard key={item._id} item={item} renderStars={renderStars} />
          ))}
        </div>
      </div>

      <div className="loadmore mt-4 d-flex justify-content-center">
        <Link to="/product">
          <button className="loadmore-btn">View All Products</button>
        </Link>
      </div>
    </div>
  );
}

export default HomeItemsSection;
