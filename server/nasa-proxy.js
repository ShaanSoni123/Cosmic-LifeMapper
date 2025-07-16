import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// NASA API proxy endpoint
app.get('/nasa-proxy.php', async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch');
    
    // Get query parameters
    const { table = 'exoplanets', select = 'pl_name', format = 'json' } = req.query;
    
    // Build NASA API URL
    const nasaUrl = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+${select}+from+${table}&format=${format}`;
    
    console.log('Proxying request to NASA API:', nasaUrl);
    
    // Make request to NASA API
    const response = await fetch(nasaUrl);
    
    if (!response.ok) {
      throw new Error(`NASA API responded with status: ${response.status}`);
    }
    
    const data = await response.text();
    
    // Set appropriate content type
    res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/plain');
    res.send(data);
    
  } catch (error) {
    console.error('NASA API proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data from NASA API',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`NASA API proxy server running on http://localhost:${PORT}`);
});