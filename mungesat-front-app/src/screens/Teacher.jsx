import React from "react";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Dropdown from "../components/Dropdown";
import SearchForm from "../components/SearchForm";

function Teacher() {
  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-between">
          <h1>Mësimdhënësit</h1>
          <AddButton>Shto Mësimdhënës</AddButton>
        </div>
        <div className="mt-4 d-flex justify-content-start align-items-center">
          <Dropdown />
          <SearchForm />
        </div>
        <div className="h-75 mt-4 d-flex flex-column justify-content-center align-items-center">
          <h2>Nuk ka asnjë mësimdhënës!</h2>
          <p className="text-secondary">
            Mësimdhënsit shfaqen atëherë kur janë shtuar.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Teacher;
