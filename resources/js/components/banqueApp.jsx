import { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import Dashboard from './dashboard';
 
const PRIMARY = "#0A2463";
const ACCENT = "#1B4FD8";
const LIGHT = "#E8EEFF";
 
/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { overflow-x: hidden; }
 
    .btn-primary {
      background: white; color: ${PRIMARY};
      border: none; padding: 13px 32px;
      font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px;
      letter-spacing: 0.04em; cursor: pointer; transition: all 0.25s;
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    }
    .btn-primary:hover { background: ${LIGHT}; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(10,36,99,0.25); }
 
    .btn-outline {
      background: transparent; color: white;
      border: 1.5px solid rgba(255,255,255,0.45); padding: 13px 32px;
      font-family: 'DM Sans', sans-serif; font-weight: 400; font-size: 14px;
      letter-spacing: 0.04em; cursor: pointer; transition: all 0.25s;
    }
    .btn-outline:hover { border-color: white; background: rgba(255,255,255,0.1); }
 
    .btn-dark {
      background: ${PRIMARY}; color: white;
      border: none; padding: 14px 0; width: 100%;
      font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
      letter-spacing: 0.05em; cursor: pointer; transition: all 0.3s;
      clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    }
    .btn-dark:hover { background: ${ACCENT}; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(10,36,99,0.35); }
    .btn-dark:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
 
    .nav-link {
      color: white; text-decoration: none;
      font-family: 'DM Sans', sans-serif; font-size: 14px;
      letter-spacing: 0.05em; opacity: 0.8; transition: opacity 0.2s;
      cursor: pointer; background: none; border: none;
    }
    .nav-link:hover { opacity: 1; }
    .nav-link.active { opacity: 1; font-weight: 600; border-bottom: 2px solid white; padding-bottom: 2px; }
 
    .input-field {
      width: 100%; padding: 13px 16px;
      border: 1.5px solid #E2E8F0; outline: none;
      font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1E293B;
      background: #F8FAFF; transition: all 0.25s; border-radius: 2px;
    }
    .input-field:focus { border-color: ${ACCENT}; background: white; box-shadow: 0 0 0 4px rgba(27,79,216,0.08); }
    .input-field::placeholder { color: #94A3B8; }
 
    .service-card {
      background: white; border: 1px solid #E2E8F0; padding: 32px 24px;
      cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden;
    }
    .service-card::after {
      content: ''; position: absolute; bottom: 0; left: 0;
      width: 0; height: 3px; background: ${ACCENT}; transition: width 0.3s;
    }
    .service-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(10,36,99,0.12); }
    .service-card:hover::after { width: 100%; }
 
    .floating { animation: float 6s ease-in-out infinite; }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
 
    .slide-in { animation: slideIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
 
    .hero-line { display: block; overflow: hidden; }
    .hero-line span { display: block; animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; transform: translateY(50px); }
    .hero-line:nth-child(2) span { animation-delay: 0.15s; }
    .hero-line:nth-child(3) span { animation-delay: 0.3s; }
    @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
 
    .fade-in { animation: fadeIn 1s ease 0.4s forwards; opacity: 0; }
    @keyframes fadeIn { to { opacity: 1; } }
 
    .grid-bg {
      background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 40px 40px;
    }
 
    .stat-card { text-align: center; padding: 20px 28px; border-left: 1px solid rgba(255,255,255,0.12); transition: background 0.3s; }
    .stat-card:first-child { border-left: none; }
    .stat-card:hover { background: rgba(255,255,255,0.05); }
 
    .auth-panel { display: flex; }
    @media (max-width: 768px) {
      .auth-panel { display: none !important; }
      .hero-flex { flex-direction: column !important; }
      .card-mockup { display: none !important; }
      .stats-row { flex-direction: column !important; }
      .stat-card { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.12); }
      .services-grid { grid-template-columns: 1fr 1fr !important; }
      .form-row { flex-direction: column !important; }
    }
  `}</style>
);
 
/* ─────────────────────────────────────────
   NAVBAR
───────────────────────────────────────── */
function Navbar({ page, setPage, activeSection, setActiveSection }) {
  const [scrolled, setScrolled] = useState(false);
 
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
 
  const scrollTo = (sectionId, sectionKey) => {
    setPage("home");
    setActiveSection(sectionKey);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
 
  const navLinks = [
    { label: "Accueil", id: "section-accueil", key: "accueil" },
    { label: "Services", id: "section-services", key: "services" },
    { label: "À propos", id: "section-apropos", key: "apropos" },
  ];
 
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled || page !== "home" ? PRIMARY : "transparent",
      transition: "background 0.4s, box-shadow 0.4s",
      boxShadow: scrolled || page !== "home" ? "0 4px 24px rgba(10,36,99,0.3)" : "none",
      padding: "0 40px", display: "flex", alignItems: "center",
      justifyContent: "space-between", height: 70,
    }}>
      {/* Logo */}
      <div onClick={() => { setPage("home"); setActiveSection("accueil"); }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <div style={{ width: 34, height: 34, background: "white", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: PRIMARY, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 17 }}>B</span>
        </div>
        <span style={{ color: "white", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 19 }}>BanqueApp</span>
      </div>
 
      {/* Liens */}
      <div style={{ display: "flex", gap: 36 }}>
        {navLinks.map(l => (
          <button
            key={l.key}
            className={`nav-link ${activeSection === l.key && page === "home" ? "active" : ""}`}
            onClick={() => scrollTo(l.id, l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>
 
      {/* Boutons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn-outline" onClick={() => setPage("login")}>Connexion</button>
        <button className="btn-primary" onClick={() => setPage("signup")}>Ouvrir un compte</button>
      </div>
    </nav>
  );
}
 
/* ─────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────── */
const services = [
  { icon: "📋", title: "Gestion des prêts", desc: "Enregistrez et suivez tous les dossiers de prêts pré-bancaires de vos clients en un seul endroit." },
  { icon: "📊", title: "Bilan & Statistiques", desc: "Visualisez vos données avec des graphes clairs : montants prêtés, intérêts, remboursements." },
  { icon: "🏦", title: "Multi-banques", desc: "Gérez des prêts issus de plusieurs banques partenaires depuis une seule interface." },
  { icon: "🔒", title: "Sécurité des données", desc: "Vos données sont protégées par un système d'authentification sécurisé et chiffré." },
];
 
const stats = [
  { value: "100%", label: "Sécurisé" },
  { value: "Multi", label: "Banques supportées" },
  { value: "24/7", label: "Accès disponible" },
  { value: "Auto", label: "Calcul des intérêts" },
];
 
function HomePage({ setPage }) {
  const [hovered, setHovered] = useState(null);
 
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
 
      {/* ── HERO ── */}
      <section id="section-accueil" className="grid-bg" style={{
        background: `linear-gradient(135deg, ${PRIMARY} 0%, #0D3180 55%, ${ACCENT} 100%)`,
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "120px 40px 80px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -120, right: -120, width: 520, height: 520, borderRadius: "50%", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 380, height: 380, borderRadius: "50%", background: "rgba(255,255,255,0.025)" }} />
 
        <div className="hero-flex" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1160, margin: "0 auto", width: "100%", gap: 60 }}>
          {/* Texte */}
          <div style={{ flex: 1 }}>
            <div className="fade-in" style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", padding: "5px 14px", marginBottom: 26, borderRadius: 2 }}>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Plateforme de gestion pré-bancaire
              </span>
            </div>
 
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 54, color: "white", lineHeight: 1.1, marginBottom: 26, fontWeight: 900 }}>
              <span className="hero-line"><span>Gérez vos prêts</span></span>
              <span className="hero-line"><span style={{ color: "#A8C4FF" }}>pré-bancaires</span></span>
              <span className="hero-line"><span>simplement.</span></span>
            </h1>
 
            <p className="fade-in" style={{ color: "rgba(255,255,255,0.68)", fontSize: 15, lineHeight: 1.8, maxWidth: 460, marginBottom: 38, fontWeight: 300 }}>
              BanqueApp vous permet de gérer, suivre et analyser tous vos dossiers de prêts pré-bancaires en temps réel, avec un calcul automatique des intérêts.
            </p>
 
            <div className="fade-in" style={{ display: "flex", gap: 14 }}>
              <button className="btn-primary" style={{ fontSize: 15, padding: "14px 36px" }} onClick={() => setPage("signup")}>
                Commencer gratuitement →
              </button>
              <button className="btn-outline" style={{ fontSize: 15, padding: "14px 36px" }} onClick={() => setPage("login")}>
                Se connecter
              </button>
            </div>
          </div>
 
          {/* Mockup */}
          <div className="floating card-mockup">
            <div style={{
              width: 320, height: 200,
              background: "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 100%)",
              border: "1px solid rgba(255,255,255,0.18)", borderRadius: 14, padding: 26,
              backdropFilter: "blur(10px)", position: "relative",
              boxShadow: "0 32px 64px rgba(0,0,0,0.28)",
            }}>
              <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }} />
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Total prêts actifs</div>
              <div style={{ color: "white", fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, marginBottom: 20 }}>2 550 000 Ar</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginBottom: 3 }}>Prêts en cours</div>
                  <div style={{ color: "#86EFAC", fontSize: 15, fontWeight: 700 }}>4 dossiers</div>
                </div>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginBottom: 3 }}>Intérêts totaux</div>
                  <div style={{ color: "#FCA5A5", fontSize: 15, fontWeight: 700 }}>152 000 Ar</div>
                </div>
              </div>
            </div>
 
            <div style={{
              marginTop: 14, background: "rgba(255,255,255,0.09)",
              border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10,
              padding: "11px 18px", display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>✅</span>
              <div>
                <div style={{ color: "white", fontSize: 12, fontWeight: 500 }}>Nouveau prêt enregistré</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>Rakoto Jean • 500 000 Ar • 5%</div>
              </div>
            </div>
          </div>
        </div>
 
        {/* Stats */}
        <div className="stats-row" style={{ maxWidth: 1160, margin: "56px auto 0", width: "100%", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 36, display: "flex" }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card" style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: "white", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
 
      {/* ── SERVICES ── */}
      <section id="section-services" style={{ padding: "90px 40px", background: "#F8FAFF" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-block", background: LIGHT, color: ACCENT, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", padding: "5px 14px", marginBottom: 18, border: `1px solid rgba(27,79,216,0.15)` }}>
              Nos fonctionnalités
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, color: PRIMARY, fontWeight: 900 }}>
              Tout pour gérer vos prêts pré-bancaires
            </h2>
            <p style={{ color: "#64748B", fontSize: 15, marginTop: 14, maxWidth: 500, margin: "14px auto 0", lineHeight: 1.7 }}>
              Une plateforme complète dédiée à la gestion des dossiers de prêts pré-bancaires.
            </p>
          </div>
 
          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {services.map((s, i) => (
              <div key={i} className="service-card" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <div style={{ fontSize: 34, marginBottom: 18 }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: PRIMARY, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7, fontWeight: 300 }}>{s.desc}</p>
                <div style={{ marginTop: 20, color: ACCENT, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
                  En savoir plus <span style={{ transition: "transform 0.2s", transform: hovered === i ? "translateX(5px)" : "none" }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── À PROPOS ── */}
      <section id="section-apropos" style={{ padding: "90px 40px", background: "white" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", alignItems: "center", gap: 80 }}>
          {/* Texte */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-block", background: LIGHT, color: ACCENT, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", padding: "5px 14px", marginBottom: 18, border: `1px solid rgba(27,79,216,0.15)` }}>
              À propos
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, color: PRIMARY, fontWeight: 900, marginBottom: 20, lineHeight: 1.2 }}>
              Qu'est-ce qu'un prêt pré-bancaire ?
            </h2>
            <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>
              Un prêt pré-bancaire est un crédit accordé à des personnes qui n'ont pas encore accès aux services bancaires traditionnels. Il s'agit d'une étape intermédiaire vers l'intégration financière formelle.
            </p>
            <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.9, marginBottom: 32 }}>
              BanqueApp vous aide à gérer ces dossiers efficacement : enregistrement des clients, calcul automatique des intérêts, suivi des remboursements et génération de bilans.
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              {[
                { value: "Simple", label: "Prise en main rapide" },
                { value: "Fiable", label: "Calculs automatiques" },
                { value: "Complet", label: "Suivi intégral" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: PRIMARY, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ color: "#94A3B8", fontSize: 13 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
 
          {/* Visuel */}
          <div style={{ flex: "0 0 380px" }}>
            <div style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${ACCENT} 100%)`, borderRadius: 16, padding: 32, color: "white" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Comment ça marche ?</div>
              {[
                { num: "01", title: "Inscription", desc: "Créez votre compte administrateur en quelques minutes." },
                { num: "02", title: "Ajout de prêts", desc: "Enregistrez les dossiers de prêts avec tous les détails." },
                { num: "03", title: "Suivi & Bilan", desc: "Visualisez vos données et générez des rapports." },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < 2 ? 20 : 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{s.num}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      {/* ── CTA ── */}
      <section style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${ACCENT} 100%)`, padding: "72px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: "white", fontWeight: 900, marginBottom: 14 }}>
            Prêt à gérer vos dossiers ?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, marginBottom: 32, lineHeight: 1.7 }}>
            Créez votre compte administrateur et commencez à gérer vos prêts pré-bancaires dès aujourd'hui.
          </p>
          <button className="btn-primary" style={{ fontSize: 15, padding: "15px 48px" }} onClick={() => setPage("signup")}>
            Créer mon compte →
          </button>
        </div>
      </section>
 
      {/* ── FOOTER ── */}
      <footer style={{ background: PRIMARY, padding: "36px 40px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>BanqueApp</div>
        <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 12 }}>© 2026 BanqueApp — Plateforme de gestion pré-bancaire. Tous droits réservés.</div>
      </footer>
    </div>
  );
}
 
