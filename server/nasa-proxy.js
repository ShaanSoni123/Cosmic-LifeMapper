import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// NASA API proxy endpoint - matches the PHP endpoint path
app.post('/nasa-proxy.php', async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch');
    
    // Get query and format from POST body (matching PHP implementation)
    const { query, format = 'csv' } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required.' });
    }
    
    console.log('NASA API Query:', query);
    console.log('Format:', format);
    
    // Build NASA API URL
    const nasaUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
    const postData = new URLSearchParams({
      query: query,
      format: format
    });
    
    console.log('Proxying request to NASA API:', nasaUrl);
    
    // Make request to NASA API
    const response = await fetch(nasaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Cosmic-LifeMapper/1.0 (Node.js Proxy)'
      },
      body: postData,
      timeout: 30000
    });
    
    if (!response.ok) {
      throw new Error(`NASA API responded with status: ${response.status}`);
    }
    
    const data = await response.text();
    
    // Check if the response contains an error
    if (data.includes('ERROR') || data.includes('Exception')) {
      console.error('NASA API Error:', data.substring(0, 200));
      return res.status(400).json({ error: 'NASA API returned an error: ' + data.substring(0, 200) });
    }
    
    // Set appropriate content type
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.send(data);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json({ data: data });
    }
    
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

// Start server
app.listen(PORT, () => {
  console.log(`NASA API proxy server running on http://localhost:${PORT}`);
  console.log('NASA Archive backend is ready!');
});