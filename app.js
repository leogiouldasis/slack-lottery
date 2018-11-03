const express = require('express');

require('dotenv').config();
const configuration = require('./config');
const logger = require('./app/helpers/logger');
const routes = require('./app/http/routes');

const app = express();

app.use('/api', routes.api);

// Start Server
app.listen(configuration.port, () => {
  logger.info(`[SlACK LOTTERY][SERVER] is running on port ${configuration.port}`);
});
