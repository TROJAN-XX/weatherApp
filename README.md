# Ather

<p align="center">
  <b>Ather is a modern React weather intelligence dashboard that provides live weather, precise location tracking, air quality insights, smart alerts, interactive map-based weather selection, dynamic backgrounds, and a polished glassmorphism user interface.</b>
</p>

<p align="center">
  <a href="https://github.com/TROJAN-XX/weatherApp">
    <img src="https://img.shields.io/badge/Project-Ather-blue" alt="Project Badge" />
  </a>
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB" alt="React Badge" />
  <img src="https://img.shields.io/badge/API-Open--Meteo-green" alt="Open Meteo Badge" />
  <img src="https://img.shields.io/badge/Map-Leaflet-brightgreen" alt="Leaflet Badge" />
  <img src="https://img.shields.io/badge/UI-Glassmorphism-purple" alt="Glassmorphism Badge" />
  <img src="https://img.shields.io/badge/Status-Active-success" alt="Status Badge" />
</p>

---

## Table of Contents

| Section | Description |
|---|---|
| [Overview](#overview) | Introduction to the project |
| [Core Features](#core-features) | Main functionality of Ather |
| [Application Flow](#application-flow) | How data moves inside the app |
| [Tech Stack](#tech-stack) | Technologies used |
| [Folder Structure](#folder-structure) | Project directory explanation |
| [Installation](#installation) | How to install and run locally |
| [Production Build](#production-build) | Build and local production testing |
| [API Usage](#api-usage) | APIs used in the project |
| [Component Architecture](#component-architecture) | Explanation of React components |
| [Hooks](#hooks) | Custom hooks used in the project |
| [Utilities](#utilities) | Utility files and their purpose |
| [Location System](#location-system) | GPS, search, map, saved places |
| [Map Picker](#map-picker) | Interactive Leaflet map behavior |
| [Weather Intelligence](#weather-intelligence) | Alerts, AQI, forecast logic |
| [Responsive Design](#responsive-design) | Desktop and mobile layout |
| [Deployment](#deployment) | Hosting instructions |
| [Future Improvements](#future-improvements) | Ideas for further upgrades |
| [Author](#author) | Developer details |

---

## Overview

**Ather** is a full-featured weather dashboard built with React. It is designed to provide a premium weather experience by combining real-time weather data, air quality information, smart alerts, interactive map selection, animated backgrounds, and a responsive glassmorphism interface.

Unlike a basic weather app that only searches by city, Ather can fetch weather information using:

| Location Source | Supported |
|---|---:|
| Current GPS location | Yes |
| City search | Yes |
| Saved locations | Yes |
| Recent searches | Yes |
| Map click | Yes |
| Draggable map marker | Yes |
| Latitude and longitude | Yes |

Ather is not limited to popular cities. Since it uses latitude and longitude, it can fetch weather data for almost any valid location supported by the weather API.

---

## Core Features

### Weather Data

| Feature | Description |
|---|---|
| Current Weather | Shows live temperature, humidity, wind speed, pressure, and feels-like temperature |
| Hourly Forecast | Displays upcoming hourly weather data |
| 7-Day Forecast | Shows daily weather conditions, min/max temperature, and rain probability |
| Dynamic Condition Mapping | Converts weather codes into readable weather conditions |
| Weather-Based Backgrounds | Changes background according to sunny, rainy, cloudy, storm, mist, snow, and night conditions |

---

### Location Features

| Feature | Description |
|---|---|
| GPS Tracking | Uses browser location permission to get current coordinates |
| Real-Time Location Watch | Tracks location changes using browser Geolocation API |
| City Search | Converts searched city names into latitude and longitude |
| Reverse Geocoding | Converts latitude and longitude into readable place names |
| Map Picker | Allows users to click or drag a marker to select any location |
| Smooth Map Transition | Map smoothly moves to searched, GPS, saved, or selected map location |

---

### Air Quality

| Data | Description |
|---|---|
| European AQI | Main air quality index used for AQI status |
| US AQI | Additional air quality index |
| PM2.5 | Fine particulate matter level |
| PM10 | Coarse particulate matter level |
| UV Index | Sun exposure risk |
| AQI Health Status | Good, Fair, Moderate, Poor, Very Poor, Extremely Poor |

---

### Smart Alerts

Ather generates smart alerts based on weather and AQI conditions.

| Alert Type | Trigger |
|---|---|
| Thunderstorm Alert | Weather code indicates thunderstorm |
| Heavy Rain Alert | Rain or precipitation crosses threshold |
| Strong Wind Alert | Wind speed is high |
| Heat Alert | Temperature is high |
| Air Quality Alert | AQI level is poor |
| UV Alert | UV index is high |
| No Major Alerts | Weather and AQI conditions are normal |

---

### User Experience

| Feature | Description |
|---|---|
| Glassmorphism UI | Frosted glass cards with blurred backgrounds |
| Light/Dark Theme | Manual theme toggle with localStorage persistence |
| Celsius/Fahrenheit Toggle | Temperature unit switch without re-fetching API data |
| Favorite Cities | Save important locations |
| Recent Searches | Quickly revisit searched places |
| Animated Weather Effects | Rain, clouds, sun glow, lightning, stars, fog, and snow |
| Sunrise/Sunset Card | Animated sun-cycle visualization |
| Footer Branding | Animated footer linking to GitHub profile |
| Optional Ambience Sounds | Weather-based sound support such as rain, storm, night, and nature ambience |

---

## Application Flow

```txt
User Interaction
    |
    |-- Current GPS Location
    |-- City Search
    |-- Saved Location
    |-- Recent Search
    |-- Map Click
    |-- Marker Drag
    |
    v
Latitude + Longitude
    |
    |-- Weather API
    |-- Air Quality API
    |-- Reverse Geocoding API
    |
    v
Formatted Weather Data
    |
    |-- Current Weather
    |-- Hourly Forecast
    |-- Daily Forecast
    |-- AQI
    |-- Smart Alerts
    |-- Place Name
    |
    v
React State
    |
    v
Ather Dashboard UI
