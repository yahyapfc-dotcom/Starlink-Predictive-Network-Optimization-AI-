import React, { useState, useMemo, useEffect, useRef } from 'react';
import { StarlinkDataPoint, generateMockData, SimulationParams } from '../utils/dataGenerator';
import MapComponent from './Map';
import SimulationPanel from './SimulationPanel';
import AnalyticsPanel from './AnalyticsPanel';
import InfrastructurePanel from './InfrastructurePanel';
import CompetitorPanel from './CompetitorPanel';
import FinancialPanel from './FinancialPanel';
import RegulatoryPanel from './RegulatoryPanel';
import SentimentPanel from './SentimentPanel';
import DiagnosticModal from './DiagnosticModal';
import LaserLinkPanel from './LaserLinkPanel';
import MarsColonizationPanel from './MarsColonizationPanel';
import ResiliencePanel from './ResiliencePanel';
import StrategicAdvisorPanel from './StrategicAdvisorPanel';
import ResourcesModal from './ResourcesModal';
import OrbitalPhysicsPanel from './OrbitalPhysicsPanel';
import SystemTestModal from './SystemTestModal';
import OnboardingTour from './OnboardingTour';
import AlertsConfigurationModal from './AlertsConfigurationModal';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis, Legend
} from 'recharts';
import { AlertTriangle, Satellite, Wind, Wifi, Map as MapIcon, Activity, RefreshCw, Download, MapPin, Globe, Play, Pause, Languages, X, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { exportToCSV } from '../utils/csvExport';
import { fetchStarlinkTLEs, parseTLEs, getSatellitePositions, SatellitePosition, countVisibleSatellites } from '../services/satelliteService';
import { fetchWeather } from '../services/weatherService';
import * as satellite from 'satellite.js';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [simParams, setSimParams] = useState<SimulationParams>({
    satelliteModifier: 1,
    weatherSeverity: 0,
    userLoad: 0
  });

  const [data, setData] = useState<StarlinkDataPoint[]>(() => generateMockData(500, simParams));
  const [isGenerating, setIsGenerating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [realSatellites, setRealSatellites] = useState<SatellitePosition[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSats, setLoadingSats] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<StarlinkDataPoint | null>(null);
  const [showResources, setShowResources] = useState(false);
  const [showSystemTest, setShowSystemTest] = useState(false);
  const [showTour, setShowTour] = useState(true); // Show tour by default on load
  const [showAlertsConfig, setShowAlertsConfig] = useState(false);

  const alerts = useMemo(() => {
    return data.filter(d => d.predictedSpeed < 40);
  }, [data]);
  
  // Alert Settings State
  const [alertSettings, setAlertSettings] = useState({
    email: 'yahyapfc@gmail.com',
    additionalEmails: '',
    autoExport: false,
    threshold: 5
  });

  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  // Auto-export and Email Notification Logic
  useEffect(() => {
    if (alertSettings.autoExport && alerts.length >= alertSettings.threshold) {
        // Debounce or limit frequency could be added here, but for now we'll just trigger
        // In a real app, we'd check if we already sent an alert for this batch
        const lastSent = localStorage.getItem('lastAlertSent');
        const now = Date.now();
        
        // Prevent spamming: only send once every minute max
        if (!lastSent || now - parseInt(lastSent) > 60000) {
            exportToCSV(data, `auto-alert-export-${new Date().toISOString()}.csv`);
            
            setNotification({
                message: `Auto-exported CSV & Sent Email to ${alertSettings.email}`,
                type: 'success'
            });
            
            localStorage.setItem('lastAlertSent', now.toString());
        }
    }
  }, [alerts, alertSettings, data]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
        const timer = setTimeout(() => setNotification(null), 3000);
        return () => clearTimeout(timer);
    }
  }, [notification]);
  
  // Gateway Deployment State
  const [isDeployMode, setIsDeployMode] = useState(false);
  const [gateways, setGateways] = useState<{id: string, lat: number, lon: number}[]>([]);
  const [lastDeployedGateway, setLastDeployedGateway] = useState<{
      lat: number, 
      lon: number, 
      revenue: string, 
      latency: string,
      elevation: string,
      interference: string
  } | null>(null);

  // Store parsed TLEs (SatRec objects) in a ref to avoid re-parsing
  const satRecsRef = useRef<{ name: string, satrec: satellite.SatRec }[]>([]);
  const animationRef = useRef<number>();

  // Initial load of satellites
  useEffect(() => {
    const loadSats = async () => {
        setLoadingSats(true);
        const tles = await fetchStarlinkTLEs();
        if (tles.length > 0) {
            // Parse once
            satRecsRef.current = parseTLEs(tles);
            // Initial propagation
            const sats = getSatellitePositions(satRecsRef.current);
            setRealSatellites(sats);
        }
        setLoadingSats(false);
    };
    loadSats();
  }, []);

  // Animation Loop
  useEffect(() => {
    if (!isAnimating || satRecsRef.current.length === 0) {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        return;
    }

    let lastUpdate = 0;
    const updateInterval = 2000; // Update positions every 2 seconds to save performance

    const animate = (timestamp: number) => {
        if (timestamp - lastUpdate > updateInterval) {
            if (satRecsRef.current.length > 0) {
                const now = new Date();
                const sats = getSatellitePositions(satRecsRef.current, now);
                setRealSatellites(sats);
            }
            lastUpdate = timestamp;
        }
        animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating, loadingSats]); // Re-run if loading finishes

  // Regenerate data when simulation parameters change
  useEffect(() => {
    setData(generateMockData(500, simParams));
  }, [simParams]);

  const regenerateData = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setData(generateMockData(500, simParams));
      setIsGenerating(false);
    }, 800);
  };

  const handleExport = () => {
    exportToCSV(data, `starlink-analysis-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const setLocation = async (lat: number, lon: number) => {
    setLoadingLocation(true);
    setUserLocation({ lat, lon });

    // Fetch real weather for this location
    const weather = await fetchWeather(lat, lon);
    
    // Calculate real visible satellites
    const visibleSats = countVisibleSatellites(lat, lon, realSatellites);

    // Create a new data point for the user
    const userPoint: StarlinkDataPoint = {
        id: 'USER-LOC',
        latitude: lat,
        longitude: lon,
        temperature: weather ? weather.temperature : 20, // Fallback
        windSpeed: weather ? weather.windSpeed : 5,
        satelliteCount: visibleSats,
        actualSpeed: 0, // Placeholder
        predictedSpeed: 0 // Will calc below
    };

    // Calculate predicted speed using the same logic as generator
    const baseSpeed = 20;
    const satFactor = userPoint.satelliteCount * 1.5 * simParams.satelliteModifier;
    const windFactor = (userPoint.windSpeed + (simParams.weatherSeverity * 30)) * -0.5;
    const tempFactor = Math.abs(userPoint.temperature - (simParams.weatherSeverity * 10) - 20) * -0.1;
    const loadFactor = simParams.userLoad * -30;
    
    let predicted = baseSpeed + satFactor + windFactor + tempFactor + loadFactor;
    userPoint.predictedSpeed = Math.max(0, Math.min(300, predicted));
    userPoint.actualSpeed = userPoint.predictedSpeed; // Assume accurate for user

    // Add user point to data (or replace existing user point)
    setData(prev => {
        const filtered = prev.filter(p => p.id !== 'USER-LOC');
        return [userPoint, ...filtered];
    });

    setLoadingLocation(false);
    setShowManualLocation(false);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(latitude, longitude);
    }, (error) => {
        console.error("Error getting location", error);
        setLoadingLocation(false);
        alert("Unable to retrieve your location");
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const lat = parseFloat(manualLat);
      const lon = parseFloat(manualLon);
      if (!isNaN(lat) && !isNaN(lon)) {
          setLocation(lat, lon);
      }
  };

  const handleMapClick = (lat: number, lon: number) => {
      if (isDeployMode) {
          // Deploy Gateway Logic
          const newGateway = {
              id: `GW-${Math.floor(Math.random() * 10000)}`,
              lat,
              lon
          };
          setGateways(prev => [...prev, newGateway]);
          
          // Advanced Physics/Strategic Calculations
          // 1. Elevation Angle (Approximate based on latitude)
          const elevation = Math.max(15, 90 - Math.abs(lat) * 0.8).toFixed(1);
          
          // 2. Interference (Random spectrum contention)
          const interference = (Math.random() * 10).toFixed(1);
          
          // 3. Revenue & Latency
          const revenue = `$${(Math.random() * 5 + 1).toFixed(1)}M`;
          const latency = `-${Math.floor(Math.random() * 20 + 5)}ms`;
          
          setLastDeployedGateway({ 
              lat, 
              lon, 
              revenue, 
              latency,
              elevation: `${elevation}°`,
              interference: `${interference}%`
          });
          
          // Exit deploy mode after successful deployment
          setIsDeployMode(false);
      } else {
          setLocation(lat, lon);
      }
  };

  const toggleLanguage = () => {
      const newLang = i18n.language === 'en' ? 'ar' : 'en';
      i18n.changeLanguage(newLang);
      document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const avgSpeed = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.predictedSpeed, 0) / data.length;
  }, [data]);

  const histogramData = useMemo(() => {
    const bins = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200];
    const hist = bins.map((bin, i) => {
      const nextBin = bins[i + 1] || 300;
      const count = data.filter(d => d.predictedSpeed >= bin && d.predictedSpeed < nextBin).length;
      return { range: `${bin}-${nextBin}`, count };
    });
    return hist.filter(h => h.count > 0);
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            {t('command_center_title')}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1">
            <p className="text-slate-400 flex items-center gap-2">
                {t('command_center_subtitle')}
                {realSatellites.length > 0 && (
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {realSatellites.length} {t('live_sats')}
                    </span>
                )}
            </p>
            <span className="hidden md:inline text-slate-600">|</span>
            <p className="text-slate-400 font-medium">{t('developed_by')}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
            <button 
                onClick={() => setShowTour(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-slate-300 border border-slate-700 transition-all"
            >
                <div className="w-4 h-4 rounded-full border-2 border-slate-400 flex items-center justify-center text-[10px] font-bold">?</div>
                {t('help')}
            </button>
            <button 
                onClick={() => setShowSystemTest(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-green-500 border border-green-500/30 transition-all shadow-lg"
            >
                <Activity className="w-4 h-4" />
                {t('system_test')}
            </button>
            <button 
                onClick={() => setShowResources(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-lg font-bold text-white transition-all shadow-lg shadow-orange-900/20"
            >
                <Download className="w-4 h-4" />
                {t('resources')}
            </button>
            <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors"
                title="Toggle Language"
            >
                <Languages className="w-4 h-4" />
                {i18n.language === 'en' ? 'العربية' : 'English'}
            </button>
            <button 
                onClick={() => setIsAnimating(!isAnimating)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isAnimating ? 'bg-amber-600 hover:bg-amber-500' : 'bg-green-600 hover:bg-green-500'}`}
                title={isAnimating ? t('pause_live') : t('resume_live')}
            >
                {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isAnimating ? t('pause_live') : t('resume_live')}
            </button>
            <button 
                onClick={() => setShowManualLocation(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
            >
                <MapPin className="w-4 h-4" />
                {t('manual_location')}
            </button>
            <button 
                onClick={handleLocateMe}
                disabled={loadingLocation}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
                <MapPin className={`w-4 h-4 ${loadingLocation ? 'animate-bounce' : ''}`} />
                {loadingLocation ? t('locating') : t('my_location')}
            </button>
            <button 
                onClick={() => setIsDeployMode(!isDeployMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all shadow-lg ${isDeployMode ? 'bg-amber-500 text-black shadow-amber-500/50 animate-pulse' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
                {isDeployMode ? <AlertTriangle className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
                {isDeployMode ? t('deploy_gateway_mode') : t('view_mode')}
            </button>
            <button 
                onClick={regenerateData}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                {t('refresh_sim')}
            </button>
        </div>
      </header>

      {/* Resources Modal */}
      <AnimatePresence>
        {showResources && (
            <ResourcesModal onClose={() => setShowResources(false)} />
        )}
      </AnimatePresence>

      {/* System Test Modal */}
      <AnimatePresence>
        {showSystemTest && (
            <SystemTestModal onClose={() => setShowSystemTest(false)} />
        )}
      </AnimatePresence>

      {/* Onboarding Tour */}
      <AnimatePresence>
        {showTour && (
            <OnboardingTour onClose={() => setShowTour(false)} />
        )}
      </AnimatePresence>

      {/* Alerts Configuration Modal */}
      <AnimatePresence>
        {showAlertsConfig && (
            <AlertsConfigurationModal 
                onClose={() => setShowAlertsConfig(false)} 
                alerts={alerts}
                settings={alertSettings}
                onUpdateSettings={setAlertSettings}
            />
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
            <motion.div 
                initial={{ opacity: 0, y: -50, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -50, x: '-50%' }}
                className="fixed top-8 left-1/2 bg-slate-800 border border-green-500/50 text-white px-6 py-3 rounded-full shadow-2xl z-[3000] flex items-center gap-3"
            >
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <span className="font-medium text-sm">{notification.message}</span>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Location Modal */}
      <AnimatePresence>
        {showManualLocation && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">{t('manual_location')}</h3>
                        <button onClick={() => setShowManualLocation(false)} className="text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">{t('latitude')}</label>
                            <input 
                                type="number" 
                                step="any" 
                                value={manualLat} 
                                onChange={(e) => setManualLat(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. 25.2048"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">{t('longitude')}</label>
                            <input 
                                type="number" 
                                step="any" 
                                value={manualLon} 
                                onChange={(e) => setManualLon(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. 55.2708"
                                required
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button 
                                type="button" 
                                onClick={() => setShowManualLocation(false)}
                                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
                            >
                                {t('set_location')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Diagnostic Modal */}
      <AnimatePresence>
        {selectedAlert && (
            <DiagnosticModal point={selectedAlert} onClose={() => setSelectedAlert(null)} />
        )}
      </AnimatePresence>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-slate-400 text-sm font-medium">{t('avg_speed')}</span>
          </div>
          <div className="text-2xl font-bold">{avgSpeed.toFixed(1)} <span className="text-sm text-slate-500 font-normal">Mbps</span></div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Satellite className="w-5 h-5" />
            </div>
            <span className="text-slate-400 text-sm font-medium">{t('active_nodes')}</span>
          </div>
          <div className="text-2xl font-bold">{data.length}</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-slate-400 text-sm font-medium">{t('weak_signals')}</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{alerts.length}</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Wifi className="w-5 h-5" />
            </div>
            <span className="text-slate-400 text-sm font-medium">{t('network_health')}</span>
          </div>
          <div className="text-2xl font-bold">
            {avgSpeed > 80 ? t('good') : avgSpeed > 50 ? t('fair') : t('poor')}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Map Section */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-1 overflow-hidden h-[500px] relative shadow-xl"
          >
             <MapComponent 
                data={data} 
                userLocation={userLocation}
                realSatellites={realSatellites}
                gateways={gateways}
                onMapClick={handleMapClick}
                isDeployMode={isDeployMode}
             />
             <div className={`absolute top-4 end-4 bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-700 text-xs z-[1000]`}>
               <div className="font-semibold mb-2">{t('signal_strength')}</div>
               <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> {t('good')} (&gt;80 Mbps)</div>
               <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> {t('fair')} (40-80 Mbps)</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> {t('poor')} (&lt;40 Mbps)</div>
               {realSatellites.length > 0 && (
                   <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700">
                       <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> {t('real_satellite')}
                   </div>
               )}
               <div className="flex items-center gap-2 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> {t('ground_station')}
               </div>
               <div className="flex items-center gap-2 mt-1">
                   <div className="w-4 h-0.5 bg-cyan-400 opacity-50"></div> {t('laser_links_active')}
               </div>
             </div>

             {/* Deployment Instruction Overlay */}
             <AnimatePresence>
                {isDeployMode && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-6 py-2 rounded-full font-bold shadow-lg z-[1000] flex items-center gap-2"
                    >
                        <MapIcon className="w-5 h-5" />
                        {t('click_to_deploy')}
                    </motion.div>
                )}
             </AnimatePresence>

             {/* Deployment Success Overlay */}
             <AnimatePresence>
                {lastDeployedGateway && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-green-500/50 p-6 rounded-xl shadow-2xl z-[1000] text-center min-w-[300px]"
                    >
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{t('deployment_success')}</h3>
                        <div className="grid grid-cols-2 gap-4 mt-4 text-start text-sm">
                            <div className="bg-slate-800/50 p-2 rounded">
                                <div className="text-slate-400 text-xs">{t('new_revenue')}</div>
                                <div className="text-green-400 font-bold">{lastDeployedGateway.revenue}</div>
                            </div>
                            <div className="bg-slate-800/50 p-2 rounded">
                                <div className="text-slate-400 text-xs">{t('latency_reduction')}</div>
                                <div className="text-blue-400 font-bold">{lastDeployedGateway.latency}</div>
                            </div>
                            <div className="bg-slate-800/50 p-2 rounded">
                                <div className="text-slate-400 text-xs">{t('elevation_angle')}</div>
                                <div className="text-amber-400 font-bold">{lastDeployedGateway.elevation}</div>
                            </div>
                            <div className="bg-slate-800/50 p-2 rounded">
                                <div className="text-slate-400 text-xs">{t('rf_interference')}</div>
                                <div className="text-purple-400 font-bold">{lastDeployedGateway.interference}</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setLastDeployedGateway(null)}
                            className="mt-4 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-colors"
                        >
                            {t('dismiss')}
                        </button>
                    </motion.div>
                )}
             </AnimatePresence>
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" /> {t('speed_dist')}
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={histogramData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="range" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Satellite className="w-4 h-4 text-purple-400" /> {t('sats_vs_speed')}
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" dataKey="satelliteCount" name="Satellites" stroke="#94a3b8" fontSize={12} label={{ value: 'Satellites', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }} />
                    <YAxis type="number" dataKey="predictedSpeed" name="Speed" stroke="#94a3b8" fontSize={12} label={{ value: 'Mbps', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
                    <Scatter name="Nodes" data={data} fill="#a855f7" fillOpacity={0.6} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sidebar / Alerts */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Simulation Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <SimulationPanel params={simParams} onChange={setSimParams} />
          </motion.div>

          {/* Strategic Advisor (New Feature) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StrategicAdvisorPanel />
          </motion.div>

          {/* Infrastructure Optimizer (New Feature) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <InfrastructurePanel />
          </motion.div>

          {/* Optical Space Lasers (Musk Feature) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16 }}
          >
            <LaserLinkPanel />
          </motion.div>

          {/* Mars Colonization Link (Musk Inspiration) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.17 }}
          >
            <MarsColonizationPanel />
          </motion.div>

          {/* Civilization Resilience (Musk Inspiration) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 }}
          >
            <ResiliencePanel />
          </motion.div>

          {/* Competitor Intelligence (New Feature) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 }}
          >
            <CompetitorPanel />
          </motion.div>

          {/* Financial Forecasting (New Feature) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FinancialPanel />
          </motion.div>

          {/* Regulatory Compliance (New Feature) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22 }}
          >
            <RegulatoryPanel />
          </motion.div>

          {/* Customer Sentiment (New Feature) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.24 }}
          >
            <SentimentPanel />
          </motion.div>

          {/* Analytics Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AnalyticsPanel />
          </motion.div>

          {/* Orbital Physics (New Feature) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 }}
          >
            <OrbitalPhysicsPanel />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full max-h-[400px] flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-5 h-5" /> {t('weak_signals')}
                </h3>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowAlertsConfig(true)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                        title={t('configure_alerts')}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={handleExport}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                        title={t('export_csv')}
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pe-2 space-y-3 custom-scrollbar">
              {alerts.length === 0 ? (
                <div className="text-slate-500 text-center py-8">{t('no_alerts')}</div>
              ) : (
                alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    onClick={() => setSelectedAlert(alert)}
                    className="bg-slate-950/50 border border-red-900/30 p-3 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs text-slate-500 group-hover:text-blue-400 transition-colors">{alert.id}</span>
                      <span className="text-red-400 font-bold text-sm">{alert.predictedSpeed.toFixed(1)} Mbps</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapIcon className="w-3 h-3" /> {alert.latitude.toFixed(1)}, {alert.longitude.toFixed(1)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Satellite className="w-3 h-3" /> {alert.satelliteCount} Sats
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="w-3 h-3" /> {alert.windSpeed.toFixed(1)} km/h
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        {t('view_details')} <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
