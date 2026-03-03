import { StarlinkDataPoint } from './dataGenerator';

export interface DiagnosticResult {
  rootCause: string;
  technicalDetails: string;
  recommendedAction: string;
  impactLevel: 'Critical' | 'High' | 'Medium';
  estimatedFixTime: string;
}

export const analyzeSignal = (point: StarlinkDataPoint): DiagnosticResult => {
  const { satelliteCount, windSpeed, temperature, predictedSpeed } = point;

  // Scenario 1: Severe Obstruction / Coverage Gap
  if (satelliteCount < 3) {
    return {
      rootCause: "Critical Constellation Gap / Local Obstruction",
      technicalDetails: `Visible satellites (${satelliteCount}) below minimum diversity threshold (3). Likely caused by physical obstruction (FOV < 100 degrees) or orbital plane gap at Lat ${point.latitude.toFixed(2)}.`,
      recommendedAction: "1. Verify user obstruction map via App. 2. Dispatch field tech for dish relocation. 3. Prioritize orbital plane fill for this latitude.",
      impactLevel: 'Critical',
      estimatedFixTime: "Immediate (User Action) / 2-4 Weeks (Satellite Drift)"
    };
  }

  // Scenario 2: Weather Interference (Rain Fade / Wind)
  if (windSpeed > 15 || (temperature < -10 || temperature > 45)) {
    return {
      rootCause: "Environmental Interference (Ka-Band Attenuation)",
      technicalDetails: `Signal-to-Noise Ratio (SNR) degraded due to atmospheric conditions. Wind (${windSpeed.toFixed(1)} m/s) may be causing dish misalignment/vibration. Thermal throttling possible at ${temperature}°C.`,
      recommendedAction: "1. Enable 'Snow Melt' mode if applicable. 2. Check mount rigidity. 3. Dynamic power adjustment on satellite beamforming.",
      impactLevel: 'High',
      estimatedFixTime: "Duration of Weather Event"
    };
  }

  // Scenario 3: Network Congestion
  if (predictedSpeed < 20 && satelliteCount >= 5) {
    return {
      rootCause: "Cell Saturation / Backhaul Congestion",
      technicalDetails: `High user density in cell ID ${point.id.substring(0, 4)}. Ground station backhaul utilization > 90%. Air interface contention high despite good satellite visibility.`,
      recommendedAction: "1. Deprioritize heavy bandwidth users (fair use policy). 2. Route traffic to secondary Ground Station. 3. Halt new user signups in this cell.",
      impactLevel: 'Medium',
      estimatedFixTime: "Variable (Traffic Management)"
    };
  }

  // Default: General Weak Signal
  return {
    rootCause: "Sub-optimal Link Budget",
    technicalDetails: "Combination of minor obstruction, distance from beam center, and modulation coding scheme (MCS) drop.",
    recommendedAction: "Monitor for 24h. If persistent, initiate automated health check on user terminal.",
    impactLevel: 'Medium',
    estimatedFixTime: "24-48 Hours"
  };
};
