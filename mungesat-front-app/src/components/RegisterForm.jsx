import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { SignButton } from "../components/Button";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import axios from "../axiosInstance";
import "../styles/screens/signForm.css";

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useContext(AuthContext);

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
    role: "Kujdestar",
    adminUserName: "",
    adminPassword: "",
  });
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const data = await registerUser(
        formData.username,
        formData.emri,
        formData.mbiemri,
        formData.email,
        formData.password,
        formData.role,
        formData.role === "Kujdestar" || formData.role === "Drejtori" ? formData.adminUserName : undefined,
        formData.role === "Kujdestar" || formData.role === "Drejtori" ? formData.adminPassword : undefined
      );

      if (data && data.token) {
        setSuccessMessage("U regjistrua me sukses.");
        const role = data.role || formData.role;
        const goToMissings = role === "Drejtori";
        setTimeout(() => {
          navigate(goToMissings ? "/missings" : "/teacher");
        }, 1500);
      } else {
        setError("Regjistrimi dështoi.");
      }
    } catch (err) {
      const res = err.response;
      let msg = err.message || "";
      if (res?.data) {
        if (typeof res.data === "string") msg = res.data;
        else if (res.data.message) msg = res.data.message;
        else if (res.data.errors && Array.isArray(res.data.errors)) msg = res.data.errors.join(" ");
        if (res.data.detail && typeof res.data.detail === "string") msg = msg ? `${msg}: ${res.data.detail}` : res.data.detail;
      }
      if (msg.includes("fetch") || msg.includes("Network") || msg.includes("Failed"))
        setError("Lidhja me serverin dështoi. Sigurohuni që API është i ndezur.");
      else
        setError(msg || "Regjistrimi dështoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-100">
        <label className="form-label text-body-secondary small mb-1">Roli</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="form-select border-0 px-4 rounded-3 py-2"
        >
          <option value="Kujdestar">Kujdestar</option>
          <option value="Drejtori">Drejtori</option>
        </select>
      </div>
      <p className="small text-body-secondary mt-1 mb-0">Regjistrimi si Prind bëhet nga Administratori, Drejtori ose kujdestari i klasës, te faqja Nxënësit.</p>

      {(formData.role === "Kujdestar" || formData.role === "Drejtori") && (
        <>
          <p className="small text-warning mt-2 mb-1">
            {formData.role === "Drejtori"
              ? "Regjistrimi i drejtorit i lejohet vetëm administratorit."
              : "Regjistrimi i kujdestarit i lejohet administratorit ose drejtorit."}
          </p>
          <Input
            className="border-0 px-4 rounded-3"
            type="text"
            placeholder={formData.role === "Drejtori" ? "Emri i përdoruesit (Administrator)" : "Emri i përdoruesit (Administrator ose Drejtori)"}
            name="adminUserName"
            value={formData.adminUserName}
            onChange={handleChange}
          />
          <div className="d-flex position-relative">
            <Input
              className="border-0 px-4 rounded-3 w-100 pe-5"
              type={showAdminPassword ? "text" : "password"}
              placeholder={formData.role === "Drejtori" ? "Fjalëkalimi (Administrator)" : "Fjalëkalimi (Administrator ose Drejtori)"}
              name="adminPassword"
              value={formData.adminPassword}
              onChange={handleChange}
            />
            <span
              className="position-absolute top-50 translate-middle-y end-0 me-3"
              style={{ cursor: "pointer" }}
              onClick={() => setShowAdminPassword((v) => !v)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setShowAdminPassword((v) => !v); }}
              aria-label={showAdminPassword ? "Fsheh fjalëkalimin" : "Shfaq fjalëkalimin"}
            >
              {showAdminPassword ? <FaEyeSlash className="eye" /> : <FaEye className="eye" />}
            </span>
          </div>
        </>
      )}

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
      {successMessage && <div className="alert alert-success py-2 mt-2 mb-0">{successMessage}</div>}
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
