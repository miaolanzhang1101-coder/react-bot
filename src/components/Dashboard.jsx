
import { useState, useEffect } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────
const SESSIONS = [
  {
    id: "s3", name: "Session 3", status: "in-progress", risk: "high-risk",
    errorsFixed: 2,
    runs: [
      { id: "r1", user: "gbh123_user-v1", time: "4h ago", sub: ["gchat_handle_user", "gchat_handle_user"] },
      { id: "r2", user: "gbh123_user-v1", time: "4h ago" },
      { id: "r3", user: "gbh123_user-v1", time: "4h ago" },
    ],
  },
  {
    id: "s1", name: "Session 1", status: "completed", risk: "high-risk",
    errorsFixed: 8,
    runs: [
      { id: "r4", user: "gbh123_user-v1", time: "1d ago" },
      { id: "r5", user: "gbh123_user-v1", time: "1d ago" },
      { id: "r6", user: "gbh123_user-v1", time: "1d ago" },
    ],
  },
];

const INTENT_SECTIONS = [
  {
    label: "In Progress", items: [
      { id: "i1", title: "Update User Schema", user: "gbh123_user-v1", changes: 20, time: "10:45 AM", intents: 2, type: "API change" },
      { id: "i2", title: "Update User Schema", user: "gbh123_user-v1", changes: 20, time: "10:45 AM", intents: 2, type: "API change" },
      { id: "i3", title: "Update User Schema", user: "gbh123_user-v1", changes: 20, time: "10:45 AM", intents: 2, type: "API change" },
    ],
  },
  {
    label: "Modified", items: [
      { id: "i4", title: "Update User Schema", user: "gbh123_user-v1", changes: 20, time: "10:45 AM", intents: 2, type: "API change" },
      { id: "i5", title: "Update User Schema", user: "gbh123_user-v1", changes: 20, time: "10:45 AM", intents: 2, type: "API change" },
    ],
  },
];

const GRAPH_NODES = [
  { id: "g1", title: "Update User Schema", detail: "Public API changes: 2", x: 680, y: 60,  risk: null,        step: null },
  { id: "g2", title: "Update User Schema", detail: "Public API changes: 2", x: 340, y: 210, risk: "high-risk", step: "Step 2" },
  { id: "g3", title: "Update User Schema", detail: "Public API changes: 2", x: 680, y: 330, risk: null,        step: null },
  { id: "g4", title: "Update User Schema", detail: "Public API changes: 2", x: 680, y: 540, risk: null,        step: null },
];

const EDGES = [
  { from: "g2", to: "g1" },
  { from: "g2", to: "g3" },
  { from: "g2", to: "g4" },
];

// ─── Pulse ring indicator (replaces spinner) ────────────────────────────────
function PulseRing() {
  return <span className="pulse-ring"><span className="pulse-core" /></span>;
}

