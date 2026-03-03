import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Globe, TrendingUp, ArrowRight, Activity, Rocket } from 'lucide-react';
import { motion } from 'motion/react';

const LaserLinkPanel: React.FC = () => {
  const { t } = useTranslation();
  const [route, setRoute] = useState('ny-lon');

  const routes = {
    'ny-lon': {
      name: 'New York <-> London',
      distance: 5576,
      fiberLatency: 59, // Approx RTD in ms
      starlinkLatency: 43, // Theoretical ISL
      value: '$14M/yr'
    },
    'lon-tok': {
      name: 'London <-> Tokyo',
      distance: 9556,
      fiberLatency: 156,
      starlinkLatency: 98,
      value: '$32M/yr'
    },
    'sf-sin': {
      name: 'San Francisco <-> Singapore',
      distance: 13580,
      fiberLatency: 175,
      starlinkLatency: 115,
      value: '$28M/yr'
    }
  };

  const selected = routes[route as keyof typeof routes];
  const improvement = selected.fiberLatency - selected.starlinkLatency;
  const percent = Math.round((improvement / selected.fiberLatency) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-0 end-0 p-4 opacity-10">
        <Rocket className="w-24 h-24 text-blue-400" />
      </div>

      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-cyan-400">
        <Zap className="w-5 h-5" /> {t('laser_links')}
      </h3>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        {t('laser_desc')}
      </p>

      {/* Route Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Object.entries(routes).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setRoute(key)}
            className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
              route === key 
                ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-700' 
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-600'
            }`}
          >
            {data.name}
          </button>
        ))}
      </div>

      {/* Comparison Visualization */}
      <div className="space-y-6">
        
        {/* Fiber */}
        <div className="relative">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1"><Globe className="w-3 h-3" /> {t('fiber_optic')}</span>
            <span className="text-slate-300 font-mono">{selected.fiberLatency} ms</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
              className="h-full bg-slate-600/50"
            />
          </div>
          <div className="text-[10px] text-slate-500 mt-1">{t('light_in_glass')} (~200,000 km/s)</div>
        </div>

        {/* Starlink ISL */}
        <div className="relative">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-cyan-400 flex items-center gap-1"><Zap className="w-3 h-3" /> {t('starlink_laser')}</span>
            <span className="text-cyan-300 font-bold font-mono">{selected.starlinkLatency} ms</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
             <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, ease: "linear", repeat: Infinity }} // Faster
              className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            />
          </div>
          <div className="text-[10px] text-cyan-500/70 mt-1">{t('light_in_vacuum')} (~300,000 km/s)</div>
        </div>

      </div>

      {/* Results */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-500 mb-1">{t('latency_savings')}</div>
            <div className="text-lg font-bold text-white flex items-center gap-1">
                -{improvement} ms <span className="text-xs text-green-400 font-normal">({percent}%)</span>
            </div>
        </div>
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-500 mb-1">{t('hft_value')}</div>
            <div className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                {selected.value} <TrendingUp className="w-4 h-4" />
            </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[10px] text-slate-500">
            {t('physics_limit')}
          </div>
          <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
            {t('first_principles')} <ArrowRight className="w-3 h-3" />
          </div>
      </div>

    </div>
  );
};

export default LaserLinkPanel;
