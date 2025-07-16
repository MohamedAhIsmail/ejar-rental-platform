import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Import  subcomponents
import PasswordInput from "../../components/RegisterComponents/PasswordInput";
import TextInput from "../../components/RegisterComponents/TextInput";
import FileInput from "../../components/RegisterComponents/FileInput";
import GenderInput from "../../components/RegisterComponents/GenderInput";

export default function Register() {
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [duplicateFileError, setDuplicateFileError] = useState("");

  const navigate = useNavigate();
  const initialValues = {
    userName: "",
    email: "",
    password: "",
    confirmedPassword: "",
    phone: "",
    dob: "",
    address: "",
    idNumber: "",
    gender: "male",
    idPictureFront: null,
    idPictureBack: null,
  };
  //  Yup validation
  const validationSchema = Yup.object({
    userName: Yup.string()
      .min(3, "Name should be at least 3 characters long")
      .max(29, "Name should be at most 29 characters long")
      .matches(/^[a-zA-Z0-9_ ]+$/, "Only letters, numbers, underscores, and spaces are allowed.")
      .required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
    .min(8, "Password should be at least 8 characters long")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase, one lowercase letter, one number, and one special character"
    )
    .required(" password is required"),
  
      confirmedPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase, one lowercase letter, one number, and one special character"
      )
      .required("Confirm password is required"),
    
    phone: Yup.string()
      .matches(/^01[0-9]{9}$/, "Phone number must be a valid Egyptian number (01xxxxxxxxx)")
      .required("Phone number is required"),
      dob: Yup.date()
  .min(new Date(new Date().setFullYear(new Date().getFullYear() - 70)), "You must not be older than 70 years old")
  .max(new Date(new Date().setFullYear(new Date().getFullYear() - 15)), "You must be at least 15 years old")
  .required("Date of birth is required"),

    
      address: Yup.string()
      .min(7, "Address must be at least 7 characters.")
      .max(50, "Address must not exceed 50 characters.")
      .matches(
        /^[a-zA-Z0-9\s,'-]+$/,
        "Only letters, numbers, spaces, commas, and dashes are allowed."
      )
      .required("Address is required, Please enter your full address (street, city, etc.)."),
    idNumber: Yup.string()
      .matches(/^[2-3][0-9]{13}$/, "Invalid Egyptian ID number (must start with 2 or 3 and be 14 digits)")
      .required("ID Number is required"),
    gender: Yup.string().oneOf(["male", "female"]).required("Gender is required"),
    idPictureFront: Yup.mixed().required("Front ID Picture is required"),
    idPictureBack: Yup.mixed().required("Back ID Picture is required"),
  });

  async function register(values) {
    try {
      setApiError(null);
      setRegistrationSuccess(false);
      setIsLoading(true);
       //  Check if front and back images are the same file (by name, size & type)
       const front = values.idPictureFront;
       const back = values.idPictureBack;
       if (
        front &&
        back &&
        front.name === back.name &&
        front.size === back.size &&
        front.type === back.type
      ) {
        setDuplicateFileError("Front and back ID pictures cannot be the same file.");
        setIsLoading(false);
        return;
      } else {
        setDuplicateFileError(""); // Clear it when valid
      }
      
      // console.log("Submitting values:", values); // debugging 
      // If uploading files, create form data
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] !== null) {
          formData.append(key, values[key]);
        }
      });
      const response = await axios.post("http://localhost:3000/api/auth/signUp", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  

      if (response.status === 200) {
        setRegistrationSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("API Error:", error.response?.data);
      setApiError(error.response?.data?.message || "Something went wrong...");
      window.scrollTo({ top: 0, behavior: "smooth" });

    } finally {
      setIsLoading(false);
    }
}
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: register,
  });

  return (
    <div className="container mt-5"
    style={{ margin: "0 auto", transform: "scale(0.9)", transformOrigin: "top center",  minHeight: '100vh' }}
    >
      <h2
        className="text-left"
        style={{ color: "rgba(86, 45, 221, 1)", fontSize: "42px", fontWeight: "bold" }}
      >
        Create an account
      </h2>
      <p className="text-left">Enter your details below</p>

      {registrationSuccess && (
        <div className="alert alert-success">Registration successful! Redirecting to login...</div>
      )}
      {apiError && <div className="alert alert-danger">{apiError}</div>}

      <form onSubmit={formik.handleSubmit} className="row g-3">
         {/* NAME */}
         <div className="col-md-6">
          <TextInput label="Name:" id="userName" formik={formik} />
        </div>

        {/* EMAIL */}
        <div className="col-md-6">
          <TextInput label="Email:" id="email" formik={formik} type="email" />
        </div>

        {/* PASSWORD */}
        <div className="col-md-6">
          <PasswordInput label="Password:" id="password" formik={formik} />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="col-md-6">
          <PasswordInput label="Confirm Password:" id="confirmedPassword" formik={formik} />
        </div>

        {/* PHONE */}
        <div className="col-md-6">
          <TextInput label="Phone:" id="phone" formik={formik} />
        </div>

        {/* DOB */}
        <div className="col-md-6">
          <TextInput label="Date of Birth:" id="dob" formik={formik} type="date" />
        </div>

        {/* ADDRESS */}
        <div className="col-md-6">
          <TextInput label="Address:" id="address" formik={formik} />
        </div>

        {/* ID NUMBER */}
        <div className="col-md-6">
          <TextInput label="ID Number:" id="idNumber" formik={formik} />
        </div>

        {/* GENDER */}
        <div className="col-md-6">
          <GenderInput formik={formik} />
        </div>

        {/* ID PICTURES (Front/Back) */}
        <div className="col-md-6 d-flex justify-content-between">
          <div style={{ width: "48%" }}>
          <FileInput label="ID Picture (Front):" fieldName="idPictureFront" formik={formik} externalError={duplicateFileError}/>
          </div>
          <div style={{ width: "48%" }}>
          <FileInput label="ID Picture (Back):" fieldName="idPictureBack" formik={formik} externalError={duplicateFileError}/>
          </div>
        </div>
        {/* SUBMIT BUTTON */}
        <div className="col-12 text-center">
          <button type="submit" className="btn" disabled={isLoading}
            style={{ backgroundColor: "#562DDD", color: "white", width: "50%", fontSize: "22px", marginTop: "5px",}}
            >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="mt-3" style={{ fontSize: "16px" }}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}
              style={{ color: "#5A3FFF", textDecoration: "underline", cursor: "pointer", fontWeight: "600", }}>
              Log in
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
