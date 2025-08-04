const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const app = express();

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

app.get('/get-location', async (req, res) => {
  const cacheKey = req.ip; // Cache by user's IP
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData); // Serve from cache
  }

  try {
    const response = await axios.get('https://ipapi.co/json/');
    const data = {
      city: response.data.city,
      region: response.data.region
    };
    cache.set(cacheKey, data); // Save to cache
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Try again later" });
  }
});

app.listen(3000);