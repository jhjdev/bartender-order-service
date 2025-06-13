import { Router } from 'express';

const router = Router();

// Success endpoint
router.get('/success', (req, res) => {
  res.json({ message: 'Success!' });
});

// Error endpoints
router.get('/400', (req, res) => {
  res.status(400).json({ message: 'Bad Request' });
});

router.get('/401', (req, res) => {
  res.status(401).json({ message: 'Unauthorized' });
});

router.get('/403', (req, res) => {
  res.status(403).json({ message: 'Forbidden' });
});

router.get('/404', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

router.get('/409', (req, res) => {
  res.status(409).json({ message: 'Conflict' });
});

router.get('/422', (req, res) => {
  res.status(422).json({ message: 'Unprocessable Entity' });
});

router.get('/429', (req, res) => {
  res.status(429).json({
    message: 'Too Many Requests',
    code: 'RATE_LIMIT_EXCEEDED',
    details: {
      retryAfter: 900,
    },
  });
});

router.get('/503', (req, res) => {
  res.status(503).json({ message: 'Service Unavailable' });
});

export default router;
