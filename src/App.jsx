
import './App.css';

import { useState, useEffect, useRef } from "react";
import Dashboard from "./components/Dashboard";

// ─── Nav links & landing data ─────────────────────────────────────────────────
const NAV_LINKS = ["Product", "Docs", "Changelog", "Pricing"];

const STATS = [
  { value: "14ms",  label: "Avg. response latency" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "3.2M",  label: "Intents resolved" },
  { value: "40+",   label: "Language runtimes" },
];

const FEATURES = [
  {
    icon: <svg viewBox="0 0 20 20" fill="none" width="17" height="17"><path d="M3 5h14M3 10h9M3 15h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="16" cy="14" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M18.5 16.5l1.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
    title: "Semantic Intent Graph",
    desc: "Visualize every code change as a dependency graph. Understand exactly what breaks before it does.",
  },
  {
    icon: <svg viewBox="0 0 20 20" fill="none" width="17" height="17"><polyline points="4,14 8,8 12,11 16,5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="1" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.2" opacity="0.35"/></svg>,
    title: "Live Session Tracking",
    desc: "Monitor every agent run in real time. Drill into sub-calls, errors fixed, and session risk in one unified sidebar.",
  },
  {
    icon: <svg viewBox="0 0 20 20" fill="none" width="17" height="17"><path d="M10 2L3 6v4c0 4.4 3 8.5 7 9.5 4-1 7-5.1 7-9.5V6L10 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: "Risk Surface Detection",
    desc: "Automatic high-risk flagging on public API changes, schema mutations, and cross-service boundaries.",
  },
  {
    icon: <svg viewBox="0 0 20 20" fill="none" width="17" height="17"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.3"/><path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: "Time-Travel Debugging",
    desc: "Replay any session state from any point in time. Pinpoint the exact intent that introduced a regression.",
  },
  {
    icon: <svg viewBox="0 0 20 20" fill="none" width="17" height="17"><rect x="2" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="11" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="2" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="11" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" opacity="0.3"/></svg>,
    title: "Atomic Node Decomposition",
    desc: "Break complex intents into atomic, independently-reviewable nodes. Ship with surgical precision.",
  },
  {
    icon: <svg viewBox="0 0 20 20" fill="none" width="17" height="17"><rect x="1" y="1" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.2" opacity="0.35"/><path d="M6 10l2.5 2.5L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: "Native IDE Integration",
    desc: "First-class plugins for VS Code, JetBrains, and Neovim. The dashboard lives exactly where you code.",
  },
];

