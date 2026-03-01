import { useState, useEffect } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const SESSIONS = [
  {
    id: "s3", label: "In Progress", name: "Session 3",
    badges: [{ text: "high-risk", variant: "risk" }, { text: "2 errors fixed", variant: "fixed" }],
    runs: [
      { id: "r1", user: "gbh123_user-v7", time: "4h ago", subs: ["gchat_handle_user", "gchat_handle_user"] },
      { id: "r2", user: "gbh123_user-v2", time: "4h ago" },
      { id: "r3", user: "gbh123_user-v3", time: "4h ago" },
    ],
  },
  {
    id: "s1", label: "Completed", name: "Session 1",
    badges: [{ text: "8 errors fixed", variant: "fixed" }],
    runs: [
      { id: "r4", user: "gbh123_user-v4", time: "1d ago" },
      { id: "r5", user: "gbh123_user-v5", time: "1d ago" },
      { id: "r6", user: "gbh123_user-v6", time: "1d ago" },
    ],
  },
];

const INTENT_SECTIONS = [
  {
    label: "In Progress", items: [
      { id: "i1", title: "Fix The NullPointerException....", tags: ["Cross-module", "Bug fix"],     user: "gbh123_user-v1", meta: "14 files",    time: "10:45 AM", selected: true },
      { id: "i2", title: "Replace All Raw SQL Queries",    tags: ["Cross-module", "API change"],   user: "gbh123_user-v1", meta: "20 changes",  time: "10:45 AM" },
      { id: "i3", title: "Split UserService",              tags: ["Cross-module", "Schema change"], user: "gbh123_user-v1", meta: "20 changes",  time: "10:45 AM" },
    ],
  },
  {
    label: "Approved", items: [
      { id: "i4", title: "Add Request Validation",         tags: ["Cross-module", "API change"],   user: "gbh123_user-v1", meta: "20 changes",  time: "10:45 AM" },
      { id: "i5", title: "Implement Refresh Token",        tags: ["Cross-module", "API change"],   user: "gbh123_user-v1", meta: "20 changes",  time: "10:45 AM" },
    ],
  },
];

const NODES = [
  {
    id: "n1", x: 90,  y: 120,
    title: "Migrate User ID...",
    branch: "Branch 1",
    created: "02:30", edited: "12:40",
    files: [
      { id: "f1", name: "pom.xml",               icon: "xml",  badge: "M" },
      { id: "f2", name: "UpdateUserSchema.java",  icon: "java", badge: null },
      { id: "f3", name: "UpdateResult.java",      icon: "java", badge: null },
    ],
  },
  {
    id: "n2", x: 420, y: 60,
    title: "Migrate User ID...",
    branch: null,
    apiChanges: 2,
    created: "02:30", edited: "12:40",
    files: [],
  },
];

