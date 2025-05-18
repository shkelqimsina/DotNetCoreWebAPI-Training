import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/screens/dashboard.css";

function Dashboard() {
  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-start">
          <h1 className="mt-5">
            Mirë se vjen tek paneli yt kryesor, eMungesat!{" "}
          </h1>
        </div>
        <div className="h-75 mt-5 ms-4 d-flex flex-column gap-5">
          <div>
            <h2>Shto Kujdestarë</h2>
            <p>Krijo një pasqyrë të mirë rreth kujdestarëve të shkollës.</p>
          </div>
          <div>
            <h2>Shto Klasë</h2>
            <p>Krijo një pasqyrë të mirë rreth nxënësve të shkollës të shkollës.</p>
          </div>
          <div>
            <h2>Shto Mungesë</h2>
            <p>Krijo një pasqyrë të mirë të mungesave të nxënësve të shkollës.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
