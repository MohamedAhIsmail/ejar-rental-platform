import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useProductStore } from "../../Store/Deatils";
import useProfileStore from "../../Store/profile";

const Reviews = () => {
  const { product } = useProductStore();

  let rev = product?.data?.review || [];

  const [showAll, setShowAll] = useState(false);

  return (
    <div className="container mt-5">
      <h4 className="mb-3">
        Reviews <span className="badge bg-danger">{rev.length}</span>
      </h4>


      

      {rev.slice(0, showAll ? rev.length : 2).map((review) => (
        <div key={review._id} className="d-flex align-items-start mb-4">
        <Link to={`/profile/${review.createdBy._id}`}>
        
            {review?.createdBy?.profilePicture ? (

              <div>

                <img
                  src={review?.createdBy?.profilePicture}
                  alt={review?.createdBy?.userName}
                  className="rounded-circle me-3"
                  width={50}
                  height={50}
                />

              </div>
            ) : (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: "#007bff",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                {review?.createdBy?.userName?.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>

          <div className="w-100">
            <div className="d-flex justify-content-between">
              <div>
                <Link className="nav-link" to={`/profile/${review.createdBy._id}`}>
                  <h6 className="mb-0">{review?.createdBy?.userName}</h6>
                </Link>
                <p className="mt-2">{review.comment}</p>
              </div>
              <div>
                <h6 className="text-muted">
                  {new Date(review.createdAt).toLocaleDateString()}
                </h6>
                {Array.from({ length: 5 }, (_, i) => (
                  <i
                    key={i}
                    className={`fa-star ${
                      i + 1 <= review.rating ? "fas" : "far"
                    }`}
                    style={{
                      color: i + 1 <= review.rating ? "gold" : "lightgray",
                    }}
                  ></i>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {!showAll && rev.length > 2 && (
        <div className="text-center">
          <button
            className="btn text-primary text-decoration-none fw-bold"
            onClick={() => setShowAll(true)}
          >
            Show All ⬇
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
