import React, { useState } from "react";
import eMungesat from "../assets/logos/eMungesat.png";
import manStanding from "../assets/images/manStanding.svg";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
// import {
//   handleSubmitLogin,
//   handleSubmitRegister,
// } from "../components/LoginForm";
import "../styles/screens/signForm.css";

function SignForm() {
  const [onSignIn, setOnSignIn] = useState(true);

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
            <span className="fw-normal">eMungesat është e thjeshtë</span>
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
        <h2 className="mb-4 fw-semibold">
          {onSignIn ? "Kyqu" : "Regjistrohu"}
        </h2>
        <form
          // onSubmit={onSignIn ? handleSubmitLogin : handleSubmitRegister}
          className="w-100 w-lg-75 d-flex flex-column gap-4"
        >
          {onSignIn ? <LoginForm /> : <RegisterForm />}
        </form>
      </div>
    </div>
  );
}

export default SignForm;
