import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Input from "../components/Input";
import Dropdown, { GenderDropdown } from "../components/Dropdown";
import { SignButton } from "../components/Button";

function StudentAdd() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/student");
  };

  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-between">
          <h1>Nxënësit</h1>
          <AddButton onClick={handleBackClick}>Kthehu</AddButton>
        </div>
        <div className="h-75 mt-5 mx-5 d-flex flex-column align-items-center">
          <form className="ms-5 mt-5 d-flex flex-column gap-4 w-100">
            <h4>Shto Nxënësin</h4>
            <div className="d-flex gap-5 w-100">
              <Input
                className="border-0 px-4 rounded-3"
                type="text"
                placeholder="Emri"
              />
              <GenderDropdown className="border-0 px-4 rounded-3">
                <option value="">Gjinia:</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </GenderDropdown>
              <Input
                className="border-0 px-4 rounded-3"
                type="number"
                min="0"
                placeholder="Klasa Id"
              />
            </div>
            <div className="d-flex gap-5 w-100">
              <Input
                className="border-0 px-4 rounded-3"
                type="text"
                placeholder="Mbiemri"
              />
              <Input
                className="border-0 px-4 rounded-3"
                type="text"
                placeholder="Prindi"
              />
              <Input
                className="border-0 px-4 rounded-3"
                type="date"
                placeholder="Ditëlindja"
              />
            </div>
            <div className="d-flex gap-5 w-100">
              <Input
                className="border-0 px-4 rounded-3 w-50"
                type="text"
                placeholder="Adresa"
              />
            </div>
            <SignButton className="sign-btn border-0 rounded-3 fw-semibold mt-3">
              Shto Nxënësin
            </SignButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentAdd;
