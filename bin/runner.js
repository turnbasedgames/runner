#!/usr/bin/env node
const { program, Option } = require('commander');
const chalk = require('chalk');
const open = require('open');
const { stringIsAValidUrl, clearConsole } = require('../src/util');
const { setupFrontends } = require('../src/setupFrontends');
// TODO: MAIN-83 setup dev environment option for a local dummy user frontend and backend
// TODO: MAIN-84 handle when ports are taken in elegant way
// (react-scripts start prompts user with Y/n question to auto choose available port)
const { setupServer } = require('../src/setupServer');

const portForUserFrontend = 3000;
const apiPort = 3100;
const portForRunner = apiPort + 1;
const runnerUrl = `http://localhost:${portForRunner}`;

program
  .addOption(new Option('-t, --tbg-frontend-url <tbgFrontendUrl>').hideHelp())
  .addOption(new Option('-e, --empty-backend').hideHelp())
  // TODO: MAIN-85 tbg frontend needs to query for this value
  // this enables users of react js to be able to hot reload their frontend used by runner
  // if this is not enabled then we serve the files in the user's project "frontend/bulid"
  .option('-f, --frontend-url <frontendUrl>', 'if you are already serving your frontend in a dev environment (e.g. React), you can specify the url here')
  .option('-d, --debug', 'print debug logs to stdout') // TODO: MAIN-86 we need to use a logger instead of console.log and add debug log outputs everywhere
  .option('-D, --disable-open', 'Disable opening the runner automatically. User must navigate to url of runner');

program.parse();
const options = program.opts();

clearConsole();
console.log(chalk.gray('Starting runner with your game...\n'));
console.log('running with options:', options);

// validate options
if (options.tbgFrontendUrl) {
  if (!stringIsAValidUrl(options.tbgFrontendUrl)) {
    throw new Error(`Invalid '--tbg-frontend-url' option provided: ${options.tbgFrontendUrl}`);
  }
}
if (options.frontendUrl) {
  if (!stringIsAValidUrl(options.frontendUrl)) {
    throw new Error(`Invalid '--frontend-url' option provided: ${options.frontendUrl}`);
  }
}

const cleanupServerFunc = setupServer({ isEmptyBackend: options.emptyBackend, apiPort });
const cleanupFrotnendsFunc = setupFrontends({
  frontendUrl: options.frontendUrl,
  tbgFrontendUrl: options.tbgFrontendUrl,
  portForRunner,
  portForUserFrontend,
});

console.log(`${chalk.green('\nYou can now view the runner in the browser at:')} \n${chalk.green.bold(runnerUrl)}`);

if (!options.disableOpen) {
  open(runnerUrl);
}

['SIGINT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => {
    cleanupServerFunc();
    cleanupFrotnendsFunc();
    process.exit();
  });
});
