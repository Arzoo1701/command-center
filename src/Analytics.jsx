import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// --- Fallback Mock Data (Used before the server responds) ---
const INITIAL_STATS = [
  { label: "TOTAL QUERIES", value: "0", trend: "Loading...", color: "#22c55e" },
  { label: "DOCS PROCESSED", value: "0", trend: "Loading...", color: "#22d3ee" },
  { label: "AVG RESPONSE", value: "0s", trend: "Loading...", color: "#22c55e" },
  { label: "SESSIONS", value: "0", trend: "Loading...", color: "#f43f5e" }
];

const INITIAL_ACTIVITY = [
  { tool: "System", action: "Awaiting data...", time: "Now", color: "#64748b" }
];

const INITIAL_CHART = [
  { name: "Mon", queries: 0 }, { name: "Tue", queries: 0 },
  { name: "Wed", queries: 0 }, { name: "Thu", queries: 0 },
  { name: "Fri", queries: 0 }, { name: "Sat", queries: 0 },
  { name: "Sun", queries: 0 },
];

// --- Static Data (We will leave these hardcoded for the MVP) ---
const TOOL_USAGE = [
  { name: "AI Assistant", percent: 88, uses: "2,506 uses", color: "#a78bfa" },
  { name: "Documents", percent: 62, uses: "143 docs", color: "#22d3ee" },
  { name: "Code Auditor", percent: 45, uses: "89 scans", color: "#fb923c" },
  { name: "Schema", percent: 28, uses: "34 schemas", color: "#f472b6" },
  { name: "Interview Prep", percent: 19, uses: "22 solves", color: "#c8f04a" },
  { name: "Activity Log", percent: 10, uses: "53 views", color: "#64748b" },
];

const SYSTEM_STATUS = [
  { label: "API latency", value: "1.3ms", color: "#22c55e" },
  { label: "Uptime", value: "99.98%", color: "#22c55e" },
  { label: "Storage used", value: "2.4 / 5 GB", color: "#f59e0b" },
  { label: "Tokens this month", value: "847k / 2M", color: "#3b82f6" },
];

// Custom Tooltip design so it matches the Glassmorphism vibe
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "rgba(10,10,10,0.85)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 16px", borderRadius: "8px", backdropFilter: "blur(10px)", boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }}>
        <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</p>
        <p style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "#22d3ee", textShadow: "0 0 10px rgba(34,211,238,0.4)" }}>
          {payload[0].value} queries
        </p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [visible, setVisible] = useState(false);
  
  // ✨ NEW: State to hold the live data from your Python backend
  const [data, setData] = useState({
    stats: INITIAL_STATS,
    recent_activity: INITIAL_ACTIVITY,
    chart_data: INITIAL_CHART
  });

  // ✨ NEW: Fetch Live Data Loop
  useEffect(() => {
    // 1. Entrance Animation Trigger
    const timer = setTimeout(() => setVisible(true), 80);
    
    // 2. Fetch Data Function
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/analytics");
        if (res.ok) {
          const dbData = await res.json();
          setData(prev => ({
            ...prev,
            stats: dbData.stats,
            recent_activity: dbData.recent_activity.length > 0 ? dbData.recent_activity : prev.recent_activity,
            chart_data: dbData.chart_data
          }));
        }
      } catch (err) {
        console.error("Failed to fetch live analytics. Is the server running?");
      }
    };

    // Run immediately, then check every 5 seconds
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const cardStyle = {
    background: "rgba(255,255,255,0.028)",
    border: "1px solid rgba(255,255,255,0.065)",
    borderRadius: 14,
    padding: 24,
    position: "relative",
    overflow: "hidden",
  };

  const titleStyle = {
    fontSize: 12,
    fontWeight: 700,
    color: "rgba(255,255,255,0.8)",
    letterSpacing: "0.02em",
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between"
  };

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", overflowY: "auto", overflowX: "hidden", position: "relative", zIndex: 2, paddingBottom: "40px" }}>
      
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
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>Analytics</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "4px 10px", fontSize: 11, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "blink 2.4s ease-in-out infinite" }} />
            System healthy
          </div>
        </div>
      </div>

      <div style={{ padding: "32px", flex: 1, display: "flex", flexDirection: "column", gap: 24, maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          transform: visible ? "translateY(0)" : "translateY(16px)", opacity: visible ? 1 : 0,
          transition: "transform 0.5s ease, opacity 0.5s ease", transitionDelay: "0.15s",
        }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", margin: 0 }}>Analytics</h1>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }} />
              Live Database Feed
            </div>
          </div>
        </div>

        {/* STATS ROW (Now using `data.stats`) */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16,
          transform: visible ? "translateY(0)" : "translateY(20px)", opacity: visible ? 1 : 0,
          transition: "all 0.5s ease", transitionDelay: "0.2s"
        }}>
          {data.stats.map((s, i) => (
            <div key={i} style={{...cardStyle, padding: "20px 24px"}}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", marginBottom: 12 }}>{s.label}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: s.color, fontWeight: 500 }}>{s.trend}</div>
            </div>
          ))}
        </div>

        {/* MIDDLE ROW (Chart + Recent Activity) */}
        <div style={{
          display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 16,
          transform: visible ? "translateY(0)" : "translateY(20px)", opacity: visible ? 1 : 0,
          transition: "all 0.5s ease", transitionDelay: "0.3s"
        }}>
          
          {/* Recharts Glowing Area Chart (Now using `data.chart_data`) */}
          <div style={{ ...cardStyle, minHeight: 320, display: "flex", flexDirection: "column" }}>
            <div style={titleStyle}>
              <span>Usage this week</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>QUERIES / DAY</span>
            </div>
            <div style={{ flex: 1, width: "100%", height: "100%", marginTop: "10px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chart_data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                 <defs>
                    <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient> 
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="queries" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" activeDot={{ r: 6, fill: "#22d3ee", stroke: "#000", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity (Now using `data.recent_activity`) */}
          <div style={cardStyle}>
            <div style={titleStyle}>
              <span>Recent activity</span>
              <span style={{ fontSize: 10, color: "#a78bfa" }}>LIVE</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {data.recent_activity.map((act, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: act.color, marginTop: 5, boxShadow: `0 0 10px ${act.color}80` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{act.tool} <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>— {act.action}</span></div>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{act.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW (Static Tool Usage + System Status for MVP) */}
        <div style={{
          display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 16,
          transform: visible ? "translateY(0)" : "translateY(20px)", opacity: visible ? 1 : 0,
          transition: "all 0.5s ease", transitionDelay: "0.4s"
        }}>
          {/* Tool Breakdown */}
          <div style={cardStyle}>
            <div style={titleStyle}>
              <span>Tool usage breakdown</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>ALL TIME</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {TOOL_USAGE.map((tool, i) => (
                <div key={i} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.03)", padding: 16, borderRadius: 10 }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 12 }}>{tool.name}</div>
                  <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
                    <div style={{ width: `${tool.percent}%`, height: "100%", background: tool.color, borderRadius: 2 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                    <span>{tool.percent}%</span>
                    <span>— {tool.uses}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div style={cardStyle}>
            <div style={titleStyle}>System status</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SYSTEM_STATUS.map((sys, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: 8 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{sys.label}</span>
                  <span style={{ fontSize: 12, color: sys.color, fontWeight: 500 }}>{sys.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}