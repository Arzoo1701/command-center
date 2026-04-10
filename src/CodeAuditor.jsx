import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldAlert, Zap, Code2, Play,
  Loader2, ClipboardPaste, CheckCircle, XCircle,
  ChevronRight, Clock, Cpu, FileCode, RotateCcw
} from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

/* ─── Circular Score Gauge ─────────────────────────────────────── */
const ScoreGauge = ({ score }) => {
  const [anim, setAnim] = useState(0)
  useEffect(() => { const t = setTimeout(() => setAnim(score), 120); return () => clearTimeout(t) }, [score])
  const r = 26, circ = 2 * Math.PI * r
  const color = score >= 80 ? "#3dba7c" : score >= 55 ? "#f5a623" : "#e05555"
  const label = score >= 80 ? "Healthy" : score >= 55 ? "Warning" : "Critical"
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <svg style={{ transform: "rotate(-90deg)" }} width="64" height="64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - (anim / 100) * circ}
            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 6px ${color}88)` }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{anim}</span>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#6b8cae", marginBottom: 2, letterSpacing: "0.05em" }}>Score</div>
        <div style={{ fontSize: 12, fontWeight: 600, color }}>{label}</div>
      </div>
    </div>
  )
}

/* ─── Severity Badge ───────────────────────────────────────────── */
const SeverityBadge = ({ level = "high" }) => {
  const map = {
    high:   { bg: "#2a0d0d", color: "#e05555", border: "#4a1515", label: "High" },
    medium: { bg: "#221a0d", color: "#f5a623", border: "#3a2a10", label: "Medium" },
    low:    { bg: "#0d2214", color: "#3dba7c", border: "#1a4030", label: "Low" },
  }
  const s = map[level] || map.high
  return (
    <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 4,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      letterSpacing: "0.08em", textTransform: "uppercase" }}>
      {s.label}
    </span>
  )
}

/* ─── Main Component ───────────────────────────────────────────── */
export default function CodeAuditor() {
  const [codeInput, setCodeInput] = useState(
`# Paste your Python or C++ code here...

def process_data(data):
    for i in range(len(data)):
        for j in range(len(data)):
            print(data[i], data[j])
