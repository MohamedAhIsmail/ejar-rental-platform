import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextInput from "../../components/RegisterComponents/TextInput"; 

export default function ForgotPassword() {
  const [apiMessage, setApiMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0); // ⏳ Holds countdown value

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email (e.g., user@example.com).")
        .required("Email is required."),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setApiMessage(null);
        setIsLoading(true);
        setIsDisabled(true);
        setCountdown(60); // ⏳ Start countdown at 60 seconds

        const response = await axios.post("http://localhost:3000/api/auth/forgot-password", {
          email: values.email,
        });

        if (response.status === 200) {
          setApiMessage("✅ Password reset link sent! Check your email.");
        }
      } catch (error) {
        setApiMessage(error.response?.data?.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
        setSubmitting(false);

        //  Start a countdown timer for 60 seconds
        let seconds = 60;
        const timer = setInterval(() => {
          seconds -= 1;
          setCountdown(seconds);
          if (seconds <= 0) {
            clearInterval(timer);
            setIsDisabled(false); // Enable button after countdown finishes
          }
        }, 1000);
      }
    },
  });

  return (
    <div className="container mt-5" style={{ maxWidth: "600px", margin: "0 auto",  minHeight: '100vh' }}>
      <h2 className="text-left" style={{ color: "#562DDD", fontSize: "30px", fontWeight: 700 }}>
        Forgot Password?
      </h2>
      <p className="text-left">Enter your email to receive a reset link.</p>

      {apiMessage && <div className="alert alert-info text-center">{apiMessage}</div>}

      <form onSubmit={formik.handleSubmit} className="row g-3">
        <div className="col-12">
          <TextInput label="Email" id="email" formik={formik} type="email" />
        </div>

        <div className="col-12 text-center">
          <button
            type="submit"
            className="btn"
            disabled={isLoading || isDisabled} //  Button disabled properly
            style={{
              backgroundColor: isDisabled ? "#ccc" : "#562DDD", // Grayed-out when disabled
              color: "white",
              width: "50%",
              fontSize: "18px",
              marginTop: "10px",
              marginBottom: "15px",
            }}
          >
            {isLoading ? "Sending..." : isDisabled ? `Try again in ${countdown}s` : "Send Reset Link"}
          </button>

          {/* Show message when button is disabled */}
          {isDisabled && (
            <p className="text-danger mt-2">You can request a new link in {countdown} seconds.</p>
          )}

          <p className="mt-3" style={{ fontSize: "16px" }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{ color: "#5A3FFF", textDecoration: "underline", cursor: "pointer", fontWeight: "600" }}
            >
              Register
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
