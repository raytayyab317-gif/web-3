import axios from 'axios';
import { GtaCity, SiteWeatherData } from '../types/constructex';

export interface CityCoordinates {
  city: GtaCity;
  latitude: number;
  longitude: number;
  regionLabel: string;
}

export const GTA_CITY_COORDS: Record<GtaCity, CityCoordinates> = {
  Toronto: {
    city: 'Toronto',
    latitude: 43.6532,
    longitude: -79.3832,
    regionLabel: 'Downtown & Midtown Core',
  },
  Mississauga: {
    city: 'Mississauga',
    latitude: 43.589,
    longitude: -79.6441,
    regionLabel: 'Peel Commercial Corridor',
  },
  Vaughan: {
    city: 'Vaughan',
    latitude: 43.8361,
    longitude: -79.4983,
    regionLabel: 'York Region North',
  },
  Markham: {
    city: 'Markham',
    latitude: 43.8561,
    longitude: -79.337,
    regionLabel: 'York Region East',
  },
  Oakville: {
    city: 'Oakville',
    latitude: 43.4675,
    longitude: -79.6877,
    regionLabel: 'Halton Lakeshore',
  },
  Brampton: {
    city: 'Brampton',
    latitude: 43.7315,
    longitude: -79.7624,
    regionLabel: 'Peel North Industrial',
  },
};

export interface CuringAdvisory {
  status: 'Optimal Curing' | 'Moderate Drying' | 'Climate Control Required';
  tone: 'emerald' | 'amber' | 'rose';
  guidance: string;
  estimatedCoatDryHours: string;
}

export function getWeatherLabel(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 57) return 'Light Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 85 && code <= 86) return 'Snow Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Variable Conditions';
}

export function computeDrywallCuringAdvisory(
  temperatureC: number,
  humidityPct: number,
  precipitationMm: number
): CuringAdvisory {
  if (temperatureC < 10 || humidityPct >= 75) {
    return {
      status: 'Climate Control Required',
      tone: 'rose',
      guidance:
        'Ambient air is too cold or humid for passive joint compound curing. Deploy temporary site heaters and commercial dehumidifiers before applying Level-5 skim coats.',
      estimatedCoatDryHours: '36–48 hrs without HVAC',
    };
  }

  if (humidityPct >= 60 || precipitationMm > 0 || temperatureC < 15) {
    return {
      status: 'Moderate Drying',
      tone: 'amber',
      guidance:
        'Extended drying window expected for all-purpose and topping compounds. Maintain interior airflow and verify seam moisture before sanding.',
      estimatedCoatDryHours: '20–28 hrs',
    };
  }

  return {
    status: 'Optimal Curing',
    tone: 'emerald',
    guidance:
      'Ideal temperature and relative humidity for gypsum hanging, tape bedding, and Level-5 skim finishing with predictable cure times.',
    estimatedCoatDryHours: '12–16 hrs',
  };
}

export function buildOpenMeteoUrl(city: GtaCity): string {
  const coords = GTA_CITY_COORDS[city];
  const params = new URLSearchParams({
    latitude: String(coords.latitude),
    longitude: String(coords.longitude),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
    timezone: 'America/Toronto',
    forecast_days: '5',
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

export async function fetchGtaSiteWeather(city: GtaCity): Promise<SiteWeatherData> {
  const url = buildOpenMeteoUrl(city);
  const response = await axios.get(url, { timeout: 10000 });
  const data = response.data;

  const dailyTimes: string[] = Array.isArray(data?.daily?.time) ? data.daily.time : [];
  const daily = dailyTimes.map((dateStr, index) => ({
    date: dateStr,
    weatherCode: Number(data.daily.weather_code?.[index] ?? 0),
    tempMax: Number(data.daily.temperature_2m_max?.[index] ?? 0),
    tempMin: Number(data.daily.temperature_2m_min?.[index] ?? 0),
    precipitationProb: Number(data.daily.precipitation_probability_max?.[index] ?? 0),
    windMax: Number(data.daily.wind_speed_10m_max?.[index] ?? 0),
  }));

  return {
    city,
    latitude: Number(data.latitude ?? GTA_CITY_COORDS[city].latitude),
    longitude: Number(data.longitude ?? GTA_CITY_COORDS[city].longitude),
    fetchedAt: new Date().toISOString(),
    current: {
      temperatureC: Number(data.current?.temperature_2m ?? 0),
      apparentTempC: Number(data.current?.apparent_temperature ?? 0),
      humidityPct: Number(data.current?.relative_humidity_2m ?? 0),
      windSpeedKmh: Number(data.current?.wind_speed_10m ?? 0),
      precipitationMm: Number(data.current?.precipitation ?? 0),
      weatherCode: Number(data.current?.weather_code ?? 0),
    },
    daily,
  };
}
