// File: src/components/PasswordInput.jsx
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({ label, id, formik }) {
  const [showPassword, setShowPassword] = useState(false);
  const showError = formik.touched[id] && formik.errors[id];

  return (
    <>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <div className="input-group">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          className="form-control"
          style={{
            border: showError ? "1px solid red" : "",
          }}
          placeholder={label.replace(":", "")}
          {...formik.getFieldProps(id)}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <div style={{ minHeight: "1.25rem" }}>
        {showError && <div className="text-danger">{formik.errors[id]}</div>}
      </div>
    </>
  );
}
