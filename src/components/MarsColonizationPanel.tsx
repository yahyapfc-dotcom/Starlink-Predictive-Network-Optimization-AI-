import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Rocket, Globe, Database, Cpu, Activity, Zap, Star } from 'lucide-react';
import { motion } from 'motion/react';

const MarsColonizationPanel: React.FC = () => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 0.5 : 0));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group">
      {/* Background Mars Effect */}
      <div className="absolute -end-10 -top-10 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl group-hover:bg-orange-600/30 transition-all duration-1000"></div>
      
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-orange-500">
        <Rocket className="w-5 h-5" /> {t('mars_link_title')}
      </h3>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        {t('mars_link_desc')}
      </p>

      {/* Connection Status */}
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex flex-col items-center z-10">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/50 mb-1">
                <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[10px] text-blue-300 font-bold">EARTH</span>
        </div>

        {/* Animated Beam */}
        <div className="flex-1 h-0.5 bg-slate-800 mx-2 relative">
            <motion.div 
                className="absolute top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-500 via-white to-orange-500 w-1/3 rounded-full blur-[1px]"
                animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
             <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 text-[9px] text-slate-500 font-mono bg-slate-900 px-1">
                {t('light_delay')}: 12.5m
            </div>
        </div>

        <div className="flex flex-col items-center z-10">
            <div className="w-10 h-10 bg-orange-600/20 rounded-full flex items-center justify-center border border-orange-600/50 mb-1 shadow-[0_0_15px_rgba(234,88,12,0.3)]">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse absolute top-0 end-0"></div>
                <Rocket className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-[10px] text-orange-400 font-bold">MARS</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Database className="w-3 h-3 text-purple-400" /> {t('bandwidth')}
            </div>
            <div className="text-lg font-bold text-slate-200 font-mono">450 <span className="text-xs text-slate-500">Gbps</span></div>
        </div>
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Cpu className="w-3 h-3 text-green-400" /> {t('ai_sync')}
            </div>
            <div className="text-lg font-bold text-slate-200 font-mono">99.9<span className="text-xs text-slate-500">%</span></div>
        </div>
      </div>

      {/* Inspirational Quote */}
      <div className="mt-4 pt-4 border-t border-slate-800/50 text-center">
        <p className="text-xs italic text-slate-400 font-serif">
            "{t('consciousness_backup')}"
        </p>
        <div className="flex justify-center mt-2">
            <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                    <motion.div 
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                    >
                        <Star className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                    </motion.div>
                ))}
            </div>
        </div>
      </div>

    </div>
  );
};

export default MarsColonizationPanel;
