import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, FileText, Trash2, Database, CheckCircle2, ScanEye, X, Zap, Layers, ChevronDown } from "lucide-react"

export default function Documents({ knowledgeBase = [], setKnowledgeBase }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  // ✨ Pagination & Inspection States
  const [inspectingFile, setInspectingFile] = useState(null)
  const [chunks, setChunks] = useState([])
  const [isInspecting, setIsInspecting] = useState(false)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const handleFileUpload = async (e) => {
    e.preventDefault()
    setIsDragging(false)
    const uploadedFiles = Array.from(e.target.files || e.dataTransfer.files)

    for (const file of uploadedFiles) {
      if (file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.pdf')) {
        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
          const response = await fetch("http://localhost:8000/api/upload", {
            method: "POST",
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            const newDoc = {
              id: Math.random().toString(36).substring(7),
              name: data.filename,
              size: (file.size / 1024 / 1024).toFixed(2) + " MB", 
              status: `Vectorized (${data.chunks_created} chunks)` 
            }
            setKnowledgeBase(prev => [...prev, newDoc])
          }
        } catch (error) {
          console.error("Failed to connect to backend:", error)
        }
      }
    }
    setIsUploading(false)
  }

  // ✨ UPGRADED: handleInspect with Pagination Support
  const handleInspect = async (filename, loadMore = false) => {
    setIsInspecting(true)
    const newOffset = loadMore ? offset + 10 : 0
    
    // Reset chunks if opening a brand new file
    if (!loadMore) {
        setChunks([])
        setInspectingFile(filename)
    }

    try {
      const response = await fetch(`http://localhost:8000/api/inspect/${filename}?limit=10&offset=${newOffset}`)
      const data = await response.json()
      
      setChunks(prev => loadMore ? [...prev, ...data.chunks] : data.chunks)
      setOffset(newOffset)
      setHasMore(data.has_more)
    } catch (err) {
      console.error("Could not retrieve chunks")
    } finally {
      setIsInspecting(false)
    }
  }

  const removeDocument = (id) => {
    setKnowledgeBase(prev => prev.filter(doc => doc.id !== id))
    if (inspectingFile) setInspectingFile(null)
  }

  return (
    <div className="w-full max-w-6xl h-[85vh] flex gap-6 relative z-10">
      
      {/* --- MAIN PANEL --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-6 flex items-center justify-between bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
                <Database className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Knowledge Base</h2>
              <p className="text-gray-400 text-sm italic font-mono">Status: RAG Pipeline Active</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-mono text-sm uppercase tracking-widest">{knowledgeBase.length} Vectors</span>
          </div>
        </div>

        <div className="flex-1 flex gap-6 min-h-0">
          {/* DRAG & DROP ZONE */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={handleFileUpload}
            className={`w-1/2 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all duration-500 relative overflow-hidden
              ${isDragging ? "bg-blue-500/10 border-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.1)]" : "bg-black/20 border-white/10 hover:border-white/20"}`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 border-4 border-white/5 border-t-blue-500 rounded-full animate-spin mb-4" />
                <p className="text-blue-400 font-medium font-mono animate-pulse">TRANSMITTING BYTES...</p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                    <UploadCloud className={`w-10 h-10 ${isDragging ? "text-blue-400" : "text-gray-500"}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">Ingest Intelligence</h3>
                <p className="text-gray-500 text-sm text-center mb-8 px-10 leading-relaxed">Securely upload research data or code artifacts to the Vector Engine.</p>
                <label className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-3 shadow-lg shadow-blue-900/40">
                  <FileText className="w-4 h-4" /> BROWSE LOCAL FILES
                  <input type="file" multiple accept=".txt,.md,.pdf" onChange={handleFileUpload} className="hidden" />
                </label>
              </>
            )}
          </div>

          {/* DOCUMENT LIST */}
          <div className="w-1/2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-y-auto custom-scrollbar">
            <h3 className="text-gray-300 font-bold mb-6 flex items-center gap-2 uppercase text-[10px] tracking-[0.3em] opacity-60">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> System Memory Bank
            </h3>
            <div className="space-y-4">
              {knowledgeBase.map((doc) => (
                <div key={doc.id} className="group bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-2xl p-5 flex items-center justify-between transition-all hover:border-blue-500/30 hover:bg-white/[0.07]">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-bold text-gray-100 truncate mb-1">{doc.name}</p>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-500 font-mono tracking-tighter">{doc.size}</span>
                        <span className="text-[10px] text-blue-400 font-bold font-mono uppercase tracking-widest">{doc.status}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleInspect(doc.name)}
                      className="p-2.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all border border-transparent hover:border-blue-500/20"
                    >
                      <ScanEye className="w-5 h-5" />
                    </button>
                    <button onClick={() => removeDocument(doc.id)} className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- WIDE VECTOR INSPECTION SIDEBAR --- */}
      <AnimatePresence>
        {inspectingFile && (
          <motion.div 
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            className="w-[450px] bg-black/90 backdrop-blur-3xl border-l border-white/10 shadow-[-30px_0_60px_rgba(0,0,0,0.8)] p-8 overflow-y-auto flex flex-col relative z-50 custom-scrollbar"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-white text-lg font-bold flex items-center gap-2 tracking-tight">
                    <Zap className="w-5 h-5 text-yellow-400 animate-pulse" /> Vector Node Peek
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-[0.1em]">Source: {inspectingFile}</p>
              </div>
              <button onClick={() => setInspectingFile(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {chunks.map((chunk, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 10) * 0.05 }}
                  key={i} 
                  className="group relative"
                >
                  <div className="p-5 bg-white/[0.03] border border-white/[0.05] rounded-2xl hover:bg-white/[0.06] transition-all group-hover:border-blue-500/20">
                      <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] text-blue-500 font-bold font-mono uppercase bg-blue-500/10 px-2.5 py-0.5 rounded-md">Memory Block {i + 1}</span>
                          <span className="text-[9px] text-gray-600 font-mono">{chunk.length} Characters</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-light tracking-wide">{chunk}</p>
                  </div>
                </motion.div>
              ))}

              {/* ✨ LOAD MORE BUTTON */}
              {hasMore && (
                <button 
                  onClick={() => handleInspect(inspectingFile, true)}
                  disabled={isInspecting}
                  className="w-full py-4 mt-2 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
                >
                  {isInspecting ? (
                    <div className="w-3 h-3 border-2 border-blue-500/20 border-t-blue-400 rounded-full animate-spin" />
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" /> Load Next Data Segments
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}