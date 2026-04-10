import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

// ✨ Upgraded Database with 6 Elite Problems and Multi-Language Boilerplate
const PROBLEMS = [
  { 
    id: 1, title: "Two Sum", difficulty: "Easy", color: "text-green-400", tags: ["Array", "Hash Map"],
    desc: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    input: "nums = [2,7,11,15], target = 9", output: "[0,1]",
    defaultCode: {
      python: "def twoSum(nums, target):\n    # Your solution here\n    pass\n\nprint(twoSum([2, 7, 11, 15], 9))",
      cpp: "#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your solution here\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2, 7, 11, 15};\n    cout << \"Running C++ Tests...\\n\";\n    return 0;\n}",
      java: "import java.util.*;\n\npublic class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        // Your solution here\n        return new int[]{};\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Running Java Tests...\");\n    }\n}"
    }
  },
  { 
    id: 2, title: "Longest Substring", difficulty: "Medium", color: "text-yellow-400", tags: ["Sliding Window"],
    desc: "Given a string s, find the length of the longest substring without repeating characters.",
    input: 's = "abcabcbb"', output: "3",
    defaultCode: {
      python: "def lengthOfLongestSubstring(s):\n    # Your solution here\n    pass\n\nprint(lengthOfLongestSubstring(\"abcabcbb\"))",
      cpp: "#include <iostream>\n#include <string>\n#include <unordered_set>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    // Your solution here\n    return 0;\n}\n\nint main() {\n    cout << lengthOfLongestSubstring(\"abcabcbb\") << \"\\n\";\n    return 0;\n}",
      java: "import java.util.*;\n\npublic class Main {\n    public static int lengthOfLongestSubstring(String s) {\n        // Your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        System.out.println(lengthOfLongestSubstring(\"abcabcbb\"));\n    }\n}"
    }
  },
  { 
    id: 3, title: "Valid Parentheses", difficulty: "Easy", color: "text-green-400", tags: ["Stack", "String"],
    desc: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. (Highly asked at Microsoft & Amazon).",
    input: 's = "()[]{}"', output: "true",
    defaultCode: {
      python: "def isValid(s):\n    # Your solution here\n    pass\n\nprint(isValid(\"()[]{}\"))",
      cpp: "#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n    // Your solution here\n    return false;\n}\n\nint main() {\n    cout << (isValid(\"()[]{}\") ? \"true\" : \"false\") << \"\\n\";\n    return 0;\n}",
      java: "import java.util.*;\n\npublic class Main {\n    public static boolean isValid(String s) {\n        // Your solution here\n        return false;\n    }\n    public static void main(String[] args) {\n        System.out.println(isValid(\"()[]{}\"));\n    }\n}"
    }
  },
  { 
    id: 4, title: "Best Time to Buy Stock", difficulty: "Easy", color: "text-green-400", tags: ["Array", "Dynamic Programming"],
    desc: "You are given an array prices where prices[i] is the price of a given stock on the ith day. Return the maximum profit you can achieve. (Goldman Sachs staple).",
    input: 'prices = [7,1,5,3,6,4]', output: "5",
    defaultCode: {
      python: "def maxProfit(prices):\n    # Your solution here\n    pass\n\nprint(maxProfit([7,1,5,3,6,4]))",
      cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxProfit(vector<int>& prices) {\n    // Your solution here\n    return 0;\n}\n\nint main() {\n    vector<int> p = {7,1,5,3,6,4};\n    cout << maxProfit(p) << \"\\n\";\n    return 0;\n}",
      java: "import java.util.*;\n\npublic class Main {\n    public static int maxProfit(int[] prices) {\n        // Your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        int[] p = {7,1,5,3,6,4};\n        System.out.println(maxProfit(p));\n    }\n}"
    }
  },
  { 
    id: 5, title: "Merge Intervals", difficulty: "Medium", color: "text-yellow-400", tags: ["Array", "Sorting"],
    desc: "Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals. (Highly asked at Oracle).",
    input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: "[[1,6],[8,10],[15,18]]",
    defaultCode: {
      python: "def merge(intervals):\n    # Your solution here\n    pass\n\nprint(merge([[1,3],[2,6],[8,10],[15,18]]))",
      cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> merge(vector<vector<int>>& intervals) {\n    // Your solution here\n    return {};\n}\n\nint main() {\n    cout << \"Running Merge Intervals C++...\\n\";\n    return 0;\n}",
      java: "import java.util.*;\n\npublic class Main {\n    public static int[][] merge(int[][] intervals) {\n        // Your solution here\n        return new int[][]{};\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Running Merge Intervals Java...\");\n    }\n}"
    }
  },
  { 
    id: 6, title: "Maximum Subarray", difficulty: "Medium", color: "text-yellow-400", tags: ["Array", "Divide and Conquer"],
    desc: "Given an integer array nums, find the subarray with the largest sum, and return its sum. (Kadane's Algorithm).",
    input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: "6",
    defaultCode: {
      python: "def maxSubArray(nums):\n    # Your solution here\n    pass\n\nprint(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))",
      cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    // Your solution here\n    return 0;\n}\n\nint main() {\n    vector<int> nums = {-2,1,-3,4,-1,2,1,-5,4};\n    cout << maxSubArray(nums) << \"\\n\";\n    return 0;\n}",
      java: "import java.util.*;\n\npublic class Main {\n    public static int maxSubArray(int[] nums) {\n        // Your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        int[] nums = {-2,1,-3,4,-1,2,1,-5,4};\n        System.out.println(maxSubArray(nums));\n    }\n}"
    }
  }
];
// ✨ NEW: The SQL Problem Database!
const SQL_PROBLEMS = [
  {
    id: 1, title: "Highest Paid in Sales", difficulty: "Easy", color: "text-green-400",
    schema: "employees (id, name, department, salary, hire_date)",
    challenge: "Write a query to find the highest paid employee in the Sales department.",
    defaultCode: "SELECT *\nFROM employees\nWHERE department = 'Sales'\nORDER BY salary DESC\nLIMIT 1;"
  },
  {
    id: 2, title: "Average Salary by Dept", difficulty: "Medium", color: "text-yellow-400",
    schema: "employees (id, name, department, salary, hire_date)",
    challenge: "Write a query to find the average salary for each department. Order the results from highest average to lowest.",
    defaultCode: "SELECT department, AVG(salary) as avg_salary\nFROM employees\nGROUP BY department\nORDER BY avg_salary DESC;"
  },
  {
    id: 3, title: "Recent Hires", difficulty: "Easy", color: "text-green-400",
    schema: "employees (id, name, department, salary, hire_date)",
    challenge: "Find the names and hire dates of all Engineering employees who were hired in 2023 or later.",
    defaultCode: "SELECT name, hire_date\nFROM employees\nWHERE department = 'Engineering' AND hire_date >= '2023-01-01';"
  }
];
function Flashcard({ question, answer }) {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="w-full h-64 cursor-pointer relative group" onClick={() => setIsFlipped(!isFlipped)} style={{ perspective: "1200px" }}>
      <motion.div className="w-full h-full relative preserve-3d" initial={false} animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-black/60 to-black/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.5)] group-hover:border-white/30 transition-colors duration-300" style={{ backfaceVisibility: "hidden" }}>
          <div className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-4">Question</div>
          <h3 className="text-lg font-semibold text-white group-hover:text-[#c8f04a] transition-colors">{question}</h3>
          <div className="absolute bottom-4 text-gray-500 text-xs animate-pulse">Click to reveal</div>
        </div>
        <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-[#c8f04a]/10 to-black/90 border-2 border-[#c8f04a]/70 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-[0_0_30px_rgba(200,240,74,0.25)] overflow-hidden" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <motion.div className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" animate={{ left: ["-100%", "200%"] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }} />
          <div className="relative z-10 text-xs text-[#c8f04a] font-bold tracking-widest uppercase mb-4 drop-shadow-[0_0_8px_rgba(200,240,74,0.8)]">Answer</div>
          <p className="relative z-10 text-sm text-gray-100 leading-relaxed overflow-y-auto font-medium">{answer}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function InterviewPrep() {
  const [activeTab, setActiveTab] = useState("LeetCode"); 
  const [activeProblem, setActiveProblem] = useState(PROBLEMS[0]);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(PROBLEMS[0].defaultCode["python"]);

  const [stats, setStats] = useState({ streak: 0 });

  // ✨ NEW: SQL Sandbox States
  const [sqlCode, setSqlCode] = useState("SELECT * FROM employees\nWHERE department = 'Engineering'\nORDER BY salary DESC;");
  const [sqlResults, setSqlResults] = useState(null);
  const [sqlError, setSqlError] = useState("");
  const [isSqlRunning, setIsSqlRunning] = useState(false);
  // ✨ NEW: SQL State tracking
  const [activeSqlProblem, setActiveSqlProblem] = useState(SQL_PROBLEMS[0]);

  // ✨ NEW: Automatically update the SQL editor when they click a new problem
  useEffect(() => {
    if (activeTab === "SQL Practice") {
      setSqlCode(activeSqlProblem.defaultCode);
      setSqlResults(null);
      setSqlError("");
    }
  }, [activeSqlProblem, activeTab]);

  // Fetch the stats from the SQLite database when the app loads
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/progress");
        if (res.ok) {
          const data = await res.json();
          setStats({ streak: data.streak });
        }
      } catch (err) {
        console.error("Database offline or unreachable.", err);
      }
    };
    fetchProgress();
  }, []);

  // Reset code when problem OR language changes
  useEffect(() => {
    setCode(activeProblem.defaultCode[language] || "// Code not available for this language");
    const terminal = document.getElementById("terminal-output");
    if (terminal) terminal.innerText = "Waiting for execution...";
  }, [activeProblem, language]);

  const [topic, setTopic] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateFlashcards = async () => {
    if (!topic.trim()) return;
    setIsLoading(true); setFlashcards([]); 
    try {
      const res = await fetch("http://localhost:8000/api/flashcards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic }) });
      const data = await res.json();
      if (res.ok) { setFlashcards(JSON.parse(data.response).cards || []); } 
      else { alert("Server Error: " + data.detail); }
    } catch (e) { console.error(e); alert("Error contacting API."); } 
    finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col h-full w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 relative">
      
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
        <h2 className="text-xl font-bold text-white tracking-wide">Interview Prep</h2>
        <div className="flex gap-4 text-sm font-medium">
          
          {/* Streak is now the ONLY stat shown! */}
          <div className="px-4 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300">
            Streak <span className="text-[#c8f04a] font-bold drop-shadow-[0_0_5px_rgba(200,240,74,0.5)]">{stats.streak} {stats.streak === 1 ? "day" : "days"}</span>
          </div>

        </div>
      </div>

      <div className="flex gap-8 px-6 border-b border-white/10 bg-black/30">
        {["LeetCode", "Flashcards", "SQL Practice"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 text-sm font-semibold border-b-2 transition-colors ${ activeTab === tab ? "border-[#c8f04a] text-[#c8f04a] drop-shadow-[0_0_8px_rgba(200,240,74,0.5)]" : "border-transparent text-gray-500 hover:text-gray-300" }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ========================================== */}
      {/* 2A. LEETCODE VIEW (3-PANE VERTICAL SPLIT)  */}
      {/* ========================================== */}
      {activeTab === "LeetCode" && (
        <div className="flex flex-1 overflow-hidden">
          
          {/* PANE 1: Sidebar (Problem List) */}
          <div className="w-48 flex flex-col border-r border-white/10 bg-black/40">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Problems</div>
              {PROBLEMS.map((prob) => (
                <div key={prob.id} onClick={() => setActiveProblem(prob)} className={`p-3 rounded-xl cursor-pointer transition-all border ${activeProblem.id === prob.id ? "bg-white/10 border-white/20 shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]" : "bg-transparent border-transparent hover:bg-white/5"}`}>
                  <div className="text-sm font-bold text-gray-200">{prob.title}</div>
                  <span className={`text-xs font-bold ${prob.color}`}>{prob.difficulty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PANE 2: Explanation confined to the middle! */}
          <div className="w-[30%] min-w-[300px] p-8 border-r border-white/10 bg-black/20 overflow-y-auto flex flex-col">
            <h1 className="text-2xl font-bold text-white mb-6">{activeProblem.id}. {activeProblem.title}</h1>
            <div className="flex gap-2 mb-6">
              <span className={`text-xs font-bold px-3 py-1 rounded bg-white/5 border border-white/10 ${activeProblem.color}`}>{activeProblem.difficulty}</span>
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">{activeProblem.desc}</p>
            <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-xs text-gray-400">
              <span className="text-white">Input:</span> {activeProblem.input}<br/>
              <span className="text-white">Output:</span> {activeProblem.output}
            </div>
            
            <div className="mt-8 text-xs text-gray-500 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
              <strong className="text-blue-400">💡 Execution Note:</strong><br/> 
              Because this runs raw execution containers, you must include a <code>main</code> execution loop in your C++ or Java code to print the output!
            </div>
          </div>
            
          {/* PANE 3: Full Height Editor & Terminal on the Right! */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
            
            <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-[#252526]">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-black/40 text-white text-sm border border-white/10 rounded px-3 py-1 outline-none focus:border-[#c8f04a] transition-colors cursor-pointer"
              >
                <option value="python">Python 3</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
              
              <button 
                onClick={async () => {
                  const terminal = document.getElementById("terminal-output");
                  terminal.innerText = "Compiling and running on secure server...\n";
                  try {
                    const res = await fetch("http://localhost:8000/api/execute", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ language: language, code: code, problem_id: activeProblem.id }),
                    });
                    const data = await res.json();
                    terminal.innerText += data.output || "\n(Process exited with no output)";

                    if (data.output && data.output.includes("[PASS]")) {
                      try {
                        const updateRes = await fetch("http://localhost:8000/api/progress/solve", { method: "POST" });
                        if (updateRes.ok) {
                          const updatedData = await updateRes.json();
                          setStats(prev => ({ ...prev, streak: updatedData.streak }));
                        }
                      } catch (err) {
                        console.error("Failed to update score", err);
                      }
                    }
                    
                  } catch (e) {
                    terminal.innerText += "\nError connecting to execution server.";
                  }
                }}
                className="px-4 py-1 text-xs font-bold rounded bg-[#c8f04a] text-black hover:bg-[#b0d63e] shadow-[0_0_10px_rgba(200,240,74,0.3)] transition-all flex items-center gap-2"
              >
                ▶ Run Tests
              </button>
            </div>
            
            <div className="flex-1">
              <Editor 
                height="100%" 
                language={language} 
                theme="vs-dark" 
                value={code} 
                onChange={setCode} 
                options={{ minimap: { enabled: false }, padding: { top: 16 }, fontSize: 14 }} 
              />
            </div>

            <div className="h-48 bg-[#0d0d0d] border-t border-white/10 flex flex-col">
              <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Console Output</div>
                  <div className="w-2 h-2 rounded-full bg-[#c8f04a] animate-pulse shadow-[0_0_8px_rgba(200,240,74,0.8)]"></div>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <pre id="terminal-output" className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                  Waiting for execution...
                </pre>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2B. FLASHCARDS VIEW (AI INTEGRATION)       */}
      {/* ========================================== */}
      {activeTab === "Flashcards" && (
        <div className="flex flex-col flex-1 overflow-y-auto p-8 relative z-0">
          <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-[#c8f04a]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="max-w-4xl mx-auto w-full relative z-10">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-4">
                AI Flashcard Generator
              </h1>
              <p className="text-gray-400 mb-8 font-medium">Type any technology, framework, or concept to instantly generate study material.</p>
              <div className="flex gap-4 max-w-2xl mx-auto relative">
                <div className="absolute inset-0 bg-[#c8f04a]/20 blur-xl rounded-xl -z-10" />
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => e.key === "Enter" && generateFlashcards()} placeholder="e.g., React Hooks, Big O Notation, System Design..." className="flex-1 bg-black/60 border border-white/20 rounded-xl px-6 py-3 text-white outline-none focus:border-[#c8f04a] focus:ring-1 focus:ring-[#c8f04a] transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]" />
                <button onClick={generateFlashcards} disabled={isLoading} className="px-8 py-3 rounded-xl bg-[#c8f04a] text-black font-bold hover:bg-[#b0d63e] transition-colors shadow-[0_0_20px_rgba(200,240,74,0.4)]">
                  {isLoading ? "Generating..." : "Generate Cards"}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {flashcards.map((card, idx) => <Flashcard key={idx} question={card.q} answer={card.a} />)}
            </div>
            {flashcards.length === 0 && !isLoading && (
              <div className="text-center mt-16 border border-white/10 bg-white/5 backdrop-blur-md p-16 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-[pulse_3s_ease-in-out_infinite]" />
                <div className="text-[#c8f04a] mb-6 flex justify-center opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(200,240,74,0.5)]">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                </div>
                <p className="text-xl font-semibold text-white mb-2">Awaiting Neural Input</p>
                <p className="text-sm text-gray-500">Enter a topic above to ignite the AI engine and generate your study deck.</p>
              </div>
            )}
            {isLoading && <div className="text-center mt-20 text-[#c8f04a] font-bold animate-pulse tracking-widest uppercase text-sm drop-shadow-[0_0_10px_rgba(200,240,74,0.5)]">Synthesizing Data...</div>}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2C. SQL SANDBOX VIEW                       */}
      {/* ========================================== */}
      {activeTab === "SQL Practice" && (
        <div className="flex flex-1 overflow-hidden">
          
          {/* LEFT PANE: Database Schema */}
          {/* LEFT PANE: SQL Problems & Schema */}
          <div className="w-64 border-r border-white/10 bg-black/40 flex flex-col">
            
            {/* Top Half: Problem List */}
            <div className="flex-1 overflow-y-auto p-4 border-b border-white/10">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">SQL Challenges</div>
              <div className="space-y-2">
                {SQL_PROBLEMS.map((prob) => (
                  <div key={prob.id} onClick={() => setActiveSqlProblem(prob)} className={`p-3 rounded-xl cursor-pointer transition-all border ${activeSqlProblem.id === prob.id ? "bg-white/10 border-white/20 shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]" : "bg-transparent border-transparent hover:bg-white/5"}`}>
                    <div className="text-sm font-bold text-gray-200">{prob.title}</div>
                    <span className={`text-xs font-bold ${prob.color}`}>{prob.difficulty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Half: Schema & Challenge Instructions */}
            <div className="h-[45%] bg-black/20 p-4 overflow-y-auto">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Current Schema</h3>
              <div className="mb-4">
                <div className="flex items-center gap-2 text-[#c8f04a] font-bold mb-2 text-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H3v5m18 0v5H3v-5m18 0a2 2 0 01-2 2H5a2 2 0 01-2-2m18-5a2 2 0 00-2-2H5a2 2 0 00-2 2"/></svg>
                  employees
                </div>
                <ul className="text-[11px] text-gray-400 space-y-1 pl-4 border-l border-white/10 ml-2 font-mono">
                  <li><span className="text-blue-400">id</span> INT (PK)</li>
                  <li><span className="text-green-400">name</span> TEXT</li>
                  <li><span className="text-green-400">department</span> TEXT</li>
                  <li><span className="text-yellow-400">salary</span> INT</li>
                  <li><span className="text-green-400">hire_date</span> TEXT</li>
                </ul>
              </div>
              
              <div className="text-xs text-gray-300 bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl leading-relaxed">
                <strong className="text-blue-400 block mb-1">💡 Challenge:</strong>
                {activeSqlProblem.challenge}
              </div>
            </div>
            
          </div>

          {/* RIGHT PANE: Editor & Results Table */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
            
            {/* Toolbar */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-[#252526]">
              <div className="text-sm text-gray-400 font-medium">Query.sql</div>
              <button 
                onClick={async () => {
                  setIsSqlRunning(true); setSqlError(""); setSqlResults(null);
                  try {
                    const res = await fetch("http://localhost:8000/api/sql", {
                      method: "POST", headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ query: sqlCode })
                    });
                    const data = await res.json();
                    if (data.error) setSqlError(data.error);
                    else setSqlResults(data);
                  } catch (e) {
                    setSqlError("Failed to connect to SQLite Sandbox.");
                  } finally {
                    setIsSqlRunning(false);
                  }
                }}
                disabled={isSqlRunning}
                className="px-4 py-1 text-xs font-bold rounded bg-blue-500 text-white hover:bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSqlRunning ? "Running..." : "▶ Run Query"}
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="h-64 border-b border-white/10">
              <Editor 
                height="100%" 
                language="sql" 
                theme="vs-dark" 
                value={sqlCode} 
                onChange={setSqlCode} 
                options={{ minimap: { enabled: false }, padding: { top: 16 }, fontSize: 14 }} 
              />
            </div>

            {/* Results Output */}
            <div className="flex-1 bg-[#0d0d0d] flex flex-col">
              <div className="px-4 py-2 border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                Query Results
              </div>
              <div className="flex-1 p-4 overflow-auto">
                {sqlError && (
                  <div className="text-red-400 text-sm font-mono whitespace-pre-wrap">🚨 SQL Error: {sqlError}</div>
                )}
                
                {sqlResults && !sqlError && (
                  <table className="w-full text-left border-collapse text-sm text-gray-300">
                    <thead>
                      <tr>
                        {sqlResults.columns.map((col, idx) => (
                          <th key={idx} className="border-b border-white/20 pb-2 px-4 text-[#c8f04a] font-semibold bg-white/5">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sqlResults.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="border-b border-white/5 py-2 px-4">{cell}</td>
                          ))}
                        </tr>
                      ))}
                      {sqlResults.rows.length === 0 && (
                        <tr><td colSpan="100%" className="py-4 text-center text-gray-500 italic">0 rows returned.</td></tr>
                      )}
                    </tbody>
                  </table>
                )}

                {!sqlResults && !sqlError && (
                  <div className="text-gray-600 text-sm italic">Execute a query to see results here.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}