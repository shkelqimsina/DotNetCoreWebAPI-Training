import React, { useState } from "react";
import SideItem from "./SideItem";
import eMungesat from "../assets/logos/eMungesat.png";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GoSidebarCollapse } from "react-icons/go";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import { TbSettings } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import { MdErrorOutline } from "react-icons/md";

function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(true);

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
            <div className="mt-5 p-0 w-100 d-flex flex-column gap-1">
              <SideItem
                icon={<TbLayoutDashboardFilled />}
                title="Paneli i kryesor"
                path="/dashboard"
              />
              <SideItem
                icon={<FaChalkboardTeacher />}
                title="Mësimdhënësit"
                path="/teacher"
              />
              <SideItem
                icon={<FaChalkboardTeacher />}
                title="Klasët"
                path="/class"
              />
              <SideItem
                icon={<PiStudentBold />}
                title="Nxënësit"
                path="/student"
              />
              <SideItem
                icon={<MdErrorOutline />}
                title="Mungesat"
                path="/missings"
              />
              <SideItem
                icon={<TbSettings />}
                title="Cilësimet"
                path="/settings"
              />
              <SideItem icon={<BiLogOut />} title="Çkyqu" />
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
