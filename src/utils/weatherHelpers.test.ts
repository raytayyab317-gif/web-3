import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildOpenMeteoUrl,
  computeDrywallCuringAdvisory,
  getWeatherLabel,
} from './weatherHelpers';

test('computeDrywallCuringAdvisory flags optimal, moderate, and climate-control conditions', () => {
  const optimal = computeDrywallCuringAdvisory(21, 45, 0);
  assert.equal(optimal.status, 'Optimal Curing');
  assert.equal(optimal.tone, 'emerald');

  const moderate = computeDrywallCuringAdvisory(17, 65, 0);
  assert.equal(moderate.status, 'Moderate Drying');
  assert.equal(moderate.tone, 'amber');

  const cold = computeDrywallCuringAdvisory(4, 55, 0);
  assert.equal(cold.status, 'Climate Control Required');
  assert.equal(cold.tone, 'rose');

  const humid = computeDrywallCuringAdvisory(20, 82, 2);
  assert.equal(humid.status, 'Climate Control Required');
  assert.equal(humid.tone, 'rose');
});

test('buildOpenMeteoUrl targets correct GTA coordinates and America/Toronto timezone', () => {
  const torontoUrl = buildOpenMeteoUrl('Toronto');
  assert.ok(torontoUrl.includes('latitude=43.6532'));
  assert.ok(torontoUrl.includes('longitude=-79.3832'));
  assert.ok(torontoUrl.includes('timezone=America%2FToronto'));
});

test('getWeatherLabel maps WMO weather codes to human descriptions', () => {
  assert.equal(getWeatherLabel(0), 'Clear Sky');
  assert.equal(getWeatherLabel(3), 'Overcast');
  assert.equal(getWeatherLabel(61), 'Rain');
  assert.equal(getWeatherLabel(71), 'Snow');
});
