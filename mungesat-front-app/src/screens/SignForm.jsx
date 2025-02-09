import React, { useState } from "react";
import eMungesat from "../assets/logos/eMungesat.png";
import manStanding from "../assets/images/manStanding.svg";
import Input from "../components/Input";
import { SignButton } from "../components/Button";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import "../styles/screens/signForm.css";

function SignForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [onSignIn, setOnSignIn] = useState(true);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="signForm position-relative d-flex flex-column flex-lg-row"
      style={{ color: "black" }}
    >
      <img
        src={eMungesat}
        alt="eMungesat logo"
        className="logo position-absolute py-4"
        draggable="false"
      />

      <div className="sign-text d-flex w-100 w-lg-75">
        <div className="d-flex flex-column gap-2">
          <h1 className="fw-bold">
            {onSignIn ? " Kyçja" : "Regjistrimi"} tek <br />{" "}
            <span className="fw-normal">eMungesat është i thjeshtë</span>
          </h1>
          <p className="mb-0">
            {" "}
            Nëse {onSignIn ? "nuk ke" : "ke"} një llogari,{" "}
            {onSignIn ? "regjistrohu" : "kyçu"}!
          </p>
          <p>
            Ti mund të{" "}
            <span
              onClick={() => setOnSignIn(!onSignIn)}
              className="register-here fw-bold text-decoration-none"
            >
              {onSignIn ? "Regjistrohesh " : "Kyçesh"} këtu!
            </span>
          </p>
        </div>
        <img
          src={manStanding}
          alt="Man Standing"
          className="d-none d-lg-block"
        />
      </div>
      <div className="sign-form d-flex flex-column gap-4 w-100 w-lg-50">
        <h2 className="mb-4 fw-semibold">{onSignIn ? "Sign in" : "Sign up"}</h2>
        <form className="w-100 w-lg-75 d-flex flex-column gap-4">
          <Input
            className="border-0 px-4 rounded-3"
            type="email"
            placeholder="Email"
          />
          <div className="d-flex position-relative">
            <Input
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
          {onSignIn ? (
            <a className="forgot-p text-end text-decoration-none">
              Keni fjalëkalimin?
            </a>
          ) : (
            <div className="d-flex position-relative">
              <Input
                className="border-0 px-4 rounded-3 w-100 pe-5"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
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
          )}
          <SignButton className="sign-btn border-0 rounded-3 fw-semibold mt-3">
            {onSignIn ? "Kyçu" : "Regjistrohu"}
          </SignButton>
        </form>
      </div>
    </div>
  );
}

export default SignForm;
