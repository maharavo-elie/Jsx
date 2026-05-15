import { useEffect, useMemo, useState } from "react";

const PRIMARY = "#123C69";
const ACCENT = "#2563EB";
const SUCCESS = "#16A34A";
const DANGER = "#EF4444";
const WARNING = "#F59E0B";
const BANKS = [
  "BFV Societe Generale",
  "BOA Madagascar",
  "Acces Banque Madagascar",
  "MCB Madagascar",
  "BNI Madagascar",
  "Societe Generale Madagascar",
  "Autre",
];

const iconPaths = {
  chart: "M3 3v18h18M7 16v-5M12 16V7M17 16v-8",
  plus: "M12 5v14M5 12h14",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  logout: "M10 17l5-5-5-5M15 12H3M21 3v18h-8",
  bank: "M3 10l9-6 9 6M5 10h14M6 10v8M10 10v8M14 10v8M18 10v8M4 18h16M3 21h18",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M18 6 6 18M6 6l12 12",
  chevronLeft: "M15 18l-6-6 6-6",
  chevronRight: "M9 18l6-6-6-6",
  edit: "M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z",
  trash: "M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 11v6M14 11v6",
  search: "M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z",
  moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  sun: "M12 3v2M12 19v2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M3 12h2M19 12h2M5.64 18.36l1.42-1.42M16.94 7.06l1.42-1.42M12 8a4 4 0 100 8 4 4 0 000-8z",
  user: "M20 21a8 8 0 10-16 0M12 13a4 4 0 100-8 4 4 0 000 8z",
  money: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7H14.5a3.5 3.5 0 010 7H6",
  trend: "M3 17l6-6 4 4 8-8M14 7h7v7",
  wallet: "M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM16 12h5",
  check: "M20 6L9 17l-5-5",
  alert: "M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
};

function Icon({ name, size = 18, strokeWidth = 2, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, ...style }}
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

function initials(user) {
  const first = user?.prenom?.trim()?.charAt(0) || "";
  const last = user?.nom?.trim()?.charAt(0) || "";
  return `${first}${last}`.toUpperCase() || "U";
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("fr-FR");
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div className={`toast toast-${type}`}>
      <Icon name={isSuccess ? "check" : "alert"} size={18} />
      <span>{message}</span>
      <button className="icon-button subtle" onClick={onClose} type="button" aria-label="Fermer">
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

const menuItems = [
  { icon: "chart", label: "Bilan & Graphes", key: "bilan" },
  { icon: "plus", label: "Ajouter un pret", key: "ajouter" },
  { icon: "list", label: "Liste des prets", key: "liste" },
];

export default function Dashboard({ logout }) {
  const [activeMenu, setActiveMenu] = useState("bilan");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prets, setPrets] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchPrets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/pre-bancaires", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setPrets(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur chargement prets", error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchPrets();
  }, []);

  const title = {
    bilan: "Bilan & Graphes",
    ajouter: "Ajouter un pret",
    liste: "Liste des prets",
  }[activeMenu];

  const selectMenu = (key) => {
    setActiveMenu(key);
    setMobileOpen(false);
  };

  if (loadingData) {
    return (
      <div className="dashboard-shell dashboard-light loading-screen">
        <div>
          <div className="loading-brand">BanqueApp</div>
          <div className="muted">Chargement des donnees...</div>
        </div>
        <DashboardStyles />
      </div>
    );
  }

  return (
    <div className={`dashboard-shell dashboard-${theme}`}>
      <DashboardStyles />
      {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Fermer le menu" />}

      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark"><Icon name="bank" size={20} /></div>
          {sidebarOpen && <span className="brand-name">BanqueApp</span>}
        </div>

        <button className="sidebar-user" onClick={() => setShowProfile(true)} title="Mon profil" type="button">
          <span className="avatar small">{initials(user)}</span>
          {sidebarOpen && (
            <span className="sidebar-user-text">
              <strong>{user?.prenom} {user?.nom}</strong>
              <small>{user?.email}</small>
            </span>
          )}
        </button>

        <nav className="side-nav">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`menu-item ${activeMenu === item.key ? "active" : ""}`}
              onClick={() => selectMenu(item.key)}
              title={!sidebarOpen ? item.label : ""}
              type="button"
            >
              <Icon name={item.icon} size={19} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="menu-item" onClick={() => setShowLogout(true)} type="button">
            <Icon name="logout" size={19} />
            {sidebarOpen && <span>Deconnexion</span>}
          </button>
        </div>

        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} type="button" aria-label="Reduire le menu">
          <Icon name={sidebarOpen ? "chevronLeft" : "chevronRight"} size={16} />
        </button>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <button className="mobile-menu-button" onClick={() => setMobileOpen(true)} type="button" aria-label="Ouvrir le menu">
            <Icon name="menu" />
          </button>
          <div className="header-title">
            <p>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
            <h1>{title}</h1>
          </div>
          <div className="header-actions">
            <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} type="button">
              <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
              <span>{theme === "dark" ? "Mode clair" : "Mode sombre"}</span>
            </button>
            <button className="profile-trigger" onClick={() => setShowProfile(true)} type="button" title="Mon profil">
              <span className="avatar">{initials(user)}</span>
            </button>
          </div>
        </header>

        {activeMenu === "bilan" && <BilanPage prets={prets} setActiveMenu={setActiveMenu} />}
        {activeMenu === "ajouter" && <AjouterPage prets={prets} setPrets={setPrets} setActiveMenu={setActiveMenu} />}
        {activeMenu === "liste" && <ListePage prets={prets} setPrets={setPrets} />}
      </main>

      {showProfile && <ProfileModal user={user} setUser={setUser} onClose={() => setShowProfile(false)} />}
      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} onConfirm={logout} />}
    </div>
  );
}

