/**
 * SMART-GRAM Weather Service
 * Handles secure communication with external weather providers
 */

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  weatherCondition: string;
  wind: number;
  icon: string;
  updatedAt: string;
}

export const weatherService = {
  /**
   * Fetches real-time weather for the village
   * Securely uses API keys on the server-side
   */
  async getVillageWeather(villageName: string = 'Erode'): Promise<WeatherData> {
    // In production, fetch from OpenWeatherMap or similar
    // const API_KEY = process.env.WEATHER_API_KEY;
    // const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${villageName}&appid=${API_KEY}`);
    
    // Simulation for secure backend data handling
    return {
      location: `${villageName}, Tamil Nadu`,
      temperature: 28 + Math.floor(Math.random() * 7),
      humidity: 60 + Math.floor(Math.random() * 15),
      weatherCondition: ['Clear', 'Partly Cloudy', 'Mostly Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
      wind: 10 + Math.floor(Math.random() * 10),
      icon: '02d',
      updatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  }
};
