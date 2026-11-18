import { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  CloudRain,
  Droplets,
  RefreshCw,
  Thermometer,
  Wind,
} from 'lucide-react';
import { GTA_CITIES, GtaCity, SiteWeatherData } from '../types/constructex';
import {
  GTA_CITY_COORDS,
  computeDrywallCuringAdvisory,
  fetchGtaSiteWeather,
  getWeatherLabel,
} from '../utils/weatherHelpers';

export default function WeatherView() {
  const [selectedCity, setSelectedCity] = useState<GtaCity>('Toronto');
  const [weather, setWeather] = useState<SiteWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async (city: GtaCity) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchGtaSiteWeather(city);
      setWeather(result);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to reach Open-Meteo Forecast API.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWeather(selectedCity);
  }, [selectedCity, loadWeather]);

  const advisory = weather
    ? computeDrywallCuringAdvisory(
        weather.current.temperatureC,
        weather.current.humidityPct,
        weather.current.precipitationMm
      )
    : null;

  const advisoryToneClasses =
    advisory?.tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
      : advisory?.tone === 'amber'
        ? 'border-amber-200 bg-amber-50 text-amber-950'
        : 'border-rose-200 bg-rose-50 text-rose-950';

  return (
    <section className="pt-24 pb-20 px-6 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#7C3AED] mb-2">
              Live Site Conditions · Greater Toronto Area
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
              GTA Site Conditions & Drywall Curing Forecast
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">
              Real-time meteorological readings from Open-Meteo to plan joint compound drying windows and site climate control across the Greater Toronto Area.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadWeather(selectedCity)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Live Data
          </button>
        </div>

        {/* GTA Municipality Selector */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div
            role="group"
            aria-label="Select GTA Municipality"
            className="flex flex-wrap items-center gap-1.5"
          >
            {GTA_CITIES.map((city) => {
              const isSelected = selectedCity === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  aria-pressed={isSelected}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-500">
            {GTA_CITY_COORDS[selectedCity].regionLabel}
            <span className="mx-1.5 text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="font-mono tabular-nums">
              {GTA_CITY_COORDS[selectedCity].latitude.toFixed(2)}°N,{' '}
              {Math.abs(GTA_CITY_COORDS[selectedCity].longitude).toFixed(2)}°W
            </span>
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6" aria-busy="true" aria-label="Loading live site weather">
            <div className="h-28 rounded-xl bg-white border border-slate-200 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-xl bg-white border border-slate-200 animate-pulse"
                />
              ))}
            </div>
            <div className="h-64 rounded-xl bg-white border border-slate-200 animate-pulse" />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div
            role="alert"
            className="bg-white border border-rose-200 rounded-xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-base font-bold text-slate-900">
                  Unable to retrieve live weather data
                </h2>
                <p className="text-sm text-slate-600 mt-1">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void loadWeather(selectedCity)}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              Retry Request
            </button>
          </div>
        )}

        {/* Live Data State */}
        {!loading && !error && weather && advisory && (
          <>
            {/* Computed Drywall Curing Advisory */}
            <article className={`rounded-xl border p-6 ${advisoryToneClasses}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold opacity-80">
                    {weather.city} Site Curing Advisory · {getWeatherLabel(weather.current.weatherCode)}
                  </p>
                  <h2 className="font-display text-xl font-bold mt-1">
                    {advisory.status}
                  </h2>
                  <p className="text-sm mt-1.5 opacity-90 max-w-3xl">
                    {advisory.guidance}
                  </p>
                </div>
                <div className="md:text-right shrink-0">
                  <p className="text-xs opacity-75">Est. Compound Dry Window</p>
                  <p className="font-mono text-lg font-semibold tabular-nums mt-0.5">
                    {advisory.estimatedCoatDryHours}
                  </p>
                </div>
              </div>
            </article>

            {/* 4 Live Current Readings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <article className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold">Ambient Temperature</span>
                  <Thermometer className="w-4 h-4 text-[#7C3AED]" />
                </div>
                <p className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
                  {weather.current.temperatureC.toFixed(1)}°C
                </p>
                <p className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
                  Feels like {weather.current.apparentTempC.toFixed(1)}°C
                </p>
              </article>

              <article className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold">Relative Humidity</span>
                  <Droplets className="w-4 h-4 text-sky-600" />
                </div>
                <p className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
                  {weather.current.humidityPct}%
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Target Level-5 range: 40%–60%
                </p>
              </article>

              <article className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold">Wind Speed</span>
                  <Wind className="w-4 h-4 text-slate-600" />
                </div>
                <p className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
                  {weather.current.windSpeedKmh.toFixed(1)}
                  <span className="text-sm font-normal text-slate-500 ml-1">km/h</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Exterior material offload factor
                </p>
              </article>

              <article className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold">Current Precipitation</span>
                  <CloudRain className="w-4 h-4 text-slate-600" />
                </div>
                <p className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
                  {weather.current.precipitationMm.toFixed(1)}
                  <span className="text-sm font-normal text-slate-500 ml-1">mm</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {getWeatherLabel(weather.current.weatherCode)}
                </p>
              </article>
            </div>

            {/* 5-Day Forecast Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  5-Day {weather.city} Site Outlook
                </h2>
                <p className="text-xs text-slate-500 font-mono tabular-nums">
                  Open-Meteo Live Forecast · Updated {new Date(weather.fetchedAt).toLocaleTimeString()}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-6">Date</th>
                      <th className="py-3 px-4">Condition</th>
                      <th className="py-3 px-4 text-right">High / Low</th>
                      <th className="py-3 px-4 text-right">Precip Prob</th>
                      <th className="py-3 px-4 text-right">Max Wind</th>
                      <th className="py-3 px-6">Site Scheduling Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {weather.daily.map((day) => {
                      const dayAdvisory = computeDrywallCuringAdvisory(
                        day.tempMax,
                        day.precipitationProb > 50 ? 76 : 52,
                        day.precipitationProb > 60 ? 2 : 0
                      );
                      return (
                        <tr key={day.date} className="hover:bg-slate-50/60">
                          <td className="py-3.5 px-6 font-mono text-xs font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                            {day.date}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                            {getWeatherLabel(day.weatherCode)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-900 tabular-nums whitespace-nowrap">
                            {day.tempMax.toFixed(1)}° / {day.tempMin.toFixed(1)}°C
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                            {day.precipitationProb}%
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-700 tabular-nums whitespace-nowrap">
                            {day.windMax.toFixed(0)} km/h
                          </td>
                          <td className="py-3.5 px-6 text-xs font-medium text-slate-600">
                            {dayAdvisory.status} · {dayAdvisory.estimatedCoatDryHours}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
