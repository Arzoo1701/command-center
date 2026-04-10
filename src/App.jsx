import { useRef, useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion' // ✨ NEW: Imported Framer Motion
import { MessageSquare, Home as HomeIcon, Settings, FileText, LogOut, Code, Database, Activity, BarChart } from 'lucide-react' 

import Chat from './Chat'
import Documents from './Documents'
import Login from './Login' 
import CodeAuditor from './CodeAuditor' 
import SchemaDesigner from './SchemaDesigner'
import Home from './Home'
import InterviewPrep from './InterviewPrep'
import Analytics from './Analytics'
import { GraduationCap } from 'lucide-react' 
import ActivityLog from './Activity' 

// ✨ NEW: This wrapper adds the premium blur/fade effect to every page switch
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  const videoRef = useRef(null);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState([]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; 
    }
  }, []);

  const isActive = (path) => location.pathname === path 
    ? "bg-white/20 text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" 
    : "text-gray-400 hover:bg-white/10 hover:text-gray-200";

  if (!isAuthenticated) {
    return (
      <Login onLogin={() => setIsAuthenticated(true)} />
    )
  }

  return (
    <div className="flex h-screen w-screen bg-black overflow-hidden relative font-sans">
      
      {/* ✨ RESTORED: Your original video background and glassmorphism overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video ref={videoRef} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" src="/spiral.mp4" />
        <div className="absolute inset-0 aurora-overlay opacity-60 mix-blend-overlay"></div>
      </div>

      {/* THE SIDEBAR */}
      <aside className="w-64 bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between hidden md:flex z-20 relative shadow-2xl">
        <div className="p-6 relative z-10">
          <h1 className="text-2xl font-bold text-white mb-10 tracking-wide flex items-center gap-3">
            Workspace
          </h1>
          
          <nav className="flex flex-col space-y-2 mb-8">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 px-4">Main</div>
            {[
              { path: '/', icon: HomeIcon, label: 'Dashboard' },
              { path: '/chat', icon: MessageSquare, label: 'AI Assistant' },
              { path: '/documents', icon: FileText, label: 'Documents (RAG)' },
              { path: '/auditor', icon: Code, label: 'Code Auditor' },
              { path: '/schema', icon: Database, label: 'Schema Architect' } ,
              { path: '/prep', icon: GraduationCap, label: 'Interview Prep' }
            ].map((item) => (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path)}`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col space-y-2">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 px-4">Workspace</div>
            {[
              { path: '/activity', icon: Activity, label: 'Activity Log' },
              { path: '/analytics', icon: BarChart, label: 'Analytics' },
            ].map((item) => (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path)}`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-6 border-t border-white/10 relative z-10 space-y-2">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-gray-400 hover:bg-white/10 hover:text-gray-200 transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Lock Session
          </button>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-hidden z-10 relative flex items-center justify-center p-6 md:p-12">
        {/* ✨ UPGRADED: AnimatePresence watches the URL to trigger the PageTransition */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/chat" element={<PageTransition><Chat knowledgeBase={knowledgeBase} /></PageTransition>} />
            <Route path="/documents" element={<PageTransition><Documents knowledgeBase={knowledgeBase} setKnowledgeBase={setKnowledgeBase} /></PageTransition>} />
            <Route path="/auditor" element={<PageTransition><CodeAuditor /></PageTransition>} /> 
            <Route path="/schema" element={<PageTransition><SchemaDesigner /></PageTransition>} />
            <Route path="/prep" element={<PageTransition><InterviewPrep /></PageTransition>} />
            
            <Route path="/activity" element={<PageTransition><ActivityLog /></PageTransition>} />
            <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App