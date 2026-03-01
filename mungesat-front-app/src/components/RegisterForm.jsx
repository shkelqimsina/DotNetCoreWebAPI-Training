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
    emri: "",
    mbiemri: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      const data = text ? (() => { try { return JSON.parse(text); } catch { return {}; } })() : {};
      if (!response.ok) {
        const parts = [];
        if (data.title) parts.push(data.title);
        if (data.message) parts.push(data.message);
        if (data.detail) parts.push(data.detail);
        if (data.errors) {
          if (Array.isArray(data.errors)) {
            parts.push(data.errors.join(" "));
          } else if (typeof data.errors === "object") {
            const list = Object.entries(data.errors).flatMap(([key, val]) =>
              (Array.isArray(val) ? val : [val]).map((m) => (key === "Email" ? "Email: duhet të jetë adresë e vlefshme (p.sh. emri@domain.com)." : `${key}: ${m}`))
            );
            parts.push(list.join(" "));
          }
        }
        const msg = parts.length ? parts.join(" — ") : (text || "Regjistrimi dështoi.");
        throw new Error(msg);
      }

      navigate("/dashboard");
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("fetch") || msg.includes("Network") || msg.includes("Failed"))
        setError("Lidhja me serverin dështoi. Sigurohuni që API është i ndezur (http://localhost:5050).");
      else
        setError(msg || "Regjistrimi dështoi.");
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
          name="emri"
          value={formData.emri}
          onChange={handleChange}
        />
        <Input
          className="border-0 px-4 rounded-3 w-50"
          type="text"
          placeholder="Last Name"
          name="mbiemri"
          value={formData.mbiemri}
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
      <p className="text-muted small mb-0">Fjalëkalimi: të paktën 6 karaktere, shkronjë e madhe, e vogël, shifër dhe simbol (p.sh. !@#).</p>
      {error && <div className="alert alert-danger py-2 mt-2 mb-0">{error}</div>}
      <SignButton
        className="sign-btn border-0 rounded-3 fw-semibold mt-3"
        type="submit"
        disabled={loading}
        onClick={handleSubmitRegister}
      >
        {loading ? "Duke u regjistruar…" : "Regjistrohu"}
      </SignButton>
    </>
  );
}

export default RegisterForm;
