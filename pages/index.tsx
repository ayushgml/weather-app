import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import Logo from "@/public/logo.png";
import SearchIcon from "@/public/search.png";
import defaultJson from "@/pages/default.json";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Sunny from "@/public/sunny.png";
import PartlyCloudy from "@/public/partlycloudy.jpeg";
import defaultforecast from "@/pages/defaultforecast.json";
import { LinearProgress } from "@mui/material";

const apiKey = "965766ab336e4db89f645726231602";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(defaultJson);
  const [isFahrenheit, setIsFahrenheit] = useState(true); // default to Fahrenheit
  const [forecastData, setForecastData] = useState(defaultforecast);
  const [typedCity, setTypedCity] = useState("");
  const [autocompleteData, setAutocompleteData] = useState([
    {
      id: 0,
      name: "",
      region: "",
      country: "",
      lat: 0,
      lon: 0,
      url: "0",
    },
  ]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        setCity(data.city);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };
    fetchLocationData();
  }, []);

  useEffect(() => {
    const fetchAutocompleteData = async () => {
      if (typedCity) {
        console.log(
          `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${typedCity}`
        );
        const res = await fetch(
          `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${typedCity}`
        );
        const data = await res.json();
        console.log(data);
        setAutocompleteData(data);
      }
    };
    fetchAutocompleteData();
  }, [typedCity]);

  // Fetch weather data from the OpenWeather API
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (city) {
        console.log(
          `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`
        );
        const res = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`
        );
        const data = await res.json();
        setWeatherData(data);
      }
    };
    fetchWeatherData();
  }, [city]);

  useEffect(() => {
    const fetchForecastData = async () => {
      if (city) {
        console.log(
          `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10&aqi=no&alerts=no`
        );
        const res = await fetch(
          `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10&aqi=no&alerts=no`
        );
        const data = await res.json();
        setForecastData(data);
      }
    };
    fetchForecastData();
  }, [city]);

  useEffect(() => {
    console.log(city);
    console.log(weatherData);
  }, [weatherData]);

  // Update users' city from the search input
  const handleSearch = (e: any) => {
    e.preventDefault();
    setCity(e.target.city.value);
  };

  // Load the user's preference for temperature unit from LocalStorage on component mount
  useEffect(() => {
    const userPreference = localStorage.getItem("temperature-unit");
    if (userPreference === "celsius") {
      setIsFahrenheit(false);
    } else {
      setIsFahrenheit(true);
    }
  }, []);

  // Save the user's preference for temperature unit to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "temperature-unit",
      isFahrenheit ? "fahrenheit" : "celsius"
    );
  }, [isFahrenheit]);

  const handleToggleUnit = () => {
    setIsFahrenheit(!isFahrenheit);
  };

  const handleSelectCity = (e: any) => {
    setTypedCity(e.target.value);
  };

  return (
    <div className={styles.background}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <Image src={Logo} alt="Logo" width={50} height={50} />
        </div>
        <div className={styles.formWithAutoComplete}>
          <form className={styles.form} onSubmit={handleSearch}>
            <input
              className={styles.searchbar}
              type="text"
              name="city"
              placeholder="Search city"
              onChange={handleSelectCity}
            />
            <button type="submit" className={styles.searchicon}>
              <Image src={SearchIcon} alt="Search" width={22} height={22} />
            </button>
          </form>
        </div>
        <div>
          {isFahrenheit ? (
            <button onClick={handleToggleUnit} className={styles.toggleF}>
              °F
            </button>
          ) : (
            <button onClick={handleToggleUnit} className={styles.toggleC}>
              °C
            </button>
          )}
        </div>
      </div>

      {/* Main body */}
      <div className={styles.mainPage}>
        {autocompleteData.length > 0 && typedCity.length > 0 && (
          <div className={styles.autocomplete}>
            {autocompleteData.map((item) => (
              <div
                onClick={() => {
                  setCity(item.name);
                  setTypedCity("");
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
        {weatherData.location.name ? (
          <div>
            <div className={styles.topRow}>
              <div className={styles.currentCard}>
                {weatherData.current.condition.text === "Sunny" ? (
                  <Image src={Sunny} alt="Sunny" width={100} height={100} />
                ) : (
                  <Image
                    src={PartlyCloudy}
                    alt="Sunny"
                    width={100}
                    height={100}
                  />
                )}
                {isFahrenheit ? (
                  <h1 className={styles.temperature}>
                    {weatherData.current.temp_f} °F
                  </h1>
                ) : (
                  <h1 className={styles.temperature}>
                    {weatherData.current.temp_c} °C
                  </h1>
                )}
                <div className={styles.weatherCondition}>
                  <Image
                    src={"https:" + weatherData.current.condition.icon}
                    alt="Weather icon"
                    width={25}
                    height={25}
                  />
                  <h1>{weatherData.current.condition.text}</h1>
                </div>
                <hr className={styles.hrulecurrent} />
                <div className={styles.location}>
                  <LocationOnIcon className={styles.locationIcon} />
                  <h1 className={styles.cityName}>
                    {weatherData.location.name}, {weatherData.location.country}{" "}
                  </h1>
                </div>
                <div className={styles.lastupdated}>
                  <CalendarTodayIcon className={styles.calendarIcon} />
                  <h1 className={styles.lastupdatedtime}>
                    {weatherData.current.last_updated}
                  </h1>
                </div>
              </div>
              <div className={styles.windUvSun}>
                <h1 className={styles.windUvSuntitle}>Today's highlights</h1>
                <div className={styles.windUvSunTopRow}>
                  {/* Wind */}
                  <div className={styles.wind}>
                    <h1 className={styles.windTitle}>Wind Status</h1>
                    <div className={styles.windSpeed}>
                      <h1 className={styles.windSpeedSpeed}>
                        {weatherData.current.wind_kph}
                      </h1>
                      <h1 className={styles.windSpeedUnit}>KM/h</h1>
                    </div>
                  </div>

                  {/* UV */}
                  <div className={styles.wind}>
                    <h1 className={styles.windTitle}>UV Index</h1>
                    <div className={styles.windSpeed}>
                      <h1 className={styles.windSpeedSpeed}>
                        {weatherData.current.uv}
                      </h1>
                      <h1 className={styles.windSpeedUnit}>UV</h1>
                    </div>
                  </div>

                  {/* Sun */}
                  <div className={styles.wind}>
                    <h1 className={styles.windTitle}>Sunrise/Sunset</h1>
                    {/* Make a sunrise and sunset progress bar curved */}

                    <div className={styles.sunrise_and_sunset}>
                      <h1 className={styles.windSpeedUnit}>
                        {forecastData.forecast.forecastday[0].astro.sunrise}
                      </h1>
                      <h1 className={styles.windSpeedUnit}>
                        {forecastData.forecast.forecastday[0].astro.sunset}
                      </h1>
                    </div>
                  </div>
                </div>
                <div className={styles.windUvSunBottomRow}>
                  {/* Humidity */}
                  <div className={styles.wind2}>
                    <h1 className={styles.windTitle}>Humidity</h1>
                    <div className={styles.windSpeed}>
                      <h1 className={styles.windSpeedSpeed}>
                        {weatherData.current.humidity}
                      </h1>
                      <h1 className={styles.windSpeedUnit}>%</h1>
                      <h1>
                        <LinearProgress
                          variant="determinate"
                          value={weatherData.current.humidity}
                        />
                      </h1>
                    </div>
                  </div>

                  {/* Precipitation */}
                  <div className={styles.wind2}>
                    <h1 className={styles.windTitle}>Precipitation</h1>
                    <div className={styles.windSpeed}>
                      <h1 className={styles.windSpeedSpeed}>
                        {weatherData.current.precip_mm}
                      </h1>
                      <h1 className={styles.windSpeedUnit}>mm</h1>
                      <h1>
                        <LinearProgress
                          variant="determinate"
                          value={weatherData.current.precip_mm}
                        />
                      </h1>
                    </div>
                  </div>

                  {/* Feels like and Visibility */}
                  <div className={styles.wind3}>
                    <div className={styles.feelslikeandvisComp}>
                      <h1 className={styles.windTitle}>Feels like</h1>
                      <div className={styles.windSpeed}>
                        <h1 className={styles.windSpeedSpeed}>
                          {weatherData.current.feelslike_f}
                        </h1>
                        <h1 className={styles.windSpeedUnit}>°F</h1>
                      </div>
                    </div>
                    <div className={styles.feelslikeandvisComp}>
                      <h1 className={styles.windTitle}>Visibility</h1>
                      <div className={styles.windSpeed}>
                        <h1 className={styles.windSpeedSpeed}>
                          {weatherData.current.vis_km}
                        </h1>
                        <h1 className={styles.windSpeedUnit}>KM</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.bottomRow}>
              <div className={styles.forecastCard}>
                <h1 className={styles.forecastTitle}>Forecast</h1>
                <div className={styles.forecast}>
                  {forecastData.forecast.forecastday.map((day: any) => (
                    <div className={styles.forecastDay}>
                      <div className={styles.forecastDayIcon}>
                        <Image
                          src={"https:" + day.day.condition.icon}
                          alt="Weather icon"
                          width={100}
                          height={100}
                        />
                      </div>
                      <h1 className={styles.forecastDayTitle}>
                        {new Date(day.date)
                          .toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                          .replace(/(\d+)(th|nd|rd|st)/, "$1<sup>$2</sup>")}
                      </h1>

                      <div className={styles.forecastDayTemp}>
                        {isFahrenheit ? (
                          <h1 className={styles.windTitle}>
                            Max: {day.day.maxtemp_f}°F
                          </h1>
                        ) : (
                          <h1 className={styles.windTitle}>
                            Max: {day.day.maxtemp_c}°C
                          </h1>
                        )}
                        {isFahrenheit ? (
                          <h1 className={styles.windTitle}>
                            Min: {day.day.mintemp_f}°F
                          </h1>
                        ) : (
                          <h1 className={styles.windTitle}>
                            Min: {day.day.mintemp_c}°C
                          </h1>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.airQualityCard}>
                <h1 className={styles.airQualityTitle}>Air Quality</h1>
                <div className={styles.airQuality}>
                  <div className={styles.airQualityRow}>
                    <h1 className={styles.AQI_Option}>
                      PM10:  {weatherData.current.air_quality.pm10.toFixed(0)}
                    </h1>
                    <h1 className={styles.AQI_Option}>
                      PM2.5:  {weatherData.current.air_quality.pm2_5.toFixed(0)}
                    </h1>
                  </div>
                  <hr className={styles.hrulecurrent} />
                  <div className={styles.airQualityRow}>
                    <h1 className={styles.AQI_Option}>
                      NO2:  {weatherData.current.air_quality.no2.toFixed(0)}
                    </h1>
                    <h1 className={styles.AQI_Option}>
                      SO2:  {weatherData.current.air_quality.so2.toFixed(0)}
                    </h1>
                  </div>
                  <hr className={styles.hrulecurrent} />
                  <div className={styles.airQualityRow}>
                    <h1 className={styles.AQI_Option}>
                      O3:  {weatherData.current.air_quality.o3.toFixed(0)}
                    </h1>
                    <h1 className={styles.AQI_Option}>
                      CO:  {weatherData.current.air_quality.co.toFixed(0)}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.entercity}>
            <h1>Please enter a city name!</h1>
          </div>
        )}
      </div>
    </div>
  );
}
