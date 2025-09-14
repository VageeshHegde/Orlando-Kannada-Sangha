import { OPENWEATHER_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    // Check if API key is configured
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_openweather_api_key_here') {
      return json({
        error: 'Weather API key not configured'
      }, { status: 500 });
    }

    const city = 'Orlando';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenWeather API Error:', errorData);
      return json({
        error: 'Failed to fetch weather data from OpenWeather API'
      }, { status: response.status });
    }
    
    const data = await response.json();
    
    // Extract and format the weather data
    const weatherData = {
      city: data.name,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      iconCode: data.weather[0].icon,
      iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      timestamp: new Date().toISOString()
    };
    
    return json(weatherData);
    
  } catch (error) {
    console.error('Weather API error:', error);
    return json({
      error: 'Internal server error while fetching weather data'
    }, { status: 500 });
  }
} 