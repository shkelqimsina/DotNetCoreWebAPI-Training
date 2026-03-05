import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Input from "../components/Input";
import { GenderDropdown } from "../components/Dropdown";
import { SignButton } from "../components/Button";
import axios from "../axiosInstance";

function StudentAdd() {
  const navigate = useNavigate();
  const [emri, setEmri] = useState("");
  const [mbiemri, setMbiemri] = useState("");
  const [ditelindja, setDitelindja] = useState("");
  const [gjinia, setGjinia] = useState("");
  const [adresa, setAdresa] = useState("");
  const [prindi, setPrindi] = useState("");
  const [klasatId, setKlasatId] = useState("");
  const [klasat, setKlasat] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/Klasat")
      .then((res) => setKlasat(Array.isArray(res.data) ? res.data : []))
      .catch(() => setKlasat([]));
  }, []);

  const handleBackClick = () => {
    navigate("/student");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!emri.trim() || !mbiemri.trim() || !prindi.trim() || !gjinia || !klasatId) {
      setError("Plotësoni emrin, mbiemrin, prindin, gjininë dhe klasën.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/Nxenesit", {
        emri: emri.trim(),
        mbiemri: mbiemri.trim(),
        ditelindja: ditelindja || "2000-01-01",
        gjinia,
        adresa: adresa.trim() || null,
        prindi: prindi.trim(),
        klasatId: parseInt(klasatId, 10),
      });
      navigate("/student");
    } catch (err) {
      let msg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        err.message ||
        "Shtimi i nxënësit dështoi.";
      if (err.response?.status === 403)
        msg =
          "Nuk keni të drejtë të shtoni nxënës. Vetëm kujdestari i klasës ose administratori mund të shtojë nxënës. Sigurohuni që keni kyçur me llogarinë e duhur.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-between">
          <h1>Nxënësit</h1>
          <AddButton onClick={handleBackClick} type="button">
            Kthehu
          </AddButton>
        </div>
        <div className="h-75 mt-5 mx-5 d-flex flex-column align-items-center">
          <form onSubmit={handleSubmit} className="ms-5 mt-5 d-flex flex-column gap-4 w-100">
            <h4>Shto Nxënësin</h4>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="d-flex gap-5 w-100 flex-wrap">
              <Input
                className="border-0 px-4 rounded-3"
                type="text"
                placeholder="Emri"
                value={emri}
                onChange={(e) => setEmri(e.target.value)}
                required
              />
              <GenderDropdown
                className="border-0 px-4 rounded-3"
                value={gjinia}
                onChange={(e) => setGjinia(e.target.value)}
                required
              >
                <option value="">Gjinia:</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </GenderDropdown>
              <select
                className="form-select border-0 px-4 rounded-3 py-2"
                value={klasatId}
                onChange={(e) => setKlasatId(e.target.value)}
                required
              >
                <option value="">Klasa</option>
                {klasat.map((k) => (
                  <option key={k.id ?? k.Id} value={k.id ?? k.Id}>
                    {k.emri ?? k.Emri ?? ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex gap-5 w-100 flex-wrap">
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
                type="text"
                placeholder="Prindi"
                value={prindi}
                onChange={(e) => setPrindi(e.target.value)}
                required
              />
              <Input
                className="border-0 px-4 rounded-3"
                type="date"
                placeholder="Ditëlindja"
                value={ditelindja}
                onChange={(e) => setDitelindja(e.target.value)}
              />
            </div>
            <div className="d-flex gap-5 w-100 flex-wrap">
              <Input
                className="border-0 px-4 rounded-3 w-50"
                type="text"
                placeholder="Adresa"
                value={adresa}
                onChange={(e) => setAdresa(e.target.value)}
              />
            </div>
            <SignButton
              type="submit"
              className="sign-btn border-0 rounded-3 fw-semibold mt-3"
              disabled={loading}
            >
              {loading ? "Duke shtuar…" : "Shto Nxënësin"}
            </SignButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentAdd;
