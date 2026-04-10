import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import { Lock, Mail, ArrowRight, ShieldAlert, UserPlus, LogIn, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { auth, googleProvider } from "./firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth"

// ✨ 1. Custom Terminal Typing Animation Component
const TypewriterText = ({ text }) => {
  return (
    <div className="flex items-center justify-center lg:justify-start">
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, display: "none" }}
          animate={{ opacity: 1, display: "inline-block" }}
          transition={{ duration: 0.05, delay: index * 0.05 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="ml-1 w-2 h-6 md:h-8 bg-blue-500 inline-block"
      />
    </div>
  )
}

export default function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [capsLockOn, setCapsLockOn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // ✨ 2. 3D Tilt Effect Setup (Framer Motion)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  // ✨ 3. Password Strength Logic
  const calculateStrength = (pass) => {
    let score = 0
    if (pass.length > 5) score += 1
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score += 1
    return score
  }
  const strengthScore = calculateStrength(password)
  const strengthColors = ["bg-gray-600", "bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-500"]
  const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Secure"]

  // Detect Caps Lock
  const handleKeyDown = (e) => {
    if (e.getModifierState("CapsLock")) setCapsLockOn(true)
    else setCapsLockOn(false)
  }

  // Real Firebase Auth
  const handleAuth = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    try {
      if (isSignUp) await createUserWithEmailAndPassword(auth, email, password)
      else await signInWithEmailAndPassword(auth, email, password)
      onLogin()
    } catch (error) {
      setErrorMsg(error.message.replace("Firebase: ", ""))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setErrorMsg("")
    try {
      await signInWithPopup(auth, googleProvider)
      onLogin()
    } catch (error) {
      setErrorMsg("Google Authentication Failed.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // ✨ 4. The Enterprise Split-Screen Layout
    <div className="flex min-h-screen w-full bg-black font-sans">
      
      {/* LEFT SIDE: The Login Form */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-8 lg:p-16 relative z-10 bg-black/90 backdrop-blur-3xl border-r border-white/10 shadow-2xl overflow-y-auto">
        
        {/* We apply the 3D rotation to this container */}
        <motion.div 
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full max-w-md perspective-1000"
        >
          <div className="mb-10 text-center lg:text-left transform-gpu" style={{ transform: "translateZ(30px)" }}>
            <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <ShieldAlert className="w-8 h-8 text-blue-400" />
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-wide h-10 mb-2">
              <TypewriterText key={isSignUp ? "signup" : "login"} text={isSignUp ? "Initialize Identity" : "Command Center"} />
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              {isSignUp ? "Register your credentials to secure your workspace." : "Authenticate to access the AI workspace."}
            </p>
          </div>

          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" /> {errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleAuth} className="space-y-5 transform-gpu" style={{ transform: "translateZ(40px)" }}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-400 ml-1">Email Protocol</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:text-gray-600"
                  placeholder="engineer@workspace.ai"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-gray-400">Security Key</label>
                {capsLockOn && <span className="text-xs text-yellow-500 font-medium">CAPS LOCK ON</span>}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}
                  className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                />
                {/* ✨ Show/Hide Password Toggle */}
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* ✨ Password Strength Meter (Only on Sign Up) */}
              <AnimatePresence>
                {isSignUp && password.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pt-2 overflow-hidden">
                    <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-white/10">
                      {[1, 2, 3, 4].map((index) => (
                        <div key={index} className={`h-full flex-1 transition-all duration-300 ${strengthScore >= index ? strengthColors[strengthScore] : "bg-transparent"}`} />
                      ))}
                    </div>
                    <p className={`text-xs mt-1 font-medium ${strengthScore > 2 ? "text-green-400" : "text-gray-400"}`}>
                      Password Strength: {strengthLabels[strengthScore]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              type="submit" disabled={isLoading || !email || !password || (isSignUp && strengthScore < 2)}
              className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isSignUp ? "Register Credentials" : "Initialize Uplink"} <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="my-8 flex items-center justify-center gap-3 transform-gpu" style={{ transform: "translateZ(20px)" }}>
            <div className="h-px w-full bg-white/10"></div>
            <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">OR</span>
            <div className="h-px w-full bg-white/10"></div>
          </div>

          <div className="space-y-4 transform-gpu" style={{ transform: "translateZ(30px)" }}>
            <button type="button" onClick={handleGoogleAuth} className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all active:scale-[0.98] flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button onClick={() => setIsSignUp(!isSignUp)} className="w-full py-3.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
              {isSignUp ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {isSignUp ? "Already have an uplink? Log in." : "No credentials? Request access."}
            </button>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: The Video / Visuals Area (Hidden on mobile) */}
      <div className="hidden lg:block w-7/12 relative overflow-hidden bg-black">
        <video 
          autoPlay loop muted playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105" // scale-105 hides harsh video edges
          src="/spiral.mp4" 
        />
        {/* The Aurora overlay specifically for the right side */}
        <div className="absolute inset-0 aurora-overlay opacity-60 mix-blend-overlay"></div>
        
        {/* Optional: Add some floating text or statistics to the video side to make it feel like a dashboard */}
        <div className="absolute bottom-12 left-12 text-white/50 space-y-2 font-mono text-sm">
          <p>SYSTEM.STATUS // <span className="text-green-400">ONLINE</span></p>
          <p>ENCRYPTION // <span className="text-blue-400">AES-256</span></p>
          <p>WORKSPACE // SECURE</p>
        </div>
      </div>

    </div>
  )
}