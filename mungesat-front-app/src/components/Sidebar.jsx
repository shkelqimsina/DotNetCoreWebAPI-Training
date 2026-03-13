import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SideItem from "./SideItem";
import eMungesat from "../assets/logos/eMungesat.png";
import "../styles/screens/dashboard.css";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GoSidebarCollapse } from "react-icons/go";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import { TbSettings } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import { MdErrorOutline } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import axios from "../axiosInstance";

function Sidebar() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  const { user, role, token, logout } = useContext(AuthContext);
  const [me, setMe] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get("/account/me").then((r) => setMe(r.data)).catch(() => setMe(null));
    } else {
      setMe(null);
    }
  }, [token]);

  const effectiveRole = me?.role ?? role ?? "";
  const isAdministrator = (me?.isAdministrator ?? false) || effectiveRole === "Administrator";
  const isKujdestar = (me?.isKujdestar ?? false) || effectiveRole === "Kujdestar";
  const isPrindi = (me?.isPrindi ?? false) || effectiveRole === "Prindi";
  const isDrejtori = (me?.isDrejtori ?? false) || effectiveRole === "Drejtori";

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      {showSidebar ? (
        <>
          <div
            className={`sidebar d-flex flex-column align-items-center ${
              showSidebar && "show"
            }`}
          >
            <div className="d-flex justify-content-between align-items-center gap-5 my-3">
              <img src={eMungesat} alt="eMungesat Logo" className="logo" />
              <FaArrowLeftLong
                className="sidebar-toggle fs-5 fw-very-bold"
                onClick={() => toggleSidebar()}
              />
            </div>
            {token && (
              <div
                className="px-2 py-2 w-100 text-center rounded-2 mb-2"
                style={{ background: "rgba(255,255,255,0.12)" }}
              >
                <div className="small text-white text-opacity-90">
                  <strong>{me?.userName ?? user?.userName ?? "..."}</strong>
                </div>
                <div className="small text-white text-opacity-85">
                  Roli: <strong>{effectiveRole || (me ? "—" : "...")}</strong>
                  {(isAdministrator || isKujdestar || isPrindi || isDrejtori) && " ✓"}
                </div>
              </div>
            )}
            <div className="mt-2 p-0 w-100 d-flex flex-column gap-1">
              <SideItem
                icon={<TbLayoutDashboardFilled />}
                title="Paneli i kryesor"
                path="/"
              />
              {(isAdministrator || isDrejtori) && (
                <SideItem
                  icon={<FaChalkboardTeacher />}
                  title="Kujdestarët"
                  path="/teacher"
                />
              )}
              {(isAdministrator || isKujdestar) && (
                <SideItem
                  icon={<FaChalkboardTeacher />}
                  title="Klasët"
                  path="/class"
                />
              )}
              {(isAdministrator || isKujdestar) && (
                <SideItem
                  icon={<PiStudentBold />}
                  title="Nxënësit"
                  path="/student"
                />
              )}
              {(isAdministrator || isKujdestar) && (
                <SideItem
                  icon={<MdErrorOutline />}
                  title="Mungesat"
                  path="/missings"
                />
              )}
              {isPrindi && (
                <SideItem
                  icon={<MdErrorOutline />}
                  title="Mungesat e fëmijës"
                  path="/missings"
                />
              )}
              {isDrejtori && (
                <SideItem
                  icon={<MdErrorOutline />}
                  title="Mungesat"
                  path="/missings"
                />
              )}
              {isAdministrator && (
                <SideItem
                  icon={<TbSettings />}
                  title="Cilësimet"
                  path="/settings"
                />
              )}
              <button
                type="button"
                className="side-item m-1 d-flex align-items-center gap-3 px-3 rounded-3 w-100 border-0 bg-transparent text-white text-start"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <span className="scale-125">{<BiLogOut />}</span>
                <p className="mb-0">Dil (kyçu jashtë)</p>
              </button>
            </div>
          </div>
        </>
      ) : (
        <GoSidebarCollapse
          className="sidebar-toggle fs-4 m-3"
          onClick={() => toggleSidebar()}
        />
      )}
    </>
  );
}

export default Sidebar;
