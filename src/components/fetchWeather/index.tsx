import { useState, useEffect } from 'react';
import Image from 'next/image';


export default function fetchWeather(props: IProp) {

    const { city, searchClicked } = props;
    const apiKey = process.env.NEXT_PUBLIC_API;
    const [currentWeather, setCurrentWeather] = useState<ICurrentWeather | null>(null);
    const [forecastWeather, setForecastWeather] = useState<IForecastWeather[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

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
                setIsDataLoaded(true);
            } catch (error) {
                console.error("Error fetching weather data", error);
                setErrorMessage("Error fetching weather data");
            }
        };

        fetchWeatherData();
    }, [city, apiKey, searchClicked]);

    const groupForecastsByDay = (forecasts: IForecastWeather[]) => {
        const groupedForecasts: { [key: string]: IForecastWeather[] } = {};
        forecasts.forEach(forecast => {
            const date = new Date(forecast.dt_txt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            if (!groupedForecasts[date]) {
                groupedForecasts[date] = [];
            }
            groupedForecasts[date].push(forecast);
        });
        return groupedForecasts;
    };

    return (
        <div className={`container mx-auto`}>
            {
                currentWeather && (
                    <div>
                        <h2>Current Weather</h2>
                        <Image
                            src={`/icons/${currentWeather.weather[0].icon}.svg`}
                            alt='weather icon'
                            height={50}
                            width={60}
                        />
                        <div>Temperature: {(currentWeather.main.temp - 273.15).toFixed(1)} °C</div>
                        <div>Weather: {currentWeather.weather[0].main}</div>
                        <div>Wind Speed: {currentWeather.wind.speed} m/s</div>
                        <div>Last update: {new Date(currentWeather.dt * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                    </div>
                )
            }
            {searchClicked && isDataLoaded && (
                <div>
                    <h2>Every 3 Hours For Next 5 Days</h2>
                    {Object.entries(groupForecastsByDay(forecastWeather)).map(([date, forecasts], index) => (
                        <div key={index}>
                            <h3>{date}</h3>
                            <div className="flex flex-wrap">
                                {forecasts.map((forecast, i) => (
                                    <div key={i} className="w-1/4 p-4 border">
                                        <div>Time: {new Date(forecast.dt_txt).toLocaleTimeString("en-US", { hour: 'numeric', hour12: true })}</div>
                                        <Image
                                            src={`/icons/${forecast.weather[0].icon}.svg`}
                                            alt='weather icon'
                                            height={50}
                                            width={60}
                                        />
                                        <div>Temperature: {(forecast.main.temp - 273.15).toFixed(1)} °C</div>
                                        <div>Weather: {forecast.weather[0].main}</div>
                                        <div>Description: {forecast.weather[0].description}</div>
                                        <div>Wind Speed: {forecast.wind.speed} m/s</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}