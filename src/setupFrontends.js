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
  setupFrontends() {
    const frontendApp = express();
    const userFrontendApp = express();

    userFrontendApp.use(express.static(userFrontendPath));
    frontendApp.use(express.static(buildPath));

    const userFrontendServer = userFrontendApp.listen(3001, () => {
      const frontendUrl = `http://localhost:${userFrontendServer.address().port}`;
      console.log(`user frontend path ${userFrontendPath}`);
      console.log(`serving your frontend at ${frontendUrl}`);
    });

    const frontendServer = frontendApp.listen(3002, () => {
      const frontendUrl = `http://localhost:${frontendServer.address().port}`;
      console.log(`user frontend path ${buildPath}`);
      console.log(`local runner running at ${frontendUrl}`);
    });
  },
};
