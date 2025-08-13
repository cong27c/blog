const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 5, // Tối đa 5 lần/phút/IP
  message: 'Too many login attempts. Please try again later.',
});

// app.post('/login', loginLimiter, validateLogin, handleLogin);
