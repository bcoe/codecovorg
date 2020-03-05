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

const { describe, it } = require('mocha');
const { expect } = require('chai');
const { getUploadToken } = require('./');

const nock = require('nock');
nock.disableNetConnect();

describe('codecovorg', () => {
  describe('getUploadToken', () => {
    it('fetches upload token if API key and slug are provided', async () => {
      const req = nock('https://codecov.io')
        .get('/api/pub/gh/fake/fake/settings')
        .reply(200, {
          repo: {
            upload_token: 'deadbeef'
          }
        });
      const token = await getUploadToken({
        options: {
          slug: 'fake/fake',
          'api-key': 'abc123'
        }
      });
      expect(token).to.equal('deadbeef');
      req.done();
    });

    it('returns null if no slug is set', async () => {
      const token = await getUploadToken({
        options: {
          'api-key': 'abc123'
        }
      });
      expect(token).to.equal(null);
    });
  });
});
