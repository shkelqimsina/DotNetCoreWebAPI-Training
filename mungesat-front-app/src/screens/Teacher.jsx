import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Dropdown from "../components/Dropdown";
import SearchForm from "../components/SearchForm";
import axios from "../axiosInstance";

function Teacher() {
  const navigate = useNavigate();
  const [kujdestaret, setKujdestaret] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    axios
      .get("/Kujdestaret")
      .then((res) => setKujdestaret(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        setKujdestaret([]);
        if (err.response?.status === 401) {
          setError("Duhet të jeni të kyçur për të parë listën.");
        } else {
          setError("Lista nuk u ngarkua.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddClick = () => {
    navigate("/teacher-add");
  };

  const isEmpty = !loading && kujdestaret.length === 0;

  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-between">
          <h1>Kujdestarët</h1>
          <AddButton onClick={handleAddClick} type="button">Shto Kujdestarë</AddButton>
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
        {loading && (
          <div className="mt-4 text-secondary">Duke ngarkuar…</div>
        )}
        {!loading && !isEmpty && (
          <div className="mt-4">
            <ul className="list-group list-group-flush">
              {kujdestaret.map((k) => {
                const id = k.id ?? k.Id;
                const emri = k.emri ?? k.Emri ?? "";
                const mbiemri = k.mbiemri ?? k.Mbiemri ?? "";
                const email = k.email ?? k.Email ?? "";
                return (
                  <li key={id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{emri} {mbiemri} {email && `(${email})`}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {isEmpty && (
          <div className="h-75 mt-4 d-flex flex-column justify-content-center align-items-center">
            <h2>Nuk ka asnjë kujdestarë!</h2>
            <p className="text-secondary">
              Kujdestarët shfaqen atëherë kur janë shtuar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teacher;
