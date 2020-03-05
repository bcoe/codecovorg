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
const detectProvider = require('codecov/lib/detect');
const fetch = require('node-fetch');

// Returns a per-repository upload token, in exchange for a codecov API key:
async function getUploadToken (args) {
  const codecovEndpoint = getCodecovEndpoint(args);
  const provider = detectProvider();
  const slug = args.options.slug || provider.slug;
  const apiKey = args.options['api-key'] ||
    process.env.codecov_api_key ||
    process.env.CODECOV_API_KEY;
  if (!slug || !apiKey) {
    if (!slug) console.warn('no repository slug was provided');
    return null;
  } else {
    try {
      const body = await fetch(`${codecovEndpoint}/api/pub/gh/${slug}/settings`, {
        headers: {
          Authorization: apiKey
        }
      }).then(res => res.json());
      return body.repo.upload_token;
    } catch (err) {
      console.error(`failed to fetch upload token, err = ${err.message}`);
    }
  }
}

function getCodecovEndpoint (args) {
  return args.options.url ||
    process.env.codecov_url ||
    process.env.CODECOV_URL ||
    'https://codecov.io';
}

module.exports = {
  getUploadToken
};
