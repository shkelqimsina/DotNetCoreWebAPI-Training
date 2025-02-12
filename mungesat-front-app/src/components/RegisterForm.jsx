import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { SignButton } from "../components/Button";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import "../styles/screens/signForm.css";

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5050/api/account/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Registration failed");

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
      <div className="d-flex gap-3 w-100">
        <Input
          className="border-0 px-4 rounded-3 w-50"
          type="text"
          placeholder="First Name"
          name="fname"
          value={formData.fname}
          onChange={handleChange}
        />
        <Input
          className="border-0 px-4 rounded-3 w-50"
          type="text"
          placeholder="Last Name"
          name="lname"
          value={formData.lname}
          onChange={handleChange}
        />
      </div>
      <Input
        className="border-0 px-4 rounded-3"
        type="email"
        placeholder="Email"
        name="email"
        value={formData.email}
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
      <SignButton
        className="sign-btn border-0 rounded-3 fw-semibold mt-3"
        type="submit"
        onClick={handleSubmit}
      >
        Regjistrohu
      </SignButton>
    </>
  );
}

export default RegisterForm;
