import React from 'react';
import { useTranslation } from 'react-i18next';
import { Radar, Target, Globe, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar, Tooltip } from 'recharts';

const CompetitorPanel: React.FC = () => {
  const { t } = useTranslation();

  const data = [
    { subject: 'Coverage', A: 120, B: 110, fullMark: 150 },
    { subject: 'Latency', A: 98, B: 130, fullMark: 150 },
    { subject: 'Throughput', A: 86, B: 130, fullMark: 150 },
    { subject: 'Cost', A: 99, B: 100, fullMark: 150 },
    { subject: 'Reliability', A: 85, B: 90, fullMark: 150 },
    { subject: 'Growth', A: 65, B: 85, fullMark: 150 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-rose-400">
        <Target className="w-5 h-5" /> {t('competitor_intelligence')}
      </h3>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        {t('comp_desc')}
      </p>

      <div className="h-48 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
            <RechartsRadar name="Starlink" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            <RechartsRadar name="OneWeb" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-950/50 border border-rose-900/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400 mt-1">
                <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
                <h4 className="font-bold text-slate-200 text-sm mb-1">{t('strategic_gap')}</h4>
                <p className="text-xs text-slate-400 mb-2">
                    Competitor launching 40 sats in <span className="text-white font-semibold">North Atlantic</span> region.
                </p>
                <button className="text-xs bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded transition-colors">
                    {t('gap_action')}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorPanel;
