import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Input from "../components/Input";
import { SignButton } from "../components/Button";
import axios from "../axiosInstance";

function TeacherEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [emri, setEmri] = useState("");
  const [mbiemri, setMbiemri] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [klasatId, setKlasatId] = useState("");
  const [klasat, setKlasat] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadDone, setLoadDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/Kujdestaret/${id}`)
      .then((res) => {
        const d = res.data;
        setUsername(d.userName ?? d.UserName ?? "");
        setEmri(d.emri ?? d.Emri ?? "");
        setMbiemri(d.mbiemri ?? d.Mbiemri ?? "");
        setEmail(d.email ?? d.Email ?? "");
      })
      .catch(() => setError("Kujdestari nuk u gjet."))
      .finally(() => setLoadDone(true));
    axios.get("/Klasat").then((res) => setKlasat(Array.isArray(res.data) ? res.data : [])).catch(() => setKlasat([]));
  }, [id]);

  const handleBackClick = () => navigate("/teacher");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = {
        UserName: (username || "").trim() || null,
        Emri: (emri || "").trim() || null,
        Mbiemri: (mbiemri || "").trim() || null,
        Email: (email || "").trim() || null,
        NewPassword: newPassword.trim() || null,
        KlasatId: klasatId ? parseInt(klasatId, 10) : null,
      };
      const res = await axios.put(`/Kujdestaret/${id}`, body);
      if (res && res.status === 200) navigate("/teacher");
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      let msg =
        (typeof data === "string" ? data : data?.message) ||
        err.message ||
        "Ndryshimet nuk u ruajtën.";
      if (status === 403)
        msg =
          "Nuk u njohët si administrator. Dil dhe kyçu përsëri me llogarinë administrator (adilj) që tokeni të përditësohet.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!loadDone && !error) {
    return (
      <div className="teacher h-100 w-100 d-flex">
        <Sidebar />
        <div className="w-100 p-5">
          <div className="mt-4 text-secondary">Duke ngarkuar…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-between">
          <h1>Ndrysho kujdestarin</h1>
          <AddButton onClick={handleBackClick} type="button">
            Kthehu
          </AddButton>
        </div>
        <div className="h-75 mt-5 ms-5 d-flex flex-column align-items-center">
          {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
          <form onSubmit={handleSubmit} className="ms-5 mt-3 d-flex flex-column gap-4 w-50">
            <p className="text-secondary small mb-0">Ndryshoni emrin e përdoruesit dhe/ose fjalëkalimin që kujdestari të kyqet.</p>
            <Input
              className="border-0 px-4 rounded-3"
              type="text"
              placeholder="Emri i përdoruesit (për kyçje)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              className="border-0 px-4 rounded-3"
              type="text"
              placeholder="Emri"
              value={emri}
              onChange={(e) => setEmri(e.target.value)}
              required
            />
            <Input
              className="border-0 px-4 rounded-3"
              type="text"
              placeholder="Mbiemri"
              value={mbiemri}
              onChange={(e) => setMbiemri(e.target.value)}
              required
            />
            <Input
              className="border-0 px-4 rounded-3"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="d-flex position-relative">
              <Input
                className="border-0 px-4 rounded-3 w-100 pe-5"
                type={showPassword ? "text" : "password"}
                placeholder="Fjalëkalim i ri (lini bosh për të mos e ndryshuar)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                className="position-absolute top-50 translate-middle-y end-0 me-3 text-secondary"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setShowPassword((p) => !p)}
              >
                {showPassword ? "Fshih" : "Shfaq"}
              </span>
            </div>
            <label className="form-label text-secondary mb-0">Klasa (ku është kujdestar)</label>
            <select
              className="form-select border-0 px-4 rounded-3 py-2"
              value={klasatId}
              onChange={(e) => setKlasatId(e.target.value)}
            >
              <option value="">Pa ndryshim / pa klasë</option>
              {klasat.map((k) => (
                <option key={k.id ?? k.Id} value={k.id ?? k.Id}>
                  {k.emri ?? k.Emri ?? ""}
                </option>
              ))}
            </select>
            <SignButton
              type="submit"
              className="sign-btn border-0 rounded-3 fw-semibold mt-3"
              disabled={loading}
            >
              {loading ? "Duke ruajtur…" : "Ruaj ndryshimet"}
            </SignButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TeacherEdit;
