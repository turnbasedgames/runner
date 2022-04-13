// TODO: setup socket server
const express = require('express');
const {
  userBackend,
} = require('../config/paths');

// TODO: use backendModule to do calculations
// TODO: hot reload based on backendModule changes
// TODO: game state management server
module.exports = {
  setupServer(isEmptyBackend) {
    let backendModule = {
      onRoomStart: () => ({}),
      onPlayerJoin: () => null,
      onPlayerMove: () => null,
      onPlayerQuit: () => null,
    };
    if (!isEmptyBackend) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
      backendModule = require(userBackend);
    }
    console.log('loaded backend module', backendModule);
  },
};