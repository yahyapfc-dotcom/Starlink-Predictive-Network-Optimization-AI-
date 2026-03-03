import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, BookOpen, Share2, AlertOctagon, CheckCircle, Infinity } from 'lucide-react';
import { motion } from 'motion/react';

const ResiliencePanel: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute -start-10 -bottom-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-400">
                <Shield className="w-5 h-5" /> {t('resilience_title')}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
                {t('resilience_desc')}
            </p>
        </div>
        <div className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-[10px] font-mono text-slate-300">
            {t('dont_panic')}
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-4">
        
        {/* Knowledge Cache */}
        <div className="relative pt-2">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-blue-400" /> {t('knowledge_cache')}
                </span>
                <span className="text-emerald-400 font-mono">42 PB {t('synced')}</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '68%' }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="h-full bg-blue-500"
                />
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{t('wikipedia_archived')}</div>
        </div>

        {/* Censorship Resistance */}
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-purple-400" />
                <div className="text-xs text-slate-300">{t('censorship_resistance')}</div>
            </div>
            <div className="text-sm font-bold text-purple-400">99.99%</div>
        </div>

        {/* Great Filter Distance */}
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Infinity className="w-4 h-4 text-amber-400" />
                    <div className="text-xs text-slate-300">{t('civilization_type')}</div>
                </div>
                <div className="text-sm font-bold text-amber-400">0.73 <span className="text-[10px] text-slate-500">→ 1.0</span></div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <CheckCircle className="w-3 h-3 text-green-500" />
                {t('energy_abundance')}
                <span className="mx-1">•</span>
                <CheckCircle className="w-3 h-3 text-green-500" />
                {t('multi_planetary')}
            </div>
        </div>

      </div>

      {/* Footer Message */}
      <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              {t('preserving_light')}
          </p>
      </div>

    </div>
  );
};

export default ResiliencePanel;
