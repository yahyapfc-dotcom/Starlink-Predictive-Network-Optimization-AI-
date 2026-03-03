import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, FileCheck, AlertOctagon } from 'lucide-react';

const RegulatoryPanel: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-indigo-400">
        <Scale className="w-5 h-5" /> {t('regulatory_compliance')}
      </h3>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        {t('compliance_desc')}
      </p>

      <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                      <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                      <div className="text-sm font-bold text-slate-200">FCC (USA)</div>
                      <div className="text-xs text-slate-500">{t('license_status')}: Active</div>
                  </div>
              </div>
              <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded font-bold">OK</div>
          </div>

          <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                      <AlertOctagon className="w-4 h-4" />
                  </div>
                  <div>
                      <div className="text-sm font-bold text-slate-200">Ofcom (UK)</div>
                      <div className="text-xs text-slate-500">{t('license_status')}: Review</div>
                  </div>
              </div>
              <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded font-bold">Pending</div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-300">{t('orbital_debris')}</span>
                  <span className="text-sm font-bold text-green-400">Low (0.02%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '2%' }}></div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default RegulatoryPanel;
