import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, CheckCircle, AlertTriangle, ArrowRight, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'motion/react';

const StrategicAdvisorPanel: React.FC = () => {
  const { t } = useTranslation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [scenario, setScenario] = useState<'profit' | 'disaster'>('profit');

  const generateRecommendation = () => {
    setIsAnalyzing(true);
    setRecommendation(null);
    setTimeout(() => {
      setIsAnalyzing(false);
      if (scenario === 'profit') {
        setRecommendation("Deploy 4 additional satellites in equatorial orbit to increase coverage stability by 18% and reduce congestion by 23%. Estimated ROI: 14 months.");
      } else {
        setRecommendation("CRITICAL: Re-route 12 satellites to Caribbean sector. 40% capacity boost for emergency services. Revenue impact: -5%. Lives impacted: ~50,000.");
      }
    }, 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 end-0 p-4 opacity-5">
        <Brain className="w-32 h-32 text-purple-400" />
      </div>

      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-purple-400">
        <Brain className="w-5 h-5" /> {t('strategic_advisor')}
      </h3>
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        {t('advisor_desc')}
      </p>

      <div className="flex gap-2 mb-4">
        <button 
            onClick={() => setScenario('profit')}
            className={`flex-1 py-1.5 text-xs rounded border transition-colors ${scenario === 'profit' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'}`}
        >
            {t('scenario_profit')}
        </button>
        <button 
            onClick={() => setScenario('disaster')}
            className={`flex-1 py-1.5 text-xs rounded border transition-colors ${scenario === 'disaster' ? 'bg-red-600/20 border-red-500 text-red-400' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'}`}
        >
            {t('scenario_disaster')}
        </button>
      </div>

      {!recommendation && !isAnalyzing && (
        <button 
            onClick={generateRecommendation}
            className={`w-full py-3 text-white rounded-lg font-medium transition-all shadow-lg flex items-center justify-center gap-2 ${scenario === 'profit' ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20' : 'bg-red-600 hover:bg-red-500 shadow-red-900/20'}`}
        >
            <Shield className="w-4 h-4" /> {t('run_executive_mode')}
        </button>
      )}

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xs text-purple-300 animate-pulse">{t('analyzing_constellation')}</div>
        </div>
      )}

      {recommendation && (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950/80 border border-purple-500/30 rounded-lg p-4"
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-green-500/20 rounded text-green-400">
                    <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-white">{t('optimization_found')}</span>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed mb-4 border-s-2 border-purple-500 ps-3">
                {recommendation}
            </p>

            <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">{scenario === 'profit' ? t('coverage_stability') : t('capacity_boost')}</div>
                    <div className={`${scenario === 'profit' ? 'text-green-400' : 'text-blue-400'} font-bold flex items-center gap-1`}>
                        {scenario === 'profit' ? '+18%' : '+40%'} <TrendingUp className="w-3 h-3" />
                    </div>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">{scenario === 'profit' ? t('est_roi') : t('lives_impacted')}</div>
                    <div className={`${scenario === 'profit' ? 'text-blue-400' : 'text-green-400'} font-bold`}>
                        {scenario === 'profit' ? `14 ${t('months')}` : '~50,000'}
                    </div>
                </div>
            </div>

            <button 
                onClick={() => setRecommendation(null)}
                className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
            >
                {t('dismiss')}
            </button>
        </motion.div>
      )}
    </div>
  );
};

export default StrategicAdvisorPanel;