const DIFF_LINES = [
  { type: "context", ln: 1,  content: `<project xmlns="http://maven.apache.org/POM/4.0.0">` },
  { type: "context", ln: 2,  content: `  <modelVersion>4.0.0</modelVersion>` },
  { type: "collapsed", count: 12, label: "↓ 12 unchanged lines" },
  { type: "context", ln: 15, content: `  <properties>` },
  { type: "removed", ln: 16, content: `    <spring-boot.version>2.7.0</spring-boot.version>` },
  { type: "added",   ln: 16, content: `    <spring-boot.version>3.1.0</spring-boot.version>` },
  { type: "context", ln: 17, content: `  </properties>` },
  { type: "context", ln: 18, content: `` },
  { type: "context", ln: 19, content: `  <dependencies>` },
  { type: "context", ln: 20, content: `    <dependency>` },
  { type: "removed", ln: 21, content: `      <groupId>javax.persistence</groupId>` },
  { type: "added",   ln: 21, content: `      <groupId>jakarta.persistence</groupId>` },
  { type: "removed", ln: 22, content: `      <artifactId>javax.persistence-api</artifactId>` },
  { type: "added",   ln: 22, content: `      <artifactId>jakarta.persistence-api</artifactId>` },
  { type: "removed", ln: 23, content: `      <version>2.2</version>` },
  { type: "added",   ln: 23, content: `      <version>3.1.0</version>` },
  { type: "context", ln: 24, content: `    </dependency>` },
  { type: "collapsed", count: 28, label: "↓ 28 unchanged lines" },
  { type: "context", ln: 53, content: `  </dependencies>` },
  { type: "context", ln: 54, content: `</project>` },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function XmlToken({ text }) {
  if (!text || !text.trim()) return <span>{text}</span>;
  const parts = [];
  let i = 0, key = 0;
  while (i < text.length) {
    if (text[i] === '<') {
      const isClose = text[i + 1] === '/';
      let j = i + (isClose ? 2 : 1);
      let tag = '';
      while (j < text.length && /[\w.-]/.test(text[j])) { tag += text[j++]; }
      parts.push(<span key={key++} style={{ color: '#89ddff' }}>{isClose ? '</' : '<'}</span>);
      if (tag) parts.push(<span key={key++} style={{ color: '#f07178' }}>{tag}</span>);
      i = j;
    } else if (text[i] === '>' || (text[i] === '/' && text[i+1] === '>')) {
      const v = text[i] === '/' ? '/>' : '>';
      parts.push(<span key={key++} style={{ color: '#89ddff' }}>{v}</span>);
      i += v.length;
    } else if (text[i] === '"') {
      let j = i + 1;
      while (j < text.length && text[j] !== '"') j++;
      parts.push(<span key={key++} style={{ color: '#c3e88d' }}>{text.slice(i, j + 1)}</span>);
      i = j + 1;
    } else {
      let j = i;
      while (j < text.length && text[j] !== '<' && text[j] !== '"' && text[j] !== '>') j++;
      const chunk = text.slice(i, j);
      parts.push(<span key={key++} style={{ color: '#c4ccdf' }}>{chunk}</span>);
      i = j;
    }
  }
  return <>{parts}</>;
}

function FileIcon({ type }) {
  if (type === "xml") return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
      <path d="M4 6l-2 2 2 2M12 6l2 2-2 2M9 4l-2 8" stroke="#63b3ed" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
      <path d="M8 2C5.8 2 4 3.8 4 6c0 1.5.8 2.8 2 3.5V11h4V9.5c1.2-.7 2-2 2-3.5 0-2.2-1.8-4-4-4z" stroke="#f5a442" strokeWidth="1.2"/>
      <rect x="5" y="11" width="6" height="2" rx="1" stroke="#f5a442" strokeWidth="1.2"/>
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" width="13" height="13" style={{ animation: "spin 2s linear infinite", color: "#63b3ed", flexShrink: 0 }}>
      <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.93 2.93l1.41 1.41M9.66 9.66l1.41 1.41M2.93 11.07l1.41-1.41M9.66 4.34l1.41-1.41"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Graph node component ─────────────────────────────────────────────────────
function GraphNode({ node, expanded, selectedFile, onExpand, onFileClick }) {
  const NODE_W = 310;
  const BASE_H = 110;
  const FILE_H = 44;

  return (
    <div
      className="gnode"
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        width: NODE_W,
      }}
    >
      <div
        className={`gnode-card ${expanded ? "gnode-expanded" : ""}`}
        onClick={() => !expanded && onExpand(node.id)}
        style={{ cursor: expanded ? "default" : "pointer" }}
      >
        <div className="gnode-header">
          <span className="gnode-title">{node.title}</span>
          {node.branch && <span className="badge-branch">{node.branch}</span>}
          {node.apiChanges && <span className="gnode-api">API changes: {node.apiChanges}</span>}
        </div>

        <div className="gnode-meta">
          {node.apiChanges && <span className="gnode-view-detail">View detail</span>}
          <div className="gnode-timestamps">
            <span className="gnode-ts-label">Created</span>
            <span className="gnode-ts-val">{node.created}</span>
            <span className="gnode-ts-label" style={{ marginLeft: 16 }}>Edited</span>
            <span className="gnode-ts-val">{node.edited}</span>
          </div>
        </div>

        {node.files.length > 0 && (
          <div
            className="gnode-files"
            style={{
              maxHeight: expanded ? `${node.files.length * (FILE_H + 6) + 20}px` : "0px",
              opacity: expanded ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 280ms ease-out, opacity 200ms ease-out",
            }}
          >
            <div style={{ height: 12 }} />
            {node.files.map((file) => (
              <div
                key={file.id}
                className={`gnode-file-row ${selectedFile?.id === file.id ? "gnode-file-selected" : ""}`}
                onClick={(e) => { e.stopPropagation(); onFileClick(file); }}
              >
                <FileIcon type={file.icon} />
                <span className="gnode-file-name">{file.name}</span>
                {file.badge && <span className="gnode-file-badge">{file.badge}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="gnode-connector" />
    </div>
  );
}

// ─── Bottom panel ─────────────────────────────────────────────────────────────
function BottomPanel({ file, onClose }) {
  const [tab, setTab] = useState("code");
  const [expanded, setExpanded] = useState({});

  return (
    <div className="bottom-panel">
      <div className="bp-header">
        <div className="bp-tabs">
          <button
            className={`bp-tab ${tab === "code" ? "bp-tab-active" : ""}`}
            onClick={() => setTab("code")}
          >
            CODE COMPARISON
          </button>
          <button
            className={`bp-tab ${tab === "agent" ? "bp-tab-active" : ""}`}
            onClick={() => setTab("agent")}
          >
            AGENT REASONING
          </button>
        </div>
        <div className="bp-actions">
          <button className="bp-icon-btn">+</button>
          <button className="bp-icon-btn">
            <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
              <rect x="1" y="1" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="8" y="1" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </button>
          <button className="bp-icon-btn">
            <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
              <path d="M2 7h10M7 2v10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="bp-icon-btn">
            <svg viewBox="0 0 14 14" fill="none" width="11" height="11">
              <path d="M7 10V4M4 7l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="bp-icon-btn" onClick={onClose}>✕</button>
        </div>
      </div>

      {tab === "code" && (
        <div className="bp-body">
          <div className="bp-filetree">
            <div className="bpft-row">
              <svg viewBox="0 0 10 10" fill="none" width="8" height="8" style={{ marginRight: 4, color: "#63b3ed" }}>
                <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <svg viewBox="0 0 14 14" fill="none" width="12" height="12" style={{ marginRight: 5, color: "#f5a442" }}>
                <path d="M2 3h4l1 1h5v8H2V3z" stroke="currentColor" strokeWidth="1.1"/>
              </svg>
              <span className="bpft-name">pom.xml</span>
            </div>
            <div className="bpft-row bpft-child">
              <svg viewBox="0 0 10 10" fill="none" width="8" height="8" style={{ marginRight: 4, color: "#63b3ed" }}>
                <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <svg viewBox="0 0 14 14" fill="none" width="12" height="12" style={{ marginRight: 5, color: "#7a849e" }}>
                <path d="M2 3h4l1 1h5v8H2V3z" stroke="currentColor" strokeWidth="1.1"/>
              </svg>
              <span className="bpft-name bpft-dim">...\..\upgradeSpringBoot</span>
            </div>
          </div>

          <div className="bp-summary">
            2 version bumps · 1 namespace rename
          </div>

          <button className="bp-show-diff" onClick={() => setExpanded(p => ({ ...p, all: !p.all }))}>
            {expanded.all ? "− Hide full diff" : "+ Show full diff"}
          </button>

          {expanded.all && (
            <div className="bp-diff">
              {DIFF_LINES.map((line, i) => {
                if (line.type === "collapsed") {
                  return (
                    <div
                      key={i}
                      className="diff-collapsed-row"
                      onClick={() => setExpanded(p => ({ ...p, [i]: !p[i] }))}
                    >
                      <span style={{ marginRight: 8, color: "#63b3ed" }}>›</span>
                      {line.label}
                    </div>
                  );
                }
                const bg =
                  line.type === "removed" ? "rgba(248,113,113,0.07)" :
                  line.type === "added"   ? "rgba(74,222,153,0.07)"  : "transparent";
                const prefix =
                  line.type === "removed" ? "-" :
                  line.type === "added"   ? "+" : " ";
                const prefixColor =
                  line.type === "removed" ? "#f87171" :
                  line.type === "added"   ? "#4ade99" : "transparent";
                const borderLeft =
                  line.type === "removed" ? "2px solid rgba(248,113,113,0.4)" :
                  line.type === "added"   ? "2px solid rgba(74,222,153,0.4)"  : "2px solid transparent";

                return (
                  <div key={i} className="diff-row" style={{ background: bg, borderLeft }}>
                    <span className="diff-ln">{line.ln}</span>
                    <span className="diff-prefix" style={{ color: prefixColor }}>{prefix}</span>
                    <span className="diff-code"><XmlToken text={line.content} /></span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "agent" && (
        <div className="bp-body bp-agent">
          <div className="agent-header">Why the agent changed this</div>
          <p className="agent-text">
            Spring Boot 3.x migrated from <code>javax.persistence</code> to{" "}
            <code>jakarta.persistence</code> as part of the Java EE → Jakarta EE transition.
            Both version bumps are required — the Spring Boot parent POM and the persistence
            API must be updated together or the build will fail.
          </p>
          <div className="agent-affects">
            <div className="agent-affects-label">What this affects</div>
            {["UserEntity.java → javax → jakarta import update required",
              "OrderEntity.java → javax → jakarta import update required",
              "persistence.xml → namespace migration required"].map((item, i) => {
              const [file, reason] = item.split(" → ");
              return (
                <div key={i} className="agent-affect-row">
                  <span style={{ color: "#63b3ed" }}>→</span>
                  <span className="agent-affect-file">{file}</span>
                  <span className="agent-affect-reason">{reason}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Graph canvas with SVG edge ───────────────────────────────────────────────
function GraphCanvas({ expandedNode, selectedFile, onExpandNode, onFileClick }) {
  const NODE_W = 310;
  const BASE_H = 110;
  const FILE_H = 44;

  const n1 = NODES[0], n2 = NODES[1];

  const n1H = expandedNode === n1.id
    ? BASE_H + 20 + n1.files.length * (FILE_H + 6)
    : BASE_H;

  const x1 = n1.x + NODE_W;
  const y1 = n1.y + n1H / 2;
  const x2 = n2.x;
  const y2 = n2.y + BASE_H / 2;
  const mx = (x1 + x2) / 2;

  return (
    <div className="graph-canvas-wrap">
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}
      >
        <defs>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path
          d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
          fill="none"
          stroke="rgba(99,179,237,0.5)"
          strokeWidth="1.5"
          style={{ transition: "d 300ms ease-out" }}
        />
        <circle cx={x1} cy={y1} r="5" fill="#1a1d2e" stroke="rgba(99,179,237,0.6)" strokeWidth="1.5"/>
      </svg>

      {NODES.map((node) => (
        <GraphNode
          key={node.id}
          node={node}
          expanded={expandedNode === node.id}
          selectedFile={selectedFile}
          onExpand={onExpandNode}
          onFileClick={onFileClick}
        />
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function JavaAIDashboard() {
  const [expandedSess, setExpandedSess] = useState({ s3: true, s1: true });
  const [selectedIntent, setSelectedIntent] = useState("i1");
  const [expandedNode, setExpandedNode] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bottomOpen, setBottomOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 40); }, []);

  const handleNodeExpand = (id) => {
    setExpandedNode(id);
    setSelectedFile(null);
    setBottomOpen(false);
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setBottomOpen(true);
  };

  const handleCloseBottom = () => {
    setBottomOpen(false);
    setSelectedFile(null);
  };

  const TAG_COLORS = {
    "Bug fix":       { bg: "rgba(248,113,113,0.15)", color: "#f87171", border: "rgba(248,113,113,0.25)" },
    "API change":    { bg: "rgba(99,179,237,0.12)",  color: "#63b3ed", border: "rgba(99,179,237,0.25)" },
    "Schema change": { bg: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "rgba(167,139,250,0.25)" },
    "Cross-module":  { bg: "rgba(255,255,255,0.06)", color: "#7a849e", border: "rgba(255,255,255,0.1)" },
  };

  return (
    <div className={`app ${mounted ? "app-in" : ""}`}>
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
            <rect x="1" y="1" width="7" height="7" rx="1.5" fill="#63b3ed" opacity="0.9"/>
            <rect x="10" y="1" width="7" height="7" rx="1.5" fill="#63b3ed" opacity="0.5"/>
            <rect x="1" y="10" width="7" height="7" rx="1.5" fill="#63b3ed" opacity="0.5"/>
            <rect x="10" y="10" width="7" height="7" rx="1.5" fill="#63b3ed" opacity="0.2"/>
          </svg>
          <span className="logo-text">JavaAI</span>
        </div>

        {SESSIONS.map((sess) => (
          <div key={sess.id} className="sess-group">
            <div className="sess-section-label">{sess.label}</div>
            <div
              className={`sess-header`}
              onClick={() => setExpandedSess(p => ({ ...p, [sess.id]: !p[sess.id] }))}
            >
              <span className={`sess-chevron ${expandedSess[sess.id] ? "open" : ""}`}>›</span>
              <span className="sess-name">{sess.name}</span>
              <div className="sess-badges">
                {sess.badges.map((b, i) => (
                  <span key={i} className={`sbadge sbadge-${b.variant}`}>{b.text}</span>
                ))}
              </div>
            </div>

            {expandedSess[sess.id] && (
              <div className="sess-runs">
                {sess.runs.map((run) => (
                  <div key={run.id}>
                    <div className="run-row">
                      <SpinnerIcon />
                      <span className="run-user">{run.user}</span>
                      <span className="run-time">{run.time}</span>
                    </div>
                    {run.subs?.map((s, i) => (
                      <div key={i} className="run-sub">{s}</div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      {/* ── Center panel ── */}
      <section className="center-panel">
        <div className="cp-header">
          <span className="cp-title">Prompt</span>
          <button className="cp-discard">+ Discard all</button>
        </div>

        <div className="cp-search">
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14" style={{ color: "#7a849e", flexShrink: 0 }}>
            <path d="M2 2l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <rect x="4" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          <input className="cp-search-input" placeholder="Search prompts..." />
          <button className="cp-search-btn">
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
              <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="cp-list">
          {INTENT_SECTIONS.map((sec) => (
            <div key={sec.label}>
              <div className="cp-section-label">
                <svg viewBox="0 0 10 10" fill="none" width="9" height="9">
                  <path d="M2 3l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {sec.label}
              </div>
              {sec.items.map((item) => (
                <div
                  key={item.id}
                  className={`intent-card ${selectedIntent === item.id ? "intent-card-sel" : ""}`}
                  onClick={() => setSelectedIntent(item.id)}
                >
                  <div className="ic-top">
                    <span className="ic-title">{item.title}</span>
                    <div className="ic-tags">
                      {item.tags.map((tag, i) => {
                        const s = TAG_COLORS[tag] || TAG_COLORS["Cross-module"];
                        return (
                          <span key={i} className="ic-tag" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="ic-bottom">
                    <span className="ic-user">{item.user}</span>
                    <span className="ic-meta">{item.meta}</span>
                    <span className="ic-time">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Right panel ── */}
      <section className="right-panel">
        <div className="rp-header">
          <span className="rp-title">Semantic Intent Graph</span>
          <div className="rp-header-actions">
            <button className="rp-icon-btn">☆</button>
            <button className="rp-intent-count">+ 5 Intent</button>
            <button className="rp-icon-btn">⤢</button>
            <button className="rp-icon-btn">✕</button>
          </div>
        </div>

        <div className="rp-body">
          <div
            className="rp-graph"
            style={{
              flex: bottomOpen ? "0 0 auto" : "1",
              height: bottomOpen ? "55%" : "100%",
              transition: "height 300ms ease-out",
            }}
          >
            <GraphCanvas
              expandedNode={expandedNode}
              selectedFile={selectedFile}
              onExpandNode={handleNodeExpand}
              onFileClick={handleFileClick}
            />
          </div>

          <div
            className="rp-bottom-wrap"
            style={{
              height: bottomOpen ? "45%" : "0px",
              opacity: bottomOpen ? 1 : 0,
              overflow: "hidden",
              transition: "height 300ms ease-out, opacity 200ms ease-out",
              borderTop: bottomOpen ? "1px solid rgba(255,255,255,0.07)" : "none",
            }}
          >
            {selectedFile && (
              <BottomPanel file={selectedFile} onClose={handleCloseBottom} />
            )}
          </div>
        </div>
      </section>

      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Syne:wght@400;500;600&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #13151f;
          --bg-side:  #0e1018;
          --bg-panel: #13151f;
          --bg-card:  #1c1f2e;
          --bg-card2: #1a1d2e;
          --bg-sel:   #1f2335;
          --border:   rgba(255,255,255,0.07);
          --border-hi:rgba(255,255,255,0.11);
          --text:     #c8d0e4;
          --text-mid: #7a849e;
          --text-dim: #444a60;
          --accent:   #63b3ed;
          --green:    #4ade99;
          --red:      #f87171;
          --mono:     'IBM Plex Mono', monospace;
          --sans:     'Syne', sans-serif;
        }

        html, body { margin: 0; padding: 0; background: var(--bg); }
        button { font-family: var(--sans); cursor: pointer; }

        .app {
          display: flex; height: 100vh; width: 100vw;
          background: var(--bg); font-family: var(--sans);
          color: var(--text); overflow: hidden;
          opacity: 0; transition: opacity 0.3s ease;
        }
        .app-in { opacity: 1; }

        /* ── Sidebar ── */
        .sidebar {
          width: 232px; min-width: 232px;
          background: var(--bg-side);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          overflow-y: auto; scrollbar-width: none;
        }
        .sidebar::-webkit-scrollbar { display: none; }

        .sidebar-logo {
          display: flex; align-items: center; gap: 9px;
          padding: 18px 16px 14px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 4px;
        }
        .logo-text {
          font-size: 14px; font-weight: 600; color: #e0e6f5;
          letter-spacing: 0.06em; text-transform: uppercase;
        }

        .sess-group { padding: 2px 0 6px; }
        .sess-section-label {
          font-family: var(--mono); font-size: 10px; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-dim); padding: 10px 16px 4px;
        }
        .sess-header {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 10px; border-radius: 6px; margin: 0 6px;
          cursor: pointer; transition: background 0.15s; flex-wrap: wrap;
        }
        .sess-header:hover { background: rgba(255,255,255,0.04); }
        .sess-chevron {
          font-size: 14px; color: var(--text-dim);
          transition: transform 0.2s; display: inline-block;
        }
        .sess-chevron.open { transform: rotate(90deg); }
        .sess-name { font-size: 13px; font-weight: 500; color: var(--text); flex: 1; }
        .sess-badges { display: flex; gap: 4px; flex-wrap: wrap; }

        .sbadge {
          font-family: var(--mono); font-size: 10px; padding: 2px 7px;
          border-radius: 4px; font-weight: 500; white-space: nowrap;
        }
        .sbadge-risk  { background: rgba(248,113,113,0.14); color: var(--red);   border: 1px solid rgba(248,113,113,0.2); }
        .sbadge-fixed { background: rgba(74,222,153,0.1);   color: var(--green); border: 1px solid rgba(74,222,153,0.2); }

        .sess-runs { padding: 2px 0 4px; }
        .run-row {
          display: flex; align-items: center; gap: 7px;
          padding: 4px 16px 4px 28px; font-size: 11.5px; color: var(--text-mid);
          transition: background 0.1s; cursor: pointer;
        }
        .run-row:hover { background: rgba(255,255,255,0.03); }
        .run-user { flex: 1; font-family: var(--mono); font-size: 10.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .run-time { font-family: var(--mono); font-size: 10px; color: var(--text-dim); flex-shrink: 0; }
        .run-sub {
          padding: 2px 16px 2px 42px;
          font-family: var(--mono); font-size: 10.5px; color: var(--text-dim);
          cursor: pointer;
        }
        .run-sub:hover { color: var(--text-mid); }

        /* ── Center panel ── */
        .center-panel {
          width: 370px; min-width: 340px;
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          background: var(--bg-panel); overflow: hidden;
        }

        .cp-header {
          display: flex; align-items: center;
          padding: 0 18px; height: 52px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .cp-title { font-size: 14px; font-weight: 500; color: #d0d8ec; }
        .cp-discard {
          margin-left: auto;
          background: transparent; border: 1px solid var(--border-hi);
          color: var(--text-mid); font-family: var(--mono); font-size: 11px;
          padding: 5px 12px; border-radius: 6px; letter-spacing: 0.03em;
          transition: all 0.15s;
        }
        .cp-discard:hover { background: rgba(255,255,255,0.04); color: var(--text); }

        .cp-search {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .cp-search-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: var(--sans); font-size: 13px; color: var(--text);
        }
        .cp-search-input::placeholder { color: var(--text-dim); }
        .cp-search-btn {
          background: transparent; border: 1px solid var(--border-hi);
          color: var(--text-dim); padding: 5px 8px; border-radius: 5px;
          transition: all 0.12s;
        }
        .cp-search-btn:hover { background: rgba(255,255,255,0.04); color: var(--text); }

        .cp-list {
          flex: 1; overflow-y: auto; padding: 8px 0 16px;
          scrollbar-width: none;
        }
        .cp-list::-webkit-scrollbar { display: none; }

        .cp-section-label {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 14px 6px;
          font-size: 12px; font-weight: 500; color: var(--text-mid);
          letter-spacing: 0.02em;
        }

        .intent-card {
          margin: 2px 10px; padding: 12px 13px;
          border-radius: 8px; border: 1px solid transparent;
          cursor: pointer; background: var(--bg-card);
          transition: background 0.13s, border-color 0.13s;
          position: relative; overflow: hidden;
        }
        .intent-card::before {
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0; width: 2px;
          background: transparent; transition: background 0.13s;
        }
        .intent-card:hover {
          background: rgba(28,31,46, 0.8);
          border-color: rgba(255,255,255,0.08);
        }
        .intent-card-sel {
          background: var(--bg-sel);
          border-color: rgba(99,179,237,0.3);
        }
        .intent-card-sel::before {
          background: var(--accent);
        }

        .ic-top {
          display: flex; flex-direction: column; gap: 6px;
          margin-bottom: 10px;
        }
        .ic-title {
          font-size: 13.5px; font-weight: 500; color: #e0e6f5;
          line-height: 1.4; word-break: break-word;
        }
        .ic-tags {
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        .ic-tag {
          font-family: var(--mono); font-size: 9.5px;
          padding: 2.5px 6px; border-radius: 4px;
          letter-spacing: 0.02em; font-weight: 500;
        }

        .ic-bottom {
          display: flex; align-items: center; justify-content: space-between;
          font-family: var(--mono); font-size: 10.5px; color: var(--text-mid);
        }
        .ic-user { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 8px;}
        .ic-meta { margin-right: 12px; }
        .ic-time { color: var(--text-dim); flex-shrink: 0; }

        /* ── Right panel (Graph & Bottom Panel) ── */
        .right-panel {
          flex: 1; display: flex; flex-direction: column;
          background: var(--bg-panel); overflow: hidden;
          position: relative;
        }

        .rp-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 18px; height: 52px; border-bottom: 1px solid var(--border);
          background: var(--bg-panel); z-index: 10; flex-shrink: 0;
        }
        .rp-title { font-size: 14px; font-weight: 500; color: #d0d8ec; }
        .rp-header-actions { display: flex; align-items: center; gap: 8px; }

        .rp-icon-btn, .bp-icon-btn {
          background: transparent; border: 1px solid var(--border-hi);
          color: var(--text-mid); padding: 5px 8px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; font-size: 12px; font-family: var(--mono);
        }
        .rp-icon-btn:hover, .bp-icon-btn:hover {
          background: rgba(255,255,255,0.06); color: var(--text); border-color: rgba(255,255,255,0.15);
        }
        .rp-intent-count {
          background: rgba(99,179,237,0.1); border: 1px solid rgba(99,179,237,0.25);
          color: var(--accent); font-family: var(--mono); font-size: 11px; font-weight: 500;
          padding: 5px 12px; border-radius: 6px; transition: all 0.15s;
        }
        .rp-intent-count:hover {
          background: rgba(99,179,237,0.15); border-color: rgba(99,179,237,0.4);
        }

        .rp-body {
          flex: 1; display: flex; flex-direction: column;
          position: relative; overflow: hidden;
        }
        .rp-graph {
          position: relative; width: 100%;
          background: radial-gradient(circle at center, rgba(30,34,50,0.3) 0%, transparent 70%);
          overflow: auto; /* Enable panning */
        }
        .graph-canvas-wrap {
          position: absolute; width: 1200px; height: 800px; /* Large canvas */
        }

        /* ── Graph Node ── */
        .gnode-card {
          background: var(--bg-card2); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; padding: 14px 16px; position: relative; z-index: 2;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: all 0.2s;
        }
        .gnode-card:hover { border-color: rgba(255,255,255,0.15); }
        .gnode-expanded { border-color: rgba(99,179,237,0.4); box-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,179,237,0.1); }
        .gnode-expanded:hover { border-color: rgba(99,179,237,0.5); }

        .gnode-connector {
          position: absolute; right: -6px; top: 55px;
          width: 12px; height: 12px; border-radius: 50%;
          background: var(--bg-card2); border: 2px solid rgba(99,179,237,0.6);
          z-index: 3;
        }

        .gnode-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px; gap: 8px; flex-wrap: wrap;
        }
        .gnode-title {
          font-size: 13.5px; font-weight: 600; color: #e0e6f5; flex: 1;
        }
        .badge-branch {
          background: rgba(167,139,250,0.12); color: #a78bfa; border: 1px solid rgba(167,139,250,0.25);
          font-family: var(--mono); font-size: 10px; padding: 2px 6px; border-radius: 4px;
        }
        .gnode-api {
          color: var(--accent); font-family: var(--mono); font-size: 10.5px;
        }

        .gnode-meta {
          display: flex; justify-content: space-between; align-items: center;
          font-family: var(--mono); font-size: 10.5px; border-top: 1px solid var(--border);
          padding-top: 10px;
        }
        .gnode-view-detail { color: var(--text-mid); cursor: pointer; transition: color 0.1s; }
        .gnode-view-detail:hover { color: #e0e6f5; }
        .gnode-timestamps { display: flex; gap: 6px; color: var(--text-dim); margin-left: auto; }
        .gnode-ts-val { color: var(--text-mid); }

        .gnode-files { border-top: 1px dashed rgba(255,255,255,0.08); margin-top: 10px; padding-top: 4px;}
        .gnode-file-row {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 10px; margin-bottom: 4px; border-radius: 6px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04);
          cursor: pointer; transition: all 0.15s;
        }
        .gnode-file-row:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
        .gnode-file-selected { background: rgba(99,179,237,0.08); border-color: rgba(99,179,237,0.3); }
        .gnode-file-selected:hover { background: rgba(99,179,237,0.12); border-color: rgba(99,179,237,0.4); }

        .gnode-file-name {
          font-family: var(--mono); font-size: 11.5px; color: #d0d8ec; flex: 1;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .gnode-file-badge {
          background: rgba(245,164,66,0.15); color: #f5a442;
          font-family: var(--mono); font-size: 10px; font-weight: 600;
          width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
          border-radius: 4px; border: 1px solid rgba(245,164,66,0.3);
        }

        /* ── Bottom Panel ── */
        .bp-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 16px; height: 44px; border-bottom: 1px solid var(--border);
          background: var(--bg-card);
        }
        .bp-tabs { display: flex; height: 100%; }
        .bp-tab {
          background: transparent; border: none; border-bottom: 2px solid transparent;
          color: var(--text-dim); font-family: var(--mono); font-size: 11px; font-weight: 500;
          padding: 0 16px; transition: all 0.2s; letter-spacing: 0.04em;
        }
        .bp-tab:hover { color: var(--text-mid); }
        .bp-tab-active { color: var(--accent); border-bottom-color: var(--accent); }
        .bp-actions { display: flex; gap: 6px; }

        .bp-body {
          display: flex; flex-direction: column; height: calc(100% - 44px);
          background: var(--bg-panel); overflow-y: auto; padding-bottom: 20px;
        }
        
        .bp-filetree {
          padding: 12px 16px; border-bottom: 1px solid var(--border);
          font-family: var(--mono); font-size: 11.5px;
        }
        .bpft-row { display: flex; align-items: center; margin-bottom: 6px; }
        .bpft-child { padding-left: 20px; }
        .bpft-name { color: #d0d8ec; }
        .bpft-dim { color: var(--text-dim); }

        .bp-summary {
          padding: 12px 16px; font-family: var(--mono); font-size: 11px;
          color: var(--text-mid); border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,0.01);
        }

        .bp-show-diff {
          background: transparent; border: none; color: var(--accent);
          font-family: var(--mono); font-size: 11px; padding: 12px 16px;
          text-align: left; cursor: pointer; transition: color 0.15s;
        }
        .bp-show-diff:hover { color: #90cdf4; }

        .bp-diff {
          font-family: var(--mono); font-size: 12px; line-height: 1.5;
          background: #151722;
        }
        .diff-row {
          display: flex; padding: 0 16px; min-height: 20px;
        }
        .diff-ln { width: 40px; color: var(--text-dim); user-select: none; text-align: right; padding-right: 12px; }
        .diff-prefix { width: 20px; user-select: none; text-align: center; font-weight: bold; }
        .diff-code { flex: 1; white-space: pre; color: #c4ccdf; overflow-x: auto; scrollbar-width: none;}
        .diff-code::-webkit-scrollbar { display: none; }
        
        .diff-collapsed-row {
          background: rgba(255,255,255,0.02); color: var(--text-mid);
          padding: 4px 16px 4px 56px; cursor: pointer; user-select: none;
          font-size: 11px; border-top: 1px dashed rgba(255,255,255,0.05);
          border-bottom: 1px dashed rgba(255,255,255,0.05); transition: background 0.1s;
        }
        .diff-collapsed-row:hover { background: rgba(255,255,255,0.04); }

        /* Agent Reasoning Tab */
        .bp-agent { padding: 24px 32px; max-width: 800px; margin: 0 auto; }
        .agent-header {
          font-size: 16px; font-weight: 600; color: #e0e6f5; margin-bottom: 12px;
        }
        .agent-text {
          font-size: 14px; line-height: 1.6; color: #a0aec0; margin-bottom: 24px;
        }
        .agent-text code {
          font-family: var(--mono); background: rgba(255,255,255,0.08);
          padding: 2px 6px; border-radius: 4px; font-size: 12.5px; color: #d0d8ec;
        }
        .agent-affects {
          background: rgba(255,255,255,0.02); border: 1px solid var(--border);
          border-radius: 8px; padding: 16px;
        }
        .agent-affects-label {
          font-family: var(--mono); font-size: 11px; color: var(--text-dim);
          text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;
        }
        .agent-affect-row {
          display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px;
          font-size: 13px;
        }
        .agent-affect-row:last-child { margin-bottom: 0; }
        .agent-affect-file { font-family: var(--mono); color: #e0e6f5; }
        .agent-affect-reason { color: #a0aec0; flex: 1; }

      `}</style>
    </div>
  );
}