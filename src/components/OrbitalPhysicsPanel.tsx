import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, AlertOctagon, Radio, Satellite, Crosshair, RefreshCw, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OrbitalPhysicsPanel: React.FC = () => {
  const { t } = useTranslation();
  const [dopplerData, setDopplerData] = useState<{time: string, shift: number}[]>([]);

  // Simulate real-time Doppler shift data generation
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const newData = [];
      for (let i = 0; i < 20; i++) {
        const time = new Date(now.getTime() - (20 - i) * 1000);
        // Simulate a doppler curve (approaching -> passing -> receding)
        const shift = Math.sin(i / 3) * 45 + (Math.random() * 2 - 1); 
        newData.push({
          time: time.toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' }),
          shift: shift
        });
      }
      setDopplerData(newData);
    };

    generateData();
    const interval = setInterval(() => {
        setDopplerData(prev => {
            const lastTime = new Date();
            const nextShift = Math.sin(prev.length / 3) * 45 + (Math.random() * 5 - 2.5); // Continue curve
            const newPoint = {
                time: lastTime.toLocaleTimeString([], { hour12: false, second: '2-digit', minute: '2-digit' }),
                shift: nextShift
            };
            return [...prev.slice(1), newPoint];
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-cyan-400">
        <Activity className="w-5 h-5" /> {t('orbital_physics')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Doppler Shift Analysis */}
        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                    <Radio className="w-3 h-3 text-cyan-400" /> {t('doppler_shift')} (kHz)
                </h4>
                <div className="text-[10px] font-mono text-cyan-400 animate-pulse">
                    LIVE TRACKING: SAT-4421
                </div>
            </div>
            <div className="h-32 w-full mb-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dopplerData}>
                        <defs>
                            <linearGradient id="colorShift" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis stroke="#475569" fontSize={10} domain={[-60, 60]} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                            itemStyle={{ color: '#22d3ee' }}
                            labelStyle={{ display: 'none' }}
                            formatter={(value: number) => [`${value.toFixed(2)} kHz`, 'Shift']}
                        />
                        <Area type="monotone" dataKey="shift" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorShift)" isAnimationActive={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-[10px] bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">{t('beam_steering_status')}</span>
                <span className="text-green-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> {t('locked')}
                </span>
            </div>
        </div>

        {/* Collision Avoidance / Conjunction Assessment */}
        <div className="space-y-3">
            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                    <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <AlertOctagon className="w-3 h-3 text-red-500" /> {t('collision_risk')}
                    </div>
                    <div className="text-sm font-bold text-white">
                        0.0004% <span className="text-[10px] text-slate-500 font-normal">/ 24h</span>
                    </div>
                </div>
                <div className="text-end">
                    <div className="text-[10px] text-slate-500 mb-1">{t('conjunctions')}</div>
                    <div className="text-sm font-bold text-yellow-400">3 <span className="text-[10px] text-slate-500 font-normal">Active</span></div>
                </div>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Crosshair className="w-3 h-3 text-green-500" /> {t('autonomous_maneuvers')}
                    </div>
                    <RefreshCw className="w-3 h-3 text-slate-600" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-300">SAT-1192 vs DEBRIS-99</span>
                        <span className="text-green-400 font-mono">EXECUTED</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-full"></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] mt-1">
                        <span className="text-slate-300">SAT-3301 vs ONEWEB-4</span>
                        <span className="text-yellow-400 font-mono">CALCULATING...</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                        <motion.div 
                            className="bg-yellow-500 h-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "65%" }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default OrbitalPhysicsPanel;
