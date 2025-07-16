// File: src/components/GenderInput.jsx
import React from "react";

export default function GenderInput({ formik }) {
  const showError = formik.touched.gender && formik.errors.gender;

  return (
    <>
      <label className="form-label">Gender:</label>
      <div>
        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            onChange={formik.handleChange}
            checked={formik.values.gender === "male"}
          />{" "}
          Male
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input
            type="radio"
            name="gender"
            value="female"
            onChange={formik.handleChange}
            checked={formik.values.gender === "female"}
          />{" "}
          Female
        </label>
      </div>
      <div style={{ minHeight: "1.25rem" }}>
        {showError && <div className="text-danger">{formik.errors.gender}</div>}
      </div>
    </>
  );
}
