import { Link } from "react-router-dom";
import "./ProductCard.css";
import useWishlistStore from "../../Store/Wishlist";
import useAuthStore from "../../Store/Auth"; //  NEW
import { toast } from "react-toastify"; //  NEW


export default function ProductCard({ product }) {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  console.log("ProductCard", product);
  

  const { token } = useAuthStore(); //  Get token
  const isWishlisted = wishlist.some((p) => p.id === (product.id || product._id)); //  Support backend data
  
  const handleToggleWishlist = async () => {
    if (!token) {
      toast.info("Please sign in or create an account to use the wishlist");
      return;
    }
  
    if (isWishlisted) {
      await removeFromWishlist(product.id || product._id, token); //  Send token
    } else {
      await addToWishlist(product, token); // Send token
    }
  };
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

  return (
    <>
      <br />
      <br />
      <br />

<div className="row g-5 overflow-hidden flex-md-row mb-4 position-relative cardProduct-container">

  <div id="imgProduct" className="col-12 col-md-auto d-flex justify-content-center">
      <img src={product.images[0]} alt="Product" />
  </div>

  <div id="data" className="col-12 col-md-6 d-flex flex-column justify-content-between">
    <div>
        <h2 id="title">{product.name}</h2>
      <h4>Description:</h4>
      <h5>{product.description.split(" ").splice(0, 15).join(" ")}</h5>
    </div>
    <h2 id="price">{product.daily} E.G</h2>
  </div>

  <div id="iconsButtons" className="col-12 col-md d-flex flex-column align-items-center align-items-md-end justify-content-between">
    <h5 onClick={handleToggleWishlist} style={{ cursor: "pointer" }}>
      <i className={`fa-heart ${isWishlisted ? "fas text-danger" : "far"}`}></i>
    </h5>
    <h5 className="d-none d-md-block">
      {product.review.length === 0 ? (
        <span className="text-star">New!</span>
      ) : renderStars(product.averageRating)}
    </h5>
    <Link to={`/product/${product._id}`} className="btn btn-secondary rent-button py-2">
      <i className="fa-solid fa-circle-info" /> Get Details
    </Link>
  </div>
</div>
    </>
  );
}
