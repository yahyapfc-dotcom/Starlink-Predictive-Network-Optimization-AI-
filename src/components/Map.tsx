import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { StarlinkDataPoint } from '../utils/dataGenerator';
import { SatellitePosition } from '../services/satelliteService';
import { useTranslation } from 'react-i18next';

interface MapProps {
  data: StarlinkDataPoint[];
  userLocation?: { lat: number; lon: number } | null;
  realSatellites?: SatellitePosition[];
  onMapClick?: (lat: number, lon: number) => void;
}

// Fix for Leaflet default icon issues in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Custom icons
const userIcon = L.divIcon({
  className: 'custom-user-icon',
  html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const satIcon = L.divIcon({
  className: 'custom-sat-icon',
  html: `<div style="background-color: #a855f7; width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 4px #a855f7;"></div>`,
  iconSize: [8, 8],
  iconAnchor: [4, 4]
});

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const getColor = (speed: number) => {
  if (speed < 40) return '#ef4444'; // Red - Poor
  if (speed < 80) return '#eab308'; // Yellow - Fair
  return '#22c55e'; // Green - Good
};

// Component to handle map view updates
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
        map.flyTo(center, 8, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

// Component to handle map clicks
const MapClickHandler: React.FC<{ onMapClick?: (lat: number, lon: number) => void }> = ({ onMapClick }) => {
    useMapEvents({
        click(e) {
            if (onMapClick && e.latlng && !isNaN(e.latlng.lat) && !isNaN(e.latlng.lng)) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
};

// Component to track map bounds and zoom for culling
const MapBoundsTracker: React.FC<{ 
    setBounds: (bounds: L.LatLngBounds) => void;
    setZoom: (zoom: number) => void;
}> = ({ setBounds, setZoom }) => {
    const map = useMapEvents({
        moveend: () => {
            setBounds(map.getBounds());
            setZoom(map.getZoom());
        },
        zoomend: () => {
             setBounds(map.getBounds());
             setZoom(map.getZoom());
        },
        load: () => {
            setBounds(map.getBounds());
            setZoom(map.getZoom());
        }
    });
    
    // Set initial bounds on mount
    useEffect(() => {
        setBounds(map.getBounds());
        setZoom(map.getZoom());
    }, [map, setBounds, setZoom]);
    
    return null;
};

const MapComponent: React.FC<MapProps> = ({ data, userLocation, realSatellites = [], onMapClick }) => {
  const { t } = useTranslation();
  const [bounds, setBounds] = React.useState<L.LatLngBounds | null>(null);
  const [zoom, setZoom] = React.useState<number>(2);

  // Frustum Culling & LOD Logic
  const visibleSatellites = React.useMemo(() => {
    if (!realSatellites.length) return [];
    
    // 1. Frustum Culling: Only consider sats within current map view
    // If bounds aren't ready yet, show none or a small global sample
    let candidates = realSatellites;
    
    if (bounds) {
        // Expand bounds slightly to avoid pop-in at edges
        const paddedBounds = bounds.pad(0.1); 
        candidates = realSatellites.filter(sat => 
            paddedBounds.contains([sat.latitude, sat.longitude])
        );
    } else {
        // Fallback if map isn't ready: show nothing or very sparse
        return [];
    }

    // 2. Level of Detail (LOD) / Sampling
    // If we have too many candidates for the current view, sample them.
    // We want more detail at higher zoom levels.
    
    const MAX_VISIBLE_MARKERS = 500; // Hard limit for performance
    
    if (candidates.length > MAX_VISIBLE_MARKERS) {
        // Calculate a step to reduce count to MAX_VISIBLE_MARKERS
        const step = Math.ceil(candidates.length / MAX_VISIBLE_MARKERS);
        return candidates.filter((_, i) => i % step === 0);
    }
    
    return candidates;
  }, [realSatellites, bounds, zoom]);

  return (
    <MapContainer 
      center={[20, 0]} 
      zoom={2} 
      scrollWheelZoom={true} 
      className="w-full h-full rounded-xl z-0"
      style={{ minHeight: '400px', background: '#0f172a' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      <MapClickHandler onMapClick={onMapClick} />
      <MapBoundsTracker setBounds={setBounds} setZoom={setZoom} />

      {/* Heatmap Points - Also cull these if needed, but usually fewer */}
      {data.map((point) => {
        if (isNaN(point.latitude) || isNaN(point.longitude)) return null;
        return (
        <CircleMarker
          key={point.id}
          center={[point.latitude, point.longitude]}
          pathOptions={{ 
            color: getColor(point.predictedSpeed),
            fillColor: getColor(point.predictedSpeed),
            fillOpacity: 0.7,
            weight: 1
          }}
          radius={5}
        >
          <Popup className="custom-popup">
            <div className="p-2 text-slate-900 min-w-[150px]">
              <h3 className="font-bold mb-1 border-b border-slate-300 pb-1">{t('node')}: {point.id}</h3>
              <p className="text-sm m-0">Lat: {point.latitude.toFixed(2)}, Lon: {point.longitude.toFixed(2)}</p>
              <p className="text-sm m-0">{t('satellites')}: {point.satelliteCount}</p>
              <p className="text-sm m-0">{t('wind')}: {point.windSpeed.toFixed(1)} km/h</p>
              <div className="mt-2 pt-2 border-t border-slate-200">
                <p className="font-semibold m-0">{t('predicted_speed')}: {point.predictedSpeed.toFixed(1)} Mbps</p>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      )})}

      {/* Real Satellites */}
      {visibleSatellites.map((sat, idx) => {
        if (isNaN(sat.latitude) || isNaN(sat.longitude)) return null;
        return (
        <Marker 
            key={`sat-${idx}`} 
            position={[sat.latitude, sat.longitude]} 
            icon={satIcon}
            zIndexOffset={1000} // Keep above heatmap
        >
             <Popup className="custom-popup">
                <div className="p-2 text-slate-900 min-w-[150px]">
                    <h3 className="font-bold mb-1 border-b border-slate-300 pb-1">{t('satellite_info')}</h3>
                    <p className="text-xs font-mono mb-1">ID: {sat.satId}</p>
                    <p className="text-sm m-0">{t('altitude')}: {sat.height.toFixed(1)} km</p>
                    <p className="text-sm m-0">{t('velocity')}: {sat.velocity.toFixed(2)} km/s</p>
                </div>
            </Popup>
        </Marker>
      )})}

      {/* User Location */}
      {userLocation && !isNaN(userLocation.lat) && !isNaN(userLocation.lon) && (
        <>
          <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
            <Popup className="custom-popup">
                <div className="p-2 text-slate-900 min-w-[120px]">
                    <h3 className="font-bold">{t('your_location')}</h3>
                    <p className="text-xs">Lat: {userLocation.lat.toFixed(4)}</p>
                    <p className="text-xs">Lon: {userLocation.lon.toFixed(4)}</p>
                </div>
            </Popup>
          </Marker>
          <MapUpdater center={[userLocation.lat, userLocation.lon]} />
        </>
      )}

    </MapContainer>
  );
};

export default MapComponent;
