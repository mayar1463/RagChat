require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const PROTOCOL = process.env.PROTOCOL || 'http';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '5001';
const API_BASE_PATH = process.env.API_BASE_PATH || '/api';
const API_VERSION = process.env.API_VERSION || 'v1';

// Correct path to swagger.yaml (one level up from src)
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

swaggerDocument.servers = [
  {
    url: `${PROTOCOL}://${HOST}:${PORT}${API_BASE_PATH}/${API_VERSION}`,
  },
];

module.exports = {
  swaggerUi,
  swaggerSpec: swaggerDocument,
};