`)
  const [isAuditing, setIsAuditing]     = useState(false)
  const [activeTab, setActiveTab]       = useState("vulnerabilities")
  const [auditResults, setAuditResults] = useState(null)
  const [isEditing, setIsEditing]       = useState(true)
  const [scanLine, setScanLine]         = useState(0)

  useEffect(() => {
    if (!isAuditing) return
    const lines = codeInput.split("\n").length
    let i = 0
    const id = setInterval(() => { i = (i + 1) % lines; setScanLine(i) }, 80)
    return () => clearInterval(id)
  }, [isAuditing, codeInput])

  const handlePaste = async () => {
    try { const t = await navigator.clipboard.readText(); setCodeInput(t); setIsEditing(true) }
    catch { alert("Clipboard access denied. Paste manually with Ctrl+V.") }
  }

  const runAudit = async () => {
    setIsAuditing(true); setIsEditing(false)
    try {
      const res = await fetch("https://zoo-command-center-api.onrender.com/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput }),
      })
      if (res.ok) {
        const data = await res.json()
        const n = data.vulnerabilities?.length ?? 0
        const score = Math.max(15, 100 - n * 18)
        setAuditResults({ ...data, score })
      } else { alert("Server error — check your Python terminal.") }
    } catch { alert("Could not connect to backend on port 8000.") }
    finally { setIsAuditing(false) }
  }

  const card = {
    background: "#0c1220", border: "1px solid #1e2d45",
    borderRadius: 14, overflow: "hidden",
    display: "flex", flexDirection: "column",
  }

  const cardHeader = {
    padding: "12px 16px", borderBottom: "1px solid #1e2d45",
    background: "#0a1018", display: "flex", alignItems: "center",
    gap: 8, flexShrink: 0,
  }

  return (
    <div style={{
      width: "100%", height: "100vh", background: "#080c14",
      display: "flex", flexDirection: "column", overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ── TOP NAV BAR ── */}
      <div style={{
        padding: "0 24px", height: 52, borderBottom: "1px solid #1e2d45",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#0a1018", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg,#1e3a6e,#4f8ef7)",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Code2 size={14} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>
            Work<span style={{ color: "#4f8ef7" }}>space</span>
          </span>
          <span style={{ color: "#1e2d45", margin: "0 4px" }}>|</span>
          <span style={{ fontSize: 12, color: "#6b8cae" }}>Code Auditor</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3dba7c",
            boxShadow: "0 0 6px #3dba7c", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: "#3a5070" }}>AI engine ready</span>
          <div style={{ width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg,#1e3a6e,#4f8ef7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 600, color: "#fff", marginLeft: 8 }}>AZ</div>
        </div>
      </div>

      {/* ── TWO COLUMN LAYOUT ── */}
      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: "1fr 400px",
        gap: 16, padding: 16, overflow: "hidden",
      }}>

        {/* ════ COL 1 — CODE EDITOR ════ */}
        <div style={card}>
          <div style={{ ...cardHeader, justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 5 }}>
                {["#e05555","#f5a623","#3dba7c"].map((c,i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: .7 }} />
                ))}
              </div>
              <span style={{ fontSize: 11, color: "#3a5070", fontFamily: "monospace", marginLeft: 4 }}>
                {isEditing ? "editor.py" : "viewer.py"}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {isEditing && (
                <button onClick={handlePaste} style={{
                  padding: "5px 10px", borderRadius: 7, fontSize: 11,
                  border: "1px solid #1e2d45", background: "transparent",
                  color: "#8aabcc", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <ClipboardPaste size={12} /> Paste
                </button>
              )}
              {!isEditing && (
                <button onClick={() => { setIsEditing(true); setAuditResults(null) }} style={{
                  padding: "5px 10px", borderRadius: 7, fontSize: 11,
                  border: "1px solid #1e2d45", background: "transparent",
                  color: "#8aabcc", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <RotateCcw size={12} /> Reset
                </button>
              )}
              <button onClick={runAudit}
                disabled={isAuditing || !codeInput.trim() || !isEditing}
                style={{
                  padding: "7px 18px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: isAuditing || !isEditing ? "#0d1e3a" : "#1a4090",
                  color: isAuditing || !isEditing ? "#3a5070" : "#7ab3ff",
                  border: `1px solid ${isAuditing || !isEditing ? "#1e2d45" : "#2a5aad"}`,
                  cursor: isAuditing || !isEditing ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: 7,
                  boxShadow: !isAuditing && isEditing ? "0 0 16px #1a4090aa" : "none",
                  transition: "all .2s",
                }}>
                {isAuditing
                  ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Scanning…</>
                  : <><Play size={13} /> Run Audit</>}
              </button>
            </div>
          </div>

          {/* Meta strip */}
          <div style={{ padding: "6px 16px", background: "#080c14",
            borderBottom: "1px solid #1e2d45", display: "flex", gap: 16, flexShrink: 0 }}>
            {[
              { label: "Lines", val: codeInput.split("\n").length },
              { label: "Chars", val: codeInput.length },
              { label: "Language", val: "Python" },
            ].map(({ label, val }) => (
              <span key={label} style={{ fontSize: 10, color: "#3a5070" }}>
                <span style={{ color: "#6b8cae", marginRight: 4 }}>{label}</span>{val}
              </span>
            ))}
          </div>

          {/* Editor body */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#0d1117" }}>
            {isEditing ? (
              <textarea value={codeInput} onChange={e => setCodeInput(e.target.value)}
                spellCheck={false}
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  background: "transparent", color: "#c9d1d9",
                  padding: "20px 20px 20px 24px",
                  fontFamily: "'DM Mono','Fira Code',monospace",
                  fontSize: 13, lineHeight: 1.7, resize: "none",
                  border: "none", outline: "none", caretColor: "#4f8ef7",
                }}
              />
            ) : (
              <div style={{ position: "absolute", inset: 0, overflowY: "auto" }}>
                {isAuditing && (
                  <div style={{
                    position: "absolute", left: 0, right: 0, zIndex: 10,
                    top: `${scanLine * 22}px`, height: 22,
                    background: "linear-gradient(90deg,transparent,#4f8ef722,transparent)",
                    pointerEvents: "none", transition: "top .08s linear",
                  }} />
                )}
                <SyntaxHighlighter language="python" style={vscDarkPlus}
                  showLineNumbers
                  lineNumberStyle={{ color: "#2a4070", fontSize: 11, minWidth: 36 }}
                  wrapLines
                  lineProps={ln => {
                    const hit = auditResults?.vulnerabilities?.some(v => v.line === ln)
                    return { style: {
                      display: "block",
                      background: hit ? "rgba(224,85,85,0.1)" : "transparent",
                      borderLeft: hit ? "3px solid #e05555" : "3px solid transparent",
                    }}
                  }}
                  customStyle={{ margin: 0, padding: "20px 16px", background: "transparent", fontSize: 13, lineHeight: 1.7 }}
                >
                  {codeInput}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>

        {/* ════ COL 2 — RESULTS PANEL ════ */}
        <div style={card}>
          <div style={{ ...cardHeader, justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldAlert size={14} color="#4f8ef7" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#a8c4e0" }}>AI Report</span>
            </div>
            {auditResults && !isAuditing && <ScoreGauge score={auditResults.score} />}
          </div>

          {/* Empty state */}
          {!auditResults && !isAuditing && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "#0a1018",
                border: "1px solid #1e2d45", display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: 16 }}>
                <FileCode size={24} color="#1e2d45" />
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#6b8cae", marginBottom: 6 }}>No audit yet</p>
              <p style={{ fontSize: 11, color: "#3a5070", lineHeight: 1.8, marginBottom: 24 }}>
                Paste your code and hit<br />Run Audit to see results.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                {["Security vulnerabilities","Time & space complexity","Refactored clean code"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 12px", background: "#0a1018", borderRadius: 8, border: "1px solid #141f30" }}>
                    <ChevronRight size={10} color="#2a4070" />
                    <span style={{ fontSize: 11, color: "#3a5070" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scanning state */}
          {isAuditing && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 20 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%",
                  border: "3px solid #1e2d45", borderTopColor: "#4f8ef7",
                  animation: "spin 1s linear infinite" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex",
                  alignItems: "center", justifyContent: "center" }}>
                  <Cpu size={18} color="#4f8ef7" />
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 12, color: "#4f8ef7", fontFamily: "monospace",
                  animation: "pulse 1.5s ease infinite", marginBottom: 4 }}>
                  Neural diagnostics running…
                </p>
                <p style={{ fontSize: 10, color: "#3a5070" }}>Analysing line {scanLine + 1}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "80%" }}>
                {["Parsing AST…","Detecting vulnerabilities…","Calculating complexity…"].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Loader2 size={10} color="#4f8ef7"
                      style={{ animation: `spin ${1 + i * 0.3}s linear infinite` }} />
                    <span style={{ fontSize: 10, color: "#3a5070" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {auditResults && !isAuditing && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ display: "flex", borderBottom: "1px solid #1e2d45", flexShrink: 0 }}>
                {[
                  { icon: <XCircle size={11} color="#e05555" />, val: auditResults.vulnerabilities?.length ?? 0, label: "Issues" },
                  { icon: <Clock size={11} color="#f5a623" />,   val: auditResults.complexity?.time  ?? "—", label: "Time" },
                  { icon: <Zap size={11} color="#3dba7c" />,     val: auditResults.complexity?.space ?? "—", label: "Space" },
                ].map(({ icon, val, label }) => (
                  <div key={label} style={{ flex: 1, padding: "10px 8px", textAlign: "center",
                    borderRight: "1px solid #1e2d45", background: "#080c14" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>{icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", fontFamily: "monospace" }}>{val}</div>
                    <div style={{ fontSize: 9, color: "#3a5070", marginTop: 1 }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", borderBottom: "1px solid #1e2d45", background: "#080c14", flexShrink: 0 }}>
                {[
                  { id: "vulnerabilities", label: "Issues",     color: "#e05555" },
                  { id: "complexity",      label: "Complexity", color: "#f5a623" },
                  { id: "refactored",      label: "Fixed Code", color: "#3dba7c" },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                    flex: 1, padding: "10px 4px", fontSize: 10, fontWeight: 600,
                    letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
                    background: "transparent", border: "none",
                    borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : "2px solid transparent",
                    color: activeTab === tab.id ? tab.color : "#3a5070",
                    transition: "color .2s",
                  }}>{tab.label}</button>
                ))}
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
                <AnimatePresence mode="wait">

                  {activeTab === "vulnerabilities" && (
                    <motion.div key="v" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {auditResults.vulnerabilities?.length === 0 ? (
                        <div style={{ textAlign: "center", paddingTop: 32 }}>
                          <CheckCircle size={32} color="#3dba7c" style={{ margin: "0 auto 12px" }} />
                          <p style={{ fontSize: 12, color: "#3dba7c" }}>No issues found!</p>
                        </div>
                      ) : auditResults.vulnerabilities.map((v, i) => (
                        <div key={i} style={{ background: "#0d0808", border: "1px solid #2a1515",
                          borderRadius: 10, padding: "12px 14px", borderLeft: "3px solid #e05555" }}>
                          <div style={{ display: "flex", alignItems: "center",
                            justifyContent: "space-between", marginBottom: 7 }}>
                            {v.line && (
                              <span style={{ fontSize: 10, fontFamily: "monospace",
                                color: "#e05555", background: "#2a0d0d", padding: "2px 8px", borderRadius: 4 }}>
                                Line {v.line}
                              </span>
                            )}
                            <SeverityBadge level={v.severity ?? "high"} />
                          </div>
                          <p style={{ fontSize: 12, color: "#c8a8a8", lineHeight: 1.7 }}>{v.issue}</p>
                          {v.fix && (
                            <p style={{ fontSize: 11, color: "#3dba7c", marginTop: 8,
                              paddingTop: 8, borderTop: "1px solid #2a1515" }}>↳ {v.fix}</p>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "complexity" && (
                    <motion.div key="c" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ background: "#0a1018", border: "1px solid #1e2d45",
                        borderRadius: 10, padding: "14px 16px",
                        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 10, color: "#3a5070", marginBottom: 4 }}>Time Complexity</div>
                          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace",
                            color: auditResults.complexity?.time?.includes("²") ? "#e05555" : "#4f8ef7" }}>
                            {auditResults.complexity?.time ?? "—"}
                          </div>
                        </div>
                        <Clock size={28} color="#1e2d45" />
                      </div>
                      <div style={{ background: "#0a1018", border: "1px solid #1e2d45",
                        borderRadius: 10, padding: "14px 16px",
                        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 10, color: "#3a5070", marginBottom: 4 }}>Space Complexity</div>
                          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", color: "#3dba7c" }}>
                            {auditResults.complexity?.space ?? "—"}
                          </div>
                        </div>
                        <Zap size={28} color="#1e2d45" />
                      </div>
                      {auditResults.complexity?.reason && (
                        <div style={{ background: "#221a0d", border: "1px solid #3a2a10",
                          borderRadius: 10, padding: "12px 14px", borderLeft: "3px solid #f5a623" }}>
                          <div style={{ fontSize: 10, color: "#f5a623", marginBottom: 6, fontWeight: 600 }}>Analysis</div>
                          <p style={{ fontSize: 12, color: "#c8b88a", lineHeight: 1.7 }}>
                            {auditResults.complexity.reason}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "refactored" && (
                    <motion.div key="r" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                        <CheckCircle size={12} color="#3dba7c" />
                        <span style={{ fontSize: 11, color: "#3dba7c" }}>AI-refactored version</span>
                      </div>
                      <SyntaxHighlighter language="python" style={vscDarkPlus}
                        customStyle={{ borderRadius: 10, border: "1px solid #1e2d45",
                          fontSize: 12, margin: 0, background: "#080c14" }}>
                        {auditResults.refactored ?? "# No refactored code available"}
                      </SyntaxHighlighter>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Sans:wght@400;500;600&family=DM+Mono&display=swap');
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        ::-webkit-scrollbar { width: 4px }
        ::-webkit-scrollbar-track { background: transparent }
        ::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 2px }
      `}</style>
    </div>
  )
}
