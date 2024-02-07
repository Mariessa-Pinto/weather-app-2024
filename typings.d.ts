interface ICurrentWeather {
    main: {
        temp: number;
    };
    weather: {
        main: string;
    }[];
    wind: {
        speed: number;
    };
    dt: number;
}

interface IForecastWeather {
    main: {
        temp: number;
    };
    weather: {
        main: string;
        description: string;
    }[];
    wind: {
        speed: number;
    }
    dt_txt: string;
}

interface IProp {
    city: string;
    searchClicked: boolean;
}