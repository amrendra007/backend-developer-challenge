const express = require('express');

const { getDisbursementReport } = require('./controller/report');

const authError = (err, req, res, next) => {
  res.status(err.status || 401).json({ success: false, error: err.message });
};

const router = app => {
  const apiRoutes = express.Router();

  apiRoutes.post('/report', getDisbursementReport, authError);

  app.use('/api', apiRoutes);
};

module.exports = router;
