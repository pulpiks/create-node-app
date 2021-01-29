'use strict';

const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const chalk = require('chalk');
const commander = require('commander');
const dns = require('dns');
const envinfo = require('envinfo');
const execSync = require('child_process').execSync;
const hyperquest = require('hyperquest');
const prompts = require('prompts');
const os = require('os');
const semver = require('semver');
const spawn = require('cross-spawn');
const tmp = require('tmp');
const unpack = require('tar-pack').unpack;
const url = require('url');
const validateProjectName = require('validate-npm-package-name');
const inquirer = require('inquirer');
const setupQuestions = require('./settings/setupQuestions.js');
const packageJson = require('./package.json');

let userPrefs;

const fetchResponses = (options) => {
  return inquirer
    .prompt(setupQuestions)
    .catch(error => {
      process.exit(1)
      return new Error(error)
    })
}


function init() {
  const program = new commander.Command(packageJson.name) 
    .version(packageJson.version)
    .description('Please set up your project')
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action((options) => {
      const projectDir = options;
      try {
        fetchResponses(options).then((answers) => {
          const {teamName, projectName} = answers;

          if (typeof projectName === 'undefined') {
            console.error('Please specify the project directory:');
            console.log(
              `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
            );
            console.log();
            console.log('For example:');
            console.log(
              `  ${chalk.cyan(program.name())} ${chalk.green('my-node-server')}`
            );
            console.log();
            console.log(
              `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
            );
            process.exit(1);
          }

          // We first check the registry directly via the API, and if that fails, we try
          // the slower `npm view [package] version` command.
          //
          // This is important for users in environments where direct access to npm is
          // blocked by a firewall, and packages are provided exclusively via a private
          // registry.
          createApp(
            answers,
            projectDir,
            program.verbose,
            program.scriptsVersion,
            program.template,
            program.useNpm,
            program.usePnp
          );
        });
      } catch (e) {
        throw new Error(e);
      } 
    })
    .option('--verbose', 'print additional logs')
    .option('--info', 'print environment debug info')
    .option(
      '--template <path-to-template>',
      'specify a template for the created project'
    )
    .option('--use-npm')
    .option('--use-pnp')
    .allowUnknownOption()
    .on('--help', () => {
      console.log(
        `    Only ${chalk.green('<project-directory>')} is required.`
      );
      console.log();
      console.log(
        `    A custom ${chalk.cyan('--scripts-version')} can be one of:`
      );
      console.log(`      - a specific npm version: ${chalk.green('0.8.2')}`);
      console.log(`      - a specific npm tag: ${chalk.green('@next')}`);
      console.log(
        `      - a custom fork published on npm: ${chalk.green(
          'name of base nodejs project'
        )}`
      );
      console.log();
      console.log(
        `    If you have any problems, do not hesitate to file an issue:`
      );
      console.log(
        `      ${chalk.cyan(
          'https://gitlab.com/blueharvest/......'
        )}`
      );
      console.log();
    })
    .parse(process.argv);

  if (program.info) {
    console.log(chalk.bold('\nEnvironment Info:'));
    console.log(
      `\n  current version of ${packageJson.name}: ${packageJson.version}`
    );
    console.log(`  running from ${__dirname}`);
    return envinfo
      .run(
        {
          System: ['OS', 'CPU'],
          Binaries: ['Node', 'npm', 'Yarn'],
          Browsers: [
            'Chrome',
            'Edge',
            'Internet Explorer',
            'Firefox',
            'Safari',
          ],
          npmPackages: ['react'], // our nodejs project
        },
        {
          duplicates: true,
          showNotFound: true,
        }
      )
      .then(console.log);
  }
}


function createApp(userSettings, projectDir, verbose, version = '0.0.1', template, useNpm, usePnp) {
  const projectPath = `../${projectDir}`;
  const packageJsonPath = projectPath + '/' + 'package.json';
  if (fs.existsSync(projectPath)) {
    console.log('remove directory')
    fs.removeSync(projectPath);
  }
  const res = execSync(`git clone https://github.com/http-party/http-server.git ${projectPath}`)
  let packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, packageJsonPath)));
  const content = {
    ...packageJson,
    name: userSettings.projectName,
    author: userSettings.teamName || userSettings.author,
    contributors: [{
      "name": userSettings.author,
    }],
    description: "Node base project",
    version
  }
  fs.writeFileSync(packageJsonPath, JSON.stringify(content, null, 2));
}

module.exports = {
  init
};