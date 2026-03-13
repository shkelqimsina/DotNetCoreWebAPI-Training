import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Dropdown from "../components/Dropdown";
import SearchForm from "../components/SearchForm";
import axios from "../axiosInstance";
import { AuthContext } from "../context/AuthContext";

function Student() {
  const navigate = useNavigate();
  const [klasat, setKlasat] = useState([]);
  const [nxenesit, setNxenesit] = useState([]);
  const [selectedKlasaId, setSelectedKlasaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { role, me: meAuth } = useContext(AuthContext);
  const [me, setMe] = useState(null);
  const isKujdestar = (me?.isKujdestar === true) || role === "Kujdestar";
  const isAdministrator = (me?.isAdministrator === true) || role === "Administrator";
  const isDrejtori = (me?.isDrejtori === true) || role === "Drejtori";
  const canRegisterParent = isAdministrator || isKujdestar || isDrejtori;
  const [registerPrindFor, setRegisterPrindFor] = useState(null);
  const [prindForm, setPrindForm] = useState({ userName: "", email: "", password: "", emri: "", mbiemri: "" });
  const [prindSubmitting, setPrindSubmitting] = useState(false);
  const [prindError, setPrindError] = useState("");

  useEffect(() => {
    setError("");
    const requests = [axios.get("/Klasat"), axios.get("/Nxenesit"), axios.get("/account/me")];
    Promise.all(requests)
      .then((responses) => {
        const klasRes = responses[0];
        const nxenRes = responses[1];
        const meRes = responses[2];
        setKlasat(Array.isArray(klasRes.data) ? klasRes.data : []);
        setNxenesit(Array.isArray(nxenRes.data) ? nxenRes.data : []);
        if (meRes?.data) {
          setMe(meRes.data);
          if (meRes.data.klasatId) setSelectedKlasaId(meRes.data.klasatId);
        }
      })
      .catch(() => {
        setKlasat([]);
        setNxenesit([]);
        setError("Të dhënat nuk u ngarkuan.");
      })
      .finally(() => setLoading(false));
  }, []);

  const openRegisterPrind = (n) => {
    setRegisterPrindFor(n);
    setPrindForm({ userName: "", email: "", password: "", emri: "", mbiemri: "" });
    setPrindError("");
  };

  const handleRegisterPrindSubmit = async (e) => {
    e.preventDefault();
    if (!registerPrindFor) return;
    const id = registerPrindFor.id ?? registerPrindFor.Id;
    if (!prindForm.userName?.trim() || !prindForm.email?.trim() || !prindForm.password?.trim()) {
      setPrindError("Emri i përdoruesit, email dhe fjalëkalimi janë të detyrueshëm.");
      return;
    }
    setPrindSubmitting(true);
    setPrindError("");
    try {
      await axios.post("/account/register-parent", {
        nxenesiId: id,
        userName: prindForm.userName.trim(),
        email: prindForm.email.trim(),
        password: prindForm.password,
        emri: prindForm.emri?.trim() || null,
        mbiemri: prindForm.mbiemri?.trim() || null,
      });
      setRegisterPrindFor(null);
      setPrindForm({ userName: "", email: "", password: "", emri: "", mbiemri: "" });
      const list = await axios.get("/Nxenesit");
      setNxenesit(Array.isArray(list.data) ? list.data : []);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.join?.(" ") || err.message || "Regjistrimi dështoi.";
      setPrindError(typeof msg === "string" ? msg : "Regjistrimi dështoi.");
    } finally {
      setPrindSubmitting(false);
    }
  };

  const handleAddClick = () => navigate("/student-add");

  const handleDelete = async (id, emri, mbiemri) => {
    const emriPlote = [emri, mbiemri].filter(Boolean).join(" ").trim() || "ky nxënës";
    if (!window.confirm(`A jeni të sigurt që doni të fshini nxënësin "${emriPlote}"?`)) return;
    setError("");
    try {
      await axios.delete(`/Nxenesit/${id}`);
      setNxenesit((prev) => prev.filter((n) => (n.id ?? n.Id) !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Fshirja dështoi.");
    }
  };

  const filteredKlasat = isKujdestar && me?.klasatId
    ? klasat.filter((k) => (k.id ?? k.Id) === me.klasatId)
    : klasat;

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
            {filteredKlasat.length === 0 ? (
              <div className="mt-4 text-secondary">Nuk ka asnjë klasë. Shtoni një klasë nga faqja Klasët.</div>
            ) : (
              <ul className="list-group list-group-flush mt-2">
                {filteredKlasat.map((k) => {
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
            {canRegisterParent && (
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h6 className="mb-0">Regjistrimi i prindit</h6>
                </div>
                <div className="card-body">
                  <p className="text-secondary small mb-3">Regjistroni një prind për një nxënës: emri i përdoruesit, email dhe fjalëkalimi për kyçje.</p>
                  <form onSubmit={handleRegisterPrindSubmit} className="row g-2 g-md-3 align-items-end">
                    <input type="hidden" name="nxenesiId" value={registerPrindFor ? (registerPrindFor.id ?? registerPrindFor.Id) : ""} />
                    <div className="col-12 col-md">
                      <label className="form-label small">Nxënësi *</label>
                      <select
                        className="form-select form-select-sm"
                        value={registerPrindFor ? (registerPrindFor.id ?? registerPrindFor.Id) : ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) { setRegisterPrindFor(null); return; }
                          const n = nxenesitNeklase.find((x) => (x.id ?? x.Id) == val);
                          if (n) setRegisterPrindFor(n);
                        }}
                      >
                        <option value="">Zgjidhni nxënësin</option>
                        {nxenesitNeklase.filter((n) => !(n.prindiUserId ?? n.PrindiUserId)).map((n) => (
                          <option key={n.id ?? n.Id} value={n.id ?? n.Id}>
                            {n.emri ?? n.Emri} {n.mbiemri ?? n.Mbiemri}
                          </option>
                        ))}
                        {nxenesitNeklase.filter((n) => !(n.prindiUserId ?? n.PrindiUserId)).length === 0 && (
                          <option value="" disabled>Të gjithë nxënësit kanë prind të regjistruar</option>
                        )}
                      </select>
                    </div>
                    <div className="col-12 col-md">
                      <label className="form-label small">Emri i përdoruesit (për kyçje) *</label>
                      <input type="text" className="form-control form-control-sm" value={prindForm.userName} onChange={(e) => setPrindForm((f) => ({ ...f, userName: e.target.value }))} required placeholder="username" />
                    </div>
                    <div className="col-12 col-md">
                      <label className="form-label small">Email *</label>
                      <input type="email" className="form-control form-control-sm" value={prindForm.email} onChange={(e) => setPrindForm((f) => ({ ...f, email: e.target.value }))} required placeholder="email@shembull.com" />
                    </div>
                    <div className="col-12 col-md">
                      <label className="form-label small">Fjalëkalimi *</label>
                      <input type="password" className="form-control form-control-sm" value={prindForm.password} onChange={(e) => setPrindForm((f) => ({ ...f, password: e.target.value }))} required placeholder="••••••••" />
                    </div>
                    <div className="col-12 col-md">
                      <label className="form-label small">Emri (opsional)</label>
                      <input type="text" className="form-control form-control-sm" value={prindForm.emri} onChange={(e) => setPrindForm((f) => ({ ...f, emri: e.target.value }))} placeholder="Emri" />
                    </div>
                    <div className="col-12 col-md">
                      <label className="form-label small">Mbiemri (opsional)</label>
                      <input type="text" className="form-control form-control-sm" value={prindForm.mbiemri} onChange={(e) => setPrindForm((f) => ({ ...f, mbiemri: e.target.value }))} placeholder="Mbiemri" />
                    </div>
                    <div className="col-12 col-md-auto">
                      <button type="submit" className="btn btn-primary btn-sm" disabled={prindSubmitting || !registerPrindFor}>
                        {prindSubmitting ? "Duke regjistruar…" : "Regjistro prindin"}
                      </button>
                    </div>
                  </form>
                  {prindError && <div className="alert alert-danger py-2 mt-2 mb-0 small">{prindError}</div>}
                </div>
              </div>
            )}

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
                  const hasParent = !!(n.prindiUserId ?? n.PrindiUserId);
                  const ditelindja = n.ditelindja ?? n.Ditelindja;
                  const dateStr = ditelindja ? new Date(ditelindja).toLocaleDateString("sq-AL") : "";
                  return (
                    <li key={id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{emri} {mbiemri}{prindi && ` – Prindi: ${prindi}`}{dateStr && ` (${dateStr})`}</span>
                      <span className="d-flex gap-1">
                        {canRegisterParent && !hasParent && (
                          <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={(e) => { e.stopPropagation(); openRegisterPrind(n); }}
                            title="Regjistro prind për këtë nxënës"
                          >
                            Regjistro prind
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={(e) => { e.stopPropagation(); navigate(`/student-edit/${id}`); }}
                          title={`Ndrysho ${emri} ${mbiemri}`}
                        >
                          Ndrysho
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={(e) => { e.stopPropagation(); handleDelete(id, emri, mbiemri); }}
                          title={`Fshi ${emri} ${mbiemri}`}
                        >
                          Fshi
                        </button>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {registerPrindFor && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => !prindSubmitting && setRegisterPrindFor(null)}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Regjistro prind për {registerPrindFor.emri ?? registerPrindFor.Emri} {registerPrindFor.mbiemri ?? registerPrindFor.Mbiemri}</h5>
                  <button type="button" className="btn-close" disabled={prindSubmitting} onClick={() => setRegisterPrindFor(null)} aria-label="Mbyll" />
                </div>
                <form onSubmit={handleRegisterPrindSubmit}>
                  <div className="modal-body">
                    {prindError && <div className="alert alert-danger py-2">{prindError}</div>}
                    <div className="mb-2">
                      <label className="form-label small">Emri i përdoruesit *</label>
                      <input type="text" className="form-control" value={prindForm.userName} onChange={(e) => setPrindForm((f) => ({ ...f, userName: e.target.value }))} required placeholder="username" />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small">Email *</label>
                      <input type="email" className="form-control" value={prindForm.email} onChange={(e) => setPrindForm((f) => ({ ...f, email: e.target.value }))} required placeholder="email@shembull.com" />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small">Fjalëkalimi *</label>
                      <input type="password" className="form-control" value={prindForm.password} onChange={(e) => setPrindForm((f) => ({ ...f, password: e.target.value }))} required placeholder="••••••••" />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small">Emri (opsional)</label>
                      <input type="text" className="form-control" value={prindForm.emri} onChange={(e) => setPrindForm((f) => ({ ...f, emri: e.target.value }))} placeholder="Emri i prindit" />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small">Mbiemri (opsional)</label>
                      <input type="text" className="form-control" value={prindForm.mbiemri} onChange={(e) => setPrindForm((f) => ({ ...f, mbiemri: e.target.value }))} placeholder="Mbiemri i prindit" />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" disabled={prindSubmitting} onClick={() => setRegisterPrindFor(null)}>Anulo</button>
                    <button type="submit" className="btn btn-primary" disabled={prindSubmitting}>{prindSubmitting ? "Duke regjistruar…" : "Regjistro prindin"}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Student;
