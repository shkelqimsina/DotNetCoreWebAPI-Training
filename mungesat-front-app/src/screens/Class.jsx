import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Dropdown from "../components/Dropdown";
import SearchForm from "../components/SearchForm";

function Class() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/class-add");
  };

  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-between">
          <h1>Klasët</h1>
          <AddButton onClick={handleBackClick}>Shto Klasë</AddButton>
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
        <div className="h-75 mt-4 d-flex flex-column justify-content-center align-items-center">
          <h2>Nuk ka asnjë Klasë!</h2>
          <p className="text-secondary">
            Klasët shfaqen atëherë kur janë shtuar.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Class;