/* ─────────────────────────────────────────
   AUTH LAYOUT
───────────────────────────────────────── */
function AuthLayout({ children, title, subtitle, setPage }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", paddingTop: 70 }}>
      <div className="auth-panel" style={{
        flex: "0 0 42%",
        background: `linear-gradient(160deg, ${PRIMARY} 0%, #0D3180 50%, ${ACCENT} 100%)`,
        flexDirection: "column", justifyContent: "center",
        padding: "60px 52px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
 
        <div onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 60, cursor: "pointer" }}>
          <div style={{ width: 32, height: 32, background: "white", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: PRIMARY, fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 16 }}>B</span>
          </div>
          <span style={{ color: "white", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18 }}>BanqueApp</span>
        </div>
 
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: "white", fontWeight: 900, lineHeight: 1.2, marginBottom: 18, position: "relative" }}>{title}</h2>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.8, maxWidth: 340, position: "relative" }}>{subtitle}</p>
 
        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
          {["Calcul automatique des intérêts", "Suivi des prêts en temps réel", "Bilan et statistiques intégrés"].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", flexShrink: 0 }}>✓</div>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
 
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFF", padding: "40px 60px" }}>
        <div className="slide-in" style={{ width: "100%", maxWidth: 480 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
 
/* ─────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────── */
function LoginPage({ setPage }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setPage('dashboard');
      } else {
        setError(data.message || 'Email ou mot de passe incorrect');
      }
    } catch (e) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <AuthLayout title="Bon retour parmi nous." subtitle="Connectez-vous à votre espace de gestion pré-bancaire." setPage={setPage}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "inline-block", background: LIGHT, color: ACCENT, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", padding: "4px 12px", marginBottom: 14, border: `1px solid rgba(27,79,216,0.18)` }}>Connexion</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: PRIMARY, fontWeight: 900, marginBottom: 6 }}>Se connecter</h1>
        <p style={{ color: "#64748B", fontSize: 14 }}>Pas encore de compte ? <button onClick={() => setPage("signup")} style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>S'inscrire</button></p>
      </div>
 
      {error && (
        <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: 6, padding: "10px 14px", marginBottom: 20, color: "#EF4444", fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}
 
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7 }}>Adresse email</label>
          <input className="input-field" type="email" name="email" placeholder="exemple@email.com" value={form.email} onChange={handle} required />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: PRIMARY, letterSpacing: "0.06em", textTransform: "uppercase" }}>Mot de passe</label>
            <button type="button" style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Mot de passe oublié ?</button>
          </div>
          <div style={{ position: "relative" }}>
            <input className="input-field" type={showPass ? "text" : "password"} name="password" placeholder="••••••••" value={form.password} onChange={handle} required style={{ paddingRight: 44 }} />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94A3B8" }}>
              {showPass ? "🙈" : "👁"}
            </button>
          </div>
        </div>
        <button className="btn-dark" type="submit" disabled={loading}>
          {loading ? "Connexion en cours..." : "Se connecter →"}
        </button>
      </form>
    </AuthLayout>
  );
}
 