// ─── Graph panel ──────────────────────────────────────────────────────────────
function GraphPanel({ selectedNode, onSelectNode }) {
  const W = 580, H = 680;
  const NODE_W = 200, NODE_H = 80;

  const cx = (n) => n.x + NODE_W;
  const cy = (n) => n.y + NODE_H / 2;
  const getNode = (id) => GRAPH_NODES.find((n) => n.id === id);

  return (
    <div className="graph-canvas">
      <svg width="100%" height={H} viewBox={`0 0 ${W + 160} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {EDGES.map((e, i) => {
          const from = getNode(e.from);
          const to   = getNode(e.to);
          const x1 = cx(from), y1 = cy(from);
          const x2 = cx(to),   y2 = cy(to);
          const mx = (x1 + x2) / 2;
          const lit = selectedNode === e.from || selectedNode === e.to;
          return (
            <path key={i}
              d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
              fill="none"
              stroke={lit ? "rgba(99,179,237,0.45)" : "rgba(99,179,237,0.1)"}
              strokeWidth={lit ? "1.5" : "1"}
              filter={lit ? "url(#glow)" : undefined}
              style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
            />
          );
        })}

        {/* Connector dots */}
        {GRAPH_NODES.map((n) => (
          <circle key={`dot-${n.id}`} cx={cx(n)} cy={cy(n)} r="4"
            fill={selectedNode === n.id ? "rgba(99,179,237,0.6)" : "none"}
            stroke={selectedNode === n.id ? "rgba(99,179,237,0.9)" : "rgba(99,179,237,0.22)"}
            strokeWidth="1.5"
            style={{ transition: "all 0.2s" }}
          />
        ))}

        {/* Nodes */}
        {GRAPH_NODES.map((n) => {
          const sel = selectedNode === n.id;
          return (
            <foreignObject key={n.id} x={n.x - NODE_W - 10} y={n.y} width={NODE_W} height={NODE_H + 24}>
              <div className={`graph-node ${sel ? "graph-node-selected" : ""}`} onClick={() => onSelectNode(n.id)}>
                <div className="graph-node-top">
                  <span className="graph-node-title">{n.title}</span>
                  {n.risk && <span className="tag tag-risk">{n.risk}</span>}
                  {n.step && <span className="tag tag-step">{n.step}</span>}
                </div>
                <div className="graph-node-detail">{n.detail}</div>
                <button className="graph-node-link">↗ View detail</button>
              </div>
            </foreignObject>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeSession, setActiveSession] = useState("s3");
  const [expandedSess, setExpandedSess]   = useState({ s3: true, s1: true });
  const [selectedIntent, setSelectedIntent] = useState("i1");
  const [selectedNode, setSelectedNode]   = useState("g2");
  const [search, setSearch]               = useState("");
  const [atomicNodes, setAtomicNodes]     = useState(5);
  const [discardAll, setDiscardAll]       = useState(false);
  const [mounted, setMounted]             = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const toggleSession = (id) =>
    setExpandedSess((prev) => ({ ...prev, [id]: !prev[id] }));

  const filteredSections = INTENT_SECTIONS
    .map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.user.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((sec) => sec.items.length > 0);

  return (
    <div className={`app ${mounted ? "app-mounted" : ""}`}>

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg className="logo-icon" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.9"/>
            <rect x="10" y="1" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5"/>
            <rect x="1" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5"/>
            <rect x="10" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.22"/>
          </svg>
          <span className="logo-text">JavaAI</span>
        </div>

        {/* In Progress session */}
        {[SESSIONS[0]].map((sess) => (
          <div key={sess.id} className="session-group">
            <div className="section-label">
              <span className="pip pip-green" />In Progress
            </div>
            <div
              className={`session-header ${activeSession === sess.id ? "active" : ""}`}
              onClick={() => { setActiveSession(sess.id); toggleSession(sess.id); }}
            >
              <span className={`chevron ${expandedSess[sess.id] ? "open" : ""}`}>›</span>
              <span className="session-name">{sess.name}</span>
              <span className="tag tag-risk">{sess.risk}</span>
              <span className="tag tag-fixed">{sess.errorsFixed} fixed</span>
            </div>
            {expandedSess[sess.id] && (
              <div className="run-list">
                {sess.runs.map((run) => (
                  <div key={run.id}>
                    <div className="run-item">
                      <PulseRing />
                      <span className="run-user">{run.user}</span>
                      <span className="run-time">{run.time}</span>
                    </div>
                    {run.sub?.map((s, i) => (
                      <div key={i} className="run-sub">
                        <span className="sub-line" />{s}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Completed session */}
        {[SESSIONS[1]].map((sess) => (
          <div key={sess.id} className="session-group">
            <div className="section-label">
              <span className="pip pip-dim" />Completed
            </div>
            <div
              className={`session-header ${activeSession === sess.id ? "active" : ""}`}
              onClick={() => { setActiveSession(sess.id); toggleSession(sess.id); }}
            >
              <span className={`chevron ${expandedSess[sess.id] ? "open" : ""}`}>›</span>
              <span className="session-name">{sess.name}</span>
              <span className="tag tag-risk">{sess.risk}</span>
              <span className="tag tag-fixed">{sess.errorsFixed} fixed</span>
            </div>
            {expandedSess[sess.id] && (
              <div className="run-list">
                {sess.runs.map((run) => (
                  <div key={run.id} className="run-item">
                    <span className="done-dot" />
                    <span className="run-user">{run.user}</span>
                    <span className="run-time">{run.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      {/* ── Center panel ── */}
      <section className="center-panel">
        <div className="panel-header">
          <span className="panel-title">Intent Graph</span>
          <div className="header-right">
            <span className="header-meta">5 active</span>
            <button
              className={`btn-discard ${discardAll ? "btn-discard-done" : ""}`}
              onClick={() => setDiscardAll(!discardAll)}
            >
              {discardAll ? "✓ Discarded" : "Discard all"}
            </button>
          </div>
        </div>

        <div className="search-row">
          <svg className="search-icon" viewBox="0 0 16 16" fill="none" width="14" height="14">
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            className="search-input"
            placeholder="Search intents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <div className="intent-list">
          {filteredSections.map((sec) => (
            <div key={sec.label}>
              <div className="section-divider">
                <span className="divider-dot" />
                {sec.label}
                <span className="divider-count">{sec.items.length}</span>
              </div>
              {sec.items.map((item) => (
                <div
                  key={item.id}
                  className={`intent-card ${selectedIntent === item.id ? "intent-card-sel" : ""}`}
                  onClick={() => setSelectedIntent(item.id)}
                >
                  <div className="intent-top">
                    <div className="intent-title-row">
                      <span className={`intent-dot ${selectedIntent === item.id ? "dot-on" : ""}`} />
                      <span className="intent-title">{item.title}</span>
                    </div>
                    <div className="intent-tags">
                      <span className="tag tag-count">{item.intents} intent</span>
                      <span className="tag tag-api">{item.type}</span>
                    </div>
                  </div>
                  <div className="intent-bottom">
                    <span className="intent-user">{item.user}</span>
                    <span className="sep">·</span>
                    <span className="intent-changes">{item.changes} changes</span>
                    <span className="intent-time">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Right graph panel ── */}
      <section className="right-panel">
        <div className="panel-header">
          <span className="panel-title">Semantic Dependency View</span>
          <div className="graph-actions">
            <button className="icon-btn" title="Bookmark">
              <svg viewBox="0 0 14 14" fill="none" width="12" height="12">
                <path d="M2 2h10v10.5L7 9.5 2 12.5V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="atomic-btn" onClick={() => setAtomicNodes((n) => Math.max(1, n - 1))}>
              {atomicNodes} atomic nodes
            </button>
            <button className="icon-btn" title="Expand">
              <svg viewBox="0 0 14 14" fill="none" width="12" height="12">
                <path d="M8.5 1.5H12.5V5.5M5.5 12.5H1.5V8.5M12.5 8.5V12.5H8.5M1.5 5.5V1.5H5.5"
                  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="icon-btn" title="Close">
              <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        <GraphPanel selectedNode={selectedNode} onSelectNode={setSelectedNode} />
      </section>

      {/* ── Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Syne:wght@400;500;600&display=swap');

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

        body { background: var(--bg); }

        .app {
          display: flex;
          height: 100vh;
          width: 100%;
          background: var(--bg);
          font-family: var(--sans);
          color: var(--text);
          overflow: hidden;
          opacity: 0;
          transform: translateY(5px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .app-mounted { opacity: 1; transform: translateY(0); }

        /* ── Sidebar ── */
        .sidebar {
          width: 234px; min-width: 234px;
          background: var(--bg-side);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          overflow-y: auto; scrollbar-width: none;
        }
        .sidebar::-webkit-scrollbar { display: none; }

        .sidebar-logo {
          display: flex; align-items: center; gap: 10px;
          padding: 20px 18px 16px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 6px;
        }
        .logo-icon { width: 18px; height: 18px; color: var(--accent); flex-shrink: 0; }
        .logo-text {
          font-family: var(--sans); font-size: 13px; font-weight: 600;
          color: #e0e6f5; letter-spacing: 0.08em; text-transform: uppercase;
        }

        .session-group { padding: 2px 0 8px; }

        .section-label {
          display: flex; align-items: center; gap: 7px;
          font-size: 10px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--text-dim);
          padding: 12px 18px 6px;
          font-family: var(--mono);
        }
        .pip { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .pip-green { background: var(--green); box-shadow: 0 0 6px var(--green); }
        .pip-dim   { background: var(--text-dim); }

        .session-header {
          display: flex; align-items: center; gap: 7px;
          padding: 7px 12px; cursor: pointer;
          border-radius: 7px; margin: 0 8px;
          transition: background 0.15s;
        }
        .session-header:hover { background: rgba(255,255,255,0.03); }
        .session-header.active { background: rgba(255,255,255,0.04); }

        .chevron {
          font-size: 14px; color: var(--text-dim);
          width: 14px; flex-shrink: 0;
          transition: transform 0.2s ease;
          display: inline-block; transform: rotate(0deg);
        }
        .chevron.open { transform: rotate(90deg); }

        .session-name {
          font-size: 12.5px; font-weight: 500; color: var(--text);
          flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* Tags */
        .tag {
          font-size: 10px; padding: 2px 7px; border-radius: 4px;
          font-weight: 500; letter-spacing: 0.02em; white-space: nowrap;
          font-family: var(--mono); flex-shrink: 0;
        }
        .tag-risk  { background: var(--red-bg);   color: var(--red);   border: 1px solid rgba(248,113,113,0.2); }
        .tag-fixed { background: var(--green-bg);  color: var(--green); border: 1px solid rgba(74,222,153,0.2); }
        .tag-count { background: rgba(255,255,255,0.04); color: var(--text-mid); border: 1px solid var(--border); }
        .tag-api   { background: var(--accent-bg); color: var(--accent); border: 1px solid rgba(99,179,237,0.2); }
        .tag-step  { background: var(--accent-bg); color: var(--accent); border: 1px solid rgba(99,179,237,0.2); }

        /* Run list */
        .run-list { padding: 2px 0 4px; }

        .run-item {
          display: flex; align-items: center; gap: 9px;
          padding: 5px 16px 5px 30px;
          cursor: pointer; font-size: 11.5px; color: var(--text-mid);
          transition: background 0.1s;
        }
        .run-item:hover { background: rgba(255,255,255,0.025); }

        /* Pulse ring animation */
        .pulse-ring {
          position: relative; width: 8px; height: 8px; flex-shrink: 0;
        }
        .pulse-core {
          position: absolute; inset: 1px;
          border-radius: 50%; background: var(--accent);
        }
        .pulse-ring::before {
          content: ''; position: absolute; inset: -2px;
          border-radius: 50%; border: 1.5px solid var(--accent);
          opacity: 0; animation: pulse 2s ease-out infinite;
        }
        @keyframes pulse {
          0%   { transform: scale(0.8); opacity: 0.7; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        .done-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--text-dim); flex-shrink: 0; margin: 0 1px;
        }

        .run-user {
          flex: 1; font-family: var(--mono); font-size: 10.5px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .run-time { font-size: 10px; color: var(--text-dim); margin-left: auto; font-family: var(--mono); flex-shrink: 0; }

        .run-sub {
          display: flex; align-items: center; gap: 8px;
          padding: 3px 16px 3px 44px;
          font-size: 10.5px; color: var(--text-dim);
          font-family: var(--mono); cursor: pointer;
          transition: color 0.12s;
        }
        .run-sub:hover { color: var(--text-mid); }
        .sub-line { width: 10px; flex-shrink: 0; border-top: 1px solid var(--border-hi); }

        /* Panel header */
        .panel-header {
          display: flex; align-items: center;
          padding: 0 20px; height: 52px;
          border-bottom: 1px solid var(--border);
          gap: 12px; flex-shrink: 0;
        }
        .panel-title {
          font-size: 11px; font-weight: 500; color: #d0d8ec;
          letter-spacing: 0.08em; text-transform: uppercase;
          font-family: var(--mono);
        }

        /* Center panel */
        .center-panel {
          width: 350px; min-width: 300px;
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          background: var(--bg-panel); overflow: hidden;
        }

        .header-right { display: flex; align-items: center; gap: 10px; margin-left: auto; }
        .header-meta { font-family: var(--mono); font-size: 10px; color: var(--text-dim); }

        .btn-discard {
          font-family: var(--mono); font-size: 10.5px;
          padding: 5px 12px; border-radius: 6px;
          background: transparent; border: 1px solid var(--border-hi);
          color: var(--text-mid); cursor: pointer;
          transition: all 0.15s; letter-spacing: 0.04em;
        }
        .btn-discard:hover { background: rgba(255,255,255,0.04); color: var(--text); }
        .btn-discard-done { border-color: rgba(74,222,153,0.3); color: var(--green); background: var(--green-bg); }

        .search-row {
          display: flex; align-items: center; gap: 9px;
          padding: 10px 16px; border-bottom: 1px solid var(--border);
          flex-shrink: 0; background: rgba(255,255,255,0.01);
        }
        .search-icon { color: var(--text-dim); flex-shrink: 0; }
        .search-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: var(--sans); font-size: 12.5px; color: var(--text);
          min-width: 0;
        }
        .search-input::placeholder { color: var(--text-dim); }
        .search-clear {
          background: transparent; border: none; color: var(--text-dim);
          cursor: pointer; font-size: 11px; padding: 2px 4px; border-radius: 4px;
          transition: color 0.12s;
        }
        .search-clear:hover { color: var(--text); }

        .intent-list {
          flex: 1; overflow-y: auto; padding: 8px 0 16px;
          scrollbar-width: none;
        }
        .intent-list::-webkit-scrollbar { display: none; }

        .section-divider {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px 7px;
          font-size: 10.5px; font-weight: 500; color: var(--text-dim);
          letter-spacing: 0.07em; text-transform: uppercase;
          font-family: var(--mono);
        }
        .divider-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--text-dim); flex-shrink: 0; }
        .divider-count {
          margin-left: auto; font-size: 10px;
          background: rgba(255,255,255,0.04); padding: 1px 7px;
          border-radius: 10px; border: 1px solid var(--border);
        }

        .intent-card {
          margin: 2px 10px; padding: 11px 13px;
          border-radius: 7px; border: 1px solid transparent;
          cursor: pointer; transition: background 0.13s, border-color 0.13s, box-shadow 0.13s;
          background: var(--bg-card);
          position: relative; overflow: hidden;
        }
        .intent-card::before {
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0; width: 2px;
          background: transparent; transition: background 0.15s;
        }
        .intent-card:hover { background: var(--bg-card-sel); border-color: var(--border-hi); }
        .intent-card-sel {
          background: var(--bg-card-sel); border-color: var(--border-sel);
          box-shadow: 0 0 0 1px rgba(99,179,237,0.06) inset, 0 4px 16px rgba(0,0,0,0.3);
        }
        .intent-card-sel::before { background: var(--accent); }

        .intent-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 8px; margin-bottom: 9px;
        }
        .intent-title-row { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }

        .intent-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
          background: var(--border-hi); border: 1px solid var(--border-hi);
          transition: all 0.15s;
        }
        .dot-on { background: var(--accent); border-color: var(--accent); box-shadow: 0 0 5px var(--accent); }

        .intent-title {
          font-size: 12.5px; font-weight: 500; color: #d0d8ec;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .intent-tags { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; flex-shrink: 0; }

        .intent-bottom {
          display: flex; align-items: center; gap: 7px;
          font-size: 10.5px; color: var(--text-dim);
          font-family: var(--mono);
        }
        .intent-user { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .sep { opacity: 0.3; }
        .intent-changes { color: var(--text-dim); }
        .intent-time { margin-left: auto; flex-shrink: 0; }

        /* Right panel */
        .right-panel {
          flex: 1; display: flex; flex-direction: column;
          background: var(--bg); overflow: hidden;
        }

        .graph-actions { display: flex; align-items: center; gap: 5px; margin-left: auto; }

        .icon-btn {
          background: transparent; border: 1px solid var(--border-hi);
          color: var(--text-dim); width: 28px; height: 28px;
          border-radius: 6px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.12s;
        }
        .icon-btn:hover { background: rgba(255,255,255,0.05); color: var(--text); border-color: var(--border-sel); }

        .atomic-btn {
          background: transparent; border: 1px solid var(--border-hi);
          color: var(--text-mid); padding: 5px 12px;
          border-radius: 6px; cursor: pointer;
          font-size: 11px; font-family: var(--mono);
          letter-spacing: 0.04em; transition: all 0.12s;
        }
        .atomic-btn:hover { background: rgba(255,255,255,0.04); color: var(--text); }

        /* Graph canvas */
        .graph-canvas {
          flex: 1; overflow: auto; padding: 24px 20px;
          scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.06) transparent;
          background:
            radial-gradient(ellipse 60% 40% at 70% 30%, rgba(99,179,237,0.03) 0%, transparent 70%),
            var(--bg);
        }

        /* Graph nodes */
        .graph-node {
          background: var(--bg-card); border: 1px solid var(--border-hi);
          border-radius: 9px; padding: 12px 14px; cursor: pointer;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          width: 100%; height: 100%;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .graph-node:hover { border-color: rgba(99,179,237,0.25); background: var(--bg-card-sel); }
        .graph-node-selected {
          border-color: rgba(99,179,237,0.45); background: var(--bg-card-sel);
          box-shadow: 0 0 0 1px rgba(99,179,237,0.1) inset, 0 6px 24px rgba(0,0,0,0.4);
        }

        .graph-node-top {
          display: flex; align-items: center; gap: 6px;
          margin-bottom: 5px; flex-wrap: wrap;
        }
        .graph-node-title {
          font-size: 11.5px; font-weight: 500; color: #d0d8ec;
          flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .graph-node-detail {
          font-size: 10.5px; color: var(--text-mid);
          font-family: var(--mono); margin-bottom: 5px; flex: 1;
        }
        .graph-node-link {
          font-size: 10px; color: var(--text-dim);
          background: transparent; border: none; cursor: pointer;
          padding: 0; letter-spacing: 0.04em;
          font-family: var(--mono); transition: color 0.12s; align-self: flex-start;
        }
        .graph-node-link:hover { color: var(--accent); }
      `}</style>
    </div>
  );
}

/*

import React from "react";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h3>Menu</h3>
        <ul>
          <li>Explorer</li>
          <li>Search</li>
          <li>Source Control</li>
        </ul>
      </aside>

      <main className="main-panel">
        <div className="top-bar">Workspace – My Project</div>
        <div className="cards">
          <div className="card">
            <h4>Terminal</h4>
            <p>$ echo "Hello World"</p>
          </div>

          <div className="card">
            <h4>Editor</h4>
            <p>// Some code here</p>
          </div>
        </div>
      </main>
    </div>
  );
}


*/