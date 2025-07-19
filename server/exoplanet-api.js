import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const PLANET_NAMES = [
  'Kepler-452 b', 'Kepler-186 f', 'Kepler-452 c', 'Kepler-22 c', 'Kepler-18 f', 'Kepler-22 b',
  'Kepler-1606 b', 'Kepler-62 e', 'Kepler-144 b', 'Kepler-20 f', 'Kepler-440 b', 'Kepler-438 b',
  'Kepler-138 d', 'Kepler-186 c', 'Kepler-145 b', 'Kepler-20 e', 'Kepler-62 d', 'Kepler-62 b',
  'Kepler-36 b', 'Kepler-10 c', 'Kepler-62 c', 'Kepler-11 f', 'Tau Ceti e',
  'K2-18 f', 'K2-18 e', 'K2-3 d', 'K2-3 c', 'K2-155 d', 'K2-3 b', 'K2-18 c', 'K2-18 b',
  'HD 40307 g', 'HD 85512 b', 'HD 97658 c', 'HD 219134 b', 'HD 97658 b',
  'Ross 128 c', 'Ross 128 b2', 'Ross 128 b',
  'Kapteyn b', 'Luyten b',
  'LHS 1140 d', 'LHS 1140 c', 'LHS 1140 b',
  'Wolf 1061 e', 'Wolf 1061 b', 'Wolf 1061 c', 'Wolf 1061 d',
  'Proxima Cen b', 'TRAPPIST-1 e',
  'GJ 273 b', 'GJ 273 c', 'GJ 273 d',
  'GJ 667 C f', 'GJ 667 C d', 'GJ 667 C e2', 'GJ 667 C e', 'GJ 667 C b', 'GJ 667 C c',
  'Gliese 832 c', 'Gliese 832 b'
];

router.get('/api/exoplanets', async (_req, res) => {
  try {
    const nasaUrl = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI' +
      '?table=exoplanets&select=pl_name,pl_orbper,pl_eqt,st_spectype,sy_dist&format=json';

    const response = await fetch(nasaUrl);
    const data = await response.json();

    const filteredData = data.filter((planet: any) => PLANET_NAMES.includes(planet.pl_name));

    const enhancedData = filteredData.map((planet: any) => ({
      name: planet.pl_name,
      orbital_period_days: planet.pl_orbper ?? 'Unknown',
      temperature_K: planet.pl_eqt ?? 'Unknown',
      distance_ly: planet.sy_dist ? (planet.sy_dist * 3.26156).toFixed(2) : 'Unknown',
      star_type: planet.st_spectype ?? 'Unknown',
    }));

    res.status(200).json(enhancedData);
  } catch (error) {
    console.error('Error fetching exoplanet data:', error);
    res.status(500).json({ error: 'Failed to fetch exoplanet data' });
  }
});

export default router;
