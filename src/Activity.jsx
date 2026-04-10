import { useEffect, useState } from "react";

export default function ActivityLog() {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    
    const fetchLogs = async () => {
      try {
        const res = await fetch("https://zoo-command-center-api.onrender.com/api/activity");
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs);
        }
      } catch (err) {
        console.error("Failed to fetch activity logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 2 }}>
      
      {/* Topbar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.04)", transform: visible ? "translateY(0)" : "translateY(-12px)",
        opacity: visible ? 1 : 0, transition: "transform 0.4s ease, opacity 0.4s ease", transitionDelay: "0.1s",
        flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Workspace</span>
          <span style={{ color: "rgba(255,255,255,0.12)", fontSize: 12 }}>/</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>Activity Log</span>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
          Showing latest 100 events
        </div>
      </div>

      <div style={{ padding: "32px", flex: 1, display: "flex", flexDirection: "column", maxWidth: "1200px", margin: "0 auto", width: "100%", overflow: "hidden" }}>
        
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px",
          transform: visible ? "translateY(0)" : "translateY(16px)", opacity: visible ? 1 : 0,
          transition: "transform 0.5s ease, opacity 0.5s ease", transitionDelay: "0.15s",
        }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", margin: 0 }}>System Audit Trail</h1>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
              A complete, immutable record of all API executions and module interactions.
            </div>
          </div>
        </div>

        {/* The Glassmorphism Table */}
        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", 
          borderRadius: 14, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
          transform: visible ? "translateY(0)" : "translateY(20px)", opacity: visible ? 1 : 0,
          transition: "all 0.5s ease", transitionDelay: "0.2s",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}>
          
          {/* Table Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 3fr 2fr", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.4)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>
            <div>Event ID</div>
            <div>Module</div>
            <div>Action Executed</div>
            <div>Timestamp</div>
          </div>

          {/* Table Body (Scrollable) */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Connecting to database...</div>
            ) : logs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>No activity recorded yet.</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} style={{ 
                  display: "grid", gridTemplateColumns: "1fr 2fr 3fr 2fr", padding: "14px 24px", 
                  borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: 13, alignItems: "center",
                  transition: "background 0.2s", cursor: "default"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>#{String(log.id).padStart(4, '0')}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: log.color, boxShadow: `0 0 8px ${log.color}80` }} />
                    <span style={{ color: "#fff", fontWeight: 500 }}>{log.tool}</span>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.7)" }}>{log.action}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)" }}>{log.time}</div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}