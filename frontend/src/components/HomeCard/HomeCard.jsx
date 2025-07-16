import React from "react";
import { Link } from "react-router-dom";
import useWishlistStore from "../../Store/Wishlist";
import "./HomeCard.css";
import { useProductStore } from "../../Store/Deatils";
import useAuthStore from "../../Store/Auth"; //  NEW
import { toast } from "react-toastify";     //  NEW


function HomeCard({ item, renderStars }) {
  const handleFetchProduct = (id) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetchProduct(id);
  };

  const { fetchProduct } = useProductStore();
  const { token } = useAuthStore(); // Get token
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const isWishlisted = wishlist.some((p) => p.id === item._id);
  const handleToggleWishlist = (e) => {
    e.preventDefault();
  
    if (!token) {
      toast.info("Please sign in or create an account to use the wishlist");
      return;
    }
  
    if (isWishlisted) {
      removeFromWishlist(item._id, token); //  pass token
    } else {
      addToWishlist(item, token); //  pass token
    }
  };
  

  return (
    <div className="col-sm-6 col-md-4 col-lg-3">
      <div className="home-card mb-4"> 

      <div className="card-icons">
          <div>
            <div className="icon" onClick={handleToggleWishlist} style={{ cursor: "pointer" }}>
              <i
                className={`fa-heart ${isWishlisted ? "fas text-danger" : "far"}`}
              ></i>
            </div>
          </div>
        </div>

        <Link
          onClick={() => handleFetchProduct(item._id)}
          className="nav-link"
          to={`/product/${item._id}`}
        >
          <div className="image square-image">
            <img className="img-fluid" src={item.images[0]} alt={item.name} />
          </div>
          <h2 className="fs-5 mt-3 item-name">{item.name}</h2>
        </Link>
        <div className="d-flex gap-3 mt-2 justify-content-between" >
          <p className="price fw-bold m-0">EGP {item.daily}</p>
          {item.averageRating === 0 ? (
            <div className="newItem m-0">NEW!</div>
          ) : (
            <div className="rating d-flex gap-2 m-0">
              <div className="m-0">{renderStars(item.averageRating)}</div>
              <p className="m-0">{`(${item.review.length})`}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeCard;
