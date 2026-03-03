import React from 'react';
import { useTranslation } from 'react-i18next';
import { StarlinkDataPoint } from '../utils/dataGenerator';
import { analyzeSignal } from '../utils/diagnostics';
import { X, AlertTriangle, Activity, Wrench, Clock, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface DiagnosticModalProps {
  point: StarlinkDataPoint;
  onClose: () => void;
}

const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ point, onClose }) => {
  const { t } = useTranslation();
  const diagnosis = analyzeSignal(point);
  const constraintsRef = React.useRef(null);

  return (
    <motion.div 
        ref={constraintsRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
        onClick={onClose}
    >
        <motion.div 
            drag
            dragConstraints={constraintsRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700 cursor-move flex-none">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{t('diagnostic_report')}</h2>
                        <p className="text-sm text-slate-400 font-mono">Node ID: {point.id}</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <div className="text-xs text-slate-500 uppercase mb-1">{t('predicted_speed')}</div>
                        <div className="text-xl font-bold text-red-400">{point.predictedSpeed.toFixed(1)} Mbps</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <div className="text-xs text-slate-500 uppercase mb-1">{t('impact_level')}</div>
                        <div className={`text-xl font-bold ${diagnosis.impactLevel === 'Critical' ? 'text-red-500' : 'text-orange-400'}`}>
                            {t(diagnosis.impactLevel.toLowerCase())}
                        </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <div className="text-xs text-slate-500 uppercase mb-1">{t('est_fix_time')}</div>
                        <div className="text-lg font-bold text-blue-400">{diagnosis.estimatedFixTime}</div>
                    </div>
                </div>

                {/* Analysis Sections */}
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="mt-1">
                            <Activity className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-200 mb-1">{t('root_cause')}</h3>
                            <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                {diagnosis.rootCause}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="mt-1">
                            <FileText className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-200 mb-1">{t('tech_details')}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {diagnosis.technicalDetails}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="mt-1">
                            <Wrench className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-200 mb-1">{t('rec_action')}</h3>
                            <div className="text-sm text-green-300 bg-green-900/10 p-3 rounded-lg border border-green-900/30">
                                {diagnosis.recommendedAction}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-800/50 p-4 border-t border-slate-800 flex justify-end flex-none">
                <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                >
                    Close Report
                </button>
            </div>
        </motion.div>
    </motion.div>
  );
};

export default DiagnosticModal;
