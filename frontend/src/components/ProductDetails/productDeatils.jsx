import React, { useState, useEffect } from "react";
import ReactImageMagnify from "react-image-magnify";
import { useProductStore } from "../../Store/Deatils";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../Store/Auth";
import "./productDeatils.css";
import useChatStore from "../../Store/chatStore";
import useWishlistStore from "../../Store/Wishlist";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify"; //new

const ProductDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    product,
    fetchProduct,
    updateProduct,
    getAllProd,
    loading,
    error,
    gteProccesOfProduct,
    processData,
  } = useProductStore();

  const { token } = useAuthStore();

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  const [mainImage, setMainImage] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const { createChat } = useChatStore();
  const navigate = useNavigate();

  const handleToggleWishlist = () => {
    if (!token) {
      toast.info("Please sign in or create an account to use the wishlist");
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(product?.data?._id, token);
    } else {
      addToWishlist(product?.data, token);
    }
  };
  const isWishlisted = wishlist.some((p) => p?.id === product?.data?._id);
  const [fields, setFields] = useState({
    name: "",
    brand: "",
    category: "",
    owner: "",
    description: "",
    daily: "",
    comfirmed: "",
    confirmMessage: "",
    status: "",
    images: [],
  });
  const [newImage, setNewImage] = useState(null);
  const [errors, setErrors] = useState({});

  const { id } = useParams();

  useEffect(() => {
    fetchProduct(id);
    gteProccesOfProduct(id, token);
  }, [id, fetchProduct, token]);

  let decoded;
  if (token) {
    decoded = jwtDecode(token);
  }

  useEffect(() => {
    if (product?.data) {
      setFields({
        name: product.data.name || "",
        description: product.data.description || "",
        daily: Number(product.data.daily) || 0,
        category: product.data.category?.id || "",
        confirmed: Boolean(product.data.confirmed),
        confirmMessage: product.data.confirmMessage || "",
        status: product.data.status || "",
        owner: product?.data?.renterId?.userName || "",
        ownerId: product?.data?.renterId?._id || "",
        images: product.data.images || [],
      });
    }
    console.log(product);
  }, [product]);

  useEffect(() => {
    if (product?.data?.images?.length > 0) {
      setMainImage(product.data.images[0]);
    }
  }, [product?.data?.images]);

  useEffect(() => {
    getAllProd(product?.data?.category?._id);
  }, [getAllProd, product]);

  const toggleEdit = async () => {
    if (isEditing) {
      const newErrors = {};

      // دالة لإزالة الرموز الخاصة من النص
      const removeSpecialChars = (text) => {
        return text.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "");
      };

      const nameLength = removeSpecialChars(fields.name || "").length;
      const descLength = removeSpecialChars(fields.description || "").length;

      if (!fields.name || nameLength < 3) {
        newErrors.name =
          "Name must be at least 3 characters (excluding symbols).";
      }

      if (!["available", "rented", "unavailable"].includes(fields.status)) {
        newErrors.status = "Please choose a valid status.";
      }

      if (!fields.description || descLength < 10) {
        newErrors.description =
          "Description must be at least 10 characters (excluding symbols).";
      }

      if (!fields.daily || isNaN(fields.daily) || Number(fields.daily) <= 0) {
        newErrors.daily = "Daily price must be a positive number.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      const originalData = product.data;
      const updatedProduct = { ...originalData, ...fields };

      if (fields.status === "ranted") {
        console.error("❌ Error: 'ranted' is not a valid status value.");
        return;
      }

      const ignoreFields = ["owner", "ownerId", "category"];

      const changedKeys = Object.keys(fields).filter((key) => {
        return !ignoreFields.includes(key) && fields[key] !== originalData[key];
      });

      const hasOnlyStatusChanged =
        changedKeys.length === 1 &&
        changedKeys[0] === "status" &&
        (fields.status === "available" || fields.status === "unavailable");

      if (hasOnlyStatusChanged) {
        await updateProduct(updatedProduct, true, token);
      } else {
        await updateProduct(
          { ...updatedProduct, confirmed: false },
          true,
          token
        );
      }

      setFields(updatedProduct);
      setErrors({});
    }

    setIsEditing((prev) => !prev);
  };

  const handleChange = (e, field) => {
    setFields((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const handleDeleteImage = (index) => {
    setFields((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);

      const removedImage = prev.images[index];

      return {
        ...prev,
        images: updatedImages,
        removeImages: [...(prev.removeImages || []), removedImage],
      };
    });
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) setNewImage(file);
  };

  const handleUploadImage = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append("images", newImage);

    try {
      console.log(id);

      const response = await fetch(`http://localhost:3000/api/product/${id}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);

      setFields((prev) => ({
        ...prev,
        images: [...new Set([...prev.images, ...data.product.images])],
      }));

      setNewImage(null);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          Loading Product, please wait...
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
          className="bi bi-box-seam"
          style={{ fontSize: "60px", marginBottom: "20px", color: "#b72a67" }}
        ></i>
        <h2>Oops! Couldn't load Product</h2>
        <p>Please check your internet connection or try again later.</p>
      </div>
    );
  }

  if (!product?.data || product.data.length === 0) {
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
          className="bi bi-search"
          style={{ fontSize: "60px", marginBottom: "20px", color: "#b72a67" }}
        ></i>
        <h2>No product found</h2>
        <p>Try adjusting your search or check back later.</p>
      </div>
    );
  }

  const chatWithOwner = async () => {
    const chat = await createChat(product.data.renterId._id, token);
    if (chat && chat._id) {
      navigate(`/chat/${chat._id}`);
    } else {
      console.error("Failed to create chat or chat ID is missing");
    }
  };

  return (
    <>
      <div className="container container1  my-5">
        <div className="p-4">
          {!product?.data?.confirmed &&
            decoded?.id == product?.data?.renterId?._id && (
              <div className="alert alert-warning ">
                <div className="d-flex align-items-center">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <h6>Awaiting admin review</h6>
                </div>
                <span className="d-block">{product.data.confirmMessage}</span>
              </div>
            )}
          {!product?.data?.confirmed &&
            decoded?.id !== product?.data?.renterId?._id &&
            decoded?.role !== "admin" && (
              <div className="alert alert-warning d-flex align-items-center">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <span>
                  This product is currently unavailable and is being reviewed.
                </span>
              </div>
            )}

          <div className="row">
            <div className="col-12 col-md-6 mb-4">
              {isSmallScreen ? (
                <div className="square image">
                  <img
                    className="mx-auto "
                    src={mainImage}
                    alt="Product Image"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              ) : (
                <div className="parent-div">
                  <ReactImageMagnify
                    {...{
                      smallImage: {
                        alt: "Product Image",
                        isFluidWidth: false,
                        src: mainImage,
                        width: 400,
                        height: 400,
                      },
                      largeImage: {
                        src: mainImage,
                        width: 1200,
                        height: 1200,
                      },
                      enlargedImageContainerDimensions: {
                        width: "120%",
                        height: "120%",
                      },
                      enlargedImageContainerStyle: {
                        backgroundColor: "#ccc",
                        zIndex: 1000,
                      },
                    }}
                  />
                </div>
              )}

              <div className="d-flex justify-content-center mt-3 flex-wrap">
                {fields.images.map((img, index) => (
                  <div key={index} className="position-relative m-2">
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="rounded border"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        cursor: "pointer",
                        border:
                          mainImage === img
                            ? "2px solid blue"
                            : "2px solid transparent",
                      }}
                      onClick={() => handleImageClick(img)}
                    />
                    {isEditing && fields.images.length > 1 && (
                      <button
                        className="position-absolute top-0 end-0 btn btn-sm btn-danger p-0 rounded-circle"
                        style={{
                          width: "20px",
                          height: "20px",
                          fontSize: "12px",
                        }}
                        onClick={() => handleDeleteImage(index)}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}

                {isEditing && fields.images.length < 4 && (
                  <label
                    className="m-2 bg-secondary d-flex align-items-center justify-content-center rounded"
                    style={{
                      width: "80px",
                      height: "80px",
                      cursor: "pointer",
                      opacity: 0.7,
                    }}
                  >
                    ➕
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleAddImage}
                    />
                  </label>
                )}
              </div>

              {isEditing && newImage && (
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-success"
                    onClick={handleUploadImage}
                  >
                    Upload Image
                  </button>
                </div>
              )}
            </div>

            <div className="col-md-6 ">
              <div className="d-flex justify-content-between">
                <div>
                  {isEditing ? (
                    <>
                      <div className="form-floating mb-3">
                        <input
                          id="floatingInput"
                          type="text"
                          value={fields.name}
                          placeholder="Product Name"
                          onChange={(e) => handleChange(e, "name")}
                          className="form-control form-control1 mb-3 w-100 "
                        />
                        <label for="floatingInput">Title</label>
                      </div>

                      {errors.name && (
                        <div className="text-danger d-block">{errors.name}</div>
                      )}
                    </>
                  ) : (
                    <h3 className="mb-3 main-text fw-bold">{fields.name}</h3>
                  )}
                </div>
                <div
                  onClick={handleToggleWishlist}
                  style={{ cursor: "pointer" }}
                >
                  <i
                    className={`fa-heart ${
                      isWishlisted ? "fas text-danger" : "far"
                    }`}
                  ></i>
                </div>
              </div>

              {product?.data?.review?.length === 0 ? (
                <span className="badge bg-success">NEW</span>
              ) : (
                <p className="text-muted">
                  {Array.from({ length: 5 }, (_, i) => (
                    <i
                      key={i}
                      className={`fa-star ${
                        i + 1 <= Number(product?.data?.averageRating)
                          ? "fas"
                          : "far"
                      }`}
                      style={{
                        color:
                          i + 1 <= Number(product?.data?.averageRating)
                            ? "#FFAD33"
                            : "lightgray",
                      }}
                    ></i>
                  ))}
                  ({product?.data?.review?.length})
                </p>
              )}

              <div className="d-flex align-items-center mb-2">
                <i className="fa-solid fa-tags me-2 text-secondary"></i>
                <span className="fw-semibold">Category:</span>
                <span className="ms-1 text-muted">
                  {product.data.category?.name || "N/A"}
                </span>
              </div>

              <div className="d-flex align-items-center mb-2">
                <i className="fa-solid fa-user me-2 text-secondary"></i>
                <span className="fw-semibold">Owner:</span>
                <Link
                  to={`/profile/${fields.ownerId}`}
                  className="ms-1 text-decoration-none text-primary fw-semibold"
                >
                  {fields.owner}
                </Link>
              </div>

              <div className="d-flex align-items-center mb-3">
                <i className="fa-solid fa-circle-check me-2 text-success"></i>
                <span className="fw-semibold">Status:</span>
                {isEditing ? (
                  <select
                    value={fields.status}
                    onChange={(e) => handleChange(e, "status")}
                    className="form-select ms-2"
                    style={{ maxWidth: "150px" }}
                  >
                    <option value="available">available</option>

                    <option value="unavailable">Unavailable</option>
                  </select>
                ) : (
                  <span className="ms-1 text-muted mx-1">{fields.status}</span>
                )}
                {processData ? (
                  <p className="ms-1 text-danger mt-3 ">
                    <span className="mx-1">Available at</span>
                    {new Date(processData.endDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                ) : (
                  ""
                )}
              </div>

              {isEditing ? (
                <>
                  <div className="form-floating">
                    <textarea
                      value={fields.description}
                      onChange={(e) => handleChange(e, "description")}
                      className="form-control form-control1 mb-2"
                      placeholder="Description"
                      id="floatingTextarea"
                    />

                    <label for="floatingTextarea">Description</label>
                  </div>

                  {errors.description && (
                    <div className="text-danger">{errors.description}</div>
                  )}
                </>
              ) : (
                <p>{fields.description}</p>
              )}
              <div className="d-flex flex-wrap mb-3"></div>
              {isEditing ? (
                <>
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      value={fields.daily}
                      placeholder="Daily Price"
                      onChange={(e) => handleChange(e, "daily")}
                      className="form-control form-control1 mb-2"
                      id="floatingInput"
                    />

                    <label for="floatingInput">Daily</label>
                  </div>

                  {errors.daily && (
                    <div className="text-danger">{errors.daily}</div>
                  )}
                </>
              ) : (
                <h4 className="text-danger">{fields.daily} EGP/Day </h4>
              )}
              <div className="mt-3">
                {decoded?.id == product?.data?.renterId?._id ? (
                  product?.data?.status !== "rented" ? (
                    <div className="d-flex align-items-end">
                      <button
                        className="btn main-back w-25 mx-1"
                        onClick={toggleEdit}
                      >
                        {isEditing ? "Save" : "Edit"}
                      </button>
                    </div>
                  ) : (
                    <p className="text-muted mt-3">
                      You can’t edit this product until the rental time is over.
                    </p>
                  )
                ) : (
                  ""
                )}

                {product?.data?.confirmed &&
                decoded?.id !== product?.data?.renterId?._id ? (
                  <>
                    <button
                      className="btn btn-primary w-25 me-2"
                      onClick={() => {
                        if (!decoded?.id) {
                          navigate("/login");
                        } else {
                          chatWithOwner();
                        }
                      }}
                    >
                      <i className="fa-solid fa-comment"></i> Chat
                    </button>

                    {decoded?.id && product?.data?.status !== "rented" ? (
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#rentModal"
                        className="btn btn-primary w-25"
                      >
                        <i className="fa-solid fa-cart-shopping"></i> Rent
                      </button>
                    ) : !decoded?.id ? (
                      <button
                        type="button"
                        className="btn btn-primary w-25"
                        onClick={() => {
                          navigate("/login");
                        }}
                      >
                        <i className="fa-solid fa-cart-shopping"></i> Rent
                      </button>
                    ) : null}
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
