import React from 'react';
import { SimulationParams } from '../utils/dataGenerator';
import { Sliders, CloudRain, Users, Satellite } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SimulationPanelProps {
  params: SimulationParams;
  onChange: (newParams: SimulationParams) => void;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ params, onChange }) => {
  const { t } = useTranslation();
  
  const handleChange = (key: keyof SimulationParams, value: number) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-blue-400">
        <Sliders className="w-5 h-5" /> {t('simulation')}
      </h3>
      
      <div className="space-y-6">
        {/* Satellite Modifier */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Satellite className="w-4 h-4 text-purple-400" /> {t('sat_density')}
            </label>
            <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-purple-300">
              {Math.round(params.satelliteModifier * 100)}%
            </span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="1.5" 
            step="0.1"
            value={params.satelliteModifier}
            onChange={(e) => handleChange('satelliteModifier', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>-50%</span>
            <span>100%</span>
            <span>+50%</span>
          </div>
        </div>

        {/* Weather Severity */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-blue-400" /> {t('weather_severity')}
            </label>
            <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-blue-300">
              {params.weatherSeverity === 0 ? 'Clear' : params.weatherSeverity === 1 ? 'Storm' : 'Moderate'}
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1"
            value={params.weatherSeverity}
            onChange={(e) => handleChange('weatherSeverity', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Clear</span>
            <span>Storm</span>
          </div>
        </div>

        {/* User Load */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-400" /> {t('user_load')}
            </label>
            <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-orange-300">
              {Math.round(params.userLoad * 100)}%
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1"
            value={params.userLoad}
            onChange={(e) => handleChange('userLoad', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationPanel;
