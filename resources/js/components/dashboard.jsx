import { useState, useEffect } from "react";
 
const PRIMARY = "#0A2463";
const ACCENT = "#1B4FD8";
const LIGHT = "#E8EEFF";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 20px", borderRadius: 8, marginTop: 16,
      background: type === "success" ? "#F0FDF4" : "#FFF1F2",
      border: `1px solid ${type === "success" ? "#86EFAC" : "#FECDD3"}`,
      animation: "slideIn 0.3s ease",
    }}>
      <span style={{ fontSize: 18 }}>{type === "success" ? "✅" : "❌"}</span>
      <span style={{ flex: 1, fontSize: 14, color: type === "success" ? "#16A34A" : "#EF4444", fontWeight: 500 }}>
        {message}
      </span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94A3B8" }}>✕</button>
    </div>
  );
}
 
 
const menuItems = [
  { icon: "📊", label: "Bilan & Graphes", key: "bilan" },
  { icon: "➕", label: "Ajouter un prêt", key: "ajouter" },
  { icon: "📋", label: "Liste des prêts", key: "liste" },
];
 
export default function Dashboard({ setPage, logout }) {
  const [activeMenu, setActiveMenu] = useState("bilan");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [prets, setPrets] = useState([]);
const [loadingData, setLoadingData] = useState(true);

useEffect(() => {
    const fetchPrets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/pre-bancaires', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                setPrets(data);
            }
        } catch (e) {
            console.error('Erreur chargement prêts', e);
        } finally {
            setLoadingData(false);
        }
    };
    fetchPrets();
}, []);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (loadingData) {
    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4FF" }}>
            <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#0A2463", fontWeight: 700, marginBottom: 8 }}>
                    BanqueApp
                </div>
                <div style={{ color: "#64748B", fontSize: 14 }}>Chargement des données...</div>
            </div>
        </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", display: "flex", background: "#F0F4FF" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
 
        .menu-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 8px; cursor: pointer;
          transition: all 0.2s; color: rgba(255,255,255,0.65);
          font-size: 14px; font-weight: 400; border: none;
          background: none; width: 100%; text-align: left;
          font-family: 'DM Sans', sans-serif;
        }
        .menu-item:hover { background: rgba(255,255,255,0.08); color: white; }
        .menu-item.active { background: rgba(255,255,255,0.15); color: white; font-weight: 600; }
 
        .card { background: white; border-radius: 12px; padding: 24px; border: 1px solid #E2E8F0; }
 
        .input-field {
          width: 100%; padding: 12px 14px;
          border: 1.5px solid #E2E8F0; outline: none;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1E293B;
          background: #F8FAFF; transition: all 0.25s; border-radius: 6px;
        }
        .input-field:focus { border-color: ${ACCENT}; background: white; box-shadow: 0 0 0 3px rgba(27,79,216,0.08); }
        .input-field::placeholder { color: #94A3B8; }
 
        .btn-submit {
          background: ${PRIMARY}; color: white; border: none;
          padding: 13px 0; width: 100%; font-family: 'DM Sans', sans-serif;
          font-weight: 600; font-size: 14px; cursor: pointer;
          border-radius: 6px; transition: all 0.3s; letter-spacing: 0.04em;
        }
        .btn-submit:hover { background: ${ACCENT}; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(27,79,216,0.3); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
 
        .table-row { transition: background 0.2s; }
        .table-row:hover { background: #F8FAFF; }
 
        .btn-edit {
          padding: 6px 14px; background: ${LIGHT}; color: ${ACCENT};
          border: 1px solid rgba(27,79,216,0.2); border-radius: 6px;
          cursor: pointer; font-size: 12px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .btn-edit:hover { background: ${ACCENT}; color: white; }
 
        .btn-delete {
          padding: 6px 14px; background: #FFF1F2; color: #EF4444;
          border: 1px solid rgba(239,68,68,0.2); border-radius: 6px;
          cursor: pointer; font-size: 12px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .btn-delete:hover { background: #EF4444; color: white; }
 
        .slide-in { animation: slideIn 0.4s cubic-bezier(0.16,1,0.3,1); }
        @keyframes slideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
 
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(10,36,99,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 999; backdrop-filter: blur(4px);
        }
      `}</style>
 
      {/* ── SIDEBAR ── */}
      <div style={{
        width: sidebarOpen ? 240 : 72,
        background: `linear-gradient(180deg, ${PRIMARY} 0%, #0D3180 100%)`,
        display: "flex", flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.16,1,0.3,1)",
        overflow: "hidden", flexShrink: 0, position: "relative",
        boxShadow: "4px 0 24px rgba(10,36,99,0.2)",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ width: 36, height: 36, background: "white", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: PRIMARY, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 18 }}>B</span>
          </div>
          {sidebarOpen && <span style={{ color: "white", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, whiteSpace: "nowrap" }}>BanqueApp</span>}
        </div>
 
        {/* User info */}
        {sidebarOpen && (
          <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
              </div>
              <div>
                <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{user?.prenom} {user?.nom}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{user?.email}</div>
              </div>
            </div>
          </div>
        )}
 
        {/* Menu */}
        <nav style={{ padding: "16px 8px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {menuItems.map(item => (
            <button key={item.key} className={`menu-item ${activeMenu === item.key ? "active" : ""}`} onClick={() => setActiveMenu(item.key)} title={!sidebarOpen ? item.label : ""}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
            </button>
          ))}
        </nav>
 
        {/* Déconnexion */}
        <div style={{ padding: "16px 8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button className="menu-item" onClick={() => {
            const ok = window.confirm("Voulez-vous vraiment vous déconnecter ?");
            if (ok) logout();
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>🚪</span>
            {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>Déconnexion</span>}
          </button>
        </div>
 
        {/* Toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
          position: "absolute", top: 28, right: -14,
          width: 28, height: 28, borderRadius: "50%",
          background: "white", border: `2px solid ${LIGHT}`,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color: PRIMARY, fontWeight: 700,
          boxShadow: "0 2px 8px rgba(10,36,99,0.15)",
        }}>
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </div>
 
      {/* ── CONTENU PRINCIPAL ── */}
      <div style={{ flex: 1, overflow: "auto", padding: "32px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <p style={{ color: "#94A3B8", fontSize: 13, marginBottom: 4 }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: PRIMARY, fontWeight: 900 }}>
              {activeMenu === "bilan" && "Bilan & Graphes"}
              {activeMenu === "ajouter" && "Ajouter un prêt"}
              {activeMenu === "liste" && "Liste des prêts"}
            </h1>
          </div>
          <div style={{ width: 40, height: 40, background: PRIMARY, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14 }}>
            {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
          </div>
        </div>
 
        {activeMenu === "bilan" && <BilanPage prets={prets} setActiveMenu={setActiveMenu} />}
        {activeMenu === "ajouter" && <AjouterPage prets={prets} setPrets={setPrets} setActiveMenu={setActiveMenu} />}
        {activeMenu === "liste" && <ListePage prets={prets} setPrets={setPrets} />}
      </div>
    </div>
  );
}
 
/* ─────────────────────────────────────────
   PAGE BILAN & GRAPHES
───────────────────────────────────────── */
function BilanPage({ prets, setActiveMenu }) {
  const totalMontant = prets.reduce((s, p) => s + parseFloat(p.montant), 0);
  const totalRembourser = prets.reduce((s, p) => s + parseFloat(p.montant_a_rembourser), 0);
  const totalInterets = totalRembourser - totalMontant;
  const maxMontant = Math.max(...prets.map(p => parseFloat(p.montant_a_rembourser)), 1);
 
  return (
    <div className="slide-in">
      {/* Cartes bilan */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 28 }}>
        {[
          { label: "Total prêts", value: prets.length, suffix: "prêts", icon: "📋", color: "#3B82F6" },
          { label: "Montant total prêté", value: totalMontant.toLocaleString('fr-FR'), suffix: "Ar", icon: "💰", color: "#16A34A" },
          { label: "Total à rembourser", value: totalRembourser.toLocaleString('fr-FR'), suffix: "Ar", icon: "🏦", color: "#8B5CF6" },
          { label: "Total intérêts", value: totalInterets.toLocaleString('fr-FR'), suffix: "Ar", icon: "📈", color: "#F59E0B" },
        ].map((c, i) => (
          <div key={i} className="card" style={{ borderLeft: `4px solid ${c.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>{c.icon}</span>
              <span style={{ fontSize: 11, color: "#94A3B8", background: "#F8FAFF", padding: "2px 8px", borderRadius: 20 }}>{c.label}</span>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: PRIMARY, fontWeight: 900 }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{c.suffix}</div>
          </div>
        ))}
      </div>
 
      {/* Graphe barres */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: PRIMARY, fontWeight: 700 }}>
            Montant prêté vs à rembourser
          </h2>
          <button onClick={() => setActiveMenu("ajouter")} style={{ background: PRIMARY, color: "white", border: "none", padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
            + Ajouter un prêt
          </button>
        </div>
 
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, height: 200, padding: "0 16px" }}>
          {prets.map((p) => (
            <div key={p.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%" }}>
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", gap: 4 }}>
                <div title={`Prêté: ${p.montant.toLocaleString('fr-FR')} Ar`} style={{ flex: 1, borderRadius: "4px 4px 0 0", background: "linear-gradient(180deg, #3B82F6, #1D4ED8)", height: `${(parseFloat(p.montant) / maxMontant) * 100}%`, minHeight: 8 }} />
                <div title={`À rembourser: ${p.montant_a_rembourser.toLocaleString('fr-FR')} Ar`} style={{ flex: 1, borderRadius: "4px 4px 0 0", background: "linear-gradient(180deg, #8B5CF6, #6D28D9)", height: `${(parseFloat(p.montant_a_rembourser) / maxMontant) * 100}%`, minHeight: 8 }} />
              </div>
              <div style={{ fontSize: 11, color: "#64748B", textAlign: "center" }}>{p.nom_client.split(' ')[0]}</div>
            </div>
          ))}
        </div>
 
        <div style={{ display: "flex", gap: 20, marginTop: 16, justifyContent: "center" }}>
          {[["#3B82F6", "Montant prêté"], ["#8B5CF6", "À rembourser"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, background: c, borderRadius: 2 }} />
              <span style={{ fontSize: 12, color: "#64748B" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
 
      {/* Récap par banque */}
      <div className="card">
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: PRIMARY, fontWeight: 700, marginBottom: 20 }}>Récapitulatif par banque</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFF" }}>
              {["Banque", "Nb prêts", "Total prêté", "Total intérêts"].map(h => (
                <th key={h} style={{ padding: "10px 14px", fontSize: 11, color: "#64748B", fontWeight: 600, textAlign: "left", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(prets.reduce((acc, p) => {
              if (!acc[p.nom_banque]) acc[p.nom_banque] = { nb: 0, total: 0, interets: 0 };
              acc[p.nom_banque].nb++;
              acc[p.nom_banque].total += parseFloat(p.montant);
              acc[p.nom_banque].interets += (parseFloat(p.montant_a_rembourser) - parseFloat(p.montant));
              return acc;
            }, {})).map(([banque, data], i) => (
              <tr key={i} className="table-row" style={{ borderTop: "1px solid #F1F5F9" }}>
                <td style={{ padding: "12px 14px", fontSize: 14, color: PRIMARY, fontWeight: 500 }}>{banque}</td>
                <td style={{ padding: "12px 14px", fontSize: 14, color: "#64748B" }}>{data.nb}</td>
                <td style={{ padding: "12px 14px", fontSize: 14, color: "#16A34A", fontWeight: 600 }}>{data.total.toLocaleString('fr-FR')} Ar</td>
                <td style={{ padding: "12px 14px", fontSize: 14, color: "#F59E0B", fontWeight: 600 }}>{data.interets.toLocaleString('fr-FR')} Ar</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
/* ─────────────────────────────────────────
   PAGE AJOUTER UN PRÊT
───────────────────────────────────────── */
function AjouterPage({ prets, setPrets, setActiveMenu }) {
  const [form, setForm] = useState({ nom_client: "", nom_banque: "", montant: "", taux: "", date_du_pret: "", duree: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 4000);
  };
 
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const montantARembourser = form.montant && form.taux
    ? (parseFloat(form.montant) * (1 + parseFloat(form.taux) / 100)).toFixed(2)
    : null;
 
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/pre-bancaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          montant: parseFloat(form.montant),
          taux: parseFloat(form.taux),
          duree: parseInt(form.duree),
          montant_a_rembourser: parseFloat(montantARembourser),
        }),
      });
      const data = await response.json();
      if (response.ok) {
          setPrets([...prets, data.pret]);
          setForm({ nom_client: "", nom_banque: "", montant: "", taux: "", date_du_pret: "", duree: "" });
          showToast("Prêt ajouté avec succès !", "success");
          setTimeout(() => setActiveMenu("liste"), 2000);
      } else {
          showToast(data.message || "Erreur lors de l'ajout", "error");
      }
    } catch (e) {
        showToast("Erreur de connexion au serveur", "error");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="slide-in" style={{ maxWidth: 680, margin: "0 auto" }}>
      <div className="card">
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: PRIMARY, fontWeight: 900, marginBottom: 8 }}>Nouveau prêt pré-bancaire</h2>
        <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 28 }}>Remplissez les informations du prêt ci-dessous.</p>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7 }}>Nom du client *</label>
              <input className="input-field" type="text" name="nom_client" placeholder="Ex: Rakoto Jean" value={form.nom_client} onChange={handle} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7 }}>Banque *</label>
              <select className="input-field" name="nom_banque" value={form.nom_banque} onChange={handle} required style={{ cursor: "pointer" }}>
                <option value="">-- Sélectionnez une banque --</option>
                {[
                  "BFV Société Générale",
                  "BOA Madagascar",
                  "Accès Banque Madagascar",
                  "MCB Madagascar",
                  "BNI Madagascar",
                  "Société Générale Madagascar",
                  "Autre",
                ].map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
 
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7 }}>Montant du prêt (Ar) *</label>
              <input className="input-field" type="number" name="montant" placeholder="Ex: 500000" value={form.montant} onChange={handle} required min="0" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7 }}>Taux d'intérêt (%) *</label>
              <input className="input-field" type="number" name="taux" placeholder="Ex: 5" value={form.taux} onChange={handle} required min="0" step="0.1" />
            </div>
          </div>
 
          {montantARembourser && (
            <div style={{ background: LIGHT, border: `1px solid rgba(27,79,216,0.2)`, borderRadius: 8, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#64748B", fontSize: 13 }}>💡 Montant à rembourser calculé automatiquement :</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: PRIMARY, fontWeight: 900 }}>
                {parseFloat(montantARembourser).toLocaleString('fr-FR')} Ar
              </span>
            </div>
          )}
 
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7 }}>Date du prêt *</label>
              <input className="input-field" type="date" name="date_du_pret" value={form.date_du_pret} onChange={handle} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7 }}>Durée (mois) *</label>
              <input className="input-field" type="number" name="duree" placeholder="Ex: 12" value={form.duree} onChange={handle} required min="1" />
            </div>
          </div>
 
          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer le prêt →"}
          </button>
        </form>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}
 
/* ─────────────────────────────────────────
   PAGE LISTE DES PRÊTS
───────────────────────────────────────── */
function ListePage({ prets, setPrets }) {
  const [search, setSearch] = useState("");
  const [editPret, setEditPret] = useState(null);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };
  
  const filtered = prets.filter(p =>
    p.nom_client.toLowerCase().includes(search.toLowerCase()) ||
    p.nom_banque.toLowerCase().includes(search.toLowerCase())
  );
 
  const supprimer = async (id) => {
    const ok = window.confirm("Voulez-vous vraiment supprimer ce prêt ?");
    if (!ok) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/pre-bancaires/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
      setPrets(prets.filter(p => p.id !== id));
      showToast("Prêt supprimé avec succès !", "success");
      } else {
          showToast("Erreur lors de la suppression", "error");
      }
    } catch (e) {
      showToast("Erreur de suppression", "error");
    }
  };
 
  const modifier = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const montant_a_rembourser = parseFloat(editPret.montant) * (1 + parseFloat(editPret.taux) / 100);
      const response = await fetch(`/api/pre-bancaires/${editPret.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...editPret, montant_a_rembourser }),
      });
      const data = await response.json();
      if (response.ok) {
          setPrets(prets.map(p => p.id === editPret.id ? data.pret : p));
          setEditPret(null);
          showToast("Prêt modifié avec succès !", "success");
      } else {
          showToast("Erreur lors de la modification", "error");
      }
    } catch (e) {
      showToast("Erreur de modification", "error");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="slide-in">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: PRIMARY, fontWeight: 700 }}>
            {filtered.length} prêt{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
          </h2>
          <input className="input-field" style={{ width: 260 }} placeholder="🔍 Rechercher client ou banque..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
 
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFF" }}>
                {["Client", "Banque", "Montant prêté", "Taux", "À rembourser", "Date", "Durée", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", fontSize: 11, color: "#64748B", fontWeight: 600, textAlign: "left", letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#94A3B8", fontSize: 14 }}>Aucun prêt trouvé</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="table-row" style={{ borderTop: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "14px", fontSize: 14, color: PRIMARY, fontWeight: 500 }}>{p.nom_client}</td>
                  <td style={{ padding: "14px", fontSize: 13, color: "#64748B" }}>{p.nom_banque}</td>
                  <td style={{ padding: "14px", fontSize: 14, color: "#16A34A", fontWeight: 600 }}>{p.montant.toLocaleString('fr-FR')} Ar</td>
                  <td style={{ padding: "14px" }}>
                    <span style={{ background: LIGHT, color: ACCENT, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{p.taux}%</span>
                  </td>
                  <td style={{ padding: "14px", fontSize: 14, color: "#8B5CF6", fontWeight: 600 }}>{p.montant_a_rembourser.toLocaleString('fr-FR')} Ar</td>
                  <td style={{ padding: "14px", fontSize: 13, color: "#64748B" }}>{new Date(p.date_du_pret).toLocaleDateString('fr-FR')}</td>
                  <td style={{ padding: "14px", fontSize: 13, color: "#64748B" }}>{p.duree} mois</td>
                  <td style={{ padding: "14px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn-edit" onClick={() => setEditPret({ ...p })}>✏️ Modifier</button>
                      <button className="btn-delete" onClick={() => supprimer(p.id)}>🗑️ Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
 
      {/* MODAL MODIFIER */}
      {editPret && (
        <div className="modal-overlay" onClick={() => setEditPret(null)}>
          <div className="card slide-in" style={{ width: 560, maxWidth: "95vw" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: PRIMARY, fontWeight: 900, marginBottom: 20 }}>✏️ Modifier le prêt</h2>
            <form onSubmit={modifier} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { label: "Nom client", key: "nom_client", type: "text" },
                { label: "Montant (Ar)", key: "montant", type: "number" },
                { label: "Taux (%)", key: "taux", type: "number" },
                { label: "Date du prêt", key: "date_du_pret", type: "date" },
                { label: "Durée (mois)", key: "duree", type: "number" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, textTransform: "uppercase", marginBottom: 6 }}>{f.label}</label>
                  <input className="input-field" type={f.type} value={editPret[f.key]} onChange={e => setEditPret({ ...editPret, [f.key]: e.target.value })} required step={f.key === "taux" ? "0.1" : undefined} />
                </div>
              ))}

              {/* SELECT BANQUE */}
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, textTransform: "uppercase", marginBottom: 6 }}>Banque</label>
                <select
                  className="input-field"
                  value={editPret.nom_banque}
                  onChange={e => setEditPret({ ...editPret, nom_banque: e.target.value })}
                  required
                  style={{ cursor: "pointer" }}
                >
                  {!["BFV Société Générale","BOA Madagascar","Accès Banque Madagascar","MCB Madagascar","BNI Madagascar","Société Générale Madagascar","Autre"].includes(editPret.nom_banque) && (
                    <option value={editPret.nom_banque}>{editPret.nom_banque}</option>
                  )}
                  {["BFV Société Générale","BOA Madagascar","Accès Banque Madagascar","MCB Madagascar","BNI Madagascar","Société Générale Madagascar","Autre"].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
              {editPret.montant && editPret.taux && (
                <div style={{ background: LIGHT, borderRadius: 8, padding: "12px 16px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B", fontSize: 13 }}>💡 Nouveau montant à rembourser :</span>
                  <span style={{ color: PRIMARY, fontWeight: 700, fontSize: 16 }}>
                    {(parseFloat(editPret.montant) * (1 + parseFloat(editPret.taux) / 100)).toLocaleString('fr-FR')} Ar
                  </span>
                </div>
              )}
 
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <button type="button" onClick={() => setEditPret(null)} style={{ flex: 1, padding: "12px", background: "#F8FAFF", border: "1px solid #E2E8F0", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "#64748B" }}>
                  Annuler
                </button>
                <button className="btn-submit" type="submit" style={{ flex: 2 }} disabled={loading}>
                  {loading ? "Enregistrement..." : "Enregistrer →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}