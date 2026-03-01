import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Input from "../components/Input";
import { SignButton } from "../components/Button";
import axios from "../axiosInstance";

function TeacherAdd() {
  const navigate = useNavigate();
  const [emri, setEmri] = useState("");
  const [mbiemri, setMbiemri] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBackClick = () => {
    navigate("/teacher");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("/Kujdestaret", { emri, mbiemri, email });
      navigate("/teacher");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        err.message ||
        "Shtimi i kujdestarit dështoi.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-between">
          <h1>Kujdestarët</h1>
          <AddButton onClick={handleBackClick} type="button">
            Kthehu
          </AddButton>
        </div>
        <div className="h-75 mt-5 ms-5 d-flex flex-column align-items-center">
          <form onSubmit={handleSubmit} className="ms-5 mt-5 d-flex flex-column gap-4 w-50">
            <h4>Shto Kujdestarin</h4>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <Input
              className="border-0 px-4 rounded-3"
              type="text"
              placeholder="Emri"
              value={emri}
              onChange={(e) => setEmri(e.target.value)}
              required
            />
            <Input
              className="border-0 px-4 rounded-3"
              type="text"
              placeholder="Mbiemri"
              value={mbiemri}
              onChange={(e) => setMbiemri(e.target.value)}
              required
            />
            <Input
              className="border-0 px-4 rounded-3"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <SignButton
              type="submit"
              className="sign-btn border-0 rounded-3 fw-semibold mt-3"
              disabled={loading}
            >
              {loading ? "Duke shtuar…" : "Shto Kujdestarin"}
            </SignButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TeacherAdd;
