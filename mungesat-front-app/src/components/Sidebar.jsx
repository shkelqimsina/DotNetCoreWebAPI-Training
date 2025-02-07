import React, { useState } from "react";
import SideItem from "./SideItem";
import eMungesat from "../assets/logos/eMungesat.png";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GoSidebarExpand } from "react-icons/go";
import { GoSidebarCollapse } from "react-icons/go";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import { TbSettings } from "react-icons/tb";

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
              <SideItem icon={<TbLayoutDashboardFilled />} title="Dashboard" />
              <SideItem icon={<FaChalkboardTeacher />} title="Teachers" />
              <SideItem icon={<PiStudentBold />} title="Students" />
              <SideItem icon={<FaUser />} title="Profile" />
              <SideItem icon={<TbSettings />} title="Settings" />
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
