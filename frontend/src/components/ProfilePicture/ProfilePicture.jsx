import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function ProfilePicture({ userId }) {
  const [profilePicture, setProfilePicture] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);

  const fileInputRef = useRef();

  const token =
    localStorage.getItem("UserToken") || sessionStorage.getItem("UserToken");
  const defaultPic =
    "https://static.vecteezy.com/system/resources/previews/026/619/142/non_2x/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg";

  let loggedInUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      loggedInUserId = decoded?.id || decoded?._id;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const isOwnProfile = !userId || userId === loggedInUserId;

  const getUrl = userId
    ? `http://localhost:3000/api/user/${userId}` // other user
    : "http://localhost:3000/api/user/profile-picture"; // self

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const { data } = await axios.get(getUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profilePic = userId
          ? data?.user?.profilePicture || defaultPic
          : data?.profilePicture || defaultPic;

        setProfilePicture(profilePic);
      } catch (error) {
        console.error("❌ Error fetching profile picture:", error);
        setProfilePicture(defaultPic);
      }
    })();
  }, [token, getUrl, userId]);

  useEffect(() => {
    setIsImageLoading(true);
  }, [profilePicture, localPreview]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setShowModal(false);
      setErrorMessage("Only JPG, PNG, WEBP, or GIF files allowed.");
      return;
    }

    if (file.size > maxSize) {
      setShowModal(false);
      setErrorMessage("File too large. Max 5MB.");
      return;
    }

    setLocalPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      setIsUploading(true);
      const { data } = await axios.put(
        "http://localhost:3000/api/user/upload-profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfilePicture(data.profilePicturePath); // assume it returns full Cloudinary URL
      setLocalPreview(null);
      setShowModal(false);
      setErrorMessage("");
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setShowModal(false);
      setErrorMessage("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="text-center my-3">
      {/* Profile Picture */} 
      <div
  onClick={() => setShowModal(true)}
  className="rounded-circle border overflow-hidden d-flex align-items-center justify-content-center"
  style={{
    width: 130,
    height: 130,
    backgroundColor: "#f0f0f0",
    position: "relative",
    cursor: "pointer",
  }}
>
  {/* Profile Picture */}
  <img
    src={localPreview || profilePicture}
    onLoad={() => setIsImageLoading(false)}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = defaultPic;
      setIsImageLoading(false);
    }}
    alt="Profile"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      position: "absolute",
      top: 0,
      left: 0,
      opacity: isImageLoading ? 0 : 1,
      transition: "opacity 0.4s ease-in-out",
    }}
  />

  {/* Spinner (inside container, not floating) */}
  {isImageLoading && (
    <div className="spinner-border text-secondary" role="status" />
  )}

  {/* Uploading Overlay */}
  {isUploading && (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        zIndex: 2,
      }}
    >
      Uploading...
    </div>
  )}
</div>


      {/* Error message */}
      {errorMessage && (
        <div style={{ color: "red", fontSize: "0.9rem", marginTop: 8 }}>
          {errorMessage}
        </div>
      )}

      {/* Instructions */}
      <div style={{ minHeight: 24}}>
        {isOwnProfile && (
          <p style={{ color: "#555", fontSize: 14, marginTop: 7 , marginBottom: 0, marginLeft:"-2rem" }}>
            Click photo to enlarge or change
          </p>
        )}
      </div>

      {/* Hidden input for file upload */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Bootstrap Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-body text-center">
                <img
                  src={localPreview || profilePicture}
                  alt="Profile Preview"
                  style={{ width: "100%", borderRadius: 5 }}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                {isOwnProfile && (
                  <button
                    className="btn btn-primary"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Change Picture
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
