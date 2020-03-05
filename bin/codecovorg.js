#!/usr/bin/env node
// Copyright 2020 Benjamin Coe
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const codecov = require('codecov/lib/codecov');
const { getUploadToken } = require('../');
const argv = require('yargs')
  .usage('$0 [opts]')
  .option('api-key', {
    alias: 'a',
    type: 'string',
    description: 'API key used to dynamically generate repository tokens'
  })
  .option('token', {
    alias: 't',
    type: 'string',
    description: 'Private repository token. Not required for public repos on Travis, CircleCI and AppVeyor'
  })
  .option('file', {
    alias: 'f',
    type: 'string',
    normalize: true,
    description: 'Target a specific file for uploading and disabling automatic detection of coverage files.'
  })
  .option('env', {
    alias: 'e',
    type: 'string',
    description: 'Store environment variables to help distinguish CI builds. Example: http://bit.ly/1ElohCu'
  })
  .option('root', {
    alias: 'p',
    type: 'string',
    normalize: true,
    description: 'Project root, if not current directory'
  })
  .option('gcov-root', {
    type: 'string',
    normalize: true,
    description: 'Project root directory when preparing gcov'
  })
  .option('gcov-glob', {
    type: 'string',
    description: 'Paths to ignore during gcov gathering'
  })
  .option('gcov-exec', {
    type: 'string',
    description: "gcov executable to run. Defaults to 'gcov'"
  })
  .option('gcov-args', {
    type: 'string',
    description: 'extra arguments to pass to gcov'
  })
  .option('disable', {
    alias: 'X',
    type: 'string',
    description: 'Disable features. Accepting `search` to disable crawling through directories, `detect` to disable detecting CI provider, `gcov` disable gcov commands'
  })
  .option('commit', {
    alias: 'c',
    type: 'string',
    description: 'Commit sha, set automatically'
  })
  .option('clear', {
    alias: 'C',
    type: 'boolean',
    description: 'Remove all discovered reports after uploading'
  })
  .option('branch', {
    alias: 'b',
    type: 'string',
    description: 'Branch name'
  })
  .option('build', {
    alias: 'B',
    type: 'string',
    description: 'Specify a custom build number to distinguish ci jobs, provided automatically for supported ci companies'
  })
  .option('slug', {
    alias: 'r',
    type: 'string',
    default: process.env.GITHUB_REPOSITORY,
    description: 'Specify repository slug for Enterprise ex. owner/repo'
  })
  .option('url', {
    alias: 'u',
    type: 'string',
    description: 'Your Codecov endpoint'
  })
  .option('flags', {
    alias: 'F',
    type: 'string',
    description: 'Codecov Flags'
  })
  .option('dump', {
    type: 'boolean',
    description: 'Dump collected data and do not send to Codecov'
  })
  .option('pipe', {
    alias: 'l',
    type: 'boolean',
    description: 'Listen to stdin for coverage data'
  })
  .option('yml', {
    alias: 'y',
    type: 'string',
    description: 'Configuration file Used to specify the location of the .codecov.yml config file. Defaults to codecov.yml and .codecov.yml'
  })
  .epilog('wraps codecov, using API to generate repository tokens for uploading')
  .argv;

// Match the format of the argv parser used by codecov:
const args = {
  options: argv
};

if (args.options.pipe) {
  process.stdin.setEncoding('utf8');
  args.options.pipe = [];

  process.stdin.on('data', (report) => {
    args.options.pipe.push(report);
  });

  process.stdin.on('end', async () => {
    const token = await getUploadToken(args);
    if (token) args.options.token = token;
    codecov.upload(args);
  });
} else {
  upload().catch((err) => {
    console.error(err.message);
  });
}

async function upload () {
  const token = await getUploadToken(args);
  if (token) args.options.token = token;
  codecov.upload(args);
}
