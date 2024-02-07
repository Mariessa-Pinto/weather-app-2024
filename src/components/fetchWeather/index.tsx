import { useState, useEffect } from 'react';


export default function fetchWeather(props: IProp) {

    const { city, searchClicked } = props;
    const apiKey = process.env.NEXT_PUBLIC_API;
    const [currentWeather, setCurrentWeather] = useState<ICurrentWeather | null>(null);
    const [forecastWeather, setForecastWeather] = useState<IForecastWeather[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (!searchClicked || !city.trim()) { 
                return; 
            }

            try {
                const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
                if (!currentWeatherResponse.ok) {
                    throw new Error(`HTTP error! status: ${currentWeatherResponse.status}`);
                }
                const currentWeatherData = await currentWeatherResponse.json();
                setCurrentWeather(currentWeatherData);
                console.log(currentWeather);
                setErrorMessage(null);

                const forecastWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
                if (!forecastWeatherResponse.ok) {
                    throw new Error(`HTTP error! status: ${forecastWeatherResponse.status}`);
                }
                const forecastWeatherData = await forecastWeatherResponse.json();
                setForecastWeather(forecastWeatherData.list);
                console.log(forecastWeather);
            } catch (error) {
                console.error("Error fetching weather data", error);
                setErrorMessage("Error fetching weather data");
            }
        };

        fetchWeatherData();
    }, [city, apiKey, searchClicked]); 

    return (
        <div>
            {
                currentWeather && (
                    <div>
                        <div>Temperature: {(currentWeather.main.temp - 273.15).toFixed(1)} °C</div>
                        <div>Weather: {currentWeather.weather[0].main}</div>
                        <div>Wind Speed: {currentWeather.wind.speed} m/s</div>
                        <div>Last update: {new Date(currentWeather.dt * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                    </div>
                )
            }

            {
                forecastWeather.map((forecast, index) => (
                    <div key={index}>
                        <div>Date: {new Date(forecast.dt_txt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                        <div>Temperature: {(forecast.main.temp - 273.15).toFixed(1)} °C</div>
                        <div>Weather: {forecast.weather[0].main}</div>
                        <div>Description: {forecast.weather[0].description}</div>
                        <div>Wind Speed: {forecast.wind.speed} m/s</div>
                    </div>
                ))
            }
        </div>
    )
}