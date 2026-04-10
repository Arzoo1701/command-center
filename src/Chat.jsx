import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, SendHorizontal, Bot, Sparkles, TerminalSquare, FileText } from "lucide-react" 
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const COLOR_MAP = {
  violet: { bg: "rgba(124,58,237,0.15)", border: "rgba(124,58,237,0.3)", text: "#a78bfa" },
  cyan: { bg: "rgba(6,182,212,0.15)", border: "rgba(6,182,212,0.3)", text: "#22d3ee" },
  orange: { bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.3)", text: "#fb923c" },
  pink: { bg: "rgba(236,72,153,0.15)", border: "rgba(236,72,153,0.3)", text: "#f472b6" }
};

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])

  const handleSend = async (textOverride = null) => {
    const userText = typeof textOverride === 'string' ? textOverride : input;
    if (!userText.trim() || isLoading) return;
    
    setInput("") 
    setMessages(prev => [...prev, { role: "user", content: userText }])
    setIsLoading(true)
    
    try {
      const response = await fetch("https://zoo-command-center-api.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessages(prev => [...prev, { role: "ai", content: data.response }])
      } else {
        setMessages(prev => [...prev, { role: "ai", content: `Server Error: ${data.detail}` }])
      }

    } catch (error) {
      console.error("Fetch Error:", error);
      setMessages(prev => [...prev, { role: "ai", content: "CRITICAL ERROR: Could not connect to Python Backend. Ensure server is running on port 8000." }])
    } finally {
      setIsLoading(false)
    }
  }

  const SuggestionChip = ({ icon: Icon, color, text }) => {
    const c = COLOR_MAP[color] || COLOR_MAP.violet;
    return (
      <button
        onClick={() => handleSend(text)}
        className="flex items-center gap-4 w-full p-5 text-left rounded-xl transition-all duration-300 group relative overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          e.currentTarget.style.borderColor = c.border;
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = `0 10px 30px ${c.bg}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: c.bg, border: `1px solid ${c.border}`, flexShrink: 0, transition: "transform 0.3s" }} className="group-hover:scale-110">
          <Icon style={{ color: c.text, width: 22, height: 22 }} />
        </div>
        <span className="text-[14px] text-gray-300 group-hover:text-white transition-colors font-medium leading-relaxed pr-2">{text}</span>
      </button>
    )
  }

  return (
    // ✨ CHANGED: Now exactly matches the Home.jsx full-screen flex layout
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 2 }}>
      
      {/* Massive Ambient Orbs spanning the full screen */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Topbar (Matches Home.jsx perfectly) */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.04)", transform: visible ? "translateY(0)" : "translateY(-12px)",
        opacity: visible ? 1 : 0, transition: "transform 0.4s ease, opacity 0.4s ease", transitionDelay: "0.1s",
        flexShrink: 0, background: "rgba(0,0,0,0.2)", backdropFilter: "blur(10px)", zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Workspace</span>
          <span style={{ color: "rgba(255,255,255,0.12)", fontSize: 12 }}>/</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>AI Assistant</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#93c5fd", fontWeight: "bold", letterSpacing: "1px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", animation: "blink 2.4s ease-in-out infinite", boxShadow: "0 0 10px #3b82f6" }} />
            NEURAL ENGINE ONLINE
          </div>
        </div>
      </div>
      
      {/* Chat Area & Dot Matrix Background */}
      <div 
        className="flex-1 overflow-y-auto relative z-1"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      >
        <div className="max-w-4xl mx-auto w-full h-full flex flex-col p-6 lg:p-12 pb-32">
          
          {messages.length === 0 && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center justify-center flex-1 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(59,130,246,0.15)] relative backdrop-blur-md">
                <Sparkles className="w-12 h-12 text-blue-400 relative z-10" />
              </div>
              
              <h2 style={{ fontSize: 48, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 16 }}>
                Ask me <span style={{ background: "linear-gradient(95deg,#a78bfa 0%,#22d3ee 45%,#f472b6 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>anything</span>
              </h2>
              
              <p className="text-gray-400 text-base max-w-[400px] mb-14 leading-relaxed font-medium">
                Your documents, your code, or any general question. Everything stays securely in your workspace.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                <SuggestionChip icon={FileText} color="cyan" text="Summarize the core arguments in my uploaded PDF" />
                <SuggestionChip icon={TerminalSquare} color="orange" text="Debug a 'NameError' in my Python script" />
                <SuggestionChip icon={Sparkles} color="violet" text="Explain adversarial attacks in Deep Learning" />
                <SuggestionChip icon={Bot} color="pink" text="Generate a database schema for a SaaS app" />
              </div>
            </motion.div>
          )}

          <div className="flex flex-col space-y-8 mt-4">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[90%] md:max-w-[85%] rounded-3xl px-7 py-5 text-[15px] leading-relaxed relative border ${
                      msg.role === "user" 
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 border-blue-400/50 text-white rounded-br-sm shadow-[0_15px_40px_rgba(37,99,235,0.4)] font-medium" 
                        : "bg-slate-900/80 border-indigo-500/30 text-gray-100 rounded-bl-sm backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
                    }`}
                  >
                    {msg.role === "user" ? msg.content : (
                      <div className="prose prose-sm prose-invert max-w-none break-words">
                        <ReactMarkdown 
                          components={{
                            code({node, inline, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '')
                              return !inline && match ? (
                                <SyntaxHighlighter {...props} style={vscDarkPlus} language={match[1]} PreTag="div" className="rounded-xl my-5 text-[13px] border border-white/10 shadow-2xl">
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : <code {...props} className="bg-black/50 px-2 py-1 rounded-md text-blue-300 font-mono text-[13px] border border-white/10">{children}</code>
                            }
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-slate-900/80 border border-indigo-500/30 rounded-3xl rounded-bl-sm px-7 py-6 flex flex-col gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl min-w-[240px]">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500 shadow-[0_0_12px_#3b82f6]"></span>
                    </div>
                    <span className="text-[12px] font-bold tracking-widest uppercase text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">Synthesizing</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={scrollRef} className="h-24" /> {/* Extra padding at bottom */}
          </div>
        </div>
      </div>

      {/* ✨ UPGRADED: Massive Floating Glass Input anchored to the bottom */}
      <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20 flex justify-center pb-8">
        <div className="w-full max-w-4xl pointer-events-auto">
          <div className="relative flex items-center bg-slate-900/80 border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl transition-all focus-within:border-blue-500/50 focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.2)]">
            <Input 
              placeholder="Message AI Assistant..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 py-5 px-6 bg-transparent border-none text-white placeholder:text-gray-500 shadow-none focus-visible:ring-0 text-base"
              disabled={isLoading}
            />
            <Button 
              onClick={() => handleSend()} 
              disabled={isLoading || !input.trim()}
              className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white transition-all active:scale-95 shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:shadow-none p-0 flex items-center justify-center mr-1"
            >
              <SendHorizontal className="w-5 h-5 ml-0.5" />
            </Button>
          </div>
          <div className="text-center mt-3 text-[11px] text-gray-500 font-medium tracking-wide">
            Command Center AI can make mistakes. Consider verifying critical information.
          </div>
        </div>
      </div>

    </div>
  )
}