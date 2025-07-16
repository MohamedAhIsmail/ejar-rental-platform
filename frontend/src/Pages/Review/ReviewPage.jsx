import React, { useEffect, useLayoutEffect, useState } from "react";
import useProcessStore from "../../Store/process";
import ReviewModl from "./ReviewModel";
import "./ReviewPage.css";
import axios from "axios";
import useAuthStore from "../../Store/Auth";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";

const ReviewPage = () => {
  const { getFinishedProcesses, finishedProcesses } = useProcessStore();
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchAllUserReviews = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/review/${userId}`);
      console.log("Response from API:", res); // طباعة الـ response كاملاً
      const productIds = res.data.foundedReview.map(
        (review) => review.prodid?._id
      );
      setReviewedProducts(productIds);
      console.log(reviewedProducts);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching reviews");
      console.error("Error fetching reviews:", err.message);
    }
  };

  useEffect(() => {
    document.title = "History | EJAR";
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await getFinishedProcesses(token);
      setIsLoading(false);
    };
    load();
  }, []);

  useLayoutEffect(() => {
    getFinishedProcesses(token);
    console.log("userProcesses", finishedProcesses);
  }, []);

  useLayoutEffect(() => {
    if (finishedProcesses.length > 0) {
      const userId = finishedProcesses[0]?.renterId?._id;
      if (userId) {
        fetchAllUserReviews(userId);
      }
    }
  }, [finishedProcesses]);

  return (
    <>
      <div className="container">
        <h2 className="my-3"> Products You Rented</h2>
        <h5 className="text-muted">
          Help us improve our website and give an honest review for your recent
          rentals
        </h5>
        <br />
        <div className="row">
          {isLoading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
                width: "100%",
              }}
            >
              <MoonLoader color="#b72a67" size={100} />
              <p style={{ marginTop: 20, fontSize: "18px", color: "#555" }}>
                Loading your rented orders...
              </p>
            </div>
          ) : finishedProcesses.length === 0 ? (
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
                className="bi bi-clipboard-x	"
                style={{
                  fontSize: "60px",
                  marginBottom: "20px",
                  color: "#b72a67",
                }}
              ></i>
              <h2>No rented orders found</h2>
              <p>Looks like you haven't rented anything yet.</p>
            </div>
          ) : (
            finishedProcesses.map((item) => (
              <>
                <div className="col-md-3" key={item._id}>
                  <div
                    className="w-100 position-relative"
                    style={{
                      position: "relative",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                      padding: "16px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div className="text-center my-2">
                      <img
                        src={item.productId.images[0]}
                        alt={item.productId.name}
                        className="card-img-top"
                        style={{
                          width: "100%",
                          aspectRatio: "1 / 1",
                          objectFit: "contain",
                          borderRadius: "5px",
                          backgroundColor: "#f8f9fa",
                        }}
                      />
                    </div>
                    <div className="card-body my-2">
                      <h2 className="card-title my-3">{item.productId.name}</h2>
                      <h4
                        style={{ color: "#B72A67" }}
                        className="card-price mx-4 my-2"
                      >
                        EGP {item.price}
                      </h4>
                      <h6 className="card-text mx-4">
                        Start Date:{" "}
                        {new Date(item.startDate).toLocaleDateString()}
                      </h6>
                      <h5 className="card-text mx-4">
                        End Date: {new Date(item.endDate).toLocaleDateString()}
                      </h5>
                    </div>
                    <br />
                    {reviewedProducts.includes(item.productId._id) ? (
                      <button className="btn-secandry w-100 h-90" disabled>
                        Review Already Created
                      </button>
                    ) : (
                      <button
                        className="btn-secandry w-100 h-90"
                        data-bs-toggle="modal"
                        data-bs-target="#rentModal"
                        onClick={() => setSelectedProcess(item)}
                      >
                        Create Review
                      </button>
                    )}
                  </div>
                </div>
                <br />
              </>
            ))
          )}
        </div>
      </div>
      <ReviewModl selected={{ selectedProcess }} />
    </>
  );
};

export default ReviewPage;
