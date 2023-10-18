// server.js
import express from 'express';
import https from 'https';
import fs from 'fs';
import fetch from 'node-fetch';

const app = express();

app.use((req, res, next) => {
  console.log('Setting CORS headers');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.use(express.static('public'));

app.get('/distance', async (req, res) => {
  const { origins, destinations, key } = req.query;
  const url = `https://api-v2.distancematrix.ai/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${key}`;
  try {
    console.log('Fetching data from DistanceMatrix API');
    const response = await fetch(url);
    const data = await response.json();
    console.log('Sending response:', data);
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error.message);
  }
});

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/codercastrov.online/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/codercastrov.online/cert.pem')
};

const PORT = process.env.PORT || 3000;  // Раскомментируйте эту строку
https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});

