import "./relatedItem.css";
import { Link, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useProductStore } from "../../Store/Deatils";
import ItemCard from "../ItemCard/ItemCard";
import { MoonLoader } from "react-spinners";

const RelatedProducts = () => {
  const { product, getAllProd, productList,isLoading ,err } = useProductStore();

  useEffect(() => {
    if (product?.data?.category) {
      getAllProd(product.data.category._id);
    }
  }, [product]);

  const relatedProducts = productList.filter(
    (p) => p._id !== product?.data?._id && p.confirmed === true
  );

 





  return ( <>
  
  <h5 className="text-danger fw-bold text-center related-title">Related Item</h5>
    <div className="container my-5">
<div className="row">
     {isLoading ? (
  <div className="text-center w-100 py-4">
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
        Loading latest Products, please wait...
      </p>
    </div>
  </div>
) : err ? (
  
  <div className="text-center w-100 py-4">
    <div
      style={{
        textAlign: "center",
        padding: "50px 20px",
        color: "#777",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <i
        className="bi bi-cart-xbi bi-bag-x"
        style={{ fontSize: "60px", marginBottom: "20px", color: "#b72a67" }}
      ></i>
      <h2>Oops! Couldn't load Related items</h2>
      <p>Please check your internet connection or try again later.</p>
    </div>
  </div>
) : relatedProducts.length === 0 ? (
  
  <div className="text-center w-100 py-4">
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
        className="bi bi-search"
        style={{ fontSize: "60px", marginBottom: "20px", color: "#b72a67" }}
      ></i>
      <h2>No related items found</h2>
      <p>Try another category or check back later.</p>
    </div>
  </div>
) : (

  relatedProducts.map((product) => (
    <div key={product._id} className="col-md-3 col-sm-12">
      <ItemCard
        item={product}
        renderStars={(rating) =>
          Array.from({ length: 5 }, (_, i) => (
            <i
              key={i}
              className={`fa-star ${i + 1 <= rating ? "fas" : "far"}`}
              style={{ color: i + 1 <= rating ? "gold" : "lightgray" }}
            ></i>
          ))
        }
      />
    </div>
  ))
)}
   
  </div>
    </div>
  </>

  );
};

export default RelatedProducts;
