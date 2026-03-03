import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Mail, Rocket, Code, X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ResourcesModalProps {
  onClose: () => void;
}

const ResourcesModal: React.FC<ResourcesModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'whitepaper' | 'email' | 'startup' | 'prompt'>('whitepaper');
  const [copied, setCopied] = useState(false);
  const constraintsRef = React.useRef(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = {
    whitepaper: `
# EXECUTIVE WHITEPAPER
## Starlink Command Center 2.0: Autonomous Orbital Intelligence Platform

**Prepared for:** SpaceX Executive Leadership
**Author:** Yahya Al-Amin Yahya
**Date:** October 2025

### 1. EXECUTIVE SUMMARY
Starlink Command Center 2.0 represents a paradigm shift from passive network monitoring to autonomous, AI-driven orbital operations. By integrating real-time telemetry with predictive financial modeling and strategic AI advisors, this platform transforms Starlink from a constellation into a self-optimizing orbital organism.

### 2. PROBLEM STATEMENT
Current satellite management systems rely heavily on human-in-the-loop decision-making for complex, multi-variable problems such as:
- Dynamic bandwidth allocation during geomagnetic storms.
- Optimal ground station placement vs. shifting population density.
- Real-time latency arbitrage for High-Frequency Trading (HFT) clients.

### 3. PROPOSED SOLUTION
The "Orbital Intelligence Engine" leverages:
- **Reinforcement Learning (RL):** For autonomous satellite maneuvering and collision avoidance.
- **Predictive Analytics:** To forecast coverage gaps 3 weeks in advance.
- **Economic Modeling:** Real-time ROI calculation for every packet routed via Laser Links.

### 4. STRATEGIC VALUE PROPOSITION
- **Operational Efficiency:** Reduce human operator load by 40%.
- **Revenue Maximization:** Dynamic pricing based on real-time congestion and latency demand.
- **Resilience:** "Civilization Backup" mode ensures critical data preservation during existential threats.

### 5. TECHNICAL ARCHITECTURE
- **Frontend:** React 18, Three.js (Orbital Visualization), D3.js (Telemetry).
- **AI Core:** Python-based Inference Engine (TensorFlow/PyTorch) for anomaly detection.
- **Data Layer:** Real-time TLE ingestion, Weather API integration, Financial Data Stream.

### 6. CONCLUSION
Command Center 2.0 is not just a tool; it is the central nervous system for the world's most advanced satellite network.
    `,
    email: `
**Subject:** Proposal: Autonomous Orbital Intelligence Platform (Starlink Command Center 2.0)

**To:** Elon Musk / Gwynne Shotwell / Starlink Engineering Team

Dear SpaceX Leadership Team,

I am writing to propose a significant evolution in how we manage and visualize the Starlink constellation: **Starlink Command Center 2.0**.

While current dashboards provide excellent telemetry, we have reached a scale where human analysis cannot keep pace with orbital dynamics. My proposed platform, "Orbital Intelligence," introduces:

1.  **AI Strategic Advisor:** An autonomous engine that recommends satellite re-tasking and ground station deployment based on real-time ROI and latency predictions.
2.  **Resilience Metrics:** Quantifying our "Civilization Backup" capability, ensuring knowledge preservation.
3.  **Mars Link Simulation:** A dedicated module for Earth-Mars high-bandwidth synchronization.

I have built a fully functional prototype demonstrating these capabilities, including real-time TLE tracking, financial forecasting, and predictive maintenance models.

I would welcome the opportunity to demo this platform and discuss how it can serve as the foundational operating system for Starlink's next growth phase.

Best regards,

Yahya Al-Amin Yahya
Full Stack Engineer & Orbital Architect
    `,
    startup: `
# STARTUP PLAN: "OrbitalMind AI"
**Mission:** To build the operating system for the multi-planetary space economy.

### 1. THE PRODUCT
**OrbitalMind Core:** A SaaS platform for satellite constellation management.
- **Target Audience:** Starlink, OneWeb, Kuiper, Government Space Agencies.
- **USP:** The only platform combining technical telemetry with financial modeling and strategic AI.

### 2. BUSINESS MODEL
- **B2B Enterprise License:** Annual recurring revenue (ARR) based on number of satellites managed.
- **Add-on Modules:** 
  - "HFT Arbitrage" (Financial sector data).
  - "Defense Shield" (Government/Military grade encryption & monitoring).

### 3. GO-TO-MARKET STRATEGY
- **Phase 1 (Prototype):** Launch "Starlink Command Center" as a public showcase (current phase).
- **Phase 2 (Pilot):** Secure a pilot program with a smaller constellation provider (e.g., Planet, Spire).
- **Phase 3 (Scale):** Pitch to SpaceX/Amazon for enterprise integration.

### 4. FUNDING REQUIREMENTS (Seed Round)
- **Ask:** $2.5M for 18 months runway.
- **Allocation:** 
  - 60% Engineering (AI/ML Specialists, Orbital Mechanics Experts).
  - 20% Infrastructure (High-performance compute for simulation).
  - 20% Operations & Legal.

### 5. ROADMAP
- **Q1 2026:** Beta launch of "Orbital Intelligence Engine".
- **Q3 2026:** First commercial contract.
- **Q1 2027:** Mars Link protocol standardization.
    `,
    prompt: `
**Role:** Senior Orbital Software Architect & AI Engineer.

**Task:** Build "Starlink Command Center 2.0" - An Autonomous Orbital Intelligence Platform.

**Core Features to Implement:**
1.  **Orbital Intelligence Engine:** Real-time TLE tracking, collision probability, Doppler shift analysis.
2.  **Global Latency Heatmap:** AI-driven prediction of latency spikes based on weather and user load.
3.  **Autonomous Gateway Optimizer:** ROI calculator for new ground stations.
4.  **Financial Engine:** Burn rate vs. Revenue growth, competitor analysis (Kuiper/OneWeb).
5.  **Resilience Metrics:** Censorship resistance index, Knowledge preservation score.
6.  **Strategic AI Advisor:** "Executive Decision Mode" generating actionable fleet recommendations.
7.  **Mars Link:** High-bandwidth interplanetary synchronization simulation.

**Tech Stack:** React, TypeScript, Tailwind CSS, Recharts, Framer Motion, Lucide Icons.
**Design Philosophy:** "Mission Control" aesthetic. Dark mode, high contrast, data-dense but readable.
    `
  };

  return (
    <motion.div 
        ref={constraintsRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[3000] flex items-center justify-center p-4"
        onClick={onClose}
    >
        <motion.div 
            drag
            dragConstraints={constraintsRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl h-[80vh] shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700 cursor-move flex-none">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Project Assets & Documentation</h2>
                        <p className="text-sm text-slate-400">Starlink Command Center 2.0</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-slate-950 border-e border-slate-800 p-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('whitepaper')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'whitepaper' ? 'bg-blue-600/20 text-blue-400 border border-blue-600/50' : 'text-slate-400 hover:bg-slate-900'}`}
                    >
                        <FileText className="w-4 h-4" /> Whitepaper
                    </button>
                    <button 
                        onClick={() => setActiveTab('email')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'email' ? 'bg-purple-600/20 text-purple-400 border border-purple-600/50' : 'text-slate-400 hover:bg-slate-900'}`}
                    >
                        <Mail className="w-4 h-4" /> SpaceX Email
                    </button>
                    <button 
                        onClick={() => setActiveTab('startup')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'startup' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/50' : 'text-slate-400 hover:bg-slate-900'}`}
                    >
                        <Rocket className="w-4 h-4" /> Startup Plan
                    </button>
                    <button 
                        onClick={() => setActiveTab('prompt')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'prompt' ? 'bg-amber-600/20 text-amber-400 border border-amber-600/50' : 'text-slate-400 hover:bg-slate-900'}`}
                    >
                        <Code className="w-4 h-4" /> AI Prompt
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-slate-900 p-6 overflow-y-auto relative custom-scrollbar">
                    <div className="absolute top-4 end-4">
                        <button 
                            onClick={() => copyToClipboard(content[activeTab])}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300 transition-colors"
                        >
                            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                            {copied ? 'Copied' : 'Copy Text'}
                        </button>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-slate-300 bg-transparent border-none p-0">
                            {content[activeTab]}
                        </pre>
                    </div>
                </div>
            </div>
        </motion.div>
    </motion.div>
  );
};

export default ResourcesModal;
