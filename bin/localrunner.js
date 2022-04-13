#!/usr/bin/env node
const { program, Option } = require('commander');
const { stringIsAValidUrl } = require('../src/util');
const { setupFrontends } = require('../src/setupFrontends');
// TODO: setup dev environment option for a local dummy user frontend and backend
const { setupServer } = require('../src/setupServer');

program
  .addOption(new Option('-t, --tbg-frontend-url <tbgFrontendUrl>').hideHelp())
  .addOption(new Option('-d, --dummy-backend').hideHelp())
  // TODO: tbg frontend needs to query for this value
  .option('-f, --frontend-url <frontendUrl>', 'if you are already serving your frontend in a dev environment (e.g. React), you can specify the url here');
program.parse();
const options = program.opts();

console.log(options);

// validate options
if (options.tbgFrontendUrl) {
  if (!stringIsAValidUrl(options.tbgFrontendUrl)) {
    throw new Error(`Invalid '--tbg-frontend-url' option provided: ${options.tbgFrontendUrl}`);
  }
}
if (options.frontendEndUrl) {
  if (!stringIsAValidUrl(options.frontendEndUrl)) {
    throw new Error(`Invalid '--frontend-url' option provided: ${options.frontendEndUrl}`);
  }
}

setupFrontends();
setupServer(options.dummyBackend);
