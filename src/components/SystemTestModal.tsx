import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Terminal, CheckCircle, AlertTriangle, Cpu, Activity, Server, Globe, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SystemTestModalProps {
  onClose: () => void;
}

const SystemTestModal: React.FC<SystemTestModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string>('Initializing...');
  const [isComplete, setIsComplete] = useState(false);
  const constraintsRef = React.useRef(null);

  const tests = [
    { id: 'physics', name: 'Orbital Physics Engine', icon: Globe },
    { id: 'ai', name: 'Strategic AI Inference', icon: Cpu },
    { id: 'network', name: 'Global Mesh Network', icon: Server },
    { id: 'doppler', name: 'Doppler Compensation', icon: Activity },
  ];

  useEffect(() => {
    const runTests = async () => {
      const addLog = (msg: string) => setLogs(prev => [...prev, `> ${msg}`]);
      
      addLog("INITIATING SYSTEM-WIDE DIAGNOSTIC...");
      await new Promise(r => setTimeout(r, 800));

      // 1. Physics Engine
      setCurrentTest('Orbital Physics Engine');
      addLog("Loading TLE data for 4,500+ satellites...");
      await new Promise(r => setTimeout(r, 600));
      addLog("Verifying SGP4 propagation accuracy...");
      await new Promise(r => setTimeout(r, 600));
      addLog("SUCCESS: Position error < 0.5m");
      setProgress(25);

      // 2. Doppler
      setCurrentTest('Doppler Compensation');
      addLog("Testing Ku-band beam steering...");
      await new Promise(r => setTimeout(r, 800));
      addLog("Simulating 27,000 km/h relative velocity...");
      await new Promise(r => setTimeout(r, 600));
      addLog("SUCCESS: Frequency lock maintained. Shift: +45kHz compensated.");
      setProgress(50);

      // 3. Network
      setCurrentTest('Global Mesh Network');
      addLog("Pinging 12 active gateways...");
      await new Promise(r => setTimeout(r, 700));
      addLog("Optimizing laser link topology...");
      await new Promise(r => setTimeout(r, 600));
      addLog("SUCCESS: Latency optimized (-12ms).");
      setProgress(75);

      // 4. AI
      setCurrentTest('Strategic AI Inference');
      addLog("Running disaster relief scenario...");
      await new Promise(r => setTimeout(r, 900));
      addLog("Balancing ROI vs. Humanitarian Impact...");
      await new Promise(r => setTimeout(r, 600));
      addLog("SUCCESS: Optimal strategy generated.");
      setProgress(100);

      setIsComplete(true);
      setCurrentTest('DIAGNOSTIC COMPLETE');
      addLog("ALL SYSTEMS NOMINAL.");
    };

    runTests();
  }, []);

  return (
    <motion.div 
        ref={constraintsRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md z-[4000] flex items-center justify-center p-4"
    >
        <motion.div 
            drag
            dragConstraints={constraintsRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-950 border border-green-500/30 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col font-mono max-h-[90vh]"
        >
            {/* Header */}
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center cursor-move flex-none">
                <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-green-500" />
                    <h2 className="text-lg font-bold text-green-500 tracking-wider">SYSTEM DIAGNOSTIC_V2.0</h2>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400 uppercase">
                        <span>{currentTest}</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <motion.div 
                            className="h-full bg-green-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                        />
                    </div>
                </div>

                {/* Test Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {tests.map((test, idx) => {
                        const isDone = progress >= (idx + 1) * 25;
                        const isRunning = progress < (idx + 1) * 25 && progress > idx * 25;
                        
                        return (
                            <div key={test.id} className={`p-3 rounded border flex items-center gap-3 ${isDone ? 'bg-green-500/10 border-green-500/30' : isRunning ? 'bg-blue-500/10 border-blue-500/30' : 'bg-slate-900 border-slate-800'}`}>
                                <div className={`p-2 rounded-full ${isDone ? 'bg-green-500/20 text-green-400' : isRunning ? 'bg-blue-500/20 text-blue-400 animate-pulse' : 'bg-slate-800 text-slate-600'}`}>
                                    <test.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className={`text-xs font-bold ${isDone ? 'text-green-400' : 'text-slate-400'}`}>{test.name}</div>
                                    <div className="text-[10px] text-slate-500">
                                        {isDone ? 'PASSED' : isRunning ? 'RUNNING...' : 'PENDING'}
                                    </div>
                                </div>
                                {isDone && <CheckCircle className="w-4 h-4 text-green-500 ms-auto" />}
                            </div>
                        );
                    })}
                </div>

                {/* Terminal Output */}
                <div className="bg-black rounded border border-slate-800 p-4 h-48 overflow-y-auto custom-scrollbar font-mono text-xs">
                    {logs.map((log, i) => (
                        <div key={i} className="mb-1 text-green-500/80">
                            {log}
                        </div>
                    ))}
                    {!isComplete && (
                        <div className="animate-pulse text-green-500">_</div>
                    )}
                </div>

                {isComplete && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={onClose}
                        className="w-full py-3 bg-green-600 hover:bg-green-500 text-black font-bold rounded-lg transition-colors"
                    >
                        RETURN TO COMMAND CENTER
                    </motion.button>
                )}
            </div>
        </motion.div>
    </motion.div>
  );
};

export default SystemTestModal;
