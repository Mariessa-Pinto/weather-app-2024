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
        <div className={`container mx-auto font-poppins`}>
            {
                currentWeather && (
                    <div>
                        <h2 className={`text-2xl font-bold mt-10 mb-10`}>Current Weather</h2>
                        <div className={`flex flex-row items-center justify-center gap-10 md:gap-40 mb-8`}>
                            <Image
                                className={`ml-0 md:ml-5 mb-6`}
                                src={`/icons/${currentWeather.weather[0].icon}.svg`}
                                alt='weather icon'
                                height={200}
                                width={200}
                            />
                            <div className={`text-5xl md:text-6xl font-light`}>{(currentWeather.main.temp - 273.15).toFixed(1)} °C</div>
                        </div>
                        <div className={`flex flex-row items-center justify-between`}>
                            <div className={`text-xl font-medium`}>{currentWeather.weather[0].main}</div>
                            <div className={`text-lg font-medium`}>Wind Speed: {currentWeather.wind.speed} m/s</div>
                        </div>
                        <div className={`text-sm font-regular`}>Last update: {new Date(currentWeather.dt * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                    </div>
                )
            }
            {searchClicked && isDataLoaded && (
                <div>
                    <h2 className={`text-2xl font-bold mt-20 mb-8`}>Every 3 Hours For Next 5 Days</h2>
                    {Object.entries(groupForecastsByDay(forecastWeather)).map(([date, forecasts], index) => (
                        <div key={index}>
                            <h3 className={`text-xl font-medium mt-8 mb-2`}>{date}</h3>
                            <div className="flex flex-wrap">
                                {forecasts.map((forecast, i) => (
                                    <div key={i} className="w-5/12 md:w-1/4 p-4 border rounded-md flex flex-col items-center gap-2 m-2 md:m-4 mb-2 mt-2">
                                        <div className={`text-xl font-medium`}>{new Date(forecast.dt_txt).toLocaleTimeString("en-US", { hour: 'numeric', hour12: true })}</div>
                                        <Image
                                            className={`mb-2 mt-2`}
                                            src={`/icons/${forecast.weather[0].icon}.svg`}
                                            alt='weather icon'
                                            height={50}
                                            width={60}
                                        />
                                        <div className={`text-2xl font-light`}>{(forecast.main.temp - 273.15).toFixed(1)} °C</div>
                                        <div className={`flex flex-col items-start`}>
                                            <div className={`text-lg font-medium`}>{forecast.weather[0].main}</div>
                                            <div className={`text-md font-regular mt-2`}>{forecast.weather[0].description}</div>
                                            <div className={`text-md font-light mt-1`}>Wind Speed: {forecast.wind.speed} m/s</div>
                                        </div>
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