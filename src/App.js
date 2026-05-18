import { useEffect, useState } from "react";
import useCurrentLocation from "./hooks/useCurrentLocation";
import useWeather from "./hooks/useWeather";
import useAirQuality from "./hooks/useAirQuality";
import {
  fetchPlaceNameByCoordinates,
  searchLocationByCity,
} from "./api/geocodingApi";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import WeatherEffects from "./components/WeatherEffects";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import UnitToggle from "./components/UnitToggle";
import SavedLocations from "./components/SavedLocations";
import ThemeToggle from "./components/ThemeToggle";
import AirQualityCard from "./components/AirQualityCard";
import WeatherAlerts from "./components/WeatherAlerts";
import MapView from "./components/MapView";
import SunCycleCard from "./components/SunCycleCard";
import ParallaxSection from "./components/ParallaxSection";
import TiltCard from "./components/TiltCard";

import { temperatureUnits } from "./utils/temperatureUtils";
import { getStoredTheme, saveTheme, themes } from "./utils/themeUtils";
import { generateWeatherAlerts } from "./utils/weatherAlertUtils";
import {
  getStoredFavoriteCities,
  saveFavoriteCities,
  getStoredRecentSearches,
  saveRecentSearches,
} from "./utils/storageUtils";

import "./App.css";

