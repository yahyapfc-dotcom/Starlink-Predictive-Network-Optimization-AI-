import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { BrainCircuit, CheckCircle, BarChart2 } from 'lucide-react';

const COLORS = ['#a855f7', '#3b82f6', '#f97316', '#ef4444'];

const AnalyticsPanel: React.FC = () => {
  
  // Simulated Feature Importance Data
  const featureData = [
    { name: 'Satellites', value: 40 },
    { name: 'Weather', value: 35 },
    { name: 'Time/Load', value: 25 },
  ];

  // Simulated Model Metrics
  const modelMetrics = [
    { subject: 'Accuracy', A: 92, fullMark: 100 },
    { subject: 'Precision', A: 88, fullMark: 100 },
    { subject: 'Recall', A: 85, fullMark: 100 },
    { subject: 'F1 Score', A: 86, fullMark: 100 },
    { subject: 'Latency', A: 95, fullMark: 100 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-emerald-400">
        <BrainCircuit className="w-5 h-5" /> Model Analytics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature Importance */}
        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4" /> Feature Importance
          </h4>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={featureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {featureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="absolute top-0 end-0 text-xs space-y-1">
                {featureData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                        <span className="text-slate-400">{entry.name} ({entry.value}%)</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Model Accuracy Radar */}
        <div>
          <h4 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Performance Metrics
          </h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={modelMetrics}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="XGBoost Model"
                  dataKey="A"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center">
          <div>
              <div className="text-2xl font-bold text-emerald-400">94.2%</div>
              <div className="text-xs text-slate-500">Accuracy</div>
          </div>
          <div>
              <div className="text-2xl font-bold text-blue-400">0.8s</div>
              <div className="text-xs text-slate-500">Inference Time</div>
          </div>
          <div>
              <div className="text-2xl font-bold text-purple-400">XGBoost</div>
              <div className="text-xs text-slate-500">Algorithm</div>
          </div>
      </div>

    </div>
  );
};

export default AnalyticsPanel;
