import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddButton from "../components/Button";
import Dropdown from "../components/Dropdown";
import SearchForm from "../components/SearchForm";
import axios from "../axiosInstance";
import { AuthContext } from "../context/AuthContext";

function Missings() {
  const navigate = useNavigate();
  const { token, role, isPrindi: isPrindiFromAuth, isDrejtori: isDrejtoriFromAuth, isAdministrator: isAdministratorFromAuth, isKujdestar: isKujdestarFromAuth } = useContext(AuthContext);
  const [me, setMe] = useState(null);
  const [mungesat, setMungesat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isPrindi = (me?.isPrindi === true) || (role === "Prindi") || isPrindiFromAuth;
  const isDrejtori = (me?.isDrejtori === true) || (role === "Drejtori") || isDrejtoriFromAuth;
  const isAdministrator = (me?.isAdministrator === true) || (role === "Administrator") || isAdministratorFromAuth;
  const isKujdestar = (me?.isKujdestar === true) || (role === "Kujdestar") || isKujdestarFromAuth;
  const useSummaryView = isDrejtori || isAdministrator || isKujdestar;

  const loadMungesat = useCallback(() => {
    setError("");
    axios
      .get("/Mungesat")
      .then((res) => setMungesat(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        setMungesat([]);
        const status = err.response?.status;
        let msg = "Lista e mungesave nuk u ngarkua.";
        if (status === 401) {
          msg = "Seanca skadoi ose nuk jeni i kyçur. Dilni dhe kyçuni përsëri.";
        } else if (status === 403) {
          msg = "Nuk keni të drejtë të shihni këtë listë.";
        } else if (status === 404) {
          msg = "Adresa e API-së nuk u gjet. Sigurohuni që backend-i (Mungesat_shkolla) është duke xhiruar.";
        } else if (status >= 500) {
          msg = "Gabim në server. Kontrolloni që baza e të dhënave është e hapur dhe migrimet janë ekzekutuar (dotnet ef database update).";
        } else if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
          msg = "Lidhja me serverin dështoi. Sigurohuni që backend-i xhiron (dotnet run nga Mungesat_shkolla).";
        }
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadMungesat();
  }, [loadMungesat]);

  useEffect(() => {
    if (token) {
      axios.get("/account/me").then((r) => setMe(r.data)).catch(() => setMe(null));
    } else {
      setMe(null);
    }
  }, [token]);

  const [expandedKlasa, setExpandedKlasa] = useState(null);
  const [editingMungesa, setEditingMungesa] = useState(null);
  const [editForm, setEditForm] = useState({ data: "", arsyeja: "", oretZgjidhura: [], oretMeArsyje: [] });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [togglingMeArsyjeId, setTogglingMeArsyjeId] = useState(null);
  const [arsyetoMungesa, setArsyetoMungesa] = useState(null);
  const [arsyetoForm, setArsyetoForm] = useState({ teksti: "" });
  const [arsyetoFile, setArsyetoFile] = useState(null);
  const [arsyetoSaving, setArsyetoSaving] = useState(false);
  const [arsyetoError, setArsyetoError] = useState("");
  const [selectedNxenesi, setSelectedNxenesi] = useState(null);
  const [selectedKlasaForDrejtori, setSelectedKlasaForDrejtori] = useState(null);

  const nxenesitMeMungesa = useMemo(() => {
    const ngaNxenesi = {};
    mungesat.forEach((m) => {
      const nxenesiId = m.nxenesiId ?? m.NxenesiId;
      if (nxenesiId == null) return;
      const oretRaw = m.oret ?? m.Oret ?? "";
      const oretList = oretRaw ? oretRaw.split(",").map((o) => o.trim()).filter(Boolean) : [];
      const oretMeArsyjeRaw = m.oretMeArsyje ?? m.OretMeArsyje ?? "";
      const oretMeArsyjeSet = new Set(
        oretMeArsyjeRaw ? oretMeArsyjeRaw.split(",").map((o) => o.trim()).filter(Boolean) : []
      );
      const meArsyjeFalem = !!(m.meArsyje ?? m.MeArsyje);
      const numriOreve = oretList.length;
      if (!ngaNxenesi[nxenesiId]) {
        ngaNxenesi[nxenesiId] = {
          nxenesiId,
          emri: m.emriNxenesit ?? m.EmriNxenesit ?? "",
          mbiemri: m.mbiemriNxenesit ?? m.MbiemriNxenesit ?? "",
          emriKlases: m.emriKlases ?? m.EmriKlases ?? "",
          shuma: 0,
          shumaArsyeshme: 0,
          shumaPaarsyeshme: 0,
          mungesat: [],
        };
      }
      let arsyeshme = 0;
      let paarsyeshme = 0;
      if (oretMeArsyjeSet.size > 0) {
        oretList.forEach((ore) => {
          if (oretMeArsyjeSet.has(ore)) arsyeshme += 1;
          else paarsyeshme += 1;
        });
      } else {
        if (meArsyjeFalem) arsyeshme = numriOreve;
        else paarsyeshme = numriOreve;
      }
      ngaNxenesi[nxenesiId].shuma += numriOreve;
      ngaNxenesi[nxenesiId].shumaArsyeshme = (ngaNxenesi[nxenesiId].shumaArsyeshme ?? 0) + arsyeshme;
      ngaNxenesi[nxenesiId].shumaPaarsyeshme = (ngaNxenesi[nxenesiId].shumaPaarsyeshme ?? 0) + paarsyeshme;
      const dataObj = m.data || m.Data ? new Date(m.data || m.Data) : null;
      ngaNxenesi[nxenesiId].mungesat.push({
        ...m,
        dateStr: dataObj ? dataObj.toLocaleDateString("sq-AL") : "",
        date: dataObj,
        numriOreve,
        oretList,
        oretMeArsyjeSet,
        meArsyjeFalem,
        meArsyje: oretMeArsyjeSet.size > 0 ? undefined : meArsyjeFalem,
        oretDisplay:
          oretList.length === 7
            ? "Tëre ditën"
            : oretList.length
              ? "Ora " + oretList.join(", ")
              : "",
      });
    });
    return Object.values(ngaNxenesi).map((n) => ({
      ...n,
      shumaArsyeshme: n.shumaArsyeshme ?? 0,
      shumaPaarsyeshme: n.shumaPaarsyeshme ?? 0,
    })).sort((a, b) =>
      `${a.emri} ${a.mbiemri}`.localeCompare(`${b.emri} ${b.mbiemri}`)
    );
  }, [mungesat]);

  const klasatMeNxenes = useMemo(() => {
    const ngaKlasa = {};
    nxenesitMeMungesa.forEach((n) => {
      const emriKlases = n.emriKlases || "(Pa klasë)";
      if (!ngaKlasa[emriKlases]) {
        ngaKlasa[emriKlases] = { emriKlases, nxenesit: [] };
      }
      ngaKlasa[emriKlases].nxenesit.push(n);
    });
    return Object.values(ngaKlasa)
      .map((k) => ({
        ...k,
        nxenesit: k.nxenesit.sort((a, b) =>
          `${a.emri} ${a.mbiemri}`.localeCompare(`${b.emri} ${b.mbiemri}`)
        ),
        shumaKlase: k.nxenesit.reduce((s, nx) => s + (nx.shuma ?? 0), 0),
      }))
      .sort((a, b) => a.emriKlases.localeCompare(b.emriKlases));
  }, [nxenesitMeMungesa]);

  useEffect(() => {
    if (!isPrindi || loading || klasatMeNxenes.length === 0) return;
    const first = klasatMeNxenes[0];
    setExpandedKlasa(first.emriKlases);
    if (first.nxenesit?.length === 1) {
      setSelectedNxenesi({ nxenesi: first.nxenesit[0], emriKlases: first.emriKlases });
    }
  }, [isPrindi, loading, klasatMeNxenes]);

  useEffect(() => {
    if (!selectedNxenesi || klasatMeNxenes.length === 0) return;
    const nid = selectedNxenesi.nxenesi.nxenesiId;
    for (const k of klasatMeNxenes) {
      const found = k.nxenesit.find((n) => n.nxenesiId === nid);
      if (found) {
        setSelectedNxenesi((prev) => (prev && prev.nxenesi.nxenesiId === nid ? { nxenesi: found, emriKlases: k.emriKlases } : prev));
        break;
      }
    }
  }, [klasatMeNxenes]);

  const totaliShkolles = useMemo(() => {
    const shuma = klasatMeNxenes.reduce((s, k) => s + k.shumaKlase, 0);
    const arsyeshme = klasatMeNxenes.reduce(
      (s, k) => s + k.nxenesit.reduce((s2, n) => s2 + (n.shumaArsyeshme ?? 0), 0),
      0
    );
    const paarsyeshme = klasatMeNxenes.reduce(
      (s, k) => s + k.nxenesit.reduce((s2, n) => s2 + (n.shumaPaarsyeshme ?? 0), 0),
      0
    );
    return { shuma, arsyeshme, paarsyeshme };
  }, [klasatMeNxenes]);

  // Përmbledhje për Drejtorin: sipas klase, muaji (perioda e parë: shtator–dhjetor, perioda e dytë: janar–qershor), arsyeje/pa arsyeje dhe totali
  const drejtoriTable = useMemo(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const startYear = month >= 9 ? year : year - 1;
    const endYear = startYear + 1;
    const p1Months = [9, 10, 11, 12];
    const p2Months = [1, 2, 3, 4, 5, 6];
    const emptyMonth = () => ({ count: 0, arsyeshme: 0, paarsyeshme: 0 });
    const byClass = {};
    const add = (emriKlases, mo, count, arsyeshme, paarsyeshme) => {
      if (!byClass[emriKlases]) {
        byClass[emriKlases] = { kujdestari: "" };
        [1, 2, 3, 4, 5, 6, 9, 10, 11, 12].forEach((m) => { byClass[emriKlases][m] = emptyMonth(); });
      }
      const cur = byClass[emriKlases][mo];
      cur.count += count;
      cur.arsyeshme += arsyeshme;
      cur.paarsyeshme += paarsyeshme;
    };
    nxenesitMeMungesa.forEach((n) => {
      const emriKlases = n.emriKlases || "(Pa klasë)";
      (n.mungesat || []).forEach((m) => {
        if (!byClass[emriKlases]?.kujdestari && (m.emriKujdestari || m.mbiemriKujdestari || m.EmriKujdestari || m.MbiemriKujdestari)) {
          const emri = m.emriKujdestari ?? m.EmriKujdestari ?? "";
          const mbiemri = m.mbiemriKujdestari ?? m.MbiemriKujdestari ?? "";
          if (!byClass[emriKlases]) {
            byClass[emriKlases] = { kujdestari: "" };
            [1, 2, 3, 4, 5, 6, 9, 10, 11, 12].forEach((mo) => { byClass[emriKlases][mo] = emptyMonth(); });
          }
          byClass[emriKlases].kujdestari = [emri, mbiemri].filter(Boolean).join(" ").trim();
        }
        const d = m.date;
        if (!d) return;
        const mo = d.getMonth() + 1;
        const y = d.getFullYear();
        const numriOreve = m.numriOreve ?? 0;
        const oretMeArsyjeSet = m.oretMeArsyjeSet || new Set();
        const meArsyjeFalem = m.meArsyjeFalem ?? m.meArsyje ?? m.MeArsyje;
        let arsyeshme = 0;
        let paarsyeshme = 0;
        if (oretMeArsyjeSet.size > 0 && m.oretList) {
          m.oretList.forEach((ore) => {
            if (oretMeArsyjeSet.has(ore)) arsyeshme += 1;
            else paarsyeshme += 1;
          });
        } else {
          if (meArsyjeFalem) arsyeshme = numriOreve;
          else paarsyeshme = numriOreve;
        }
        if (y === startYear && mo >= 9) add(emriKlases, mo, numriOreve, arsyeshme, paarsyeshme);
        else if (y === endYear && mo <= 6) add(emriKlases, mo, numriOreve, arsyeshme, paarsyeshme);
      });
    });
    const sumPeriod = (months, monthList) => {
      let c = 0; let a = 0; let p = 0;
      monthList.forEach((mo) => {
        const x = months[mo] ?? emptyMonth();
        c += x.count; a += x.arsyeshme; p += x.paarsyeshme;
      });
      return { count: c, arsyeshme: a, paarsyeshme: p };
    };
    const rows = Object.entries(byClass)
      .map(([emriKlases, data]) => {
        const months = data;
        const per1 = sumPeriod(months, p1Months);
        const per2 = sumPeriod(months, p2Months);
        const total = { count: per1.count + per2.count, arsyeshme: per1.arsyeshme + per2.arsyeshme, paarsyeshme: per1.paarsyeshme + per2.paarsyeshme };
        const kujdestari = data.kujdestari ?? "";
        return { emriKlases, kujdestari, months, perioda1: per1, perioda2: per2, total };
      })
      .sort((a, b) => a.emriKlases.localeCompare(b.emriKlases));
    const totals = { months: {}, perioda1: emptyMonth(), perioda2: emptyMonth(), total: emptyMonth() };
    [1, 2, 3, 4, 5, 6, 9, 10, 11, 12].forEach((mo) => { totals.months[mo] = emptyMonth(); });
    rows.forEach((r) => {
      p1Months.forEach((mo) => {
        const x = r.months[mo] ?? emptyMonth();
        totals.months[mo].count += x.count; totals.months[mo].arsyeshme += x.arsyeshme; totals.months[mo].paarsyeshme += x.paarsyeshme;
      });
      p2Months.forEach((mo) => {
        const x = r.months[mo] ?? emptyMonth();
        totals.months[mo].count += x.count; totals.months[mo].arsyeshme += x.arsyeshme; totals.months[mo].paarsyeshme += x.paarsyeshme;
      });
      totals.perioda1.count += r.perioda1.count; totals.perioda1.arsyeshme += r.perioda1.arsyeshme; totals.perioda1.paarsyeshme += r.perioda1.paarsyeshme;
      totals.perioda2.count += r.perioda2.count; totals.perioda2.arsyeshme += r.perioda2.arsyeshme; totals.perioda2.paarsyeshme += r.perioda2.paarsyeshme;
      totals.total.count += r.total.count; totals.total.arsyeshme += r.total.arsyeshme; totals.total.paarsyeshme += r.total.paarsyeshme;
    });
    return { startYear, endYear, p1Months, p2Months, rows, totals };
  }, [nxenesitMeMungesa]);

  // Tabela e nxënësve për Drejtorin (i njëjti format si përmbledhja, por rresht = nxënës) kur është zgjedhur një klasë
  const drejtoriNxenesitTable = useMemo(() => {
    if (!selectedKlasaForDrejtori) return null;
    const klasa = klasatMeNxenes.find((k) => k.emriKlases === selectedKlasaForDrejtori);
    if (!klasa?.nxenesit?.length) return { startYear: drejtoriTable.startYear, endYear: drejtoriTable.endYear, p1Months: drejtoriTable.p1Months, p2Months: drejtoriTable.p2Months, rows: [], totals: null };
    const { startYear, endYear, p1Months, p2Months } = drejtoriTable;
    const emptyMonth = () => ({ count: 0, arsyeshme: 0, paarsyeshme: 0 });
    const sumPeriod = (months, monthList) => {
      let a = 0, p = 0;
      monthList.forEach((mo) => {
        const x = months[mo] ?? emptyMonth();
        a += x.arsyeshme;
        p += x.paarsyeshme;
      });
      return { count: 0, arsyeshme: a, paarsyeshme: p };
    };
    const rows = klasa.nxenesit.map((n) => {
      const months = {};
      [1, 2, 3, 4, 5, 6, 9, 10, 11, 12].forEach((mo) => { months[mo] = emptyMonth(); });
      (n.mungesat || []).forEach((m) => {
        const d = m.date;
        if (!d) return;
        const mo = d.getMonth() + 1;
        const y = d.getFullYear();
        const numriOreve = m.numriOreve ?? 0;
        const oretMeArsyjeSet = m.oretMeArsyjeSet || new Set();
        const meArsyjeFalem = m.meArsyjeFalem ?? m.meArsyje ?? m.MeArsyje;
        let arsyeshme = 0, paarsyeshme = 0;
        if (oretMeArsyjeSet.size > 0 && m.oretList) {
          m.oretList.forEach((ore) => {
            if (oretMeArsyjeSet.has(ore)) arsyeshme += 1;
            else paarsyeshme += 1;
          });
        } else {
          if (meArsyjeFalem) arsyeshme = numriOreve;
          else paarsyeshme = numriOreve;
        }
        if (y === startYear && mo >= 9) {
          months[mo].count += numriOreve;
          months[mo].arsyeshme += arsyeshme;
          months[mo].paarsyeshme += paarsyeshme;
        } else if (y === endYear && mo <= 6) {
          months[mo].count += numriOreve;
          months[mo].arsyeshme += arsyeshme;
          months[mo].paarsyeshme += paarsyeshme;
        }
      });
      const perioda1 = sumPeriod(months, p1Months);
      const perioda2 = sumPeriod(months, p2Months);
      const total = { count: 0, arsyeshme: perioda1.arsyeshme + perioda2.arsyeshme, paarsyeshme: perioda1.paarsyeshme + perioda2.paarsyeshme };
      return { nxenesi: n, months, perioda1, perioda2, total };
    });
    const totals = { months: {}, perioda1: emptyMonth(), perioda2: emptyMonth(), total: emptyMonth() };
    [1, 2, 3, 4, 5, 6, 9, 10, 11, 12].forEach((mo) => { totals.months[mo] = emptyMonth(); });
    rows.forEach((r) => {
      p1Months.forEach((mo) => {
        const x = r.months[mo] ?? emptyMonth();
        totals.months[mo].arsyeshme += x.arsyeshme;
        totals.months[mo].paarsyeshme += x.paarsyeshme;
      });
      p2Months.forEach((mo) => {
        const x = r.months[mo] ?? emptyMonth();
        totals.months[mo].arsyeshme += x.arsyeshme;
        totals.months[mo].paarsyeshme += x.paarsyeshme;
      });
      totals.perioda1.arsyeshme += r.perioda1.arsyeshme;
      totals.perioda1.paarsyeshme += r.perioda1.paarsyeshme;
      totals.perioda2.arsyeshme += r.perioda2.arsyeshme;
      totals.perioda2.paarsyeshme += r.perioda2.paarsyeshme;
      totals.total.arsyeshme += r.total.arsyeshme;
      totals.total.paarsyeshme += r.total.paarsyeshme;
    });
    return { startYear, endYear, p1Months, p2Months, rows, totals };
  }, [selectedKlasaForDrejtori, klasatMeNxenes, drejtoriTable.startYear, drejtoriTable.endYear, drejtoriTable.p1Months, drejtoriTable.p2Months]);

  const isEmpty = !loading && mungesat.length === 0;

  const toggleExpandKlasa = (emriKlases) => {
    setExpandedKlasa((prev) => (prev === emriKlases ? null : emriKlases));
  };

  const openEdit = (m) => {
    const raw = m.oret ?? m.Oret ?? "";
    const oretList = raw ? raw.split(",").map((o) => parseInt(o.trim(), 10)).filter((n) => !Number.isNaN(n)) : [];
    const oretMeArsyjeRaw = m.oretMeArsyje ?? m.OretMeArsyje ?? "";
    let oretMeArsyjeList = oretMeArsyjeRaw
      ? oretMeArsyjeRaw.split(",").map((o) => parseInt(o.trim(), 10)).filter((n) => !Number.isNaN(n))
      : [];
    if (oretMeArsyjeList.length === 0 && (m.meArsyje ?? m.MeArsyje)) {
      oretMeArsyjeList = [...oretList];
    }
    oretMeArsyjeList = oretMeArsyjeList.filter((ore) => oretList.includes(ore));
    const dataVal = m.data ?? m.date ?? m.Data;
    const dateStr = dataVal
      ? new Date(dataVal).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);
    setEditingMungesa(m);
    setEditForm({
      data: dateStr,
      arsyeja: m.arsyeja ?? m.Arsyeja ?? "",
      oretZgjidhura: oretList.length > 0 ? oretList : [],
      oretMeArsyje: oretMeArsyjeList,
    });
    setEditError("");
  };

  const closeEdit = () => {
    setEditingMungesa(null);
    setEditError("");
  };

  const openArsyeto = (m, e) => {
    if (e) e.stopPropagation();
    setArsyetoMungesa(m);
    setArsyetoForm({ teksti: (m.arsyetimPrindi ?? m.ArsyetimPrindi ?? "").trim() });
    setArsyetoFile(null);
    setArsyetoError("");
  };

  const closeArsyeto = () => {
    setArsyetoMungesa(null);
    setArsyetoError("");
  };

  const handleArsyetoSubmit = async (e) => {
    e.preventDefault();
    if (!arsyetoMungesa) return;
    const id = arsyetoMungesa.id ?? arsyetoMungesa.Id;
    if (!id) return;
    setArsyetoSaving(true);
    setArsyetoError("");
    try {
      const formData = new FormData();
      formData.append("arsyetim", arsyetoForm.teksti.trim());
      if (arsyetoFile) formData.append("file", arsyetoFile);
      await axios.post(`/Mungesat/${id}/arsyeto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      loadMungesat();
      closeArsyeto();
    } catch (err) {
      const res = err.response;
      setArsyetoError(res?.data?.message || err.message || "Arsyetimi nuk u ruajt.");
    } finally {
      setArsyetoSaving(false);
    }
  };

  const toggleEditOre = (ore) => {
    setEditForm((prev) => ({
      ...prev,
      oretZgjidhura: prev.oretZgjidhura.includes(ore)
        ? prev.oretZgjidhura.filter((o) => o !== ore)
        : [...prev.oretZgjidhura, ore].sort((a, b) => a - b),
    }));
  };

  const toggleEditTereDiten = () => {
    setEditForm((prev) => ({
      ...prev,
      oretZgjidhura: prev.oretZgjidhura.length === 7 ? [] : [1, 2, 3, 4, 5, 6, 7],
      oretMeArsyje: prev.oretZgjidhura.length === 7 ? [] : prev.oretMeArsyje,
    }));
  };

  const toggleOreMeArsyje = (ore) => {
    setEditForm((prev) =>
      prev.oretMeArsyje.includes(ore)
        ? { ...prev, oretMeArsyje: prev.oretMeArsyje.filter((o) => o !== ore) }
        : { ...prev, oretMeArsyje: [...prev.oretMeArsyje, ore].sort((a, b) => a - b) }
    );
  };

  const toggleMeArsyje = async (m, e) => {
    e.stopPropagation();
    const id = m.id ?? m.Id;
    if (!id) return;
    const oretRaw = m.oret ?? m.Oret ?? "";
    const oretList = oretRaw ? oretRaw.split(",").map((o) => o.trim()).filter(Boolean) : [];
    const oretMeArsyjeSet = m.oretMeArsyjeSet || new Set();
    const meArsyjeFalem = m.meArsyjeFalem ?? m.meArsyje ?? m.MeArsyje;
    const allJustified =
      oretList.length > 0 &&
      (oretMeArsyjeSet.size > 0
        ? oretList.every((ore) => oretMeArsyjeSet.has(ore))
        : !!meArsyjeFalem);
    const newOretMeArsyje = allJustified ? "" : oretRaw;
    setTogglingMeArsyjeId(id);
    try {
      const dataVal = m.data ?? m.date ?? m.Data;
      const dateStr = dataVal
        ? new Date(dataVal).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);
      await axios.put(`/Mungesat/${id}`, {
        data: dateStr,
        arsyeja: (m.arsyeja ?? m.Arsyeja ?? "").trim() || null,
        oret: oretRaw,
        meArsyje: !allJustified,
        oretMeArsyje: newOretMeArsyje || null,
      });
      loadMungesat();
    } finally {
      setTogglingMeArsyjeId(null);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingMungesa) return;
    if (editForm.oretZgjidhura.length === 0) {
      setEditError("Zgjidhni të paktën një orë mungese.");
      return;
    }
    setEditError("");
    setEditSaving(true);
    const id = editingMungesa.id ?? editingMungesa.Id;
    try {
      const oretMeArsyjeStr = editForm.oretMeArsyje.length > 0 ? editForm.oretMeArsyje.join(",") : null;
      await axios.put(`/Mungesat/${id}`, {
        data: editForm.data || new Date().toISOString().slice(0, 10),
        arsyeja: editForm.arsyeja.trim() || null,
        oret: editForm.oretZgjidhura.join(","),
        meArsyje: editForm.oretMeArsyje.length === editForm.oretZgjidhura.length && editForm.oretZgjidhura.length > 0,
        oretMeArsyje: oretMeArsyjeStr,
      });
      closeEdit();
      loadMungesat();
    } catch (err) {
      setEditError(
        err.response?.data?.message ||
          (typeof err.response?.data === "string" ? err.response.data : null) ||
          "Ndryshimi i mungesës dështoi."
      );
    } finally {
      setEditSaving(false);
    }
  };

  const muajtShqip = [
    "Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor",
    "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor",
  ];

  const groupByMonth = (mungesatList) => {
    const byMonth = {};
    mungesatList.forEach((m) => {
      if (!m.date) return;
      const key = `${m.date.getFullYear()}-${String(m.date.getMonth() + 1).padStart(2, "0")}`;
      if (!byMonth[key]) byMonth[key] = { count: 0, arsyeshme: 0, paarsyeshme: 0 };
      const numriOreve = m.numriOreve ?? 0;
      byMonth[key].count += numriOreve;
      const oretMeArsyjeSet = m.oretMeArsyjeSet || new Set();
      const meArsyjeFalem = m.meArsyjeFalem ?? m.meArsyje ?? m.MeArsyje;
      if (oretMeArsyjeSet.size > 0 && m.oretList) {
        m.oretList.forEach((ore) => {
          if (oretMeArsyjeSet.has(ore)) byMonth[key].arsyeshme += 1;
          else byMonth[key].paarsyeshme += 1;
        });
      } else {
        if (meArsyjeFalem) byMonth[key].arsyeshme += numriOreve;
        else byMonth[key].paarsyeshme += numriOreve;
      }
    });
    return Object.entries(byMonth)
      .map(([key, { count, arsyeshme, paarsyeshme }]) => {
        const [y, mo] = key.split("-").map(Number);
        return { key, year: y, month: mo, count, arsyeshme, paarsyeshme, label: `${muajtShqip[mo - 1]} ${y}` };
      })
      .sort((a, b) => a.key.localeCompare(b.key));
  };

  return (
    <div className="teacher h-100 w-100 d-flex">
      <Sidebar />
      <div className="w-100 p-5">
        <div className="w-100 d-flex justify-content-between">
          <h1>{isPrindi ? "Mungesat e fëmijës" : "Mungesat"}</h1>
          {!isPrindi && !isDrejtori && (
            <AddButton onClick={() => navigate("/missings-add")} type="button">
              Shto Mungesë
            </AddButton>
          )}
        </div>
        {!useSummaryView && (
          <div className="mt-4 d-flex justify-content-start align-items-center">
            <Dropdown
              main="Filtro"
              option1="Emri"
              option2="Mbiemri"
              option3="Email"
            />
            <SearchForm />
          </div>
        )}
        {error && (
          <div className="alert alert-warning mt-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
            <span>{error}</span>
            <Link to="/" className="btn btn-primary btn-sm">
              Shko te faqja e kyçjes
            </Link>
          </div>
        )}
        {loading && <div className="mt-4 text-secondary">Duke ngarkuar…</div>}

        {!loading && !isEmpty && useSummaryView && selectedKlasaForDrejtori && !selectedNxenesi && drejtoriNxenesitTable && (
          <div className="mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary mb-3"
              onClick={() => setSelectedKlasaForDrejtori(null)}
            >
              ← Kthehu te përmbledhja
            </button>
            <p className="text-secondary mb-3">
              <strong>Klasa {selectedKlasaForDrejtori}</strong>
              {drejtoriTable.rows.find((r) => r.emriKlases === selectedKlasaForDrejtori)?.kujdestari
                ? ` (${drejtoriTable.rows.find((r) => r.emriKlases === selectedKlasaForDrejtori).kujdestari})`
                : ""}
              {" · "}Nxënësit dhe mungesat e tyre. Vit shkollor {drejtoriNxenesitTable.startYear}–{drejtoriNxenesitTable.endYear}.
              {(isKujdestar || isAdministrator) && " Klikoni një nxënës për të shënuar mungesat si të arsyeshme/pa arsye dhe për të parë njoftimet nga prindërit."}
            </p>
            {drejtoriNxenesitTable.rows.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th rowSpan={2} className="align-middle">Nxënësi</th>
                      <th colSpan={4} className="text-center border-start">Perioda e parë (shtator–dhjetor)</th>
                      <th rowSpan={2} className="text-end align-middle">Perioda e parë</th>
                      <th colSpan={6} className="text-center border-start">Perioda e dytë (janar–qershor)</th>
                      <th rowSpan={2} className="text-end align-middle">Perioda e dytë</th>
                      <th rowSpan={2} className="text-end align-middle fw-bold">Total</th>
                    </tr>
                    <tr>
                      <th className="text-end">Shtator</th>
                      <th className="text-end">Tetor</th>
                      <th className="text-end">Nënor</th>
                      <th className="text-end border-end">Dhjetor</th>
                      <th className="text-end">Janar</th>
                      <th className="text-end">Shkurt</th>
                      <th className="text-end">Mars</th>
                      <th className="text-end">Prill</th>
                      <th className="text-end">Maj</th>
                      <th className="text-end border-end">Qershor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drejtoriNxenesitTable.rows.map((r) => (
                      <tr
                        key={r.nxenesi.nxenesiId}
                        {...((isKujdestar || isAdministrator) && {
                          role: "button",
                          tabIndex: 0,
                          onClick: () => setSelectedNxenesi({ nxenesi: r.nxenesi, emriKlases: selectedKlasaForDrejtori }),
                          onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedNxenesi({ nxenesi: r.nxenesi, emriKlases: selectedKlasaForDrejtori }); } },
                          style: { cursor: "pointer" },
                        })}
                      >
                        <td><strong>{r.nxenesi.emri} {r.nxenesi.mbiemri}</strong></td>
                        {drejtoriNxenesitTable.p1Months.map((mo) => {
                          const x = r.months[mo] ?? {};
                          return (
                            <td key={mo} className="text-end">
                              <span className="text-success">{x.arsyeshme ?? 0}</span>
                              <span className="text-muted"> / </span>
                              <span className="text-danger">{x.paarsyeshme ?? 0}</span>
                            </td>
                          );
                        })}
                        <td className="text-end fw-semibold border-start">
                          <span className="text-success">{r.perioda1?.arsyeshme ?? 0}</span>
                          <span className="text-muted"> / </span>
                          <span className="text-danger">{r.perioda1?.paarsyeshme ?? 0}</span>
                        </td>
                        {drejtoriNxenesitTable.p2Months.map((mo) => {
                          const x = r.months[mo] ?? {};
                          return (
                            <td key={mo} className="text-end">
                              <span className="text-success">{x.arsyeshme ?? 0}</span>
                              <span className="text-muted"> / </span>
                              <span className="text-danger">{x.paarsyeshme ?? 0}</span>
                            </td>
                          );
                        })}
                        <td className="text-end fw-semibold border-start">
                          <span className="text-success">{r.perioda2?.arsyeshme ?? 0}</span>
                          <span className="text-muted"> / </span>
                          <span className="text-danger">{r.perioda2?.paarsyeshme ?? 0}</span>
                        </td>
                        <td className="text-end fw-bold">
                          <span className="text-success">{r.total?.arsyeshme ?? 0}</span>
                          <span className="text-muted"> / </span>
                          <span className="text-danger">{r.total?.paarsyeshme ?? 0}</span>
                        </td>
                      </tr>
                    ))}
                    {drejtoriNxenesitTable.totals && (
                      <tr className="table-dark fw-bold">
                        <td className="py-3 ps-4">Totali i klasës</td>
                        {drejtoriNxenesitTable.p1Months.map((mo) => {
                          const x = drejtoriNxenesitTable.totals.months[mo] ?? {};
                          return (
                            <td key={mo} className="text-end py-3">
                              <span className="text-success">{x.arsyeshme ?? 0}</span>
                              <span className="text-white-50"> / </span>
                              <span className="text-danger">{x.paarsyeshme ?? 0}</span>
                            </td>
                          );
                        })}
                        <td className="text-end py-3 border-start">
                          <span className="text-success">{drejtoriNxenesitTable.totals.perioda1?.arsyeshme ?? 0}</span>
                          <span className="text-white-50"> / </span>
                          <span className="text-danger">{drejtoriNxenesitTable.totals.perioda1?.paarsyeshme ?? 0}</span>
                        </td>
                        {drejtoriNxenesitTable.p2Months.map((mo) => {
                          const x = drejtoriNxenesitTable.totals.months[mo] ?? {};
                          return (
                            <td key={mo} className="text-end py-3">
                              <span className="text-success">{x.arsyeshme ?? 0}</span>
                              <span className="text-white-50"> / </span>
                              <span className="text-danger">{x.paarsyeshme ?? 0}</span>
                            </td>
                          );
                        })}
                        <td className="text-end py-3 border-start">
                          <span className="text-success">{drejtoriNxenesitTable.totals.perioda2?.arsyeshme ?? 0}</span>
                          <span className="text-white-50"> / </span>
                          <span className="text-danger">{drejtoriNxenesitTable.totals.perioda2?.paarsyeshme ?? 0}</span>
                        </td>
                        <td className="text-end py-3">
                          <span className="text-success">{drejtoriNxenesitTable.totals.total?.arsyeshme ?? 0}</span>
                          <span className="text-white-50"> / </span>
                          <span className="text-danger">{drejtoriNxenesitTable.totals.total?.paarsyeshme ?? 0}</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-secondary">Nuk ka nxënës me mungesa në këtë klasë.</p>
            )}
          </div>
        )}

        {!loading && !isEmpty && useSummaryView && !selectedKlasaForDrejtori && drejtoriTable.rows.length > 0 && (
          <div className="mt-4">
            <p className="text-secondary mb-3">
              Përmbledhje e mungesave sipas klasave dhe muajve. Klikoni një klasë për të parë nxënësit dhe mungesat e tyre. Vit shkollor {drejtoriTable.startYear}–{drejtoriTable.endYear}. Perioda e parë: shtator–dhjetor; perioda e dytë: janar–qershor. Në çdo qelizë: <span className="text-success">me arsyeje</span> / <span className="text-danger">pa arsyeje</span>.
            </p>
            <div className="table-responsive">
              <table className="table table-hover align-middle table-bordered">
                <thead className="table-light">
                  <tr>
                    <th rowSpan={2} className="align-middle">Klasa</th>
                    <th colSpan={4} className="text-center border-start">Perioda e parë (shtator–dhjetor)</th>
                    <th rowSpan={2} className="text-end align-middle">Perioda e parë</th>
                    <th colSpan={6} className="text-center border-start">Perioda e dytë (janar–qershor)</th>
                    <th rowSpan={2} className="text-end align-middle">Perioda e dytë</th>
                    <th rowSpan={2} className="text-end align-middle fw-bold">Total</th>
                  </tr>
                  <tr>
                    <th className="text-end">Shtator</th>
                    <th className="text-end">Tetor</th>
                    <th className="text-end">Nënor</th>
                    <th className="text-end border-end">Dhjetor</th>
                    <th className="text-end">Janar</th>
                    <th className="text-end">Shkurt</th>
                    <th className="text-end">Mars</th>
                    <th className="text-end">Prill</th>
                    <th className="text-end">Maj</th>
                    <th className="text-end border-end">Qershor</th>
                  </tr>
                </thead>
                <tbody>
                  {drejtoriTable.rows.map((r) => (
                    <tr
                      key={r.emriKlases}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedKlasaForDrejtori(r.emriKlases)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedKlasaForDrejtori(r.emriKlases); } }}
                      className="cursor-pointer"
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <strong>Klasa {r.emriKlases}</strong>
                        {r.kujdestari ? <span className="text-muted fw-normal"> ({r.kujdestari})</span> : null}
                      </td>
                      {drejtoriTable.p1Months.map((mo) => {
                        const x = r.months[mo] ?? {};
                        return (
                          <td key={mo} className="text-end">
                            <span className="text-success">{x.arsyeshme ?? 0}</span>
                            <span className="text-muted"> / </span>
                            <span className="text-danger">{x.paarsyeshme ?? 0}</span>
                          </td>
                        );
                      })}
                      <td className="text-end fw-semibold border-start">
                        <span className="text-success">{r.perioda1?.arsyeshme ?? 0}</span>
                        <span className="text-muted"> / </span>
                        <span className="text-danger">{r.perioda1?.paarsyeshme ?? 0}</span>
                      </td>
                      {drejtoriTable.p2Months.map((mo) => {
                        const x = r.months[mo] ?? {};
                        return (
                          <td key={mo} className="text-end">
                            <span className="text-success">{x.arsyeshme ?? 0}</span>
                            <span className="text-muted"> / </span>
                            <span className="text-danger">{x.paarsyeshme ?? 0}</span>
                          </td>
                        );
                      })}
                      <td className="text-end fw-semibold border-start">
                        <span className="text-success">{r.perioda2?.arsyeshme ?? 0}</span>
                        <span className="text-muted"> / </span>
                        <span className="text-danger">{r.perioda2?.paarsyeshme ?? 0}</span>
                      </td>
                      <td className="text-end fw-bold">
                        <span className="text-success">{r.total?.arsyeshme ?? 0}</span>
                        <span className="text-muted"> / </span>
                        <span className="text-danger">{r.total?.paarsyeshme ?? 0}</span>
                      </td>
                    </tr>
                  ))}
                  <tr className="table-dark fw-bold">
                    <td className="py-3 ps-4">Totali i shkollës</td>
                    {drejtoriTable.p1Months.map((mo) => {
                      const x = drejtoriTable.totals.months[mo] ?? {};
                      return (
                        <td key={mo} className="text-end py-3">
                          <span className="text-success">{x.arsyeshme ?? 0}</span>
                          <span className="text-white-50"> / </span>
                          <span className="text-danger">{x.paarsyeshme ?? 0}</span>
                        </td>
                      );
                    })}
                    <td className="text-end py-3 border-start">
                      <span className="text-success">{drejtoriTable.totals.perioda1?.arsyeshme ?? 0}</span>
                      <span className="text-white-50"> / </span>
                      <span className="text-danger">{drejtoriTable.totals.perioda1?.paarsyeshme ?? 0}</span>
                    </td>
                    {drejtoriTable.p2Months.map((mo) => {
                      const x = drejtoriTable.totals.months[mo] ?? {};
                      return (
                        <td key={mo} className="text-end py-3">
                          <span className="text-success">{x.arsyeshme ?? 0}</span>
                          <span className="text-white-50"> / </span>
                          <span className="text-danger">{x.paarsyeshme ?? 0}</span>
                        </td>
                      );
                    })}
                    <td className="text-end py-3 border-start">
                      <span className="text-success">{drejtoriTable.totals.perioda2?.arsyeshme ?? 0}</span>
                      <span className="text-white-50"> / </span>
                      <span className="text-danger">{drejtoriTable.totals.perioda2?.paarsyeshme ?? 0}</span>
                    </td>
                    <td className="text-end py-3">
                      <span className="text-success">{drejtoriTable.totals.total?.arsyeshme ?? 0}</span>
                      <span className="text-white-50"> / </span>
                      <span className="text-danger">{drejtoriTable.totals.total?.paarsyeshme ?? 0}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!loading && !isEmpty && useSummaryView && !selectedKlasaForDrejtori && drejtoriTable.rows.length === 0 && (
          <div className="mt-4 text-secondary">Nuk ka të dhëna mungesash për vitin shkollor {drejtoriTable.startYear}–{drejtoriTable.endYear}.</div>
        )}

        {!loading && !isEmpty && selectedNxenesi && (isPrindi || isKujdestar || isAdministrator) && (
          <div className="mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary mb-3"
              onClick={() => setSelectedNxenesi(null)}
            >
              ← Kthehu te nxënësit
            </button>
            <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
              <div className="card-header bg-light py-3">
                <h5 className="mb-0">
                  <strong>{selectedNxenesi.nxenesi.emri} {selectedNxenesi.nxenesi.mbiemri}</strong>
                  <span className="text-muted fw-normal ms-2">– Klasa {selectedNxenesi.emriKlases}</span>
                </h5>
                <div className="small mt-1">
                  <span className="text-success">Të arsyeshme: {selectedNxenesi.nxenesi.shumaArsyeshme ?? 0}</span>
                  <span className="ms-3 text-danger">Të paarsyeshme: {selectedNxenesi.nxenesi.shumaPaarsyeshme ?? 0}</span>
                </div>
              </div>
              <div className="card-body p-4">
                {(() => {
                  const n = selectedNxenesi.nxenesi;
                  const ngaMuaji = groupByMonth(n.mungesat);
                  return (
                    <>
                      <div className="mb-4">
                        {ngaMuaji.map(({ label, count, arsyeshme, paarsyeshme }) => (
                          <div key={label} className="d-flex flex-wrap align-items-center gap-2 py-1">
                            <span className="fw-medium">{label}:</span>
                            <span>{count} {count === 1 ? "mungesë" : "mungesa"}</span>
                            <span className="text-success small">({arsyeshme} të arsyeshme</span>
                            <span className="text-danger small">, {paarsyeshme} të paarsyeshme)</span>
                          </div>
                        ))}
                        <div className="d-flex align-items-center gap-2 py-1 mt-2 pt-2 border-top fw-semibold">
                          <span>Total: {n.shuma} {n.shuma === 1 ? "mungesë" : "mungesa"}</span>
                        </div>
                      </div>
                      <div className="small text-secondary mb-2">Kur i ka mungesat{!isPrindi && " (shënoni nëse është me arsyje)"}:</div>
                      <ul className="list-unstyled mb-0">
                        {n.mungesat.map((m, idx) => {
                          const mid = m.id ?? m.Id ?? idx;
                          const isToggling = togglingMeArsyjeId === mid;
                          return (
                            <li key={mid} className="py-2 border-bottom border-light">
                              <span className="fw-medium">{m.dateStr}</span>
                              <span className="ms-2">{m.oretDisplay || "—"}</span>
                              {(m.arsyeja ?? m.Arsyeja) && <span className="text-muted ms-1">— {m.arsyeja ?? m.Arsyeja}</span>}
                              {!isPrindi && (
                                <>
                                  {(m.arsyetimPrindi ?? m.ArsyetimPrindi ?? m.skedarArsyetimit ?? m.SkedarArsyetimit) && (
                                    <div className="ms-0 mt-2 mb-2 p-2 rounded bg-light border-start border-info border-3 small">
                                      <span className="badge bg-info text-dark me-2">Prindi ka dërguar kërkesë</span>
                                      {(m.arsyetimPrindi ?? m.ArsyetimPrindi) && <div className="text-dark mt-1">{m.arsyetimPrindi ?? m.ArsyetimPrindi}</div>}
                                      {(m.skedarArsyetimit ?? m.SkedarArsyetimit) && (
                                        <button type="button" className="btn btn-sm btn-outline-primary mt-1" onClick={(e) => { e.stopPropagation(); const id = m.id ?? m.Id; if (!id) return; axios.get(`/Mungesat/${id}/skedar`, { responseType: "blob" }).then((res) => { const url = URL.createObjectURL(res.data); const a = document.createElement("a"); a.href = url; a.download = m.skedarArsyetimit ?? m.SkedarArsyetimit ?? "skedar"; a.click(); URL.revokeObjectURL(url); }).catch(() => {}); }}>Shkarko skedarin e ngarkuar</button>
                                      )}
                                    </div>
                                  )}
                                  <label className="d-inline-flex align-items-center gap-1 mb-0 ms-2 small">
                                    <input type="checkbox" checked={((m.oretList?.length > 0 && ((m.oretMeArsyjeSet?.size > 0 && m.oretList.every((ore) => m.oretMeArsyjeSet.has(ore))) || ((!m.oretMeArsyjeSet || m.oretMeArsyjeSet.size === 0) && m.meArsyjeFalem))) ?? false)} disabled={isToggling} onChange={(e) => toggleMeArsyje(m, e)} className="form-check-input" />
                                    <span>Me arsyje (të gjitha)</span>
                                  </label>
                                  <button type="button" className="btn btn-sm btn-outline-primary ms-2" onClick={(e) => { e.stopPropagation(); openEdit(m); }}>Ndrysho</button>
                                </>
                              )}
                              {isPrindi && (
                                <>
                                  {(m.arsyetimPrindi ?? m.ArsyetimPrindi ?? m.skedarArsyetimit ?? m.SkedarArsyetimit) ? <span className="badge bg-secondary ms-2">Kërkesa u dërgua</span> : null}
                                  <button type="button" className="btn btn-sm btn-outline-success ms-2" onClick={(e) => openArsyeto(m, e)}>Arsyeto Mungesën</button>
                                </>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {!loading && !isEmpty && !useSummaryView && !selectedNxenesi && (
          <div className="mt-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "2rem" }} />
                    <th>Klasa / Nxënësi</th>
                    <th className="text-end">Shuma e mungesave</th>
                    <th className="text-end">Arsyeje/pa arsyje</th>
                  </tr>
                </thead>
                <tbody>
                  {klasatMeNxenes.map((klasa) => {
                    const isKlasaExpanded = expandedKlasa === klasa.emriKlases;
                    return (
                      <React.Fragment key={klasa.emriKlases}>
                        <tr
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleExpandKlasa(klasa.emriKlases)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleExpandKlasa(klasa.emriKlases);
                            }
                          }}
                          className={isKlasaExpanded ? "table-active" : ""}
                          style={{ cursor: "pointer", backgroundColor: isKlasaExpanded ? "rgba(77,71,195,0.08)" : undefined }}
                        >
                          <td className="text-secondary">
                            <span
                              className="d-inline-block"
                              style={{ transform: isKlasaExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}
                            >
                              ▶
                            </span>
                          </td>
                          <td>
                            <strong>Klasa {klasa.emriKlases}</strong>
                          </td>
                          <td className="text-end fw-semibold">{klasa.shumaKlase}</td>
                          <td className="text-end">
                            <span className="text-success">{klasa.nxenesit.reduce((s, n) => s + (n.shumaArsyeshme ?? 0), 0)}</span>
                            <span>/</span>
                            <span className="text-danger">{klasa.nxenesit.reduce((s, n) => s + (n.shumaPaarsyeshme ?? 0), 0)}</span>
                          </td>
                        </tr>
                        {isKlasaExpanded && (
                          <>
                            {klasa.nxenesit.map((n) => (
                              <tr
                                key={n.nxenesiId}
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelectedNxenesi({ nxenesi: n, emriKlases: klasa.emriKlases })}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setSelectedNxenesi({ nxenesi: n, emriKlases: klasa.emriKlases });
                                  }
                                }}
                                className="table-hover-row"
                                style={{ cursor: "pointer" }}
                              >
                                <td className="text-secondary ps-4">▶</td>
                                <td className="ps-4">
                                  <strong>{n.emri} {n.mbiemri}</strong>
                                </td>
                                <td className="text-end fw-semibold">{n.shuma}</td>
                                <td className="text-end">
                                  <span className="text-success">{n.shumaArsyeshme ?? 0}</span>
                                  <span>/</span>
                                  <span className="text-danger">{n.shumaPaarsyeshme ?? 0}</span>
                                </td>
                              </tr>
                            ))}
                            {!isPrindi && (
                              <tr className="table-secondary">
                                <td className="p-3 border-start border-end border-bottom" />
                                <td className="p-3 border-start border-end border-bottom ps-4 fw-semibold">
                                  Mungesat e përgjithshme të klasës {klasa.emriKlases}:
                                </td>
                                <td className="p-3 border-start border-end border-bottom text-end fw-bold">{klasa.shumaKlase}</td>
                                <td className="p-3 border-start border-end border-bottom text-end">
                                  <span className="text-success">{klasa.nxenesit.reduce((s, n) => s + (n.shumaArsyeshme ?? 0), 0)}</span>
                                  <span>/</span>
                                  <span className="text-danger">{klasa.nxenesit.reduce((s, n) => s + (n.shumaPaarsyeshme ?? 0), 0)}</span>
                                </td>
                              </tr>
                            )}
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {!isPrindi && (
                    <tr className="table-dark fw-bold">
                      <td colSpan={2} className="py-3 ps-4">
                        Shuma e përgjithshme e mungesave të shkollës
                      </td>
                      <td className="text-end py-3 pe-4">{totaliShkolles.shuma}</td>
                      <td className="text-end py-3 pe-4">
                        <span className="text-success">{totaliShkolles.arsyeshme}</span>
                        <span>/</span>
                        <span className="text-danger">{totaliShkolles.paarsyeshme}</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {isEmpty && (
          <div className="h-75 mt-4 d-flex flex-column justify-content-center align-items-center">
            <h2>Nuk ka asnjë mungesë!</h2>
            <p className="text-secondary">
              Mungesat shfaqen atëherë kur janë shtuar.
            </p>
          </div>
        )}

        {arsyetoMungesa && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={closeArsyeto}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Arsyeto mungesën</h5>
                  <button type="button" className="btn-close" onClick={closeArsyeto} aria-label="Mbyll" />
                </div>
                <form onSubmit={handleArsyetoSubmit}>
                  <div className="modal-body">
                    {arsyetoError && <div className="alert alert-danger py-2">{arsyetoError}</div>}
                    <p className="text-secondary small mb-2">
                      Shkruani arsyet pse fëmija juaj ka munguar dhe/ose ngarkoni një skedar (vertetim mjeku, recetë). Shpjegimi dhe skedari do t’ia dërgohen kujdestarit të klasës; vetëm kujdestari mund ta shënojë mungesën si të arsyeshme.
                    </p>
                    <label className="form-label text-secondary mb-1">Shpjegimi (opsional)</label>
                    <textarea
                      className="form-control border-0 px-3 rounded-3 py-2 mb-3"
                      rows={4}
                      placeholder="Përshkruani shkurt arsyet e mungesës..."
                      value={arsyetoForm.teksti}
                      onChange={(e) => setArsyetoForm((f) => ({ ...f, teksti: e.target.value }))}
                    />
                    <label className="form-label text-secondary mb-1">Skedar (opsional) – p.sh. vertetim nga mjeku</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => setArsyetoFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeArsyeto}>
                      Anulo
                    </button>
                    <button type="submit" className="btn btn-success" disabled={arsyetoSaving}>
                      {arsyetoSaving ? "Duke ruajtur…" : "Dërgo arsyetimin"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {editingMungesa && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={closeEdit}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Ndrysho mungesën</h5>
                  <button type="button" className="btn-close" onClick={closeEdit} aria-label="Mbyll" />
                </div>
                <form onSubmit={handleSaveEdit}>
                  <div className="modal-body">
                    {editError && <div className="alert alert-danger py-2">{editError}</div>}
                    {(editingMungesa?.arsyetimPrindi ?? editingMungesa?.ArsyetimPrindi ?? editingMungesa?.skedarArsyetimit ?? editingMungesa?.SkedarArsyetimit) && (
                      <div className="alert alert-info py-3 mb-3">
                        <div className="fw-semibold mb-2">Kërkesa e prindit</div>
                        {(editingMungesa?.arsyetimPrindi ?? editingMungesa?.ArsyetimPrindi) && (
                          <p className="mb-2 small">{editingMungesa.arsyetimPrindi ?? editingMungesa.ArsyetimPrindi}</p>
                        )}
                        {(editingMungesa?.skedarArsyetimit ?? editingMungesa?.SkedarArsyetimit) && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={async () => {
                              const id = editingMungesa?.id ?? editingMungesa?.Id;
                              if (!id) return;
                              try {
                                const res = await axios.get(`/Mungesat/${id}/skedar`, { responseType: "blob" });
                                const url = URL.createObjectURL(res.data);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = editingMungesa?.skedarArsyetimit ?? editingMungesa?.SkedarArsyetimit ?? "skedar";
                                a.click();
                                URL.revokeObjectURL(url);
                              } catch (_) {}
                            }}
                          >
                            Shkarko skedarin e ngarkuar
                          </button>
                        )}
                        <p className="text-muted small mb-0 mt-2">Vendosni nëse mungesa është e arsyeshme (më poshtë).</p>
                      </div>
                    )}
                    <label className="form-label text-secondary mb-0">Data</label>
                    <input
                      type="date"
                      className="form-control border-0 px-3 rounded-3 py-2 mb-3"
                      value={editForm.data}
                      onChange={(e) => setEditForm((f) => ({ ...f, data: e.target.value }))}
                      required
                    />
                    <label className="form-label text-secondary mb-0">Arsyeja (opsional)</label>
                    <input
                      type="text"
                      className="form-control border-0 px-3 rounded-3 py-2 mb-3"
                      placeholder="Arsyeja"
                      value={editForm.arsyeja}
                      onChange={(e) => setEditForm((f) => ({ ...f, arsyeja: e.target.value }))}
                    />
                    <label className="form-label text-secondary mb-1 fw-semibold">Oret – zgjidhni në cilat ore ka munguar dhe cilat janë me arsyje</label>
                    <div className="d-flex flex-wrap align-items-center ore-checkbox-group gap-2">
                      <label
                        className={`ore-checkbox ore-checkbox-all mb-0 ${
                          editForm.oretZgjidhura.length === 7 ? "ore-checkbox--checked" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={editForm.oretZgjidhura.length === 7}
                          onChange={toggleEditTereDiten}
                          className="form-check-input ore-checkbox-input"
                        />
                        <span className="ore-checkbox-label">Tëre ditën</span>
                      </label>
                      {[1, 2, 3, 4, 5, 6, 7].map((ore) => (
                        <div key={ore} className="d-inline-flex align-items-center gap-1 flex-wrap">
                          <label
                            className={`ore-checkbox mb-0 ${
                              editForm.oretZgjidhura.includes(ore) ? "ore-checkbox--checked" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={editForm.oretZgjidhura.includes(ore)}
                              onChange={() => toggleEditOre(ore)}
                              className="form-check-input ore-checkbox-input"
                            />
                            <span className="ore-checkbox-label">Ora {ore}</span>
                          </label>
                          {editForm.oretZgjidhura.includes(ore) && (
                            <label className="d-inline-flex align-items-center gap-1 small mb-0 ms-1">
                              <input
                                type="checkbox"
                                checked={editForm.oretMeArsyje.includes(ore)}
                                onChange={() => toggleOreMeArsyje(ore)}
                                className="form-check-input"
                              />
                              <span>me arsyje</span>
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeEdit}>
                      Anulo
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={editSaving}>
                      {editSaving ? "Duke ruajtur…" : "Ruaj ndryshimet"}
                    </button>
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

export default Missings;