// ─── Grid background ──────────────────────────────────────────────────────────
function GridBg() {
  return (
    <div className="grid-bg" aria-hidden>
      <div className="grid-lines" />
      <div className="grid-fade-t" />
      <div className="grid-fade-b" />
      <div className="glow-orb go-1" />
      <div className="glow-orb go-2" />
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onLaunch }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="landing">

      {/* ── Nav ── */}
      <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-brand">
            <LogoIcon />
            <span className="wordmark">JavaAI</span>
          </div>
          <div className="nav-links">
            {NAV_LINKS.map((l) => <a key={l} className="nav-link" href="#">{l}</a>)}
          </div>
          <div className="nav-end">
            <a className="nav-link" href="#">Sign in</a>
            {/* ↓ This opens the Dashboard */}
            <button className="btn-primary" onClick={onLaunch}>
              Open app
              <svg viewBox="0 0 14 14" fill="none" width="12" height="12">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <GridBg />
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="badge-pip" />
            Now in public beta
            <span className="badge-sep">—</span>
            <a href="#" className="badge-link">Read the launch post ↗</a>
          </div>

          <h1 className="hero-h1">
            The AI agent<br />
            <span className="grad-text">observability layer</span><br />
            for your codebase.
          </h1>

          <p className="hero-sub">
            JavaAI tracks every intent, dependency, and risk surface your AI agents
            touch in real time — so you ship with confidence, not guesswork.
          </p>

          <div className="hero-cta">
            <button className="btn-primary btn-lg" onClick={onLaunch}>
              Launch dashboard
              <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <a className="btn-ghost btn-lg" href="#">
              <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5.5 5l4 2-4 2V5z" fill="currentColor"/>
              </svg>
              Watch demo
            </a>
          </div>

          <p className="hero-fine">No credit card required · Works with any LLM runtime</p>
        </div>

        {/* Dashboard preview */}
        <div className="hero-preview" onClick={onLaunch} title="Open dashboard">
          <div className="preview-bar">
            <span className="preview-dot pd-r" /><span className="preview-dot pd-y" /><span className="preview-dot pd-g" />
            <span className="preview-url">app.javaai.dev/dashboard</span>
            <span className="preview-hint">Click to open →</span>
          </div>
          <div className="preview-screen">
            <MiniDashboard />
          </div>
          <div className="preview-vignette" />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="stats-bar">
        <div className="stats-inner">
          {STATS.map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-val">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section className="features-section">
        <div className="section-wrap">
          <div className="eyebrow">
            <span className="eyebrow-rule" />Capabilities<span className="eyebrow-rule" />
          </div>
          <h2 className="section-h2">
            Everything you need to understand<br />
            <span className="grad-text">what your agents are doing.</span>
          </h2>
          <p className="section-sub">
            Built for teams shipping AI-native products who can't afford runtime surprises.
          </p>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <div className="section-wrap cta-wrap">
          <h2 className="section-h2">
            Ready to see your agents<br />
            <span className="grad-text">think out loud?</span>
          </h2>
          <p className="section-sub" style={{ marginBottom: 32 }}>
            Join 800+ engineering teams using JavaAI to ship safer, faster.
          </p>
          <div className="cta-btns">
            <button className="btn-primary btn-lg" onClick={onLaunch}>Launch dashboard →</button>
            <a className="btn-ghost btn-lg" href="#">Book a demo</a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <LogoIcon size={15} dim />
            <span className="footer-wordmark">JavaAI</span>
          </div>
          <div className="footer-links">
            {["Privacy", "Terms", "Security", "Status", "GitHub"].map((l) => (
              <a key={l} className="footer-link" href="#">{l}</a>
            ))}
          </div>
          <span className="footer-copy">© 2025 JavaAI, Inc.</span>
        </div>
      </footer>
    </div>
  );
}

