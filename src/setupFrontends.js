const express = require('express');
const cors = require('cors');
const {
  buildPath,
  userFrontendPath,
} = require('../config/paths');

module.exports = {
  setupFrontends({ frontendUrl, tbgFrontendUrl }) {
    const setupFrontendService = (currentUrl, path, port) => {
      if (currentUrl) {
        return;
      }
      const app = express();
      app.use(cors());
      app.use(express.static(path));
      const server = app.listen(port, () => {
        const url = `http://localhost:${server.address().port}`;
        console.log(`serving ${path} at ${url}`);
      });
    };

    setupFrontendService(tbgFrontendUrl, buildPath, 3100);
    setupFrontendService(frontendUrl, userFrontendPath, 3101);
  },
};
