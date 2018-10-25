const express = require('express');
const bodyParser = require('body-parser');
const dataset = require('./data');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const Redis = require('redis');

const app = express();
const redisClient = Redis.createClient({
  enable_offline_queue: false
});

app.use(bodyParser.urlencoded({
  extended: false
}));

// Rate limiter for the login route
const rateLimiterLogin = new RateLimiterRedis({
  storeClient: redisClient,
  points: 5,
  duration: 300,
  blockDuration: 600,
  keyPrefix: 'rlLogin'
});

const rateLimitMW = (req, res, next) => {
  rateLimiterLogin.consume(req.connection.remoteAddress)
  .then(() => next())
  .catch(() => res.status(429).json({
    message: 'Too many login attempts'
  }));
}

app.post('/login', rateLimitMW, (req, res) => {
  const {
    user,
    password
  } = req.body;

  if (user === 'johndoe' && password === 'packt') {
    return res.json({
      token: parseInt(Math.random() * 1000000000000),
      message: 'You are now logged in!'
    });
  }

  return res.status(403).json({
    message: 'Unauthorized login attempt'
  });
});

// Rate limiter for users route
const rateLimiterApi = new RateLimiterRedis({
  storeClient: redisClient,
  points: 100,
  duration: 60,
  keyPrefix: 'rlApi'
});

const rateLimitApiMW = (req, res, next) => {
  rateLimiterApi.consume(req.connection.remoteAddress)
  .then(() => next())
  .catch(() => res.status(429).json({
    message: 'Too many API requests'
  }));
}

app.get('/users', rateLimitApiMW, (req, res) => {
  res.json(dataset);
});

app.listen(3000, () => console.log("App running on Port 3000"));