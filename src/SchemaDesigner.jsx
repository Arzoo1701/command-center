import { useState, useCallback } from "react";

// ─── Initial Empty State ──────────────────────────────────────────────────────

const INITIAL_TABLES = [
  {
    name: "awaiting_input",
    fields: [{ name: "id", type: "uuid", pk: true }],
  }
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const css = {
  wrap: {
    fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
    background: "rgba(5, 5, 5, 0.7)", // ✨ Slightly darker to make the glow pop
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    boxShadow: "0 0 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.02)",
    color: "#e8e6e0",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "relative", // ✨ Needed for the absolute orbs
    zIndex: 1,
  },
  
  // ✨ NEW: The Ambient Background Orbs
  orbLeft: {
    position: "absolute",
    top: "-10%",
    left: "-5%",
    width: "500px",
    height: "500px",
    background: "rgba(200, 240, 74, 0.15)",
    filter: "blur(120px)",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: -1,
  },
  orbRight: {
    position: "absolute",
    bottom: "-20%",
    right: "-5%",
    width: "600px",
    height: "600px",
    background: "rgba(125, 211, 252, 0.1)", // Soft cyan glow
    filter: "blur(150px)",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: -1,
  },

  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: 52,
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    flexShrink: 0,
    zIndex: 10,
  },
  logoArea: { display: "flex", alignItems: "center", gap: 15 },
  logoBox: {
    width: 28,
    height: 28,
    background: "#c8f04a",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 15px rgba(200,240,74,0.4)", // ✨ Logo Glow
  },
  logoText: { fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: "#fff", textShadow: "0 0 10px rgba(255,255,255,0.3)" },
  topRight: { display: "flex", gap: 8 },
  btnOutline: {
    fontSize: 11,
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "#ccc",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  
  // Command Bar
  commandBar: {
    padding: "20px 24px",
    background: "rgba(0,0,0,0.5)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    gap: "16px",
    alignItems: "center",
    zIndex: 10,
  },
  commandInput: {
    flex: 1,
    height: "45px",
    fontSize: 14,
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    padding: "0 16px",
    fontFamily: "inherit",
    color: "#fff",
    background: "rgba(0,0,0,0.6)",
    outline: "none",
    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)",
    transition: "border 0.3s",
  },
  
  // ✨ UPGRADED: Radioactive Generate Button
  generateBtn: {
    height: "45px",
    padding: "0 28px",
    fontSize: 13,
    borderRadius: "8px",
    border: "1px solid rgba(200,240,74,0.6)",
    background: "linear-gradient(135deg, #c8f04a 0%, #9dbf36 100%)",
    color: "#050505",
    cursor: "pointer",
    fontWeight: 800,
    letterSpacing: "0.5px",
    boxShadow: "0 0 20px rgba(200,240,74,0.4), inset 0 2px 5px rgba(255,255,255,0.4)",
    textShadow: "0 1px 0 rgba(255,255,255,0.3)",
    transition: "all 0.3s",
  },

  body: {
    display: "grid",
    gridTemplateColumns: "300px 1fr", 
    flex: 1,
    overflow: "hidden",
    zIndex: 10,
  },
  leftPanel: {
    borderRight: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    flexDirection: "column",
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(10px)",
    overflow: "hidden",
  },
  panelHead: {
    padding: "16px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: 11,
    fontWeight: 700,
    color: "#a1a1aa",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  tableList: { flex: 1, overflowY: "auto", padding: 16 },
  tblCard: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  
  // ✨ UPGRADED: Glowing Selected Table Card
  tblCardSel: {
    border: "1px solid rgba(200,240,74,0.6)",
    background: "linear-gradient(90deg, rgba(200,240,74,0.1) 0%, rgba(0,0,0,0) 100%)",
    boxShadow: "0 0 15px rgba(200,240,74,0.15), inset 3px 0 0 #c8f04a",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
    cursor: "pointer",
  },
  tblHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    background: "rgba(0,0,0,0.6)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  tblName: { fontSize: 13, fontWeight: 700, color: "#c8f04a", textShadow: "0 0 8px rgba(200,240,74,0.3)" },
  tblCount: { fontSize: 11, color: "#888" },
  tblFields: { padding: "6px 12px 10px" },
  fieldRow: { display: "flex", alignItems: "center", gap: 8, padding: "3px 0", fontSize: 11 },
  pkBadge: {
    width: 22,
    fontSize: 9,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    background: "linear-gradient(135deg, #FAEEDA 0%, #d4bda0 100%)",
    color: "#633806",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
  },
  fkBadge: { background: "linear-gradient(135deg, #E6F1FB 0%, #b2d4f2 100%)", color: "#0C447C" },
  fieldName: { color: "#e8e6e0", fontSize: 12 },
  fieldType: { marginLeft: "auto", color: "#888", fontSize: 11 },

  rightPanel: { display: "flex", flexDirection: "column", overflow: "hidden", background: "transparent" },
  viewTabs: {
    display: "flex",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.3)",
    flexShrink: 0,
  },
  vtab: {
    fontSize: 12,
    padding: "14px 24px",
    cursor: "pointer",
    color: "#666",
    borderBottom: "2px solid transparent",
    background: "none",
    borderTop: "none", borderLeft: "none", borderRight: "none",
    fontWeight: 600,
  },
  vtabActive: {
    fontSize: 12,
    padding: "14px 24px",
    cursor: "pointer",
    color: "#c8f04a",
    fontWeight: 700,
    borderBottom: "2px solid #c8f04a",
    background: "linear-gradient(0deg, rgba(200,240,74,0.1) 0%, rgba(0,0,0,0) 100%)", // Slight glow under tab
    borderTop: "none", borderLeft: "none", borderRight: "none",
    textShadow: "0 0 10px rgba(200,240,74,0.4)",
  },
  
  canvasArea: { 
    flex: 1, 
    overflowY: "auto", 
    padding: 30,
    backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
    backgroundPosition: "0 0"
  },
  schemaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
    alignItems: "start",
    gap: 30, 
  },
  
  // ✨ UPGRADED: Glassmorphism Schema Tables
  schemaTbl: {
    background: "linear-gradient(180deg, rgba(15,15,15,0.8) 0%, rgba(5,5,5,0.95) 100%)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(200, 240, 74, 0.3)", 
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(200,240,74,0.05)",
  },
  schemaTblHead: {
    padding: "14px 16px",
    background: "linear-gradient(90deg, rgba(200,240,74,0.15) 0%, rgba(200,240,74,0.05) 100%)",
    borderBottom: "1px solid rgba(200,240,74,0.2)",
  },
  schemaTblTitle: { fontSize: 14, fontWeight: 800, color: "#c8f04a", display: "flex", alignItems: "center", gap: "8px", textShadow: "0 0 10px rgba(200,240,74,0.3)" },
  schemaField: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    fontSize: 12,
  },
  sfName: { color: "#f4f4f5", fontWeight: 500 },
  sfType: { marginLeft: "auto", color: "#71717a", fontSize: 11, fontFamily: "monospace" },

  sqlArea: { flex: 1, padding: "30px", fontSize: 14, lineHeight: 2, color: "#e8e6e0", overflowY: "auto" },
  relPanel: { flex: 1, overflowY: "auto", padding: 30 },
  relItem: {
    display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
    border: "1px solid rgba(125, 211, 252, 0.2)", 
    background: "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(125,211,252,0.05) 100%)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    borderRadius: 12, marginBottom: 16, fontSize: 13,
  },
  relFrom: { fontWeight: 800, color: "#c8f04a", textShadow: "0 0 8px rgba(200,240,74,0.3)" },
  relArrow: { color: "#666", fontSize: 16 },
  relTo: { fontWeight: 800, color: "#7dd3fc", textShadow: "0 0 8px rgba(125,211,252,0.4)" },
  relTypeBadge: { marginLeft: "auto", fontSize: 11, padding: "4px 10px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" },

  aiPane: { flex: 1, overflowY: "auto", padding: 30, display: "flex", flexDirection: "column" },
  aiReportCard: {
    padding: "24px",
    border: "1px solid rgba(200,240,74,0.2)",
    background: "linear-gradient(180deg, rgba(200,240,74,0.05) 0%, rgba(0,0,0,0.6) 100%)",
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.8,
    color: "#e8e6e0",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
    marginBottom: "24px"
  },
};

