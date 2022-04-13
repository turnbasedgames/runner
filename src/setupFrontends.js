const express = require('express');
const {
  buildPath,
  userFrontendPath,
} = require('../config/paths');

// TODO: setup basic management view
// TODO: setup connection to dev backend
// TODO: in dev mode setup way to proxy frontend to backend server
// TODO: in user dev mode setup way to specify custom user frontend url that will be put in iframe
// this enables users of react js to be able to hot reload their applications
module.exports = {
  setupFrontends({ frontendEndUrl, tbgFrontendUrl }) {
    const setupFrontendService = (currentUrl, path, port) => {
      if (currentUrl) {
        return;
      }
      const app = express();
      app.use(express.static(path));
      const server = app.listen(port, () => {
        const url = `http://localhost:${server.address().port}`;
        console.log(`serving ${path} at ${url}`);
      });
    };

    setupFrontendService(frontendEndUrl, userFrontendPath, 3001);
    setupFrontendService(tbgFrontendUrl, buildPath, 3002);
  },
};
