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
    <main className={`flex min-h-screen flex-col items-center justify-between p-0 bg-dark-blue font-poppins`}>
      <header className={`flex flex-row bg-opacity-50 bg-light-purple w-full rounded-md p-8 items-end justify-center gap-10`}>
        <Image
          src={`/logo.svg`}
          alt='logo'
          height={100}
          width={250}
        />
        <h2 className={`text-5xl font-medium mr-40 pb-2`}>Weather App</h2>
      </header>
      <div className={`container rounded-md w-6/12 bg-opacity-50 bg-light-purple p-20 mt-5`}>
        <h1 className={`text-2xl font-medium`}>Search City Name To See The Weather</h1>
        <input
          className={`block w-full rounded-md border-0 py-1.5 pl-5 pr-20 pt-2 pb-2 mb-5 mt-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
          type="text"
          value={city ?? ''}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button
          className={`p-0.5 w-full rounded-md border-2 pt-1.5 pb-1.5 text-xl font-regular hover:bg-gray-200`}
          onClick={handleSearchClick}
        >Search</button>
        {errorMessage && <p>{errorMessage}</p>}
        <FetchWeather city={city} searchClicked={searchClicked} />
      </div>
      <footer className={`flex w-full justify-center items-end pt-20`}>
      <div><p>&copy; {currentYear} Mariessa Pinto</p></div>
      </footer>
    </main>
  );
}