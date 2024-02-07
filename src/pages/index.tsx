import Image from "next/image";
import { useState } from "react";
import FetchWeather from "@/components/fetchWeather";

export default function Home() {
  const [city, setCity] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchClicked, setSearchClicked] = useState<boolean>(false);

  const handleSearchClick = () => {
    setSearchClicked(true);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}>
      <div>
        <h1>Weather App</h1>
        <input
          type="text"
          value={city ?? ''}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button onClick={handleSearchClick}>Search</button>
        {errorMessage && <p>{errorMessage}</p>}
        </div>
        <FetchWeather city={city} searchClicked={searchClicked} />
    </main>
  );
}