import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Dropdown from "../components/Dropdown";
import SearchForm from "../components/SearchForm";
import axios from "../axiosInstance";

function Missings() {
  const navigate = useNavigate();
  const [mungesat, setMungesat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    axios
      .get("/Mungesat")
      .then((res) => setMungesat(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        setMungesat([]);
        setError("Lista e mungesave nuk u ngarkua.");
      })
      .finally(() => setLoading(false));
  }, []);

  const isEmpty = !loading && mungesat.length === 0;

  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-between">
          <h1>Mungesat</h1>
          <AddButton onClick={() => navigate("/missings-add")} type="button">
            Shto Mungesë
          </AddButton>
        </div>
        <div className="mt-4 d-flex justify-content-start align-items-center">
          <Dropdown
            main="Filtro"
            option1="Emri"
            option2="Mbiemri"
            option3="Email"
          />
          <SearchForm />
        </div>
        {error && (
          <div className="alert alert-warning mt-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
            <span>{error}</span>
            <Link to="/" className="btn btn-primary btn-sm">
              Shko te faqja e kyçjes
            </Link>
          </div>
        )}
        {loading && <div className="mt-4 text-secondary">Duke ngarkuar…</div>}
        {!loading && !isEmpty && (
          <div className="mt-4">
            <ul className="list-group list-group-flush">
              {mungesat.map((m) => {
                const id = m.id ?? m.Id;
                const data = m.data ?? m.Data;
                const dateStr = data ? new Date(data).toLocaleDateString("sq-AL") : "";
                const emri = m.emriNxenesit ?? m.EmriNxenesit ?? "";
                const mbiemri = m.mbiemriNxenesit ?? m.MbiemriNxenesit ?? "";
                const arsyeja = m.arsyeja ?? m.Arsyeja ?? "";
                const oretRaw = m.oret ?? m.Oret ?? "";
                const oretList = oretRaw ? oretRaw.split(",").map((o) => o.trim()).filter(Boolean) : [];
                const oretDisplay = oretList.length === 7
                  ? "Tëre ditën"
                  : oretList.length
                    ? "Ora " + oretList.join(", ")
                    : "";
                return (
                  <li key={id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      {emri} {mbiemri} – {dateStr}
                      {arsyeja && ` – ${arsyeja}`}
                      {oretDisplay && ` (${oretDisplay})`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {isEmpty && (
          <div className="h-75 mt-4 d-flex flex-column justify-content-center align-items-center">
            <h2>Nuk ka asnjë mungesë!</h2>
            <p className="text-secondary">
              Mungesat shfaqen atëherë kur janë shtuar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Missings;
