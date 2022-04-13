const {
  userBackend,
} = require('../config/paths');

// eslint-disable-next-line import/no-dynamic-require
const backendModule = require(userBackend);

// TODO: use backendModule to do calculations
// TODO: hot reload based on backendModule changes
console.log(backendModule);

// TODO: game state management server
