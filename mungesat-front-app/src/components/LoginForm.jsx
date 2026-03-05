import React, { useState, useContext } from "react";
import Input from "../components/Input";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SignButton } from "../components/Button";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import "../styles/screens/signForm.css";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData.username, formData.password);
      navigate("/teacher");
    } catch (err) {
      const data = err.response?.data;
      const msg =
        (typeof data === "string" ? data : data?.message) ||
        err.message ||
        "Emri i përdoruesit ose fjalëkalimi janë gabim. Provoni përsëri.";
      setError(typeof msg === "string" ? msg : "Kredencialet janë të gabuara.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Input
        className="border-0 px-4 rounded-3"
        type="text"
        placeholder="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <div className="d-flex position-relative">
        <Input
          className="border-0 px-4 rounded-3 w-100 pe-5"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
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
      <p className="forgot-p text-end text-decoration-none small text-muted mb-0 mt-1">
        Keni harruar fjalëkalimin? Kontaktoni administratorin që ta rivendosë (Kujdestarët → Ndrysho kujdestarin).
      </p>
      {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}
      <SignButton
        className="sign-btn border-0 rounded-3 fw-semibold mt-3"
        type="submit"
        disabled={loading}
        onClick={handleSubmitLogin}
      >
        {loading ? "Duke u kyçur…" : "Kyqu"}
      </SignButton>
    </>
  );
}

export default LoginForm;
