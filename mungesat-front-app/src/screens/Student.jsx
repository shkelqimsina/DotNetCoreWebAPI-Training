import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Dropdown from "../components/Dropdown";
import SearchForm from "../components/SearchForm";
import axios from "../axiosInstance";

function Student() {
  const navigate = useNavigate();
  const [klasat, setKlasat] = useState([]);
  const [nxenesit, setNxenesit] = useState([]);
  const [selectedKlasaId, setSelectedKlasaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    Promise.all([axios.get("/Klasat"), axios.get("/Nxenesit")])
      .then(([klasRes, nxenRes]) => {
        setKlasat(Array.isArray(klasRes.data) ? klasRes.data : []);
        setNxenesit(Array.isArray(nxenRes.data) ? nxenRes.data : []);
      })
      .catch(() => {
        setKlasat([]);
        setNxenesit([]);
        setError("Të dhënat nuk u ngarkuan.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddClick = () => navigate("/student-add");

  const nxenesitNeklase = selectedKlasaId
    ? nxenesit.filter((n) => (n.klasatId ?? n.KlasatId) === selectedKlasaId)
    : [];
  const selectedKlasa = klasat.find((k) => (k.id ?? k.Id) === selectedKlasaId);
  const emriKlase = selectedKlasa ? (selectedKlasa.emri ?? selectedKlasa.Emri) : "";

  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-between align-items-center">
          <h1>Nxënësit</h1>
          {selectedKlasaId ? (
            <AddButton onClick={() => setSelectedKlasaId(null)} type="button">
              Kthehu te klasat
            </AddButton>
          ) : (
            <AddButton onClick={handleAddClick} type="button">Shto Nxënës</AddButton>
          )}
        </div>
        <div className="mt-4 d-flex justify-content-start align-items-center">
          <Dropdown main="Filtro" option1="Emri" option2="Mbiemri" option3="Email" />
          <SearchForm />
        </div>
        {error && (
          <div className="alert alert-warning mt-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
            <span>{error}</span>
            <Link to="/" className="btn btn-primary btn-sm">Shko te faqja e kyçjes</Link>
          </div>
        )}
        {loading && <div className="mt-4 text-secondary">Duke ngarkuar…</div>}

        {!loading && !selectedKlasaId && (
          <>
            <p className="text-secondary mt-3 mb-2">Zgjidhni një klasë për të parë nxënësit e saj:</p>
            {klasat.length === 0 ? (
              <div className="mt-4 text-secondary">Nuk ka asnjë klasë. Shtoni një klasë nga faqja Klasët.</div>
            ) : (
              <ul className="list-group list-group-flush mt-2">
                {klasat.map((k) => {
                  const kid = k.id ?? k.Id;
                  const emri = k.emri ?? k.Emri ?? "";
                  const kujdestar = [k.emriKujdestari ?? k.EmriKujdestari, k.mbiemriKujdestari ?? k.MbiemriKujdestari].filter(Boolean).join(" ");
                  const count = nxenesit.filter((n) => (n.klasatId ?? n.KlasatId) === kid).length;
                  return (
                    <li
                      key={kid}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedKlasaId(kid)}
                    >
                      <span><strong>Klasa {emri}</strong>{kujdestar && <span className="text-muted ms-2">– Kujdestari: {kujdestar}</span>}</span>
                      <span className="badge bg-secondary rounded-pill">{count} nxënës</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}

        {!loading && selectedKlasaId && (
          <div className="mt-4">
            <h5 className="mb-3">Klasa {emriKlase} – Nxënësit</h5>
            {nxenesitNeklase.length === 0 ? (
              <p className="text-secondary">Nuk ka nxënës në këtë klasë.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {nxenesitNeklase.map((n) => {
                  const id = n.id ?? n.Id;
                  const emri = n.emri ?? n.Emri ?? "";
                  const mbiemri = n.mbiemri ?? n.Mbiemri ?? "";
                  const prindi = n.prindi ?? n.Prindi ?? "";
                  const ditelindja = n.ditelindja ?? n.Ditelindja;
                  const dateStr = ditelindja ? new Date(ditelindja).toLocaleDateString("sq-AL") : "";
                  return (
                    <li key={id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{emri} {mbiemri}{prindi && ` – Prindi: ${prindi}`}{dateStr && ` (${dateStr})`}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Student;
