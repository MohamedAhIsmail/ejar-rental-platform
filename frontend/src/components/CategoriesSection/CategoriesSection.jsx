import React, { useEffect } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import useCategoryStore from '../../Store/categoryStore';
import './CategoriesSection.css';
import { MoonLoader } from "react-spinners";

function CategoriesSection() {
  const { categories, loading, error, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    rows: 1,
    slidesPerRow: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          rows: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 2, rows: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2, slidesToScroll: 1, rows: 2 },
      },
    ],
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex",flexDirection: "column", justifyContent: "center", alignItems: "center", height: "50vh", width: "100%",}}
      >
        <MoonLoader color="#b72a67" size={80} />
        <p style={{ marginTop: 20, fontSize: "16px", color: "#555" }}>
          Loading categories, please wait...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{  textAlign: "center",  padding: "50px 20px", color: "#777",  display: "flex", flexDirection: "column", 
          justifyContent: "center",  alignItems: "center",  height: "50vh",  }}
      >
      
        <i
          className="bi bi-grid-1x2-fill"
          style={{ fontSize: "60px", marginBottom: "20px", color: "#b72a67" }}
        ></i>
        <h2>Oops! Couldn't load categories</h2>
        <p>Please check your connection or try again later.</p>
      </div>
    );
  }

  return (
    <div className="category">
      <h2 className="ms-2">Browse By Category</h2>
      <Slider {...settings}>
        {categories.map((category) => (

          <Link
            key={category._id}
            className="nav-link"
            to={`/product?category=${category._id}`}
          >
            <div className="cat mb-4">
              <i className={`fa-solid ${category.icon} fs-1`}></i>
              <h3 className="mt-3 mb-0 fs-5 fw-normal text-capitalize">{category.name}</h3>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
}

export default CategoriesSection;
