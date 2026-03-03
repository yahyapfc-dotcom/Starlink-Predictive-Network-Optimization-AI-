import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Brain, Activity, Map, ArrowRight, X, CheckCircle } from 'lucide-react';

interface OnboardingTourProps {
  onClose: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const constraintsRef = React.useRef(null);

  const steps = [
    {
      title: "Welcome to Command Center 2.0",
      desc: "You have successfully upgraded to the Autonomous Orbital Intelligence Platform. This system is designed for strategic decision-making, not just monitoring.",
      icon: Rocket,
      color: "text-blue-400",
      bg: "bg-blue-500/20"
    },
    {
      title: "AI Strategic Advisor",
      desc: "Located in the sidebar, this AI engine analyzes fleet data to recommend high-level actions (e.g., 'Deploy 4 Satellites'). Try 'Executive Decision Mode' to see it in action.",
      icon: Brain,
      color: "text-purple-400",
      bg: "bg-purple-500/20"
    },
    {
      title: "Orbital Physics Engine",
      desc: "Real-time tracking of Doppler Shifts and Collision Risks. This panel visualizes the raw physics keeping the constellation alive.",
      icon: Activity,
      color: "text-cyan-400",
      bg: "bg-cyan-500/20"
    },
    {
      title: "Gateway Deployment Mode",
      desc: "Click the 'Deploy Gateway Mode' button in the map header. Then, click ANYWHERE on the map to simulate building a ground station and see instant ROI & Latency calculations.",
      icon: Map,
      color: "text-amber-400",
      bg: "bg-amber-500/20"
    },
    {
      title: "System Diagnostic",
      desc: "Run a full system health check using the 'System Test' button. This simulates a deep-dive analysis of all subsystems.",
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-500/20"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const CurrentIcon = steps[step].icon;

  return (
    <motion.div 
        ref={constraintsRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[5000] flex items-center justify-center p-4"
    >
        <motion.div 
            drag
            dragConstraints={constraintsRef}
            key={step}
            initial={{ scale: 0.9, opacity: 0, x: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.9, opacity: 0, x: -20 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative cursor-move"
        >
            <button 
                onClick={onClose}
                className="absolute top-4 end-4 text-slate-500 hover:text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="p-8 flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${steps[step].bg} shadow-[0_0_30px_rgba(0,0,0,0.3)]`}>
                    <CurrentIcon className={`w-10 h-10 ${steps[step].color}`} />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">{steps[step].title}</h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                    {steps[step].desc}
                </p>

                <div className="flex items-center justify-between w-full">
                    <div className="flex gap-1">
                        {steps.map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-white' : 'bg-slate-700'}`}
                            />
                        ))}
                    </div>
                    <button 
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-2 bg-white text-black hover:bg-slate-200 rounded-full font-bold transition-colors"
                    >
                        {step === steps.length - 1 ? 'Get Started' : 'Next'} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    </motion.div>
  );
};

export default OnboardingTour;