function ProfileModal({ user, setUser, onClose }) {
  const [form, setForm] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const save = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setToast({ message: "Profil mis a jour avec succes.", type: "success" });
      } else {
        setToast({ message: data.message || "Impossible de mettre a jour le profil.", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Erreur de connexion au serveur.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card profile-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-heading">
          <div className="avatar large">{initials(form)}</div>
          <div>
            <p>Mon profil</p>
            <h2>{form.prenom || "Utilisateur"} {form.nom}</h2>
          </div>
          <button className="icon-button subtle" onClick={onClose} type="button" aria-label="Fermer">
            <Icon name="close" />
          </button>
        </div>

        <form onSubmit={save} className="form-stack">
          <div className="form-grid">
            <Field label="Prenom" name="prenom" value={form.prenom} onChange={setForm} />
            <Field label="Nom" name="nom" value={form.nom} onChange={setForm} />
            <Field label="Email" name="email" type="email" value={form.email} onChange={setForm} />
            <Field label="Telephone" name="telephone" value={form.telephone} onChange={setForm} />
          </div>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose} type="button">Annuler</button>
            <button className="btn-submit inline" type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LogoutModal({ onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card confirm-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-icon danger"><Icon name="logout" size={28} /></div>
        <h2>Deconnexion</h2>
        <p>Voulez-vous vraiment vous deconnecter de votre espace BanqueApp ?</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} type="button">Annuler</button>
          <button className="btn-danger" onClick={onConfirm} type="button">Se deconnecter</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        className="input-field"
        type={type}
        name={name}
        value={value}
        onChange={(event) => onChange((current) => ({ ...current, [name]: event.target.value }))}
        required
        {...props}
      />
    </label>
  );
}

function BilanPage({ prets, setActiveMenu }) {
  const totals = useMemo(() => {
    const totalMontant = prets.reduce((sum, pret) => sum + Number(pret.montant || 0), 0);
    const totalRembourser = prets.reduce((sum, pret) => sum + Number(pret.montant_a_rembourser || 0), 0);
    return {
      totalMontant,
      totalRembourser,
      totalInterets: totalRembourser - totalMontant,
      maxMontant: Math.max(...prets.map((pret) => Number(pret.montant_a_rembourser || 0)), 1),
    };
  }, [prets]);

  const byBank = useMemo(() => prets.reduce((acc, pret) => {
    if (!acc[pret.nom_banque]) acc[pret.nom_banque] = { nb: 0, total: 0, interets: 0 };
    acc[pret.nom_banque].nb += 1;
    acc[pret.nom_banque].total += Number(pret.montant || 0);
    acc[pret.nom_banque].interets += Number(pret.montant_a_rembourser || 0) - Number(pret.montant || 0);
    return acc;
  }, {}), [prets]);

  const cards = [
    { label: "Total prets", value: prets.length, suffix: "dossiers", icon: "list", color: "#2563EB" },
    { label: "Montant prete", value: formatNumber(totals.totalMontant), suffix: "Ar", icon: "money", color: SUCCESS },
    { label: "A rembourser", value: formatNumber(totals.totalRembourser), suffix: "Ar", icon: "wallet", color: "#7C3AED" },
    { label: "Interets", value: formatNumber(totals.totalInterets), suffix: "Ar", icon: "trend", color: WARNING },
  ];

  return (
    <div className="slide-in">
      <div className="bilan-grid">
        {cards.map((card) => (
          <section key={card.label} className="card metric-card" style={{ "--metric": card.color }}>
            <div className="metric-top">
              <span className="metric-icon"><Icon name={card.icon} size={22} /></span>
              <span>{card.label}</span>
            </div>
            <strong>{card.value}</strong>
            <small>{card.suffix}</small>
          </section>
        ))}
      </div>

      <section className="card dashboard-section">
        <div className="section-header">
          <h2>Montant prete vs a rembourser</h2>
          <button className="btn-submit inline" onClick={() => setActiveMenu("ajouter")} type="button">
            <Icon name="plus" size={16} /> Ajouter un pret
          </button>
        </div>
        {prets.length === 0 ? (
          <EmptyState label="Aucune donnee pour le graphe." />
        ) : (
          <>
            <div className="graph-container">
              <div className="graph-bars">
                {prets.map((pret) => (
                  <div key={pret.id} className="bar-group">
                    <div className="bars">
                      <div className="bar loan" title={`Prete: ${formatNumber(pret.montant)} Ar`} style={{ height: `${(Number(pret.montant) / totals.maxMontant) * 100}%` }} />
                      <div className="bar repay" title={`A rembourser: ${formatNumber(pret.montant_a_rembourser)} Ar`} style={{ height: `${(Number(pret.montant_a_rembourser) / totals.maxMontant) * 100}%` }} />
                    </div>
                    <span>{pret.nom_client?.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="legend">
              <span><i className="legend-blue" /> Montant prete</span>
              <span><i className="legend-purple" /> A rembourser</span>
            </div>
          </>
        )}
      </section>

      <section className="card dashboard-section">
        <h2>Recapitulatif par banque</h2>
        <div className="table-wrapper compact">
          <table>
            <thead>
              <tr>
                {["Banque", "Nb prets", "Total prete", "Total interets"].map((header) => <th key={header}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {Object.entries(byBank).length === 0 ? (
                <tr><td colSpan={4}><EmptyState label="Aucune banque a afficher." /></td></tr>
              ) : Object.entries(byBank).map(([bank, data]) => (
                <tr key={bank}>
                  <td>{bank}</td>
                  <td>{data.nb}</td>
                  <td className="money-positive">{formatNumber(data.total)} Ar</td>
                  <td className="money-warning">{formatNumber(data.interets)} Ar</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function AjouterPage({ prets, setPrets, setActiveMenu }) {
  const [form, setForm] = useState({ nom_client: "", nom_banque: "", montant: "", taux: "", date_du_pret: "", duree: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const montantARembourser = form.montant && form.taux
    ? (Number(form.montant) * (1 + Number(form.taux) / 100)).toFixed(2)
    : null;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/pre-bancaires", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          montant: Number(form.montant),
          taux: Number(form.taux),
          duree: Number.parseInt(form.duree, 10),
          montant_a_rembourser: Number(montantARembourser),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setPrets([...prets, data.pret]);
        setForm({ nom_client: "", nom_banque: "", montant: "", taux: "", date_du_pret: "", duree: "" });
        setToast({ message: "Pret ajoute avec succes.", type: "success" });
        setTimeout(() => setActiveMenu("liste"), 1200);
      } else {
        setToast({ message: data.message || "Erreur lors de l'ajout.", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Erreur de connexion au serveur.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="slide-in form-page">
      <section className="card">
        <div className="section-header relaxed">
          <div>
            <h2>Nouveau pret pre-bancaire</h2>
            <p>Renseignez les informations du dossier.</p>
          </div>
        </div>
        <form onSubmit={submit} className="form-stack">
          <div className="form-grid">
            <Field label="Nom du client" name="nom_client" value={form.nom_client} onChange={setForm} placeholder="Ex: Rakoto Jean" />
            <label className="field">
              <span>Banque</span>
              <select className="input-field" name="nom_banque" value={form.nom_banque} onChange={(event) => setForm({ ...form, nom_banque: event.target.value })} required>
                <option value="">Selectionnez une banque</option>
                {BANKS.map((bank) => <option key={bank} value={bank}>{bank}</option>)}
              </select>
            </label>
            <Field label="Montant du pret (Ar)" name="montant" type="number" min="0" value={form.montant} onChange={setForm} placeholder="Ex: 500000" />
            <Field label="Taux d'interet (%)" name="taux" type="number" min="0" step="0.1" value={form.taux} onChange={setForm} placeholder="Ex: 5" />
            <Field label="Date du pret" name="date_du_pret" type="date" value={form.date_du_pret} onChange={setForm} />
            <Field label="Duree (mois)" name="duree" type="number" min="1" value={form.duree} onChange={setForm} placeholder="Ex: 12" />
          </div>

          {montantARembourser && (
            <div className="calculated-box">
              <span><Icon name="trend" size={17} /> Montant a rembourser calcule</span>
              <strong>{formatNumber(montantARembourser)} Ar</strong>
            </div>
          )}

          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer le pret"}
          </button>
        </form>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </section>
    </div>
  );
}

function ListePage({ prets, setPrets }) {
  const [search, setSearch] = useState("");
  const [editPret, setEditPret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered = prets.filter((pret) =>
    pret.nom_client?.toLowerCase().includes(search.toLowerCase()) ||
    pret.nom_banque?.toLowerCase().includes(search.toLowerCase())
  );

  const supprimer = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/pre-bancaires/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setPrets(prets.filter((pret) => pret.id !== id));
        setToast({ message: "Pret supprime avec succes.", type: "success" });
      } else {
        setToast({ message: "Erreur lors de la suppression.", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Erreur de suppression.", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const modifier = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const montant_a_rembourser = Number(editPret.montant) * (1 + Number(editPret.taux) / 100);
      const response = await fetch(`/api/pre-bancaires/${editPret.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...editPret, montant_a_rembourser }),
      });
      const data = await response.json();
      if (response.ok) {
        setPrets(prets.map((pret) => pret.id === editPret.id ? data.pret : pret));
        setEditPret(null);
        setToast({ message: "Pret modifie avec succes.", type: "success" });
      } else {
        setToast({ message: "Erreur lors de la modification.", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Erreur de modification.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="slide-in">
      <section className="card dashboard-section">
        <div className="section-header liste-header">
          <h2>{filtered.length} pret{filtered.length > 1 ? "s" : ""} trouve{filtered.length > 1 ? "s" : ""}</h2>
          <label className="search-box">
            <Icon name="search" size={17} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher client ou banque..." />
          </label>
        </div>

        <div className="table-wrapper loan-table">
          <table>
            <thead>
              <tr>
                {["Client", "Banque", "Montant prete", "Taux", "A rembourser", "Date", "Duree", "Actions"].map((header) => <th key={header}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}><EmptyState label="Aucun pret trouve." /></td></tr>
              ) : filtered.map((pret) => (
                <tr key={pret.id}>
                  <td>{pret.nom_client}</td>
                  <td>{pret.nom_banque}</td>
                  <td className="money-positive">{formatNumber(pret.montant)} Ar</td>
                  <td><span className="rate-pill">{pret.taux}%</span></td>
                  <td className="money-purple">{formatNumber(pret.montant_a_rembourser)} Ar</td>
                  <td>{new Date(pret.date_du_pret).toLocaleDateString("fr-FR")}</td>
                  <td>{pret.duree} mois</td>
                  <td>
                    <div className="row-actions">
                      <button className="action-button edit" onClick={() => setEditPret({ ...pret })} type="button" title="Modifier">
                        <Icon name="edit" size={15} /> <span>Modifier</span>
                      </button>
                      <button className="action-button delete" onClick={() => setDeletingId(pret.id)} type="button" title="Supprimer">
                        <Icon name="trash" size={15} /> <span>Supprimer</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="loan-cards">
          {filtered.length === 0 ? <EmptyState label="Aucun pret trouve." /> : filtered.map((pret) => (
            <article key={pret.id} className="loan-card">
              <div>
                <h3>{pret.nom_client}</h3>
                <p>{pret.nom_banque}</p>
              </div>
              <dl>
                <div><dt>Montant</dt><dd>{formatNumber(pret.montant)} Ar</dd></div>
                <div><dt>Taux</dt><dd>{pret.taux}%</dd></div>
                <div><dt>A rembourser</dt><dd>{formatNumber(pret.montant_a_rembourser)} Ar</dd></div>
                <div><dt>Duree</dt><dd>{pret.duree} mois</dd></div>
              </dl>
              <div className="row-actions">
                <button className="action-button edit" onClick={() => setEditPret({ ...pret })} type="button"><Icon name="edit" size={15} /> Modifier</button>
                <button className="action-button delete" onClick={() => setDeletingId(pret.id)} type="button"><Icon name="trash" size={15} /> Supprimer</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deletingId && <DeleteModal onClose={() => setDeletingId(null)} onConfirm={() => supprimer(deletingId)} />}
      {editPret && <EditLoanModal editPret={editPret} setEditPret={setEditPret} modifier={modifier} loading={loading} />}
    </div>
  );
}

function DeleteModal({ onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card confirm-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-icon danger"><Icon name="trash" size={28} /></div>
        <h2>Supprimer le pret</h2>
        <p>Cette action est irreversible. Confirmez-vous la suppression ?</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} type="button">Annuler</button>
          <button className="btn-danger" onClick={onConfirm} type="button">Supprimer</button>
        </div>
      </div>
    </div>
  );
}

function EditLoanModal({ editPret, setEditPret, modifier, loading }) {
  const calculated = editPret.montant && editPret.taux
    ? Number(editPret.montant) * (1 + Number(editPret.taux) / 100)
    : null;

  return (
    <div className="modal-overlay" onClick={() => setEditPret(null)}>
      <div className="modal-card loan-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-heading">
          <div className="modal-icon"><Icon name="edit" size={22} /></div>
          <div>
            <p>Dossier pret</p>
            <h2>Modifier le pret</h2>
          </div>
          <button className="icon-button subtle" onClick={() => setEditPret(null)} type="button" aria-label="Fermer">
            <Icon name="close" />
          </button>
        </div>
        <form onSubmit={modifier} className="form-stack">
          <div className="form-grid">
            {[
              { label: "Nom client", key: "nom_client", type: "text" },
              { label: "Montant (Ar)", key: "montant", type: "number" },
              { label: "Taux (%)", key: "taux", type: "number", step: "0.1" },
              { label: "Date du pret", key: "date_du_pret", type: "date" },
              { label: "Duree (mois)", key: "duree", type: "number" },
            ].map((field) => (
              <label className="field" key={field.key}>
                <span>{field.label}</span>
                <input
                  className="input-field"
                  type={field.type}
                  value={editPret[field.key] || ""}
                  step={field.step}
                  onChange={(event) => setEditPret({ ...editPret, [field.key]: event.target.value })}
                  required
                />
              </label>
            ))}
            <label className="field">
              <span>Banque</span>
              <select className="input-field" value={editPret.nom_banque || ""} onChange={(event) => setEditPret({ ...editPret, nom_banque: event.target.value })} required>
                {!BANKS.includes(editPret.nom_banque) && editPret.nom_banque && <option value={editPret.nom_banque}>{editPret.nom_banque}</option>}
                {BANKS.map((bank) => <option key={bank} value={bank}>{bank}</option>)}
              </select>
            </label>
          </div>
          {calculated && (
            <div className="calculated-box">
              <span><Icon name="trend" size={17} /> Nouveau montant a rembourser</span>
              <strong>{formatNumber(calculated)} Ar</strong>
            </div>
          )}
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setEditPret(null)} type="button">Annuler</button>
            <button className="btn-submit inline" type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EmptyState({ label }) {
  return <div className="empty-state">{label}</div>;
}

function DashboardStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      * { box-sizing: border-box; }
      .dashboard-shell {
        --bg: #EEF4FF;
        --surface: #FFFFFF;
        --surface-soft: #F8FBFF;
        --text: #172033;
        --muted: #667085;
        --border: #DDE7F4;
        --primary: ${PRIMARY};
        --accent: ${ACCENT};
        --sidebar: #123C69;
        --sidebar-2: #0B2B4F;
        --shadow: 0 24px 60px rgba(18,60,105,0.12);
        min-height: 100vh;
        width: 100%;
        display: flex;
        overflow-x: hidden;
        background: radial-gradient(circle at top right, rgba(37,99,235,0.13), transparent 32%), var(--bg);
        color: var(--text);
        font-family: 'DM Sans', sans-serif;
      }
      .dashboard-dark {
        --bg: #0F172A;
        --surface: #172033;
        --surface-soft: #111827;
        --text: #E5EEF8;
        --muted: #9AA8BD;
        --border: #2C3A4F;
        --primary: #A8C7FF;
        --accent: #60A5FA;
        --sidebar: #0B1220;
        --sidebar-2: #111827;
        --shadow: 0 24px 60px rgba(0,0,0,0.32);
      }
      .loading-screen { align-items: center; justify-content: center; text-align: center; }
      .loading-brand, h1, h2 { font-family: 'Playfair Display', serif; }
      .loading-brand { color: var(--primary); font-size: 24px; font-weight: 900; margin-bottom: 8px; }
      .muted, .empty-state { color: var(--muted); }
      button, input, select { font: inherit; }
      button { cursor: pointer; }
      .sidebar {
        width: 250px;
        flex: 0 0 auto;
        min-height: 100vh;
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: column;
        background: linear-gradient(180deg, var(--sidebar), var(--sidebar-2));
        color: #fff;
        box-shadow: 8px 0 36px rgba(11,43,79,0.18);
        transition: width 0.25s ease, transform 0.25s ease;
        z-index: 20;
      }
      .sidebar.collapsed { width: 78px; }
      .brand-row { height: 76px; display: flex; align-items: center; gap: 12px; padding: 0 18px; border-bottom: 1px solid rgba(255,255,255,0.09); }
      .brand-mark { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; background: rgba(255,255,255,0.95); color: #123C69; }
      .brand-name { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 900; white-space: nowrap; }
      .sidebar-user { display: flex; align-items: center; gap: 11px; padding: 16px 18px; border: 0; border-bottom: 1px solid rgba(255,255,255,0.09); background: transparent; color: white; text-align: left; }
      .sidebar-user:hover { background: rgba(255,255,255,0.08); }
      .sidebar-user-text { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
      .sidebar-user-text strong { font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .sidebar-user-text small { color: rgba(255,255,255,0.62); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px; }
      .side-nav { flex: 1; display: flex; flex-direction: column; gap: 6px; padding: 16px 10px; }
      .sidebar-footer { padding: 14px 10px; border-top: 1px solid rgba(255,255,255,0.09); }
      .menu-item { width: 100%; min-height: 44px; display: flex; align-items: center; gap: 12px; border: 0; border-radius: 10px; padding: 11px 14px; background: transparent; color: rgba(255,255,255,0.72); text-align: left; transition: background 0.2s, color 0.2s, transform 0.2s; }
      .menu-item:hover, .menu-item.active { background: rgba(255,255,255,0.12); color: #fff; }
      .menu-item.active { box-shadow: inset 3px 0 0 #93C5FD; font-weight: 700; }
      .sidebar-toggle { position: absolute; top: 24px; right: -15px; width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); color: var(--primary); display: grid; place-items: center; box-shadow: var(--shadow); }
      .main-content { flex: 1; min-width: 0; padding: 30px; overflow: auto; }
      .dashboard-header { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 28px; }
      .header-title p { color: var(--muted); font-size: 13px; margin: 0 0 5px; text-transform: capitalize; }
      .header-title h1 { color: var(--primary); font-size: clamp(24px, 3vw, 34px); line-height: 1.08; margin: 0; }
      .header-actions { display: flex; align-items: center; gap: 10px; }
      .mobile-menu-button, .profile-trigger, .icon-button, .theme-toggle { border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 10px; }
      .mobile-menu-button { display: none; width: 42px; height: 42px; place-items: center; }
      .profile-trigger { padding: 3px; border-radius: 999px; }
      .theme-toggle { min-height: 42px; display: inline-flex; align-items: center; gap: 8px; padding: 0 14px; color: var(--muted); }
      .avatar { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; background: linear-gradient(135deg, var(--accent), #14B8A6); color: #fff; font-weight: 800; font-size: 13px; letter-spacing: 0.04em; }
      .avatar.small { width: 38px; height: 38px; background: rgba(255,255,255,0.16); }
      .avatar.large { width: 58px; height: 58px; font-size: 18px; }
      .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; box-shadow: 0 1px 0 rgba(255,255,255,0.04); }
      .slide-in { animation: slideIn 0.35s cubic-bezier(0.16,1,0.3,1); }
      @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      .bilan-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; margin-bottom: 24px; }
      .metric-card { border-left: 4px solid var(--metric); }
      .metric-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 14px; color: var(--muted); font-size: 12px; }
      .metric-icon { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; color: var(--metric); background: color-mix(in srgb, var(--metric) 12%, transparent); }
      .metric-card strong { display: block; color: var(--text); font-size: clamp(21px, 2vw, 28px); line-height: 1; font-weight: 900; font-family: 'Playfair Display', serif; word-break: break-word; }
      .metric-card small { display: block; color: var(--muted); margin-top: 5px; }
      .dashboard-section { margin-bottom: 24px; }
      .dashboard-section h2, .section-header h2 { margin: 0; color: var(--primary); font-size: 21px; font-weight: 900; }
      .section-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 22px; }
      .section-header.relaxed { align-items: flex-start; }
      .section-header p { margin: 7px 0 0; color: var(--muted); font-size: 14px; }
      .btn-submit, .btn-secondary, .btn-danger { min-height: 43px; border-radius: 10px; border: 0; padding: 0 18px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; transition: transform 0.2s, box-shadow 0.2s, background 0.2s; }
      .btn-submit { width: 100%; background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; }
      .btn-submit.inline { width: auto; }
      .btn-submit:hover, .btn-danger:hover { transform: translateY(-1px); box-shadow: 0 14px 26px rgba(37,99,235,0.22); }
      .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: none; }
      .btn-secondary { background: var(--surface-soft); color: var(--muted); border: 1px solid var(--border); }
      .btn-danger { background: ${DANGER}; color: white; }
      .graph-container { overflow-x: auto; padding-bottom: 8px; }
      .graph-bars { min-width: 620px; height: 230px; display: flex; align-items: flex-end; gap: 20px; padding: 8px 8px 0; }
      .bar-group { flex: 1; min-width: 58px; height: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; }
      .bars { flex: 1; width: 100%; display: flex; align-items: flex-end; gap: 5px; }
      .bar { flex: 1; min-height: 8px; border-radius: 7px 7px 0 0; }
      .bar.loan { background: linear-gradient(180deg, #38BDF8, #2563EB); }
      .bar.repay { background: linear-gradient(180deg, #A78BFA, #7C3AED); }
      .bar-group span, .legend, th, td { color: var(--muted); }
      .bar-group span { max-width: 76px; font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .legend { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; font-size: 12px; margin-top: 12px; }
      .legend span { display: inline-flex; align-items: center; gap: 7px; }
      .legend i { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
      .legend-blue { background: #2563EB; }
      .legend-purple { background: #7C3AED; }
      .table-wrapper { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
      table { width: 100%; border-collapse: collapse; min-width: 760px; }
      .compact table { min-width: 560px; }
      th { background: var(--surface-soft); font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; text-align: left; font-weight: 800; padding: 13px 14px; white-space: nowrap; }
      td { border-top: 1px solid var(--border); padding: 14px; font-size: 14px; }
      tbody tr { transition: background 0.2s; }
      tbody tr:hover { background: var(--surface-soft); }
      td:first-child { color: var(--text); font-weight: 700; }
      .money-positive { color: ${SUCCESS}; font-weight: 800; }
      .money-warning { color: ${WARNING}; font-weight: 800; }
      .money-purple { color: #8B5CF6; font-weight: 800; }
      .rate-pill { display: inline-flex; align-items: center; border-radius: 999px; padding: 4px 10px; color: var(--accent); background: color-mix(in srgb, var(--accent) 13%, transparent); font-size: 12px; font-weight: 800; }
      .row-actions { display: flex; gap: 8px; flex-wrap: wrap; }
      .action-button { min-height: 34px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; border-radius: 9px; padding: 0 11px; font-size: 12px; font-weight: 800; border: 1px solid transparent; }
      .action-button.edit { color: var(--accent); background: color-mix(in srgb, var(--accent) 11%, transparent); border-color: color-mix(in srgb, var(--accent) 20%, transparent); }
      .action-button.delete { color: ${DANGER}; background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.18); }
      .search-box { display: flex; align-items: center; gap: 8px; min-height: 44px; width: min(330px, 100%); padding: 0 13px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-soft); color: var(--muted); }
      .search-box input { width: 100%; border: 0; outline: 0; background: transparent; color: var(--text); }
      .form-page { max-width: 760px; margin: 0 auto; }
      .form-stack { display: flex; flex-direction: column; gap: 18px; }
      .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
      .field { display: flex; flex-direction: column; gap: 7px; }
      .field span { color: var(--primary); font-size: 11px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
      .input-field { width: 100%; min-height: 44px; border: 1.5px solid var(--border); border-radius: 10px; outline: 0; padding: 0 13px; color: var(--text); background: var(--surface-soft); transition: border 0.2s, box-shadow 0.2s, background 0.2s; }
      .input-field:focus { border-color: var(--accent); background: var(--surface); box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 14%, transparent); }
      .calculated-box { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 15px 16px; border-radius: 12px; border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border)); background: color-mix(in srgb, var(--accent) 9%, var(--surface)); }
      .calculated-box span { display: inline-flex; align-items: center; gap: 8px; color: var(--muted); font-size: 13px; }
      .calculated-box strong { color: var(--primary); font-size: 18px; font-family: 'Playfair Display', serif; }
      .toast { display: flex; align-items: center; gap: 10px; margin-top: 16px; padding: 13px 14px; border-radius: 10px; font-size: 14px; font-weight: 700; }
      .toast span { flex: 1; }
      .toast-success { color: #15803D; background: #ECFDF3; border: 1px solid #BBF7D0; }
      .toast-error { color: #DC2626; background: #FEF2F2; border: 1px solid #FECACA; }
      .modal-overlay { position: fixed; inset: 0; z-index: 60; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(8,19,37,0.58); backdrop-filter: blur(6px); }
      .modal-card { width: min(100%, 620px); max-height: min(92vh, 760px); overflow-y: auto; background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: 16px; padding: 24px; box-shadow: var(--shadow); animation: slideIn 0.25s ease; }
      .confirm-modal { max-width: 430px; text-align: center; }
      .loan-modal { max-width: 680px; }
      .modal-heading { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
      .modal-heading > div:nth-child(2) { flex: 1; min-width: 0; }
      .modal-heading p { margin: 0 0 4px; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 800; }
      .modal-heading h2, .confirm-modal h2 { margin: 0; color: var(--primary); font-size: 23px; }
      .confirm-modal p { color: var(--muted); line-height: 1.7; margin: 10px 0 24px; }
      .modal-icon { width: 48px; height: 48px; margin: 0 auto 15px; border-radius: 14px; display: grid; place-items: center; color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, transparent); }
      .modal-icon.danger { color: ${DANGER}; background: rgba(239,68,68,0.12); }
      .modal-actions { display: flex; justify-content: flex-end; gap: 12px; flex-wrap: wrap; }
      .icon-button { width: 38px; height: 38px; display: grid; place-items: center; }
      .icon-button.subtle { background: var(--surface-soft); color: var(--muted); }
      .empty-state { width: 100%; text-align: center; padding: 34px 16px; font-size: 14px; }
      .loan-cards { display: none; }
      .mobile-scrim { display: none; }
      @media (max-width: 1180px) {
        .bilan-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .main-content { padding: 24px; }
      }
      @media (max-width: 820px) {
        .dashboard-shell { display: block; }
        .sidebar { position: fixed; inset: 0 auto 0 0; width: min(84vw, 300px); transform: translateX(-105%); }
        .sidebar.collapsed { width: min(84vw, 300px); }
        .sidebar.mobile-open { transform: translateX(0); }
        .sidebar-toggle { display: none; }
        .brand-name, .sidebar-user-text, .menu-item span { display: inline; }
        .mobile-scrim { display: block; position: fixed; inset: 0; z-index: 15; background: rgba(8,19,37,0.42); border: 0; }
        .main-content { padding: 18px; }
        .mobile-menu-button { display: grid; }
        .dashboard-header { align-items: flex-start; }
        .header-title { flex: 1; min-width: 0; }
        .header-actions { margin-left: auto; }
        .theme-toggle span { display: none; }
        .section-header, .liste-header { align-items: stretch; flex-direction: column; }
        .btn-submit.inline, .search-box { width: 100%; }
        .bilan-grid { grid-template-columns: 1fr; }
        .form-grid { grid-template-columns: 1fr; }
        .calculated-box { align-items: flex-start; flex-direction: column; }
        .modal-card { width: 100%; border-radius: 14px; padding: 20px; }
      }
      @media (max-width: 640px) {
        .main-content { padding: 14px; }
        .dashboard-header { gap: 10px; margin-bottom: 20px; }
        .header-actions { gap: 7px; }
        .card { padding: 17px; border-radius: 10px; }
        .dashboard-section h2, .section-header h2 { font-size: 19px; }
        .loan-table { display: none; }
        .loan-cards { display: grid; gap: 12px; }
        .loan-card { border: 1px solid var(--border); background: var(--surface-soft); border-radius: 12px; padding: 15px; }
        .loan-card h3 { margin: 0; color: var(--text); font-size: 16px; }
        .loan-card p { margin: 4px 0 14px; color: var(--muted); font-size: 13px; }
        .loan-card dl { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 0 0 14px; }
        .loan-card dt { color: var(--muted); font-size: 11px; text-transform: uppercase; font-weight: 800; }
        .loan-card dd { margin: 3px 0 0; color: var(--text); font-weight: 800; font-size: 13px; }
        .row-actions { display: grid; grid-template-columns: 1fr 1fr; width: 100%; }
        .modal-actions { display: grid; grid-template-columns: 1fr; }
        .modal-heading { align-items: flex-start; }
      }
      @media (max-width: 430px) {
        .main-content { padding: 12px; }
        .header-title h1 { font-size: 23px; }
        .avatar { width: 38px; height: 38px; }
        .metric-card strong { font-size: 22px; }
        .loan-card dl { grid-template-columns: 1fr; }
        .row-actions { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}
