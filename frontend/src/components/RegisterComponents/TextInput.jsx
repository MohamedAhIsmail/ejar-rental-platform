// File: src/components/TextInput.jsx
import React from "react";

export default function TextInput({ label, id, formik, type = "text" }) {
  const showError = formik.touched[id] && formik.errors[id];

  return (
    <>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="form-control"
        style={{
          border: showError ? "1px solid red" : "",
        }}
        placeholder={label.replace(":", "")} // e.g., "Name" if label is "Name:"
        {...formik.getFieldProps(id)}
      />
      <div style={{ minHeight: "1.25rem" }}>
        {showError && <div className="text-danger">{formik.errors[id]}</div>}
      </div>
    </>
  );
}
