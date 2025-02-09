import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Input from "../components/Input";
import { SignButton } from "../components/Button";

function TeacherAdd() {
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
        <div className="h-75 mt-5 ms-5 d-flex flex-column align-items-center">
          <form className="ms-5 mt-5 d-flex flex-column gap-4 w-50">
            <h4>Shto Nxënësin</h4>
            <Input
              className="border-0 px-4 rounded-3"
              type="text"
              placeholder="Emri"
            />
            <Input
              className="border-0 px-4 rounded-3"
              type="text"
              placeholder="Mbiemri"
            />
            <Input
              className="border-0 px-4 rounded-3"
              type="email"
              placeholder="Email"
            />
            <SignButton className="sign-btn border-0 rounded-3 fw-semibold mt-3">
              Shto Nxënësin
            </SignButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TeacherAdd;