const App = () => {
  const { location, isLocationLoading, locationError } = useCurrentLocation();

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [placeName, setPlaceName] = useState("Live Weather Tracker");
  const [searchInput, setSearchInput] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState(
    temperatureUnits.CELSIUS,
  );
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [theme, setTheme] = useState(themes.DARK);

  const { weather, isWeatherLoading, weatherError, retryWeatherFetch } =
    useWeather(selectedLocation);

  const {
    airQuality,
    isAirQualityLoading,
    airQualityError,
    retryAirQualityFetch,
  } = useAirQuality(selectedLocation);

  const currentWeather = weather ? weather.current : null;
  const hourlyForecast = weather ? weather.hourly : [];
  const dailyForecast = weather ? weather.daily : [];

  useEffect(() => {
    setFavoriteCities(getStoredFavoriteCities());
    setRecentSearches(getStoredRecentSearches());
    setTheme(getStoredTheme());
  }, []);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (location && !selectedLocation) {
      setSelectedLocation({
        ...location,
        source: "gps",
      });
    }
  }, [location, selectedLocation]);

  useEffect(() => {
    const getPlaceName = async () => {
      if (!selectedLocation) {
        return;
      }

      if (selectedLocation.displayName) {
        setPlaceName(selectedLocation.displayName);
        return;
      }

      try {
        const placeData = await fetchPlaceNameByCoordinates(
          selectedLocation.latitude,
          selectedLocation.longitude,
        );

        setPlaceName(placeData.displayName);
      } catch (error) {
        setPlaceName(
          selectedLocation.source === "map"
            ? "Selected Map Location"
            : "Current Location",
        );
      }
    };

    getPlaceName();
  }, [selectedLocation]);

  const createSavedLocation = (locationData) => {
    return {
      id: `${locationData.latitude}-${locationData.longitude}`,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      city: locationData.city || locationData.displayName || placeName,
      country: locationData.country || "",
      displayName: locationData.displayName || placeName,
      source: "search",
      accuracy: null,
    };
  };

  const updateRecentSearches = (locationData) => {
    const savedLocation = createSavedLocation(locationData);

    const filteredSearches = recentSearches.filter(
      (city) => city.id !== savedLocation.id,
    );

    const updatedSearches = [savedLocation, ...filteredSearches].slice(0, 5);

    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  };

  const onSearchSubmit = async (event) => {
    event.preventDefault();

    const trimmedCity = searchInput.trim();

    if (trimmedCity === "") {
      setSearchError("Enter a city name.");
      return;
    }

    try {
      setIsSearching(true);
      setSearchError("");

      const searchedLocation = await searchLocationByCity(trimmedCity);

      setSelectedLocation(searchedLocation);
      setPlaceName(searchedLocation.displayName);
      setSearchInput("");
      updateRecentSearches(searchedLocation);
    } catch (error) {
      setSearchError(error.message || "Unable to search city.");
    } finally {
      setIsSearching(false);
    }
  };

  const onUseGpsLocation = () => {
    if (location) {
      setSelectedLocation({
        ...location,
        source: "gps",
      });
      setSearchError("");
    }
  };

  const onMapLocationSelect = async (mapLocation) => {
    setSelectedLocation(mapLocation);
    setSearchError("");

    try {
      const placeData = await fetchPlaceNameByCoordinates(
        mapLocation.latitude,
        mapLocation.longitude,
      );

      setPlaceName(placeData.displayName);
    } catch (error) {
      setPlaceName("Selected Map Location");
    }
  };

  const onAddFavorite = () => {
    if (!selectedLocation || selectedLocation.source !== "search") {
      return;
    }

    const savedLocation = createSavedLocation(selectedLocation);

    const alreadyExists = favoriteCities.some(
      (city) => city.id === savedLocation.id,
    );

    if (alreadyExists) {
      return;
    }

    const updatedFavorites = [savedLocation, ...favoriteCities];

    setFavoriteCities(updatedFavorites);
    saveFavoriteCities(updatedFavorites);
  };

  const onRemoveFavorite = (cityId) => {
    const updatedFavorites = favoriteCities.filter(
      (city) => city.id !== cityId,
    );

    setFavoriteCities(updatedFavorites);
    saveFavoriteCities(updatedFavorites);
  };

  const onSelectSavedLocation = (city) => {
    setSelectedLocation(city);
    setPlaceName(city.displayName);
    setSearchError("");
  };

  const latitude = selectedLocation
    ? selectedLocation.latitude.toFixed(4)
    : "--";

  const longitude = selectedLocation
    ? selectedLocation.longitude.toFixed(4)
    : "--";

  const accuracy =
    selectedLocation && selectedLocation.accuracy
      ? Math.round(selectedLocation.accuracy)
      : null;

  const backgroundClassName = currentWeather
    ? currentWeather.background
    : "default";

  const isCurrentLocationFavorite =
    selectedLocation?.source === "search" &&
    favoriteCities.some(
      (city) =>
        city.id ===
        `${selectedLocation.latitude}-${selectedLocation.longitude}`,
    );

  const alerts = generateWeatherAlerts(currentWeather, airQuality);

  return (
    <div className={`app-container ${backgroundClassName} ${theme}`}>
      <WeatherEffects />

      <div className="background-overlay">
        <main className="weather-dashboard">
          <div className="main-column">
            <TiltCard intensity={3}>
              <AppHeader />
            </TiltCard>

            <div className="top-control-row">
              <TiltCard intensity={3}>
                <ThemeToggle theme={theme} setTheme={setTheme} />
              </TiltCard>

              <TiltCard intensity={3}>
                <UnitToggle
                  temperatureUnit={temperatureUnit}
                  setTemperatureUnit={setTemperatureUnit}
                />
              </TiltCard>
            </div>

            <TiltCard intensity={3}>
              <CurrentWeatherCard
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                onSearchSubmit={onSearchSubmit}
                isSearching={isSearching}
                searchError={searchError}
                selectedLocation={selectedLocation}
                placeName={placeName}
                onAddFavorite={onAddFavorite}
                isCurrentLocationFavorite={isCurrentLocationFavorite}
                isLocationLoading={isLocationLoading}
                locationError={locationError}
                weatherError={weatherError}
                retryWeatherFetch={retryWeatherFetch}
                currentWeather={currentWeather}
                weather={weather}
                isWeatherLoading={isWeatherLoading}
                latitude={latitude}
                longitude={longitude}
                accuracy={accuracy}
                location={location}
                onUseGpsLocation={onUseGpsLocation}
                temperatureUnit={temperatureUnit}
              />
            </TiltCard>

            <TiltCard intensity={3}>
              <WeatherAlerts alerts={alerts} />
            </TiltCard>

            <TiltCard intensity={3}>
              <AirQualityCard
                airQuality={airQuality}
                isAirQualityLoading={isAirQualityLoading}
                airQualityError={airQualityError}
                retryAirQualityFetch={retryAirQualityFetch}
              />
            </TiltCard>
            <TiltCard intensity={3}>
              <SunCycleCard dailyForecast={dailyForecast} />
            </TiltCard>
          </div>

          <section className="forecast-panel">
            <TiltCard intensity={3}>
              <MapView
                selectedLocation={selectedLocation}
                placeName={placeName}
                onMapLocationSelect={onMapLocationSelect}
              />
            </TiltCard>
            <TiltCard intensity={3}>
              <SavedLocations
                favoriteCities={favoriteCities}
                recentSearches={recentSearches}
                onSelectSavedLocation={onSelectSavedLocation}
                onRemoveFavorite={onRemoveFavorite}
              />
            </TiltCard>
            <TiltCard intensity={3}>
              <HourlyForecast
                hourlyForecast={hourlyForecast}
                temperatureUnit={temperatureUnit}
                isWeatherLoading={isWeatherLoading}
              />
            </TiltCard>

            <TiltCard intensity={3}>
              <DailyForecast
                dailyForecast={dailyForecast}
                temperatureUnit={temperatureUnit}
                isWeatherLoading={isWeatherLoading}
              />
            </TiltCard>
          </section>
        </main>
        <ParallaxSection strength={25}>
          <AppFooter />
        </ParallaxSection>
      </div>
    </div>
  );
};

export default App;
