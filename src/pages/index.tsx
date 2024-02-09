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

  const currentYear = new Date().getFullYear();

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 bg-dark-blue`}>
      <header className={`flex flex-row`}>
        <Image
          src={`/icons/01d.svg`}
          alt='logo'
          height={50}
          width={60}
        />
        <h2>Nimbus Weather App</h2>
      </header>
      <div className={`container rounded-md w-6/12 bg-opacity-50 bg-light-purple p-20`}>
        <h1>Search City Name To See Weather</h1>
        <input
          className={`block w-full rounded-md border-0 py-1.5 pl-5 pr-20 pt-1 pb-1 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
          type="text"
          value={city ?? ''}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button
          className={`p-0.5 w-full rounded-md border-2 pt-0.5 pb-1.5`}
          onClick={handleSearchClick}
        >Search</button>
        {errorMessage && <p>{errorMessage}</p>}
        <FetchWeather city={city} searchClicked={searchClicked} />
      </div>
      <footer>
      <div><p>&copy; {currentYear} Mariessa Pinto</p></div>
      </footer>
    </main>
  );
}