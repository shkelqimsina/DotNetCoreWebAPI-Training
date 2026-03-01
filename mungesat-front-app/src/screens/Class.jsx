import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Dropdown from "../components/Dropdown";
import SearchForm from "../components/SearchForm";
import axios from "../axiosInstance";
import { AuthContext } from "../context/AuthContext";

function Class() {
  const navigate = useNavigate();
  const { isAdministrator } = useContext(AuthContext);
  const [klasat, setKlasat] = useState([]);

  const handleAddClick = () => {
    navigate("/class-add");
  };

  useEffect(() => {
    axios
      .get("/Klasat")
      .then((res) => setKlasat(res.data || []))
      .catch(() => setKlasat([]));
  }, []);

  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-between align-items-center">
          <h1>Klasët</h1>
          {isAdministrator && (
            <AddButton onClick={handleAddClick} type="button">Shto Klasë</AddButton>
          )}
        </div>
        <div className="mt-4 d-flex justify-content-start align-items-center">
          <Dropdown
            main="Filtro"
            option1="Klaset e 10"
            option2="Klaset e 11"
            option3="Klaset e 12"
          />
          <SearchForm />
        </div>
        <div className="h-75 mt-4">
          {klasat.length === 0 ? (
            <div className="d-flex flex-column justify-content-center align-items-center h-100">
              <h2>Nuk ka asnjë klasë</h2>
              <p className="text-secondary mb-4">Klasët shfaqen këtu pasi t'i shtoni.</p>
              {isAdministrator && (
                <AddButton onClick={handleAddClick} type="button">Shto klasë të parë</AddButton>
              )}
            </div>
          ) : (
            <ul className="list-group">
              {klasat.map((klasa) => (
                <li key={klasa.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    <strong>Klasa {klasa.emri}</strong>
                    <span className="text-muted ms-2">
                      – Kujdestari: {[klasa.emriKujdestari, klasa.mbiemriKujdestari].filter(Boolean).join(" ") || "—"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Class;
