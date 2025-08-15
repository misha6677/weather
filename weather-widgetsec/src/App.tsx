import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import WeatherDisplay from './components/WeatherDisplay/WeatherDisplay';
import TogglePeriod from './components/TogglePeriod/TogglePeriod';
import './App.css';

export interface WeatherData {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  name?: string;
}

export interface ForecastData {
  list: WeatherData[];
  city: {
    name: string;
  };
}

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isCurrent, setIsCurrent] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Получаем API ключ из переменных окружения
  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
  
  const fetchWeather = async (url: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(url);
      
      // Проверяем статус ответа
      if (!response.ok) {
        // Пытаемся получить сообщение об ошибке из ответа
        const errorData = await response.json();
        throw new Error(errorData.message || 'Город не найден');
      }
      
      const data = await response.json();
      
      if (isCurrent) {
        setWeatherData(data);
        setForecastData(null);
      } else {
        setForecastData(data);
        setWeatherData(null);
      }
    } catch (err: any) {
      // Обрабатываем разные типы ошибок
      setError(err.message || 'Ошибка при получении данных. Проверьте название города');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city: string) => {
    if (!city.trim()) return;
    
    // Проверяем наличие API ключа
    if (!API_KEY) {
      setError('API ключ не настроен. Проверьте файл .env');
      return;
    }
    
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ru`;
    
    fetchWeather(isCurrent ? currentUrl : forecastUrl);
  };

  const handleGeolocation = () => {
    if (!API_KEY) {
      setError('API ключ не настроен. Проверьте файл .env');
      return;
    }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`;
          const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`;
          
          fetchWeather(isCurrent ? currentUrl : forecastUrl);
        },
        (error) => {
          setError('Не удалось получить ваше местоположение: ' + error.message);
          console.error('Geolocation Error:', error);
        }
      );
    } else {
      setError('Геолокация не поддерживается вашим браузером');
    }
  };

  useEffect(() => {
    // Убрал вызов handleSearch при изменении isCurrent
    // чтобы избежать циклических запросов
  }, [isCurrent]);

  return (
    <div className="app">
      <div className="container">
        <h1>Прогноз погоды</h1>
        
        <SearchBar 
          onSearch={handleSearch} 
          onGeolocation={handleGeolocation} 
        />
        
        <TogglePeriod 
          isCurrent={isCurrent} 
          setIsCurrent={setIsCurrent} 
        />
        
        {loading && <div className="loader">Загрузка...</div>}
        {error && <div className="error">{error}</div>}
        
        <WeatherDisplay 
          weatherData={weatherData} 
          forecastData={forecastData} 
          isCurrent={isCurrent} 
        />
      </div>
    </div>
  );
};

export default App;