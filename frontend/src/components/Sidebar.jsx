import React, { useEffect, useState } from "react";
import useCategoryStore from "../Store/categoryStore";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css"; // 👈 Make sure to create/import this CSS
// import  banner from "../assets/a1.png";

export default function Sidebar() {
  const { categories, fetchCategories } = useCategoryStore();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [allCatgoryClicked, setallCatgoryClicked] = useState(false)

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleClick = (id) => {
    setSelectedId(id); // تغيير حالة العنصر المحدد
    setallCatgoryClicked(false); // عند النقر على فئة، نلغي تفعيل All Categories

  };

  const handleAllCategoriesClick = () => {
    setallCatgoryClicked(true); // تفعيل الـ background لـ "All Categories"
    console.log(allCatgoryClicked);
    setSelectedId(null)

  };




  return (
      <div className="">
        <div className="sidebar-header">
          <svg className="bi pe-none me-2" width="30" height="24">
            <use xlinkHref="#bootstrap"></use>
          </svg>
          <span className="sidebar-title">Categories</span>
        </div>


        <ul className="category-list">
        <button
          onClick={() =>
            {navigate("/product");
            handleAllCategoriesClick()
            
          }}
          className={`sidebar-button ${allCatgoryClicked ?"clicked" : ""}`}
          >
          <i className={`fa-solid fa-layer-group sidebar-icon ${allCatgoryClicked ? "clicked" : ""}`}></i>
          All Categories
        </button>

          {categories.map((category) => (
            <li key={category._id}>
             
              <button
              onClick={() => {
                navigate(`/product?category=${category._id}`);
                handleClick(category._id)
              }}
                className={`sidebar-button ${selectedId === category._id ? "clicked" : ""}`}

              >
                <i className={`fa-solid ${category.icon} sidebar-icon ${selectedId === category._id ? "clicked" : ""} `}></i>
                {category.name.charAt(0).toUpperCase() +
                  category.name.slice(1).toLowerCase()}
              </button>

            </li>
          ))}
        </ul>

        {/* <div className="sidebar-banner">
          <img
            src={banner}
            className=""
            alt="Banner"
          />
        </div> */}
      </div>
  );
}