/* ─────────────────────────────────────────
   SIGN UP PAGE
───────────────────────────────────────── */
const BANQUES = [
  "BFV Société Générale",
  "BOA Madagascar",
  "Accès Banque Madagascar",
  "MCB Madagascar",
  "BNI Madagascar",
  "Société Générale Madagascar",
  "Autre",
];
 
function SignUpPage({ setPage }) {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [emailError, setEmailError] = useState('');
  const [emailChecking, setEmailChecking] = useState(false);
  const [error, setError] = useState("");
 
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  const checkEmail = async (email) => {
    if (!email || !email.includes('@')) return;
    setEmailChecking(true);
    try {
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setEmailError(data.exists ? 'Cet email est déjà utilisé !' : '');
    } catch (e) {
      setEmailError('');
    } finally {
      setEmailChecking(false);
    }
  };
 
  const strength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strengthLabel = ["", "Faible", "Moyen", "Bon", "Fort"];
  const strengthColor = ["", "#EF4444", "#F59E0B", "#3B82F6", "#16A34A"];
  const s = strength();
 
  const nextStep = () => {
    if (!form.nom || !form.prenom || !form.email || !form.telephone) {
      setError("Veuillez remplir tous les champs !");
      return;
    }
    if (emailError) { setError("Corrigez l'email avant de continuer !"); return; }
    setError("");
    setStep(2);
  };
 
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          telephone: form.telephone,
          password: form.password,
          password_confirmation: form.confirm,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setPage('dashboard');
      } else {
        if (data.errors?.email) setError('Cet email est déjà utilisé !');
        else if (data.errors?.password) setError('Le mot de passe doit contenir au moins 8 caractères !');
        else setError(data.message || "Erreur lors de l'inscription");
      }
    } catch (e) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <AuthLayout title="Créez votre espace." subtitle="Gérez vos dossiers de prêts pré-bancaires depuis une plateforme sécurisée." setPage={setPage}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "inline-block", background: LIGHT, color: ACCENT, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", padding: "4px 12px", marginBottom: 14, border: `1px solid rgba(27,79,216,0.18)` }}>Inscription</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: PRIMARY, fontWeight: 900, marginBottom: 6 }}>Créer un compte</h1>
        <p style={{ color: "#64748B", fontSize: 14 }}>Déjà inscrit ? <button onClick={() => setPage("login")} style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Se connecter</button></p>
      </div>
 
      {/* Steps */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        {[1, 2].map((n, i) => (
          <div key={n} style={{ display: "flex", alignItems: "center", flex: i === 0 ? 1 : "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: step >= n ? PRIMARY : "#E2E8F0", color: step >= n ? "white" : "#94A3B8", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{n}</div>
            {i === 0 && <div style={{ flex: 1, height: 2, background: step >= 2 ? PRIMARY : "#E2E8F0", transition: "background 0.3s", margin: "0 8px" }} />}
          </div>
        ))}
        <span style={{ marginLeft: 10, fontSize: 12, color: "#64748B" }}>
          {step === 1 ? "Informations personnelles" : "Sécurité du compte"}
        </span>
      </div>
 
      {error && (
        <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: 6, padding: "10px 14px", marginBottom: 16, color: "#EF4444", fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}
 
      {/* ÉTAPE 1 */}
      {step === 1 && (
        <div className="slide-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-row" style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Nom *</label>
              <input className="input-field" type="text" name="nom" placeholder="Rakoto" value={form.nom} onChange={handle} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Prénom *</label>
              <input className="input-field" type="text" name="prenom" placeholder="Jean" value={form.prenom} onChange={handle} required />
            </div>
          </div>
 
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Adresse email *</label>
            <input
              className="input-field" type="email" name="email"
              placeholder="jean.rakoto@email.com" value={form.email}
              onChange={handle} onBlur={(e) => checkEmail(e.target.value)}
              required style={{ borderColor: emailError ? "#EF4444" : undefined }}
            />
            {emailChecking && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>⏳ Vérification...</div>}
            {emailError && <div style={{ fontSize: 11, color: "#EF4444", marginTop: 4 }}>⚠️ {emailError}</div>}
          </div>
 
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Téléphone *</label>
              <input
                className="input-field"
                type="tel"
                name="telephone"
                placeholder="034 00 000 00"
                value={form.telephone}
                onChange={(e) => {
                  const valeur = e.target.value.replace(/[^0-9]/g, '');
                  setForm({ ...form, telephone: valeur });
                }}
                required
              />          
          </div>
  
          <button type="button" className="btn-dark" style={{ marginTop: 4 }} onClick={nextStep}>
            Continuer →
          </button>
        </div>
      )}
 
      {/* ÉTAPE 2 */}
      {step === 2 && (
        <form onSubmit={submit} className="slide-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Mot de passe *</label>
            <div style={{ position: "relative" }}>
              <input className="input-field" type={showPass ? "text" : "password"} name="password" placeholder="Min. 8 caractères" value={form.password} onChange={handle} required style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94A3B8" }}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
            {form.password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= s ? strengthColor[s] : "#E2E8F0", transition: "background 0.3s" }} />)}
                </div>
                <div style={{ fontSize: 11, color: strengthColor[s], fontWeight: 500 }}>Force : {strengthLabel[s]}</div>
              </div>
            )}
          </div>
 
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: PRIMARY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Confirmer le mot de passe *</label>
            <input className="input-field" type="password" name="confirm" placeholder="••••••••" value={form.confirm} onChange={handle} required
              style={{ borderColor: form.confirm && form.confirm !== form.password ? "#EF4444" : form.confirm && form.confirm === form.password ? "#16A34A" : undefined }} />
            {form.confirm && form.confirm !== form.password && <div style={{ fontSize: 11, color: "#EF4444", marginTop: 4 }}>⚠️ Les mots de passe ne correspondent pas</div>}
            {form.confirm && form.confirm === form.password && <div style={{ fontSize: 11, color: "#16A34A", marginTop: 4 }}>✅ Les mots de passe correspondent</div>}
          </div>
 
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <input type="checkbox" id="terms" required style={{ accentColor: ACCENT, width: 16, height: 16, marginTop: 2 }} />
            <label htmlFor="terms" style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>
              J'accepte les <button type="button" style={{ color: ACCENT, background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>conditions d'utilisation</button>
            </label>
          </div>
 
          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" onClick={() => setStep(1)} style={{ flex: "0 0 auto", padding: "14px 20px", background: "white", border: `1.5px solid ${PRIMARY}`, color: PRIMARY, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              ← Retour
            </button>
            <button className="btn-dark" type="submit" disabled={loading || form.password !== form.confirm} style={{ flex: 1 }}>
              {loading ? "Création en cours..." : "Créer mon compte →"}
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
 
/* ─────────────────────────────────────────
   APP ROOT
───────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? 'dashboard' : 'home';
  });
  const [activeSection, setActiveSection] = useState("accueil");
 
  useEffect(() => { window.scrollTo(0, 0); }, [page]);
 
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setPage('home');
  };
 
  return (
    <>
      <GlobalStyles />
      {page !== "dashboard" && <Navbar page={page} setPage={setPage} activeSection={activeSection} setActiveSection={setActiveSection} />}
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "login" && <LoginPage setPage={setPage} />}
      {page === "signup" && <SignUpPage setPage={setPage} />}
      {page === "dashboard" && <Dashboard setPage={setPage} logout={logout} />}
    </>
  );
}