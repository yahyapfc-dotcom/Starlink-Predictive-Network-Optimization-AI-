import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Server, TrendingUp, DollarSign, Zap, MapPin, ArrowRight, Info, CheckCircle, Loader2, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const InfrastructurePanel: React.FC = () => {
  const { t } = useTranslation();
  const [isSimulating, setIsSimulating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Real-world strategic locations based on known coverage gaps and population centers
  // Note: While these are realistic strategic targets, actual Starlink internal data is proprietary.
  const recommendations = [
    {
      id: 1,
      location: "Lagos, Nigeria",
      roi: "320%",
      latency: "-15ms",
      cost: "$2.5M",
      priority: "high",
      type: "Market Expansion"
    },
    {
      id: 2,
      location: "Jakarta, Indonesia",
      roi: "280%",
      latency: "-12ms",
      cost: "$3.1M",
      priority: "high",
      type: "Latency Reduction"
    },
    {
      id: 3,
      location: "Santiago, Chile",
      roi: "190%",
      latency: "-8ms",
      cost: "$1.8M",
      priority: "medium",
      type: "Capacity Boost"
    }
  ];

  const handleSimulate = () => {
      setIsSimulating(true);
      setTimeout(() => {
          setIsSimulating(false);
          setShowResult(true);
      }, 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-amber-400">
        <Server className="w-5 h-5" /> {t('infrastructure_optimizer')}
      </h3>
      
      <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 mb-4">
        <p className="text-xs text-slate-300 leading-relaxed mb-2">
            {t('infra_details')}
        </p>
        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <Info className="w-3 h-3" /> {t('infra_process')}
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 hover:border-amber-500/30 transition-colors group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md ${rec.priority === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    <MapPin className="w-4 h-4" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-200 text-sm">{rec.location}</h4>
                    <span className={`text-[10px] uppercase font-bold ${rec.priority === 'high' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {rec.priority === 'high' ? t('high_priority') : t('medium_priority')}
                    </span>
                </div>
              </div>
              <div className="text-end">
                <div className="text-emerald-400 font-bold text-sm flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3" /> {rec.roi}
                </div>
                <div className="text-[10px] text-slate-500">{t('projected_roi')}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/50">
                <div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                        <Zap className="w-3 h-3 text-blue-400" /> {t('latency_improvement')}
                    </div>
                    <div className="text-slate-200 font-mono text-sm">{rec.latency}</div>
                </div>
                <div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                        <DollarSign className="w-3 h-3 text-green-400" /> {t('cost_estimate')}
                    </div>
                    <div className="text-slate-200 font-mono text-sm">{rec.cost}</div>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-2 bg-blue-900/20 border border-blue-900/50 rounded flex items-start gap-2">
        <Database className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
        <p className="text-[10px] text-blue-200">
            {t('data_disclaimer')}
        </p>
      </div>

      <button 
        onClick={handleSimulate}
        disabled={isSimulating}
        className="w-full mt-6 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4" />}
        {isSimulating ? t('simulating_deployment') : t('deploy_simulation')} 
        {!isSimulating && <ArrowRight className="w-4 h-4" />}
      </button>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 bg-slate-900/95 backdrop-blur-md z-10 rounded-xl flex flex-col items-center justify-center p-6 text-center border border-slate-700"
            >
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{t('deployment_complete')}</h4>
                <div className="space-y-2 w-full mb-6">
                    <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                        <span className="text-slate-400">{t('new_coverage')}</span>
                        <span className="text-white font-bold">+1.2M km²</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                        <span className="text-slate-400">{t('latency_reduced')}</span>
                        <span className="text-white font-bold">-14ms (Avg)</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                        <span className="text-slate-400">{t('revenue_boost')}</span>
                        <span className="text-green-400 font-bold">+$450k/mo</span>
                    </div>
                </div>
                <button 
                    onClick={() => setShowResult(false)}
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm font-medium transition-colors"
                >
                    {t('close')}
                </button>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfrastructurePanel;
