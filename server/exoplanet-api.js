// server/exoplanet-api.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3002;

app.use(cors());

// Load local planet list
const exoplanets = JSON.parse(
  fs.readFileSync(path.resolve('server', 'exoplanets.json'), 'utf-8')
);

// Function to fetch NASA TAP data
async function fetchExoplanetData(name) {
  const baseUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
  const query = `
    SELECT pl_name, pl_orbper, pl_eqt, st_spectype, disc_year
    FROM ps
    WHERE pl_name LIKE '${name.replace(/'/g, "''")}'
  `;

  const url = `${baseUrl}?query=${encodeURIComponent(query)}&format=json`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    return json[0] || null;
  } catch (err) {
    console.error(`❌ Error fetching for ${name}:`, err.message);
    return null;
  }
}

// Estimate fallback data if NASA doesn't find a match
function fallbackData(planet) {
  return {
    name: planet.name,
    orbital_period: planet.orbital_period ?? Math.random() * 500,
    temperature: planet.temperature ?? 300,
    star_type: planet.star_type ?? 'G',
    discovery_year: planet.discovery_year ?? 2015,
    is_fallback: true
  };
}

app.get('/exoplanets', async (req, res) => {
  const results = [];

  for (const planet of exoplanets) {
    const data = await fetchExoplanetData(planet.name);

    if (data) {
      results.push({
        name: data.pl_name,
        orbital_period: parseFloat(data.pl_orbper),
        temperature: parseFloat(data.pl_eqt),
        star_type: data.st_spectype,
        discovery_year: parseInt(data.disc_year),
        is_fallback: false
      });
      console.log(`✅ Found: ${planet.name}`);
    } else {
      const fallback = fallbackData(planet);
      results.push(fallback);
      console.warn(`⚠️ Planet ${planet.name} not found in NASA data, generating fallback`);
    }
  }

  res.json(results);
});

app.listen(port, () => {
  console.log(`🚀 Exoplanet API running on http://localhost:${port}`);
});
