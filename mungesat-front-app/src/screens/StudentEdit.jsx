import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Input from "../components/Input";
import { GenderDropdown } from "../components/Dropdown";
import { SignButton } from "../components/Button";
import axios from "../axiosInstance";

function StudentEdit() {
  const { id } = useParams();
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
  const [loadDone, setLoadDone] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const [nxRes, klasaRes, meRes] = await Promise.all([
          axios.get(`/Nxenesit/${id}`),
          axios.get("/Klasat"),
          axios.get("/account/me").catch(() => ({ data: {} })),
        ]);
        const d = nxRes.data;
        setEmri(d.emri ?? d.Emri ?? "");
        setMbiemri(d.mbiemri ?? d.Mbiemri ?? "");
        setPrindi(d.prindi ?? d.Prindi ?? "");
        setAdresa(d.adresa ?? d.Adresa ?? "");
        setGjinia(d.gjinia ?? d.Gjinia ?? "");
        const dl = d.ditelindja ?? d.Ditelindja;
        setDitelindja(dl ? new Date(dl).toISOString().slice(0, 10) : "");
        const kid = d.klasatId ?? d.KlasatId;
        setKlasatId(kid != null ? String(kid) : "");
        const allKlasat = Array.isArray(klasaRes.data) ? klasaRes.data : [];
        const me = meRes.data || {};
        const myKlasatId = me.klasatId ?? me.KlasatId;
        if (myKlasatId != null && (me.isKujdestar || me.role === "Kujdestar")) {
          setKlasat(allKlasat.filter((k) => (k.id ?? k.Id) === myKlasatId));
        } else {
          setKlasat(allKlasat);
        }
      } catch {
        setError("Nxënësi nuk u gjet ose nuk keni të drejtë.");
      } finally {
        setLoadDone(true);
      }
    };
    load();
  }, [id]);

  const handleBackClick = () => navigate("/student");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!emri.trim() || !mbiemri.trim() || !prindi.trim() || !gjinia || !klasatId) {
      setError("Plotësoni emrin, mbiemrin, prindin, gjininë dhe klasën.");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`/Nxenesit/${id}`, {
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
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        err.message ||
        "Ndryshimet nuk u ruajtën.";
      setError(err.response?.status === 403 ? "Mund të ndryshoni vetëm nxënësit e klasës tuaj." : msg);
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
          <h1>Ndrysho nxënësin</h1>
          <AddButton onClick={handleBackClick} type="button">
            Kthehu
          </AddButton>
        </div>
        <div className="h-75 mt-5 mx-5 d-flex flex-column align-items-center">
          <form onSubmit={handleSubmit} className="ms-5 mt-5 d-flex flex-column gap-4 w-100">
            <h4>Ndrysho të dhënat</h4>
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
            <SignButton type="submit" className="sign-btn border-0 rounded-3 fw-semibold mt-3" disabled={loading}>
              {loading ? "Duke ruajtur…" : "Ruaj ndryshimet"}
            </SignButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentEdit;
