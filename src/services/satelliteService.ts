import * as satellite from 'satellite.js';
import axios from 'axios';

// CelesTrak URL for Starlink satellites
const TLE_URL = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle';

export interface SatellitePosition {
  satId: string;
  latitude: number;
  longitude: number;
  height: number;
  velocity: number;
}

// Generate fallback TLEs if API fails (Simulated Constellation)
const generateFallbackTLEs = (count: number = 100): string[] => {
    const tles: string[] = [];
    for (let i = 0; i < count; i++) {
        const id = 70000 + i;
        const meanAnomaly = (i * (360 / count)) % 360;
        const raan = (i * (180 / count)) % 360; // Spread across planes
        
        // Construct a valid-ish TLE
        // Line 1: ID, Epoch (current year)
        const line1 = `1 ${id}U 23001A   23001.00000000  .00000000  00000-0  00000-0 0  9999`;
        // Line 2: Inc 53.0, RAAN, Ecc 0.0001, ArgPer 0, MeanAnom, MeanMotion 15.06 (approx 550km)
        const line2 = `2 ${id}  53.0000 ${raan.toFixed(4)} 0001000   0.0000 ${meanAnomaly.toFixed(4)} 15.06000000    1`;
        
        tles.push(`STARLINK-SIM-${i+1}`);
        tles.push(line1);
        tles.push(line2);
    }
    return tles;
};

export const fetchStarlinkTLEs = async (): Promise<string[]> => {
  try {
    const response = await axios.get(TLE_URL, { timeout: 5000 });
    const tleData = response.data;
    const lines = tleData.split('\n');
    return lines;
  } catch (error) {
    console.warn("Failed to fetch TLEs (using fallback simulation):", error);
    return generateFallbackTLEs(150);
  }
};

// Parse TLE strings into SatRec objects (do this once)
export const parseTLEs = (tleLines: string[]): { name: string, satrec: satellite.SatRec }[] => {
    const satrecs: { name: string, satrec: satellite.SatRec }[] = [];
    
    for (let i = 0; i < tleLines.length; i += 3) {
        const name = tleLines[i]?.trim();
        const line1 = tleLines[i + 1]?.trim();
        const line2 = tleLines[i + 2]?.trim();
    
        if (!name || !line1 || !line2) continue;
    
        try {
          const satrec = satellite.twoline2satrec(line1, line2);
          satrecs.push({ name, satrec });
        } catch (e) {
          // Skip invalid
        }
    }
    return satrecs;
};

// Propagate all satellites to a specific time (do this every frame/tick)
export const getSatellitePositions = (
    satrecs: { name: string, satrec: satellite.SatRec }[], 
    date: Date = new Date()
): SatellitePosition[] => {
    const positions: SatellitePosition[] = [];
    const gmst = satellite.gstime(date);

    for (const { name, satrec } of satrecs) {
        try {
            const positionAndVelocity = satellite.propagate(satrec, date);
            const positionEci = positionAndVelocity.position;
            const velocityEci = positionAndVelocity.velocity;
      
            if (positionEci && typeof positionEci !== 'boolean') {
              const positionGd = satellite.eciToGeodetic(positionEci, gmst);
      
              const longitude = satellite.degreesLong(positionGd.longitude);
              const latitude = satellite.degreesLat(positionGd.latitude);
              const height = positionGd.height;
              
              let velocity = 0;
              if (velocityEci && typeof velocityEci !== 'boolean') {
                  velocity = Math.sqrt(
                      Math.pow(velocityEci.x, 2) + 
                      Math.pow(velocityEci.y, 2) + 
                      Math.pow(velocityEci.z, 2)
                  );
              }
      
              positions.push({
                satId: name,
                latitude,
                longitude,
                height,
                velocity
              });
            }
        } catch (e) {
            continue;
        }
    }
    return positions;
};

// Legacy support if needed, or wrapper
export const propagateSatellites = (tleLines: string[]): SatellitePosition[] => {
    const satrecs = parseTLEs(tleLines);
    return getSatellitePositions(satrecs);
};

// Calculate how many satellites are visible from a specific location (simplified)
export const countVisibleSatellites = (
  userLat: number, 
  userLon: number, 
  satellites: SatellitePosition[],
  minElevation: number = 25 // degrees
): number => {
  // Simplified visibility check based on distance/horizon
  const VISIBLE_RADIUS_KM = 800; 
  let count = 0;

  for (const sat of satellites) {
    const dist = getDistanceFromLatLonInKm(userLat, userLon, sat.latitude, sat.longitude);
    if (dist < VISIBLE_RADIUS_KM) {
      count++;
    }
  }
  return count;
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}
