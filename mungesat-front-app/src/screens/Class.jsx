import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Dropdown from "../components/Dropdown";
import SearchForm from "../components/SearchForm";
import axios from "../axiosInstance";
import { AuthContext } from "../context/AuthContext";

function Class() {
  const navigate = useNavigate();
  const [klasat, setKlasat] = useState([]);
  const [nxenesit, setNxenesit] = useState([]);
  const [me, setMe] = useState(null);
  const [expandedKlasaId, setExpandedKlasaId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const { role } = useContext(AuthContext);
  const isKujdestar = role === "Kujdestar";

  const handleAddClick = () => {
    navigate("/class-add");
  };

  const loadData = React.useCallback(async () => {
    setError("");
    try {
      const requests = [axios.get("/Klasat"), axios.get("/Nxenesit")];
      if (isKujdestar) {
        requests.push(axios.get("/account/me"));
      }
      const results = await Promise.all(requests);
      const klasRes = results[0];
      const nxenesitRes = results[1];
      const meRes = results[2];
      setKlasat(Array.isArray(klasRes.data) ? klasRes.data : []);
      setNxenesit(Array.isArray(nxenesitRes?.data) ? nxenesitRes.data : []);
      if (meRes?.data) setMe(meRes.data);
    } catch {
      setKlasat([]);
      setNxenesit([]);
      setMe(null);
      setError("Të dhënat nuk u ngarkuan.");
    }
  }, [isKujdestar]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNdrysho = (e, nxenesiId) => {
    e.stopPropagation();
    navigate(`/student-edit/${nxenesiId}`);
  };

  const handleFshij = async (e, n) => {
    e.stopPropagation();
    const id = n.id ?? n.Id;
    const emri = `${n.emri ?? n.Emri} ${n.mbiemri ?? n.Mbiemri}`;
    if (!window.confirm(`Dëshironi ta fshini nxënësin "${emri}"?`)) return;
    setError("");
    setDeletingId(id);
    try {
      await axios.delete(`/Nxenesit/${id}`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Fshirja dështoi.");
    } finally {
      setDeletingId(null);
    }
  };

  const klasatPerTregim =
    isKujdestar && me?.klasatId
      ? klasat.filter((k) => (k.kujdestariId ?? k.KujdestariId) === me.klasatId)
      : klasat;

  const nxenesitNgaKlasaId = (klasatId) =>
    nxenesit.filter((n) => (n.klasatId ?? n.KlasatId) === klasatId);

  const toggleKlasa = (klasaId) => {
    setExpandedKlasaId((prev) => (prev === klasaId ? null : klasaId));
  };

  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-between align-items-center">
          <h1>Klasët</h1>
          <AddButton onClick={handleAddClick} type="button">Shto Klasë</AddButton>
        </div>
        {error && (
          <div className="alert alert-warning mt-3 mb-0">{error}</div>
        )}
        <div className="mt-4 d-flex justify-content-start align-items-center">
          <Dropdown
            main="Filtro"
            option1="Klaset e 10"
            option2="Klaset e 11"
            option3="Klaset e 12"
          />
          <SearchForm />
        </div>
        <div className="h-75 mt-4">
          {klasatPerTregim.length === 0 ? (
            <div className="d-flex flex-column justify-content-center align-items-center h-100">
              <h2>Nuk ka asnjë klasë</h2>
              <p className="text-secondary mb-4">Klasët shfaqen këtu pasi t'i shtoni.</p>
              <AddButton onClick={handleAddClick} type="button">Shto klasë të parë</AddButton>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "2rem" }} />
                    <th>Klasa</th>
                    <th>Kujdestari</th>
                  </tr>
                </thead>
                <tbody>
                  {klasatPerTregim.map((klasa) => {
                    const klasaId = klasa.id ?? klasa.Id;
                    const isExpanded = expandedKlasaId === klasaId;
                    const nxenesitEKlases = nxenesitNgaKlasaId(klasaId);
                    return (
                      <React.Fragment key={klasaId}>
                        <tr
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleKlasa(klasaId)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleKlasa(klasaId);
                            }
                          }}
                          className={isExpanded ? "table-active" : ""}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="text-secondary">
                            <span
                              className="d-inline-block"
                              style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}
                            >
                              ▶
                            </span>
                          </td>
                          <td><strong>Klasa {klasa.emri ?? klasa.Emri}</strong></td>
                          <td className="text-muted">
                            {[klasa.emriKujdestari, klasa.mbiemriKujdestari].filter(Boolean).join(" ") || "—"}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={3} className="p-0 border-start border-end border-bottom">
                              <div className="p-3 ps-5 bg-light">
                                <div className="small text-secondary mb-2">Nxënësit e klasës {klasa.emri ?? klasa.Emri}</div>
                                {nxenesitEKlases.length === 0 ? (
                                  <p className="text-muted mb-0 small">Nuk ka nxënës të regjistruar në këtë klasë.</p>
                                ) : (
                                  <table className="table table-sm table-borderless mb-0">
                                    <thead>
                                      <tr className="border-bottom">
                                        <th className="text-secondary fw-normal">Emri</th>
                                        <th className="text-secondary fw-normal">Mbiemri</th>
                                        <th className="text-secondary fw-normal">Emri i prindit</th>
                                        <th className="text-secondary fw-normal text-end">Veprime</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {nxenesitEKlases.map((n) => {
                                        const nid = n.id ?? n.Id;
                                        const isDeleting = deletingId === nid;
                                        return (
                                          <tr key={nid}>
                                            <td>{n.emri ?? n.Emri}</td>
                                            <td>{n.mbiemri ?? n.Mbiemri}</td>
                                            <td>{n.prindi ?? n.Prindi ?? "—"}</td>
                                            <td className="text-end">
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary me-1"
                                                onClick={(e) => handleNdrysho(e, nid)}
                                              >
                                                Ndrysho
                                              </button>
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={(e) => handleFshij(e, n)}
                                                disabled={isDeleting}
                                              >
                                                {isDeleting ? "Duke fshirë…" : "Fshij"}
                                              </button>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Class;
