export interface StarlinkDataPoint {
  id: string;
  latitude: number;
  longitude: number;
  temperature: number;
  windSpeed: number;
  satelliteCount: number;
  actualSpeed: number;
  predictedSpeed: number;
}

export interface SimulationParams {
  satelliteModifier: number; // 1.0 is normal, 0.8 is -20%
  weatherSeverity: number; // 0 is clear, 1 is storm
  userLoad: number; // 0 is low, 1 is high
}

export const generateMockData = (count: number = 500, params: SimulationParams = { satelliteModifier: 1, weatherSeverity: 0, userLoad: 0 }): StarlinkDataPoint[] => {
  const data: StarlinkDataPoint[] = [];

  for (let i = 0; i < count; i++) {
    const latitude = (Math.random() * 140) - 70; 
    const longitude = (Math.random() * 360) - 180;

    // Apply weather severity to base conditions
    // Storm (severity 1) means lower temps (or extreme) and higher wind
    const baseTemp = (Math.random() * 60) - 20;
    const temperature = baseTemp - (params.weatherSeverity * 10); 
    
    const baseWind = Math.random() * 15;
    const windSpeed = baseWind + (params.weatherSeverity * 30); // Storm adds up to 30km/h wind

    // Apply satellite modifier
    const baseSats = Math.floor(Math.random() * 60) + 1;
    const satelliteCount = Math.max(0, Math.floor(baseSats * params.satelliteModifier));

    // Calculate Speed
    const baseSpeed = 20;
    
    // Factors
    const satFactor = satelliteCount * 1.5;
    const windFactor = windSpeed * -0.5;
    const tempFactor = Math.abs(temperature - 20) * -0.1;
    
    // User Load Factor (High load reduces speed)
    const loadFactor = params.userLoad * -30; // Up to -30Mbps impact

    let predictedSpeed = baseSpeed + satFactor + windFactor + tempFactor + loadFactor;
    
    // Add some random noise for "Actual" vs "Predicted"
    const noise = (Math.random() * 20) - 10;
    let actualSpeed = predictedSpeed + noise;

    // Clamp
    predictedSpeed = Math.max(0, Math.min(300, predictedSpeed));
    actualSpeed = Math.max(0, Math.min(300, actualSpeed));

    data.push({
      id: `node-${i}`,
      latitude,
      longitude,
      temperature,
      windSpeed,
      satelliteCount,
      actualSpeed,
      predictedSpeed
    });
  }

  return data;
};
