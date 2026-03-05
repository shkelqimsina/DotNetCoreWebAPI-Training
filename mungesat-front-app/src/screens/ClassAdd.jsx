import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Input from "../components/Input";
import { SignButton } from "../components/Button";
import axios from "../axiosInstance";

function ClassAdd() {
  const navigate = useNavigate();
  const [emri, setEmri] = useState("");
  const [kujdestariId, setKujdestariId] = useState("");
  const [kujdestaret, setKujdestaret] = useState([]);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoadError("");
    axios
      .get("/Kujdestaret")
      .then((res) => setKujdestaret(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        setKujdestaret([]);
        if (err.response?.status === 401) {
          setLoadError("Duhet të jeni të kyçur për të parë listën e kujdestarëve.");
        } else {
          setLoadError("Lista e kujdestarëve nuk u ngarkua. Rifreskoni faqen ose kontrolloni lidhjen.");
        }
      });
  }, []);

  const handleBackClick = () => navigate("/class");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("/Klasat", { emri, kujdestariId: parseInt(kujdestariId, 10) });
      navigate("/class");
    } catch (err) {
      let msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.message || err.message || "Dështoi shtimi i klasës.";
      if (err.response?.status === 403)
        msg = "Vetëm administratori mund të shtojë klasa. Dil dhe kyçu me një llogari administratori.";
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
          <h1>Klasët</h1>
          <AddButton onClick={handleBackClick} type="button">Kthehu</AddButton>
        </div>
        <div className="h-75 mt-5 ms-5 d-flex flex-column align-items-center">
          <form onSubmit={handleSubmit} className="ms-5 mt-5 d-flex flex-column gap-4 w-50">
            <h4>Shto Klasë</h4>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <Input
              className="border-0 px-4 rounded-3"
              type="text"
              placeholder="Emri i klasës (p.sh. 10A)"
              value={emri}
              onChange={(e) => setEmri(e.target.value)}
              required
            />
            <label className="form-label text-secondary mb-0">Kujdestari (mësuesi i klasës)</label>
            {loadError && <div className="alert alert-warning py-2 small">{loadError}</div>}
            <select
              className="form-select border-0 px-4 rounded-3 py-2"
              value={kujdestariId}
              onChange={(e) => setKujdestariId(e.target.value)}
              required
            >
              <option value="">Zgjidhni kujdestarin</option>
              {kujdestaret.map((k) => {
                const id = k.id ?? k.Id;
                const emri = k.emri ?? k.Emri ?? "";
                const mbiemri = k.mbiemri ?? k.Mbiemri ?? "";
                return (
                  <option key={id} value={id}>
                    {emri} {mbiemri}
                  </option>
                );
              })}
            </select>
            <SignButton type="submit" className="sign-btn border-0 rounded-3 fw-semibold mt-3" disabled={loading}>
              {loading ? "Duke u shtuar…" : "Shto Klasën"}
            </SignButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClassAdd;
