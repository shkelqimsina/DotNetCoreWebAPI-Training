import React, { useState } from "react";
import eMungesat from "../assets/logos/eMungesat.png";
import manStanding from "../assets/images/manStanding.svg";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import "../styles/screens/signForm.css";
function SignForm() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="signForm position-relative d-flex"
      style={{ color: "black" }}
    >
      <img
        src={eMungesat}
        alt="eMungesat logo"
        className="logo position-absolute py-4"
        draggable="false"
      />

      <div className="sign-text d-flex w-75">
        <div className="d-flex flex-column gap-2">
          <h1 className="fw-bold">
            Sign in to <br />{" "}
            <span className="fw-normal">eMungesat is simply</span>
          </h1>
          <p className="mb-0"> If you don’t have an account register</p>
          <p>
            You can{" "}
            <a href="#" className="register-here fw-bold text-decoration-none">
              Register here!
            </a>
          </p>
        </div>
        <img src={manStanding} alt="Man Standing" />
      </div>
      <div className="sign-form d-flex flex-column gap-4 w-50">
        <h2 className="mb-4 fw-semibold">Sign in</h2>
        <form className="w-75 d-flex flex-column gap-4">
          <input
            className="border-0 px-4 rounded-3"
            type="email"
            placeholder="Email"
          />
          <div className="d-flex position-relative">
            <input
              className="border-0 px-4 rounded-3 w-100 pe-5"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            {!showPassword ? (
              <FaEyeSlash
                onClick={togglePassword}
                className="eye position-absolute top-50 translate-middle-y end-0 me-3"
              />
            ) : (
              <FaEye
                onClick={togglePassword}
                className="eye position-absolute top-50 translate-middle-y end-0 me-3"
              />
            )}
          </div>
          <a className="forgot-p text-end text-decoration-none">
            Forgot password?
          </a>
          <button className="sign-btn border-0 rounded-3 fw-semibold mt-3">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignForm;
