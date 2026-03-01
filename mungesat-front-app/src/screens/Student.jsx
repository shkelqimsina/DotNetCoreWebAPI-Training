import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Dropdown from "../components/Dropdown";
import SearchForm from "../components/SearchForm";
import axios from "../axiosInstance";

function Student() {
  const navigate = useNavigate();
  const [nxenesit, setNxenesit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    axios
      .get("/Nxenesit")
      .then((res) => setNxenesit(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        setNxenesit([]);
        setError("Lista e nxënësve nuk u ngarkua.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddClick = () => {
    navigate("/student-add");
  };

  const isEmpty = !loading && nxenesit.length === 0;

  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-between">
          <h1>Nxënësit</h1>
          <AddButton onClick={handleAddClick}>Shto Nxënës</AddButton>
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
              {nxenesit.map((n) => {
                const id = n.id ?? n.Id;
                const emri = n.emri ?? n.Emri ?? "";
                const mbiemri = n.mbiemri ?? n.Mbiemri ?? "";
                const prindi = n.prindi ?? n.Prindi ?? "";
                const ditelindja = n.ditelindja ?? n.Ditelindja;
                const dateStr = ditelindja ? new Date(ditelindja).toLocaleDateString("sq-AL") : "";
                return (
                  <li key={id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{emri} {mbiemri} {prindi && ` – Prindi: ${prindi}`} {dateStr && ` (${dateStr})`}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {isEmpty && (
          <div className="h-75 mt-4 d-flex flex-column justify-content-center align-items-center">
            <h2>Nuk ka asnjë nxënës!</h2>
            <p className="text-secondary">
              Nxënësit shfaqen atëherë kur janë shtuar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Student;
