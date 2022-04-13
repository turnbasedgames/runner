#!/usr/bin/env node
const { program } = require('commander');
const { setupFrontends } = require('../src/setupFrontends');
// TODO: setup dev environment option for a local dummy user frontend and backend
const { setupServer } = require('../src/setupServer');

program
  .addOption(new Option('-t', 'tbg-frontend-url <tbgFrontendUrl>').hideHelp())
  .option('-u, --frontend-url <frontendUrl>', 'if you are already serving your frontend in a dev environment (e.g. React), you can specify the url here');
program.parse();
const options = program.opts();
console.log(options);

setupServer();
setupFrontends();
