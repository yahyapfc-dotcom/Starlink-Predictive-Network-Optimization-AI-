import { StarlinkDataPoint } from '../utils/dataGenerator';
import { analyzeSignal } from './diagnostics';

export const exportToCSV = (data: StarlinkDataPoint[], filename: string = 'starlink-report.csv') => {
  // Define headers
  const headers = [
    'ID', 
    'Latitude', 
    'Longitude', 
    'Temperature (C)', 
    'Wind Speed (m/s)', 
    'Satellite Count', 
    'Predicted Speed (Mbps)', 
    'Status',
    'Root Cause Analysis',
    'Technical Details',
    'Recommended Action',
    'Impact Level',
    'Est. Fix Time'
  ];
  
  // Convert data to CSV rows
  const rows = data.map(point => {
    const status = point.predictedSpeed < 40 ? 'Poor' : point.predictedSpeed < 80 ? 'Fair' : 'Good';
    
    // Generate Analysis & Recommendations for Weak Signals
    let rootCause = "N/A";
    let techDetails = "N/A";
    let recommendation = "N/A";
    let impact = "N/A";
    let fixTime = "N/A";

    if (point.predictedSpeed < 40) {
        const diagnosis = analyzeSignal(point);
        rootCause = diagnosis.rootCause;
        techDetails = diagnosis.technicalDetails;
        recommendation = diagnosis.recommendedAction;
        impact = diagnosis.impactLevel;
        fixTime = diagnosis.estimatedFixTime;
    }

    return [
      point.id,
      point.latitude.toFixed(6),
      point.longitude.toFixed(6),
      point.temperature.toFixed(1),
      point.windSpeed.toFixed(1),
      point.satelliteCount,
      point.predictedSpeed.toFixed(2),
      status,
      `"${rootCause}"`,
      `"${techDetails}"`,
      `"${recommendation}"`,
      `"${impact}"`,
      `"${fixTime}"`
    ].join(',');
  });

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows].join('\n');

  // Create a Blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
