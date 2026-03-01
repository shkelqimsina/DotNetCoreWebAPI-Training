import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Input from "../components/Input";
import { SignButton } from "../components/Button";
import axios from "../axiosInstance";

function MissingAdd() {
  const navigate = useNavigate();
  const [nxenesiId, setNxenesiId] = useState("");
  const [data, setData] = useState("");
  const [arsyeja, setArsyeja] = useState("");
  const [oretZgjidhura, setOretZgjidhura] = useState([]); // [1, 2, 5] = Ora 1, 2, 5
  const [nxenesit, setNxenesit] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleOre = (ore) => {
    setOretZgjidhura((prev) =>
      prev.includes(ore) ? prev.filter((o) => o !== ore) : [...prev, ore].sort((a, b) => a - b)
    );
  };

  useEffect(() => {
    axios
      .get("/Nxenesit")
      .then((res) => setNxenesit(Array.isArray(res.data) ? res.data : []))
      .catch(() => setNxenesit([]));
  }, []);

  const handleBackClick = () => navigate("/missings");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!nxenesiId) {
      setError("Zgjidhni nxënësin.");
      return;
    }
    if (oretZgjidhura.length === 0) {
      setError("Zgjidhni të paktën një orë mungese.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/Mungesat", {
        data: data || new Date().toISOString().slice(0, 10),
        arsyeja: arsyeja.trim() || null,
        oret: oretZgjidhura.join(","),
        nxenesiId: parseInt(nxenesiId, 10),
      });
      navigate("/missings");
    } catch (err) {
      let msg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        err.message ||
        "Shtimi i mungesës dështoi.";
      if (err.response?.status === 404) {
        msg =
          "Skresa e API-së nuk u gjet (404). Sigurohuni që backend-i (Mungesat_shkolla) është duke xhiruar: nga dosja e projektit ekzekutoni dotnet run, pastaj provoni përsëri.";
      }
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
          <h1>Mungesat</h1>
          <AddButton onClick={handleBackClick} type="button">
            Kthehu
          </AddButton>
        </div>
        <div className="h-75 mt-5 ms-5 d-flex flex-column align-items-center">
          <form onSubmit={handleSubmit} className="ms-5 mt-5 d-flex flex-column gap-4 w-50">
            <h4>Shto Mungesë</h4>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <label className="form-label text-secondary mb-0">Nxënësi</label>
            <select
              className="form-select border-0 px-4 rounded-3 py-2"
              value={nxenesiId}
              onChange={(e) => setNxenesiId(e.target.value)}
              required
            >
              <option value="">Zgjidhni nxënësin</option>
              {nxenesit.map((n) => {
                const id = n.id ?? n.Id;
                const emri = n.emri ?? n.Emri ?? "";
                const mbiemri = n.mbiemri ?? n.Mbiemri ?? "";
                return (
                  <option key={id} value={id}>
                    {emri} {mbiemri}
                  </option>
                );
              })}
            </select>
            <label className="form-label text-secondary mb-0">Data</label>
            <Input
              className="border-0 px-4 rounded-3"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
            <Input
              className="border-0 px-4 rounded-3"
              type="text"
              placeholder="Arsyeja (opsional)"
              value={arsyeja}
              onChange={(e) => setArsyeja(e.target.value)}
            />
            <label className="form-label text-secondary mb-1 fw-semibold">
              Oret – zgjidhni në cilat ore ka munguar (të paktën një)
            </label>
            <div className="d-flex flex-wrap gap-3 align-items-center">
              {[1, 2, 3, 4, 5, 6, 7].map((ore) => (
                <label key={ore} className="d-flex align-items-center gap-2 mb-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={oretZgjidhura.includes(ore)}
                    onChange={() => toggleOre(ore)}
                    className="form-check-input"
                  />
                  <span>Ora {ore}</span>
                </label>
              ))}
            </div>
            <SignButton
              type="submit"
              className="sign-btn border-0 rounded-3 fw-semibold mt-3"
              disabled={loading}
            >
              {loading ? "Duke shtuar…" : "Shto Mungesën"}
            </SignButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MissingAdd;
