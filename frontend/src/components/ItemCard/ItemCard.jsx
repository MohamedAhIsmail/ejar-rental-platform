import React from "react";
import { Link } from "react-router-dom";
import useWishlistStore from "../../Store/Wishlist";
import "./ItemCard.css";
import { useProductStore } from "../../Store/Deatils";
import useAuthStore from "../../Store/Auth"; //  NEW
import { toast } from "react-toastify";     //  NEW

function ItemCard({ item, renderStars }) {
  const handleFetchProduct = (id) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetchProduct(id);
  };

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { fetchProduct } = useProductStore();
  const { token } = useAuthStore(); //  Get token

  const isWishlisted = wishlist.some((p) => p.id === item._id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();

    if (!token) {
      toast.info("Please sign in or create an account to use the wishlist");
      return;
    }

    isWishlisted
      ? removeFromWishlist(item._id, token) //  pass token
      : addToWishlist(item, token);         // pass token
  };


  return (
    <>
      <div className="item mb-4">
      <div className="card-icons">
          <div>
            <div onClick={handleToggleWishlist} style={{ cursor: "pointer" }}>
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
            <img src={item.images[0]} alt={item.name} />
          </div>

          <h3 className="mt-3 mb-0 fs-6 fw-normal text-center text-md-start item-name">{item.name}</h3>

        </Link>

        <div className="d-flex gap-3 mt-2 flex-column flex-md-row align-items-center align-items-md-start text-center text-md-start">
  <p className="price fw-bold m-0">EGP {item.daily}</p>
  {item.averageRating === 0 ? (
    <div className="newItem m-0">NEW!</div>
  ) : (
    <div className="rating d-flex gap-3 m-0">
      <div className="m-0">{renderStars(item.averageRating)}</div>
      <p className="m-0">{`(${item.review.length})`}</p>
    </div>
  )}
</div>

      </div>
    </>
  );
}

export default ItemCard;
