import { NavLink } from "react-router-dom";

function SideItem({ icon, title, path, className }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        isActive
          ? "active side-item m-1 d-flex align-items-center gap-3 px-3 rounded-3 fs-6"
          : `side-item d-flex align-items-center gap-3 px-3 rounded-3 ${className}`
      }
    >
      <span className="scale-125">{icon}</span>
      <p className="mb-0 text-decoration-none">{title}</p>
    </NavLink>
  );
}

export default SideItem;
