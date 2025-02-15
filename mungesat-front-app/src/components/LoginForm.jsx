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
      const response = await fetch("http://localhost:5050/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      login(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
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
      <a className="forgot-p text-end text-decoration-none">
        Keni harruar fjalëkalimin?
      </a>
      <SignButton
        className="sign-btn border-0 rounded-3 fw-semibold mt-3"
        type="submit"
        onClick={handleSubmitLogin}
      >
        Kyqu
      </SignButton>
    </>
  );
}

export default LoginForm;
