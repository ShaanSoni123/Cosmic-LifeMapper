import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// NASA API proxy endpoint for planet names
app.get('/api/nasa/planets', async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch');
    
    // Query to get all planet names
    const query = "SELECT DISTINCT pl_name FROM ps WHERE pl_name IS NOT NULL ORDER BY pl_name";
    const nasaUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=csv`;
    
    console.log('Fetching planet names from NASA API...');
    
    const response = await fetch(nasaUrl, {
      headers: {
        'User-Agent': 'Cosmic-LifeMapper/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`NASA API responded with status: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    // Parse CSV and extract planet names
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      return res.json({ planets: [], count: 0 });
    }
    
    const planetNames = lines.slice(1)
      .map(line => line.trim())
      .filter(line => line && line !== 'null' && line !== '')
      .sort();

    console.log(`✨ Loaded ${planetNames.length} planet names`);
    
    res.json({
      planets: planetNames,
      count: planetNames.length
    });
    
  } catch (error) {
    console.error('NASA API proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data from NASA API',
      details: error.message 
    });
  }
});

// NASA API proxy endpoint for planet details
app.get('/api/nasa/planet/:name', async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch');
    const planetName = req.params.name;
    
    // SQL escape single quotes
    const safeName = planetName.replace(/'/g, "''");
    
    const query = `
      SELECT pl_name, pl_rade, pl_bmasse, pl_orbper, pl_eqt, 
             st_teff, st_age, st_mass, st_dens, disc_year, 
             pl_nespec, discoverymethod, disc_locale, disc_facility, 
             st_rad, st_lum, pl_dens, st_met, pl_ratror
      FROM ps 
      WHERE pl_name = '${safeName}'
      ORDER BY pl_name
      LIMIT 1
    `;

    const nasaUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=csv`;
    
    console.log(`Fetching details for planet: ${planetName}`);
    
    const response = await fetch(nasaUrl, {
      headers: {
        'User-Agent': 'Cosmic-LifeMapper/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`NASA API responded with status: ${response.status}`);
    }

    const csvText = await response.text();
    const lines = csvText.trim().split('\n');

    if (lines.length < 2) {
      return res.status(404).json({ error: 'Planet not found' });
    }

    const headers = lines[0].split(',');
    const values = lines[1].split(',');

    const planetData = {};
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      if (value && value !== 'null') {
        // Convert numeric fields
        if (['pl_rade', 'pl_bmasse', 'pl_orbper', 'pl_eqt', 'st_teff', 'st_age', 'st_mass', 'st_dens', 'st_rad', 'st_lum', 'pl_dens', 'st_met', 'pl_ratror', 'disc_year', 'pl_nespec'].includes(header)) {
          planetData[header] = parseFloat(value);
        } else {
          planetData[header] = value;
        }
      }
    });

    res.json(planetData);
    
  } catch (error) {
    console.error('Failed to fetch planet details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch planet details',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 NASA API proxy server running on http://localhost:${PORT}`);
  console.log(`🌌 Ready to fetch exoplanet data from NASA Archive`);
});