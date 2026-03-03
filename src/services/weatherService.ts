import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || ''; // Will be injected if available
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export interface WeatherData {
  temperature: number; // Celsius
  windSpeed: number; // m/s
  condition: string;
}

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
  if (!API_KEY) {
    console.warn("OpenWeatherMap API Key not found. Using simulated data.");
    return null;
  }

  try {
    const response = await axios.get(`${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    return {
      temperature: response.data.main.temp,
      windSpeed: response.data.wind.speed,
      condition: response.data.weather[0].main
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};
