import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 8000;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// NASA API proxy endpoint with API key
app.post('/nasa-proxy.php', async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch');
    
    // Get query and format from POST body
    const { query, format = 'csv' } = req.body;
    
    console.log('=== NASA API Request ===');
    console.log('Query:', query);
    console.log('Format:', format);
    console.log('API Key:', process.env.VITE_NASA_API_KEY ? 'Present' : 'Missing');
    
    if (!query) {
      console.error('No query provided');
      return res.status(400).json({ error: 'Query parameter is required.' });
    }
    
    // Build NASA API URL with API key
    const nasaUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
    const postData = new URLSearchParams({
      query: query,
      format: format
    });

    // Add API key if available
    if (process.env.VITE_NASA_API_KEY) {
      postData.append('api_key', process.env.VITE_NASA_API_KEY);
    }
    
    console.log('Sending request to NASA API...');
    console.log('URL:', nasaUrl);
    console.log('Body:', postData.toString());
    
    // Make request to NASA API with proper headers and API key
    const response = await fetch(nasaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Cosmic-LifeMapper/1.0 (Node.js Proxy)',
        'Accept': 'text/csv,text/plain,*/*',
        ...(process.env.VITE_NASA_API_KEY && { 'X-API-Key': process.env.VITE_NASA_API_KEY })
      },
      body: postData.toString(),
      timeout: 30000
    });
    
    console.log('NASA API Response Status:', response.status);
    console.log('NASA API Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('NASA API Error Response:', errorText);
      
      // Handle rate limiting or authentication errors
      if (response.status === 429) {
        return res.status(429).json({ 
          error: 'NASA API rate limit exceeded. Please try again later.',
          details: errorText 
        });
      }
      
      if (response.status === 401 || response.status === 403) {
        return res.status(401).json({ 
          error: 'NASA API authentication failed. Please check API key.',
          details: errorText 
        });
      }
      
      throw new Error(`NASA API responded with status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.text();
    console.log('NASA API Response Length:', data.length);
    console.log('NASA API Response Preview:', data.substring(0, 200));
    
    // Check if the response contains an error
    if (data.includes('ERROR') || data.includes('Exception') || data.includes('ADQL')) {
      console.error('NASA API returned error:', data.substring(0, 500));
      return res.status(400).json({ 
        error: 'NASA API returned an error: ' + data.substring(0, 200) 
      });
    }
    
    // Check if we got valid CSV data
    if (format === 'csv' && !data.includes('\n')) {
      console.error('Invalid CSV response from NASA API');
      return res.status(400).json({ 
        error: 'Invalid response format from NASA API' 
      });
    }
    
    // Set appropriate content type and send response
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.send(data);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json({ data: data });
    }
    
    console.log('✅ Successfully proxied NASA API request');
    
  } catch (error) {
    console.error('=== NASA API Proxy Error ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Failed to fetch data from NASA API',
      details: error.message 
    });
  }
});

// Enhanced test endpoint with API key
app.get('/test-nasa', async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch');
    
    const testQuery = 'SELECT DISTINCT pl_name FROM ps WHERE pl_name IS NOT NULL LIMIT 10';
    const nasaUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';
    const postData = new URLSearchParams({
      query: testQuery,
      format: 'csv'
    });

    // Add API key if available
    if (process.env.VITE_NASA_API_KEY) {
      postData.append('api_key', process.env.VITE_NASA_API_KEY);
    }
    
    console.log('Testing NASA API connection with API key...');
    
    const response = await fetch(nasaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Cosmic-LifeMapper/1.0 (Test)',
        'Accept': 'text/csv',
        ...(process.env.VITE_NASA_API_KEY && { 'X-API-Key': process.env.VITE_NASA_API_KEY })
      },
      body: postData.toString(),
      timeout: 15000
    });
    
    const data = await response.text();
    
    res.json({
      status: response.ok ? 'SUCCESS' : 'ERROR',
      statusCode: response.status,
      dataLength: data.length,
      preview: data.substring(0, 300),
      headers: Object.fromEntries(response.headers.entries()),
      apiKeyPresent: !!process.env.VITE_NASA_API_KEY,
      samplePlanets: data.split('\n').slice(1, 6).filter(line => line.trim())
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      apiKeyPresent: !!process.env.VITE_NASA_API_KEY
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT,
    apiKeyConfigured: !!process.env.VITE_NASA_API_KEY
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'NASA Exoplanet Archive Proxy Server',
    apiKeyConfigured: !!process.env.VITE_NASA_API_KEY,
    endpoints: {
      'POST /nasa-proxy.php': 'Proxy requests to NASA API',
      'GET /test-nasa': 'Test NASA API connectivity',
      'GET /health': 'Health check'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NASA API proxy server running on http://localhost:${PORT}`);
  console.log('📡 Ready to proxy requests to NASA Exoplanet Archive');
  console.log('🔑 API Key configured:', !!process.env.VITE_NASA_API_KEY);
  console.log('🔗 Test connectivity: http://localhost:' + PORT + '/test-nasa');
});