// ─── Tiny dashboard preview (non-interactive thumbnail) ───────────────────────
function MiniDashboard() {
  return (
    <div className="mini-dash">
      {/* sidebar */}
      <div className="mini-side">
        <div className="mini-logo-row">
          <LogoIcon size={12} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-mid)", letterSpacing: "0.08em" }}>JAVAAI</span>
        </div>
        <div className="mini-section-label">In Progress</div>
        <div className="mini-session active-s">
          <span className="mini-pip green-pip" />
          <span>Session 3</span>
          <span className="mini-tag red-t">high-risk</span>
        </div>
        {["r1", "r2", "r3"].map((r) => (
          <div key={r} className="mini-run">
            <span className="mini-pulse" />
            <span>gbh123_user-v1</span>
            <span className="mini-time">4h ago</span>
          </div>
        ))}
        <div className="mini-section-label" style={{ marginTop: 8 }}>Completed</div>
        <div className="mini-session">
          <span className="mini-pip dim-pip" />
          <span>Session 1</span>
          <span className="mini-tag grn-t">8 fixed</span>
        </div>
      </div>

      {/* center */}
      <div className="mini-center">
        <div className="mini-panel-hdr">Intent Graph</div>
        <div className="mini-search" />
        {["Update User Schema", "Refactor Auth Layer", "Migrate DB Indexes"].map((t, i) => (
          <div key={i} className={`mini-card ${i === 0 ? "mini-card-sel" : ""}`}>
            <span className={`mini-dot ${i === 0 ? "dot-accent" : "dot-dim"}`} />
            <span className="mini-card-title">{t}</span>
          </div>
        ))}
        <div className="mini-modified-hdr">Modified</div>
        {["Update User Schema", "Patch Rate Limiter"].map((t, i) => (
          <div key={i} className="mini-card">
            <span className="mini-dot dot-dim" />
            <span className="mini-card-title">{t}</span>
          </div>
        ))}
      </div>

      {/* graph */}
      <div className="mini-graph">
        <div className="mini-panel-hdr">Semantic Dependency View</div>
        <svg width="100%" height="100%" viewBox="0 0 260 280" style={{ display: "block" }}>
          {/* edges */}
          <path d="M130,55 C165,55 165,100 200,100" fill="none" stroke="rgba(99,179,237,0.35)" strokeWidth="1"/>
          <path d="M130,55 C165,55 165,160 200,160" fill="none" stroke="rgba(99,179,237,0.15)" strokeWidth="1"/>
          <path d="M130,55 C165,55 165,220 200,220" fill="none" stroke="rgba(99,179,237,0.15)" strokeWidth="1"/>
          {/* nodes */}
          {[
            { x: 60,  y: 32, risk: true,  label: "Auth Layer",    step: "Step 2" },
            { x: 160, y: 88, risk: false, label: "User Schema",   step: null },
            { x: 160, y: 148, risk: false, label: "DB Indexes",    step: null },
            { x: 160, y: 208, risk: false, label: "Rate Limiter",  step: null },
          ].map((n, i) => (
            <g key={i}>
              <rect x={n.x} y={n.y} width="88" height="36" rx="5"
                fill={n.risk ? "#171a28" : "#131520"}
                stroke={n.risk ? "rgba(99,179,237,0.45)" : "rgba(255,255,255,0.07)"}
                strokeWidth="1"
              />
              <text x={n.x + 6} y={n.y + 13} fontSize="7.5" fill="#c4ccdf" fontFamily="sans-serif">{n.label}</text>
              {n.risk && <rect x={n.x + 6} y={n.y + 18} width="32" height="10" rx="2" fill="rgba(248,113,113,0.15)"/>}
              {n.risk && <text x={n.x + 8} y={n.y + 26} fontSize="6" fill="#f87171" fontFamily="monospace">high-risk</text>}
              {n.step && <rect x={n.x + 42} y={n.y + 18} width="22" height="10" rx="2" fill="rgba(99,179,237,0.15)"/>}
              {n.step && <text x={n.x + 44} y={n.y + 26} fontSize="6" fill="#63b3ed" fontFamily="monospace">Step 2</text>}
              <circle cx={n.x + 88} cy={n.y + 18} r="3"
                fill={n.risk ? "rgba(99,179,237,0.5)" : "none"}
                stroke="rgba(99,179,237,0.35)" strokeWidth="1"
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ─── Logo icon ────────────────────────────────────────────────────────────────
function LogoIcon({ size = 18, dim = false }) {
  const c = dim ? "#63b3ed" : "#63b3ed";
  return (
    <svg viewBox="0 0 18 18" fill="none" width={size} height={size}>
      <rect x="1" y="1" width="7" height="7" rx="1.5" fill={c} opacity={dim ? 0.5 : 0.9}/>
      <rect x="10" y="1" width="7" height="7" rx="1.5" fill={c} opacity={dim ? 0.28 : 0.5}/>
      <rect x="1" y="10" width="7" height="7" rx="1.5" fill={c} opacity={dim ? 0.28 : 0.5}/>
      <rect x="10" y="10" width="7" height="7" rx="1.5" fill={c} opacity={dim ? 0.12 : 0.22}/>
    </svg>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing"); // "landing" | "dashboard"
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 40); }, []);

  return (
    <div className={`root ${mounted ? "root-in" : ""}`}>

      {view === "dashboard" && (
        // Back button floats over the dashboard
        <button className="back-btn" onClick={() => setView("landing")}>
          <svg viewBox="0 0 14 14" fill="none" width="12" height="12">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to home
        </button>
      )}

      {view === "landing"
        ? <LandingPage onLaunch={() => setView("dashboard")} />
        : <Dashboard />
      }

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Syne:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:          #0c0d12;
          --bg-side:     #09090e;
          --bg-panel:    #0d0e15;
          --bg-card:     #131520;
          --bg-card-sel: #171a28;
          --border:      rgba(255,255,255,0.055);
          --border-hi:   rgba(255,255,255,0.09);
          --border-sel:  rgba(99,179,237,0.3);
          --text:        #c4ccdf;
          --text-mid:    #7a849e;
          --text-dim:    #444a60;
          --accent:      #63b3ed;
          --accent-bg:   rgba(99,179,237,0.12);
          --green:       #4ade99;
          --green-bg:    rgba(74,222,153,0.1);
          --red:         #f87171;
          --red-bg:      rgba(248,113,113,0.1);
          --mono:        'IBM Plex Mono', monospace;
          --sans:        'Syne', sans-serif;
        }

        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text); font-family: var(--sans); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        button { font-family: var(--sans); }

        .root { opacity: 0; transition: opacity 0.35s ease; }
        .root-in { opacity: 1; }

        /* ── Back button ── */
        .back-btn {
          position: fixed; top: 14px; left: 14px; z-index: 200;
          display: flex; align-items: center; gap: 7px;
          background: rgba(12,13,18,0.85); backdrop-filter: blur(10px);
          border: 1px solid var(--border-hi); color: var(--text-mid);
          font-size: 12px; font-family: var(--mono);
          padding: 7px 13px; border-radius: 8px; cursor: pointer;
          transition: all 0.15s; letter-spacing: 0.03em;
        }
        .back-btn:hover { color: var(--text); border-color: var(--border-sel); background: rgba(12,13,18,0.95); }

        /* ── Shared buttons ── */
        .btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--accent); color: #0c1220;
          font-family: var(--sans); font-size: 13px; font-weight: 600;
          padding: 8px 18px; border-radius: 8px;
          text-decoration: none; letter-spacing: 0.01em;
          border: none; cursor: pointer; white-space: nowrap;
          transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
        }
        .btn-primary:hover {
          background: #89cbf5;
          box-shadow: 0 0 24px rgba(99,179,237,0.35);
          transform: translateY(-1px);
        }
        .btn-primary.btn-lg { font-size: 14px; padding: 11px 24px; border-radius: 9px; }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 7px;
          background: transparent; color: var(--text-mid);
          font-family: var(--sans); font-size: 13px; font-weight: 500;
          padding: 8px 18px; border-radius: 8px;
          text-decoration: none; letter-spacing: 0.01em;
          border: 1px solid var(--border-hi); cursor: pointer; white-space: nowrap;
          transition: all 0.15s;
        }
        .btn-ghost:hover { color: var(--text); background: rgba(255,255,255,0.04); border-color: var(--border-sel); }
        .btn-ghost.btn-lg { font-size: 14px; padding: 11px 22px; border-radius: 9px; }

        /* ── Landing ── */
        .landing { min-height: 100vh; }

        /* Nav */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          border-bottom: 1px solid transparent;
          transition: background 0.25s, border-color 0.25s, backdrop-filter 0.25s;
        }
        .nav-scrolled {
          background: rgba(12,13,18,0.88); backdrop-filter: blur(16px);
          border-color: var(--border);
        }
        .nav-inner {
          max-width: 1180px; margin: 0 auto; padding: 0 32px;
          height: 60px; display: flex; align-items: center; gap: 32px;
        }
        .nav-brand { display: flex; align-items: center; gap: 10px; }
        .wordmark {
          font-family: var(--sans); font-size: 13px; font-weight: 600;
          color: #e0e6f5; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .nav-links { display: flex; align-items: center; gap: 2px; flex: 1; }
        .nav-link {
          font-size: 13px; color: var(--text-mid); text-decoration: none;
          padding: 6px 12px; border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }
        .nav-link:hover { color: var(--text); background: rgba(255,255,255,0.04); }
        .nav-end { display: flex; align-items: center; gap: 8px; margin-left: auto; }

        /* Grid bg */
        .grid-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .grid-lines {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(99,179,237,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,179,237,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 100%);
        }
        .grid-fade-t { position: absolute; top: 0; left: 0; right: 0; height: 80px; background: linear-gradient(to bottom, var(--bg), transparent); }
        .grid-fade-b { position: absolute; bottom: 0; left: 0; right: 0; height: 220px; background: linear-gradient(to top, var(--bg), transparent); }
        .glow-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .go-1 { width: 600px; height: 380px; top: -60px; left: 50%; transform: translateX(-55%); background: radial-gradient(ellipse, rgba(99,179,237,0.11) 0%, transparent 70%); }
        .go-2 { width: 350px; height: 280px; top: 80px; right: 8%; background: radial-gradient(ellipse, rgba(167,139,250,0.07) 0%, transparent 70%); }

        /* Hero */
        .hero {
          position: relative; min-height: 100vh;
          display: flex; flex-direction: column; align-items: center;
          padding: 140px 32px 60px; overflow: hidden; gap: 0;
        }
        .hero-inner {
          position: relative; z-index: 1;
          max-width: 700px; text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(99,179,237,0.07); border: 1px solid rgba(99,179,237,0.18);
          border-radius: 100px; padding: 5px 14px;
          font-family: var(--mono); font-size: 11px; color: var(--text-mid);
          margin-bottom: 32px; letter-spacing: 0.04em;
        }
        .badge-pip { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); flex-shrink: 0; }
        .badge-sep { color: var(--text-dim); }
        .badge-link { color: var(--accent); text-decoration: none; }
        .badge-link:hover { opacity: 0.75; }

        .hero-h1 {
          font-size: clamp(38px, 6vw, 64px); font-weight: 700;
          line-height: 1.1; color: #eef2fc; letter-spacing: -0.025em;
          margin-bottom: 24px;
        }
        .grad-text {
          background: linear-gradient(130deg, var(--accent) 0%, #a78bfa 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hero-sub {
          font-size: 17px; line-height: 1.65; color: var(--text-mid);
          max-width: 500px; margin-bottom: 36px;
        }
        .hero-cta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px; }
        .hero-fine { font-family: var(--mono); font-size: 11px; color: var(--text-dim); letter-spacing: 0.04em; }

        /* Dashboard preview */
        .hero-preview {
          position: relative; z-index: 1;
          margin-top: 56px; width: 100%; max-width: 900px;
          border: 1px solid var(--border-hi); border-radius: 12px; overflow: hidden;
          box-shadow: 0 30px 90px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,179,237,0.05);
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .hero-preview:hover {
          border-color: rgba(99,179,237,0.22);
          box-shadow: 0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(99,179,237,0.1), 0 0 60px rgba(99,179,237,0.04);
          transform: translateY(-2px);
        }
        .preview-bar {
          display: flex; align-items: center; gap: 8px;
          background: #09090e; padding: 10px 16px;
          border-bottom: 1px solid var(--border);
        }
        .preview-dot { width: 10px; height: 10px; border-radius: 50%; }
        .pd-r { background: #ff5f57; } .pd-y { background: #febc2e; } .pd-g { background: #28c840; }
        .preview-url {
          font-family: var(--mono); font-size: 10px; color: var(--text-dim);
          background: rgba(255,255,255,0.04); padding: 3px 10px;
          border-radius: 4px; border: 1px solid var(--border); margin-left: 4px;
        }
        .preview-hint {
          margin-left: auto; font-family: var(--mono); font-size: 10px; color: var(--text-dim);
          transition: color 0.15s;
        }
        .hero-preview:hover .preview-hint { color: var(--accent); }
        .preview-screen { pointer-events: none; }
        .preview-vignette {
          position: absolute; bottom: 0; left: 0; right: 0; height: 80px;
          background: linear-gradient(to top, rgba(12,13,18,0.8), transparent);
          pointer-events: none;
        }

        /* Mini dashboard */
        .mini-dash {
          display: flex; height: 280px; background: var(--bg);
          font-family: var(--mono); font-size: 9px;
        }
        .mini-side {
          width: 130px; min-width: 130px; background: var(--bg-side);
          border-right: 1px solid var(--border); padding: 10px 8px;
          display: flex; flex-direction: column; gap: 2px; overflow: hidden;
        }
        .mini-logo-row { display: flex; align-items: center; gap: 6px; padding: 2px 4px; margin-bottom: 6px; }
        .mini-section-label {
          font-size: 8px; color: var(--text-dim); letter-spacing: 0.08em;
          text-transform: uppercase; padding: 6px 4px 3px;
        }
        .mini-session {
          display: flex; align-items: center; gap: 5px;
          padding: 4px 6px; border-radius: 4px; color: var(--text-dim); font-size: 9px;
        }
        .mini-session.active-s { background: rgba(255,255,255,0.04); color: var(--text-mid); }
        .mini-pip { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .green-pip { background: var(--green); box-shadow: 0 0 4px var(--green); }
        .dim-pip { background: var(--text-dim); }
        .mini-tag {
          margin-left: auto; font-size: 7px; padding: 1px 4px; border-radius: 3px;
        }
        .red-t { background: var(--red-bg); color: var(--red); }
        .grn-t { background: var(--green-bg); color: var(--green); }
        .mini-run {
          display: flex; align-items: center; gap: 5px;
          padding: 2px 6px 2px 14px; color: var(--text-dim); font-size: 8.5px;
        }
        .mini-pulse {
          width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0;
          background: var(--accent); box-shadow: 0 0 4px var(--accent);
        }
        .mini-time { margin-left: auto; color: var(--text-dim); font-size: 7.5px; }

        .mini-center {
          width: 150px; min-width: 150px; border-right: 1px solid var(--border);
          padding: 10px 8px; overflow: hidden;
        }
        .mini-panel-hdr {
          font-size: 8px; color: var(--text-dim); letter-spacing: 0.07em;
          text-transform: uppercase; padding-bottom: 8px;
          border-bottom: 1px solid var(--border); margin-bottom: 8px;
        }
        .mini-search {
          height: 18px; border-radius: 4px;
          background: rgba(255,255,255,0.03); border: 1px solid var(--border);
          margin-bottom: 8px;
        }
        .mini-card {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 6px; border-radius: 4px; margin-bottom: 3px;
          background: var(--bg-card); border: 1px solid transparent;
        }
        .mini-card.mini-card-sel { border-color: rgba(99,179,237,0.25); background: var(--bg-card-sel); }
        .mini-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .dot-accent { background: var(--accent); box-shadow: 0 0 4px var(--accent); }
        .dot-dim { background: var(--text-dim); }
        .mini-card-title { font-size: 8.5px; color: var(--text-mid); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mini-modified-hdr {
          font-size: 8px; color: var(--text-dim); letter-spacing: 0.07em;
          text-transform: uppercase; padding: 8px 4px 5px;
        }

        .mini-graph {
          flex: 1; overflow: hidden; padding: 10px 8px;
          display: flex; flex-direction: column;
        }

        /* Stats bar */
        .stats-bar {
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,0.012);
        }
        .stats-inner {
          max-width: 1180px; margin: 0 auto; padding: 0 32px;
          display: grid; grid-template-columns: repeat(4,1fr);
        }
        .stat-item {
          display: flex; flex-direction: column; gap: 4px;
          padding: 28px 28px; border-right: 1px solid var(--border);
        }
        .stat-item:last-child { border-right: none; }
        .stat-val {
          font-family: var(--mono); font-size: 28px; font-weight: 500;
          color: #eef2fc; letter-spacing: -0.02em;
        }
        .stat-label { font-size: 12px; color: var(--text-mid); }

        /* Features */
        .features-section { padding: 100px 32px; }
        .section-wrap { max-width: 1100px; margin: 0 auto; }
        .eyebrow {
          display: flex; align-items: center; gap: 14px; justify-content: center;
          font-family: var(--mono); font-size: 11px; color: var(--text-dim);
          letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 28px;
        }
        .eyebrow-rule { flex: 1; max-width: 60px; height: 1px; background: var(--border-hi); }
        .section-h2 {
          font-size: clamp(28px, 4vw, 42px); font-weight: 700;
          line-height: 1.18; letter-spacing: -0.02em;
          color: #eef2fc; text-align: center; margin-bottom: 14px;
        }
        .section-sub {
          font-size: 15.5px; color: var(--text-mid); text-align: center;
          max-width: 460px; margin: 0 auto 56px; line-height: 1.6;
        }
        .features-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 1px;
          background: var(--border); border: 1px solid var(--border);
          border-radius: 12px; overflow: hidden;
        }
        .feature-card {
          background: var(--bg-card); padding: 30px 26px;
          display: flex; flex-direction: column; gap: 11px;
          transition: background 0.18s;
        }
        .feature-card:hover { background: var(--bg-card-sel); }
        .feature-icon {
          width: 34px; height: 34px; border-radius: 8px;
          background: var(--accent-bg); border: 1px solid rgba(99,179,237,0.18);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent); flex-shrink: 0;
        }
        .feature-title { font-size: 13.5px; font-weight: 600; color: #d6ddf0; }
        .feature-desc { font-size: 13px; color: var(--text-mid); line-height: 1.6; }

        /* CTA */
        .cta-section {
          position: relative; overflow: hidden;
          border-top: 1px solid var(--border); padding: 100px 32px;
        }
        .cta-glow {
          position: absolute; width: 600px; height: 400px; border-radius: 50%;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          background: rgba(99,179,237,0.05); filter: blur(80px); pointer-events: none;
        }
        .cta-wrap { position: relative; z-index: 1; text-align: center; display: flex; flex-direction: column; align-items: center; }
        .cta-btns { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }

        /* Footer */
        .footer { border-top: 1px solid var(--border); padding: 28px 0; }
        .footer-inner {
          max-width: 1180px; margin: 0 auto; padding: 0 32px;
          display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
        }
        .footer-brand { display: flex; align-items: center; gap: 8px; }
        .footer-wordmark {
          font-family: var(--sans); font-size: 11px; font-weight: 600;
          color: var(--text-dim); letter-spacing: 0.08em; text-transform: uppercase;
        }
        .footer-links { display: flex; gap: 2px; flex: 1; }
        .footer-link {
          font-size: 12px; color: var(--text-dim); text-decoration: none;
          padding: 4px 10px; border-radius: 5px; transition: color 0.13s;
        }
        .footer-link:hover { color: var(--text-mid); }
        .footer-copy { font-family: var(--mono); font-size: 11px; color: var(--text-dim); margin-left: auto; }

        @media (max-width: 820px) {
          .stats-inner { grid-template-columns: repeat(2,1fr); }
          .features-grid { grid-template-columns: 1fr; }
          .stat-item { border-right: none; border-bottom: 1px solid var(--border); }
          .nav-links { display: none; }
          .footer-copy { margin-left: 0; }
          .mini-center { width: 120px; min-width: 120px; }
        }
      `}</style>
    </div>
  );
}


/*
export default function App() {
  const knowledgeBase = {
    "how are you": "I'm functioning within normal parameters.",
    "what is your name": "My name is AEAI.",
    "why are you here": "To assist and answer your questions.",
    "what is the meaning of life": "42, obviously."
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f5f5f5" }}>
      {/* Hero */ /*
      <header style={{
        textAlign: "center",
        padding: "120px 20px",
        background: "linear-gradient(135deg, #fff, #fff)",
        color: "black"
      }}>
        <h1 style={{ fontSize: "3rem", marginBottom: 20 }}>AEAI – Interactive AI Bot</h1>
        <p style={{ fontSize: "1.25rem", marginBottom: 40 }}>
          Ask questions and explore instant AI responses like Cursor.
        </p>
        <button style={{
          padding: "15px 30px",
          fontSize: "1rem",
          borderRadius: 8,
          border: "none",
          backgroundColor: "#fff",
          color: "#4f46e5",
          cursor: "pointer"
        }}>
          Get Started
        </button>
      </header>


*/

     /*
      {/* Interactive Demo */ 

      /*
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: 30 }}>Try the AI Bot</h2>
        <QuestionBot knowledgeBase={knowledgeBase} />
      </section>

      <section style={{ padding: "60px 20px", textAlign: "center" }}>
  <h2>VS Code-Style Dashboard</h2>
  <Dashboard />
</section>

 {/* Features */
 /*
      <section style={{ display: "flex", justifyContent: "center", gap: 20, padding: "60px 20px", flexWrap: "wrap" }}>
        {[
          { title: "Instant Answers", desc: "Get AI responses instantly as you type." },
          { title: "Interactive UI", desc: "Click, type, and see live updates without page reloads." },
          { title: "Reusable Components", desc: "Easily embed your bot anywhere on the page." }
        ].map((f, i) => (
          <div key={i} style={{
            background: "#fff",
            padding: 30,
            borderRadius: 12,
            width: 250,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: 10 }}>{f.title}</h3>
            <p style={{ color: "#555" }}>{f.desc}</p>
          </div>
        ))}

        
      </section>






      {/* Footer / CTA */ 
      <footer style={{
        textAlign: "center",
        padding: 40,
        backgroundColor: "#1f2937",
        color: "#fff",
        marginTop: 60
      }}>
        <p>Ready to try AEAI? Start now!</p>
        <button style={{
          padding: "12px 28px",
          fontSize: "1rem",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#4f46e5",
          color: "#fff",
          cursor: "pointer",
          marginTop: 15
        }}>
          Launch Demo
        </button>
      </footer>


/*
      
    </div>
  );
}

*/