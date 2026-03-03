import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FinancialPanel: React.FC = () => {
  const { t } = useTranslation();

  const data = [
    { month: 'Jan', revenue: 4000, cost: 2400 },
    { month: 'Feb', revenue: 3000, cost: 1398 },
    { month: 'Mar', revenue: 2000, cost: 9800 },
    { month: 'Apr', revenue: 2780, cost: 3908 },
    { month: 'May', revenue: 1890, cost: 4800 },
    { month: 'Jun', revenue: 2390, cost: 3800 },
    { month: 'Jul', revenue: 3490, cost: 4300 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-green-400">
        <DollarSign className="w-5 h-5" /> {t('financial_forecasting')}
      </h3>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        {t('finance_desc')}
      </p>

      <div className="h-48 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
            <YAxis stroke="#94a3b8" fontSize={10} />
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
            <Area type="monotone" dataKey="revenue" stroke="#22c55e" fillOpacity={1} fill="url(#colorRevenue)" />
            <Area type="monotone" dataKey="cost" stroke="#ef4444" fillOpacity={1} fill="url(#colorCost)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-500 mb-1">{t('monthly_revenue')}</div>
              <div className="text-lg font-bold text-green-400 flex items-center gap-1">
                  $3.49M <TrendingUp className="w-4 h-4" />
              </div>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-500 mb-1">{t('net_profit')}</div>
              <div className="text-lg font-bold text-blue-400 flex items-center gap-1">
                  $-0.81M <TrendingDown className="w-4 h-4 text-red-400" />
              </div>
          </div>
      </div>
    </div>
  );
};

export default FinancialPanel;
