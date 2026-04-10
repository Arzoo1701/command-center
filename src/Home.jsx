import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MODULES = [
  {
    key: "ai",
    path: "/chat",
    color: "violet",
    title: "AI Assistant",
    desc: "Conversational intelligence for general queries, drafting, and brainstorming at scale.",
    tag: "CHAT · LLM",
    usage: 72,
    icon: (
      <svg viewBox="0 0 18 18" fill="none" width={18} height={18}>
        <rect x="2" y="3.5" width="14" height="10" rx="2.5" stroke="#a78bfa" strokeWidth="1.4" />
        <circle cx="6.5" cy="8.5" r="1.5" fill="#a78bfa" opacity="0.7" />
        <path d="M9.5 8.5h4" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M9.5 11h2.5" stroke="#a78bfa" strokeWidth="1.3" strokeLinecap="round" opacity="0.45" />
      </svg>
    ),
  },
  {
    key: "rag",
    path: "/documents",
    color: "cyan",
    title: "RAG Documents",
    desc: "Upload PDFs and query your private knowledge base with semantic retrieval.",
    tag: "PDF · RAG",
    usage: 45,
    icon: (
      <svg viewBox="0 0 18 18" fill="none" width={18} height={18}>
        <rect x="2" y="2" width="10" height="13" rx="2" stroke="#22d3ee" strokeWidth="1.4" />
        <path d="M5 5.5h5M5 8h5M5 10.5h3" stroke="#22d3ee" strokeWidth="1.3" strokeLinecap="round" />
        <rect x="10" y="9.5" width="6" height="6.5" rx="1.5" fill="rgba(6,182,212,0.12)" stroke="#22d3ee" strokeWidth="1" />
        <path d="M12 12.5h2M12 14h1" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "code",
    path: "/auditor",
    color: "orange",
    title: "Code Auditor",
    desc: "Scan Python & C++ for vulnerabilities, complexity and Big-O performance analysis.",
    tag: "PYTHON · C++",
    usage: 88,
    icon: (
      <svg viewBox="0 0 18 18" fill="none" width={18} height={18}>
        <path d="M4 5.5l4 4.5-4 4.5" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.5 14.5h3.5" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="2" y="2" width="14" height="4" rx="1.5" fill="rgba(249,115,22,0.1)" stroke="#fb923c" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
  },
  {
    key: "schema",
    path: "/schema",
    color: "pink",
    title: "Schema Architect",
    desc: "Generate full relational database schemas, ERDs, and production-ready SQL instantly.",
    tag: "SQL · ERD",
    usage: 31,
    icon: (
      <svg viewBox="0 0 18 18" fill="none" width={18} height={18}>
        <ellipse cx="9" cy="5.5" rx="6" ry="2.2" stroke="#f472b6" strokeWidth="1.3" />
        <path d="M3 5.5v3.5c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2V5.5" stroke="#f472b6" strokeWidth="1.3" />
        <path d="M3 9v4c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2V9" stroke="#f472b6" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    key: "prep",
    path: "/prep",
    color: "lime",
    title: "Interview Prep",
    desc: "Interactive coding environments, SQL sandbox, and AI-generated study flashcards.",
    tag: "CODE · FLASHCARDS",
    usage: 19,
    icon: (
      <svg viewBox="0 0 18 18" fill="none" width={18} height={18}>
        <path d="M9 3L2 6.5L9 10l7-3.5L9 3z" stroke="#c8f04a" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M4 8.5v3.5c0 1.5 2.5 3 5 3s5-1.5 5-3V8.5" stroke="#c8f04a" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "analytics",
    path: "/analytics",
    color: "blue",
    title: "System Analytics",
    desc: "Real-time telemetry, API latency tracking, and live module usage metrics.",
    tag: "DATA · TELEMETRY",
    usage: 10,
    icon: (
      <svg viewBox="0 0 18 18" fill="none" width={18} height={18}>
        <rect x="3.5" y="10" width="3" height="5" rx="1" stroke="#3b82f6" strokeWidth="1.4" />
        <rect x="7.5" y="6" width="3" height="9" rx="1" stroke="#3b82f6" strokeWidth="1.4" fill="rgba(59,130,246,0.2)" />
        <rect x="11.5" y="2" width="3" height="13" rx="1" stroke="#3b82f6" strokeWidth="1.4" />
      </svg>
    ),
  },
];

const STATS = [
  { num: "6", label: "MODULES ACTIVE" },
  { num: "99.9%", label: "UPTIME" },
  { num: "12ms", label: "API LATENCY" },
  { num: "E2E", label: "ENCRYPTED" },
];

const COLOR_MAP = {
  violet: {
    iconBg: "rgba(124,58,237,0.18)", iconBorder: "rgba(124,58,237,0.25)", hoverBorder: "rgba(124,58,237,0.4)",
    hoverShadow: "0 8px 32px rgba(124,58,237,0.14)", hoverGradient: "linear-gradient(135deg,rgba(124,58,237,0.13) 0%,transparent 55%)",
    tagBg: "rgba(124,58,237,0.15)", tagColor: "#a78bfa", fillColor: "#7c3aed",
  },
  cyan: {
    iconBg: "rgba(6,182,212,0.15)", iconBorder: "rgba(6,182,212,0.22)", hoverBorder: "rgba(6,182,212,0.4)",
    hoverShadow: "0 8px 32px rgba(6,182,212,0.12)", hoverGradient: "linear-gradient(135deg,rgba(6,182,212,0.1) 0%,transparent 55%)",
    tagBg: "rgba(6,182,212,0.12)", tagColor: "#22d3ee", fillColor: "#06b6d4",
  },
  orange: {
    iconBg: "rgba(249,115,22,0.15)", iconBorder: "rgba(249,115,22,0.22)", hoverBorder: "rgba(249,115,22,0.4)",
    hoverShadow: "0 8px 32px rgba(249,115,22,0.12)", hoverGradient: "linear-gradient(135deg,rgba(249,115,22,0.1) 0%,transparent 55%)",
    tagBg: "rgba(249,115,22,0.12)", tagColor: "#fb923c", fillColor: "#f97316",
  },
  pink: {
    iconBg: "rgba(236,72,153,0.15)", iconBorder: "rgba(236,72,153,0.22)", hoverBorder: "rgba(236,72,153,0.4)",
    hoverShadow: "0 8px 32px rgba(236,72,153,0.12)", hoverGradient: "linear-gradient(135deg,rgba(236,72,153,0.1) 0%,transparent 55%)",
    tagBg: "rgba(236,72,153,0.12)", tagColor: "#f472b6", fillColor: "#ec4899",
  },
  lime: {
    iconBg: "rgba(200,240,74,0.15)", iconBorder: "rgba(200,240,74,0.25)", hoverBorder: "rgba(200,240,74,0.4)",
    hoverShadow: "0 8px 32px rgba(200,240,74,0.14)", hoverGradient: "linear-gradient(135deg,rgba(200,240,74,0.13) 0%,transparent 55%)",
    tagBg: "rgba(200,240,74,0.15)", tagColor: "#d9f99d", fillColor: "#c8f04a",
  },
  blue: {
    iconBg: "rgba(59,130,246,0.15)", iconBorder: "rgba(59,130,246,0.25)", hoverBorder: "rgba(59,130,246,0.4)",
    hoverShadow: "0 8px 32px rgba(59,130,246,0.14)", hoverGradient: "linear-gradient(135deg,rgba(59,130,246,0.13) 0%,transparent 55%)",
    tagBg: "rgba(59,130,246,0.15)", tagColor: "#93c5fd", fillColor: "#3b82f6",
  },
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" width={12} height={12}>
      <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ModuleCard({ mod, visible, index }) {
  const [hovered, setHovered] = useState(false);
  const c = COLOR_MAP[mod.color];

  return (
    <Link
      to={mod.path}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        background: "rgba(255,255,255,0.028)",
        border: `1px solid ${hovered ? c.hoverBorder : "rgba(255,255,255,0.065)"}`,
        borderRadius: 14,
        padding: 20,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, opacity 0.5s ease",
        transform: visible ? `translateY(${hovered ? -3 : 0}px)` : "translateY(24px)",
        opacity: visible ? 1 : 0,
        transitionDelay: visible ? `${0.3 + index * 0.08}s` : "0s",
        boxShadow: hovered ? c.hoverShadow : "none",
      }}
    >
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: 14,
          background: hovered ? c.hoverGradient : "transparent",
          transition: "background 0.22s", pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, position: "relative" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: c.iconBg, border: `1px solid ${c.iconBorder}`, flexShrink: 0 }}>
          {mod.icon}
        </div>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", opacity: hovered ? 1 : 0, transition: "opacity 0.2s", color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>
          <ArrowIcon />
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4, position: "relative" }}>{mod.title}</div>
      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.32)", lineHeight: 1.55, position: "relative" }}>{mod.desc}</div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.055)", position: "relative" }}>
        <span style={{ fontSize: 9.5, fontWeight: 600, padding: "3px 8px", borderRadius: 10, letterSpacing: "0.06em", background: c.tagBg, color: c.tagColor }}>
          {mod.tag}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 44, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${mod.usage}%`, borderRadius: 2, background: c.fillColor, transition: "width 1.2s ease", transitionDelay: visible ? `${0.6 + index * 0.1}s` : "0s" }} />
          </div>
          <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.22)" }}>{mod.usage}%</span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 2 }}>
      
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.04)", transform: visible ? "translateY(0)" : "translateY(-12px)",
        opacity: visible ? 1 : 0, transition: "transform 0.4s ease, opacity 0.4s ease", transitionDelay: "0.1s",
        flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Workspace</span>
          <span style={{ color: "rgba(255,255,255,0.12)", fontSize: 12 }}>/</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>Home</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "4px 10px", fontSize: 11, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
            <svg viewBox="0 0 12 12" fill="none" width={12} height={12}><circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2"/><path d="M8 8l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            Search
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "1px 5px", fontSize: 9.5, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>⌘K</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "4px 10px", fontSize: 11, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "blink 2.4s ease-in-out infinite" }} />
            All systems live
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        <div style={{
          padding: "40px 32px 24px", textAlign: "center",
          transform: visible ? "translateY(0)" : "translateY(16px)", opacity: visible ? 1 : 0,
          transition: "transform 0.5s ease, opacity 0.5s ease", transitionDelay: "0.15s",
        }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa", fontSize: 10.5, fontWeight: 600, padding: "5px 14px", borderRadius: 20, marginBottom: 18, letterSpacing: "0.06em" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#a78bfa", animation: "pulse 1.6s ease-in-out infinite" }} />
            WORKSPACE TERMINAL
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.08, marginBottom: 10 }}>
            Your intelligent <span style={{ background: "linear-gradient(95deg,#a78bfa 0%,#22d3ee 45%,#f472b6 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>command center</span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
            Select a specialized module to initialize your workflow. All data processed securely through the local API gateway.
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 20 }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{ display: "flex", gap: 32 }}>
                {i > 0 && <div style={{ width: 1, background: "rgba(255,255,255,0.08)", alignSelf: "stretch" }} />}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", background: "linear-gradient(90deg,#a78bfa,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", marginTop: 2, letterSpacing: "0.04em" }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, padding: "0 32px 32px" }}>
          {MODULES.map((mod, i) => (
            <ModuleCard key={mod.key} mod={mod} visible={visible} index={i} />
          ))}
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 28px",
        borderTop: "1px solid rgba(255,255,255,0.04)", transform: visible ? "translateY(0)" : "translateY(10px)",
        opacity: visible ? 1 : 0, transition: "transform 0.4s ease, opacity 0.4s ease", transitionDelay: "0.6s",
        flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {[
            { label: "API Gateway Online", color: "#22c55e" },
            { label: "Local Processing Active", color: "#22c55e" },
            { label: "3 jobs queued", color: "#f59e0b" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, color: "rgba(255,255,255,0.2)" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.14)", letterSpacing: "0.04em" }}>
          WORKSPACE TERMINAL · BUILD 2.4.1
        </div>
      </div>
    </div>
  );
}