function Badge({ pk, fk }) {
  if (pk) return <span style={{ ...css.pkBadge }}>PK</span>;
  if (fk) return <span style={{ ...css.pkBadge, ...css.fkBadge }}>FK</span>;
  return <span style={{ width: 22, flexShrink: 0 }} />;
}

function AiView({ loading, response, onSuggest }) {
  return (
    <div style={css.aiPane}>
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0" }}>
          <div style={{ width: 8, height: 8, background: "#c8f04a", borderRadius: "50%", boxShadow: "0 0 10px #c8f04a" }}></div>
          <span style={{ fontSize: 13, color: "#c8f04a", marginLeft: 4, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>AI is architecting...</span>
        </div>
      ) : response ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <div style={css.aiReportCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#c8f04a', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              Architectural Summary
            </div>
            {typeof response === 'string' ? response : JSON.stringify(response)}
          </div>

          <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
            <h4 style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Expand Architecture</h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => onSuggest("Add user authentication, passwords, and role-based access levels.")} style={{...css.btnOutline, background: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.1)"}}>+ Add Auth & Roles</button>
              <button onClick={() => onSuggest("Add a billing, invoices, and payments module to this schema.")} style={{...css.btnOutline, background: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.1)"}}>💳 Add Payments</button>
              <button onClick={() => onSuggest("Optimize this schema for millions of records. What indexes do I need?")} style={{...css.btnOutline, background: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.1)"}}>⚡ Optimize Indexes</button>
            </div>
          </div>

        </div>
      ) : (
        <div style={{ fontSize: 13, color: "#666", padding: "12px 0", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 12, textAlign: "center", padding: 40 }}>
          Generate a schema to see detailed AI design insights here.
        </div>
      )}
    </div>
  );
}

export default function DataSchemaDesigner() {
  const [description, setDescription] = useState("");
  const [activeView, setActiveView] = useState("Schema"); 
  const [selectedTable, setSelectedTable] = useState(0);
  
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [relations, setRelations] = useState([]);
  
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [copied, setCopied] = useState(false);

  const callAI = useCallback(async (promptText) => {
    const finalPrompt = typeof promptText === "string" ? promptText : description;
    if (!finalPrompt.trim()) return;

    setAiLoading(true);
    setAiResponse("AI is architecting...");
    
    try {
      const res = await fetch("http://localhost:8000/api/schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        try {
          let cleanJson = data.response.replace(/```json/gi, "").replace(/```/gi, "").trim();
          const parsedData = JSON.parse(cleanJson);
          
          if (parsedData.tables && Array.isArray(parsedData.tables)) setTables(parsedData.tables);
          if (parsedData.relations && Array.isArray(parsedData.relations)) setRelations(parsedData.relations);
          
          if (parsedData.explanation) {
            setAiResponse(parsedData.explanation);
          } else {
            setAiResponse("Architecture successfully updated. No additional insights provided.");
          }
          
          setActiveView("Schema"); 
          
        } catch (parseError) {
          console.error("JSON Parsing failed.", parseError);
          setAiResponse("Failed to parse visual data. Raw response:\n\n" + data.response);
          setActiveView("AI Insights");
        }
      } else {
        setAiResponse("Server Error: " + data.detail);
      }
    } catch (e) {
      console.error(e);
      setAiResponse("Error contacting AI. Is your Python server running on port 8000?");
    } finally {
      setAiLoading(false);
    }
  }, [description]);

  const handleGenerate = () => {
    if (!description.trim()) return;
    
    const strictPrompt = `
      You are a senior database architect. The user is building: "${description}".
      
      You MUST respond ONLY with a raw JSON object. Do not include any text outside the JSON. Do not use markdown backticks like \`\`\`json.
      
      The JSON MUST follow exactly this structure:
      {
        "tables": [
          {
            "name": "table_name",
            "fields": [
              { "name": "id", "type": "uuid", "pk": true, "fk": false },
              { "name": "field_name", "type": "varchar(255)", "pk": false, "fk": false }
            ]
          }
        ],
        "relations": [
          { "from": "table_name", "to": "other_table", "type": "one-to-many" }
        ],
        "explanation": "Write a highly detailed, 3-paragraph architectural report. Explain why you chose these specific tables, how they interact, and any specific design patterns (like normalization) you used. Be thorough."
      }
    `;
    callAI(strictPrompt);
  };

  const handleQuickAction = (actionText) => {
    const newDesc = description + " " + actionText;
    setDescription(newDesc); 
    
    const strictPrompt = `
      You are a senior database architect. The user is updating their schema to include: "${newDesc}".
      
      You MUST respond ONLY with a raw JSON object. Do not include any text outside the JSON. Do not use markdown backticks like \`\`\`json.
      
      The JSON MUST follow exactly this structure:
      {
        "tables": [
          {
            "name": "table_name",
            "fields": [
              { "name": "id", "type": "uuid", "pk": true, "fk": false },
              { "name": "field_name", "type": "varchar(255)", "pk": false, "fk": false }
            ]
          }
        ],
        "relations": [
          { "from": "table_name", "to": "other_table", "type": "one-to-many" }
        ],
        "explanation": "Write a highly detailed architectural report explaining the new additions, why they were needed, and how they integrate with the existing tables."
      }
    `;
    callAI(strictPrompt);
  };

  const handleExportSQL = () => {
    const sql = tables.map(t =>
      `CREATE TABLE ${t.name} (\n` +
      t.fields.map((f, i) =>
        `  ${f.name.padEnd(16)} ${f.type.toUpperCase()}${f.pk ? " PRIMARY KEY" : ""}${i < t.fields.length - 1 ? "," : ""}`
      ).join("\n") +
      "\n);"
    ).join("\n\n");
    navigator.clipboard?.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const views = ["Schema", "SQL", "Relations", "AI Insights"];

  return (
    <div style={css.wrap}>
      
      {/* ✨ NEW: Ambient Background Orbs */}
      <div style={css.orbLeft} />
      <div style={css.orbRight} />

      {/* TOPBAR */}
      <div style={css.topbar}>
        <div style={css.logoArea}>
          <div style={css.logoBox}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#0d0d0d"><rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" /><rect x="1" y="9" width="6" height="6" rx="1" /><path d="M12 9v6M9 12h6" stroke="#0d0d0d" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
          <span style={css.logoText}>SCHEMA ARCHITECT</span>
        </div>
        <div style={css.topRight}>
          <button style={css.btnOutline} onClick={handleExportSQL}>{copied ? "Copied!" : "Export SQL"}</button>
        </div>
      </div>

      {/* COMMAND BAR */}
      <div style={css.commandBar}>
        <input 
          style={css.commandInput}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your app (e.g. A school management system with students, teachers, classes, and grades)..."
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />
        <button style={css.generateBtn} onClick={handleGenerate} disabled={aiLoading}>
          {aiLoading ? "Architecting..." : "Generate Schema ↗"}
        </button>
      </div>

      {/* BODY */}
      <div style={css.body}>
        
        {/* LEFT PANEL */}
        <div style={css.leftPanel}>
          <div style={css.panelHead}>
            <span>Database Tables</span>
          </div>
          <div style={css.tableList}>
            {tables.map((t, i) => (
              <div key={t.name} style={selectedTable === i ? css.tblCardSel : css.tblCard} onClick={() => setSelectedTable(i)}>
                <div style={css.tblHead}>
                  <span style={css.tblName}>{t.name}</span>
                  <span style={css.tblCount}>{t.fields?.length || 0} fields</span>
                </div>
                <div style={css.tblFields}>
                  {t.fields?.slice(0, 3).map((f) => (
                    <div key={f.name} style={css.fieldRow}>
                      <Badge pk={f.pk} fk={f.fk} />
                      <span style={css.fieldName}>{f.name}</span>
                      <span style={css.fieldType}>{f.type}</span>
                    </div>
                  ))}
                  {(t.fields?.length || 0) > 3 && (
                    <div style={{ fontSize: 11, color: "#666", paddingLeft: 30, marginTop: 4 }}>+{(t.fields?.length || 0) - 3} more</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={css.rightPanel}>
          <div style={css.viewTabs}>
            {views.map((v) => (
              <button key={v} style={activeView === v ? css.vtabActive : css.vtab} onClick={() => setActiveView(v)}>
                {v} {v === "AI Insights" && aiLoading && <span style={{ marginLeft: 6, color: "#c8f04a", textShadow: "0 0 10px #c8f04a" }}>●</span>}
              </button>
            ))}
          </div>

          {activeView === "Schema" && (
            <div style={css.canvasArea}>
              <div style={css.schemaGrid}>
                {tables.map((t) => (
                  <div key={t.name} style={css.schemaTbl}>
                    <div style={css.schemaTblHead}>
                      <div style={css.schemaTblTitle}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                        {t.name}
                      </div>
                    </div>
                    {t.fields?.map((f) => (
                      <div key={f.name} style={css.schemaField}>
                        <Badge pk={f.pk} fk={f.fk} />
                        <span style={css.sfName}>{f.name}</span>
                        <span style={css.sfType}>{f.type}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === "SQL" && (
            <div style={css.sqlArea}>
              {tables.map((t) => (
                <div key={t.name} style={{ marginBottom: 24, padding: "20px", background: "rgba(0,0,0,0.4)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ color: "#7dd3fc" }}>CREATE TABLE</span> <span style={{ color: "#c8f04a", fontWeight: "bold" }}>{t.name}</span> ({"\n"}
                  {t.fields?.map((f, i) => (
                    <span key={f.name}>  {f.name.padEnd(16)} <span style={{ color: "#f9a8d4" }}>{f.type.toUpperCase()}</span>{f.pk ? <span style={{color:"#fbbf24"}}> PRIMARY KEY</span> : ""}{i < t.fields.length - 1 ? "," : ""}{"\n"}</span>
                  ))}
                  );{"\n"}
                </div>
              ))}
            </div>
          )}

          {activeView === "Relations" && (
            <div style={css.relPanel}>
              {relations.map((r, i) => (
                <div key={i} style={css.relItem}>
                  <span style={css.relFrom}>{r.from}</span>
                  <span style={css.relArrow}>→</span>
                  <span style={css.relTo}>{r.to}</span>
                  <span style={css.relTypeBadge}>{r.type}</span>
                </div>
              ))}
              {relations.length === 0 && !aiLoading && (
                <div style={{ color: "#666", fontSize: 14, textAlign: "center", marginTop: 40 }}>No relationships defined yet.</div>
              )}
            </div>
          )}

          {activeView === "AI Insights" && (
            <AiView loading={aiLoading} response={aiResponse} onSuggest={handleQuickAction} />
          )}
        </div>
      </div>
    </div>
  );
}