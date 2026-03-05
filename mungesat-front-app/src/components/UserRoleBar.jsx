import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../axiosInstance";

export default function UserRoleBar() {
  const { user, role, token } = useContext(AuthContext);
  const [me, setMe] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get("/account/me").then((r) => setMe(r.data)).catch(() => setMe(null));
    } else {
      setMe(null);
    }
  }, [token]);

  if (!token) return null;

  const displayName = me?.userName ?? me?.UserName ?? user?.userName ?? "...";
  const apiRole = me?.role ?? me?.Role ?? "";
  const displayRole = apiRole || role || "Nuk u caktua";

  return (
    <div
      className="d-flex justify-content-between align-items-center px-3 py-2 small text-white"
      style={{ background: "var(--bs-primary, #6f42c1)", minHeight: "36px" }}
    >
      <span>
        Je i kyçur si: <strong>{displayName}</strong>
        {" · "}
        Roli: <strong>{displayRole}</strong>
        {displayRole === "Administrator" && " ✓"}
      </span>
    </div>
  );
}
