import React, { useEffect, useState } from "react";

export default function FileInput({
  label,
  fieldName,
  formik,
  externalError = "",
  buttonColor = "#B72A67",
  showPreview = true,
  maxFileSizeMB = 5,
  otherFileField = "" // Used to check if the same file is uploaded for both front and back ID pictures

}) {
  const file = formik.values[fieldName];
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (file && showPreview) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [file, showPreview]);

  const formikError =
    formik.touched[fieldName] && formik.errors[fieldName] ? formik.errors[fieldName] : null;

  const handleFileChange = (e) => {
    setFileError("");
    const chosenFile = e.target.files[0];
    const otherFile = formik.values[otherFileField];


    if (chosenFile) {
      if (!chosenFile.type.startsWith("image/")) {
        setFileError("Please upload an image file (jpg, png, jpeg).");
        formik.setFieldValue(fieldName, null);
        return;
      }

      const fileSizeMB = chosenFile.size / (1024 * 1024);
      if (fileSizeMB > maxFileSizeMB) {
        setFileError(`File must be under ${maxFileSizeMB}MB!`);
        formik.setFieldValue(fieldName, null);
        return;
      }
    }
    // Check if same as the other file
    if (
      otherFile &&
      chosenFile.name === otherFile.name &&
      chosenFile.size === otherFile.size &&
      chosenFile.type === otherFile.type
    ) {
      setFileError("Front and back ID pictures cannot be the same file.");
      formik.setFieldValue(fieldName, null);
      return;
    }
  

    formik.setFieldValue(fieldName, chosenFile || null);
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <label className="form-label">{label}</label>

      <div className="d-flex align-items-center mb-2">
        <label
          className="btn"
          style={{
            backgroundColor: buttonColor,
            color: "white",
            borderRadius: "4px",
            marginRight: "10px",
          }}
        >
          Choose file
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>
        <span
        className="text-truncate"
        style={{
          maxWidth: "150px",
          display: "inline-block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={file?.name}
      >
        {file ? file.name : "No file chosen"}
      </span>
      </div>

      <div
        style={{
          marginTop: "6px",
          width: "120px",
          height: "80px",
          position: "relative",
          overflow: "hidden",
          cursor: preview ? "pointer" : "default",
        }}
        onClick={() => preview && setShowModal(true)}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              border: "1px dashed #ccc",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              fontSize: "12px",
            }}
          >
            No preview
          </div>
        )}
      </div>

      {fileError && (
        <div className="text-danger mt-1">{fileError}</div>
      )}
      {externalError && (
        <div className="text-danger mt-1">{externalError}</div>
      )}
      <div style={{ minHeight: "1.25rem" }}>
        {formikError && <div className="text-danger">{formikError}</div>}
      </div>

      {/* Enlarge Modal */}
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
                  src={preview}
                  alt="Zoomed ID"
                  style={{ width: "100%", borderRadius: 6 }}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
