import React, { useState } from "react";
import eMungesat from "../assets/logos/eMungesat.png";
import schoolLogo from "../assets/logos/schoolLogo.png";
import manStanding from "../assets/images/manStanding.svg";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
// import {
//   handleSubmitLogin,
//   handleSubmitRegister,
// } from "../components/LoginForm";
import "../styles/screens/signForm.css";

function SignForm() {
  const [onSignIn] = useState(true);

  return (
    <div
      className="signForm position-relative d-flex flex-column flex-lg-row"
      style={{ color: "black" }}
    >
      <div className="sign-hero-header position-absolute py-4 d-flex align-items-center gap-3">
        <img
          src={schoolLogo}
          alt="Logo e shkollës"
          className="school-logo"
          draggable="false"
        />
        <div className="d-flex flex-column">
          <img
            src={eMungesat}
            alt="eMungesat logo"
            className="logo"
            draggable="false"
          />
          <div className="welcome-text">
            Mirësevini në <span className="welcome-brand">eMungesat</span> – shkolla “Lufti Musiqi” Vushtrri
          </div>
        </div>
      </div>

      <div className="sign-text d-flex w-100 w-lg-75">
        <div className="d-flex flex-column gap-2">
          <h1 className="fw-bold">
            {onSignIn ? " Kyçja" : "Regjistrimi"} tek <br />{" "}
            <span className="fw-normal">eMungesat është e thjeshtë</span>
          </h1>
          <p className="mb-0">
            Kyçja bëhet vetëm me llogari të krijuar nga administratori ose drejtori i shkollës.
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
          onSubmit={(e) => e.preventDefault()}
          className="w-100 w-lg-75 d-flex flex-column gap-4"
        >
          {onSignIn ? <LoginForm /> : <RegisterForm />}
        </form>
      </div>
    </div>
  );
}

export default SignForm;
