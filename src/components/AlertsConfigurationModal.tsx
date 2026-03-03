import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { X, Mail, Download, Bell, Users, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { StarlinkDataPoint } from '../utils/dataGenerator';
import { exportToCSV } from '../utils/csvExport';

interface AlertsConfigurationModalProps {
  onClose: () => void;
  alerts: StarlinkDataPoint[];
  settings: {
    email: string;
    additionalEmails: string;
    autoExport: boolean;
    threshold: number;
  };
  onUpdateSettings: (settings: any) => void;
}

const AlertsConfigurationModal: React.FC<AlertsConfigurationModalProps> = ({ onClose, alerts, settings, onUpdateSettings }) => {
  const { t } = useTranslation();
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const constraintsRef = React.useRef(null);

  const handleSendTest = () => {
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const updateSetting = (key: string, value: any) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleManualExport = () => {
    exportToCSV(alerts, `network-alerts-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <motion.div 
        ref={constraintsRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
    >
        <motion.div 
            drag
            dragConstraints={constraintsRef}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 cursor-move flex-none">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Bell className="w-5 h-5 text-blue-400" />
                    {t('alert_configuration')}
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                {/* Signal Prediction Parameters */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4" /> {t('signal_parameters')}
                    </h3>
                    
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-2">
                                <span>{t('weak_signal_threshold')}</span>
                                <span className="text-white font-bold">{settings.weakSignalThreshold} Mbps</span>
                            </div>
                            <input 
                                type="range" 
                                min="10" 
                                max="100" 
                                step="5"
                                value={settings.weakSignalThreshold}
                                onChange={(e) => updateSetting('weakSignalThreshold', parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>10 Mbps</span>
                                <span>100 Mbps</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 italic">
                            * {t('threshold_desc')}
                        </p>
                    </div>
                </div>

                {/* Email Configuration */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Mail className="w-4 h-4" /> {t('email_notifications')}
                    </h3>
                    
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">{t('primary_recipient')}</label>
                            <input 
                                type="email" 
                                value={settings.email}
                                onChange={(e) => updateSetting('email', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                                <Users className="w-3 h-3" /> {t('distribution_list')}
                            </label>
                            <textarea 
                                value={settings.additionalEmails}
                                onChange={(e) => updateSetting('additionalEmails', e.target.value)}
                                placeholder={t('enter_emails_placeholder')}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button 
                                onClick={handleSendTest}
                                disabled={isSending}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold text-white transition-all disabled:opacity-50"
                            >
                                {isSending ? (
                                    <span className="animate-spin">⌛</span>
                                ) : showSuccess ? (
                                    <CheckCircle className="w-4 h-4" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                {showSuccess ? t('sent_successfully') : t('send_test_alert')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Auto-Export Configuration */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Download className="w-4 h-4" /> {t('auto_export_settings')}
                    </h3>
                    
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer flex ${settings.autoExport ? 'bg-green-500' : 'bg-slate-700'}`} onClick={() => updateSetting('autoExport', !settings.autoExport)}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${settings.autoExport ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'}`} />
                                </div>
                                <span className="text-sm font-medium text-slate-300">{t('enable_auto_export')}</span>
                            </div>
                        </div>

                        {settings.autoExport && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="pt-2 border-t border-slate-800/50"
                            >
                                <label className="block text-xs text-slate-400 mb-2">{t('trigger_threshold')}</label>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="number" 
                                        value={settings.threshold}
                                        onChange={(e) => updateSetting('threshold', parseInt(e.target.value))}
                                        className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white text-center"
                                        min="1"
                                    />
                                    <span className="text-sm text-slate-500">{t('alerts_detected')}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2 italic">
                                    * {t('auto_export_desc')}
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Current Status */}
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">{alerts.length} {t('active_alerts')}</div>
                            <div className="text-xs text-slate-400">{t('ready_for_export')}</div>
                        </div>
                    </div>
                    <button 
                        onClick={handleManualExport}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-white transition-colors border border-slate-600"
                    >
                        {t('export_now')}
                    </button>
                </div>
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end flex-none">
                <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-white text-black hover:bg-slate-200 rounded-lg font-bold transition-colors"
                >
                    {t('done')}
                </button>
            </div>
        </motion.div>
    </motion.div>
  );
};

export default AlertsConfigurationModal;
