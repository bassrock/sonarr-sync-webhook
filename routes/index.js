const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.send('Sonarr Sync Webhook');
});

module.exports = router;
