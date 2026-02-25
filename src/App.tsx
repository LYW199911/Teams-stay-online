/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Activity, 
  Terminal, 
  Keyboard, 
  MousePointer2, 
  AlertCircle,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const RANDOM_SENTENCES = [
  "Reviewing the project requirements for the upcoming sprint...",
  "Analyzing the performance metrics from the last deployment.",
  "Updating the documentation for the new API endpoints.",
  "Drafting the weekly status report for the management team.",
  "Investigating the root cause of the reported bug in production.",
  "Collaborating with the design team on the new user interface.",
  "Optimizing the database queries for better response times.",
  "Preparing the presentation for the client meeting tomorrow.",
  "Refactoring the legacy code to improve maintainability.",
  "Testing the new features in the staging environment."
];

export default function App() {
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState("");
  const [logs, setLogs] = useState<{ id: number; msg: string; time: string }[]>([]);
  const [copied, setCopied] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const newLog = {
      id: Date.now(),
      msg,
      time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const toggleActive = () => {
    if (isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      addLog("System stopped.");
      setIsActive(false);
    } else {
      setIsActive(true);
      addLog("System initialized. Activity simulation started.");
      startSimulation();
    }
  };

  const startSimulation = () => {
    timerRef.current = setInterval(() => {
      const actionType = Math.random();
      if (actionType > 0.6) {
        // Simulate Typing
        const sentence = RANDOM_SENTENCES[Math.floor(Math.random() * RANDOM_SENTENCES.length)];
        setText(prev => prev + "\n" + sentence);
        addLog(`Simulated keystrokes: ${sentence.substring(0, 20)}...`);
      } else {
        // Simulate Mouse
        addLog("Simulated cursor movement.");
      }
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const pythonScript = `import pyautogui
import time
import random

pyautogui.FAILSAFE = False

print("Teams Stay-Active Script Started...")
print("Press Ctrl+C to stop.")

try:
    while True:
        # Move mouse slightly
        x = random.randint(-10, 10)
        y = random.randint(-10, 10)
        pyautogui.moveRel(x, y, duration=0.5)
        
        # Press a neutral key (like 'shift')
        pyautogui.press('shift')
        
        # Wait for a random interval (30-60 seconds)
        wait_time = random.randint(30, 60)
        time.sleep(wait_time)
except KeyboardInterrupt:
    print("\\nScript stopped by user.")`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E1E1E3] font-sans p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
            <Activity className={`w-6 h-6 ${isActive ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase italic font-mono">StayActive Utility</h1>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">v1.0.4 // Status: {isActive ? 'Running' : 'Standby'}</p>
          </div>
        </div>
        
        <button 
          onClick={toggleActive}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-mono text-sm uppercase tracking-tighter transition-all duration-300 ${
            isActive 
            ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20' 
            : 'bg-emerald-500 text-black font-bold hover:bg-emerald-400'
          }`}
        >
          {isActive ? <><Square className="w-4 h-4 fill-current" /> Stop</> : <><Play className="w-4 h-4 fill-current" /> Start Simulation</>}
        </button>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Virtual Notepad */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#151518] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[400px]">
            <div className="bg-[#1C1C21] px-4 py-2 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-mono uppercase text-zinc-400">Virtual Workspace (Auto-Type)</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
              </div>
            </div>
            <textarea 
              readOnly
              value={text}
              placeholder="Simulation inactive. Start to begin auto-typing..."
              className="flex-1 p-6 bg-transparent font-mono text-sm text-zinc-300 resize-none focus:outline-none leading-relaxed"
            />
          </section>

          {/* Warning / Disclaimer */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-4 items-start">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-200/80 leading-relaxed">
              <strong className="text-amber-500 block mb-1">Browser Sandbox Limitation</strong>
              Due to security restrictions, browser applications cannot control your physical mouse or keyboard outside this window. 
              Keep this tab focused and active for best results within the browser environment.
            </div>
          </div>
        </div>

        {/* Right Column: Logs & Local Script */}
        <div className="space-y-6">
          {/* Activity Logs */}
          <section className="bg-[#151518] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[250px]">
            <div className="bg-[#1C1C21] px-4 py-2 border-b border-white/5 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-mono uppercase text-zinc-400">Activity Log</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-2 scrollbar-hide" ref={logContainerRef}>
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2"
                  >
                    <span className="text-zinc-600">[{log.time}]</span>
                    <span className="text-zinc-400">{log.msg}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {logs.length === 0 && <div className="text-zinc-700 italic">Waiting for activity...</div>}
            </div>
          </section>

          {/* Python Script for Local Use */}
          <section className="bg-[#151518] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-[#1C1C21] px-4 py-2 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MousePointer2 className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-mono uppercase text-zinc-400">System-Wide Solution</span>
              </div>
              <button 
                onClick={copyToClipboard}
                className="text-zinc-500 hover:text-white transition-colors"
                title="Copy Python Script"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="p-4">
              <p className="text-[10px] text-zinc-500 mb-3 leading-tight">
                For full OS-level control (Notepad, Teams), run this Python script locally:
              </p>
              <pre className="bg-black/40 p-3 rounded-lg text-[9px] font-mono text-emerald-500/80 overflow-x-auto border border-white/5">
                {pythonScript}
              </pre>
              <p className="text-[9px] text-zinc-600 mt-3 italic">
                Requires: <code className="text-zinc-400">pip install pyautogui</code>
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-auto py-8 text-zinc-600 text-[10px] font-mono uppercase tracking-widest">
        &copy; 2024 StayActive Labs // Secure Activity Simulation
      </footer>
    </div>
  );
}
