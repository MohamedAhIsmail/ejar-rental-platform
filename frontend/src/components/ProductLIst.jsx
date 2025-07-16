import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard/ProductCard";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Pagination, Stack } from "@mui/material";
import { MoonLoader } from "react-spinners"; 

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const query = useQuery();
  const categoryName = query.get("category"); // Get category from query params
  const [page, setPage] = useState(1); // Track the current page
  const productsPerPage = 4; // Number of products per page
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true); // Set loading state to true
      const response = await axios.get(`http://localhost:3000/api/product`, {
        params: categoryName ? { category: categoryName } : {}, // If no category, fetch all products
      });

      setProducts(response.data.data);
      console.log(response.data.data);
      
    } catch (err) {
      console.log("Error fetching products:", err.message);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  useEffect(() => {
    fetchProducts();
    
  }, [categoryName]); // Runs when categoryName changes

  const confirmedProducts = products.filter(
    (item) => item.confirmed === true
  );

console.log(
  confirmedProducts,
    "confirmedProducts"
  );

  // Calculate the products to be displayed on the current page
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = confirmedProducts.slice(startIndex, endIndex);

  console.log(currentProducts, "currentProducts");
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
    
  return (
    <>
      {isLoading ? (
  <div
  style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "70vh", width: "100%", }}
>
    <MoonLoader color="#b72a67 " size={100} />
    <p style={{ marginTop: 20, fontSize: "18px", color: "#555" }}>
      Loading products, please wait...
    </p>

  </div>
        ) : currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div
          style={{ textAlign: "center", padding: "50px 20px", color: "#777",  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "60vh"   }}
        >
        <i
          className="bi bi-box-seam"
          style={{ fontSize: "60px", marginBottom: "20px", color: "#b72a67" }}
        ></i>
          <h2>No products found in this category</h2>
          <p>Try exploring a different category or check back later!</p>
        </div>
        
        )}

      <Stack
        spacing={2}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Pagination
          onChange={handlePageChange}
          count={Math.ceil(confirmedProducts.length / productsPerPage)}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </>
  );
}
