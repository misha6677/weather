import React from 'react';
import { WeatherData, ForecastData } from '../../App';
import './WeatherDisplay.css';

interface WeatherDisplayProps {
  weatherData: WeatherData | null;
  forecastData: ForecastData | null;
  isCurrent: boolean;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ 
  weatherData, 
  forecastData, 
  isCurrent 
}) => {
  const getWeatherIcon = (iconCode: string) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('ru-RU', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const filterForecast = () => {
    if (!forecastData) return [];
    
    const dailyForecast: WeatherData[] = [];
    const dates = new Set<string>();
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dates.has(date)) {
        dates.add(date);
        dailyForecast.push(item);
      }
    });
    
    return dailyForecast.slice(0, 5);
  };

  if (!weatherData && !forecastData) return null;

  return (
    <div className="weather-display">
      {isCurrent && weatherData && (
        <div className="current-weather">
          <h2>{weatherData.name}</h2>
          <div className="weather-main">
            <img 
              src={getWeatherIcon(weatherData.weather[0].icon)} 
              alt={weatherData.weather[0].description} 
            />
            <div className="temp">{Math.round(weatherData.main.temp)}°C</div>
          </div>
          <div className="weather-description">
            {weatherData.weather[0].description}
          </div>
          <div className="weather-details">
            <p>Ощущается: {Math.round(weatherData.main.feels_like)}°C</p>
            <p>Влажность: {weatherData.main.humidity}%</p>
            <p>Ветер: {Math.round(weatherData.wind.speed)} м/с</p>
          </div>
        </div>
      )}
      
      {!isCurrent && forecastData && (
        <div className="forecast">
          <h2>{forecastData.city.name}</h2>
          <div className="forecast-cards">
            {filterForecast().map((day, index) => (
              <div key={index} className="forecast-card">
                <div className="forecast-date">
                  {formatDate(day.dt)}
                </div>
                <img 
                  src={getWeatherIcon(day.weather[0].icon)} 
                  alt={day.weather[0].description} 
                />
                <div className="forecast-temp">
                  {Math.round(day.main.temp)}°C
                </div>
                <div className="forecast-description">
                  {day.weather[0].description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDisplay;