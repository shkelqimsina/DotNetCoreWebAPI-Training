import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Input from "../components/Input";
import { SignButton } from "../components/Button";

function ClassAdd() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/class");
  };

  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-between">
          <h1>Klasët</h1>
          <AddButton onClick={handleBackClick}>Kthehu</AddButton>
        </div>
        <div className="h-75 mt-5 ms-5 d-flex flex-column align-items-center">
          <form className="ms-5 mt-5 d-flex flex-column gap-4 w-50">
            <h4>Shto Klasë</h4>
            <Input
              className="border-0 px-4 rounded-3"
              type="text"
              placeholder="Emri i klasës"
            />
            <Input
              className="border-0 px-4 rounded-3"
              type="number"
              min="0"
              placeholder="Kujdestari Id"
            />
            <SignButton className="sign-btn border-0 rounded-3 fw-semibold mt-3">
              Shto Klasën
            </SignButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClassAdd;
